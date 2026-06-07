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

const IMPACT_OPTIONS: { value: ImpactLevel | "all"; label: string; dot?: string }[] = [
  { value: "all",    label: "Alle" },
  { value: "high",   label: "Hoch",   dot: "bg-red-500" },
  { value: "medium", label: "Mittel", dot: "bg-amber-500" },
  { value: "low",    label: "Gering", dot: "bg-green-500" },
];

export default function FeedClient({ articles, industries }: Props) {
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

  return (
    <div className="space-y-4">

      {/* ── Filter bar ──────────────────────────────────── */}
      <div className="space-y-2.5">

        {/* Impact segmented control */}
        <div className="flex items-center gap-2.5">
          <span className="text-2xs font-bold tracking-[.06em] uppercase text-neutral-400 w-14 flex-shrink-0">
            Impact
          </span>
          <div className="flex items-center bg-neutral-100 rounded-md p-0.5 gap-0.5">
            {IMPACT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setImpact(opt.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  impact === opt.value
                    ? "bg-neutral-0 text-neutral-900 font-semibold shadow-xs"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                {opt.dot && <span className={`w-1.5 h-1.5 rounded-full ${opt.dot}`} />}
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Industry segmented control */}
        {activeIndustries.length > 1 && (
          <div className="flex items-center gap-2.5">
            <span className="text-2xs font-bold tracking-[.06em] uppercase text-neutral-400 w-14 flex-shrink-0">
              Branche
            </span>
            <div className="flex items-center bg-neutral-100 rounded-md p-0.5 gap-0.5 flex-wrap">
              <button
                onClick={() => setIndustry("all")}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  industry === "all"
                    ? "bg-neutral-0 text-neutral-900 font-semibold shadow-xs"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                Alle
              </button>
              {activeIndustries.map((ind) => (
                <button
                  key={ind.id}
                  onClick={() => setIndustry(ind.id)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                    industry === ind.id
                      ? "bg-neutral-0 text-neutral-900 font-semibold shadow-xs"
                      : "text-neutral-500 hover:text-neutral-700"
                  }`}
                >
                  {ind.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Result count ────────────────────────────────── */}
      <p className="text-xs text-neutral-400">
        {filtered.length} Artikel
        {(impact !== "all" || industry !== "all") && " · gefiltert"}
      </p>

      {/* ── Articles ────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="text-center py-14 text-neutral-500">
          <p className="text-sm mb-2">Keine Artikel für diese Filterauswahl.</p>
          <button
            onClick={() => { setImpact("all"); setIndustry("all"); }}
            className="text-sm text-brand-600 font-medium hover:underline"
          >
            Filter zurücksetzen
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {/* ── Load-more hint ──────────────────────────────── */}
      {articles.length >= 30 && (
        <p className="text-center text-xs text-neutral-400 pt-3">
          Zeige die 30 neuesten Artikel pro Branche.{" "}
          <Link href="/dashboard/search" className="text-brand-600 font-medium hover:underline">
            Suche für ältere Artikel →
          </Link>
        </p>
      )}
    </div>
  );
}
