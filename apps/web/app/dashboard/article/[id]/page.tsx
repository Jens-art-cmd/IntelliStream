import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Zap, Lock, Clock, Users, AlertTriangle } from "lucide-react";
import type { ImpactLevel } from "@/types/database";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getTrialInfo } from "@/lib/trial";
import BookmarkButton from "@/components/feed/BookmarkButton";
import ThumbsButton from "@/components/feed/ThumbsButton";
import BackButton from "@/components/ui/BackButton";
import SimilarArticles from "@/components/feed/SimilarArticles";

// Next.js 15: params ist ein Promise
interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("articles").select("title").eq("id", id).single();
  return { title: data?.title ?? "Artikel" };
}

// Editorial impact badges — functional signal colors on warm tones
const IMPACT_BADGE: Record<ImpactLevel, { bg: string; text: string; border: string; dot: string; label: string }> = {
  high:   { bg: "#FEF0EE", text: "#C0392B", border: "#F5C6C1", dot: "#DC2626", label: "Hoher Impact"    },
  medium: { bg: "#FFF6E0", text: "#E08900", border: "#FFD966", dot: "#E08900", label: "Mittlerer Impact" },
  low:    { bg: "#F0F7F0", text: "#2D7553", border: "#A8D5A8", dot: "#2D7553", label: "Geringer Impact"  },
};

