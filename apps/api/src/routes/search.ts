import type { FastifyPluginAsync } from "fastify";
import OpenAI from "openai";
import { SearchQuerySchema } from "@distillfeed/shared";

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI | null {
  if (!process.env["OPENAI_API_KEY"]) return null;
  if (!_openai) _openai = new OpenAI({ apiKey: process.env["OPENAI_API_KEY"] });
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

const searchRoutes: FastifyPluginAsync = async (app) => {
  // GET /search?q=...&mode=semantic|fulltext|hybrid
  app.get("/", async (request, reply) => {
    const query = SearchQuerySchema.safeParse(request.query);
    if (!query.success) return reply.badRequest(query.error.message);

    const { q, limit, offset, industry_ids, mode } = query.data;

    // Volltext-only
    if (mode === "fulltext") {
      const { data, error } = await request.supabase.rpc("search_articles_fulltext", {
        query_text:   q,
        industry_ids: industry_ids ?? null,
        match_count:  limit,
        offset_count: offset,
      });
      if (error) return reply.internalServerError(error.message);
      return { results: data ?? [], query: q, mode: "fulltext" };
    }

    // Semantisch (oder Hybrid) — Embedding für die Query generieren
    const embedding = await getQueryEmbedding(q);

    if (embedding) {
      const { data: semData, error: semError } = await request.supabase.rpc("search_articles", {
        query_embedding: embedding as unknown as string,
        industry_ids:    industry_ids ?? null,
        match_threshold: 0.35,   // niedrig für breitere Ergebnisse
        match_count:     limit,
        offset_count:    offset,
      });

      if (!semError && semData?.length) {
        // Hybrid: semantische Ergebnisse + Volltext zusammenführen
        if (mode === "hybrid") {
          const { data: ftData } = await request.supabase.rpc("search_articles_fulltext", {
            query_text:   q,
            industry_ids: industry_ids ?? null,
            match_count:  limit,
            offset_count: 0,
          });
          const seen = new Set(semData.map((r: { id: string }) => r.id));
          const merged = [
            ...semData,
            ...(ftData ?? []).filter((r: { id: string }) => !seen.has(r.id)),
          ].slice(0, limit);
          return { results: merged, query: q, mode: "hybrid" };
        }
        return { results: semData, query: q, mode: "semantic" };
      }
    }

    // Fallback: Volltext
    const { data: ftFallback } = await request.supabase.rpc("search_articles_fulltext", {
      query_text:   q,
      industry_ids: industry_ids ?? null,
      match_count:  limit,
      offset_count: offset,
    });
    return { results: ftFallback ?? [], query: q, mode: "fulltext_fallback" };
  });
};

export default searchRoutes;
