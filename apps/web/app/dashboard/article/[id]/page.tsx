import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import type { ImpactLevel } from "@/types/database";
import { createSupabaseServerClient } from "@/lib/supabase-server";

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("articles").select("title").eq("id", params.id).single();
  return { title: data?.title ?? "Artikel" };
}

const IMPACT_BADGE: Record<ImpactLevel, { bg: string; text: string; border: string; dot: string; label: string }> = {
  high:   { bg: "bg-red-50",   text: "text-red-600",   border: "border-red-100",   dot: "bg-red-500",   label: "Hoher Impact" },
  medium: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100", dot: "bg-amber-500", label: "Mittlerer Impact" },
  low:    { bg: "bg-green-50", text: "text-green-600", border: "border-green-100", dot: "bg-green-500", label: "Geringer Impact" },
};

export default async function ArticleDetailPage({ params }: Props) {
  const supabase = createSupabaseServerClient();
  const { data: article } = await supabase.from("articles").select("*").eq("id", params.id).single();

  if (!article) notFound();

  const impact = article.impact_level ? IMPACT_BADGE[article.impact_level as ImpactLevel] : null;
  const score  = article.relevance_score != null ? Math.round(article.relevance_score) : null;

  return (
    <div className="max-w-2xl mx-auto px-6 py-6">

      {/* Back */}
      <Link
        href="/dashboard/feed"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors mb-6"
      >
        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Zurück zum Feed
      </Link>

      {/* Badges */}
      <div className="flex items-center gap-1.5 flex-wrap mb-4">
        {article.is_breaking && (
          <span className="text-2xs font-bold tracking-[.06em] uppercase bg-red-600 text-white px-2 py-0.5 rounded">
            Breaking
          </span>
        )}
        {impact && (
          <span className={`inline-flex items-center gap-1 text-2xs font-semibold px-2.5 py-0.5 rounded-full border ${impact.bg} ${impact.text} ${impact.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${impact.dot}`} />
            {impact.label}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-2xl font-extrabold tracking-tighter-xl leading-tight text-neutral-900 mb-4">
        {article.title}
      </h1>

      {/* Meta */}
      <div className="flex items-center gap-2 flex-wrap mb-5 text-xs text-neutral-500">
        {article.published_at && (
          <span>{new Date(article.published_at).toLocaleDateString("de-DE", { dateStyle: "long" })}</span>
        )}
        {score != null && (
          <>
            <span className="text-neutral-300">·</span>
            <span className="flex items-center gap-1.5">
              <div className="w-10 h-1.5 bg-neutral-150 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full" style={{ width: `${score}%` }} />
              </div>
              <span className="font-mono text-neutral-400">Relevanz {score}/100</span>
            </span>
          </>
        )}
      </div>

      {/* Impact reason banner */}
      {article.impact_reason && (
        <div className="flex gap-3 items-start bg-amber-50 border border-amber-100 rounded-lg px-4 py-3.5 mb-5">
          <span className="text-lg mt-0.5">⚡</span>
          <div>
            <div className="text-2xs font-bold tracking-[.06em] uppercase text-amber-600 mb-1">Handlungsbedarf</div>
            <p className="text-sm text-neutral-700 leading-relaxed">{article.impact_reason}</p>
          </div>
        </div>
      )}

      {/* Long summary */}
      {article.summary_long && (
        <div className="mb-6">
          <h3 className="text-2xs font-bold tracking-[.08em] uppercase text-neutral-400 mb-3">Zusammenfassung</h3>
          <p className="text-sm text-neutral-700 leading-[1.75]">{article.summary_long}</p>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {article.tags.map((tag: string) => (
          <span
            key={tag}
            className="text-2xs font-medium text-neutral-500 bg-neutral-50 border border-neutral-100 px-2.5 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div className="flex items-center gap-3 pt-5 border-t border-neutral-100">
        <a
          href={article.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-brand-700 transition-colors"
        >
          Originalartikel lesen
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
        <Link
          href="/dashboard/feed"
          className="text-sm font-medium text-neutral-600 border border-neutral-200 px-4 py-2.5 rounded-md hover:border-neutral-400 hover:bg-neutral-25 transition-all"
        >
          Zurück
        </Link>
      </div>
    </div>
  );
}
