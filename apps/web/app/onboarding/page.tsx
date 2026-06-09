import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import OnboardingFlow from "./OnboardingFlow";

export const metadata: Metadata = { title: "Branchen auswählen" };

export default async function OnboardingPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const [
    { data: industries },
    { data: userData },
  ] = await Promise.all([
    supabase.from("industries").select("id, name, slug, description").eq("is_active", true).order("id"),
    supabase.from("users").select("industry_subscriptions").eq("id", session.user.id).single(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Willkommen bei IntelliStream</h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Wähle 1–5 Branchen die du täglich beobachten möchtest.
          </p>
        </div>
        <OnboardingFlow
          industries={industries ?? []}
          initialSelected={userData?.industry_subscriptions ?? []}
        />
      </div>
    </div>
  );
}
