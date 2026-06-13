import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { ArrowLeft, CheckCircle, AlertTriangle, Clock } from "lucide-react";

export const metadata: Metadata = { title: "Admin · Status · DistillFeed" };

export default async function AdminStatusPage() {
  const supabase = await createSupabaseServerClient();

  const [
    { data: industries },
    { data: recentArticles },
    { data: sources },
  ] = await Promise.all([
    supabase.from("industries").select("id, name, is_active").eq("is_active", true).order("id"),
    supabase
      .from("articles")
      .select("industry_id, ingested_at, processed_at, is_suppressed")
      .order("ingested_at", { ascending: false })
      .limit(500),
    supabase.from("sources").select("id, name, industry_id, is_active, last_health_check, consecutive_failures").eq("is_active", true),
  ]);

  const now = new Date();

  const industryStats = (industries ?? []).map(ind => {
    const indArticles = (recentArticles ?? []).filter(a => a.industry_id === ind.id);
    const lastIngested = indArticles[0]?.ingested_at
      ? new Date(indArticles[0].ingested_at)
      : null;

    const hoursAgo = lastIngested
      ? Math.round((now.getTime() - lastIngested.getTime()) / 3600000)
      : null;

    const backlog = indArticles.filter(a => !a.processed_at && !a.is_suppressed).length;
    const today   = indArticles.filter(a =>
      a.processed_at && new Date(a.processed_at) > new Date(now.toDateString())
    ).length;

    const indSources = (sources ?? []).filter(s => s.industry_id === ind.id);
    const failingSources = indSources.filter(s => (s.consecutive_failures ?? 0) > 0);

    return { ...ind, hoursAgo, backlog, today, sourceCount: indSources.length, failingSources };
  });

  const statusIcon = (hoursAgo: number | null) => {
    if (hoursAgo === null) return <AlertTriangle size={16} color="#C0392B" />;
    if (hoursAgo <= 2)     return <CheckCircle   size={16} color="#2D7553" />;
    if (hoursAgo <= 6)     return <Clock         size={16} color="#E08900" />;
    return                        <AlertTriangle  size={16} color="#C0392B" />;
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-7">

      {/* Header */}
      <div className="flex items-center gap-3 mb-7">
        <Link
          href="/admin"
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg"
          style={{ background: "#FFFFFF", border: "1px solid #E2DDD2", color: "#57534A" }}
        >
          <ArrowLeft size={14} strokeWidth={1.75} />
          Übersicht
        </Link>
        <div>
          <div className="flex items-center gap-2.5 mb-0.5">
            <span className="block w-5 h-px" style={{ background: "#E08900" }} />
            <span className="text-xs font-semibold uppercase" style={{ letterSpacing: "0.2em", color: "#E08900" }}>Admin</span>
          </div>
          <h1 className="text-[22px] font-light" style={{ fontFamily: "var(--font-display), Georgia, serif", color: "#1A1813" }}>
            Agenten-Status
          </h1>
        </div>
      </div>

      {/* Branchen-Status */}
      <div className="rounded-xl overflow-hidden mb-6" style={{ background: "#FFFFFF", border: "1px solid #E2DDD2" }}>
        <div className="px-5 py-4" style={{ borderBottom: "1px solid #EBE7DD", background: "#FAF8F4" }}>
          <h2 className="text-base font-semibold" style={{ color: "#1A1813" }}>Scout-Status je Branche</h2>
          <p className="text-sm mt-0.5" style={{ color: "#8C887E" }}>Zuletzt eingesammelter Artikel pro Branche</p>
        </div>

        {/* Kopfzeile */}
        <div
          className="grid px-5 py-2.5 text-xs font-bold uppercase"
          style={{
            gridTemplateColumns: "1fr 140px 100px 100px 110px",
            letterSpacing: "0.08em", color: "#57534A",
            borderBottom: "1px solid #EBE7DD",
          }}
        >
          <span>Branche</span>
          <span>Letzter Scout</span>
          <span>Heute</span>
          <span>Rückstau</span>
          <span>Quellen</span>
        </div>

        <div className="divide-y" style={{ borderColor: "#F1EDE4" }}>
          {industryStats.map(ind => (
            <div
              key={ind.id}
              className="grid px-5 py-3.5 items-center text-sm"
              style={{ gridTemplateColumns: "1fr 140px 100px 100px 110px" }}
            >
              <div className="flex items-center gap-2.5">
                {statusIcon(ind.hoursAgo)}
                <span className="font-medium" style={{ color: "#1A1813" }}>{ind.name}</span>
              </div>

              <span style={{ color: ind.hoursAgo === null ? "#C0392B" : ind.hoursAgo <= 2 ? "#2D7553" : "#C07000" }}>
                {ind.hoursAgo === null
                  ? "Nie"
                  : ind.hoursAgo === 0
                    ? "Gerade eben"
                    : `vor ${ind.hoursAgo}h`}
              </span>

              <span style={{ color: "#57534A" }}>
                {ind.today > 0 ? `${ind.today} verarb.` : "—"}
              </span>

              <span style={{ color: ind.backlog > 50 ? "#C0392B" : ind.backlog > 0 ? "#C07000" : "#2D7553" }}>
                {ind.backlog > 0 ? `${ind.backlog} offen` : "✓ 0"}
              </span>

              <span>
                {ind.failingSources.length > 0 ? (
                  <span style={{ color: "#C0392B" }}>
                    {ind.failingSources.length} Fehler
                  </span>
                ) : (
                  <span style={{ color: "#2D7553" }}>
                    {ind.sourceCount} OK
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quellen mit Fehlern */}
      {(sources ?? []).some(s => (s.consecutive_failures ?? 0) > 0) && (
        <div className="rounded-xl overflow-hidden" style={{ background: "#FEF0EE", border: "1px solid #F5C6C1" }}>
          <div className="px-5 py-4" style={{ borderBottom: "1px solid #F5C6C1" }}>
            <h2 className="text-base font-semibold" style={{ color: "#C0392B" }}>
              Quellen mit Fehlern
            </h2>
          </div>
          <div className="divide-y" style={{ borderColor: "#F5C6C1" }}>
            {(sources ?? [])
              .filter(s => (s.consecutive_failures ?? 0) > 0)
              .map(s => (
                <div key={s.id} className="px-5 py-3.5 flex items-center justify-between text-sm">
                  <span className="font-medium" style={{ color: "#1A1813" }}>{s.name}</span>
                  <span style={{ color: "#C0392B" }}>
                    {s.consecutive_failures} aufeinanderfolgende Fehler
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
