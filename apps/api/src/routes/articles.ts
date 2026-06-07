import type { FastifyPluginAsync } from "fastify";

const articlesRoutes: FastifyPluginAsync = async (app) => {
  // GET /articles/:id
  app.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const { id } = request.params;

    const { data, error } = await request.supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return reply.notFound("Article not found");

    // Log open interaction (fire-and-forget)
    request.supabase.from("interactions").insert({
      user_id: request.user.id,
      article_id: id,
      event_type: "open",
      read_duration_seconds: null,
      scroll_depth: null,
    }).then(() => {});

    return data;
  });

  // GET /articles — list with filters
  app.get("/", async (request, reply) => {
    const query = request.query as {
      industry_id?: string;
      impact?: string;
      limit?: string;
      offset?: string;
    };

    let q = request.supabase
      .from("articles")
      .select("id, title, summary_short, summary_medium, industry_id, tags, relevance_score, impact_level, published_at, is_breaking, source_url, trust_score")
      .not("summary_medium", "is", null)
      .order("published_at", { ascending: false })
      .limit(Math.min(Number(query.limit ?? 20), 100))
      .range(Number(query.offset ?? 0), Number(query.offset ?? 0) + Math.min(Number(query.limit ?? 20), 100) - 1);

    if (query.industry_id) q = q.eq("industry_id", Number(query.industry_id));
    if (query.impact) q = q.eq("impact_level", query.impact as "high" | "medium" | "low");

    const { data, error } = await q;
    if (error) return reply.internalServerError(error.message);

    return { articles: data ?? [], total: data?.length ?? 0 };
  });
};

export default articlesRoutes;
