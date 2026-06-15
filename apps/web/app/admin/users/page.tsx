import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = { title: "Admin · User · DistillFeed" };

export default async function AdminUsersPage() {
  const supabase = createSupabaseAdminClient();

  const { data: users } = await supabase
    .from("users")
    .select("id, email, plan, trial_ends_at, created_at, industry_subscriptions, newsletter_opt_in, is_admin")
    .order("created_at", { ascending: false });

  const now = new Date();

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
            User ({users?.length ?? 0})
          </h1>
        </div>
      </div>

      {/* Tabelle */}
      <div className="rounded-xl overflow-hidden" style={{ background: "#FFFFFF", border: "1px solid #E2DDD2" }}>
        {/* Kopfzeile */}
        <div
          className="grid px-5 py-3 text-xs font-bold uppercase"
          style={{
            gridTemplateColumns: "1fr 100px 130px 90px 90px 80px",
            letterSpacing: "0.08em", color: "#57534A",
            borderBottom: "1px solid #EBE7DD", background: "#FAF8F4",
          }}
        >
          <span>E-Mail</span>
          <span>Plan</span>
          <span>Trial-Ende</span>
          <span>Branchen</span>
          <span>Newsletter</span>
          <span>Seit</span>
        </div>

        {/* Zeilen */}
        <div className="divide-y" style={{ borderColor: "#F1EDE4" }}>
          {(users ?? []).map((u) => {
            const isPaid  = u.plan !== "free";
            const isTrial = !isPaid && u.trial_ends_at && new Date(u.trial_ends_at) > now;
            const trialExpired = !isPaid && u.trial_ends_at && new Date(u.trial_ends_at) <= now;
            const daysLeft = isTrial
              ? Math.ceil((new Date(u.trial_ends_at!).getTime() - now.getTime()) / 86400000)
              : null;

            return (
              <div
                key={u.id}
                className="grid px-5 py-3.5 items-center text-sm"
                style={{ gridTemplateColumns: "1fr 100px 130px 90px 90px 80px" }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="truncate font-medium" style={{ color: "#1A1813" }}>{u.email}</span>
                  {u.is_admin && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded flex-shrink-0" style={{ background: "#1A1813", color: "#FFB300" }}>
                      ADMIN
                    </span>
                  )}
                </div>

                <span>
                  <span
                    className="text-xs font-bold uppercase px-2.5 py-1 rounded-full"
                    style={isPaid
                      ? { background: "#FFB300", color: "#1A1100" }
                      : isTrial
                        ? { background: "#FFF6E0", color: "#C07000", border: "1px solid #FFD966" }
                        : { background: "#F1EDE4", color: "#57534A" }
                    }
                  >
                    {isPaid ? u.plan : isTrial ? "Trial" : "Free"}
                  </span>
                </span>

                <span style={{ color: isTrial ? "#C07000" : trialExpired ? "#C0392B" : "#C8C2B6" }}>
                  {u.trial_ends_at
                    ? isTrial
                      ? `${daysLeft}d verbleibend`
                      : new Date(u.trial_ends_at).toLocaleDateString("de-DE", { day: "numeric", month: "short" })
                    : "—"}
                </span>

                <span style={{ color: "#57534A" }}>
                  {u.industry_subscriptions?.length ?? 0}
                </span>

                <span>
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={u.newsletter_opt_in
                      ? { background: "#F0F7F0", color: "#2D7553", border: "1px solid #A8D5A8" }
                      : { background: "#F1EDE4", color: "#8C887E" }
                    }
                  >
                    {u.newsletter_opt_in ? "Aktiv" : "Nein"}
                  </span>
                </span>

                <span style={{ color: "#8C887E" }}>
                  {new Date(u.created_at).toLocaleDateString("de-DE", { day: "numeric", month: "short" })}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
