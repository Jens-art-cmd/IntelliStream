import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { Users, FileText, Mail, TrendingUp } from "lucide-react";

export const metadata: Metadata = { title: "Admin · DistillFeed" };

export default async function AdminPage() {
  const supabase = createSupabaseAdminClient();

  const [
    { data: newsletterStats },
    { data: recentUsers },
  ] = await Promise.all([
    supabase
      .from("newsletters")
      .select("id, sent_at, opened_at, clicked_at, bounced")
      .gte("sent_at", new Date(Date.now() - 7 * 86400000).toISOString()),
    supabase
      .from("users")
      .select("email, plan, trial_ends_at, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const { data: usersRaw } = await supabase
    .from("users")
    .select("plan, trial_ends_at, created_at");

  const now = new Date();
  const totalUsers  = usersRaw?.length ?? 0;
  const paidUsers   = usersRaw?.filter(u => u.plan !== "free").length ?? 0;
  const trialUsers  = usersRaw?.filter(u =>
    u.plan === "free" && u.trial_ends_at && new Date(u.trial_ends_at) > now
  ).length ?? 0;
  const newThisWeek = usersRaw?.filter(u =>
    new Date(u.created_at) > new Date(Date.now() - 7 * 86400000)
  ).length ?? 0;

  const { data: articlesRaw } = await supabase
    .from("articles")
    .select("processed_at, is_suppressed, published_at");

  const totalArticles     = articlesRaw?.length ?? 0;
  const processedArticles = articlesRaw?.filter(a => a.processed_at).length ?? 0;
  const backlogArticles   = articlesRaw?.filter(a => !a.processed_at && !a.is_suppressed).length ?? 0;
  const todayProcessed    = articlesRaw?.filter(a =>
    a.processed_at && new Date(a.processed_at) > new Date(now.toDateString())
  ).length ?? 0;

  const nlSent    = newsletterStats?.length ?? 0;
  const nlOpened  = newsletterStats?.filter(n => n.opened_at).length ?? 0;
  const nlClicked = newsletterStats?.filter(n => n.clicked_at).length ?? 0;
  const nlBounced = newsletterStats?.filter(n => n.bounced).length ?? 0;

  const statCard = (label: string, value: string | number, sub?: string, color = "#1A1813") => (
    <div
      className="rounded-xl px-5 py-4"
      style={{ background: "#FFFFFF", border: "1px solid #E2DDD2" }}
    >
      <p className="text-sm font-medium mb-1" style={{ color: "#8C887E" }}>{label}</p>
      <p className="text-3xl font-black tracking-tight" style={{ color }}>{value}</p>
      {sub && <p className="text-sm mt-1" style={{ color: "#8C887E" }}>{sub}</p>}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-7">

      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="block w-5 h-px" style={{ background: "#E08900" }} />
            <span className="text-xs font-semibold uppercase" style={{ letterSpacing: "0.2em", color: "#E08900" }}>
              Admin
            </span>
          </div>
          <h1 className="text-[22px] font-light" style={{ fontFamily: "var(--font-display), Georgia, serif", color: "#1A1813" }}>
            Übersicht
          </h1>
        </div>
        <div className="flex gap-2">
          {[
            { href: "/admin/users",  label: "User",    Icon: Users },
            { href: "/admin/status", label: "Agenten", Icon: TrendingUp },
          ].map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:-translate-y-px"
              style={{ background: "#FFFFFF", border: "1px solid #E2DDD2", color: "#57534A" }}
            >
              <Icon size={15} strokeWidth={1.75} />
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── User-Statistiken ─────────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Users size={15} strokeWidth={1.75} color="#E08900" />
          <span className="text-sm font-bold uppercase" style={{ letterSpacing: "0.1em", color: "#8C887E" }}>User</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {statCard("Gesamt", totalUsers)}
          {statCard("Paid", paidUsers, "aktive Abos", "#2D7553")}
          {statCard("Trial", trialUsers, "laufen noch", "#E08900")}
          {statCard("Diese Woche", newThisWeek, "neue Registrierungen")}
        </div>
      </div>

      {/* ── Artikel-Statistiken ──────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FileText size={15} strokeWidth={1.75} color="#E08900" />
          <span className="text-sm font-bold uppercase" style={{ letterSpacing: "0.1em", color: "#8C887E" }}>Artikel</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {statCard("Gesamt", totalArticles)}
          {statCard("Verarbeitet", processedArticles, `${Math.round(processedArticles / Math.max(totalArticles, 1) * 100)}% der Gesamtzahl`)}
          {statCard("Rückstau", backlogArticles, "warten auf Processor", backlogArticles > 100 ? "#C0392B" : "#1A1813")}
          {statCard("Heute verarbeitet", todayProcessed)}
        </div>
      </div>

      {/* ── Newsletter (7 Tage) ──────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Mail size={15} strokeWidth={1.75} color="#E08900" />
          <span className="text-sm font-bold uppercase" style={{ letterSpacing: "0.1em", color: "#8C887E" }}>Newsletter — letzte 7 Tage</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {statCard("Versendet", nlSent)}
          {statCard("Geöffnet", nlOpened, nlSent ? `${Math.round(nlOpened / nlSent * 100)}% Rate` : "—")}
          {statCard("Geklickt", nlClicked, nlSent ? `${Math.round(nlClicked / nlSent * 100)}% Rate` : "—")}
          {statCard("Bounces", nlBounced, undefined, nlBounced > 0 ? "#C0392B" : "#1A1813")}
        </div>
      </div>

      {/* ── Letzte Registrierungen ───────────────────────── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "#FFFFFF", border: "1px solid #E2DDD2" }}
      >
        <div className="px-5 py-4" style={{ borderBottom: "1px solid #EBE7DD" }}>
          <h2 className="text-base font-semibold" style={{ color: "#1A1813" }}>Letzte Registrierungen</h2>
        </div>
        <div className="divide-y" style={{ borderColor: "#F1EDE4" }}>
          {(recentUsers ?? []).map((u) => {
            const isPaid   = u.plan !== "free";
            const isTrial  = !isPaid && u.trial_ends_at && new Date(u.trial_ends_at) > now;
            const daysLeft = isTrial
              ? Math.ceil((new Date(u.trial_ends_at!).getTime() - now.getTime()) / 86400000)
              : null;
            return (
              <div key={u.email} className="px-5 py-3.5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: "#1A1813" }}>{u.email}</p>
                  <p className="text-sm mt-0.5" style={{ color: "#8C887E" }}>
                    {new Date(u.created_at).toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <span
                  className="text-xs font-bold uppercase px-3 py-1 rounded-full"
                  style={isPaid
                    ? { background: "#FFB300", color: "#1A1100" }
                    : isTrial
                      ? { background: "#FFF6E0", color: "#C07000", border: "1px solid #FFD966" }
                      : { background: "#F1EDE4", color: "#57534A" }
                  }
                >
                  {isPaid ? u.plan.toUpperCase() : isTrial ? `Trial · ${daysLeft}d` : "FREE"}
                </span>
              </div>
            );
          })}
        </div>
        <div className="px-5 py-3.5" style={{ borderTop: "1px solid #EBE7DD" }}>
          <Link href="/admin/users" className="text-sm font-semibold hover:underline" style={{ color: "#E08900" }}>
            Alle User anzeigen →
          </Link>
        </div>
      </div>
    </div>
  );
}
