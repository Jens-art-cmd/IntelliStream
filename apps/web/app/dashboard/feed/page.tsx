import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import FeedClient from "@/components/feed/FeedClient";

export const metadata: Metadata = { title: "Mein Feed" };

const ARTICLES_PER_INDUSTRY = 30;

export default async function FeedPage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: userData } = await supabase
    .from("users")
    .select("industry_subscriptions, plan")
    .eq("id", user.id)
    .single();

  const industryIds: number[] = userData?.industry_subscriptions ?? [];

  if (industryIds.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="text-4xl mb-4">📡</div>
        <h2 className="text-lg font-semibold text-neutral-800 mb-2">Noch keine Branchen ausgewählt</h2>
        <p className="text-sm text-neutral-500 mb-6">
          Wählen Sie bis zu 5 Branchen aus, um Ihren personalisierten Feed zu starten.
        </p>
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-brand-700 transition-colors"
        >
          Jetzt Branchen auswählen →
        </Link>
      </div>
    );
  }

  const [industriesResult, ...articleResults] = await Promise.all([
    supabase.from("industries").select("id, name").in("id", industryIds),
    ...industryIds.map((id) =>
      supabase
        .from("articles")
        .select("id, title, summary_short, summary_medium, industry_id, tags, relevance_score, impact_level, published_at, is_breaking, source_url")
        .eq("industry_id", id)
        .not("summary_medium", "is", null)
        .order("published_at", { ascending: false })
        .limit(ARTICLES_PER_INDUSTRY),
    ),
  ]);

  const industries = industriesResult.data ?? [];
  const articles = articleResults
    .flatMap((r) => r.data ?? [])
    .sort((a, b) => {
      const ta = a.published_at ? new Date(a.published_at).getTime() : 0;
      const tb = b.published_at ? new Date(b.published_at).getTime() : 0;
      return tb - ta;
    });

  const industryNames = industries.map((i) => i.name);

  return (
    <div className="max-w-3xl mx-auto px-6 py-6">

      {/* Page header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tighter-md text-neutral-900">Mein Feed</h1>
          <p className="text-xs text-neutral-400 mt-0.5">{industryNames.join(" · ")}</p>
        </div>
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          Branchen
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <div className="text-4xl">📡</div>
          <h3 className="text-sm font-semibold text-neutral-700">Noch keine Artikel vorhanden</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Sie beobachten: <span className="font-medium text-neutral-700">{industryNames.join(", ")}</span>.
            Die Agenten laufen stündlich und befüllen Ihren Feed automatisch.
          </p>
          <Link href="/dashboard/settings" className="inline-block text-xs text-brand-600 font-medium hover:underline">
            Andere Branchen wählen →
          </Link>
        </div>
      ) : (
        <FeedClient articles={articles} industries={industries} />
      )}
    </div>
  );
}
