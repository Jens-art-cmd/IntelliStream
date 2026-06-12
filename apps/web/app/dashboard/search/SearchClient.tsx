"use client";

import { useState, useTransition, useRef } from "react";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  summary_medium: string | null;
  industry_id: number;
  tags: string[];
  relevance_score: number | null;
  impact_level: "high" | "medium" | "low" | null;
  published_at: string | null;
  similarity?: number;
}

type SearchMode = "hybrid" | "semantic" | "fulltext";

const MODE_OPTIONS: { value: SearchMode; label: string; desc: string }[] = [
  { value: "hybrid",   label: "Smart",       desc: "Semantik + Volltext kombiniert" },
  { value: "semantic", label: "Semantisch",  desc: "Bedeutung, nicht nur Stichwörter" },
  { value: "fulltext", label: "Volltext",    desc: "Exakte Begriffe und Phrasen" },
];

// Editorial impact badges
const IMPACT_STYLE: Record<string, React.CSSProperties> = {
  high:   { background: "#FEF0EE", color: "#C0392B", border: "1px solid #F5C6C1" },
  medium: { background: "#FFF6E0", color: "#E08900", border: "1px solid #FFD966" },
  low:    { background: "#F0F7F0", color: "#2D7553", border: "1px solid #A8D5A8" },
};
const IMPACT_LABEL: Record<string, string> = {
  high: "Hoch", medium: "Mittel", low: "Gering",
};

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" });
}

