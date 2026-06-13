import Link from "next/link";
import type { ImpactLevel } from "@/types/database";

interface SimilarArticle {
  id: string;
  title: string;
  summary_medium: string | null;
  industry_id: number;
  impact_level: ImpactLevel | null;
  published_at: string | null;
}

interface Props {
  articles: SimilarArticle[];
}

const IMPACT_DOT: Record<ImpactLevel, string> = {
  high:   "#DC2626",
  medium: "#E08900",
  low:    "#2D7553",
};

export default function SimilarArticles({ articles }: Props) {
  if (articles.length === 0) return null;

  return (
    <div className="mt-10 pt-7" style={{ borderTop: "1px solid #E2DDD2" }}>

      {/* Section header */}
      <div className="flex items-center gap-2.5 mb-5">
        <span className="block w-4 h-px" style={{ background: "#E08900" }} />
        <span
          className="text-[9px] font-bold uppercase"
          style={{ letterSpacing: "0.16em", color: "#8C887E" }}
        >
          Ähnliche Artikel
        </span>
      </div>

      <div className="space-y-3">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/dashboard/article/${article.id}`}
            className="block group rounded-xl px-5 py-4 transition-all duration-200 hover:-translate-y-px"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2DDD2",
            }}
          >
            <div className="flex items-start gap-3">
              {/* Impact dot */}
              {article.impact_level && (
                <span
                  className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: IMPACT_DOT[article.impact_level] }}
                />
              )}

              <div className="min-w-0 flex-1">
                <p
                  className="text-sm font-semibold leading-snug mb-1.5 group-hover:opacity-80 transition-opacity"
                  style={{ color: "#1A1813" }}
                >
                  {article.title}
                </p>

                {article.summary_medium && (
                  <p
                    className="text-xs leading-relaxed line-clamp-2"
                    style={{ color: "#57534A" }}
                  >
                    {article.summary_medium}
                  </p>
                )}

                {article.published_at && (
                  <p className="text-[11px] mt-2" style={{ color: "#C8C2B6" }}>
                    {new Date(article.published_at).toLocaleDateString("de-DE", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>

              {/* Arrow */}
              <svg
                className="flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                width="14"
                height="14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#E08900"
                strokeWidth="2.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
