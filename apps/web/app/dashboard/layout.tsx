import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import SidebarNav from "@/components/dashboard/SidebarNav";
import LogoutButton from "@/components/dashboard/LogoutButton";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect("/login");

  const email = session.user.email ?? "";
  const initials = email.slice(0, 2).toUpperCase();

  return (
    <div className="flex h-screen bg-neutral-50">

      {/* ── Sidebar ──────────────────────────────────────── */}
      <aside
        className="w-[240px] flex-shrink-0 flex flex-col"
        style={{ background: "#0d1424" }}
      >

        {/* Logo */}
        <div className="px-4 py-5 border-b border-white/[0.05]">
          <div className="flex items-center gap-3">
            {/* Gold gradient mark */}
            <div
              className="w-8 h-8 rounded-[9px] flex items-center justify-center flex-shrink-0 shadow-sm"
              style={{ background: "linear-gradient(135deg, #ffca28 0%, #ff8f00 100%)" }}
            >
              <span className="text-[11px] font-black tracking-tight text-white drop-shadow-sm">IS</span>
            </div>
            <div>
              <p className="text-[14.5px] font-bold tracking-tight text-white leading-none">
                IntelliStream
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-none font-medium">
                Fachinformation · KI
              </p>
            </div>
          </div>
        </div>

        {/* Navigation (client component for active states) */}
        <SidebarNav />

        {/* User footer */}
        <div className="px-3 pb-4 pt-3 border-t border-white/[0.05]">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5">
            {/* Avatar with gold gradient */}
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 shadow-sm"
              style={{ background: "linear-gradient(135deg, #ffca28 0%, #e08900 100%)" }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium truncate text-slate-400">{email}</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto bg-neutral-50">
        {children}
      </main>
    </div>
  );
}
