import { Fraunces, Hanken_Grotesk, Space_Mono } from "next/font/google";
import Link from "next/link";

const display = Fraunces({ subsets: ["latin"], display: "swap", variable: "--font-display", axes: ["opsz", "SOFT"] });
const body    = Hanken_Grotesk({ subsets: ["latin"], display: "swap", variable: "--font-body" });
const mono    = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap", variable: "--font-mono" });

const C = {
  paper: "#F7F5F0", paperDeep: "#F1EDE4", ink: "#1A1813",
  inkSoft: "#57534A", inkFaint: "#8C887E", amber: "#FFB300",
  amberDeep: "#E08900", line: "#E2DDD2",
};

const SIGNAL = [
  { t: "BNetzA: neue Netzentgelt-Systematik 2026", s: 94 },
  { t: "EU-Kommission: Strommarktreform Q3", s: 81 },
  { t: "Novelle des EnWG — verkürzte Frist", s: 67 },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${display.variable} ${body.variable} ${mono.variable} min-h-screen grid lg:grid-cols-2`}
      style={{ fontFamily: "var(--font-body), system-ui, sans-serif", background: C.paper, color: C.ink }}
    >
      {/* ── Left editorial panel (desktop) ─────────────────── */}
      <aside
        className="hidden lg:flex flex-col justify-between p-14 relative overflow-hidden"
        style={{ background: C.paperDeep, borderRight: `1px solid ${C.line}` }}
      >
        <div
          className="absolute -top-20 -right-24 w-[460px] h-[460px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,179,0,0.13) 0%, transparent 66%)" }}
        />

        <Link href="/" className="relative text-[20px] font-semibold tracking-tight" style={{ fontFamily: "var(--font-display), Georgia, serif" }}>
          Distill<span style={{ color: C.amberDeep }}>Feed</span>
        </Link>

        <div className="relative max-w-sm">
          <div className="inline-flex items-center gap-3 mb-7">
            <span className="block w-7 h-px" style={{ background: C.amberDeep }} />
            <span className="text-[11px] font-semibold uppercase" style={{ letterSpacing: "0.22em", color: C.amberDeep }}>
              KI-Brancheninformation
            </span>
          </div>
          <p
            className="text-[27px] font-light leading-[1.22] mb-10"
            style={{ fontFamily: "var(--font-display), Georgia, serif", letterSpacing: "-0.015em", color: C.ink }}
          >
            Aus dem Rauschen tausender Meldungen —{" "}
            <em style={{ fontStyle: "italic", color: C.amberDeep }}>das Wesentliche.</em>
          </p>

          {/* Distillation motif — ranked signals */}
          <div className="space-y-2.5">
            {SIGNAL.map((s) => (
              <div key={s.t} className="rounded-xl p-3.5" style={{ background: "#FFFFFF", border: `1px solid ${C.line}` }}>
                <p className="text-[12.5px] font-medium leading-snug mb-2.5" style={{ color: C.ink }}>{s.t}</p>
                <div className="flex items-center gap-2.5">
                  <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: C.paperDeep }}>
                    <div className="h-full rounded-full" style={{ width: `${s.s}%`, background: `linear-gradient(90deg, ${C.amber}, ${C.amberDeep})` }} />
                  </div>
                  <span className="text-[10px] tabular-nums" style={{ fontFamily: "var(--font-mono), monospace", color: C.inkSoft }}>{s.s}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-[12px]" style={{ color: C.inkFaint }}>
          DSGVO-konform · EU-Server (Frankfurt) · © 2026 DistillFeed
        </p>
      </aside>

      {/* ── Right form column ──────────────────────────────── */}
      <main className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile wordmark */}
          <div className="lg:hidden mb-9 text-center">
            <Link href="/" className="text-[22px] font-semibold tracking-tight" style={{ fontFamily: "var(--font-display), Georgia, serif" }}>
              Distill<span style={{ color: C.amberDeep }}>Feed</span>
            </Link>
          </div>

          {children}

          <p className="text-center text-[12.5px] mt-7" style={{ color: C.inkFaint }}>
            <Link href="/" className="transition-colors hover:text-[#57534A]">← Zurück zur Startseite</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
