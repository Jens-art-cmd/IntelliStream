import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, Hanken_Grotesk, Space_Mono } from "next/font/google";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import OnboardingFlow from "./OnboardingFlow";
import { getTrialInfo } from "@/lib/trial";

export const metadata: Metadata = { title: "Branchen auswählen · DistillFeed" };

const display = Fraunces({ subsets: ["latin"], display: "swap", variable: "--font-display", axes: ["opsz", "SOFT"] });
const body    = Hanken_Grotesk({ subsets: ["latin"], display: "swap", variable: "--font-body" });
const mono    = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap", variable: "--font-mono" });

export default async function OnboardingPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const [
    { data: industries },
    { data: userData },
  ] = await Promise.all([
    supabase.from("industries").select("id, name, slug, description").eq("is_active", true).order("id"),
    supabase.from("users").select("industry_subscriptions, plan, trial_ends_at").eq("id", session.user.id).single(),
  ]);

  return (
    <div
      className={`${display.variable} ${body.variable} ${mono.variable} min-h-screen`}
      style={{ fontFamily: "var(--font-body), system-ui, sans-serif", background: "#F7F5F0" }}
    >
      {/* ── Top bar ──────────────────────────────────────────── */}
      <header className="px-8 pt-7 pb-5 flex items-center justify-between max-w-4xl mx-auto">
        <Link
          href="/"
          className="text-[18px] font-semibold"
          style={{ fontFamily: "var(--font-display), Georgia, serif", color: "#1A1813" }}
        >
          Distill<span style={{ color: "#E08900" }}>Feed</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="block w-5 h-px" style={{ background: "#E08900" }} />
          <span
            className="text-[10px] font-semibold uppercase"
            style={{ letterSpacing: "0.2em", color: "#E08900" }}
          >
            Einrichtung
          </span>
        </div>
      </header>

      {/* ── Content ──────────────────────────────────────────── */}
      <main className="max-w-2xl mx-auto px-6 pb-16 pt-8">

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-7">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
            style={{ background: "#FFB300", color: "#1A1100" }}
          >
            1
          </div>
          <div className="flex-1 h-px" style={{ background: "#E2DDD2" }} />
          <span className="text-xs" style={{ color: "#8C887E" }}>Schritt 1 von 1</span>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1
            className="text-[28px] font-light leading-tight mb-2"
            style={{
              fontFamily: "var(--font-display), Georgia, serif",
              color: "#1A1813",
              letterSpacing: "-0.02em",
            }}
          >
            Welche Branchen<br />
            möchtest du beobachten?
          </h1>
          <p className="text-[14px] leading-relaxed" style={{ color: "#57534A" }}>
            {(() => {
              const trialInfo = getTrialInfo({ plan: userData?.plan ?? "free", trial_ends_at: userData?.trial_ends_at });
              return trialInfo.isFullAccess
                ? "Wähle bis zu 15 Branchen aus — dein Feed wird täglich mit den relevantesten Meldungen befüllt."
                : "Wähle bis zu 2 Branchen aus. Mit Pro-Plan stehen alle 15 Branchen zur Verfügung.";
            })()}
          </p>
        </div>

        {/* Selector card */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "#FFFFFF", border: "1px solid #E2DDD2", boxShadow: "0 12px 40px -16px rgba(26,24,19,0.12)" }}
        >
          {(() => {
            const trialInfo = getTrialInfo({ plan: userData?.plan ?? "free", trial_ends_at: userData?.trial_ends_at });
            return (
              <OnboardingFlow
                industries={industries ?? []}
                initialSelected={userData?.industry_subscriptions ?? []}
                maxIndustries={trialInfo.isFullAccess ? 15 : 2}
                isFullAccess={trialInfo.isFullAccess}
              />
            );
          })()}

        </div>

        {/* Footer note */}
        <p className="text-center text-xs mt-6" style={{ color: "#8C887E" }}>
          Du kannst deine Branchen jederzeit unter{" "}
          <Link href="/dashboard/settings" className="hover:underline" style={{ color: "#E08900" }}>
            Einstellungen
          </Link>{" "}
          ändern.
        </p>
      </main>
    </div>
  );
}
