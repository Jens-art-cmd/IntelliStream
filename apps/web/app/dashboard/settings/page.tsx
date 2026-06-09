import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import IndustrySelector from "@/components/dashboard/IndustrySelector";
import UpgradeButton from "@/components/dashboard/UpgradeButton";
import UpgradeNotification from "@/components/dashboard/UpgradeNotification";
import { getTrialInfo } from "@/lib/trial";

export const metadata: Metadata = { title: "Einstellungen · IntelliStream" };

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

      {/* ── Upgrade-Rückmeldung (success / cancelled) ────── */}
      <UpgradeNotification status={resolvedParams.upgrade} />

      {/* ── Page header ──────────────────────────────────── */}
      <div className="mb-7">
        <h1 className="text-xl font-bold tracking-tighter-md text-neutral-900">Einstellungen</h1>
        <p className="text-xs text-neutral-400 mt-1">{user?.email}</p>
      </div>

      {/* ── Account card ─────────────────────────────────── */}
      <div className="bg-white border border-neutral-100 rounded-xl overflow-hidden mb-4 shadow-xs">
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">Konto</h2>
            <p className="text-xs text-neutral-500 mt-0.5">Ihre Kontoinformationen und aktueller Plan</p>
          </div>
          {/* Plan badge */}
          <span
            className={`inline-flex items-center gap-1.5 text-2xs font-bold uppercase tracking-[.08em] px-3 py-1 rounded-full ${
              isPaid
                ? "text-neutral-900 shadow-sm"
                : "bg-neutral-100 text-neutral-500"
            }`}
            style={isPaid ? { background: "linear-gradient(135deg, #ffca28, #ffb300)" } : {}}
          >
            {isPaid && <span>⚡</span>}
            {isPaid ? plan.toUpperCase() : trialInfo.status === "trialing" ? "TRIAL" : "FREE"}
          </span>
        </div>
        <div className="px-5 py-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">E-Mail</span>
            <span className="text-xs text-neutral-800 font-medium">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Mitglied seit</span>
            <span className="text-xs text-neutral-800 font-medium">
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString("de-DE", { month: "long", year: "numeric" })
                : "—"}
            </span>
          </div>
          {trialInfo.status === "trialing" && trialInfo.daysLeft !== null && (
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500">Probemonat</span>
              <span className="text-xs font-semibold text-amber-600">
                noch {trialInfo.daysLeft} Tag{trialInfo.daysLeft === 1 ? "" : "e"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Upgrade-Sektion (nur für nicht zahlende User) ── */}
      {!isPaid && (
        <div className="mb-4">
          <div className="bg-white border border-neutral-100 rounded-xl overflow-hidden shadow-xs">
            <div className="px-5 py-4 border-b border-neutral-100">
              <h2 className="text-sm font-semibold text-neutral-900">
                {trialInfo.status === "trialing" ? "Jetzt upgraden — bevor der Test endet" : "Auf Pro upgraden"}
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Vollständiger Zugang zu allen KI-Funktionen und bis zu 5 Branchen
              </p>
            </div>

            {/* Preiskarten */}
            <div className="p-5 grid grid-cols-2 gap-3">

              {/* Monatlich */}
              <div className="border border-neutral-200 rounded-xl p-4 flex flex-col gap-3">
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Monatlich</p>
                  <p className="text-2xl font-black text-neutral-900 tracking-tight">
                    49 €<span className="text-sm font-normal text-neutral-400">/Monat</span>
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">jederzeit kündbar</p>
                </div>
                <UpgradeButton
                  priceKey="pro_monthly"
                  label="Monatlich starten"
                  className="w-full py-2 rounded-lg text-xs font-bold text-neutral-700 border border-neutral-200 hover:border-amber-400 hover:text-neutral-900 transition-all"
                />
              </div>

              {/* Jährlich — empfohlen */}
              <div
                className="rounded-xl p-4 flex flex-col gap-3 relative"
                style={{ background: "linear-gradient(135deg, #fff8e1 0%, #fff3cd 100%)", border: "2px solid #ffb300" }}
              >
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-2xs font-bold bg-amber-400 text-neutral-900 px-2.5 py-0.5 rounded-full uppercase tracking-wide whitespace-nowrap">
                  2 Monate gratis
                </span>
                <div>
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Jährlich</p>
                  <p className="text-2xl font-black text-neutral-900 tracking-tight">
                    39 €<span className="text-sm font-normal text-neutral-500">/Monat</span>
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">468 €/Jahr — Sie sparen 120 €</p>
                </div>
                <UpgradeButton
                  priceKey="pro_yearly"
                  label="Jährlich upgraden →"
                  className="w-full py-2 rounded-lg text-xs font-bold text-neutral-900 transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #ffca28 0%, #ffb300 100%)" }}
                />
              </div>
            </div>

            {/* Feature-Liste */}
            <div className="px-5 pb-5">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {[
                  "KI-Zusammenfassungen (kurz/mittel/lang)",
                  "Bis zu 5 Branchen gleichzeitig",
                  "Täglicher kuratierter Newsletter",
                  "Stichwort-Alerts per E-Mail",
                  "Relevanz-Scoring & Impact-Filter",
                  "Semantische Volltextsuche",
                ].map(f => (
                  <div key={f} className="flex items-start gap-1.5">
                    <span className="text-amber-500 mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-xs text-neutral-600">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Aktives Abo verwalten (für zahlende User) ─────── */}
      {isPaid && (
        <div className="bg-white border border-neutral-100 rounded-xl overflow-hidden mb-4 shadow-xs">
          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">Abonnement verwalten</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Kündigung, Rechnungen und Zahlungsmethode</p>
            </div>
            <a
              href="/api/stripe/portal"
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors"
            >
              Stripe-Portal öffnen →
            </a>
          </div>
        </div>
      )}

      {/* ── Industry selector card ───────────────────────── */}
      <div className="bg-white border border-neutral-100 rounded-xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h2 className="text-sm font-semibold text-neutral-900">Meine Branchen</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            {trialInfo.isFullAccess
              ? "Wählen Sie bis zu 5 Branchen für Ihren personalisierten Feed."
              : "Im kostenlosen Zugang ist 1 Branche verfügbar."}
          </p>
        </div>
        <div className="px-5 py-4">
          <IndustrySelector
            industries={industries ?? []}
            initialSelected={currentSubscriptions}
            redirectTo="/dashboard/feed"
            saveLabel="Branchen speichern"
          />
        </div>
      </div>

    </div>
  );
}
