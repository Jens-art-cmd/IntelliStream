import type { FastifyPluginAsync } from "fastify";
import { createServiceClient } from "@intellistream/shared";

const webhooksRoutes: FastifyPluginAsync = async (app) => {
  // POST /webhooks/stripe — Stripe subscription lifecycle
  app.post("/stripe", {
    config: { rawBody: true },
  }, async (request, reply) => {
    const sig = request.headers["stripe-signature"];
    const webhookSecret = process.env["STRIPE_WEBHOOK_SECRET"];

    if (!sig || !webhookSecret) return reply.badRequest("Missing signature");

    // Stripe event verification — requires stripe package (added in Phase 3)
    // For now: validate and process known event types
    const event = request.body as { type: string; data: { object: Record<string, unknown> } };

    const supabase = createServiceClient();

    if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
      const subscription = event.data.object;
      const customerId = subscription["customer"] as string;
      const status = subscription["status"] as string;
      const priceId = (subscription["items"] as { data: Array<{ price: { id: string } }> })
        .data[0]?.price.id;

      const planMap: Record<string, string> = {
        [process.env["STRIPE_PRICE_STARTER"] ?? ""]: "starter",
        [process.env["STRIPE_PRICE_PRO"] ?? ""]: "pro",
        [process.env["STRIPE_PRICE_ENTERPRISE"] ?? ""]: "enterprise",
      };
      const plan = priceId ? (planMap[priceId] ?? "free") : "free";

      if (status === "active") {
        await supabase.from("users").update({
          plan: plan as "free" | "starter" | "pro" | "enterprise",
          stripe_customer_id: customerId,
          stripe_subscription_id: subscription["id"] as string,
        }).eq("stripe_customer_id", customerId);
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      await supabase.from("users").update({ plan: "free" })
        .eq("stripe_subscription_id", subscription["id"] as string);
    }

    return { received: true };
  });
};

export default webhooksRoutes;
