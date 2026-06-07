"use client";

import { useState, useTransition, useRef } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";

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

const MODE_OPTIONS: { value: SearchMode; label: string }[] = [
  { value: "hybrid",   label: "Smart" },
  { value: "semantic", label: "Semantisch" },
  { value: "fulltext", label: "Volltext" },
];

const IMPACT_COLOR: Record<string, string> = {
  high:   "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low:    "bg-green-100 text-green-700",
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

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  async function search(q: string, m: SearchMode) {
    if (!q.trim()) return;
    setError(null);

    startTransition(async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        const params = new URLSearchParams({
          q: q.trim(),
          mode: m,
          limit: "20",
        });

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/search?${params}`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} },
        );

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
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900 tracking-tight">Suche</h1>
        <p className="text-sm text-neutral-500 mt-0.5">
          Durchsuche alle Branchennachrichten — semantisch oder per Volltext.
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="z.B. DSGVO Bußgeld, NIS2 Anforderungen, EV-Marktanteil…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-neutral-200 rounded-lg bg-white focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-50 transition-all"
            autoFocus
          />
        </div>
        <button
          type="submit"
          disabled={!query.trim() || isPending}
          className="px-4 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? "…" : "Suchen"}
        </button>
      </form>

      {/* Mode segmented control */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs text-neutral-400 font-medium">Modus</span>
        <div className="flex items-center bg-neutral-100 rounded-md p-0.5 gap-0.5">
          {MODE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleModeChange(opt.value)}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                mode === opt.value
                  ? "bg-white text-neutral-900 shadow-sm font-semibold"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {mode === "hybrid" && (
          <span className="text-xs text-neutral-400">Semantik + Volltext kombiniert</span>
        )}
        {mode === "semantic" && (
          <span className="text-xs text-neutral-400">Bedeutung, nicht nur Stichwörter</span>
        )}
        {mode === "fulltext" && (
          <span className="text-xs text-neutral-400">Exakte Begriffe und Phrasen</span>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Results meta */}
      {meta && !error && (
        <p className="text-xs text-neutral-400 mb-4">
          {meta.count === 0
            ? "Keine Ergebnisse"
            : `${meta.count} Ergebnis${meta.count !== 1 ? "se" : ""}`}
          {meta.mode === "fulltext_fallback" && (
            <span className="ml-2 text-amber-600">(Volltext-Fallback — semantische Suche wird aktiv sobald Embeddings geladen sind)</span>
          )}
        </p>
      )}

      {/* Empty state */}
      {results !== null && results.length === 0 && !error && (
        <div className="text-center py-14">
          <p className="text-sm text-neutral-500">Keine Artikel gefunden für „{query}"</p>
          <p className="text-xs text-neutral-400 mt-1">Probiere andere Suchbegriffe oder wechsle den Modus.</p>
        </div>
      )}

      {/* Initial state */}
      {results === null && !isPending && (
        <div className="text-center py-14 text-neutral-400">
          <svg className="w-10 h-10 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <p className="text-sm">Gib einen Suchbegriff ein</p>
        </div>
      )}

      {/* Results list */}
      {results && results.length > 0 && (
        <ul className="space-y-2">
          {results.map(article => (
            <li key={article.id}>
              <Link
                href={`/dashboard/article/${article.id}`}
                className="block bg-white border border-neutral-150 rounded-lg px-5 py-4 hover:border-neutral-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-brand-600 leading-snug line-clamp-2">
                    {article.title}
                  </h3>
                  {article.impact_level && (
                    <span className={`flex-shrink-0 text-2xs font-bold px-2 py-0.5 rounded-full ${IMPACT_COLOR[article.impact_level]}`}>
                      {IMPACT_LABEL[article.impact_level]}
                    </span>
                  )}
                </div>

                {article.summary_medium && (
                  <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2 mb-2">
                    {article.summary_medium}
                  </p>
                )}

                <div className="flex items-center gap-3 text-2xs text-neutral-400">
                  {article.published_at && <span>{formatDate(article.published_at)}</span>}
                  {article.relevance_score != null && (
                    <span>Relevanz {Math.round(article.relevance_score)}%</span>
                  )}
                  {article.similarity != null && (
                    <span>Ähnlichkeit {Math.round(article.similarity * 100)}%</span>
                  )}
                  {article.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded">
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
