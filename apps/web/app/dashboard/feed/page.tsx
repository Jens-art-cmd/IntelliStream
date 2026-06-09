import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import FeedClient from "@/components/feed/FeedClient";
import { getTrialInfo } from "../../../../../packages/shared/src/trial";

export const metadata: Metadata = { title: "Mein Feed · IntelliStream" };

const ARTICLES_PER_INDUSTRY = 30;

export default async function FeedPage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: userData } = await supabase
    .from("users")
    .select("industry_subscriptions, plan, trial_ends_at")
    .eq("id", user.id)
    .single();

  const industryIds: number[] = userData?.industry_subscriptions ?? [];

  const trialInfo = getTrialInfo({
    plan: userData?.plan ?? "free",
    trial_ends_at: userData?.trial_ends_at,
  });

  const effectiveIndustryIds = trialInfo.isFullAccess ? industryIds : industryIds.slice(0, 1);

  if (industryIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 py-16 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg"
          style={{ background: "linear-gradient(135deg, #ffca28 0%, #ff8f00 100%)" }}
        >
          <span className="text-2xl">📡</span>
        </div>
        <h2 className="text-lg font-bold text-neutral-900 mb-2">Noch keine Branchen ausgewählt</h2>
        <p className="text-sm text-neutral-500 mb-7 max-w-xs leading-relaxed">
          Wählen Sie bis zu 5 Branchen aus, um Ihren personalisierten Feed zu starten.
        </p>
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-px transition-all duration-200 text-neutral-900"
          style={{ background: "linear-gradient(135deg, #ffca28 0%, #ffb300 100%)" }}
        >
          Jetzt Branchen auswählen
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    );
  }

  const [industriesResult, bookmarksResult, ...articleResults] = await Promise.all([
    supabase.from("industries").select("id, name").in("id", effectiveIndustryIds),
    supabase.from("bookmarks").select("article_id").eq("user_id", user.id),
    ...effectiveIndustryIds.map((id) =>
      supabase
        .from("articles")
        .select("id, title, summary_short, summary_medium, industry_id, tags, relevance_score, impact_level, published_at, is_breaking, source_url")
        .eq("industry_id", id)
        .not("summary_medium", "is", null)
        .eq("is_suppressed", false)
        .order("published_at", { ascending: false })
        .limit(ARTICLES_PER_INDUSTRY),
    ),
  ]);

  const industries = industriesResult.data ?? [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookmarkedIds = new Set<string>((bookmarksResult.data ?? []).map((b: any) => b.article_id as string));
  const articles = articleResults
    .flatMap((r) => r.data ?? [])
    .sort((a, b) => {
      const ta = a.published_at ? new Date(a.published_at).getTime() : 0;
      const tb = b.published_at ? new Date(b.published_at).getTime() : 0;
      return tb - ta;
    });

  const industryNames = industries.map((i) => i.name);

  return (
    <div className="max-w-3xl mx-auto px-6 py-7">

      {/* ── Page header ──────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tighter-md text-neutral-900">Mein Feed</h1>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            {industryNames.map((name) => (
              <span
                key={name}
                className="text-2xs font-semibold text-neutral-600 px-2.5 py-0.5 rounded-full"
                style={{ boxShadow: "inset 2px 2px 4px #c5cad3, inset -2px -2px 4px #ffffff" }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-800 px-3 py-2 rounded-xl transition-all flex-shrink-0"
          style={{ boxShadow: "4px 4px 8px #c5cad3, -4px -4px 8px #ffffff" }}
        >
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          Branchen
        </Link>
      </div>

      {/* ── Free plan industry limit notice ──────────────── */}
      {!trialInfo.isFullAccess && industryIds.length > 1 && (
        <p className="text-xs text-neutral-500 mb-4 mt-1">
          Im kostenlosen Zugang wird 1 Branche angezeigt.{" "}
          <Link href="/dashboard/settings" className="text-amber-600 font-semibold hover:underline">
            Upgrade für alle {industryIds.length} Branchen
          </Link>
        </p>
      )}

      {/* ── Content ──────────────────────────────────────── */}
      {articles.length === 0 ? (
        <div className="bg-white border border-neutral-100 rounded-xl text-center py-16 px-6 shadow-xs">
          <div className="text-3xl mb-3">📡</div>
          <h3 className="text-sm font-semibold text-neutral-800 mb-1">Noch keine Artikel vorhanden</h3>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
            Sie beobachten: <span className="font-medium text-neutral-700">{industryNames.join(", ")}</span>.
            Die Agenten laufen stündlich und befüllen Ihren Feed automatisch.
          </p>
          <Link
            href="/dashboard/settings"
            className="inline-block text-xs text-brand-600 font-semibold hover:underline mt-4"
          >
            Andere Branchen wählen →
          </Link>
        </div>
      ) : (
        <FeedClient articles={articles} industries={industries} bookmarkedIds={bookmarkedIds} />
      )}
    </div>
  );
}
