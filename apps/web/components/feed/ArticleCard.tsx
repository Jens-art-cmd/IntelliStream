import Link from "next/link";
import type { ImpactLevel } from "@/types/database";

interface ArticleCardProps {
  article: {
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
  };
}

const IMPACT_BADGE: Record<ImpactLevel, { bg: string; text: string; border: string; dot: string; label: string }> = {
  high:   { bg: "bg-red-50",    text: "text-red-600",    border: "border-red-100",    dot: "bg-red-500",    label: "Hoch" },
  medium: { bg: "bg-amber-50",  text: "text-amber-600",  border: "border-amber-100",  dot: "bg-amber-500",  label: "Mittel" },
  low:    { bg: "bg-emerald-50",text: "text-emerald-600",border: "border-emerald-100",dot: "bg-emerald-500",label: "Gering" },
};

const ACCENT_CLASS: Record<ImpactLevel, string> = {
  high:   "card-accent-high",
  medium: "card-accent-medium",
  low:    "card-accent-low",
};

export default function ArticleCard({ article }: ArticleCardProps) {
  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  const impact      = article.impact_level ? IMPACT_BADGE[article.impact_level] : null;
  const accentClass = article.impact_level ? ACCENT_CLASS[article.impact_level] : "";
  const score       = article.relevance_score != null ? Math.round(article.relevance_score) : null;

  return (
    <article
      className={`
        bg-white border border-neutral-100 rounded-xl pl-5 pr-5 py-4
        hover:border-neutral-200 hover:shadow-card-hover hover:-translate-y-px
        transition-all duration-200 ${accentClass}
      `}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          {article.is_breaking && (
            <span className="text-2xs font-bold tracking-widest uppercase bg-red-600 text-white px-2 py-0.5 rounded-md">
              Breaking
            </span>
          )}
          {impact && (
            <span
              className={`inline-flex items-center gap-1.5 text-2xs font-semibold px-2.5 py-0.5 rounded-full border ${impact.bg} ${impact.text} ${impact.border}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${impact.dot}`} />
              {impact.label}
            </span>
          )}
        </div>
        {publishedDate && (
          <span className="text-2xs text-neutral-400 flex-shrink-0 tabular-nums font-medium">
            {publishedDate}
          </span>
        )}
      </div>

      {/* Title */}
      <Link href={`/dashboard/article/${article.id}`}>
        <h2 className="text-sm font-semibold text-neutral-900 hover:text-brand-700 leading-snug mb-2.5 tracking-tight-sm transition-colors">
          {article.title}
        </h2>
      </Link>

      {/* Summary */}
      {article.summary_medium && (
        <p className="text-xs text-neutral-500 leading-relaxed mb-3.5 line-clamp-2">
          {article.summary_medium}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {article.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-2xs font-medium text-neutral-400 bg-neutral-50 border border-neutral-100 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Score + source */}
        <div className="flex items-center gap-3">
          {score != null && (
            <div className="flex items-center gap-1.5">
              <div className="w-10 h-1 bg-neutral-100 rounded-full overflow-hidden">
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
              <span className="text-2xs text-neutral-400 font-mono">{score}</span>
            </div>
          )}
          <a
            href={article.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xs font-semibold text-brand-600 hover:text-brand-800 transition-colors flex items-center gap-1"
          >
            Quelle
            <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}