export default async function ArticleDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: article } = await supabase.from("articles").select("*").eq("id", id).single();

  if (!article) notFound();

  const impact = article.impact_level ? IMPACT_BADGE[article.impact_level as ImpactLevel] : null;
  const score  = article.relevance_score != null ? Math.round(article.relevance_score) : null;

  const { data: { user } } = await supabase.auth.getUser();

  // Embedding für Ähnlichkeitssuche + Bookmark + Plan parallel laden
  const [
    { data: bm },
    { data: userData },
    { data: embeddingRow },
  ] = await Promise.all([
    user
      ? supabase.from("bookmarks").select("id").eq("user_id", user.id).eq("article_id", id).maybeSingle()
      : Promise.resolve({ data: null }),
    user
      ? supabase.from("users").select("plan, trial_ends_at").eq("id", user.id).single()
      : Promise.resolve({ data: null }),
    supabase.from("articles").select("embedding, industry_id").eq("id", id).single(),
  ]);

  // Ähnliche Artikel via Vektor-Ähnlichkeit (nur wenn Embedding vorhanden)
  let similarArticles: {
    id: string; title: string; summary_medium: string | null;
    industry_id: number; impact_level: ImpactLevel | null; published_at: string | null;
  }[] = [];

  if (embeddingRow?.embedding) {
    const { data: similar } = await supabase.rpc("search_articles", {
      query_embedding:  embeddingRow.embedding,
      industry_ids:     null,   // alle Branchen
      match_threshold:  0.75,
      match_count:      5,
      offset_count:     0,
    });
    // Aktuellen Artikel ausschließen, max. 4 anzeigen
    similarArticles = (similar ?? [])
      .filter((a: { id: string }) => a.id !== id)
      .slice(0, 4)
      .map((a: {
        id: string; title: string; summary_medium: string | null;
        industry_id: number; impact_level: ImpactLevel | null; published_at: string | null;
      }) => a);
  }

  const isBookmarked = !!bm;
  const { isFullAccess } = getTrialInfo({
    plan: userData?.plan ?? "free",
    trial_ends_at: userData?.trial_ends_at,
  });

  return (
    <div className="max-w-2xl mx-auto px-6 py-7">

      {/* ── Back + Bookmark ──────────────────────────────── */}
      <div className="flex items-center justify-between mb-7">
        <BackButton label="Zurück zum Feed" variant="link" />
        <BookmarkButton articleId={id} initialBookmarked={isBookmarked} size="md" />
      </div>

      {/* ── Eyebrow + Badges ─────────────────────────────── */}
      <div className="flex items-center gap-1.5 flex-wrap mb-4">
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
            className="inline-flex items-center gap-1.5 text-2xs font-semibold px-3 py-0.5 rounded-full"
            style={{ background: impact.bg, color: impact.text, border: `1px solid ${impact.border}` }}
          >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: impact.dot }} />
            {impact.label}
          </span>
        )}
        {article.deadline_hint && (
          <span
            className="inline-flex items-center gap-1.5 text-2xs font-semibold px-3 py-0.5 rounded-full"
            style={{ background: "#FEF0EE", color: "#C0392B", border: "1px solid #F5C6C1" }}
          >
            <Clock size={10} strokeWidth={2.5} />
            {article.deadline_hint}
          </span>
        )}
        {article.affected_roles && (
          <span
            className="inline-flex items-center gap-1.5 text-2xs font-medium px-3 py-0.5 rounded-full"
            style={{ background: "#F1EDE4", color: "#57534A", border: "1px solid #E2DDD2" }}
          >
            <Users size={10} strokeWidth={2} />
            {article.affected_roles}
          </span>
        )}
      </div>

      {/* ── Title ────────────────────────────────────────── */}
      <h1
        className="text-[26px] font-light leading-tight mb-4"
        style={{
          fontFamily: "var(--font-display), Georgia, serif",
          letterSpacing: "-0.02em",
          color: "#1A1813",
        }}
      >
        {article.title}
      </h1>

      {/* ── Meta ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 flex-wrap mb-6 text-xs" style={{ color: "#8C887E" }}>
        {article.published_at && (
          <span className="font-medium">
            {new Date(article.published_at).toLocaleDateString("de-DE", { dateStyle: "long" })}
          </span>
        )}
        {score != null && (
          <>
            <span style={{ color: "#C8C2B6" }}>·</span>
            <span className="flex items-center gap-2">
              <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ background: "#E2DDD2" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${score}%`,
                    background: score >= 70
                      ? "linear-gradient(90deg, #FFB300, #E08900)"
                      : "linear-gradient(90deg, #C8C2B6, #8C887E)",
                  }}
                />
              </div>
              <span style={{ fontFamily: "var(--font-mono), monospace" }}>
                Relevanz {score}/100
              </span>
            </span>
          </>
        )}
      </div>

      {/* ── Handlungsbox: action_required (konkret) + impact_reason (Kontext) ── */}
      {(article.action_required || article.impact_reason) && (
        <div className="rounded-xl overflow-hidden mb-6" style={{ border: "1px solid #FFD966" }}>
          {/* Konkrete Handlung */}
          {article.action_required && article.action_required !== "Zur Kenntnis nehmen." && (
            <div className="flex gap-3 items-start px-4 py-4" style={{ background: "#FFF6E0" }}>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "#FFB300" }}
              >
                <AlertTriangle size={14} strokeWidth={2.5} color="#1A1100" />
              </div>
              <div>
                <div className="text-2xs font-bold uppercase mb-1" style={{ letterSpacing: "0.08em", color: "#E08900" }}>
                  Was jetzt zu tun ist
                </div>
                <p className="text-sm font-medium leading-relaxed" style={{ color: "#1A1813" }}>
                  {article.action_required}
                </p>
              </div>
            </div>
          )}
          {/* Warum dieser Impact-Level */}
          {article.impact_reason && (
            <div
              className="flex gap-3 items-start px-4 py-3"
              style={{
                background: "#FFFBF0",
                borderTop: article.action_required && article.action_required !== "Zur Kenntnis nehmen."
                  ? "1px solid #FFD966" : undefined,
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "#F1EDE4" }}
              >
                <Zap size={14} strokeWidth={2} color="#E08900" />
              </div>
              <div>
                <div className="text-2xs font-bold uppercase mb-1" style={{ letterSpacing: "0.08em", color: "#8C887E" }}>
                  Einschätzung
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#57534A" }}>
                  {article.impact_reason}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Summary (gated by plan) ───────────────────────── */}
      {isFullAccess ? (
        article.summary_long && (
          <div
            className="rounded-xl px-6 py-5 mb-6"
            style={{ background: "#FFFFFF", border: "1px solid #E2DDD2" }}
          >
            <div className="flex items-center gap-2.5 mb-3">
              <span className="block w-4 h-px" style={{ background: "#E08900" }} />
              <span
                className="text-[9px] font-bold uppercase"
                style={{ letterSpacing: "0.16em", color: "#8C887E" }}
              >
                KI-Analyse
              </span>
            </div>
            <p className="text-sm leading-[1.8]" style={{ color: "#57534A" }}>
              {article.summary_long}
            </p>
          </div>
        )
      ) : (
        <>
          {article.summary_short && (
            <div
              className="rounded-xl px-6 py-5 mb-4"
              style={{ background: "#FFFFFF", border: "1px solid #E2DDD2" }}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <span className="block w-4 h-px" style={{ background: "#E08900" }} />
                <span
                  className="text-[9px] font-bold uppercase"
                  style={{ letterSpacing: "0.16em", color: "#8C887E" }}
                >
                  Zusammenfassung
                </span>
              </div>
              <p className="text-sm leading-[1.8]" style={{ color: "#57534A" }}>
                {article.summary_short}
              </p>
            </div>
          )}

          {/* Upgrade CTA */}
          <div
            className="rounded-xl mb-6 overflow-hidden"
            style={{ background: "#FFF6E0", border: "1px solid #FFD966", borderLeft: "3px solid #FFB300" }}
          >
            <div className="px-5 py-4 flex gap-3 items-start">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "#FFB300" }}
              >
                <Lock size={14} strokeWidth={2} color="#1A1100" />
              </div>
              <div>
                <p className="text-sm font-semibold mb-0.5" style={{ color: "#1A1813" }}>
                  Vollständige KI-Analyse — Pro
                </p>
                <p className="text-xs leading-relaxed mb-3" style={{ color: "#57534A" }}>
                  Ausführliche Analyse, Hintergründe und Handlungsempfehlungen zu diesem Artikel
                  sind im Pro-Plan verfügbar.
                </p>
                <Link
                  href="/dashboard/settings"
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-lg transition-all hover:opacity-90"
                  style={{ background: "#FFB300", color: "#1A1100" }}
                >
                  Auf Pro upgraden →
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Feedback ─────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6"
        style={{ background: "#FAF8F4", border: "1px solid #E2DDD2" }}
      >
        <ThumbsButton articleId={id} size="default" />
      </div>

      {/* ── Tags ─────────────────────────────────────────── */}
      {article.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-7">
          {article.tags.map((tag: string) => (
            <span
              key={tag}
              className="text-2xs font-medium px-2.5 py-1 rounded-full"
              style={{ background: "#FAF8F4", border: "1px solid #E2DDD2", color: "#8C887E" }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* ── CTA ──────────────────────────────────────────── */}
      <div className="flex items-center gap-3 pt-6" style={{ borderTop: "1px solid #E2DDD2" }}>
        <a
          href={article.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl hover:-translate-y-px transition-all duration-200"
          style={{ background: "#FFB300", color: "#1A1100", boxShadow: "0 4px 14px rgba(224,137,0,0.28)" }}
        >
          Originalartikel lesen
          <ArrowUpRight size={13} strokeWidth={2.5} />
        </a>
        <BackButton label="Zurück" variant="button" />
      </div>

      {/* ── Similar articles ─────────────────────────────── */}
      <SimilarArticles articles={similarArticles} />

    </div>
  );
}
