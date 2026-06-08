"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import ArticleCard from "./ArticleCard";
import type { ImpactLevel } from "@/types/database";

interface Article {
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
}

interface Industry {
  id: number;
  name: string;
}

interface Props {
  articles: Article[];
  industries: Industry[];
  bookmarkedIds?: Set<string>;
}

const IMPACT_OPTIONS: { value: ImpactLevel | "all"; label: string; dot?: string }[] = [
  { value: "all",    label: "Alle" },
  { value: "high",   label: "Hoch",    dot: "#ef4444" },
  { value: "medium", label: "Mittel",  dot: "#f59e0b" },
  { value: "low",    label: "Gering",  dot: "#22c55e" },
];

export default function FeedClient({ articles, industries, bookmarkedIds = new Set() }: Props) {
  const [impact, setImpact]     = useState<ImpactLevel | "all">("all");
  const [industry, setIndustry] = useState<number | "all">("all");

  const activeIndustries = useMemo(
    () => industries.filter((ind) => articles.some((a) => a.industry_id === ind.id)),
    [articles, industries],
  );

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const impactMatch   = impact   === "all" || a.impact_level === impact;
      const industryMatch = industry === "all" || a.industry_id === industry;
      return impactMatch && industryMatch;
    });
  }, [articles, impact, industry]);

  const filterBtnStyle = (active: boolean) => active
    ? {
        boxShadow: "inset 3px 3px 6px #c0c5ce, inset -1px -1px 4px #ffffff",
        background: "#e8eef5",
        color: "#1f2937",
        fontWeight: 600,
        border: "1.5px solid rgba(217, 119, 6, 0.45)",
      }
    : {
        boxShadow: "3px 3px 6px #c5cad3, -3px -3px 6px #ffffff",
        background: "#e8eef5",
        color: "#4b5563",
        border: "1.5px solid transparent",
      };

  return (
    <div className="space-y-4">

      {/* ── Filter bar ──────────────────────────────────────── */}
      <div
        className="px-5 py-4 space-y-3"
        style={{
          background: "#e8eef5",
          boxShadow: "8px 8px 16px #c5cad3, -8px -8px 16px #ffffff",
          borderRadius: "18px",
        }}
      >
        {/* Impact filter */}
        <div className="flex items-center gap-3">
          <span className="text-2xs font-bold tracking-[.08em] uppercase text-neutral-500 w-16 flex-shrink-0">
            Impact
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {IMPACT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setImpact(opt.value)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all duration-150"
                style={filterBtnStyle(impact === opt.value)}
              >
                {opt.dot && (
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: opt.dot }}
                  />
                )}
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Industry filter */}
        {activeIndustries.length > 1 && (
          <div className="flex items-center gap-3">
            <span className="text-2xs font-bold tracking-[.08em] uppercase text-neutral-500 w-16 flex-shrink-0">
              Branche
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setIndustry("all")}
                className="px-3 py-1.5 rounded-full text-xs transition-all duration-150"
                style={filterBtnStyle(industry === "all")}
              >
                Alle
              </button>
              {activeIndustries.map((ind) => (
                <button
                  key={ind.id}
                  onClick={() => setIndustry(ind.id)}
                  className="px-3 py-1.5 rounded-full text-xs transition-all duration-150"
                  style={filterBtnStyle(industry === ind.id)}
                >
                  {ind.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Result count ────────────────────────────────────── */}
      <p className="text-xs text-neutral-600 font-medium px-1">
        {filtered.length} Artikel
        {(impact !== "all" || industry !== "all") && (
          <span className="ml-1.5 text-neutral-300">· gefiltert</span>
        )}
      </p>

      {/* ── Articles ────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div
          className="text-center py-14 px-6"
          style={{
            background: "#e8eef5",
            boxShadow: "8px 8px 16px #c5cad3, -8px -8px 16px #ffffff",
            borderRadius: "18px",
          }}
        >
          <div className="text-3xl mb-3">🔍</div>
          <p className="text-sm font-medium text-neutral-600 mb-1">Keine Artikel für diese Filterauswahl</p>
          <button
            onClick={() => { setImpact("all"); setIndustry("all"); }}
            className="text-sm text-amber-600 font-medium hover:underline mt-2"
          >
            Filter zurücksetzen
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((article) => (
            <ArticleCard key={article.id} article={article} isBookmarked={bookmarkedIds.has(article.id)} />
          ))}
        </div>
      )}

      {/* ── Load-more hint ──────────────────────────────────── */}
      {articles.length >= 30 && (
        <p className="text-center text-xs text-neutral-400 pt-3 pb-2">
          Zeige die 30 neuesten Artikel je Branche.{" "}
          <Link href="/dashboard/search" className="text-amber-600 font-semibold hover:underline">
            Zur Suche →
          </Link>
        </p>
      )}
    </div>
  );
}
