import type { Metadata } from "next";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import ArticleCard from "@/components/feed/ArticleCard";

export const metadata: Metadata = { title: "Lesezeichen · DistillFeed" };

export default async function BookmarksPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;

  const [{ data: bookmarkRows }, { data: industriesData }] = await Promise.all([
    db
      .from("bookmarks")
      .select("article_id, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase.from("industries").select("id, name"),
  ]);

  const articleIds: string[] = (bookmarkRows ?? []).map((b: any) => b.article_id as string);
  const industryMap: Record<number, string> = Object.fromEntries(
    (industriesData ?? []).map((i: { id: number; name: string }) => [i.id, i.name])
  );

  let articles: {
    id: string;
    title: string;
    summary_short: string | null;
    summary_medium: string | null;
    industry_id: number;
    tags: string[];
    relevance_score: number | null;
    impact_level: "high" | "medium" | "low" | null;
    published_at: string | null;
    is_breaking: boolean;
    source_url: string;
    affected_roles: string | null;
    deadline_hint: string | null;
  }[] = [];

  if (articleIds.length > 0) {
    const { data } = await supabase
      .from("articles")
      .select("id, title, summary_short, summary_medium, industry_id, tags, relevance_score, impact_level, published_at, is_breaking, source_url, affected_roles, deadline_hint")
      .in("id", articleIds);

    const byId = Object.fromEntries((data ?? []).map((a) => [a.id, a]));
    articles = articleIds.map((id) => byId[id]).filter(Boolean);
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-7">

      {/* ── Header ───────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="block w-5 h-px" style={{ background: "#E08900" }} />
            <span className="text-[10px] font-semibold uppercase" style={{ letterSpacing: "0.2em", color: "#E08900" }}>
              Lesezeichen
            </span>
          </div>
          <h1
            className="text-[22px] font-light leading-tight"
            style={{ fontFamily: "var(--font-display), Georgia, serif", color: "#1A1813", letterSpacing: "-0.015em" }}
          >
            Gespeicherte Artikel
          </h1>
          <p className="text-xs mt-1" style={{ color: "#8C887E" }}>
            {articles.length === 0
              ? "Noch keine Artikel gespeichert"
              : `${articles.length} gespeicherte${articles.length !== 1 ? " Artikel" : "r Artikel"}`}
          </p>
        </div>
      </div>

      {/* ── Empty state ──────────────────────────────────── */}
      {articles.length === 0 && (
        <div
          className="rounded-xl text-center py-14 px-6"
          style={{ background: "#FFFFFF", border: "1px solid #E2DDD2" }}
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "#FFF6E0", border: "1px solid #FFD966" }}
          >
            <Bookmark size={20} strokeWidth={1.75} color="#E08900" />
          </div>
          <h3 className="text-sm font-semibold mb-1" style={{ color: "#1A1813" }}>
            Noch keine Lesezeichen
          </h3>
          <p className="text-xs max-w-xs mx-auto leading-relaxed mb-5" style={{ color: "#57534A" }}>
            Klicke auf das Lesezeichen-Symbol bei einem Artikel, um ihn hier zu speichern.
          </p>
          <Link
            href="/dashboard/feed"
            className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl hover:-translate-y-px transition-all duration-200"
            style={{ background: "#FFB300", color: "#1A1100", boxShadow: "0 4px 14px rgba(224,137,0,0.22)" }}
          >
            Zum Feed
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}

      {/* ── Article list ─────────────────────────────────── */}
      {articles.length > 0 && (
        <div className="space-y-2.5">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              isBookmarked={true}
              industryName={industryMap[article.industry_id]}
            />
          ))}
        </div>
      )}

    </div>
  );
}