export default function SearchClient() {
  const [query,   setQuery]   = useState("");
  const [mode,    setMode]    = useState<SearchMode>("hybrid");
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [meta,    setMeta]    = useState<{ mode: string; count: number } | null>(null);
  const [error,   setError]   = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  async function search(q: string, m: SearchMode) {
    if (!q.trim()) return;
    setError(null);
    startTransition(async () => {
      try {
        const params = new URLSearchParams({ q: q.trim(), mode: m, limit: "20" });
        const res = await fetch(`/api/search?${params}`);
        if (!res.ok) throw new Error(`Suche fehlgeschlagen (${res.status})`);
        const json = await res.json() as { results: SearchResult[]; mode: string };
        setResults(json.results ?? []);
        setMeta({ mode: json.mode, count: json.results?.length ?? 0 });
      } catch (err) {
        setError((err as Error).message);
        setResults([]);
      }
    });
  }

  function handleSubmit(e: React.FormEvent) { e.preventDefault(); search(query, mode); }
  function handleModeChange(m: SearchMode) { setMode(m); if (query.trim()) search(query, m); }

  return (
    <div className="max-w-3xl mx-auto px-6 py-7">

      {/* ── Header ───────────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-1.5">
          <span className="block w-5 h-px" style={{ background: "#E08900" }} />
          <span className="text-[10px] font-semibold uppercase" style={{ letterSpacing: "0.2em", color: "#E08900" }}>
            Suche
          </span>
        </div>
        <h1
          className="text-[22px] font-light leading-tight"
          style={{ fontFamily: "var(--font-display), Georgia, serif", color: "#1A1813", letterSpacing: "-0.015em" }}
        >
          Artikel durchsuchen
        </h1>
        <p className="text-xs mt-1" style={{ color: "#8C887E" }}>
          Semantisch oder per Volltext — alle Branchennachrichten auf einmal.
        </p>
      </div>

      {/* ── Search form ──────────────────────────────────── */}
      <div className="rounded-xl p-4 mb-5" style={{ background: "#FFFFFF", border: "1px solid #E2DDD2" }}>
        <form onSubmit={handleSubmit} className="flex gap-2.5 mb-4">
          <div className="relative flex-1">
            <span
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "#8C887E" }}
            >
              <Search className="w-4 h-4" strokeWidth={1.75} />
            </span>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="z.B. DSGVO Bußgeld, NIS2 Anforderungen, EV-Marktanteil…"
              className="fl-input w-full pl-10 pr-4 py-2.5 text-sm"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={!query.trim() || isPending}
            className="px-5 py-2.5 text-sm font-bold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none hover:-translate-y-px transition-all duration-200 cursor-pointer"
            style={{
              background: query.trim() && !isPending ? "#FFB300" : "#E2DDD2",
              color: query.trim() && !isPending ? "#1A1100" : "#8C887E",
              boxShadow: query.trim() && !isPending ? "0 4px 14px rgba(224,137,0,0.22)" : "none",
            }}
          >
            {isPending ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Suche…
              </span>
            ) : "Suchen"}
          </button>
        </form>

        {/* Mode selector */}
        <div className="flex items-center gap-3">
          <span
            className="text-[9px] font-bold uppercase flex-shrink-0"
            style={{ letterSpacing: "0.14em", color: "#8C887E" }}
          >
            Modus
          </span>
          <div className="flex items-center gap-1">
            {MODE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleModeChange(opt.value)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer"
                style={
                  mode === opt.value
                    ? { background: "#1A1813", color: "#F7F5F0" }
                    : { color: "#57534A" }
                }
                onMouseEnter={e => { if (mode !== opt.value) (e.currentTarget as HTMLElement).style.background = "#F1EDE4"; }}
                onMouseLeave={e => { if (mode !== opt.value) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <span className="text-[11px] hidden sm:block" style={{ color: "#8C887E" }}>
            {MODE_OPTIONS.find(o => o.value === mode)?.desc}
          </span>
        </div>
      </div>

      {/* ── Error ────────────────────────────────────────── */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ background: "#FEF0EE", border: "1px solid #F5C6C1", color: "#C0392B" }}>
          {error}
        </div>
      )}

      {/* ── Results meta ─────────────────────────────────── */}
      {meta && !error && (
        <p className="text-xs mb-4 font-medium" style={{ color: "#8C887E" }}>
          {meta.count === 0
            ? "Keine Ergebnisse"
            : `${meta.count} Ergebnis${meta.count !== 1 ? "se" : ""}`}
          {meta.mode === "fulltext_fallback" && (
            <span className="ml-2 font-normal" style={{ color: "#E08900" }}>
              (Volltext-Fallback — semantische Suche wird aktiv sobald Embeddings geladen sind)
            </span>
          )}
        </p>
      )}

      {/* ── Empty state (after search) ───────────────────── */}
      {results !== null && results.length === 0 && !error && (
        <div className="rounded-xl text-center py-14" style={{ background: "#FFFFFF", border: "1px solid #E2DDD2" }}>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
            style={{ background: "#FAF8F4", border: "1px solid #E2DDD2" }}
          >
            <Search className="w-4 h-4" strokeWidth={1.75} style={{ color: "#8C887E" }} />
          </div>
          <p className="text-sm font-medium" style={{ color: "#57534A" }}>
            Keine Artikel gefunden für „{query}"
          </p>
          <p className="text-xs mt-1" style={{ color: "#8C887E" }}>
            Probiere andere Suchbegriffe oder wechsle den Modus.
          </p>
        </div>
      )}

      {/* ── Initial state ────────────────────────────────── */}
      {results === null && !isPending && (
        <div className="rounded-xl text-center py-14" style={{ background: "#FFFFFF", border: "1px solid #E2DDD2" }}>
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "#FFF6E0", border: "1px solid #FFD966" }}
          >
            <Search className="w-5 h-5" strokeWidth={1.75} style={{ color: "#E08900" }} />
          </div>
          <p className="text-sm font-medium" style={{ color: "#57534A" }}>
            Gib einen Suchbegriff ein
          </p>
          <p className="text-xs mt-1" style={{ color: "#8C887E" }}>
            Semantisch, Volltext oder kombiniert.
          </p>
        </div>
      )}

      {/* ── Results list ─────────────────────────────────── */}
      {results && results.length > 0 && (
        <ul className="space-y-2.5">
          {results.map(article => (
            <li key={article.id}>
              <Link
                href={`/dashboard/article/${article.id}`}
                className="fl-card block px-5 py-4 group cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <h3
                    className="text-sm font-semibold leading-snug line-clamp-2 tracking-tight transition-colors"
                    style={{ color: "#1A1813" }}
                  >
                    {article.title}
                  </h3>
                  {article.impact_level && (
                    <span
                      className="flex-shrink-0 text-2xs font-semibold px-2.5 py-0.5 rounded-full"
                      style={IMPACT_STYLE[article.impact_level]}
                    >
                      {IMPACT_LABEL[article.impact_level]}
                    </span>
                  )}
                </div>

                {article.summary_medium && (
                  <p className="text-xs leading-relaxed line-clamp-2 mb-2.5" style={{ color: "#57534A" }}>
                    {article.summary_medium}
                  </p>
                )}

                <div className="flex items-center gap-3 text-2xs flex-wrap" style={{ color: "#8C887E" }}>
                  {article.published_at && (
                    <span className="font-medium">{formatDate(article.published_at)}</span>
                  )}
                  {article.relevance_score != null && (
                    <span style={{ fontFamily: "var(--font-mono), monospace" }}>
                      Relevanz {Math.round(article.relevance_score)}%
                    </span>
                  )}
                  {article.similarity != null && (
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#FFB300" }} />
                      <span style={{ fontFamily: "var(--font-mono), monospace" }}>
                        {Math.round(article.similarity * 100)}% Ähnlichkeit
                      </span>
                    </span>
                  )}
                  {article.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 rounded-full"
                      style={{ background: "#FAF8F4", border: "1px solid #E2DDD2" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

    </div>
  );
}
