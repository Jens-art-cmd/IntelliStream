import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import SidebarNav from "@/components/dashboard/SidebarNav";
import LogoutButton from "@/components/dashboard/LogoutButton";
import TrialBanner from "@/components/dashboard/TrialBanner";
import { getTrialInfo } from "@intellistream/shared";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect("/login");

  const email = session.user.email ?? "";
  const initials = email.slice(0, 2).toUpperCase();

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
    <div className="flex h-screen" style={{ background: "#e8eef5" }}>

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside
        className="w-[240px] flex-shrink-0 flex flex-col"
        style={{
          background: "#e8eef5",
          boxShadow: "6px 0 20px #c5cad3, -2px 0 6px #ffffff",
        }}
      >
        {/* Logo */}
        <div className="px-5 py-5 mb-1">
          <div className="flex items-center gap-3">
            {/* Gold neumorphic logo mark */}
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #ffca28 0%, #ff8f00 100%)",
                boxShadow: "4px 4px 8px #c5cad3, -2px -2px 6px #ffffff",
              }}
            >
              <span className="text-[12px] font-black tracking-tight text-white drop-shadow-sm">IS</span>
            </div>
            <div>
              <p className="text-[14px] font-bold tracking-tight text-neutral-800 leading-none">
                IntelliStream
              </p>
              <p className="text-[10px] text-neutral-500 mt-0.5 leading-none font-medium">
                Fachinformation · KI
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <SidebarNav />

        {/* User footer */}
        <div className="px-4 pb-5 pt-3">
          {/* User pill */}
          <div
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl mb-2"
            style={{ boxShadow: "inset 3px 3px 6px #c5cad3, inset -3px -3px 6px #ffffff" }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #ffca28 0%, #e08900 100%)" }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium truncate text-neutral-600">{email}</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto" style={{ background: "#e8eef5" }}>
        <div className="max-w-3xl mx-auto px-6 pt-5">
          <TrialBanner status={trialInfo.status} daysLeft={trialInfo.daysLeft} />
        </div>
        {children}
      </main>
    </div>
  );
}
