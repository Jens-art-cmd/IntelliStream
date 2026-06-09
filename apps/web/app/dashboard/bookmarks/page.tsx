import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import ArticleCard from "@/components/feed/ArticleCard";

export const metadata: Metadata = { title: "Lesezeichen · IntelliStream" };

export default async function BookmarksPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;

  // 1) Lesezeichen-IDs holen, nach Speicherzeitpunkt sortiert
  const { data: bookmarkRows } = await db
    .from("bookmarks")
    .select("article_id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const articleIds: string[] = (bookmarkRows ?? []).map((b: any) => b.article_id as string);

  // 2) Artikel dazu laden (falls vorhanden)
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
  }[] = [];

  if (articleIds.length > 0) {
    const { data } = await supabase
      .from("articles")
      .select("id, title, summary_short, summary_medium, industry_id, tags, relevance_score, impact_level, published_at, is_breaking, source_url")
      .in("id", articleIds);

    // Reihenfolge der Lesezeichen beibehalten
    const byId = Object.fromEntries((data ?? []).map((a) => [a.id, a]));
    articles = articleIds.map((id) => byId[id]).filter(Boolean);
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-7">

      {/* ── Header ───────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tighter-md text-neutral-900">Lesezeichen</h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            {articles.length === 0
              ? "Noch keine Artikel gespeichert"
              : `${articles.length} gespeicherte${articles.length !== 1 ? " Artikel" : "r Artikel"}`}
          </p>
        </div>
      </div>

      {/* ── Empty state ──────────────────────────────────── */}
      {articles.length === 0 && (
        <div className="bg-white border border-neutral-100 rounded-xl text-center py-16 px-6 shadow-xs">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm"
            style={{ background: "linear-gradient(135deg, #ffca28 0%, #ff8f00 100%)" }}
          >
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-neutral-800 mb-1">Noch keine Lesezeichen</h3>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed mb-5">
            Klicke auf das Lesezeichen-Symbol bei einem Artikel, um ihn hier zu speichern.
          </p>
          <Link
            href="/dashboard/feed"
            className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl text-neutral-900 shadow-sm hover:shadow-md hover:-translate-y-px transition-all duration-200"
            style={{ background: "linear-gradient(135deg, #ffca28 0%, #ffb300 100%)" }}
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
            />
          ))}
        </div>
      )}

    </div>
  );
}
