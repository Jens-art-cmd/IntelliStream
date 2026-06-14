import Link from "next/link";
import { LayoutDashboard, Users, Activity, ChevronLeft } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Übersicht", icon: LayoutDashboard },
  { href: "/admin/users", label: "Nutzer", icon: Users },
  { href: "/admin/status", label: "Quellen-Status", icon: Activity },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F5F0E8", display: "flex" }}>
      {/* Sidebar */}
      <aside style={{
        width: 220,
        minHeight: "100vh",
        backgroundColor: "#1A1714",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "sticky",
        top: 0,
      }}>
        {/* Logo / Back */}
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <Link
            href="/dashboard"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#C8C2B6",
              textDecoration: "none",
              fontSize: 13,
              fontFamily: "var(--font-sans, sans-serif)",
              marginBottom: 16,
              opacity: 0.7,
              transition: "opacity 0.15s",
            }}
            className="admin-back-link"
          >
            <ChevronLeft size={14} strokeWidth={2} />
            Zurück zum Feed
          </Link>
          <div style={{ color: "#FAFAF8", fontFamily: "var(--font-display, serif)", fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>
            Admin
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "16px 12px", flex: 1 }}>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 10px",
                borderRadius: 6,
                color: "#C8C2B6",
                textDecoration: "none",
                fontSize: 14,
                fontFamily: "var(--font-sans, sans-serif)",
                marginBottom: 2,
                transition: "background 0.15s, color 0.15s",
              }}
              className="admin-nav-link"
            >
              <Icon size={16} strokeWidth={1.75} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.08)", color: "#6B6560", fontSize: 11, fontFamily: "var(--font-sans, sans-serif)" }}>
          DistillFeed Admin
        </div>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, overflow: "auto" }}>
        {children}
      </main>

      <style>{`
        .admin-back-link:hover { opacity: 1 !important; color: #FAFAF8 !important; }
        .admin-nav-link:hover { background: rgba(255,255,255,0.07) !important; color: #FAFAF8 !important; }
      `}</style>
    </div>
  );
}
