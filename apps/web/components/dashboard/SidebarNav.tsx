"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutGrid, Search, Bell, Bookmark, User, ShieldCheck } from "lucide-react";

const C = {
  ink: "#1A1813", inkSoft: "#57534A", inkFaint: "#8C887E",
  amberDeep: "#E08900", paper: "#F7F5F0", line: "#E2DDD2",
};

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
      className="flex items-center gap-3 py-2 text-[13px] font-medium transition-all duration-150 mb-0.5 cursor-pointer"
      style={
        isActive
          ? {
              color: C.ink,
              fontWeight: 600,
              background: "rgba(224,137,0,0.08)",
              borderLeft: `2px solid ${C.amberDeep}`,
              paddingLeft: "10px",
              paddingRight: "12px",
              borderRadius: "0 8px 8px 0",
            }
          : {
              color: C.inkSoft,
              borderLeft: "2px solid transparent",
              paddingLeft: "10px",
              paddingRight: "12px",
              borderRadius: "0 8px 8px 0",
            }
      }
      onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = C.ink; }}
      onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = C.inkSoft; }}
      aria-current={isActive ? "page" : undefined}
    >
      <span className="w-[17px] h-[17px] flex-shrink-0">{children}</span>
      {label}
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 mb-1 mt-1">
      <span className="block w-3 h-px flex-shrink-0" style={{ background: C.amberDeep }} />
      <span
        className="text-[9px] font-semibold uppercase"
        style={{ letterSpacing: "0.18em", color: C.inkFaint }}
      >
        {children}
      </span>
    </div>
  );
}

export default function SidebarNav({ isAdmin = false }: { isAdmin?: boolean }) {
  return (
    <nav className="flex-1 px-0 py-4 overflow-y-auto" aria-label="Hauptnavigation">
      <SectionLabel>Hauptmenü</SectionLabel>
      <NavLink href="/dashboard/feed"      label="Mein Feed">     <LayoutGrid  size={17} strokeWidth={1.75} /></NavLink>
      <NavLink href="/dashboard/search"    label="Suche">         <Search      size={17} strokeWidth={1.75} /></NavLink>
      <NavLink href="/dashboard/alerts"    label="Alerts">        <Bell        size={17} strokeWidth={1.75} /></NavLink>
      <NavLink href="/dashboard/bookmarks" label="Lesezeichen">   <Bookmark    size={17} strokeWidth={1.75} /></NavLink>

      <SectionLabel>Konto</SectionLabel>
      <NavLink href="/dashboard/settings"  label="Einstellungen"> <User        size={17} strokeWidth={1.75} /></NavLink>

      {isAdmin && (
        <>
          <SectionLabel>Admin</SectionLabel>
          <NavLink href="/admin" label="Admin-Panel">             <ShieldCheck size={17} strokeWidth={1.75} /></NavLink>
        </>
      )}
    </nav>
  );
}
