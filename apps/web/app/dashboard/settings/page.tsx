import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import IndustrySelector from "@/components/dashboard/IndustrySelector";

export const metadata: Metadata = { title: "Einstellungen · IntelliStream" };

export default async function SettingsPage() {
  const supabase = createSupabaseServerClient();

  const [
    { data: { user } },
    { data: industries },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("industries").select("id, name, slug, description").eq("is_active", true).order("id"),
  ]);

  const { data: userData } = user
    ? await supabase.from("users").select("industry_subscriptions, plan").eq("id", user.id).single()
    : { data: null };

  const currentSubscriptions: number[] = userData?.industry_subscriptions ?? [];
  const plan = userData?.plan ?? "free";

  return (
    <div className="max-w-2xl mx-auto px-6 py-7">

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
              plan === "pro"
                ? "text-neutral-900 shadow-sm"
                : "bg-neutral-100 text-neutral-500"
            }`}
            style={plan === "pro"
              ? { background: "linear-gradient(135deg, #ffca28, #ffb300)" }
              : {}}
          >
            {plan === "pro" && <span>⚡</span>}
            {plan.toUpperCase()}
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
        </div>
      </div>

      {/* ── Industry selector card ───────────────────────── */}
      <div className="bg-white border border-neutral-100 rounded-xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h2 className="text-sm font-semibold text-neutral-900">Meine Branchen</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Wählen Sie bis zu 5 Branchen für Ihren personalisierten Feed.
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
