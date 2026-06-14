"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";

/* ────────────────────────────────────────────────────────────────
   Design tokens — warm editorial paper + DistillFeed amber
   ──────────────────────────────────────────────────────────────── */
const C = {
  paper:     "#F7F5F0",
  paperDeep: "#F1EDE4",
  ink:       "#1A1813",
  inkSoft:   "#57534A",
  inkFaint:  "#8C887E",
  amber:     "#FFB300",
  amberDeep: "#E08900",
  line:      "#E2DDD2",
  lineSoft:  "#EBE7DD",
  surface:   "#FFFFFF",
};

const serif = { fontFamily: "var(--font-display), Georgia, serif" } as const;
const sans  = { fontFamily: "var(--font-body), system-ui, sans-serif" } as const;
const dataMono = { fontFamily: "var(--font-mono), ui-monospace, monospace" } as const;

/* ────────────────────────────────────────────────────────────────
   Motion helpers
   ──────────────────────────────────────────────────────────────── */
function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={style}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

/* ────────────────────────────────────────────────────────────────
   Eyebrow label — editorial small-caps with hairline
   ──────────────────────────────────────────────────────────────── */
function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <span className="block w-7 h-px" style={{ background: C.amberDeep }} />
      <span
        className="text-[11px] font-semibold uppercase"
        style={{ ...sans, letterSpacing: "0.22em", color: C.amberDeep }}
      >
        {children}
      </span>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Hero distillation signature — noise condensing into ranked signal
   ──────────────────────────────────────────────────────────────── */
const SIGNAL = [
  { title: "BNetzA veröffentlicht neue Netzentgelt-Systematik 2026", score: 94, impact: "high" },
  { title: "EU-Kommission: Strommarktreform tritt im Q3 in Kraft", score: 81, impact: "high" },
  { title: "Novelle des EnWG — Frist für Netzbetreiber verkürzt", score: 67, impact: "medium" },
];

