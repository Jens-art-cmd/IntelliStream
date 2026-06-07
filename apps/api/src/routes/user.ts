import type { FastifyPluginAsync } from "fastify";
import { UpdateUserSchema, UpdateProfileSchema } from "@intellistream/shared";

const userRoutes: FastifyPluginAsync = async (app) => {
  // GET /user/me
  app.get("/me", async (request, reply) => {
    const { data, error } = await request.supabase
      .from("users")
      .select("*, user_profiles(*)")
      .eq("id", request.user.id)
      .single();

    if (error || !data) return reply.notFound("User not found");
    return data;
  });

  // PATCH /user/me
  app.patch("/me", async (request, reply) => {
    const body = UpdateUserSchema.safeParse(request.body);
    if (!body.success) return reply.badRequest(body.error.message);

    const { error } = await request.supabase
      .from("users")
      .update(body.data)
      .eq("id", request.user.id);

    if (error) return reply.internalServerError(error.message);
    return { ok: true };
  });

  // PATCH /user/profile
  app.patch("/profile", async (request, reply) => {
    const body = UpdateProfileSchema.safeParse(request.body);
    if (!body.success) return reply.badRequest(body.error.message);

    const { error } = await request.supabase
      .from("user_profiles")
      .update(body.data)
      .eq("user_id", request.user.id);

    if (error) return reply.internalServerError(error.message);
    return { ok: true };
  });

  // POST /user/interaction — log article interaction
  app.post("/interaction", async (request, reply) => {
    const body = request.body as {
      article_id: string;
      event_type: string;
      read_duration_seconds?: number;
      scroll_depth?: number;
    };

    const { error } = await request.supabase.from("interactions").insert({
      user_id: request.user.id,
      article_id: body.article_id,
      event_type: body.event_type as "open" | "click" | "read" | "skip" | "thumbs_up" | "thumbs_down" | "bookmark" | "share",
      read_duration_seconds: body.read_duration_seconds ?? null,
      scroll_depth: body.scroll_depth ?? null,
    });

    if (error) return reply.internalServerError(error.message);
    return { ok: true };
  });

  // DELETE /user/me — DSGVO right to erasure
  app.delete("/me", async (request, reply) => {
    const { error } = await request.supabase
      .from("users")
      .update({ deletion_requested_at: new Date().toISOString() })
      .eq("id", request.user.id);

    if (error) return reply.internalServerError(error.message);
    return { ok: true, message: "Löschanfrage eingegangen. Daten werden innerhalb von 30 Tagen gelöscht." };
  });
};

export default userRoutes;
