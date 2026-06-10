import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getTrialInfo } from "@/lib/trial";
import AlertManager from "@/components/dashboard/AlertManager";

export const metadata: Metadata = { title: "Alerts · IntelliStream" };

export default async function AlertsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: userData } = user
    ? await supabase.from("users").select("plan, trial_ends_at").eq("id", user.id).single()
    : { data: null };

  const { isFullAccess } = getTrialInfo({
    plan: userData?.plan ?? "free",
    trial_ends_at: userData?.trial_ends_at,
  });

  // ── Gate: Nur für Pro-Nutzer ──────────────────────────────────────────────
  if (!isFullAccess) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-7">

        <div className="mb-7">
          <h1 className="text-xl font-bold tracking-tighter-md text-neutral-900">Meine Alerts</h1>
          <p className="text-xs text-neutral-400 mt-1">Stichwort-Benachrichtigungen per E-Mail</p>
        </div>

        <div className="bg-white border border-neutral-100 rounded-xl overflow-hidden shadow-xs">
          <div className="px-5 py-4 border-b border-neutral-100">
            <h2 className="text-sm font-semibold text-neutral-900">Pro-Feature</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Stichwort-Alerts sind im Pro-Plan verfügbar
            </p>
          </div>

          <div className="p-5">
            <div className="flex gap-3 items-start mb-5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #ffca28, #ff8f00)" }}
              >
                <span className="text-base">🔔</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-800 mb-0.5">
                  Relevante Artikel direkt in Ihr Postfach
                </p>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Definieren Sie Stichwörter wie „EEG-Novelle" oder „BaFin-Verordnung" — und erhalten Sie täglich
                  eine E-Mail, wenn neue passende Artikel erscheinen.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-5">
              {[
                "Unbegrenzte Alerts",
                "Tages-E-Mail mit Treffern",
                "Impact-Filter (nur wichtige Artikel)",
                "Alerts jederzeit pausierbar",
              ].map(f => (
                <div key={f} className="flex items-start gap-1.5">
                  <span className="text-amber-500 mt-0.5 flex-shrink-0">✓</span>
                  <span className="text-xs text-neutral-600">{f}</span>
                </div>
              ))}
            </div>

            <Link
              href="/dashboard/settings"
              className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-px transition-all duration-200 text-neutral-900"
              style={{ background: "linear-gradient(135deg, #ffca28 0%, #ffb300 100%)" }}
            >
              Auf Pro upgraden →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Pro-Nutzer: Alert-Manager laden ──────────────────────────────────────
  const { data: alerts } = await supabase
    .from("user_alerts")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return <AlertManager initialAlerts={alerts ?? []} />;
}
