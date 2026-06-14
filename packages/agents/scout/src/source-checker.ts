/**
 * Source Health Checker
 *
 * Reads all active RSS sources from Supabase, performs a lightweight
 * HTTP health check on each, updates health columns, and — for sources
 * that are 'broken' (>= 3 consecutive failures) — asks Claude to suggest
 * replacement feed URLs.
 *
 * Run:  npm run start:check -w @distillfeed/agents-scout
 */

import { createRequire } from "module";
const require = createRequire(import.meta.url);
try { require("dotenv").config(); } catch { /* dotenv optional */ }

import Anthropic from "@anthropic-ai/sdk";
import { createServiceClient } from "../../../shared/src/db/client.js";
import { discoverNewFeedUrl } from "./recovery.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type HealthStatus = "healthy" | "degraded" | "broken" | "unknown";

interface SourceRow {
  id: string;
  name: string;
  url: string;
  industry_id: number;
  consecutive_failures: number;
  health_status: HealthStatus;
}

interface CheckResult {
  id: string;
  name: string;
  url: string;
  status: HealthStatus;
  error?: string;
  replaced?: boolean;
}

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------

const USER_AGENT = "DistillFeed-HealthChecker/1.0 (+https://distillfeed.eu)";
const HEAD_TIMEOUT_MS = 10_000;
const CONTENT_BYTES = 200;

async function checkFeedUrl(url: string): Promise<{ ok: boolean; error?: string }> {
  // Step 1: Optional HEAD request — many servers (esp. German government) reject HEAD
  // with 400/403 even though GET works fine. We skip HEAD for those and go straight to GET.
  let headFailed = false;
  try {
    const headRes = await fetch(url, {
      method: "HEAD",
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(HEAD_TIMEOUT_MS),
    });

    // Hard failures: 404/410 = gone, 5xx = server error → skip GET, fail immediately
    // Soft failures: 400/403/405/415/timeout → server likely doesn't support HEAD, try GET
    if (!headRes.ok) {
      const softFail = [400, 403, 405, 415].includes(headRes.status);
      if (!softFail) {
        return { ok: false, error: `HEAD returned HTTP ${headRes.status}` };
      }
      headFailed = true; // proceed to GET anyway
    }
  } catch {
    // Network error or timeout on HEAD → try GET anyway
    headFailed = true;
  }

  // Step 2: Fetch first CONTENT_BYTES bytes and verify feed signature
  try {
    const getRes = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, Range: `bytes=0-${CONTENT_BYTES - 1}` },
      signal: AbortSignal.timeout(HEAD_TIMEOUT_MS),
    });

    // Accept 200 or 206 (partial content)
    if (!getRes.ok && getRes.status !== 206) {
      return { ok: false, error: `GET returned HTTP ${getRes.status}` };
    }

    const snippet = await getRes.text();
    const lower = snippet.toLowerCase().trimStart();
    const isFeed = lower.includes("<?xml") || lower.includes("<rss") || lower.includes("<feed") || lower.includes("<atom");

    if (!isFeed) {
      return { ok: false, error: "Response does not look like an RSS/Atom feed" };
    }

    return { ok: true };
  } catch (err) {
    const msg = `Content check failed: ${(err as Error).message}`;
    // If HEAD also failed, report both
    return { ok: false, error: headFailed ? `HEAD soft-fail + ${msg}` : msg };
  }
}

// ---------------------------------------------------------------------------
// Google News fallback URL builder
// ---------------------------------------------------------------------------

function buildGoogleNewsFeedUrl(sourceName: string, industryLabel: string): string {
  // Strip common suffixes like "— Pressemitteilungen", "(Google News)" etc.
  const cleanName = sourceName
    .replace(/\s*—\s*.+$/, "")           // remove "— Pressemitteilungen" etc.
    .replace(/\s*\(.*\)$/, "")           // remove "(Google News)" etc.
    .trim();

  // Combine source name with industry for better relevance
  const query = encodeURIComponent(`${cleanName} ${industryLabel}`);
  return `https://news.google.com/rss/search?q=${query}&hl=de&gl=DE&ceid=DE:de`;
}

// ---------------------------------------------------------------------------
// Claude replacement finder
// ---------------------------------------------------------------------------

