import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import LogoutButton from "@/components/dashboard/LogoutButton";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect("/login");

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <aside className="w-60 flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <span className="text-lg font-bold text-brand-700 dark:text-brand-400">IntelliStream</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <NavLink href="/dashboard/feed"     label="Mein Feed"     icon="📰" />
          <NavLink href="/dashboard/search"   label="Suche"         icon="🔍" />
          <NavLink href="/dashboard/alerts"   label="Alerts"        icon="🔔" />
          <NavLink href="/dashboard/settings" label="Einstellungen" icon="⚙️" />
        </nav>

        <div className="px-3 py-3 border-t border-gray-200 dark:border-gray-800 space-y-1">
          <p className="px-3 text-xs text-gray-400 truncate">{session.user.email}</p>
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

function NavLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      <span>{icon}</span><span>{label}</span>
    </Link>
  );
}
