import Stripe from "stripe";

if (!process.env["STRIPE_SECRET_KEY"]) {
  throw new Error("STRIPE_SECRET_KEY environment variable is not set");
}

/** Server-seitiger Stripe-Client (nie an den Browser senden) */
export const stripe = new Stripe(process.env["STRIPE_SECRET_KEY"]!, {
  apiVersion: "2026-05-27.dahlia",
  typescript: true,
});

/** Stripe-Preis-IDs aus Umgebungsvariablen */
export const STRIPE_PRICES = {
  pro_monthly:  process.env["STRIPE_PRICE_PRO_MONTHLY"]  ?? "",
  pro_yearly:   process.env["STRIPE_PRICE_PRO_YEARLY"]   ?? "",
} as const;

export type PriceKey = keyof typeof STRIPE_PRICES;