async function findReplacement(
  source: SourceRow,
  industryLabel: string,
): Promise<string | null> {
  // Step 1: Try deterministic discovery first (free, no API call needed)
  const discoveredUrl = await discoverNewFeedUrl(
    source.name,
    source.url,
    (msg) => console.log(`[HealthChecker]   ${msg}`),
  );
  if (discoveredUrl) return discoveredUrl;

  // Step 2: Fall back to Claude if deterministic discovery found nothing
  const apiKey = process.env["ANTHROPIC_API_KEY"];
  if (!apiKey) {
    console.warn(`[HealthChecker] ANTHROPIC_API_KEY not set — skipping Claude replacement search for ${source.name}`);
    return null;
  }

  const anthropic = new Anthropic({ apiKey });

  const prompt =
    `The RSS feed '${source.name}' at ${source.url} for industry '${industryLabel}' is broken. ` +
    `Please suggest 3 alternative RSS feed URLs for similar content. ` +
    `Return ONLY a JSON array of URLs, nothing else.`;

  let candidates: string[] = [];

  try {
    const message = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 256,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");

    // Extract JSON array from response (Claude may wrap it in backticks)
    const jsonMatch = text.match(/\[[\s\S]*?\]/);
    if (!jsonMatch) {
      console.warn(`[HealthChecker] Could not parse Claude response for ${source.name}: ${text}`);
      return null;
    }

    candidates = JSON.parse(jsonMatch[0]) as string[];
  } catch (err) {
    console.warn(`[HealthChecker] Anthropic API error for ${source.name}: ${(err as Error).message}`);
    return null;
  }

  // Test each candidate and return the first valid one
  for (const candidateUrl of candidates) {
    if (typeof candidateUrl !== "string" || !candidateUrl.startsWith("http")) continue;

    console.log(`[HealthChecker]   Testing candidate: ${candidateUrl}`);
    const check = await checkFeedUrl(candidateUrl);
    if (check.ok) {
      console.log(`[HealthChecker]   Valid replacement found: ${candidateUrl}`);
      return candidateUrl;
    }
    console.log(`[HealthChecker]   Candidate failed: ${check.error}`);
  }

  return null;
}

// ---------------------------------------------------------------------------
// Industry label lookup (for Claude prompt context)
// ---------------------------------------------------------------------------

