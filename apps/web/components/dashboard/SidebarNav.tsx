"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavLinkProps {
  href: string;
  label: string;
  children: React.ReactNode;
}

function NavLink({ href, label, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    pathname === href ||
    (href !== "/dashboard/feed" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 mb-0.5 group ${
        isActive
          ? "bg-white/[0.08] text-amber-400"
          : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
      }`}
    >
      <span
        className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
          isActive
            ? "text-amber-400"
            : "text-slate-500 group-hover:text-slate-300"
        }`}
      >
        {children}
      </span>
      {label}
      {isActive && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
      )}
    </Link>
  );
}

export default function SidebarNav() {
  return (
    <nav className="flex-1 px-3 py-4 overflow-y-auto sidebar-scroll">
      <p className="text-[10px] font-bold tracking-[.12em] uppercase px-3 py-1.5 mb-1 text-slate-600">
        Hauptmenü
      </p>
      <NavLink href="/dashboard/feed" label="Mein Feed">
        <IconGrid />
      </NavLink>
      <NavLink href="/dashboard/search" label="Suche">
        <IconSearch />
      </NavLink>
      <NavLink href="/dashboard/alerts" label="Alerts">
        <IconBell />
      </NavLink>
      <NavLink href="/dashboard/bookmarks" label="Lesezeichen">
        <IconBookmark />
      </NavLink>

      <p className="text-[10px] font-bold tracking-[.12em] uppercase px-3 py-1.5 mt-5 mb-1 text-slate-600">
        Konto
      </p>
      <NavLink href="/dashboard/settings" label="Einstellungen">
        <IconUser />
      </NavLink>
    </nav>
  );
}

/* ── Icons ─────────────────────────────────────────────────────── */
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
function IconBookmark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-full h-full">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}
