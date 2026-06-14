import type { Metadata } from "next";
import Link from "next/link";
import { Signal, Settings2, Sparkles } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import FeedClient from "@/components/feed/FeedClient";
import { getTrialInfo } from "@/lib/trial";
import type { ImpactLevel } from "@/types/database";

export const metadata: Metadata = { title: "Mein Feed · DistillFeed" };

const ARTICLES_PER_INDUSTRY = 30;
const PERSONALIZED_LIMIT = 60;

export default async function FeedPage() {
  const supabase = await createSupabaseServerClient();
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

  // Nur aktive Branchen berücksichtigen — deaktivierte herausfiltern
  const { data: activeIndustries } = await supabase
    .from("industries")
    .select("id")
    .eq("is_active", true)
    .in("id", industryIds.length > 0 ? industryIds : [0]);
  const activeIds = new Set((activeIndustries ?? []).map((i) => i.id));
  const filteredIndustryIds = industryIds.filter((id) => activeIds.has(id));

  const effectiveIndustryIds = trialInfo.isFullAccess ? filteredIndustryIds : filteredIndustryIds.slice(0, 2);

  if (industryIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 py-16 text-center">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
          style={{ background: "#FFF6E0", border: "1px solid #FFB300" }}
        >
          <Signal size={22} strokeWidth={1.75} color="#E08900" />
        </div>
        <h2
          className="text-[20px] font-light mb-2"
          style={{ fontFamily: "var(--font-display), Georgia, serif", color: "#1A1813" }}
        >
          Noch keine Branchen ausgewählt
        </h2>
        <p className="text-sm mb-7 max-w-xs leading-relaxed" style={{ color: "#57534A" }}>
          Wähle deine Branchen aus, um deinen personalisierten Feed zu starten.
        </p>
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-xl hover:-translate-y-px transition-all duration-200"
          style={{ background: "#FFB300", color: "#1A1100", boxShadow: "0 4px 14px rgba(224,137,0,0.28)" }}
        >
          Jetzt Branchen auswählen
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    );
  }

  // Prüfen ob User ein Interest-Profil hat (für personalisierten Feed)
  const { data: userProfile } = await supabase
    .from("user_profiles")
    .select("interest_vector")
    .eq("user_id", user.id)
    .single();

  const isPersonalized = !!(userProfile?.interest_vector);

  const [industriesResult, bookmarksResult] = await Promise.all([
    supabase.from("industries").select("id, name").in("id", effectiveIndustryIds),
    supabase.from("bookmarks").select("article_id").eq("user_id", user.id),
  ]);

  const industries = industriesResult.data ?? [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookmarkedIds = new Set<string>((bookmarksResult.data ?? []).map((b: any) => b.article_id as string));

  let articles: {
    id: string;
    title: string;
    summary_short: string | null;
    summary_medium: string | null;
    industry_id: number;
    tags: string[];
    relevance_score: number | null;
    impact_level: ImpactLevel | null;
    published_at: string | null;
    is_breaking: boolean;
    source_url: string;
    affected_roles: string | null;
    deadline_hint: string | null;
  }[] = [];

  if (isPersonalized) {
    // Personalisierter Feed via RPC (Cosinus-Ähnlichkeit + Recency)
    const { data: rpcArticles } = await supabase.rpc("get_personalized_feed", {
      p_user_id:      user.id,
      p_industry_ids: effectiveIndustryIds,
      p_limit:        PERSONALIZED_LIMIT,
      p_days_back:    14,
    });

    if (rpcArticles?.length) {
      // source_url ist nicht im RPC — separater Lookup
      const ids = rpcArticles.map((a: { id: string }) => a.id);
      const { data: extraRows } = await supabase
        .from("articles")
        .select("id, source_url, affected_roles, deadline_hint")
        .in("id", ids);
      const extraMap = new Map((extraRows ?? []).map((r: { id: string; source_url: string; affected_roles: string | null; deadline_hint: string | null }) => [r.id, r]));

      articles = rpcArticles.map((a: {
        id: string; title: string; summary_short: string | null;
        summary_medium: string | null; industry_id: number; tags: string[];
        relevance_score: number | null; impact_level: ImpactLevel | null;
        published_at: string | null; is_breaking: boolean;
      }) => ({
        ...a,
        source_url:     extraMap.get(a.id)?.source_url     ?? "",
        affected_roles: extraMap.get(a.id)?.affected_roles ?? null,
        deadline_hint:  extraMap.get(a.id)?.deadline_hint  ?? null,
      }));
    }
  }

  // Fallback: Standard-Feed (chronologisch) wenn kein Profil oder RPC leer
  if (!articles.length) {
    const articleResults = await Promise.all(
      effectiveIndustryIds.map((id) =>
        supabase
          .from("articles")
          .select("id, title, summary_short, summary_medium, industry_id, tags, relevance_score, impact_level, published_at, is_breaking, source_url, affected_roles, deadline_hint")
          .eq("industry_id", id)
          .not("summary_medium", "is", null)
          .eq("is_suppressed", false)
          .order("published_at", { ascending: false })
          .limit(ARTICLES_PER_INDUSTRY),
      ),
    );
    articles = articleResults
      .flatMap((r) => r.data ?? [])
      .sort((a, b) => {
        const ta = a.published_at ? new Date(a.published_at).getTime() : 0;
        const tb = b.published_at ? new Date(b.published_at).getTime() : 0;
        return tb - ta;
      });
  }

  const industryNames = industries.map((i) => i.name);

  return (
    <div className="max-w-5xl mx-auto px-6 py-7">

      {/* ── Page header ──────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="block w-5 h-px" style={{ background: "#E08900" }} />
            <span
              className="text-[10px] font-semibold uppercase"
              style={{ letterSpacing: "0.2em", color: "#E08900" }}
            >
              Feed
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1
              className="text-[22px] font-light leading-tight"
              style={{ fontFamily: "var(--font-display), Georgia, serif", color: "#1A1813", letterSpacing: "-0.015em" }}
            >
              Mein Feed
            </h1>
            {isPersonalized && (
              <span
                className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                style={{ background: "#FFF6E0", color: "#E08900", border: "1px solid #FFD966", letterSpacing: "0.08em" }}
              >
                <Sparkles size={9} strokeWidth={2.5} />
                Personalisiert
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            {industryNames.map((name) => (
              <span
                key={name}
                className="text-[11px] font-medium px-2.5 py-0.5 rounded-full"
                style={{ background: "#F1EDE4", color: "#8C887E", border: "1px solid #E2DDD2" }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        <Link
          href="/dashboard/settings"
          className="flex items-center gap-1.5 text-xs font-semibold hover:-translate-y-px px-3 py-2 rounded-lg transition-all flex-shrink-0 cursor-pointer"
          style={{ background: "#FFFFFF", border: "1px solid #E2DDD2", color: "#57534A" }}
        >
          <Settings2 size={13} strokeWidth={1.75} />
          Branchen
        </Link>
      </div>

      {/* ── Free plan industry limit notice ──────────────── */}
      {!trialInfo.isFullAccess && filteredIndustryIds.length > 2 && (
        <p className="text-xs mb-4 mt-1" style={{ color: "#8C887E" }}>
          Im kostenlosen Zugang werden 2 Branchen angezeigt.{" "}
          <Link href="/dashboard/settings" className="font-semibold hover:underline" style={{ color: "#E08900" }}>
            Upgrade für alle {filteredIndustryIds.length} Branchen
          </Link>
        </p>
      )}

      {/* ── Content ──────────────────────────────────────── */}
      {articles.length === 0 ? (
        <div
          className="rounded-xl text-center py-14 px-6"
          style={{ background: "#FFFFFF", border: "1px solid #E2DDD2" }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
            style={{ background: "#FFF6E0", border: "1px solid #FFD966" }}
          >
            <Signal size={18} strokeWidth={1.75} color="#E08900" />
          </div>
          <h3
            className="text-sm font-semibold mb-1"
            style={{ color: "#1A1813" }}
          >
            Noch keine Artikel vorhanden
          </h3>
          <p className="text-xs max-w-xs mx-auto leading-relaxed" style={{ color: "#57534A" }}>
            Du beobachtest: <span className="font-medium" style={{ color: "#1A1813" }}>{industryNames.join(", ")}</span>.
            Die Agenten laufen stündlich und befüllen deinen Feed automatisch.
          </p>
          <Link
            href="/dashboard/settings"
            className="inline-block text-xs font-semibold hover:underline mt-4"
            style={{ color: "#E08900" }}
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
