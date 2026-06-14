/**
 * Duplikat-Erkennung via Embedding-Vergleich
 *
 * Vergleicht Embeddings von Artikeln die in den letzten 48h verarbeitet wurden,
 * innerhalb derselben Branche. Artikel mit cosine similarity > THRESHOLD gelten
 * als Duplikate — sie bekommen dieselbe duplicate_group UUID.
 * Der Artikel mit dem höchsten relevance_score bleibt sichtbar,
 * alle anderen werden als Duplikat unterdrückt (is_suppressed = true).
 *
 * Läuft nach dem Embedder, damit alle Embeddings vorhanden sind.
 */

import { createRequire } from "module";
const require = createRequire(import.meta.url);
try { require("dotenv").config({ override: true }); } catch { /* optional */ }

import { createServiceClient } from "../../../shared/src/db/client.ts";

const SIMILARITY_THRESHOLD = 0.91; // Cosinus-Ähnlichkeit — empirisch gewählt
const LOOKBACK_HOURS       = 48;   // Vergleichsfenster

interface ArticleRow {
  id:              string;
  title:           string;
  industry_id:     number;
  relevance_score: number;
  embedding:       number[];
  is_suppressed:   boolean;
  duplicate_group: string | null;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot   += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function generateGroupId(): string {
  return crypto.randomUUID();
}

export async function runDeduplicator(): Promise<void> {
  const supabase = createServiceClient();
  const since    = new Date(Date.now() - LOOKBACK_HOURS * 60 * 60 * 1000).toISOString();

  console.log(`[Deduplicator] Lade Artikel der letzten ${LOOKBACK_HOURS}h mit Embeddings…`);

  const { data: articles, error } = await supabase
    .from("articles")
    .select("id, title, industry_id, relevance_score, embedding, is_suppressed, duplicate_group")
    .not("embedding", "is", null)
    .not("processed_at", "is", null)
    .gte("ingested_at", since)
    .order("relevance_score", { ascending: false });

  if (error) {
    console.error("[Deduplicator] DB-Fehler:", error.message);
    return;
  }

  if (!articles?.length) {
    console.log("[Deduplicator] Keine Artikel zum Prüfen.");
    return;
  }

  console.log(`[Deduplicator] ${articles.length} Artikel geladen — prüfe auf Duplikate…\n`);

  // Gruppiere nach Branche für effizienten Vergleich
  const byIndustry = new Map<number, ArticleRow[]>();
  for (const a of articles as ArticleRow[]) {
    if (!Array.isArray(a.embedding) || a.embedding.length === 0) continue;
    const list = byIndustry.get(a.industry_id) ?? [];
    list.push(a);
    byIndustry.set(a.industry_id, list);
  }

  let totalGroups  = 0;
  let totalDups    = 0;
  const updates: Array<{ id: string; duplicate_group: string; is_suppressed: boolean }> = [];

  for (const [industryId, industryArticles] of byIndustry) {
    const n = industryArticles.length;
    if (n < 2) continue;

    // Union-Find: Artikel mit Ähnlichkeit > Threshold in Gruppen zusammenfassen
    const groupOf = new Map<string, string>(); // article.id → groupId

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const a = industryArticles[i];
        const b = industryArticles[j];
        const sim = cosineSimilarity(a.embedding, b.embedding);

        if (sim >= SIMILARITY_THRESHOLD) {
          // Bestehende Gruppe wiederverwenden oder neue erstellen
          const existingGroup = groupOf.get(a.id) ?? groupOf.get(b.id);
          const groupId = existingGroup ?? generateGroupId();
          groupOf.set(a.id, groupId);
          groupOf.set(b.id, groupId);
        }
      }
    }

    // Pro Gruppe: höchsten relevance_score behalten, Rest unterdrücken
    const groupMembers = new Map<string, ArticleRow[]>();
    for (const article of industryArticles) {
      const gid = groupOf.get(article.id);
      if (!gid) continue;
      const members = groupMembers.get(gid) ?? [];
      members.push(article);
      groupMembers.set(gid, members);
    }

    for (const [groupId, members] of groupMembers) {
      if (members.length < 2) continue; // Nur echte Gruppen

      // Sortiere: höchster Score zuerst — der bleibt sichtbar
      members.sort((a, b) => b.relevance_score - a.relevance_score);

      console.log(`[Deduplicator] Branche ${industryId} — Duplikat-Gruppe (${members.length} Artikel):`);
      members.forEach((m, idx) => {
        const role = idx === 0 ? "✅ BEHALTEN" : "🔇 UNTERDRÜCKT";
        console.log(`  ${role} [${m.relevance_score}] ${m.title.slice(0, 70)}`);
      });

      for (let idx = 0; idx < members.length; idx++) {
        const m = members[idx];
        // Nur updaten wenn sich etwas geändert hat
        if (m.duplicate_group === groupId && m.is_suppressed === (idx > 0)) continue;
        updates.push({
          id:              m.id,
          duplicate_group: groupId,
          is_suppressed:   idx > 0, // Index 0 = bester Artikel → sichtbar
        });
      }

      totalGroups++;
      totalDups += members.length - 1;
    }
  }

  console.log(`\n[Deduplicator] ${totalGroups} Gruppen gefunden, ${totalDups} Duplikate werden unterdrückt.`);

  // Batch-Updates
  if (updates.length === 0) {
    console.log("[Deduplicator] Keine Änderungen nötig.");
    return;
  }

  let failed = 0;
  for (const u of updates) {
    const { error: upErr } = await supabase
      .from("articles")
      .update({ duplicate_group: u.duplicate_group, is_suppressed: u.is_suppressed })
      .eq("id", u.id);
    if (upErr) { console.error(`[Deduplicator] Update-Fehler ${u.id}:`, upErr.message); failed++; }
  }

  console.log(`[Deduplicator] Fertig. ${updates.length - failed} Updates gespeichert, ${failed} Fehler.`);
}

// Direkter Aufruf via `npm run start:dedup`
if (process.argv[1]?.endsWith("deduplicator.ts") || process.argv[1]?.endsWith("deduplicator.js")) {
  runDeduplicator().catch(err => {
    console.error("[Deduplicator] Fatal:", err);
    process.exit(1);
  });
}
