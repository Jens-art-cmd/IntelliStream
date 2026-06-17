"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Clock, Users } from "lucide-react";
import type { ImpactLevel } from "@/types/database";
import BookmarkButton from "./BookmarkButton";
import ThumbsButton from "./ThumbsButton";
import ShareButton from "./ShareButton";

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
    affected_roles: string | null;
    deadline_hint: string | null;
  };
  isBookmarked?: boolean;
  industryName?: string;
  isRead?: boolean;
  onRead?: (id: string) => void;
}

const IMPACT_BADGE: Record<ImpactLevel, { label: string; bg: string; text: string; border: string; dot: string }> = {
  high:   { label: "Hoher Impact",     bg: "#FEF0EE", text: "#C0392B", border: "#F5C6C1", dot: "#DC2626" },
  medium: { label: "Mittlerer Impact", bg: "#FFF6E0", text: "#E08900", border: "#FFD966", dot: "#E08900" },
  low:    { label: "Geringer Impact",  bg: "#F0F7F0", text: "#2D7553", border: "#A8D5A8", dot: "#2D7553" },
};

export default function ArticleCard({ article, isBookmarked = false, industryName, isRead = false, onRead }: ArticleCardProps) {
  const [titleHovered, setTitleHovered] = useState(false);

  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString("de-DE", {
        day: "2-digit", month: "short", year: "numeric",
      })
    : null;

  const impact = article.impact_level ? IMPACT_BADGE[article.impact_level] : null;
  const score  = article.relevance_score != null ? Math.round(article.relevance_score) : null;

  function handleTitleClick() {
    onRead?.(article.id);
  }

  return (
    <article
      className="fl-card group cursor-pointer"
      style={{ borderRadius: "12px", opacity: isRead ? 0.65 : 1, transition: "opacity 0.2s" }}
    >
      <div className="px-5 pt-4 pb-3">

        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            {isRead && (
              <span
                className="text-2xs font-medium px-2 py-0.5 rounded-md"
                style={{ background: "#F1EDE4", color: "#8C887E", border: "1px solid #E2DDD2" }}
              >
                Gelesen
              </span>
            )}
            {article.is_breaking && (
              <span
                className="text-2xs font-bold tracking-widest uppercase text-white px-2.5 py-0.5 rounded-md"
                style={{ background: "#DC2626" }}
              >
                Breaking
              </span>
            )}
            {impact && (
              <span
                className="inline-flex items-center gap-1.5 text-2xs font-semibold px-2.5 py-0.5 rounded-md"
                style={{ background: impact.bg, color: impact.text, border: `1px solid ${impact.border}` }}
              >
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: impact.dot }} />
                {impact.label}
              </span>
            )}
            {industryName && (
              <span
                className="text-2xs font-medium px-2.5 py-0.5 rounded-md"
                style={{ background: "#F1EDE4", color: "#8C887E", border: "1px solid #E2DDD2" }}
              >
                {industryName}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {publishedDate && (
              <span
                className="text-2xs tabular-nums"
                style={{ fontFamily: "var(--font-mono), monospace", color: "#8C887E" }}
              >
                {publishedDate}
              </span>
            )}
            <BookmarkButton articleId={article.id} initialBookmarked={isBookmarked} />
          </div>
        </div>

        {/* Title */}
        <Link href={`/dashboard/article/${article.id}`} onClick={handleTitleClick}>
          <h2
            className="text-sm font-semibold leading-snug mb-2 tracking-tight transition-colors"
            style={{ color: titleHovered ? "#E08900" : "#1A1813" }}
            onMouseEnter={() => setTitleHovered(true)}
            onMouseLeave={() => setTitleHovered(false)}
          >
            {article.title}
          </h2>
        </Link>

        {/* Summary */}
        {article.summary_medium && (
          <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: "#57534A" }}>
            {article.summary_medium}
          </p>
        )}

        {/* Deadline + Affected Roles */}
        {(article.deadline_hint || article.affected_roles) && (
          <div className="flex flex-wrap items-center gap-2 mb-1">
            {article.deadline_hint && (
              <span
                className="inline-flex items-center gap-1 text-2xs font-semibold px-2 py-0.5 rounded-md"
                style={{ background: "#FEF0EE", color: "#C0392B", border: "1px solid #F5C6C1" }}
              >
                <Clock size={10} strokeWidth={2.5} />
                {article.deadline_hint}
              </span>
            )}
            {article.affected_roles && (
              <span
                className="inline-flex items-center gap-1 text-2xs px-2 py-0.5 rounded-md"
                style={{ background: "#F1EDE4", color: "#57534A", border: "1px solid #E2DDD2" }}
              >
                <Users size={10} strokeWidth={2} />
                {article.affected_roles}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between flex-wrap gap-2 px-5 py-2.5"
        style={{ borderTop: "1px solid #E2DDD2" }}
      >
        <div className="flex flex-wrap gap-1.5">
          {article.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-2xs font-medium px-2 py-0.5 rounded-full"
              style={{ background: "#FAF8F4", border: "1px solid #E2DDD2", color: "#8C887E" }}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {score != null && (
            <div className="flex items-center gap-1.5">
              <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ background: "#D0CCC4" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${score}%`,
                    background: score >= 70
                      ? "linear-gradient(90deg, #FFB300, #E08900)"
                      : "linear-gradient(90deg, #A8A29E, #78716C)",
                  }}
                />
              </div>
              <span
                className="text-2xs tabular-nums font-medium"
                style={{ fontFamily: "var(--font-mono), monospace", color: "#57534A" }}
              >
                {score}
              </span>
            </div>
          )}

          <ThumbsButton articleId={article.id} size="compact" />
          <ShareButton articleId={article.id} title={article.title} />

          <a
            href={article.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            style={{ color: "#E08900" }}
            onClick={e => e.stopPropagation()}
          >
            Quelle
            <ArrowUpRight size={10} strokeWidth={2} />
          </a>
        </div>
      </div>
    </article>
  );
}
