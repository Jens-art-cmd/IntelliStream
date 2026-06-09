import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "../../../../../../packages/shared/src/db/client";
import type Stripe from "stripe";

/**
 * POST /api/stripe/webhook
 *
 * Stripe-Webhook-Handler mit Signaturverifikation.
 * Diesen Endpunkt in Stripe Dashboard als Webhook-URL eintragen:
 *   https://YOUR_DOMAIN/api/stripe/webhook
 *
 * Benötigte Events:
 *   - checkout.session.completed
 *   - customer.subscription.updated
 *   - customer.subscription.deleted
 *   - invoice.payment_failed
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig  = request.headers.get("stripe-signature");
  const webhookSecret = process.env["STRIPE_WEBHOOK_SECRET"];

  if (!sig || !webhookSecret) {
    console.error("[Stripe Webhook] Fehlende Signatur oder Secret");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("[Stripe Webhook] Signaturprüfung fehlgeschlagen:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServiceClient();

  // ── Plan-Mapping: Stripe Price ID → IntelliStream Plan ──────────────────
  const planMap: Record<string, "starter" | "pro" | "enterprise"> = {
    [process.env["STRIPE_PRICE_PRO_MONTHLY"]   ?? "__none__"]: "pro",
    [process.env["STRIPE_PRICE_PRO_YEARLY"]    ?? "__none__"]: "pro",
    [process.env["STRIPE_PRICE_STARTER"]       ?? "__none__"]: "starter",
    [process.env["STRIPE_PRICE_ENTERPRISE"]    ?? "__none__"]: "enterprise",
  };

  try {
    switch (event.type) {

      // ── Checkout abgeschlossen ─────────────────────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId  = session.metadata?.["supabase_user_id"];
        if (!userId || !session.subscription || !session.customer) break;

        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const priceId      = subscription.items.data[0]?.price.id ?? "";
        const plan         = planMap[priceId] ?? "pro";

        await supabase.from("users").update({
          plan,
          stripe_customer_id:      session.customer as string,
          stripe_subscription_id:  session.subscription as string,
        }).eq("id", userId);

        console.log(`[Stripe Webhook] checkout.session.completed → user ${userId} → plan ${plan}`);
        break;
      }

      // ── Abonnement aktualisiert (Plan-Wechsel, Erneuerung) ──────────────
      case "customer.subscription.updated": {
        const sub     = event.data.object as Stripe.Subscription;
        const priceId = sub.items.data[0]?.price.id ?? "";
        const plan    = planMap[priceId];

        if (!plan) {
          console.warn("[Stripe Webhook] Unbekannte Price-ID:", priceId);
          break;
        }

        const newPlan = sub.status === "active" ? plan : "free";
        await supabase.from("users").update({ plan: newPlan })
          .eq("stripe_subscription_id", sub.id);

        console.log(`[Stripe Webhook] subscription.updated → sub ${sub.id} → ${newPlan} (${sub.status})`);
        break;
      }

      // ── Abonnement gekündigt / abgelaufen ──────────────────────────────
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await supabase.from("users").update({ plan: "free" })
          .eq("stripe_subscription_id", sub.id);

        console.log(`[Stripe Webhook] subscription.deleted → sub ${sub.id} → free`);
        break;
      }

      // ── Zahlung fehlgeschlagen ─────────────────────────────────────────
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.warn(`[Stripe Webhook] invoice.payment_failed → customer ${invoice.customer}`);
        // Hier optional: E-Mail-Benachrichtigung auslösen (via Supabase Edge Function oder Resend)
        break;
      }

      default:
        // Unbekannte Events ignorieren — kein Fehler
        break;
    }
  } catch (err) {
    console.error("[Stripe Webhook] Verarbeitungsfehler:", err);
    // Trotzdem 200 zurückgeben — Stripe würde sonst Retries auslösen
  }

  return NextResponse.json({ received: true });
}
