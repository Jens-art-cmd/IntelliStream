"use client";

import { useState, useTransition, useRef } from "react";
import Link from "next/link";

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
  { value: "hybrid",   label: "Smart",      desc: "Semantik + Volltext kombiniert" },
  { value: "semantic", label: "Semantisch", desc: "Bedeutung, nicht nur Stichwörter" },
  { value: "fulltext", label: "Volltext",   desc: "Exakte Begriffe und Phrasen" },
];

const IMPACT_COLOR: Record<string, string> = {
  high:   "bg-red-50 text-red-600 border-red-100",
  medium: "bg-amber-50 text-amber-600 border-amber-100",
  low:    "bg-emerald-50 text-emerald-600 border-emerald-100",
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    search(query, mode);
  }

  function handleModeChange(m: SearchMode) {
    setMode(m);
    if (query.trim()) search(query, m);
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-7">

      {/* ── Header ───────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tighter-md text-neutral-900">Suche</h1>
        <p className="text-xs text-neutral-400 mt-0.5">
          Durchsuche alle Branchennachrichten — semantisch oder per Volltext.
        </p>
      </div>

      {/* ── Search form ──────────────────────────────────── */}
      <div className="bg-white border border-neutral-100 rounded-xl p-4 mb-5 shadow-xs">
        <form onSubmit={handleSubmit} className="flex gap-2.5 mb-4">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </span>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="z.B. DSGVO Bußgeld, NIS2 Anforderungen, EV-Marktanteil…"
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-neutral-150 rounded-lg bg-neutral-25 focus:outline-none focus:border-amber-400 focus:bg-white focus:ring-gold transition-all"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={!query.trim() || isPending}
            className="px-5 py-2.5 text-sm font-bold rounded-lg text-neutral-900 shadow-sm hover:shadow-md hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200"
            style={{ background: isPending || !query.trim()
              ? undefined
              : "linear-gradient(135deg, #ffca28 0%, #ffb300 100%)"
            }}
          >
            {isPending ? (
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Suche…
              </span>
            ) : "Suchen"}
          </button>
        </form>

        {/* Mode selector */}
        <div className="flex items-center gap-3">
          <span className="text-2xs font-bold tracking-[.08em] uppercase text-neutral-400 flex-shrink-0">
            Modus
          </span>
          <div className="flex items-center gap-1">
            {MODE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleModeChange(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                  mode === opt.value
                    ? "bg-neutral-900 text-white shadow-sm"
                    : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <span className="text-2xs text-neutral-400 hidden sm:block">
            {MODE_OPTIONS.find(o => o.value === mode)?.desc}
          </span>
        </div>
      </div>

      {/* ── Error ────────────────────────────────────────── */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ── Results meta ─────────────────────────────────── */}
      {meta && !error && (
        <p className="text-xs text-neutral-400 mb-4 font-medium">
          {meta.count === 0
            ? "Keine Ergebnisse"
            : `${meta.count} Ergebnis${meta.count !== 1 ? "se" : ""}`}
          {meta.mode === "fulltext_fallback" && (
            <span className="ml-2 text-amber-600 font-normal">
              (Volltext-Fallback — semantische Suche wird aktiv sobald Embeddings geladen sind)
            </span>
          )}
        </p>
      )}

      {/* ── Empty state (after search) ───────────────────── */}
      {results !== null && results.length === 0 && !error && (
        <div className="bg-white border border-neutral-100 rounded-xl text-center py-16 shadow-xs">
          <div className="text-3xl mb-3">🔍</div>
          <p className="text-sm font-medium text-neutral-700">Keine Artikel gefunden für „{query}"</p>
          <p className="text-xs text-neutral-400 mt-1">Probiere andere Suchbegriffe oder wechsle den Modus.</p>
        </div>
      )}

      {/* ── Initial state ────────────────────────────────── */}
      {results === null && !isPending && (
        <div className="bg-white border border-neutral-100 rounded-xl text-center py-16 shadow-xs">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, #ffca28 0%, #ff8f00 100%)" }}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <p className="text-sm font-medium text-neutral-700">Gib einen Suchbegriff ein</p>
          <p className="text-xs text-neutral-400 mt-1">Semantisch, Volltext oder kombiniert.</p>
        </div>
      )}

      {/* ── Results list ─────────────────────────────────── */}
      {results && results.length > 0 && (
        <ul className="space-y-2.5">
          {results.map(article => (
            <li key={article.id}>
              <Link
                href={`/dashboard/article/${article.id}`}
                className="block bg-white border border-neutral-100 rounded-xl px-5 py-4 hover:border-neutral-200 hover:shadow-card-hover hover:-translate-y-px transition-all duration-200 group"
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-brand-700 leading-snug line-clamp-2 tracking-tight-sm">
                    {article.title}
                  </h3>
                  {article.impact_level && (
                    <span className={`flex-shrink-0 text-2xs font-semibold px-2.5 py-0.5 rounded-full border ${IMPACT_COLOR[article.impact_level]}`}>
                      {IMPACT_LABEL[article.impact_level]}
                    </span>
                  )}
                </div>

                {article.summary_medium && (
                  <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2 mb-2.5">
                    {article.summary_medium}
                  </p>
                )}

                <div className="flex items-center gap-3 text-2xs text-neutral-400 flex-wrap">
                  {article.published_at && (
                    <span className="font-medium">{formatDate(article.published_at)}</span>
                  )}
                  {article.relevance_score != null && (
                    <span>Relevanz {Math.round(article.relevance_score)}%</span>
                  )}
                  {article.similarity != null && (
                    <span className="flex items-center gap-1">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "linear-gradient(135deg, #ffca28, #ffb300)" }}
                      />
                      {Math.round(article.similarity * 100)}% Ähnlichkeit
                    </span>
                  )}
                  {article.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="bg-neutral-50 border border-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded-full">
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
