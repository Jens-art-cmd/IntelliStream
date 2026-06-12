import { redirect } from "next/navigation";
import Link from "next/link";
import { Fraunces, Hanken_Grotesk, Space_Mono } from "next/font/google";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import SidebarNav from "@/components/dashboard/SidebarNav";
import LogoutButton from "@/components/dashboard/LogoutButton";
import TrialBanner from "@/components/dashboard/TrialBanner";
import { getTrialInfo } from "@/lib/trial";

const display = Fraunces({ subsets: ["latin"], display: "swap", variable: "--font-display", axes: ["opsz", "SOFT"] });
const body    = Hanken_Grotesk({ subsets: ["latin"], display: "swap", variable: "--font-body" });
const mono    = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap", variable: "--font-mono" });

const C = {
  paper: "#F7F5F0", paperDeep: "#F1EDE4",
  ink: "#1A1813", inkSoft: "#57534A", inkFaint: "#8C887E",
  amber: "#FFB300", amberDeep: "#E08900",
  line: "#E2DDD2", surface: "#FFFFFF",
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect("/login");

  const email = session.user.email ?? "";
  const name  = session.user.user_metadata?.name as string | undefined;
  const initials = name
    ? name.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()
    : email.slice(0, 2).toUpperCase();

  const { data: userData } = await supabase
    .from("users")
    .select("plan, trial_ends_at")
    .eq("id", session.user.id)
    .single();

  const trialInfo = getTrialInfo({
    plan: userData?.plan ?? "free",
    trial_ends_at: userData?.trial_ends_at,
  });

  return (
    <div
      className={`${display.variable} ${body.variable} ${mono.variable} flex h-screen overflow-hidden`}
      style={{ fontFamily: "var(--font-body), system-ui, sans-serif", background: C.paper }}
    >
      {/* ── Skip to content (a11y) ──────────────────────────── */}
      <a href="#main-content" className="skip-to-content">Zum Inhalt springen</a>

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside
        className="w-[240px] flex-shrink-0 flex flex-col overflow-y-auto"
        style={{
          background: C.paperDeep,
          borderRight: `1px solid ${C.line}`,
        }}
      >
        {/* Wordmark */}
        <div className="px-5 pt-5 pb-4" style={{ borderBottom: `1px solid ${C.line}` }}>
          <Link
            href="/dashboard/feed"
            className="block"
            aria-label="DistillFeed — Zurück zum Feed"
          >
            <p
              className="text-[18px] font-semibold leading-none mb-0.5"
              style={{ fontFamily: "var(--font-display), Georgia, serif", color: C.ink }}
            >
              Distill<span style={{ color: C.amberDeep }}>Feed</span>
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="block w-4 h-px" style={{ background: C.amberDeep }} />
              <span
                className="text-[9px] font-semibold uppercase"
                style={{ letterSpacing: "0.18em", color: C.inkFaint }}
              >
                KI-Brancheninformation
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <SidebarNav />

        {/* User footer */}
        <div className="px-4 pb-5 pt-3 mt-auto" style={{ borderTop: `1px solid ${C.line}` }}>
          <div
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-2"
            style={{ background: C.paper, border: `1px solid ${C.line}` }}
          >
            {/* Avatar */}
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold"
              style={{ background: C.amber, color: "#1A1100" }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-[11px] font-medium truncate leading-tight"
                style={{ color: C.inkSoft }}
              >
                {name ?? email}
              </p>
              {name && (
                <p className="text-[10px] truncate leading-tight" style={{ color: C.inkFaint }}>
                  {email}
                </p>
              )}
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────── */}
      <main id="main-content" className="flex-1 overflow-y-auto flex flex-col">
        <div className="px-6 pt-5 max-w-5xl w-full mx-auto">
          <TrialBanner status={trialInfo.status} daysLeft={trialInfo.daysLeft} />
        </div>
        {children}
      </main>
    </div>
  );
}
