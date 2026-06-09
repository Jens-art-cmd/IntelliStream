import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { stripe } from "@/lib/stripe";

/**
 * GET /api/stripe/portal
 * Leitet zahlende Kunden zum Stripe Customer Portal weiter
 * (Kündigung, Rechnungen, Zahlungsmethode ändern).
 */
export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { data: userData } = await supabase
    .from("users")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (!userData?.stripe_customer_id) {
    return NextResponse.redirect(new URL("/dashboard/settings", request.url));
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer:   userData.stripe_customer_id,
    return_url: `${process.env["NEXT_PUBLIC_APP_URL"] ?? request.nextUrl.origin}/dashboard/settings`,
  });

  return NextResponse.redirect(portalSession.url);
}
