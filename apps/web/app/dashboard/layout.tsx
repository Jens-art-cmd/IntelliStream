import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";
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
      <aside className="w-[220px] flex-shrink-0 bg-neutral-0 border-r border-neutral-100 flex flex-col">

        {/* Logo */}
        <div className="px-4 py-5 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[8px] bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-extrabold tracking-tighter-xl flex-shrink-0">
              IS
            </div>
            <span className="text-[15px] font-bold tracking-tighter-lg text-neutral-900">IntelliStream</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto">
          <div className="text-2xs font-bold tracking-[.1em] uppercase text-neutral-400 px-2 py-1.5 mb-1">
            Hauptmenü
          </div>
          <NavLink href="/dashboard/feed" label="Feed">
            <IconGrid />
          </NavLink>
          <NavLink href="/dashboard/search" label="Suche">
            <IconSearch />
          </NavLink>
          <NavLink href="/dashboard/alerts" label="Alerts">
            <IconBell />
          </NavLink>

          <div className="text-2xs font-bold tracking-[.1em] uppercase text-neutral-400 px-2 py-1.5 mt-4 mb-1">
            Konto
          </div>
          <NavLink href="/dashboard/settings" label="Einstellungen">
            <IconUser />
          </NavLink>
        </nav>

        {/* User */}
        <div className="px-3 pb-4 pt-3 border-t border-neutral-100">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-neutral-50 transition-colors">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-neutral-800 truncate">{email}</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

function NavLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors mb-0.5 group"
    >
      <span className="w-4 h-4 flex-shrink-0 text-neutral-400 group-hover:text-neutral-600 transition-colors">
        {children}
      </span>
      {label}
    </Link>
  );
}

/* ── SVG icons ─────────────────────────────────────────────────── */
function IconGrid() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-full h-full">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-full h-full">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-full h-full">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
function IconUser() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-full h-full">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}