function DistillationVisual() {
  const reduce = useReducedMotion();
  const noiseRows = Array.from({ length: 9 });

  return (
    <div className="relative select-none" aria-hidden="true">
      {/* Noise field — faint scattered lines (the unfiltered stream) */}
      <div className="absolute inset-x-0 -top-2 flex flex-col gap-2.5 px-2 pointer-events-none">
        {noiseRows.map((_, i) => (
          <motion.div
            key={i}
            className="h-1.5 rounded-full"
            style={{
              background: C.line,
              width: `${30 + ((i * 37) % 60)}%`,
              marginLeft: `${(i * 23) % 40}%`,
            }}
            initial={reduce ? false : { opacity: 0.9, scaleX: 1 }}
            animate={reduce ? undefined : { opacity: [0.9, 0.12], x: [0, (i % 2 ? 1 : -1) * 14] }}
            transition={{ duration: 1.1, delay: 0.15 + i * 0.05, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Condensed signal — ranked cards */}
      <motion.div
        className="relative space-y-3 pt-6"
        variants={stagger}
        initial={reduce ? false : "hidden"}
        animate={reduce ? undefined : "show"}
      >
        <motion.div variants={staggerItem} className="flex items-center justify-between pb-1">
          <span className="text-[10px] font-semibold uppercase" style={{ ...sans, letterSpacing: "0.18em", color: C.inkFaint }}>
            Energie · Heute
          </span>
          <span className="text-[10px]" style={{ ...dataMono, color: C.inkFaint }}>
            1.284 → 3 Signale
          </span>
        </motion.div>

        {SIGNAL.map((s) => (
          <motion.div
            key={s.title}
            variants={staggerItem}
            className="rounded-xl p-4"
            style={{
              background: C.surface,
              border: `1px solid ${C.line}`,
              boxShadow: "0 1px 2px rgba(26,24,19,0.04)",
            }}
          >
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <p className="text-[13px] font-medium leading-snug" style={{ ...sans, color: C.ink }}>
                {s.title}
              </p>
              <span
                className="flex-shrink-0 mt-0.5 w-2 h-2 rounded-full"
                style={{ background: s.impact === "high" ? C.amberDeep : C.amber }}
              />
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: C.paperDeep }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${C.amber}, ${C.amberDeep})` }}
                  initial={reduce ? false : { width: 0 }}
                  whileInView={reduce ? undefined : { width: `${s.score}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <span className="text-[10px] tabular-nums" style={{ ...dataMono, color: C.inkSoft }}>
                {s.score}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Section divider — relevance-bar motif as a hairline rule
   ──────────────────────────────────────────────────────────────── */
function RankRule() {
  return (
    <div className="max-w-5xl mx-auto px-8">
      <div className="h-px w-full" style={{ background: C.line }} />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Page
   ──────────────────────────────────────────────────────────────── */
export default function LandingClient() {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <main style={{ ...sans, background: C.paper, color: C.ink }} className="min-h-screen antialiased">

      {/* ── Navigation ───────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50"
        style={{ background: "rgba(247,245,240,0.82)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.line}` }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-8 h-16">
          <div className="flex items-center gap-2.5">
            <span className="text-[19px] font-semibold tracking-tight" style={{ ...serif, color: C.ink }}>
              Distill<span style={{ color: C.amberDeep }}>Feed</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[13px]" style={{ color: C.inkSoft }}>
            <a href="#prinzip" className="hover:text-[#1A1813] transition-colors">Prinzip</a>
            <a href="#ablauf" className="hover:text-[#1A1813] transition-colors">Ablauf</a>
            <a href="#branchen" className="hover:text-[#1A1813] transition-colors">Branchen</a>
            <a href="#preise" className="hover:text-[#1A1813] transition-colors">Preise</a>
            <a href="#teams" className="hover:text-[#1A1813] transition-colors">Teams</a>
          </div>
          <div className="flex items-center gap-1.5">
            <Link href="/login" className="text-[13px] font-medium px-4 py-2 rounded-lg transition-colors hover:bg-[#F1EDE4]" style={{ color: C.inkSoft }}>
              Anmelden
            </Link>
            <Link
              href="/register"
              className="text-[13px] font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:-translate-y-px"
              style={{ background: C.ink, color: C.paper }}
            >
              Kostenlos testen
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative overflow-hidden">
        <motion.div
          className="absolute -top-24 right-[-10%] w-[620px] h-[620px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(255,179,0,0.14) 0%, transparent 66%)",
            y: reduce ? 0 : glowY,
          }}
        />
        <div className="relative max-w-6xl mx-auto px-8 pt-20 pb-24 grid lg:grid-cols-[1.05fr_0.95fr] gap-16 items-center">
          {/* Left — copy */}
          <div>
            <Reveal>
              <Eyebrow className="mb-7">KI-Brancheninformation</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h1
                className="text-[clamp(2.6rem,5.4vw,4.3rem)] font-light leading-[1.04] mb-7"
                style={{ ...serif, color: C.ink, letterSpacing: "-0.02em" }}
              >
                Aus dem Rauschen<br />
                tausender Meldungen —{" "}
                <em style={{ fontStyle: "italic", color: C.amberDeep }}>das Wesentliche.</em>
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="text-[17px] leading-relaxed max-w-md mb-9" style={{ color: C.inkSoft }}>
                DistillFeed durchsucht täglich amtliche Quellen, Fachmedien und
                Verbände Ihrer Branche — und destilliert Tausende Artikel zu einer
                handvoll nach Impact bewerteter Signale.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-2 text-[14px] font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: C.amber, color: "#1A1100", boxShadow: "0 4px 14px rgba(224,137,0,0.28)" }}
                >
                  14 Tage kostenlos testen
                  <ArrowRight size={15} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a
                  href="#prinzip"
                  className="inline-flex items-center gap-2 text-[14px] font-medium px-5 py-3.5 rounded-xl transition-colors hover:bg-[#F1EDE4]"
                  style={{ color: C.ink, border: `1px solid ${C.line}` }}
                >
                  Wie es funktioniert
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.24}>
              <p className="text-[12.5px] mt-6" style={{ color: C.inkFaint }}>
                Keine Kreditkarte · DSGVO-konform · EU-Server (Frankfurt)
              </p>
            </Reveal>
          </div>

          {/* Right — distillation signature */}
          <Reveal delay={0.2} y={28}>
            <div className="relative">
              <div
                className="rounded-2xl p-6 pt-7"
                style={{ background: C.paperDeep, border: `1px solid ${C.line}` }}
              >
                <DistillationVisual />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-8 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }}>
          {[
            { v: "15", l: "Branchen abgedeckt" },
            { v: "500+", l: "überwachte Quellen" },
            { v: "stündlich", l: "neu eingelesen" },
            { v: "3-stufig", l: "Impact-Bewertung" },
          ].map(({ v, l }, i) => (
            <Reveal key={l} delay={i * 0.06}>
              <div className="px-6 py-8 text-center md:text-left" style={{ borderLeft: i % 2 || i === 0 ? undefined : "" }}>
                <div className="text-[30px] font-light leading-none mb-2" style={{ ...serif, color: C.ink }}>{v}</div>
                <div className="text-[11px] font-medium uppercase" style={{ letterSpacing: "0.12em", color: C.inkFaint }}>{l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Problem / Solution ───────────────────────────────── */}
      <section id="prinzip" className="max-w-6xl mx-auto px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <Reveal><Eyebrow className="mb-6">Das Problem</Eyebrow></Reveal>
            <Reveal delay={0.06}>
              <h2 className="text-[clamp(1.9rem,3.4vw,2.7rem)] font-light leading-[1.12] mb-6" style={{ ...serif, color: C.ink, letterSpacing: "-0.015em" }}>
                Relevante Entwicklungen verstecken sich im Grundrauschen.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="text-[16px] leading-relaxed mb-4" style={{ color: C.inkSoft }}>
                Gesetzesnovellen, Behördenentscheide, Marktverschiebungen — die
                Information, die Ihr Unternehmen betrifft, erscheint verstreut über
                Hunderte Quellen. Sie manuell zu verfolgen kostet Stunden täglich.
              </p>
              <p className="text-[16px] leading-relaxed" style={{ color: C.inkSoft }}>
                Und das Entscheidende geht zwischen Pressemitteilungen und
                Newslettern unter — bis es zu spät ist.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1} y={24}>
            <div className="rounded-2xl p-8" style={{ background: C.surface, border: `1px solid ${C.line}` }}>
              <Eyebrow className="mb-6">Die Lösung</Eyebrow>
              <div className="space-y-6">
                {[
                  { n: "Vollständig", t: "Statt Stichproben überwacht DistillFeed lückenlos jede relevante Quelle Ihrer Branche." },
                  { n: "Bewertet", t: "Jede Meldung wird von Claude analysiert und nach branchenspezifischem Handlungsbedarf eingestuft." },
                  { n: "Verdichtet", t: "Sie lesen drei Signale statt dreihundert Artikel — mit Quellenlink für die Tiefe." },
                ].map((row) => (
                  <div key={row.n} className="flex gap-4">
                    <span className="text-[13px] font-bold mt-0.5 w-24 flex-shrink-0" style={{ ...dataMono, color: C.amberDeep }}>
                      {row.n}
                    </span>
                    <p className="text-[14.5px] leading-relaxed" style={{ color: C.inkSoft }}>{row.t}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <RankRule />

      {/* ── How it works ─────────────────────────────────────── */}
      <section id="ablauf" className="max-w-6xl mx-auto px-8 py-20">
        <Reveal><Eyebrow className="mb-6">Der Ablauf</Eyebrow></Reveal>
        <Reveal delay={0.06}>
          <h2 className="text-[clamp(1.9rem,3.4vw,2.7rem)] font-light leading-[1.12] mb-14 max-w-xl" style={{ ...serif, color: C.ink, letterSpacing: "-0.015em" }}>
            Vom Rohstrom zum Signal — in drei Schritten.
          </h2>
        </Reveal>

        <motion.div
          className="grid md:grid-cols-3 gap-px rounded-2xl overflow-hidden"
          style={{ background: C.line }}
          variants={stagger}
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "show"}
          viewport={{ once: true, margin: "-60px" }}
        >
          {[
            { step: "01", title: "Sammeln", desc: "Scout-Agenten lesen stündlich Behörden, Fachmedien und Verbände aus — über 500 Quellen, vollautomatisch." },
            { step: "02", title: "Destillieren", desc: "Claude fasst jeden Artikel zusammen, extrahiert Kernaussagen und ordnet ihn semantisch in Ihre Branche ein." },
            { step: "03", title: "Ranken", desc: "Jede Meldung erhält einen Relevanz-Score und eine Impact-Stufe — Sie sehen zuerst, was zählt." },
          ].map((s) => (
            <motion.div key={s.step} variants={staggerItem} className="p-8" style={{ background: C.paper }}>
              <div className="text-[12px] font-bold mb-5" style={{ ...dataMono, color: C.amberDeep, letterSpacing: "0.1em" }}>{s.step}</div>
              <h3 className="text-[20px] font-normal mb-3" style={{ ...serif, color: C.ink }}>{s.title}</h3>
              <p className="text-[14px] leading-relaxed" style={{ color: C.inkSoft }}>{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Product showcase ─────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-8 py-20">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-14 items-center">
          <div>
            <Reveal><Eyebrow className="mb-6">Im Produkt</Eyebrow></Reveal>
            <Reveal delay={0.06}>
              <h2 className="text-[clamp(1.8rem,3.2vw,2.5rem)] font-light leading-[1.12] mb-6" style={{ ...serif, color: C.ink, letterSpacing: "-0.015em" }}>
                Ein Feed, der nach Wichtigkeit sortiert.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="text-[16px] leading-relaxed mb-6" style={{ color: C.inkSoft }}>
                Kein endloses Scrollen. Der personalisierte Feed zeigt zuerst, was
                hohen Handlungsbedarf hat — mit Relevanz-Score, Impact-Stufe und
                einer KI-Begründung, warum es für Sie zählt.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <ul className="space-y-3">
                {["Relevanz-Score von 0–100 je Artikel", "Impact-Ampel: hoch · mittel · gering", "Semantische Suche über alle Quellen", "E-Mail-Alert bei kritischen Meldungen"].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-[14.5px]" style={{ color: C.ink }}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#FFF6E0", border: `1px solid ${C.amber}` }}>
                      <Check size={11} strokeWidth={3} color={C.amberDeep} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* CSS-rendered dashboard frame */}
          <Reveal delay={0.12} y={26}>
            <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.line}`, boxShadow: "0 24px 60px -20px rgba(26,24,19,0.22)" }}>
              {/* window chrome */}
              <div className="flex items-center gap-1.5 px-4 py-3" style={{ background: C.surface, borderBottom: `1px solid ${C.lineSoft}` }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#E5E0D5" }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#E5E0D5" }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#E5E0D5" }} />
                <span className="ml-3 text-[11px]" style={{ ...dataMono, color: C.inkFaint }}>distillfeed.eu/feed</span>
              </div>
              {/* feed body */}
              <div className="p-5 space-y-3" style={{ background: C.paperDeep }}>
                {[
                  { t: "BaFin verschärft Meldepflichten für Kryptoverwahrer", s: 96, im: "high", tag: "Finanzen" },
                  { t: "NIS2-Umsetzungsgesetz: Bundestag beschließt Fristen", s: 88, im: "high", tag: "IT-Security" },
                  { t: "Neue EU-Verordnung zu Lieferkettensorgfalt verabschiedet", s: 72, im: "medium", tag: "ESG" },
                  { t: "EuGH-Urteil zu Cookie-Banner-Gestaltung", s: 58, im: "medium", tag: "Recht" },
                ].map((a) => (
                  <div key={a.t} className="rounded-xl p-4" style={{ background: C.surface, border: `1px solid ${C.line}` }}>
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <p className="text-[12.5px] font-medium leading-snug" style={{ color: C.ink }}>{a.t}</p>
                      <span
                        className="flex-shrink-0 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full"
                        style={{
                          letterSpacing: "0.08em",
                          color: a.im === "high" ? C.amberDeep : C.inkSoft,
                          background: a.im === "high" ? "#FFF6E0" : C.paperDeep,
                          border: `1px solid ${a.im === "high" ? C.amber : C.line}`,
                        }}
                      >
                        {a.im === "high" ? "Hoch" : "Mittel"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] uppercase font-semibold px-1.5 py-0.5 rounded" style={{ letterSpacing: "0.08em", color: C.inkFaint, background: C.paperDeep }}>{a.tag}</span>
                      <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: C.paperDeep }}>
                        <div className="h-full rounded-full" style={{ width: `${a.s}%`, background: `linear-gradient(90deg, ${C.amber}, ${C.amberDeep})` }} />
                      </div>
                      <span className="text-[10px] tabular-nums" style={{ ...dataMono, color: C.inkSoft }}>{a.s}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <RankRule />

      {/* ── Industries ───────────────────────────────────────── */}
      <section id="branchen" className="max-w-6xl mx-auto px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <Reveal><Eyebrow className="mb-6">15 Branchen</Eyebrow></Reveal>
            <Reveal delay={0.06}>
              <h2 className="text-[clamp(1.9rem,3.4vw,2.7rem)] font-light leading-[1.12] max-w-lg" style={{ ...serif, color: C.ink, letterSpacing: "-0.015em" }}>
                Für Ihre Branche kuratiert.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="text-[15px] leading-relaxed max-w-xs" style={{ color: C.inkSoft }}>
              Jede Branche hat eigene Quellen, Schwellenwerte und Impact-Kriterien — keine generische Aggregation.
            </p>
          </Reveal>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          style={{ borderTop: `1px solid ${C.line}` }}
          variants={stagger}
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "show"}
          viewport={{ once: true, margin: "-40px" }}
        >
          {INDUSTRIES.map((ind) => (
            <motion.div
              key={ind.name}
              variants={staggerItem}
              className="group flex items-center justify-between gap-3 py-4 px-1 cursor-default"
              style={{ borderBottom: `1px solid ${C.line}` }}
            >
              <div>
                <div className="text-[14.5px] font-medium" style={{ color: C.ink }}>{ind.name}</div>
                <div className="text-[11.5px] mt-0.5" style={{ ...dataMono, color: C.inkFaint }}>{ind.sources}</div>
              </div>
              <ArrowUpRight size={15} strokeWidth={2} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" color={C.amberDeep} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      <RankRule />

      {/* ── Pricing ──────────────────────────────────────────── */}
      <section id="preise" className="max-w-5xl mx-auto px-8 py-20">
        <div className="text-center mb-14">
          <Reveal><Eyebrow className="mb-6 justify-center">Preise</Eyebrow></Reveal>
          <Reveal delay={0.06}>
            <h2 className="text-[clamp(1.9rem,3.4vw,2.7rem)] font-light leading-[1.12]" style={{ ...serif, color: C.ink, letterSpacing: "-0.015em" }}>
              Transparent. Ohne Risiko.
            </h2>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free */}
          <Reveal>
            <div className="h-full rounded-2xl p-8 flex flex-col" style={{ background: C.surface, border: `1px solid ${C.line}` }}>
              <div className="text-[11px] font-semibold uppercase mb-4" style={{ letterSpacing: "0.18em", color: C.inkFaint }}>Free</div>
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-[44px] font-light leading-none" style={{ ...serif, color: C.ink }}>€0</span>
                <span className="text-[14px]" style={{ color: C.inkFaint }}>/ Monat</span>
              </div>
              <p className="text-[13px] mt-3 mb-7" style={{ color: C.inkSoft }}>Zum Kennenlernen und für Einzelpersonen.</p>
              <ul className="space-y-3 mb-8 flex-1">
                {["Bis zu 2 Branchen", "30 Artikel pro Tag", "Impact-Bewertung", "Dashboard-Zugang"].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-[14px]" style={{ color: C.inkSoft }}>
                    <Check size={14} strokeWidth={2.5} color={C.inkFaint} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block text-center text-[14px] font-semibold py-3 rounded-xl transition-colors hover:bg-[#F1EDE4]" style={{ border: `1px solid ${C.line}`, color: C.ink }}>
                Kostenlos starten
              </Link>
            </div>
          </Reveal>

          {/* Pro */}
          <Reveal delay={0.08}>
            <div className="h-full rounded-2xl p-8 flex flex-col relative" style={{ background: C.ink, border: `1px solid ${C.ink}` }}>
              <div className="absolute top-7 right-7 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full" style={{ letterSpacing: "0.1em", background: C.amber, color: "#1A1100" }}>
                Empfohlen
              </div>
              <div className="text-[11px] font-semibold uppercase mb-4" style={{ letterSpacing: "0.18em", color: C.amber }}>Pro</div>
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-[44px] font-light leading-none" style={{ ...serif, color: C.paper }}>€49</span>
                <span className="text-[14px]" style={{ color: "#A8A299" }}>/ Monat</span>
              </div>
              <p className="text-[13px] mt-3 mb-1" style={{ color: "#C9C3B8" }}>Für Profis mit echtem Informationsbedarf.</p>
              <p className="text-[12.5px] mb-7" style={{ color: C.amber }}>oder 39 € / Monat jährlich (468 € / Jahr)</p>
              <ul className="space-y-3 mb-8 flex-1">
                {["Alle 15 Branchen", "Unlimitierte Artikel", "KI-Tiefenanalyse je Artikel", "E-Mail-Alerts bei hohem Impact", "Täglicher Newsletter", "Semantische Suche"].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-[14px]" style={{ color: C.paper }}>
                    <Check size={14} strokeWidth={2.5} color={C.amber} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block text-center text-[14px] font-bold py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5" style={{ background: C.amber, color: "#1A1100", boxShadow: "0 4px 14px rgba(224,137,0,0.3)" }}>
                14 Tage kostenlos testen
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <RankRule />

      {/* ── Teams ────────────────────────────────────────────── */}
      <section id="teams" className="max-w-5xl mx-auto px-8 py-20">
        <div className="text-center mb-14">
          <Reveal><Eyebrow className="mb-6 justify-center">Für Teams</Eyebrow></Reveal>
          <Reveal delay={0.06}>
            <h2 className="text-[clamp(1.9rem,3.4vw,2.7rem)] font-light leading-[1.12]" style={{ ...serif, color: C.ink, letterSpacing: "-0.015em" }}>
              Gemeinsam informiert.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[15px] leading-relaxed mt-4 max-w-lg mx-auto" style={{ color: C.inkSoft }}>
              Für Kanzleien, Abteilungen und Fachabteilungen — ein Paket für das ganze Team, deutlich günstiger als Einzellizenzen.
            </p>
          </Reveal>
        </div>

        {/* Tier cards */}
        <div className="grid md:grid-cols-3 gap-5 max-w-3xl mx-auto mb-10">
          {/* Teams S */}
          <Reveal>
            <div className="rounded-2xl p-6 flex flex-col h-full" style={{ background: C.surface, border: `1px solid ${C.line}` }}>
              <div className="text-[10px] font-bold uppercase mb-3" style={{ letterSpacing: "0.18em", color: C.inkFaint }}>Teams S</div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-[32px] font-light leading-none" style={{ ...serif, color: C.ink }}>€149</span>
                <span className="text-[13px]" style={{ color: C.inkFaint }}>/Monat</span>
              </div>
              <p className="text-[12px] mt-1 mb-4" style={{ color: C.inkFaint, ...dataMono }}>Bis zu 5 Nutzer</p>
              <ul className="space-y-2 flex-1 mb-5">
                {["€30 / Nutzer statt €49", "Alle Pro-Features", "Gemeinsame Branchen-Auswahl"].map(f => (
                  <li key={f} className="flex items-start gap-2 text-[13px]" style={{ color: C.inkSoft }}>
                    <Check size={13} strokeWidth={2.5} color={C.amberDeep} className="mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:teams@distillfeed.eu?subject=Teams%20S%20Anfrage"
                className="block text-center text-[13px] font-semibold py-2.5 rounded-xl transition-colors hover:bg-[#F1EDE4] cursor-pointer"
                style={{ border: `1px solid ${C.line}`, color: C.ink }}
              >
                Anfragen
              </a>
            </div>
          </Reveal>

          {/* Teams M — highlighted */}
          <Reveal delay={0.07}>
            <div className="rounded-2xl p-6 flex flex-col h-full relative" style={{ background: C.ink, border: `1px solid ${C.ink}` }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase px-3 py-1 rounded-full whitespace-nowrap" style={{ background: C.amber, color: "#1A1100", letterSpacing: "0.08em" }}>
                Beliebt
              </div>
              <div className="text-[10px] font-bold uppercase mb-3" style={{ letterSpacing: "0.18em", color: C.amber }}>Teams M</div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-[32px] font-light leading-none" style={{ ...serif, color: C.paper }}>€249</span>
                <span className="text-[13px]" style={{ color: "#A8A299" }}>/Monat</span>
              </div>
              <p className="text-[12px] mt-1 mb-4" style={{ color: "#A8A299", ...dataMono }}>Bis zu 10 Nutzer</p>
              <ul className="space-y-2 flex-1 mb-5">
                {["€25 / Nutzer statt €49", "Alle Pro-Features", "Gemeinsame Branchen-Auswahl", "Prioritäts-Support"].map(f => (
                  <li key={f} className="flex items-start gap-2 text-[13px]" style={{ color: C.paper }}>
                    <Check size={13} strokeWidth={2.5} color={C.amber} className="mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:teams@distillfeed.eu?subject=Teams%20M%20Anfrage"
                className="block text-center text-[13px] font-bold py-2.5 rounded-xl transition-all hover:-translate-y-0.5 cursor-pointer"
                style={{ background: C.amber, color: "#1A1100", boxShadow: "0 4px 14px rgba(224,137,0,0.28)" }}
              >
                Anfragen →
              </a>
            </div>
          </Reveal>

          {/* Enterprise */}
          <Reveal delay={0.14}>
            <div className="rounded-2xl p-6 flex flex-col h-full" style={{ background: C.surface, border: `1px solid ${C.line}` }}>
              <div className="text-[10px] font-bold uppercase mb-3" style={{ letterSpacing: "0.18em", color: C.inkFaint }}>Enterprise</div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-[32px] font-light leading-none" style={{ ...serif, color: C.ink }}>Individuell</span>
              </div>
              <p className="text-[12px] mt-1 mb-4" style={{ color: C.inkFaint, ...dataMono }}>Ab 10 Nutzer</p>
              <ul className="space-y-2 flex-1 mb-5">
                {["Volumenrabatt", "Alle Pro-Features", "Dedizierter Ansprechpartner", "Custom Onboarding"].map(f => (
                  <li key={f} className="flex items-start gap-2 text-[13px]" style={{ color: C.inkSoft }}>
                    <Check size={13} strokeWidth={2.5} color={C.amberDeep} className="mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:teams@distillfeed.eu?subject=Enterprise%20Anfrage"
                className="block text-center text-[13px] font-semibold py-2.5 rounded-xl transition-colors hover:bg-[#F1EDE4] cursor-pointer"
                style={{ border: `1px solid ${C.line}`, color: C.ink }}
              >
                Kontakt aufnehmen
              </a>
            </div>
          </Reveal>
        </div>

        {/* Savings note */}
        <Reveal delay={0.1}>
          <p className="text-center text-[13px]" style={{ color: C.inkFaint }}>
            Alle Team-Pläne auf Anfrage via{" "}
            <a href="mailto:teams@distillfeed.eu" className="font-medium hover:underline" style={{ color: C.amberDeep }}>
              teams@distillfeed.eu
            </a>
            {" "}— Antwort innerhalb von 24 Stunden.
          </p>
        </Reveal>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-8 pb-24 pt-4">
        <Reveal y={24}>
          <div className="relative rounded-3xl overflow-hidden text-center px-8 py-20" style={{ background: C.paperDeep, border: `1px solid ${C.line}` }}>
            <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${C.amber}, transparent)` }} />
            <Eyebrow className="mb-7 justify-center">Jetzt starten</Eyebrow>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-light leading-[1.08] max-w-2xl mx-auto mb-7" style={{ ...serif, color: C.ink, letterSpacing: "-0.02em" }}>
              Hören Sie auf zu suchen.<br />
              <em style={{ fontStyle: "italic", color: C.amberDeep }}>Fangen Sie an zu wissen.</em>
            </h2>
            <p className="text-[16px] max-w-md mx-auto mb-9" style={{ color: C.inkSoft }}>
              Vierzehn Tage kostenlos. Volle Pro-Funktionen. Keine Kreditkarte nötig.
            </p>
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 text-[15px] font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: C.amber, color: "#1A1100", boxShadow: "0 6px 20px rgba(224,137,0,0.3)" }}
            >
              DistillFeed kostenlos testen
              <ArrowRight size={16} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${C.line}` }}>
        <div className="max-w-6xl mx-auto px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12.5px]" style={{ color: C.inkFaint }}>
          <span className="text-[16px] font-semibold" style={{ ...serif, color: C.ink }}>
            Distill<span style={{ color: C.amberDeep }}>Feed</span>
          </span>
          <div className="flex items-center gap-6 flex-wrap justify-center sm:justify-end">
            <a href="/kontakt" style={{ color: C.inkFaint }} className="hover:underline underline-offset-2 transition-colors">Kontakt & Support</a>
            <span>DSGVO-konform · EU-Server (Frankfurt)</span>
            <span>© 2026 DistillFeed</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ── Data ──────────────────────────────────────────────────────── */
const INDUSTRIES = [
  { name: "Energie & Erneuerbare",      sources: "BNetzA · BMWK · Agora" },
  { name: "Finanzen & Kapitalmarkt",    sources: "EZB · BaFin · Bundesbank" },
  { name: "IT & Cybersecurity",         sources: "BSI · Heise · Bleeping Comp." },
  { name: "Recht & Compliance",         sources: "BGH · BAG · EuGH · LTO" },
  { name: "Automotive & Mobilität",     sources: "ACEA · electrive · VDA" },
  { name: "ESG & Nachhaltigkeit",       sources: "ESMA · EFRAG · EUR-Lex" },
  { name: "Pharma & Life Science",      sources: "EMA · BfArM · IQWiG" },
  { name: "Bau & Immobilien",           sources: "Destatis · ZIA · BauNetz" },
  { name: "Gesundheit & MedTech",       sources: "G-BA · BMG · GKV-SV" },
  { name: "Maschinenbau & Ind. 4.0",    sources: "VDMA · Plattform I4.0" },
  { name: "HR & Arbeitsmarkt",          sources: "BAG · Bundesagentur · BDA" },
  { name: "Logistik & Transport",       sources: "BGL · DSLV · DVZ" },
  { name: "Versicherung & Risiko",      sources: "BaFin · EIOPA · GDV" },
  { name: "Chemie & Materialien",       sources: "ECHA · VCI · CHEManager" },
  { name: "EU-Regulatorik & Gesetzgeb.", sources: "EUR-Lex · EP · Euractiv" },
];
