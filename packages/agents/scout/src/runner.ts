import { createRequire } from "module";
const require = createRequire(import.meta.url);
try { require("dotenv").config(); } catch { /* dotenv optional */ }

import { createServiceClient } from "../../../shared/src/db/client.ts";
import { fetchRssFeed } from "./rss.js";
import { discoverNewFeedUrl } from "./recovery.js";

export interface SourceConfig {
  name: string;
  url: string;
  trust_level: "official" | "media" | "blog";
}

const MAX_FAILURES_BEFORE_RECOVERY = 3;
const MAX_FAILURES_BEFORE_BROKEN   = 10;

/**
 * Normalisiert eine URL vor dem Datenbankvergleich:
 * - Query-Parameter entfernen (z.B. ?wt_mc=rss.red... von Heise)
 * - Trailing-Slash vereinheitlichen
 * - Fragment (#...) entfernen
 */
function normalizeUrl(raw: string): string {
  try {
    const u = new URL(raw);
    u.search = "";
    u.hash = "";
    if (u.pathname.endsWith("/") && u.pathname.length > 1) {
      u.pathname = u.pathname.slice(0, -1);
    }
    return u.toString();
  } catch {
    return raw;
  }
}

export async function runScout(industryId: number, sources: SourceConfig[], label: string) {
  const DRY_RUN = process.env["DRY_RUN"] === "true";
  console.log(`[Scout:${label}] Starting${DRY_RUN ? " (dry run)" : ""}…`);

  const supabase = DRY_RUN ? null : createServiceClient();
  let totalNew = 0;
  let totalSkipped = 0;

  for (const source of sources) {
    console.log(`\n[Scout:${label}] Fetching: ${source.name}`);
    try {
      const items = await fetchRssFeed(source.url);
      console.log(`[Scout:${label}]   ${items.length} items in feed`);

      if (DRY_RUN) {
        items.slice(0, 3).forEach(i => console.log(`[Scout:${label}]   • ${i.title.substring(0, 80)}`));
        continue;
      }

      const sourceId = await getOrCreateSource(supabase!, industryId, source);

      // ── Erfolg: Health-Counter zurücksetzen ────────────────
      await supabase!
        .from("sources")
        .update({
          consecutive_failures: 0,
          health_status: "healthy",
          last_health_check: new Date().toISOString(),
          last_error: null,
        })
        .eq("id", sourceId);

      for (const item of items) {
        const normalizedUrl = normalizeUrl(item.url);
        const { error } = await supabase!.from("articles").insert({
          source_url:      normalizedUrl,
          title:           item.title,
          industry_id:     industryId,
          source_id:       sourceId,
          published_at:    item.publishedAt?.toISOString() ?? null,
          language:        "de",
          tags:            [],
          rss_description: item.description ?? null,
        });

        if (!error) {
          totalNew++;
          console.log(`[Scout:${label}]   + ${item.title.substring(0, 70)}`);
        } else if (error.code === "23505") {
          totalSkipped++;
        } else {
          console.error(`[Scout:${label}]   ! Insert failed: ${error.message}`);
        }
      }

      await supabase!
        .from("sources")
        .update({ last_crawled: new Date().toISOString() })
        .eq("id", sourceId);

    } catch (err) {
      console.error(`[Scout:${label}]   Error: ${err}`);

      if (!DRY_RUN) {
        await handleSourceFailure(supabase!, source, label, String(err));
      }
    }
  }

  console.log(`\n[Scout:${label}] Done. New: ${totalNew}, Already known: ${totalSkipped}`);
}

