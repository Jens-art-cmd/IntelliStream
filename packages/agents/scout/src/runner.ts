import { createRequire } from "module";
const require = createRequire(import.meta.url);
try { require("dotenv").config(); } catch { /* dotenv optional */ }

import { createServiceClient } from "../../../shared/src/db/client.ts";
import { fetchRssFeed } from "./rss.js";

export interface SourceConfig {
  name: string;
  url: string;
  trust_level: "official" | "media" | "blog";
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

      for (const item of items) {
        const { error } = await supabase!.from("articles").insert({
          source_url: item.url,
          title: item.title,
          industry_id: industryId,
          source_id: sourceId,
          published_at: item.publishedAt?.toISOString() ?? null,
          language: "de",
          tags: [],
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
    }
  }

  console.log(`\n[Scout:${label}] Done. New: ${totalNew}, Already known: ${totalSkipped}`);
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
