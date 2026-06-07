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

const IMPACT_STYLES: Record<ImpactLevel, string> = {
  high:   "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  low:    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

const IMPACT_LABEL: Record<ImpactLevel, string> = {
  high: "Hoher Impact", medium: "Mittlerer Impact", low: "Geringer Impact",
};

export default function ArticleCard({ article }: ArticleCardProps) {
  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" })
    : null;

  return (
    <article className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:shadow-md transition-shadow">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {article.is_breaking && (
            <span className="text-xs font-bold bg-red-600 text-white px-2 py-0.5 rounded">BREAKING</span>
          )}
          {article.impact_level && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${IMPACT_STYLES[article.impact_level]}`}>
              {IMPACT_LABEL[article.impact_level]}
            </span>
          )}
        </div>
        {publishedDate && (
          <span className="text-xs text-gray-400 flex-shrink-0">{publishedDate}</span>
        )}
      </div>

      {/* Title */}
      <Link href={`/dashboard/article/${article.id}`}>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 leading-snug mb-2">
          {article.title}
        </h2>
      </Link>

      {/* Summary */}
      {article.summary_medium && (
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
          {article.summary_medium}
        </p>
      )}

      {/* Tags + source */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex flex-wrap gap-1">
          {article.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
        <a
          href={article.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-brand-600 hover:underline"
        >
          Quelle →
        </a>
      </div>
    </article>
  );
}