/** Fehler verwalten: Zähler hochzählen, Recovery auslösen wenn nötig */
async function handleSourceFailure(
  supabase: ReturnType<typeof createServiceClient>,
  source: SourceConfig,
  label: string,
  errorMsg: string,
) {
  // Aktuelle Fehlerzahl und Source-ID laden
  const { data: row } = await supabase
    .from("sources")
    .select("id, consecutive_failures, health_status, url")
    .eq("url", source.url)
    .maybeSingle();

  if (!row) return; // Quelle noch nicht in DB

  const failures = (row.consecutive_failures ?? 0) + 1;
  const now = new Date().toISOString();

  // Fehlerzähler erhöhen
  await supabase.from("sources").update({
    consecutive_failures: failures,
    last_error: errorMsg.substring(0, 500),
    last_health_check: now,
    health_status: failures >= MAX_FAILURES_BEFORE_BROKEN ? "broken" : "degraded",
  }).eq("id", row.id);

  console.warn(`[Scout:${label}]   ⚠ ${source.name}: ${failures} Fehler in Folge`);

  // ── Auto-Recovery nach MAX_FAILURES_BEFORE_RECOVERY Fehlern ──
  if (failures === MAX_FAILURES_BEFORE_RECOVERY) {
    console.log(`[Scout:${label}]   🔍 Starte Auto-Recovery für "${source.name}"…`);

    const newUrl = await discoverNewFeedUrl(
      source.name,
      row.url,
      (msg) => console.log(`[Scout:${label}]   ${msg}`),
    );

    if (newUrl) {
      console.log(`[Scout:${label}]   ✅ Neue URL gefunden: ${newUrl}`);
      await supabase.from("sources").update({
        url: newUrl,
        consecutive_failures: 0,
        health_status: "healthy",
        last_error: `Auto-Recovery: URL aktualisiert von ${row.url} zu ${newUrl}`,
        last_health_check: new Date().toISOString(),
      }).eq("id", row.id);

      // Quelle sofort mit neuer URL nochmal versuchen
      try {
        const items = await fetchRssFeed(newUrl);
        console.log(`[Scout:${label}]   ✓ Neue URL liefert ${items.length} Items — Lauf erfolgreich`);
      } catch (e) {
        console.error(`[Scout:${label}]   Neue URL fehlgeschlagen: ${e}`);
      }
    } else {
      console.warn(`[Scout:${label}]   ✗ Auto-Recovery erfolglos — "${source.name}" auf 'degraded' gesetzt`);
    }
  }

  if (failures >= MAX_FAILURES_BEFORE_BROKEN) {
    console.error(`[Scout:${label}]   🔴 "${source.name}" nach ${failures} Fehlern als 'broken' markiert`);
  }
}

/**
 * DB-basierter Scout: liest Quellen direkt aus Supabase (kein Hardcoding).
 * Dadurch bleiben auto-ersetzte URLs (source-checker) dauerhaft gültig.
 */
export async function runScoutFromDB(industryId: number, label: string) {
  const DRY_RUN = process.env["DRY_RUN"] === "true";
  console.log(`[Scout:${label}] Starting (DB-mode)${DRY_RUN ? " (dry run)" : ""}…`);

  const supabase = DRY_RUN ? null : createServiceClient();
  let totalNew = 0;
  let totalSkipped = 0;

  if (!DRY_RUN) {
    const { data: dbSources, error: fetchError } = await supabase!
      .from("sources")
      .select("id, name, url, trust_level")
      .eq("industry_id", industryId)
      .eq("is_active", true)
      .neq("health_status", "broken");

    if (fetchError || !dbSources) {
      console.error(`[Scout:${label}] Failed to load sources from DB: ${fetchError?.message}`);
      process.exit(1);
    }

    console.log(`[Scout:${label}] Loaded ${dbSources.length} sources from DB`);

    for (const source of dbSources) {
      console.log(`\n[Scout:${label}] Fetching: ${source.name} — ${source.url}`);
      try {
        const items = await fetchRssFeed(source.url);
        console.log(`[Scout:${label}]   ${items.length} items in feed`);

        // Erfolg: Health-Counter zurücksetzen
        await supabase!
          .from("sources")
          .update({
            consecutive_failures: 0,
            health_status: "healthy",
            last_health_check: new Date().toISOString(),
            last_error: null,
          })
          .eq("id", source.id);

        for (const item of items) {
          const normalizedUrl = normalizeUrl(item.url);
          const { error } = await supabase!.from("articles").insert({
            source_url:      normalizedUrl,
            title:           item.title,
            industry_id:     industryId,
            source_id:       source.id,
            published_at:    item.publishedAt?.toISOString() ?? null,
            language:        "de",
            tags:            [],
            rss_description: item.description ?? null,
          });

          if (!error) {
            totalNew++;
            console.log(`[Scout:${label}]   + ${item.title.substring(0, 70)}`);
          } else if (error.code === "23505") {
            totalSkipped++;
          } else {
            console.error(`[Scout:${label}]   ! Insert failed: ${error.message}`);
          }
        }

        await supabase!
          .from("sources")
          .update({ last_crawled: new Date().toISOString() })
          .eq("id", source.id);

      } catch (err) {
        console.error(`[Scout:${label}]   Error: ${err}`);
        await handleSourceFailureById(supabase!, source.id, source.name, source.url, label, String(err));
      }
    }
  } else {
    console.log(`[Scout:${label}] DRY_RUN — skipping DB source load`);
  }

  console.log(`\n[Scout:${label}] Done. New: ${totalNew}, Already known: ${totalSkipped}`);
}

