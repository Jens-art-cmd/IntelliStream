import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { stripe, STRIPE_PRICES, type PriceKey } from "@/lib/stripe";

/**
 * POST /api/stripe/checkout
 * Body: { priceKey: "pro_monthly" | "pro_yearly" }
 *
 * Erstellt eine Stripe Checkout Session und gibt die URL zurück.
 * Der User muss eingeloggt sein (Supabase Auth).
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });
    }

    const body = await request.json() as { priceKey?: string };
    const priceKey = (body.priceKey ?? "pro_monthly") as PriceKey;
    const priceId = STRIPE_PRICES[priceKey];

    if (!priceId) {
      return NextResponse.json(
        { error: `Ungültiger Plan: ${priceKey}. Stripe-Preis-ID fehlt (Umgebungsvariable).` },
        { status: 400 },
      );
    }

    // Bestehende Stripe Customer-ID aus der DB laden (falls User schon Kunde ist)
    const { data: userData } = await supabase
      .from("users")
      .select("stripe_customer_id, email, name")
      .eq("id", user.id)
      .single();

    const email = userData?.email ?? user.email ?? "";

    // Checkout Session erstellen
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card", "sepa_debit"],
      customer: userData?.stripe_customer_id ?? undefined,
      customer_email: userData?.stripe_customer_id ? undefined : email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env["NEXT_PUBLIC_APP_URL"] ?? request.nextUrl.origin}/dashboard/settings?upgrade=success`,
      cancel_url:  `${process.env["NEXT_PUBLIC_APP_URL"] ?? request.nextUrl.origin}/dashboard/settings?upgrade=cancelled`,
      subscription_data: {
        metadata: { supabase_user_id: user.id },
      },
      metadata: { supabase_user_id: user.id },
      allow_promotion_codes: true,
      billing_address_collection: "required",
      locale: "de",
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[Stripe Checkout]", err);
    return NextResponse.json(
      { error: "Checkout konnte nicht erstellt werden" },
      { status: 500 },
    );
  }
}
