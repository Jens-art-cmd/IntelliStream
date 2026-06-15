import type { Metadata } from "next";
import Link from "next/link";
import { Bell, Check } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getTrialInfo } from "@/lib/trial";
import AlertManager from "@/components/dashboard/AlertManager";

export const metadata: Metadata = { title: "Alerts · DistillFeed" };

const ALERT_FEATURES = [
  "Unbegrenzte Alerts",
  "Tages-E-Mail mit Treffern",
  "Impact-Filter (nur wichtige Artikel)",
  "Alerts jederzeit pausierbar",
];

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
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="block w-5 h-px" style={{ background: "#E08900" }} />
            <span className="text-[10px] font-semibold uppercase" style={{ letterSpacing: "0.2em", color: "#E08900" }}>
              Alerts
            </span>
          </div>
          <h1
            className="text-[22px] font-light leading-tight"
            style={{ fontFamily: "var(--font-display), Georgia, serif", color: "#1A1813", letterSpacing: "-0.015em" }}
          >
            Meine Alerts
          </h1>
          <p className="text-xs mt-1" style={{ color: "#8C887E" }}>
            Stichwort-Benachrichtigungen per E-Mail
          </p>
        </div>

        <div className="rounded-xl overflow-hidden" style={{ background: "#FFFFFF", border: "1px solid #E2DDD2" }}>
          {/* Card header */}
          <div className="px-5 py-4" style={{ borderBottom: "1px solid #EBE7DD" }}>
            <div className="flex items-center gap-2.5 mb-0.5">
              <span className="block w-4 h-px" style={{ background: "#E08900" }} />
              <span
                className="text-[9px] font-bold uppercase"
                style={{ letterSpacing: "0.16em", color: "#8C887E" }}
              >
                Pro-Feature
              </span>
            </div>
            <h2 className="text-sm font-semibold" style={{ color: "#1A1813" }}>
              Stichwort-Alerts per E-Mail
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "#57534A" }}>
              Im Pro-Plan verfügbar — jetzt kostenlos testen
            </p>
          </div>

          <div className="p-5">
            <div className="flex gap-3 items-start mb-5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#FFF6E0", border: "1px solid #FFD966" }}
              >
                <Bell size={16} strokeWidth={1.75} color="#E08900" />
              </div>
              <div>
                <p className="text-sm font-semibold mb-0.5" style={{ color: "#1A1813" }}>
                  Relevante Artikel direkt ins Postfach
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "#57534A" }}>
                  Definiere Stichwörter wie „EEG-Novelle" oder „BaFin-Verordnung" — und erhalte täglich
                  eine E-Mail, wenn neue passende Artikel erscheinen.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-5">
              {ALERT_FEATURES.map(f => (
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

            <Link
              href="/dashboard/settings"
              className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl hover:-translate-y-px transition-all duration-200"
              style={{ background: "#FFB300", color: "#1A1100", boxShadow: "0 4px 14px rgba(224,137,0,0.22)" }}
            >
              Auf Pro upgraden →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Pro-Nutzer: Alert-Manager laden ──────────────────────────────────────
  const [{ data: alerts }, { data: userData2 }, { data: allIndustries }] = await Promise.all([
    supabase
      .from("user_alerts")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("users")
      .select("industry_subscriptions")
      .eq("id", user!.id)
      .single(),
    supabase
      .from("industries")
      .select("id, name")
      .eq("is_active", true)
      .order("name"),
  ]);

  const subscribedIds: number[] = userData2?.industry_subscriptions ?? [];
  const industries = (allIndustries ?? []).filter((ind) =>
    subscribedIds.includes(ind.id)
  );

  return <AlertManager initialAlerts={alerts ?? []} industries={industries} />;
}
