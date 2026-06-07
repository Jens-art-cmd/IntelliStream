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
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">Einstellungen</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        Plan: <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">{userData?.plan ?? "free"}</span>
        {" · "}
        {user?.email}
      </p>

      <section>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Meine Branchen</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          Wähle bis zu 5 Branchen, die in deinem Feed erscheinen.
        </p>
        <IndustrySelector
          industries={industries ?? []}
          initialSelected={currentSubscriptions}
          redirectTo="/dashboard/feed"
          saveLabel="Branchen speichern →"
        />
      </section>
    </div>
  );
}
