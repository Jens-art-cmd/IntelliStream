import { createRequire } from "module";
const require = createRequire(import.meta.url);
try { require("dotenv").config({ override: true }); } catch { /* dotenv optional */ }

import { createServiceClient } from "../../../shared/src/db/client.ts";
import { fetchArticleContent } from "./content.ts";
import { processArticleCombined } from "./claude.ts";

const DRY_RUN          = process.env["DRY_RUN"] === "true";
const BATCH_SIZE       = parseInt(process.env["PROCESSOR_BATCH"] ?? "20", 10);
const DELAY_MS         = 1_500;          // Pause zwischen Artikeln (Rate-Limit-Schutz)
const MIN_PUBLISH_SCORE = 45;            // Artikel unter dieser Grenze werden unterdrückt

async function getIndustryMeta(
  supabase: ReturnType<typeof createServiceClient>,
  industryId: number,
): Promise<{ name: string; tags_taxonomy: Record<string, string[]> }> {
  const { data } = await supabase
    .from("industries")
    .select("name, tags_taxonomy")
    .eq("id", industryId)
    .single();
  return {
    name:          data?.name ?? "Unbekannt",
    tags_taxonomy: (data?.tags_taxonomy as Record<string, string[]>) ?? {},
  };
}

async function run() {
  console.log(`[Processor] Starting${DRY_RUN ? " (dry run)" : ""}… batch=${BATCH_SIZE}`);
  const supabase = createServiceClient();

  // Nur unverarbeitete Artikel holen (summary_medium noch nicht gesetzt)
  const { data: articles, error } = await supabase
    .from("articles")
    .select("id, title, source_url, industry_id, rss_description")
    .is("summary_medium", null)
    .order("ingested_at", { ascending: true })
    .limit(BATCH_SIZE);

  if (error) { console.error("[Processor] DB error:", error.message); process.exit(1); }
  if (!articles?.length) { console.log("[Processor] No unprocessed articles. Done."); return; }

  console.log(`[Processor] Processing ${articles.length} articles (1 API call each)…\n`);

  const industryCache = new Map<number, { name: string; tags_taxonomy: Record<string, string[]> }>();

  let processed  = 0;
  let suppressed = 0;
  let failed     = 0;

  for (const article of articles) {
    console.log(`[Processor] → ${article.title.slice(0, 70)}`);

    try {
      if (!industryCache.has(article.industry_id)) {
        industryCache.set(article.industry_id, await getIndustryMeta(supabase, article.industry_id));
      }
      const { name: industryName, tags_taxonomy } = industryCache.get(article.industry_id)!;

      // 1. Inhalt holen — RSS-Description bevorzugt, Jina nur als Fallback
      const rssDesc = (article as Record<string, unknown>)["rss_description"] as string | null ?? null;
      const content = await fetchArticleContent(article.source_url, rssDesc);
      const source  = rssDesc && content === rssDesc.slice(0, 5_000).trim() ? "rss" : "jina/html";
      console.log(`[Processor]   content: ${content.length} chars (${source})`);

      if (DRY_RUN) {
        console.log(`[Processor]   [dry run — skipping API call]\n`);
        continue;
      }

      // 2. Ein einziger Claude-Call: Summary + Score + Tags + Impact
      const result = await processArticleCombined(
        article.title,
        content,
        industryName,
        tags_taxonomy,
      );

      const isSuppressed = result.relevance_score < MIN_PUBLISH_SCORE;

      console.log(
        `[Processor]   score=${result.relevance_score} impact=${result.impact_level} ` +
        `tags=${result.tags.join(",")}` +
        (isSuppressed ? `  ⚫ UNTERDRÜCKT (<${MIN_PUBLISH_SCORE})` : ""),
      );

      // 3. Alles in einem DB-Write zurückschreiben
      const { error: updateError } = await supabase
        .from("articles")
        .update({
          summary_short:   result.summary_short,
          summary_medium:  result.summary_medium,
          summary_long:    result.summary_long,
          relevance_score: result.relevance_score,
          impact_level:    result.impact_level,
          impact_reason:   result.impact_reason,
          tags:            result.tags,
          is_breaking:     result.is_breaking,
          is_suppressed:   isSuppressed,
          processed_at:    new Date().toISOString(),
        })
        .eq("id", article.id);

      if (updateError) {
        console.error(`[Processor]   Update failed: ${updateError.message}`);
        failed++;
      } else {
        processed++;
        if (isSuppressed) suppressed++;
      }

      console.log();
      await sleep(DELAY_MS);

    } catch (err) {
      console.error(`[Processor]   Error: ${err}\n`);
      failed++;
    }
  }

  console.log(
    `[Processor] Done. ` +
    `Processed: ${processed} (davon unterdrückt: ${suppressed}), ` +
    `Failed: ${failed}`,
  );
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

run().catch((err) => {
  console.error("[Processor] Fatal:", err);
  process.exit(1);
});
