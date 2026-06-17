import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase-server";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("articles")
    .select("title, summary_short")
    .eq("id", id)
    .single();
  if (!data) return { title: "DistillFeed" };
  return {
    title: `${data.title} · DistillFeed`,
    description: data.summary_short ?? undefined,
    openGraph: {
      title: data.title,
      description: data.summary_short ?? undefined,
      siteName: "DistillFeed",
    },
  };
}

const IMPACT_BADGE = {
  high:   { bg: "#FEF0EE", text: "#C0392B", border: "#F5C6C1", dot: "#DC2626", label: "Hoher Impact" },
  medium: { bg: "#FFF6E0", text: "#E08900", border: "#FFD966", dot: "#E08900", label: "Mittlerer Impact" },
  low:    { bg: "#F0F7F0", text: "#2D7553", border: "#A8D5A8", dot: "#2D7553", label: "Geringer Impact" },
};

export default async function PublicArticlePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: article } = await supabase
    .from("articles")
    .select("id, title, summary_short, impact_level, published_at, source_url, tags")
    .eq("id", id)
    .single();

  if (!article) notFound();

  const impact = article.impact_level ? IMPACT_BADGE[article.impact_level as keyof typeof IMPACT_BADGE] : null;
  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString("de-DE", { dateStyle: "long" })
    : null;

  return (
    <div className="min-h-screen" style={{ background: "#FAF8F4" }}>

      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #E2DDD2", background: "#FFFFFF" }}>
        <Link href="/" className="flex items-center gap-2">
          <span className="block w-4 h-px" style={{ background: "#E08900" }} />
          <span className="text-sm font-bold tracking-widest uppercase" style={{ color: "#1A1813", letterSpacing: "0.15em" }}>
            DistillFeed
          </span>
        </Link>
        <Link
          href="/register"
          className="text-xs font-bold px-4 py-2 rounded-lg hover:-translate-y-px transition-all"
          style={{ background: "#FFB300", color: "#1A1100" }}
        >
          Kostenlos testen →
        </Link>
      </nav>

      {/* Article */}
      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap mb-5">
          {impact && (
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: impact.bg, color: impact.text, border: `1px solid ${impact.border}` }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: impact.dot }} />
              {impact.label}
            </span>
          )}
          {date && (
            <span className="text-xs" style={{ color: "#8C887E" }}>{date}</span>
          )}
        </div>

        {/* Title */}
        <h1
          className="text-[26px] font-light leading-tight mb-5"
          style={{
            fontFamily: "Georgia, serif",
            letterSpacing: "-0.02em",
            color: "#1A1813",
          }}
        >
          {article.title}
        </h1>

        {/* Summary */}
        {article.summary_short && (
          <div
            className="rounded-xl px-6 py-5 mb-6"
            style={{ background: "#FFFFFF", border: "1px solid #E2DDD2" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="block w-4 h-px" style={{ background: "#E08900" }} />
              <span className="text-[9px] font-bold uppercase" style={{ letterSpacing: "0.16em", color: "#8C887E" }}>
                KI-Zusammenfassung
              </span>
            </div>
            <p className="text-sm leading-[1.8]" style={{ color: "#57534A" }}>
              {article.summary_short}
            </p>
          </div>
        )}

        {/* Tags */}
        {(article.tags as string[])?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-7">
            {(article.tags as string[]).map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium px-2.5 py-1 rounded-full"
                style={{ background: "#F1EDE4", border: "1px solid #E2DDD2", color: "#8C887E" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 mb-12">
          <a
            href={article.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl hover:-translate-y-px transition-all"
            style={{ background: "#FFB300", color: "#1A1100", boxShadow: "0 4px 14px rgba(224,137,0,0.22)" }}
          >
            Originalartikel lesen
            <ArrowUpRight size={13} strokeWidth={2.5} />
          </a>
          <Link
            href={`/dashboard/article/${article.id}`}
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl hover:-translate-y-px transition-all"
            style={{ background: "#FFFFFF", border: "1px solid #E2DDD2", color: "#57534A" }}
          >
            Vollständige Analyse
            <ExternalLink size={12} strokeWidth={1.75} />
          </Link>
        </div>

        {/* DistillFeed CTA */}
        <div
          className="rounded-2xl p-7 text-center"
          style={{ background: "#FFFFFF", border: "1px solid #E2DDD2" }}
        >
          <div className="flex items-center gap-2 justify-center mb-4">
            <span className="block w-5 h-px" style={{ background: "#E08900" }} />
            <span className="text-[10px] font-bold uppercase" style={{ letterSpacing: "0.2em", color: "#E08900" }}>
              DistillFeed
            </span>
            <span className="block w-5 h-px" style={{ background: "#E08900" }} />
          </div>
          <h2
            className="text-xl font-light mb-2"
            style={{ fontFamily: "Georgia, serif", color: "#1A1813" }}
          >
            KI-kuratierte Branchenintelligenz
          </h2>
          <p className="text-sm mb-6 max-w-sm mx-auto leading-relaxed" style={{ color: "#57534A" }}>
            Täglich die wichtigsten Meldungen aus deiner Branche — impact-gerankt, zusammengefasst, handlungsrelevant.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 text-sm font-bold px-7 py-3 rounded-xl hover:-translate-y-px transition-all"
            style={{ background: "#FFB300", color: "#1A1100", boxShadow: "0 4px 14px rgba(224,137,0,0.22)" }}
          >
            14 Tage kostenlos testen →
          </Link>
          <p className="text-xs mt-3" style={{ color: "#C8C2B6" }}>
            Keine Kreditkarte erforderlich
          </p>
        </div>
      </div>
    </div>
  );
}
