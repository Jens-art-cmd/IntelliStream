import Link from "next/link";
import type { ImpactLevel } from "@/types/database";
import BookmarkButton from "./BookmarkButton";

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
  isBookmarked?: boolean;
}

const IMPACT_BADGE: Record<ImpactLevel, { text: string; dot: string; label: string; pill: string }> = {
  high:   { text: "text-red-500",     dot: "bg-red-400",     label: "Hoch",   pill: "bg-red-50"     },
  medium: { text: "text-amber-500",   dot: "bg-amber-400",   label: "Mittel", pill: "bg-amber-50"   },
  low:    { text: "text-emerald-500", dot: "bg-emerald-400", label: "Gering", pill: "bg-emerald-50" },
};

const ACCENT_CLASS: Record<ImpactLevel, string> = {
  high:   "card-accent-high",
  medium: "card-accent-medium",
  low:    "card-accent-low",
};

export default function ArticleCard({ article, isBookmarked = false }: ArticleCardProps) {
  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString("de-DE", {
        day: "2-digit", month: "short", year: "numeric",
      })
    : null;

  const impact      = article.impact_level ? IMPACT_BADGE[article.impact_level] : null;
  const accentClass = article.impact_level ? ACCENT_CLASS[article.impact_level] : "";
  const score       = article.relevance_score != null ? Math.round(article.relevance_score) : null;

  return (
    <article
      className={`group pl-5 pr-4 py-4 transition-all duration-200 ${accentClass}`}
      style={{
        background: "#e8eef5",
        boxShadow: "6px 6px 12px #c5cad3, -6px -6px 12px #ffffff",
        borderRadius: "18px",
      }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          {article.is_breaking && (
            <span
              className="text-2xs font-bold tracking-widest uppercase text-white px-2.5 py-0.5 rounded-lg"
              style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}
            >
              Breaking
            </span>
          )}
          {impact && (
            <span className={`inline-flex items-center gap-1.5 text-2xs font-semibold px-2.5 py-0.5 rounded-full ${impact.pill} ${impact.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${impact.dot}`} />
              {impact.label}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {publishedDate && (
            <span className="text-2xs text-neutral-400 tabular-nums font-medium">
              {publishedDate}
            </span>
          )}
          <BookmarkButton articleId={article.id} initialBookmarked={isBookmarked} />
        </div>
      </div>

      {/* Title */}
      <Link href={`/dashboard/article/${article.id}`}>
        <h2 className="text-sm font-semibold text-neutral-700 hover:text-amber-600 leading-snug mb-2.5 tracking-tight-sm transition-colors">
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
              className="text-2xs font-medium text-neutral-500 px-2.5 py-0.5 rounded-full"
              style={{
                background: "#e8eef5",
                boxShadow: "inset 2px 2px 4px #c5cad3, inset -2px -2px 4px #ffffff",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Score + source */}
        <div className="flex items-center gap-3">
          {score != null && (
            <div className="flex items-center gap-1.5">
              <div
                className="w-10 h-1.5 rounded-full overflow-hidden"
                style={{ boxShadow: "inset 1px 1px 3px #c5cad3, inset -1px -1px 3px #ffffff" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${score}%`,
                    background: score >= 70
                      ? "linear-gradient(90deg, #ffb300, #ff8c00)"
                      : "linear-gradient(90deg, #7c9fd4, #5c83cc)",
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
            className="text-2xs font-semibold text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-1"
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
