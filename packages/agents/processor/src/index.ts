import { createRequire } from "module";
const require = createRequire(import.meta.url);
try { require("dotenv").config({ override: true }); } catch { /* dotenv optional */ }

import { createServiceClient } from "../../../shared/src/db/client.ts";
import { fetchArticleText } from "./content.ts";
import { summarizeArticle, processArticle } from "./claude.ts";

const DRY_RUN = process.env["DRY_RUN"] === "true";
const BATCH_SIZE = 10;
const DELAY_MS = 1_500; // stay well within Claude rate limits

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
    name: data?.name ?? "Unbekannt",
    tags_taxonomy: (data?.tags_taxonomy as Record<string, string[]>) ?? {},
  };
}

async function run() {
  console.log(`[Processor] Starting${DRY_RUN ? " (dry run)" : ""}…`);
  const supabase = createServiceClient();

  // Fetch unprocessed articles (no summary_medium set yet)
  const { data: articles, error } = await supabase
    .from("articles")
    .select("id, title, source_url, industry_id")
    .is("summary_medium", null)
    .order("ingested_at", { ascending: true })
    .limit(BATCH_SIZE);

  if (error) { console.error("[Processor] DB error:", error.message); process.exit(1); }
  if (!articles?.length) { console.log("[Processor] No unprocessed articles. Done."); return; }

  console.log(`[Processor] Processing ${articles.length} articles…\n`);

  // Cache industry metadata to avoid repeated DB calls
  const industryCache = new Map<number, { name: string; tags_taxonomy: Record<string, string[]> }>();

  let processed = 0;
  let failed = 0;

  for (const article of articles) {
    console.log(`[Processor] → ${article.title.slice(0, 70)}`);

    try {
      if (!industryCache.has(article.industry_id)) {
        industryCache.set(article.industry_id, await getIndustryMeta(supabase, article.industry_id));
      }
      const { name: industryName, tags_taxonomy } = industryCache.get(article.industry_id)!;

      // 1. Fetch article content from source URL
      const content = await fetchArticleText(article.source_url);
      console.log(`[Processor]   content: ${content.length} chars`);

      if (DRY_RUN) {
        console.log(`[Processor]   [dry run — skipping API calls]\n`);
        continue;
      }

      // 2. Summarize (Claude call #1)
      const summaries = await summarizeArticle(article.title, content, industryName);
      console.log(`[Processor]   summary_short: ${summaries.summary_short.slice(0, 60)}…`);

      // 3. Score + tag + assess impact (Claude call #2)
      const result = await processArticle(
        article.title,
        summaries.summary_medium,
        industryName,
        tags_taxonomy,
      );
      console.log(`[Processor]   score=${result.relevance_score} impact=${result.impact_level} tags=${result.tags.join(",")}`);

      // 4. Write back to DB
      const { error: updateError } = await supabase
        .from("articles")
        .update({
          summary_short: summaries.summary_short,
          summary_medium: summaries.summary_medium,
          summary_long: summaries.summary_long,
          relevance_score: result.relevance_score,
          impact_level: result.impact_level as "high" | "medium" | "low",
          impact_reason: result.impact_reason,
          tags: result.tags,
          is_breaking: result.is_breaking,
          processed_at: new Date().toISOString(),
        })
        .eq("id", article.id);

      if (updateError) {
        console.error(`[Processor]   Update failed: ${updateError.message}`);
        failed++;
      } else {
        processed++;
      }

      console.log();
      await sleep(DELAY_MS);
    } catch (err) {
      console.error(`[Processor]   Error: ${err}\n`);
      failed++;
    }
  }

  console.log(`[Processor] Done. Processed: ${processed}, Failed: ${failed}, Remaining: ${articles.length - processed - failed}`);
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

run().catch((err) => {
  console.error("[Processor] Fatal:", err);
  process.exit(1);
});
