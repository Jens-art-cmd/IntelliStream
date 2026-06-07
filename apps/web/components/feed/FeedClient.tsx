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

const IMPACT_OPTIONS: { value: ImpactLevel | "all"; label: string; color?: string }[] = [
  { value: "all",    label: "Alle" },
  { value: "high",   label: "Hoch",    color: "#ef4444" },
  { value: "medium", label: "Mittel",  color: "#f59e0b" },
  { value: "low",    label: "Gering",  color: "#22c55e" },
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
    <div className="space-y-5">

      {/* ── Filter bar ──────────────────────────────────── */}
      <div className="bg-white border border-neutral-100 rounded-xl px-4 py-3.5 space-y-3 shadow-xs">

        {/* Impact filter */}
        <div className="flex items-center gap-3">
          <span className="text-2xs font-bold tracking-[.08em] uppercase text-neutral-400 w-16 flex-shrink-0">
            Impact
          </span>
          <div className="flex items-center gap-1">
            {IMPACT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setImpact(opt.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                  impact === opt.value
                    ? "bg-neutral-900 text-white shadow-sm"
                    : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
                }`}
              >
                {opt.color && (
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: opt.color }}
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
            <span className="text-2xs font-bold tracking-[.08em] uppercase text-neutral-400 w-16 flex-shrink-0">
              Branche
            </span>
            <div className="flex items-center gap-1 flex-wrap">
              <button
                onClick={() => setIndustry("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                  industry === "all"
                    ? "bg-neutral-900 text-white shadow-sm"
                    : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
                }`}
              >
                Alle
              </button>
              {activeIndustries.map((ind) => (
                <button
                  key={ind.id}
                  onClick={() => setIndustry(ind.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                    industry === ind.id
                      ? "bg-neutral-900 text-white shadow-sm"
                      : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
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
      <p className="text-xs text-neutral-400 font-medium">
        {filtered.length} Artikel
        {(impact !== "all" || industry !== "all") && (
          <span className="ml-1.5 text-neutral-300">· gefiltert</span>
        )}
      </p>

      {/* ── Articles ────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-neutral-100 rounded-xl text-center py-14 px-6">
          <div className="text-3xl mb-3">🔍</div>
          <p className="text-sm font-medium text-neutral-700 mb-1">Keine Artikel für diese Filterauswahl</p>
          <button
            onClick={() => { setImpact("all"); setIndustry("all"); }}
            className="text-sm text-brand-600 font-medium hover:underline mt-2"
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
        <p className="text-center text-xs text-neutral-400 pt-3 pb-2">
          Zeige die 30 neuesten Artikel je Branche.{" "}
          <Link href="/dashboard/search" className="text-brand-600 font-semibold hover:underline">
            Zur Suche →
          </Link>
        </p>
      )}
    </div>
  );
}
