import type { FastifyPluginAsync } from "fastify";
import { CreateAlertSchema } from "@distillfeed/shared";

const alertsRoutes: FastifyPluginAsync = async (app) => {
  // GET /alerts
  app.get("/", async (request) => {
    const { data } = await request.supabase
      .from("user_alerts")
      .select("*")
      .eq("user_id", request.user.id)
      .order("created_at", { ascending: false });

    return { alerts: data ?? [] };
  });

  // POST /alerts
  app.post("/", async (request, reply) => {
    const body = CreateAlertSchema.safeParse(request.body);
    if (!body.success) return reply.badRequest(body.error.message);

    const { data, error } = await request.supabase
      .from("user_alerts")
      .insert({ ...body.data, user_id: request.user.id })
      .select()
      .single();

    if (error) return reply.internalServerError(error.message);
    return data;
  });

  // PATCH /alerts/:id
  app.patch<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const body = CreateAlertSchema.partial().safeParse(request.body);
    if (!body.success) return reply.badRequest(body.error.message);

    const { error } = await request.supabase
      .from("user_alerts")
      .update(body.data)
      .eq("id", request.params.id)
      .eq("user_id", request.user.id);

    if (error) return reply.internalServerError(error.message);
    return { ok: true };
  });

  // DELETE /alerts/:id
  app.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const { error } = await request.supabase
      .from("user_alerts")
      .delete()
      .eq("id", request.params.id)
      .eq("user_id", request.user.id);

    if (error) return reply.internalServerError(error.message);
    return { ok: true };
  });
};

export default alertsRoutes;
