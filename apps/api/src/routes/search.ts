import type { FastifyPluginAsync } from "fastify";
import { SearchQuerySchema } from "@intellistream/shared";

const searchRoutes: FastifyPluginAsync = async (app) => {
  // GET /search?q=...&mode=semantic|fulltext|hybrid
  app.get("/", async (request, reply) => {
    const query = SearchQuerySchema.safeParse(request.query);
    if (!query.success) return reply.badRequest(query.error.message);

    const { q, limit, offset, industry_ids, mode } = query.data;

    if (mode === "fulltext" || mode === "hybrid") {
      const { data: ftData, error: ftError } = await request.supabase.rpc(
        "search_articles_fulltext",
        {
          query_text: q,
          industry_ids: industry_ids ?? null,
          match_count: limit,
          offset_count: offset,
        },
      );
      if (ftError) return reply.internalServerError(ftError.message);
      if (mode === "fulltext") return { results: ftData ?? [], query: q };
    }

    // For semantic/hybrid: generate embedding first
    // Embedding generation is done by calling the API's embedding service
    // In Phase 2 this will call OpenAI text-embedding-3-small
    // For now, fallback to fulltext
    const { data: ftFallback } = await request.supabase.rpc(
      "search_articles_fulltext",
      {
        query_text: q,
        industry_ids: industry_ids ?? null,
        match_count: limit,
        offset_count: offset,
      },
    );

    return { results: ftFallback ?? [], query: q, mode: "fulltext_fallback" };
  });
};

export default searchRoutes;
