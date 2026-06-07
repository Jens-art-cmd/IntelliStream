import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import type { ImpactLevel } from "@/types/database";
import { createSupabaseServerClient } from "@/lib/supabase-server";

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("articles").select("title").eq("id", params.id).single();
  return { title: data?.title ?? "Artikel" };
}

export default async function ArticleDetailPage({ params }: Props) {
  const supabase = createSupabaseServerClient();
  const { data: article } = await supabase.from("articles").select("*").eq("id", params.id).single();

  if (!article) notFound();

  const impactColors: Record<ImpactLevel, string> = {
    high: "text-red-600", medium: "text-amber-600", low: "text-green-600",
  };
  const impactColor = article.impact_level ? impactColors[article.impact_level as ImpactLevel] : "";

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link href="/dashboard/feed" className="text-sm text-brand-600 hover:underline mb-6 inline-block">← Zurück zum Feed</Link>

      {article.is_breaking && <span className="inline-block mb-3 text-xs font-bold bg-red-600 text-white px-2 py-0.5 rounded">BREAKING</span>}

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">{article.title}</h1>

      <div className="flex flex-wrap gap-2 mb-5 text-sm text-gray-500">
        {article.published_at && <span>{new Date(article.published_at).toLocaleDateString("de-DE", { dateStyle: "long" })}</span>}
        {article.impact_level && (
          <span className={`font-medium ${impactColor}`}>
            Impact: {article.impact_level === "high" ? "Hoch" : article.impact_level === "medium" ? "Mittel" : "Gering"}
          </span>
        )}
        {article.relevance_score != null && <span>Relevanz: {Math.round(article.relevance_score)}/100</span>}
      </div>

      {article.impact_reason && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-5 text-sm text-amber-800 dark:text-amber-200">
          <strong>Handlungsbedarf:</strong> {article.impact_reason}
        </div>
      )}

      {article.summary_long && (
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">Zusammenfassung</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">{article.summary_long}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-1 mb-6">
        {article.tags.map((tag) => (
          <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">{tag}</span>
        ))}
      </div>

      <a href={article.source_url} target="_blank" rel="noopener noreferrer"
        className="inline-block bg-brand-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-brand-700">
        Originalartikel lesen →
      </a>
    </div>
  );
}
