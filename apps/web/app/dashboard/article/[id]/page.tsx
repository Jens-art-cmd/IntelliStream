import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import type { ImpactLevel } from "@/types/database";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import BookmarkButton from "@/components/feed/BookmarkButton";

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("articles").select("title").eq("id", params.id).single();
  return { title: data?.title ?? "Artikel" };
}

const IMPACT_BADGE: Record<ImpactLevel, { bg: string; text: string; border: string; dot: string; label: string }> = {
  high:   { bg: "bg-red-50",    text: "text-red-600",    border: "border-red-100",    dot: "bg-red-500",    label: "Hoher Impact" },
  medium: { bg: "bg-amber-50",  text: "text-amber-600",  border: "border-amber-100",  dot: "bg-amber-500",  label: "Mittlerer Impact" },
  low:    { bg: "bg-emerald-50",text: "text-emerald-600",border: "border-emerald-100",dot: "bg-emerald-500",label: "Geringer Impact" },
};

export default async function ArticleDetailPage({ params }: Props) {
  const supabase = await createSupabaseServerClient();
  const { data: article } = await supabase.from("articles").select("*").eq("id", params.id).single();

  if (!article) notFound();

  const impact = article.impact_level ? IMPACT_BADGE[article.impact_level as ImpactLevel] : null;
  const score  = article.relevance_score != null ? Math.round(article.relevance_score) : null;

  // Bookmark-Status für diesen User laden
  const { data: { user } } = await supabase.auth.getUser();
  const { data: bm } = user
    ? await supabase.from("bookmarks").select("id").eq("user_id", user.id).eq("article_id", params.id).maybeSingle()
    : { data: null };
  const isBookmarked = !!bm;

  return (
    <div className="max-w-2xl mx-auto px-6 py-7">

      {/* ── Back + Bookmark ──────────────────────────────── */}
      <div className="flex items-center justify-between mb-7">
        <Link
          href="/dashboard/feed"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors group"
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Zurück zum Feed
        </Link>
        <BookmarkButton articleId={params.id} initialBookmarked={isBookmarked} size="md" />
      </div>

      {/* ── Badges ───────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 flex-wrap mb-4">
        {article.is_breaking && (
          <span className="text-2xs font-bold tracking-widest uppercase bg-red-600 text-white px-2.5 py-0.5 rounded-md">
            Breaking
          </span>
        )}
        {impact && (
          <span className={`inline-flex items-center gap-1.5 text-2xs font-semibold px-3 py-0.5 rounded-full border ${impact.bg} ${impact.text} ${impact.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${impact.dot}`} />
            {impact.label}
          </span>
        )}
      </div>

      {/* ── Title ────────────────────────────────────────── */}
      <h1 className="text-2xl font-extrabold tracking-tighter-xl leading-tight text-neutral-900 mb-4">
        {article.title}
      </h1>

      {/* ── Meta ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 flex-wrap mb-6 text-xs text-neutral-400">
        {article.published_at && (
          <span className="font-medium">
            {new Date(article.published_at).toLocaleDateString("de-DE", { dateStyle: "long" })}
          </span>
        )}
        {score != null && (
          <>
            <span className="text-neutral-200">·</span>
            <span className="flex items-center gap-2">
              <div className="w-12 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${score}%`,
                    background: score >= 70
                      ? "linear-gradient(90deg, #ffb300, #ff8c00)"
                      : "linear-gradient(90deg, #3a61b5, #2b4d9a)",
                  }}
                />
              </div>
              <span className="font-mono">Relevanz {score}/100</span>
            </span>
          </>
        )}
      </div>

      {/* ── Impact reason banner ─────────────────────────── */}
      {article.impact_reason && (
        <div className="flex gap-3 items-start bg-amber-50 border border-amber-100 rounded-xl px-4 py-4 mb-6">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #ffca28, #ff8f00)" }}
          >
            <span className="text-sm">⚡</span>
          </div>
          <div>
            <div className="text-2xs font-bold tracking-[.08em] uppercase text-amber-700 mb-1">
              Handlungsbedarf
            </div>
            <p className="text-sm text-neutral-700 leading-relaxed">{article.impact_reason}</p>
          </div>
        </div>
      )}

      {/* ── Long summary ─────────────────────────────────── */}
      {article.summary_long && (
        <div className="bg-white border border-neutral-100 rounded-xl px-6 py-5 mb-6 shadow-xs">
          <h3 className="text-2xs font-bold tracking-[.1em] uppercase text-neutral-400 mb-3">
            Zusammenfassung
          </h3>
          <p className="text-sm text-neutral-700 leading-[1.8]">{article.summary_long}</p>
        </div>
      )}

      {/* ── Tags ─────────────────────────────────────────── */}
      {article.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-7">
          {article.tags.map((tag: string) => (
            <span
              key={tag}
              className="text-2xs font-medium text-neutral-500 bg-white border border-neutral-150 px-2.5 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* ── CTA ──────────────────────────────────────────── */}
      <div className="flex items-center gap-3 pt-6 border-t border-neutral-100">
        <a
          href={article.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-px transition-all duration-200 text-neutral-900"
          style={{ background: "linear-gradient(135deg, #ffca28 0%, #ffb300 100%)" }}
        >
          Originalartikel lesen
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
        <Link
          href="/dashboard/feed"
          className="text-sm font-medium text-neutral-600 border border-neutral-200 px-4 py-2.5 rounded-xl hover:border-neutral-400 hover:bg-neutral-50 transition-all"
        >
          Zurück
        </Link>
      </div>
    </div>
  );
}
