import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import IndustrySelector from "@/components/dashboard/IndustrySelector";

export const metadata: Metadata = { title: "Einstellungen" };

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

  return (
    <div className="max-w-2xl mx-auto px-6 py-6">

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tighter-md text-neutral-900">Einstellungen</h1>
        <p className="text-xs text-neutral-400 mt-1">{user?.email}</p>
      </div>

      {/* Account info */}
      <div className="bg-neutral-0 border border-neutral-150 rounded-lg overflow-hidden mb-4">
        <div className="px-5 py-3.5 border-b border-neutral-100">
          <h2 className="text-sm font-semibold text-neutral-900">Konto</h2>
          <p className="text-xs text-neutral-500 mt-0.5">Ihre Kontoinformationen und aktueller Plan</p>
        </div>
        <div className="px-5 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">E-Mail</span>
            <span className="text-xs text-neutral-800">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Plan</span>
            <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 border border-brand-200 text-2xs font-bold uppercase tracking-[.06em] px-2.5 py-0.5 rounded-full">
              ⚡ {userData?.plan ?? "free"}
            </span>
          </div>
        </div>
      </div>

      {/* Industry selector */}
      <div className="bg-neutral-0 border border-neutral-150 rounded-lg overflow-hidden">
        <div className="px-5 py-3.5 border-b border-neutral-100">
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
