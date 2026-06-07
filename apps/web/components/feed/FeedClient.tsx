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
}

const IMPACT_OPTIONS: { value: ImpactLevel | "all"; label: string }[] = [
  { value: "all",    label: "Alle" },
  { value: "high",   label: "🔴 Hoch" },
  { value: "medium", label: "🟡 Mittel" },
  { value: "low",    label: "🟢 Gering" },
];

export default function FeedClient({ articles, industries }: Props) {
  const [impact, setImpact]     = useState<ImpactLevel | "all">("all");
  const [industry, setIndustry] = useState<number | "all">("all");

  // Only show industry pills that actually have articles
  const activeIndustries = useMemo(
    () => industries.filter((ind) => articles.some((a) => a.industry_id === ind.id)),
    [articles, industries],
  );

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const impactMatch = impact === "all" || a.impact_level === impact;
      const industryMatch = industry === "all" || a.industry_id === industry;
      return impactMatch && industryMatch;
    });
  }, [articles, impact, industry]);

  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <div className="space-y-3">
        {/* Impact filter */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mr-1">Impact:</span>
          {IMPACT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setImpact(opt.value)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                impact === opt.value
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-brand-400"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Industry filter — only shown if user has >1 industry with articles */}
        {activeIndustries.length > 1 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mr-1">Branche:</span>
            <button
              onClick={() => setIndustry("all")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                industry === "all"
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-brand-400"
              }`}
            >
              Alle
            </button>
            {activeIndustries.map((ind) => (
              <button
                key={ind.id}
                onClick={() => setIndustry(ind.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                  industry === ind.id
                    ? "bg-brand-600 text-white border-brand-600"
                    : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-brand-400"
                }`}
              >
                {ind.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Result count */}
      <p className="text-xs text-gray-400">
        {filtered.length} {filtered.length === 1 ? "Artikel" : "Artikel"}
        {(impact !== "all" || industry !== "all") && " (gefiltert)"}
      </p>

      {/* Articles */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">
          Keine Artikel für diese Filterauswahl.{" "}
          <button
            onClick={() => { setImpact("all"); setIndustry("all"); }}
            className="text-brand-600 hover:underline"
          >
            Filter zurücksetzen
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {/* Load more hint */}
      {articles.length >= 30 && (
        <p className="text-center text-xs text-gray-400 pt-2">
          Zeige jeweils die 30 neuesten Artikel pro Branche.{" "}
          <Link href="/dashboard/search" className="text-brand-600 hover:underline">
            Suche für ältere Artikel →
          </Link>
        </p>
      )}
    </div>
  );
}