const INDUSTRY_LABELS: Record<number, string> = {
  1:  "Energie & Erneuerbare",
  2:  "ESG & Nachhaltigkeit",
  3:  "Recht & Compliance",
  4:  "IT & Cybersecurity",
  5:  "Pharma & Life Science",
  6:  "Finanzen & Kapitalmarkt",
  7:  "Bau & Immobilien",
  8:  "Automotive & Mobilität",
  9:  "Gesundheit & MedTech",
  10: "Maschinenbau & Industrie 4.0",
  11: "HR & Arbeitsmarkt",
  13: "Logistik & Transport",
  14: "Versicherung & Risiko",
  15: "Chemie & Materialien",
  21: "EU-Regulatorik & Gesetzgebung",
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const supabase = createServiceClient();

  // Load all active sources
  const { data: sources, error: fetchError } = await supabase
    .from("sources")
    .select("id, name, url, industry_id, consecutive_failures, health_status")
    .eq("is_active", true)
    .order("industry_id", { ascending: true });

  if (fetchError || !sources) {
    console.error("[HealthChecker] Failed to load sources:", fetchError?.message);
    process.exit(1);
  }

  console.log(`[HealthChecker] Checking ${sources.length} active sources…\n`);

  const results: CheckResult[] = [];

  for (const source of sources as SourceRow[]) {
    process.stdout.write(`[HealthChecker] ${source.name} … `);

    const check = await checkFeedUrl(source.url);
    const now = new Date().toISOString();

    if (check.ok) {
      // Healthy — reset failure counter
      await supabase
        .from("sources")
        .update({
          consecutive_failures: 0,
          health_status: "healthy",
          last_health_check: now,
          last_error: null,
        })
        .eq("id", source.id);

      console.log("healthy");
      results.push({ id: source.id, name: source.name, url: source.url, status: "healthy" });
    } else {
      // Failed — increment failure counter
      const newFailures = (source.consecutive_failures ?? 0) + 1;
      const newStatus: HealthStatus = newFailures >= 3 ? "broken" : "degraded";

      console.log(`${newStatus} (failures: ${newFailures}) — ${check.error}`);

      await supabase
        .from("sources")
        .update({
          consecutive_failures: newFailures,
          health_status: newStatus,
          last_health_check: now,
          last_error: check.error ?? "Unknown error",
        })
        .eq("id", source.id);

      const result: CheckResult = {
        id: source.id,
        name: source.name,
        url: source.url,
        status: newStatus,
        error: check.error,
      };

      // Attempt replacement only for newly broken sources
      if (newStatus === "broken") {
        const industryLabel = INDUSTRY_LABELS[source.industry_id] ?? `Industry ${source.industry_id}`;
        console.log(`[HealthChecker]   Source broken — searching for replacement…`);

        const newUrl = await findReplacement(source, industryLabel);

        if (newUrl) {
          const replacementNote = `Replaced: ${source.url} -> ${newUrl} on ${new Date().toISOString().slice(0, 10)}`;

          await supabase
            .from("sources")
            .update({
              url: newUrl,
              consecutive_failures: 0,
              health_status: "healthy",
              last_health_check: now,
              last_error: replacementNote,
            })
            .eq("id", source.id);

          console.log(`[HealthChecker]   Replaced with: ${newUrl}`);
          result.replaced = true;
          result.status = "healthy";
          result.url = newUrl;
        } else {
          // ── Google News Fallback ────────────────────────────────────────────
          // No direct replacement found → insert a Google News RSS source so
          // the industry never goes dark. The original source is deactivated.
          const gnewsUrl = buildGoogleNewsFeedUrl(source.name, industryLabel);
          const gnewsCheck = await checkFeedUrl(gnewsUrl);

          if (gnewsCheck.ok) {
            // Deactivate the broken original
            await supabase
              .from("sources")
              .update({
                is_active: false,
                last_error: `Auto-deactivated: no replacement found, GNews fallback created (${new Date().toISOString().slice(0, 10)})`,
              })
              .eq("id", source.id);

            // Insert Google News replacement
            await supabase.from("sources").insert({
              name: `${source.name} (Google News)`,
              url: gnewsUrl,
              industry_id: source.industry_id,
              type: "rss",
              trust_level: "media",
              is_active: true,
              consecutive_failures: 0,
              health_status: "healthy",
              last_health_check: now,
              last_error: `Auto-created as GNews fallback for broken source: ${source.url}`,
            });

            console.log(`[HealthChecker]   GNews fallback created: ${gnewsUrl}`);
            result.replaced = true;
            result.status = "healthy";
            result.url = gnewsUrl;
          } else {
            console.log(`[HealthChecker]   No valid replacement found — source remains broken`);
          }
        }
      }

      results.push(result);
    }
  }

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------
  const healthy  = results.filter((r) => r.status === "healthy" && !r.replaced).length;
  const degraded = results.filter((r) => r.status === "degraded").length;
  const broken   = results.filter((r) => r.status === "broken").length;
  const replaced = results.filter((r) => r.replaced).length;

  console.log("\n─────────────────────────────────────────");
  console.log(`[HealthChecker] Summary`);
  console.log(`  Total checked : ${results.length}`);
  console.log(`  Healthy       : ${healthy}`);
  console.log(`  Degraded      : ${degraded}`);
  console.log(`  Broken        : ${broken}`);
  console.log(`  Replaced      : ${replaced}`);
  console.log("─────────────────────────────────────────");

  if (degraded > 0 || broken > 0) {
    console.log("\n[HealthChecker] Issues:");
    for (const r of results) {
      if (r.status === "degraded" || r.status === "broken") {
        const tag = r.replaced ? "[REPLACED]" : `[${r.status.toUpperCase()}]`;
        console.log(`  ${tag} ${r.name} — ${r.error ?? "unknown error"}`);
        if (r.replaced) console.log(`           → New URL: ${r.url}`);
      }
    }
  }

  // ── Admin-E-Mail bei dauerhaft kaputten Quellen (via Resend) ─────────────
  const brokenUnreplaced = results.filter((r) => r.status === "broken" && !r.replaced);
  const resendKey = process.env["RESEND_API_KEY"];

  if (brokenUnreplaced.length > 0 && resendKey) {
    const brokenList = brokenUnreplaced
      .map((r) => `<li><strong>${r.name}</strong><br>URL: ${r.url}<br>Fehler: ${r.error ?? "unbekannt"}</li>`)
      .join("\n");

    const html = `
<h2>IntelliStream — Source Health Alert</h2>
<p>${brokenUnreplaced.length} RSS-Quellen sind dauerhaft kaputt und konnten nicht automatisch ersetzt werden:</p>
<ul>
${brokenList}
</ul>
<p>Bitte manuell prüfen und ggf. neue URLs in der Supabase-Datenbank eintragen.</p>
<hr>
<small>Generiert von HealthChecker am ${new Date().toISOString()}</small>
`.trim();

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "IntelliStream Alerts <alerts@distillfeed.eu>",
          to: ["koerbe-wellig4m@icloud.com"],
          subject: `[IntelliStream] ${brokenUnreplaced.length} RSS-Quellen kaputt — manuelle Prüfung nötig`,
          html,
        }),
      });

      if (res.ok) {
        console.log(`\n[HealthChecker] Admin-Alert-E-Mail gesendet (${brokenUnreplaced.length} broken sources)`);
      } else {
        const body = await res.text();
        console.warn(`[HealthChecker] Resend API Fehler ${res.status}: ${body}`);
      }
    } catch (err) {
      console.warn(`[HealthChecker] Konnte Admin-Alert nicht senden: ${(err as Error).message}`);
    }
  } else if (brokenUnreplaced.length > 0 && !resendKey) {
    console.warn(`[HealthChecker] RESEND_API_KEY nicht gesetzt — kein Admin-Alert gesendet (${brokenUnreplaced.length} broken sources)`);
  }
}

main().catch((err) => {
  console.error("[HealthChecker] Fatal error:", err);
  process.exit(1);
});
