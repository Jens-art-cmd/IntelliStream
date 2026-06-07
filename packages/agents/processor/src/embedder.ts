/**
 * Embedding Pipeline
 *
 * Liest alle verarbeiteten Artikel ohne Embedding aus Supabase,
 * generiert Vektoren via OpenAI text-embedding-3-small (1536 dims),
 * schreibt sie zurück in articles.embedding.
 *
 * Schaltet frühzeitig:
 *   - search_articles()  — semantische Suche
 *   - get_personalized_feed() — Cosinus-Ähnlichkeit mit User-Profil
 *
 * Run:  npm run start:embed -w @intellistream/agents-processor
 */

import { createRequire } from "module";
const require = createRequire(import.meta.url);
try { require("dotenv").config(); } catch { /* dotenv optional */ }

import OpenAI from "openai";
import { createServiceClient } from "../../../shared/src/db/client.ts";

const MODEL      = "text-embedding-3-small";
const DIMENSIONS = 1536;
const BATCH_SIZE = 100;   // OpenAI erlaubt bis zu 2048 Inputs pro Call

const DRY_RUN = process.env["DRY_RUN"] === "true";

// ---------------------------------------------------------------------------

function getClient(): OpenAI {
  const apiKey = process.env["OPENAI_API_KEY"];
  if (!apiKey) throw new Error("OPENAI_API_KEY ist nicht gesetzt");
  return new OpenAI({ apiKey });
}

// ---------------------------------------------------------------------------

async function run() {
  console.log(`[Embedder] Starting${DRY_RUN ? " (dry run)" : ""}…`);

  const supabase = createServiceClient();
  const openai   = getClient();

  let totalEmbedded = 0;

  // Loop: verarbeite so lange Batches, bis keine unembeddeten Artikel mehr da sind
  while (true) {
    const { data: articles, error } = await supabase
      .from("articles")
      .select("id, title, summary_medium")
      .not("processed_at", "is", null)   // nur bereits processierte Artikel
      .is("embedding", null)             // noch kein Embedding
      .order("processed_at", { ascending: true })
      .limit(BATCH_SIZE);

    if (error) {
      console.error("[Embedder] DB-Fehler:", error.message);
      process.exit(1);
    }

    if (!articles?.length) {
      console.log("[Embedder] Keine unembeddeten Artikel gefunden. Fertig.");
      break;
    }

    console.log(`[Embedder] Batch: ${articles.length} Artikel…`);

    // Eingabe-Texte: Titel + Summary (bestes semantisches Signal)
    const inputs = articles.map(a =>
      `${a.title}\n\n${a.summary_medium ?? ""}`.trim().slice(0, 8_191) // OpenAI Token-Limit
    );

    if (DRY_RUN) {
      console.log(`[Embedder] [dry run] würde ${articles.length} Embeddings generieren`);
      break;
    }

    // OpenAI Batch-Call
    let embeddings: number[][];
    try {
      const response = await openai.embeddings.create({
        model:      MODEL,
        input:      inputs,
        dimensions: DIMENSIONS,
      });
      embeddings = response.data.map(d => d.embedding);
      console.log(`[Embedder]   OpenAI: ${embeddings.length} Vektoren erhalten (${response.usage.total_tokens} Tokens)`);
    } catch (err) {
      console.error(`[Embedder] OpenAI-Fehler: ${(err as Error).message}`);
      process.exit(1);
    }

    // Zurück in DB schreiben
    let ok = 0;
    let fail = 0;
    for (let i = 0; i < articles.length; i++) {
      const { error: updateErr } = await supabase
        .from("articles")
        .update({ embedding: embeddings[i] as unknown as string })
        .eq("id", articles[i].id);

      if (updateErr) {
        console.error(`[Embedder]   Update-Fehler für ${articles[i].id}: ${updateErr.message}`);
        fail++;
      } else {
        ok++;
      }
    }

    console.log(`[Embedder]   Gespeichert: ${ok} ✓  Fehler: ${fail}`);
    totalEmbedded += ok;
  }

  console.log(`\n[Embedder] Gesamt eingebettet: ${totalEmbedded}`);
}

run().catch(err => {
  console.error("[Embedder] Fataler Fehler:", err);
  process.exit(1);
});
