import type { Metadata } from "next";
import { Zap, Check } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import IndustrySelector from "@/components/dashboard/IndustrySelector";
import UpgradeButton from "@/components/dashboard/UpgradeButton";
import UpgradeNotification from "@/components/dashboard/UpgradeNotification";
import { getTrialInfo } from "@/lib/trial";

export const metadata: Metadata = { title: "Einstellungen · DistillFeed" };

const PRO_FEATURES = [
  "KI-Zusammenfassungen (kurz/mittel/lang)",
  "Alle 15 Branchen gleichzeitig",
  "Täglicher kuratierter Newsletter",
  "Stichwort-Alerts per E-Mail",
  "Relevanz-Scoring & Impact-Filter",
  "Semantische Volltextsuche",
];

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ upgrade?: string }>;
}) {
  const resolvedParams = await searchParams;
  const supabase = await createSupabaseServerClient();

  const [
    { data: { user } },
    { data: industries },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("industries").select("id, name, slug, description").eq("is_active", true).order("id"),
  ]);

  const { data: userData } = user
    ? await supabase.from("users").select("industry_subscriptions, plan, trial_ends_at").eq("id", user.id).single()
    : { data: null };

  const currentSubscriptions: number[] = userData?.industry_subscriptions ?? [];
  const plan = userData?.plan ?? "free";
  const trialInfo = getTrialInfo({ plan, trial_ends_at: userData?.trial_ends_at });
  const isPaid = plan !== "free";

  return (
    <div className="max-w-2xl mx-auto px-6 py-7">

      {/* ── Upgrade-Rückmeldung ──────────────────────────── */}
      <UpgradeNotification status={resolvedParams.upgrade} />

      {/* ── Page header ──────────────────────────────────── */}
      <div className="mb-7">
        <div className="flex items-center gap-2.5 mb-1.5">
          <span className="block w-5 h-px" style={{ background: "#E08900" }} />
          <span className="text-[10px] font-semibold uppercase" style={{ letterSpacing: "0.2em", color: "#E08900" }}>
            Einstellungen
          </span>
        </div>
        <h1
          className="text-[22px] font-light leading-tight"
          style={{ fontFamily: "var(--font-display), Georgia, serif", color: "#1A1813", letterSpacing: "-0.015em" }}
        >
          Einstellungen
        </h1>
        <p className="text-xs mt-1" style={{ color: "#8C887E" }}>{user?.email}</p>
      </div>

      {/* ── Account card ─────────────────────────────────── */}
      <div
        className="rounded-xl overflow-hidden mb-4"
        style={{ background: "#FFFFFF", border: "1px solid #E2DDD2" }}
      >
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid #EBE7DD" }}
        >
          <div>
            <div className="flex items-center gap-2.5 mb-0.5">
              <span className="block w-4 h-px" style={{ background: "#E08900" }} />
              <span className="text-[9px] font-bold uppercase" style={{ letterSpacing: "0.16em", color: "#8C887E" }}>
                Konto
              </span>
            </div>
            <h2 className="text-sm font-semibold" style={{ color: "#1A1813" }}>
              Kontoinformationen
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "#57534A" }}>Aktueller Plan und Mitgliedschaft</p>
          </div>
          {/* Plan badge */}
          <span
            className="inline-flex items-center gap-1.5 text-2xs font-bold uppercase px-3 py-1 rounded-full"
            style={isPaid
              ? { background: "#FFB300", color: "#1A1100" }
              : { background: "#F1EDE4", color: "#8C887E", letterSpacing: "0.08em" }
            }
          >
            {isPaid && <Zap size={10} strokeWidth={2.5} />}
            {isPaid ? plan.toUpperCase() : trialInfo.status === "trialing" ? "TRIAL" : "FREE"}
          </span>
        </div>
        <div className="px-5 py-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: "#8C887E" }}>E-Mail</span>
            <span className="text-xs font-medium" style={{ color: "#1A1813" }}>{user?.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: "#8C887E" }}>Mitglied seit</span>
            <span className="text-xs font-medium" style={{ color: "#1A1813" }}>
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString("de-DE", { month: "long", year: "numeric" })
                : "—"}
            </span>
          </div>
          {trialInfo.status === "trialing" && trialInfo.daysLeft !== null && (
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium" style={{ color: "#8C887E" }}>Probemonat</span>
              <span className="text-xs font-semibold" style={{ color: "#E08900" }}>
                noch {trialInfo.daysLeft} Tag{trialInfo.daysLeft === 1 ? "" : "e"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Upgrade-Sektion ───────────────────────────────── */}
      {!isPaid && (
        <div className="mb-4">
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: "#FFFFFF", border: "1px solid #E2DDD2" }}
          >
            <div className="px-5 py-4" style={{ borderBottom: "1px solid #EBE7DD" }}>
              <div className="flex items-center gap-2.5 mb-0.5">
                <span className="block w-4 h-px" style={{ background: "#E08900" }} />
                <span className="text-[9px] font-bold uppercase" style={{ letterSpacing: "0.16em", color: "#8C887E" }}>
                  Upgrade
                </span>
              </div>
              <h2 className="text-sm font-semibold" style={{ color: "#1A1813" }}>
                {trialInfo.status === "trialing" ? "Jetzt upgraden — bevor der Test endet" : "Auf Pro upgraden"}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "#57534A" }}>
                Vollständiger Zugang zu allen KI-Funktionen und allen 15 Branchen
              </p>
            </div>

            {/* Preiskarten */}
            <div className="p-5 grid grid-cols-2 gap-3">

              {/* Monatlich */}
              <div
                className="rounded-xl p-4 flex flex-col gap-3"
                style={{ border: "1px solid #E2DDD2" }}
              >
                <div>
                  <p
                    className="text-[10px] font-semibold uppercase mb-1"
                    style={{ letterSpacing: "0.14em", color: "#8C887E" }}
                  >
                    Monatlich
                  </p>
                  <p className="text-2xl font-black tracking-tight" style={{ color: "#1A1813" }}>
                    49 €<span className="text-sm font-normal" style={{ color: "#8C887E" }}>/Monat</span>
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#8C887E" }}>jederzeit kündbar</p>
                </div>
                <UpgradeButton
                  priceKey="pro_monthly"
                  label="Monatlich starten"
                  className="w-full py-2 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  style={{ background: "#FAF8F4", border: "1px solid #E2DDD2", color: "#57534A" }}
                />
              </div>

              {/* Jährlich — empfohlen */}
              <div
                className="rounded-xl p-4 flex flex-col gap-3 relative"
                style={{ background: "#FFF6E0", border: "2px solid #FFB300" }}
              >
                <span
                  className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-2xs font-bold px-2.5 py-0.5 rounded-full uppercase whitespace-nowrap"
                  style={{ background: "#FFB300", color: "#1A1100", letterSpacing: "0.08em" }}
                >
                  2 Monate gratis
                </span>
                <div>
                  <p
                    className="text-[10px] font-semibold uppercase mb-1"
                    style={{ letterSpacing: "0.14em", color: "#E08900" }}
                  >
                    Jährlich
                  </p>
                  <p className="text-2xl font-black tracking-tight" style={{ color: "#1A1813" }}>
                    39 €<span className="text-sm font-normal" style={{ color: "#57534A" }}>/Monat</span>
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#57534A" }}>468 €/Jahr — Du sparst 120 €</p>
                </div>
                <UpgradeButton
                  priceKey="pro_yearly"
                  label="Jährlich upgraden →"
                  className="w-full py-2 rounded-lg text-xs font-bold transition-all hover:opacity-90 cursor-pointer"
                  style={{ background: "#FFB300", color: "#1A1100" }}
                />
              </div>
            </div>

            {/* Feature-Liste */}
            <div className="px-5 pb-5">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {PRO_FEATURES.map(f => (
                  <div key={f} className="flex items-start gap-2">
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: "#FFB300" }}
                    >
                      <Check size={9} strokeWidth={3} color="#1A1100" />
                    </span>
                    <span className="text-xs" style={{ color: "#57534A" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Aktives Abo verwalten ─────────────────────────── */}
      {isPaid && (
        <div
          className="rounded-xl overflow-hidden mb-4"
          style={{ background: "#FFFFFF", border: "1px solid #E2DDD2" }}
        >
          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold" style={{ color: "#1A1813" }}>
                Abonnement verwalten
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "#57534A" }}>
                Kündigung, Rechnungen und Zahlungsmethode
              </p>
            </div>
            <a
              href="/api/stripe/portal"
              className="text-xs font-semibold hover:underline transition-colors"
              style={{ color: "#E08900" }}
            >
              Stripe-Portal öffnen →
            </a>
          </div>
        </div>
      )}

      {/* ── Industry selector card ───────────────────────── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "#FFFFFF", border: "1px solid #E2DDD2" }}
      >
        <div className="px-5 py-4" style={{ borderBottom: "1px solid #EBE7DD" }}>
          <div className="flex items-center gap-2.5 mb-0.5">
            <span className="block w-4 h-px" style={{ background: "#E08900" }} />
            <span className="text-[9px] font-bold uppercase" style={{ letterSpacing: "0.16em", color: "#8C887E" }}>
              Meine Branchen
            </span>
          </div>
          <h2 className="text-sm font-semibold" style={{ color: "#1A1813" }}>Branchen auswählen</h2>
          <p className="text-xs mt-0.5" style={{ color: "#57534A" }}>
            {trialInfo.isFullAccess
              ? "Wähle bis zu 15 Branchen für deinen personalisierten Feed."
              : "Im kostenlosen Zugang sind 2 Branchen verfügbar."}
          </p>
        </div>
        <div className="px-5 py-4">
          <IndustrySelector
            industries={industries ?? []}
            initialSelected={currentSubscriptions}
            redirectTo="/dashboard/feed"
            saveLabel="Branchen speichern"
            maxIndustries={trialInfo.isFullAccess ? 15 : 2}
            isFullAccess={trialInfo.isFullAccess}
          />
        </div>
      </div>

    </div>
  );
}
