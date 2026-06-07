import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* ── Navigation ───────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 border-b border-white/[0.08] backdrop-blur-xl"
        style={{ background: "rgba(13, 20, 36, 0.96)" }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-8 h-14">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-[9px] flex items-center justify-center flex-shrink-0 shadow-sm"
              style={{ background: "linear-gradient(135deg, #ffca28 0%, #ff8f00 100%)" }}
            >
              <span className="text-[11px] font-black tracking-tight text-white">IS</span>
            </div>
            <span className="text-[15px] font-bold text-white tracking-tight">IntelliStream</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              Anmelden
            </Link>
            <Link
              href="/register"
              className="text-sm font-bold px-4 py-1.5 rounded-lg text-neutral-900 shadow-sm hover:shadow-md transition-all"
              style={{ background: "linear-gradient(135deg, #ffca28 0%, #ffb300 100%)" }}
            >
              Kostenlos starten
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#0d1424" }}
      >
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #ffb300 0%, transparent 70%)" }}
        />

        <div className="relative max-w-4xl mx-auto text-center px-8 pt-24 pb-24">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-amber-500/30 bg-amber-500/10 text-amber-400 text-2xs font-bold tracking-[.08em] uppercase px-3.5 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            KI-gestützte Fachinformation
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter-xl leading-[1.06] text-white mb-5 text-balance">
            Immer informiert.{" "}
            <span style={{ color: "#ffca28" }}>
              In Ihrer Branche.
            </span>
          </h1>

          <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed mb-10">
            IntelliStream sammelt, analysiert und bewertet täglich Tausende Artikel
            aus amtlichen Quellen, Fachmedien und Branchenverbänden —
            vollautomatisch, KI-klassifiziert.
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 text-sm font-bold px-7 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 text-neutral-900"
              style={{ background: "linear-gradient(135deg, #ffca28 0%, #ffb300 100%)" }}
            >
              Jetzt kostenlos testen
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3.5 rounded-xl border border-white/[0.15] text-white hover:bg-white/[0.06] transition-colors"
            >
              Anmelden
            </Link>
          </div>

          <p className="text-xs text-slate-400 mt-5 font-medium">
            Keine Kreditkarte · 14 Tage kostenlos · DSGVO-konform
          </p>
        </div>
      </section>

      {/* ── Trust indicators ─────────────────────────────── */}
      <div className="border-y border-neutral-100 bg-neutral-50">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-neutral-100">
          {[
            { value: "20",        label: "Branchen" },
            { value: "500+",      label: "Quellen" },
            { value: "stündlich", label: "Aktualisierung" },
            { value: "3-stufig",  label: "Impact-Bewertung" },
            { value: "DSGVO",     label: "EU-konform" },
          ].map(({ value, label }) => (
            <div key={label} className="px-6 py-5 text-center">
              <div className="text-xl font-extrabold tracking-tight text-neutral-900">{value}</div>
              <div className="text-2xs font-bold uppercase tracking-[.08em] text-neutral-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-8 py-20">
        {/* Section label */}
        <div className="inline-flex items-center gap-2 text-2xs font-bold tracking-[.1em] uppercase text-amber-600 mb-4">
          <span className="w-6 h-px bg-amber-400 inline-block" />
          Wie es funktioniert
        </div>
        <h2 className="text-3xl font-extrabold tracking-tighter-xl text-neutral-900 mb-3">
          Kein Rauschen. Nur Signal.
        </h2>
        <p className="text-md text-neutral-500 max-w-md mb-12 leading-relaxed">
          Unser KI-System filtert Relevantes heraus und bewertet den Handlungsbedarf für Ihr Unternehmen.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon, title, desc }, i) => (
            <div
              key={title}
              className="bg-white border border-neutral-100 rounded-2xl p-6 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4 shadow-sm"
                style={{ background: i % 3 === 0
                  ? "linear-gradient(135deg, #0f1c34, #1e3b7a)"
                  : i % 3 === 1
                    ? "linear-gradient(135deg, #ffca28, #ff8f00)"
                    : "linear-gradient(135deg, #1e3b7a, #3a61b5)"
                }}
              >
                {icon}
              </div>
              <h3 className="text-sm font-bold text-neutral-900 mb-1.5">{title}</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Industries ───────────────────────────────────── */}
      <section className="bg-neutral-50 border-t border-neutral-100 py-20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="inline-flex items-center gap-2 text-2xs font-bold tracking-[.1em] uppercase text-amber-600 mb-4">
            <span className="w-6 h-px bg-amber-400 inline-block" />
            20 Branchen
          </div>
          <h2 className="text-2xl font-extrabold tracking-tighter-xl text-neutral-900 mb-2">
            Für Ihre Branche gemacht.
          </h2>
          <p className="text-md text-neutral-500 mb-10 leading-relaxed">
            Jede Branche hat eigene Quellen, Schwellenwerte und Impact-Kriterien.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {INDUSTRIES.map(({ name, sources }) => (
              <div
                key={name}
                className="bg-white border border-neutral-150 rounded-xl p-3.5 hover:border-amber-300 hover:shadow-sm transition-all duration-200 cursor-default group"
              >
                <div className="text-xs font-semibold text-neutral-800 leading-snug group-hover:text-neutral-900">
                  {name}
                </div>
                {sources && (
                  <div className="text-2xs text-neutral-400 mt-1 leading-snug">{sources}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-8 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-2xs font-bold tracking-[.1em] uppercase text-amber-600 mb-4">
            <span className="w-6 h-px bg-amber-400 inline-block" />
            Preise
          </div>
          <h2 className="text-3xl font-extrabold tracking-tighter-xl text-neutral-900 mb-2">
            Einfach und transparent.
          </h2>
          <p className="text-md text-neutral-500">Starten Sie kostenlos. Kein Risiko.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Free plan */}
          <div className="bg-white border border-neutral-150 rounded-2xl p-7">
            <div className="text-2xs font-bold tracking-[.1em] uppercase text-neutral-400 mb-3">Free</div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-[40px] font-extrabold tracking-tight text-neutral-900 leading-none">€0</span>
              <span className="text-sm font-medium text-neutral-400">/Monat</span>
            </div>
            <p className="text-xs text-neutral-500 mt-2 mb-6">Für Einzelpersonen und zum Kennenlernen.</p>
            <div className="space-y-2.5 mb-7">
              {["1 Branche auswählen", "30 Artikel pro Tag", "Impact-Bewertung", "Dashboard-Zugang"].map((f) => (
                <div key={f} className="flex items-center gap-2.5 text-xs text-neutral-700">
                  <span className="w-4 h-4 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center flex-shrink-0">
                    <svg width="8" height="8" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="2 6 5 9 10 3" />
                    </svg>
                  </span>
                  {f}
                </div>
              ))}
            </div>
            <Link
              href="/register"
              className="block text-center text-sm font-semibold text-neutral-700 border border-neutral-200 px-4 py-2.5 rounded-xl hover:border-neutral-400 hover:bg-neutral-50 transition-all"
            >
              Kostenlos starten
            </Link>
          </div>

          {/* Pro plan */}
          <div
            className="rounded-2xl p-7 relative overflow-hidden"
            style={{ background: "#0d1424" }}
          >
            {/* Recommended badge */}
            <div
              className="absolute top-5 right-5 text-2xs font-bold uppercase tracking-[.08em] px-2.5 py-0.5 rounded-full text-neutral-900"
              style={{ background: "linear-gradient(135deg, #ffca28, #ffb300)" }}
            >
              Empfohlen
            </div>

            <div className="text-2xs font-bold tracking-[.1em] uppercase text-slate-500 mb-3">Pro</div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-[40px] font-extrabold tracking-tight text-white leading-none">€29</span>
              <span className="text-sm font-medium text-slate-500">/Monat</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 mb-6">Für Profis mit echtem Informationsbedarf.</p>
            <div className="space-y-2.5 mb-7">
              {["Bis zu 5 Branchen", "Unlimitierte Artikel", "E-Mail-Alerts bei hohem Impact", "Täglicher Newsletter", "Semantische Suche"].map((f) => (
                <div key={f} className="flex items-center gap-2.5 text-xs text-slate-300">
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(255,179,0,.2)" }}
                  >
                    <svg width="8" height="8" fill="none" viewBox="0 0 12 12" stroke="#ffb300" strokeWidth="2.5">
                      <polyline points="2 6 5 9 10 3" />
                    </svg>
                  </span>
                  {f}
                </div>
              ))}
            </div>
            <Link
              href="/register"
              className="block text-center text-sm font-bold px-4 py-2.5 rounded-xl text-neutral-900 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              style={{ background: "linear-gradient(135deg, #ffca28 0%, #ffb300 100%)" }}
            >
              14 Tage kostenlos testen
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────── */}
      <section
        className="py-20"
        style={{ background: "#0d1424" }}
      >
        <div
          className="absolute w-[600px] h-[200px] opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #ffb300 0%, transparent 70%)" }}
        />
        <div className="max-w-2xl mx-auto text-center px-8">
          <h2 className="text-3xl font-extrabold tracking-tighter-xl text-white mb-4">
            Bereit für intelligente Fachinformation?
          </h2>
          <p className="text-slate-400 mb-8 text-md leading-relaxed">
            Über 8.200 Unternehmen vertrauen auf KI-gestützte Brancheninformationen.
            Starten Sie noch heute.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 text-sm font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 text-neutral-900"
            style={{ background: "linear-gradient(135deg, #ffca28 0%, #ffb300 100%)" }}
          >
            Kostenlos starten — kein Risiko
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer
        className="border-t border-white/[0.06]"
        style={{ background: "#0a0f1c" }}
      >
        <div className="max-w-6xl mx-auto px-8 py-8 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <div
              className="w-6 h-6 rounded-[7px] flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #ffca28 0%, #ff8f00 100%)" }}
            />
            <span className="font-semibold text-slate-400">IntelliStream</span>
          </div>
          <div className="flex items-center gap-6">
            <span>DSGVO-konform · EU-Server</span>
            <span>© 2026 IntelliStream</span>
          </div>
        </div>
      </footer>

    </main>
  );
}

