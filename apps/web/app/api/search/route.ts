import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createSupabaseServerClient } from "@/lib/supabase-server";

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) return null;
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

async function getQueryEmbedding(text: string): Promise<number[] | null> {
  const client = getOpenAI();
  if (!client) return null;
  try {
    const res = await client.embeddings.create({
      model: "text-embedding-3-small",
      input: text.slice(0, 8_191),
      dimensions: 1536,
    });
    return res.data[0]?.embedding ?? null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q            = searchParams.get("q")?.trim() ?? "";
  const mode         = searchParams.get("mode") ?? "hybrid";
  const limit        = Math.min(parseInt(searchParams.get("limit") ?? "20"), 50);
  const offset       = parseInt(searchParams.get("offset") ?? "0");
  const industryRaw  = searchParams.get("industry_ids");
  const industryIds  = industryRaw ? industryRaw.split(",").map(Number).filter(Boolean) : null;

  if (!q) return NextResponse.json({ results: [], query: "" });

  const supabase = createSupabaseServerClient();

  // Volltext-only
  if (mode === "fulltext") {
    const { data, error } = await supabase.rpc("search_articles_fulltext", {
      query_text:   q,
      industry_ids: industryIds,
      match_count:  limit,
      offset_count: offset,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ results: data ?? [], query: q, mode: "fulltext" });
  }

  // Semantisch / Hybrid
  const embedding = await getQueryEmbedding(q);

  if (embedding) {
    const { data: semData, error: semError } = await supabase.rpc("search_articles", {
      query_embedding: embedding as unknown as string,
      industry_ids:    industryIds,
      match_threshold: 0.35,
      match_count:     limit,
      offset_count:    offset,
    });

    if (!semError && semData?.length) {
      if (mode === "hybrid") {
        const { data: ftData } = await supabase.rpc("search_articles_fulltext", {
          query_text:   q,
          industry_ids: industryIds,
          match_count:  limit,
          offset_count: 0,
        });
        const seen   = new Set(semData.map((r: { id: string }) => r.id));
        const merged = [
          ...semData,
          ...(ftData ?? []).filter((r: { id: string }) => !seen.has(r.id)),
        ].slice(0, limit);
        return NextResponse.json({ results: merged, query: q, mode: "hybrid" });
      }
      return NextResponse.json({ results: semData, query: q, mode: "semantic" });
    }
  }

  // Fallback Volltext
  const { data: ftFallback } = await supabase.rpc("search_articles_fulltext", {
    query_text:   q,
    industry_ids: industryIds,
    match_count:  limit,
    offset_count: offset,
  });
  return NextResponse.json({ results: ftFallback ?? [], query: q, mode: "fulltext_fallback" });
}
