import Link from "next/link";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import { LayoutDashboard, Users, Activity, ChevronLeft } from "lucide-react";

const display = Fraunces({ subsets: ["latin"], display: "swap", variable: "--font-display", axes: ["opsz", "SOFT"] });
const body    = Hanken_Grotesk({ subsets: ["latin"], display: "swap", variable: "--font-body" });

const C = {
  paper:     "#F7F5F0",
  paperDeep: "#F1EDE4",
  ink:       "#1A1813",
  inkSoft:   "#57534A",
  inkFaint:  "#8C887E",
  amberDeep: "#E08900",
  line:      "#E2DDD2",
};

const NAV_ITEMS = [
  { href: "/admin",         label: "Übersicht",     Icon: LayoutDashboard },
  { href: "/admin/users",   label: "Nutzer",         Icon: Users },
  { href: "/admin/status",  label: "Quellen-Status", Icon: Activity },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${display.variable} ${body.variable}`}
      style={{
        fontFamily: "var(--font-body), system-ui, sans-serif",
        minHeight: "100vh",
        display: "flex",
        background: C.paper,
      }}
    >
      {/* Sidebar */}
      <aside style={{
        width: 240,
        minHeight: "100vh",
        flexShrink: 0,
        background: C.paperDeep,
        borderRight: `1px solid ${C.line}`,
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
      }}>
        {/* Wordmark + Back */}
        <div style={{ padding: "20px 20px 16px", borderBottom: `1px solid ${C.line}` }}>
          <Link
            href="/dashboard/feed"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: C.inkFaint,
              textDecoration: "none",
              fontSize: 12,
              marginBottom: 14,
              fontFamily: "var(--font-body), system-ui, sans-serif",
            }}
            className="admin-back"
          >
            <ChevronLeft size={13} strokeWidth={2} />
            Zurück zum Feed
          </Link>
          <p style={{
            fontFamily: "var(--font-display), Georgia, serif",
            fontSize: 17,
            fontWeight: 600,
            color: C.ink,
            margin: 0,
            lineHeight: 1,
          }}>
            Distill<span style={{ color: C.amberDeep }}>Feed</span>
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
            <span style={{ display: "block", width: 16, height: 1, background: C.amberDeep }} />
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.18em", color: C.inkFaint, textTransform: "uppercase" }}>
              Admin
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "12px 10px", flex: 1 }}>
          {NAV_ITEMS.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="admin-nav-link"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "8px 10px",
                borderRadius: 8,
                color: C.inkSoft,
                textDecoration: "none",
                fontSize: 14,
                fontFamily: "var(--font-body), system-ui, sans-serif",
                marginBottom: 2,
              }}
            >
              <Icon size={15} strokeWidth={1.75} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, overflowY: "auto" }}>
        {children}
      </main>

      <style>{`
        .admin-back:hover { color: ${C.ink} !important; }
        .admin-nav-link:hover { background: ${C.line} !important; color: ${C.ink} !important; }
      `}</style>
    </div>
  );
}