/* ── Data ─────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: "📡", title: "Automatisches Crawling",  desc: "Scout-Agenten überwachen stündlich Behörden, Fachmedien und Verbände — für jede Ihrer Branchen." },
  { icon: "🧠", title: "KI-Zusammenfassung",      desc: "Claude analysiert jeden Artikel und erstellt eine präzise Zusammenfassung mit Impact-Einschätzung." },
  { icon: "🎯", title: "Branchenspez. Impact",    desc: "Hoch · Mittel · Gering — nach branchenspezifischen Kriterien bewertet. Gesetzesänderungen, Behördenentscheide." },
  { icon: "🔔", title: "Sofort-Alerts",           desc: "E-Mail bei hohem Impact in Ihren Branchen — damit Sie nichts Kritisches verpassen." },
  { icon: "📰", title: "Täglicher Newsletter",     desc: "Die wichtigsten Meldungen kompakt zusammengefasst, direkt in Ihr Postfach." },
  { icon: "🔍", title: "Semantische Suche",       desc: "KI findet auch inhaltlich verwandte Artikel — mit natürlichsprachigen Anfragen." },
];

const INDUSTRIES = [
  { name: "Energie & Erneuerbare",    sources: "BNetzA · BMWK · PV Mag." },
  { name: "Finanzen & Kapitalmarkt",  sources: "EZB · BaFin · HB" },
  { name: "IT & Cybersecurity",       sources: "BSI · Heise · HN" },
  { name: "Recht & Compliance",       sources: "Bundesrat · EuGH · LTO" },
  { name: "Automotive & Mobilität",   sources: "ACEA · electrive · VDA" },
  { name: "ESG & Nachhaltigkeit",     sources: "ESMA · EUR-Lex" },
  { name: "Pharma & Life Science",    sources: "EMA · FDA · BfArM" },
  { name: "Bau & Immobilien",         sources: "Destatis · BauNetz" },
  { name: "Gesundheit & MedTech",     sources: "G-BA · RKI · Ärzteblatt" },
  { name: "Maschinenbau & Ind. 4.0",  sources: "VDMA · Maschinenmarkt" },
  { name: "HR & Arbeitsmarkt",        sources: "BAG · Bundesagentur" },
  { name: "Agrar & Lebensmittel",     sources: "BLE · BMEL · agrarheute" },
  { name: "Logistik & Transport",     sources: "BGL · DSLV · DVZ" },
  { name: "Versicherung & Risiko",    sources: "BaFin · EIOPA · GDV" },
  { name: "Chemie & Materialien",     sources: "ECHA · VCI · CHEManager" },
  { name: "E-Commerce & Retail",      sources: "EHI · IFH · iBusiness" },
  { name: "Smart City & Kommunen",    sources: "BMBF · KfW · BMI" },
  { name: "Bildung & EdTech",         sources: "BMBF · KMK · HRK" },
  { name: "Maritime & Schifffahrt",   sources: "IMO · ISL · Ship & Bunker" },
  { name: "Gaming & Entertainment",   sources: "USK · game · GamesWirtschaft" },
];
