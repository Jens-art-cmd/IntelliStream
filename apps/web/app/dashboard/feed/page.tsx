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
      <div className="max-w-3xl mx-auto p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-4">Du hast noch keine Branchen abonniert.</p>
        <Link href="/onboarding" className="text-brand-600 hover:underline font-medium">
          Jetzt Branchen auswählen →
        </Link>
      </div>
    );
  }

  // Fetch top N articles per industry in parallel, then merge by date.
  // This ensures every subscribed industry is represented regardless of publish date.
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

  // Merge all per-industry results and re-sort by published_at descending
  const articles = articleResults
    .flatMap((r) => r.data ?? [])
    .sort((a, b) => {
      const ta = a.published_at ? new Date(a.published_at).getTime() : 0;
      const tb = b.published_at ? new Date(b.published_at).getTime() : 0;
      return tb - ta;
    });

  const industryNames = industries.map((i) => i.name);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mein Feed</h1>
        <Link href="/dashboard/settings" className="text-xs text-gray-500 hover:text-brand-600 transition-colors">
          Branchen ändern ⚙
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <div className="text-4xl">📡</div>
          <p className="text-gray-700 dark:text-gray-300 font-medium">Noch keine Artikel für deine Branchen</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Du beobachtest: <strong>{industryNames.join(", ")}</strong>.
            Die Agenten laufen stündlich und befüllen deinen Feed automatisch.
          </p>
          <Link href="/dashboard/settings" className="inline-block mt-2 text-sm text-brand-600 hover:underline">
            Andere Branchen wählen →
          </Link>
        </div>
      ) : (
        <FeedClient articles={articles} industries={industries} />
      )}
    </div>
  );
}
