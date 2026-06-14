"use client";

import { useState, useMemo, useCallback, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
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
  affected_roles: string | null;
  deadline_hint: string | null;
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
  { value: "high",   label: "Hoch",    dot: "#DC2626" },
  { value: "medium", label: "Mittel",  dot: "#E08900" },
  { value: "low",    label: "Gering",  dot: "#2D7553" },
];

// Inner component — uses useSearchParams, must be inside <Suspense>
function FeedClientInner({ articles, industries, bookmarkedIds = new Set() }: Props) {
  const router    = useRouter();
  const pathname  = usePathname();
  const searchParams = useSearchParams();

  const [impact, setImpact] = useState<ImpactLevel | "all">(() => {
    const p = searchParams.get("impact");
    return (p === "high" || p === "medium" || p === "low") ? p : "all";
  });
  const [industry, setIndustry] = useState<number | "all">(() => {
    const raw = searchParams.get("industry");
    const n   = raw ? parseInt(raw, 10) : NaN;
    return isNaN(n) ? "all" : n;
  });

  const pushParams = useCallback(
    (newImpact: ImpactLevel | "all", newIndustry: number | "all") => {
      const params = new URLSearchParams();
      if (newImpact   !== "all") params.set("impact",   newImpact);
      if (newIndustry !== "all") params.set("industry", String(newIndustry));
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  const handleImpact   = (val: ImpactLevel | "all") => { setImpact(val);   pushParams(val, industry); };
  const handleIndustry = (val: number | "all")       => { setIndustry(val); pushParams(impact, val); };
  const resetFilters   = () => { setImpact("all"); setIndustry("all"); router.replace(pathname, { scroll: false }); };

  const activeIndustries = useMemo(
    () => industries.filter((ind) => articles.some((a) => a.industry_id === ind.id)),
    [articles, industries],
  );

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const impactMatch   = impact   === "all" || a.impact_level === impact;
      const industryMatch = industry === "all" || a.industry_id  === industry;
      return impactMatch && industryMatch;
    });
  }, [articles, impact, industry]);

  const filterBtn = (active: boolean): React.CSSProperties => active
    ? { background: "#FFB300", color: "#1A1100", fontWeight: 600, border: "1px solid #FFB300" }
    : { background: "#FAF8F4", color: "#57534A", border: "1px solid #E2DDD2" };

  return (
    <div className="space-y-4">

      {/* ── Filter bar ──────────────────────────────────────── */}
      <div
        className="px-5 py-4 space-y-3 rounded-xl"
        style={{ background: "#FFFFFF", border: "1px solid #E2DDD2" }}
      >
        {/* Impact filter */}
        <div className="flex items-center gap-3">
          <span
            className="text-[9px] font-bold uppercase flex-shrink-0 w-16"
            style={{ letterSpacing: "0.12em", color: "#8C887E" }}
          >
            Impact
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {IMPACT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleImpact(opt.value)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer"
                style={filterBtn(impact === opt.value)}
              >
                {opt.dot && (
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: opt.dot }} />
                )}
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Industry filter */}
        {activeIndustries.length > 1 && (
          <div className="flex items-center gap-3">
            <span
              className="text-[9px] font-bold uppercase flex-shrink-0 w-16"
              style={{ letterSpacing: "0.12em", color: "#8C887E" }}
            >
              Branche
            </span>

            {/* Bis 5 abonnierte Branchen → Pill-Buttons; ab 6 → Dropdown */}
            {industries.length <= 5 ? (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => handleIndustry("all")}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer"
                  style={filterBtn(industry === "all")}
                >
                  Alle
                </button>
                {activeIndustries.map((ind) => (
                  <button
                    key={ind.id}
                    onClick={() => handleIndustry(ind.id)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer"
                    style={filterBtn(industry === ind.id)}
                  >
                    {ind.name}
                  </button>
                ))}
              </div>
            ) : (
              <select
                value={industry === "all" ? "all" : String(industry)}
                onChange={(e) => handleIndustry(e.target.value === "all" ? "all" : parseInt(e.target.value, 10))}
                className="text-xs font-medium rounded-full px-3 py-1.5 cursor-pointer transition-all duration-150 outline-none"
                style={
                  industry !== "all"
                    ? { background: "#FFB300", color: "#1A1100", fontWeight: 600, border: "1px solid #FFB300" }
                    : { background: "#FAF8F4", color: "#57534A", border: "1px solid #E2DDD2" }
                }
              >
                <option value="all">Alle Branchen</option>
                {activeIndustries.map((ind) => (
                  <option key={ind.id} value={String(ind.id)}>
                    {ind.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      {/* ── Result count ────────────────────────────────────── */}
      <p className="text-xs font-medium px-1" style={{ color: "#57534A" }}>
        {filtered.length} Artikel
        {(impact !== "all" || industry !== "all") && (
          <span className="ml-1.5" style={{ color: "#C8C2B6" }}>· gefiltert</span>
        )}
      </p>

      {/* ── Articles ────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div
          className="text-center py-14 px-6 rounded-xl"
          style={{ background: "#FFFFFF", border: "1px solid #E2DDD2" }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
            style={{ background: "#FAF8F4", border: "1px solid #E2DDD2" }}
          >
            <Search size={18} strokeWidth={1.75} color="#8C887E" />
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: "#57534A" }}>
            Keine Artikel für diese Filterauswahl
          </p>
          <button
            onClick={resetFilters}
            className="text-sm font-semibold hover:underline mt-2 cursor-pointer"
            style={{ color: "#E08900" }}
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
        <p className="text-center text-xs pt-3 pb-2" style={{ color: "#8C887E" }}>
          Zeige die 30 neuesten Artikel je Branche.{" "}
          <Link href="/dashboard/search" className="font-semibold hover:underline" style={{ color: "#E08900" }}>
            Zur Suche →
          </Link>
        </p>
      )}
    </div>
  );
}

export default function FeedClient(props: Props) {
  return (
    <Suspense fallback={<div className="h-10" />}>
      <FeedClientInner {...props} />
    </Suspense>
  );
}