/** Fehler verwalten nach ID (kein URL-Lookup nötig, da ID bereits bekannt) */
async function handleSourceFailureById(
  supabase: ReturnType<typeof createServiceClient>,
  sourceId: string,
  sourceName: string,
  sourceUrl: string,
  label: string,
  errorMsg: string,
) {
  const { data: row } = await supabase
    .from("sources")
    .select("consecutive_failures, health_status")
    .eq("id", sourceId)
    .maybeSingle();

  if (!row) return;

  const failures = (row.consecutive_failures ?? 0) + 1;
  const now = new Date().toISOString();

  await supabase.from("sources").update({
    consecutive_failures: failures,
    last_error: errorMsg.substring(0, 500),
    last_health_check: now,
    health_status: failures >= MAX_FAILURES_BEFORE_BROKEN ? "broken" : "degraded",
  }).eq("id", sourceId);

  console.warn(`[Scout:${label}]   ${sourceName}: ${failures} Fehler in Folge`);

  if (failures === MAX_FAILURES_BEFORE_RECOVERY) {
    console.log(`[Scout:${label}]   Starte Auto-Recovery für "${sourceName}"…`);

    const newUrl = await discoverNewFeedUrl(
      sourceName,
      sourceUrl,
      (msg) => console.log(`[Scout:${label}]   ${msg}`),
    );

    if (newUrl) {
      console.log(`[Scout:${label}]   Neue URL gefunden: ${newUrl}`);
      await supabase.from("sources").update({
        url: newUrl,
        consecutive_failures: 0,
        health_status: "healthy",
        last_error: `Auto-Recovery: URL aktualisiert von ${sourceUrl} zu ${newUrl}`,
        last_health_check: new Date().toISOString(),
      }).eq("id", sourceId);

      try {
        const items = await fetchRssFeed(newUrl);
        console.log(`[Scout:${label}]   Neue URL liefert ${items.length} Items — Lauf erfolgreich`);
      } catch (e) {
        console.error(`[Scout:${label}]   Neue URL fehlgeschlagen: ${e}`);
      }
    } else {
      console.warn(`[Scout:${label}]   Auto-Recovery erfolglos — "${sourceName}" auf 'degraded' gesetzt`);
    }
  }

  if (failures >= MAX_FAILURES_BEFORE_BROKEN) {
    console.error(`[Scout:${label}]   "${sourceName}" nach ${failures} Fehlern als 'broken' markiert`);
  }
}

async function getOrCreateSource(
  supabase: ReturnType<typeof createServiceClient>,
  industryId: number,
  source: SourceConfig,
): Promise<string> {
  const { data: existing } = await supabase
    .from("sources")
    .select("id")
    .eq("url", source.url)
    .single();

  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("sources")
    .insert({ industry_id: industryId, name: source.name, url: source.url, type: "rss", trust_level: source.trust_level })
    .select("id")
    .single();

  if (error || !created) throw new Error(`Failed to create source ${source.name}: ${error?.message}`);
  return created.id;
}
