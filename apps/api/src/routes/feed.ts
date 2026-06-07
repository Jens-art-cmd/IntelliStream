import type { FastifyPluginAsync } from "fastify";
import { FeedQuerySchema } from "@intellistream/shared";

const feedRoutes: FastifyPluginAsync = async (app) => {
  // GET /feed — personalized article feed
  app.get("/", async (request, reply) => {
    const query = FeedQuerySchema.safeParse(request.query);
    if (!query.success) return reply.badRequest(query.error.message);

    const { limit, offset, days_back, impact } = query.data;
    const userId = request.user.id;

    // Get user's industry subscriptions
    const { data: userData } = await request.supabase
      .from("users")
      .select("industry_subscriptions")
      .eq("id", userId)
      .single();

    const industryIds = query.data.industry_ids ?? userData?.industry_subscriptions ?? [];
    if (industryIds.length === 0) return { articles: [], total: 0 };

    // Use personalized feed function
    const { data, error } = await request.supabase.rpc("get_personalized_feed", {
      p_user_id: userId,
      p_industry_ids: industryIds,
      p_limit: limit,
      p_offset: offset,
      p_days_back: days_back,
    });

    if (error) return reply.internalServerError(error.message);

    const articles = impact
      ? data?.filter((a) => a.impact_level === impact)
      : data;

    return { articles: articles ?? [], total: articles?.length ?? 0 };
  });
};

export default feedRoutes;
