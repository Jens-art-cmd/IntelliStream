import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-neutral-0">

      {/* ── Topbar ─────────────────────────────────────── */}
      <nav className="sticky top-0 z-10 bg-neutral-0/90 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-8 h-14">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[8px] bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-extrabold tracking-tighter-xl">
              IS
            </div>
            <span className="text-[15px] font-bold tracking-tighter-lg text-neutral-900">IntelliStream</span>
          </div>
          <div className="flex items-center gap-1">
            <Link href="/login" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 px-3 py-1.5 rounded-md transition-colors">
              Anmelden
            </Link>
            <Link href="/register" className="text-sm font-semibold bg-brand-600 text-white px-4 py-1.5 rounded-md hover:bg-brand-700 transition-colors tracking-tight-sm">
              Kostenlos starten
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto text-center px-8 pt-20 pb-16">
        <div className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-600 border border-brand-200 text-2xs font-bold tracking-[.06em] uppercase px-3 py-1 rounded-full mb-6">
          <span className="text-[7px]">●</span>
          KI-gestützte Fachinformation
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter-xl leading-[1.08] text-neutral-900 mb-5 text-balance">
          Immer informiert.{" "}
          <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
            In Ihrer Branche.
          </span>
        </h1>
        <p className="text-lg text-neutral-500 max-w-xl mx-auto leading-relaxed mb-9">
          IntelliStream sammelt, analysiert und bewertet täglich Tausende Artikel
          aus amtlichen Quellen, Fachmedien und Branchenverbänden —
          vollautomatisch, KI-klassifiziert.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-brand-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-brand-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-px text-sm tracking-tight-sm"
          >
            Jetzt kostenlos testen
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <span className="text-sm text-neutral-400">
            Keine Kreditkarte · <span className="text-neutral-600 font-medium">14 Tage kostenlos</span>
          </span>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────── */}
      <div className="border-y border-neutral-100 bg-neutral-25">
        <div className="max-w-4xl mx-auto flex justify-center divide-x divide-neutral-100">
          {[
            { value: "20",       label: "Branchen" },
            { value: "500+",     label: "Quellen" },
            { value: "stündlich",label: "Aktualisierung" },
            { value: "3-stufig", label: "Impact-Bewertung" },
            { value: "DSGVO",    label: "EU-konform" },
          ].map(({ value, label }) => (
            <div key={label} className="px-8 py-5 text-center flex-1">
              <div className="text-2xl font-extrabold tracking-tighter-xl text-neutral-900">{value}</div>
              <div className="text-2xs font-semibold uppercase tracking-[.06em] text-neutral-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <div className="text-2xs font-bold tracking-[.1em] uppercase text-brand-600 mb-3">Wie es funktioniert</div>
        <h2 className="text-3xl font-extrabold tracking-tighter-xl text-neutral-900 mb-3">Kein Rauschen. Nur Signal.</h2>
        <p className="text-md text-neutral-500 max-w-md mb-10">
          Unser KI-System filtert Relevantes heraus und bewertet den Handlungsbedarf für Ihr Unternehmen.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-neutral-0 border border-neutral-100 rounded-lg p-5 hover:shadow-md hover:-translate-y-px transition-all duration-200"
            >
              <div className="w-9 h-9 rounded-md bg-brand-50 border border-brand-100 flex items-center justify-center text-lg mb-4">
                {icon}
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-1.5">{title}</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Branchen ────────────────────────────────────── */}
      <section id="branchen" className="bg-neutral-25 border-t border-neutral-100 py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-2xs font-bold tracking-[.1em] uppercase text-brand-600 mb-3">20 Branchen</div>
          <h2 className="text-2xl font-extrabold tracking-tighter-xl text-neutral-900 mb-2">Für Ihre Branche gemacht.</h2>
          <p className="text-md text-neutral-500 mb-8">Jede Branche hat eigene Quellen, Schwellenwerte und Impact-Kriterien.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
            {INDUSTRIES.map(({ name, sources }) => (
              <div
                key={name}
                className="bg-neutral-0 border border-neutral-150 rounded-md p-3 hover:border-brand-300 hover:shadow-sm transition-all cursor-default"
              >
                <div className="text-xs font-semibold text-neutral-800 leading-snug">{name}</div>
                {sources && <div className="text-2xs text-neutral-400 mt-1 leading-snug">{sources}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-8 py-16">
        <div className="text-center mb-10">
          <div className="text-2xs font-bold tracking-[.1em] uppercase text-brand-600 mb-3">Preise</div>
          <h2 className="text-3xl font-extrabold tracking-tighter-xl text-neutral-900 mb-2">Einfach und transparent.</h2>
          <p className="text-md text-neutral-500">Starten Sie kostenlos. Kein Risiko.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Free */}
          <div className="bg-neutral-0 border border-neutral-150 rounded-xl p-7">
            <div className="text-2xs font-bold tracking-[.1em] uppercase text-neutral-500 mb-2">Free</div>
            <div className="text-[38px] font-extrabold tracking-tighter-xl text-neutral-900 leading-none mb-1">
              <sup className="text-xl align-top mt-2 mr-0.5">€</sup>0
              <sub className="text-sm font-medium text-neutral-500 ml-1">/Monat</sub>
            </div>
            <p className="text-xs text-neutral-500 mt-2 mb-5">Für Einzelpersonen und zum Kennenlernen.</p>
            {["1 Branche auswählen", "30 Artikel pro Tag", "Impact-Bewertung", "Dashboard-Zugang"].map((f) => (
              <div key={f} className="flex items-start gap-2 mb-2 text-xs text-neutral-700">
                <span className="text-brand-600 font-bold mt-0.5">✓</span> {f}
              </div>
            ))}
            <Link
              href="/register"
              className="block text-center mt-6 text-sm font-medium bg-neutral-0 text-neutral-700 border border-neutral-200 px-4 py-2.5 rounded-md hover:border-neutral-400 hover:bg-neutral-25 transition-colors"
            >
              Kostenlos starten
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-neutral-0 border-2 border-brand-500 rounded-xl p-7 relative shadow-[0_0_0_4px_theme(colors.brand.50)]">
            <div className="absolute top-4 right-4 bg-brand-600 text-white text-2xs font-bold uppercase tracking-[.06em] px-2.5 py-0.5 rounded-full">
              Empfohlen
            </div>
            <div className="text-2xs font-bold tracking-[.1em] uppercase text-neutral-500 mb-2">Pro</div>
            <div className="text-[38px] font-extrabold tracking-tighter-xl text-neutral-900 leading-none mb-1">
              <sup className="text-xl align-top mt-2 mr-0.5">€</sup>29
              <sub className="text-sm font-medium text-neutral-500 ml-1">/Monat</sub>
            </div>
            <p className="text-xs text-neutral-500 mt-2 mb-5">Für Profis mit echtem Informationsbedarf.</p>
            {["Bis zu 5 Branchen", "Unlimitierte Artikel", "E-Mail-Alerts bei hohem Impact", "Täglicher Newsletter", "Semantische Suche"].map((f) => (
              <div key={f} className="flex items-start gap-2 mb-2 text-xs text-neutral-700">
                <span className="text-brand-600 font-bold mt-0.5">✓</span> {f}
              </div>
            ))}
            <Link
              href="/register"
              className="block text-center mt-6 text-sm font-semibold bg-brand-600 text-white px-4 py-2.5 rounded-md hover:bg-brand-700 transition-colors"
            >
              14 Tage kostenlos testen
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="border-t border-neutral-100 bg-neutral-25">
        <div className="max-w-6xl mx-auto px-8 py-8 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-[6px] bg-gradient-to-br from-brand-500 to-brand-700" />
            <span className="font-semibold text-neutral-600">IntelliStream</span>
          </div>
          <div className="flex items-center gap-5">
            <span>DSGVO-konform · EU-Server</span>
            <span>© 2026</span>
          </div>
        </div>
      </footer>

    </main>
  );
}

const FEATURES = [
  { icon: "📡", title: "Automatisches Crawling",      desc: "Scout-Agenten überwachen stündlich Behörden, Fachmedien und Verbände — für jede Ihrer Branchen." },
  { icon: "🧠", title: "KI-Zusammenfassung",          desc: "Claude analysiert jeden Artikel und erstellt eine präzise Zusammenfassung mit Impact-Einschätzung." },
  { icon: "🎯", title: "Branchenspez. Impact",        desc: "Hoch · Mittel · Gering — nach branchen­spezifischen Kriterien bewertet. Gesetzesänderungen, Behördenentscheide." },
  { icon: "🔔", title: "Sofort-Alerts",               desc: "E-Mail bei hohem Impact in Ihren Branchen — damit Sie nichts Kritisches verpassen." },
  { icon: "📰", title: "Täglicher Newsletter",         desc: "Die wichtigsten Meldungen kompakt zusammengefasst, direkt in Ihr Postfach." },
  { icon: "🔍", title: "Semantische Suche",           desc: "KI findet auch inhaltlich verwandte Artikel — mit natürlichsprachigen Anfragen." },
];

const INDUSTRIES = [
  { name: "Energie & Erneuerbare",      sources: "BNetzA · BMWK · PV Mag." },
  { name: "Finanzen & Kapitalmarkt",    sources: "EZB · BaFin · HB" },
  { name: "IT & Cybersecurity",         sources: "BSI · Heise · HN" },
  { name: "Recht & Compliance",         sources: "Bundesrat · EuGH · LTO" },
  { name: "Automotive & Mobilität",     sources: "ACEA · electrive · VDA" },
  { name: "ESG & Nachhaltigkeit",       sources: "ESMA · EUR-Lex" },
  { name: "Pharma & Life Science",      sources: "EMA · FDA · BfArM" },
  { name: "Bau & Immobilien",           sources: "Destatis · BauNetz" },
  { name: "Gesundheit & MedTech",       sources: "G-BA · RKI · Ärzteblatt" },
  { name: "Maschinenbau & Ind. 4.0",   sources: "VDMA · Maschinenmarkt" },
  { name: "HR & Arbeitsmarkt",          sources: "BAG · Bundesagentur" },
  { name: "Agrar & Lebensmittel",       sources: "BLE · BMEL · agrarheute" },
  { name: "Logistik & Transport",       sources: "BGL · DSLV · DVZ" },
  { name: "Versicherung & Risiko",      sources: "BaFin · EIOPA · GDV" },
  { name: "Chemie & Materialien",       sources: "ECHA · VCI · CHEManager" },
  { name: "E-Commerce & Retail",        sources: "EHI · IFH · iBusiness" },
  { name: "Smart City & Kommunen",      sources: "BMBF · KfW · BMI" },
  { name: "Bildung & EdTech",           sources: "BMBF · KMK · HRK" },
  { name: "Maritime & Schifffahrt",     sources: "IMO · ISL · Ship & Bunker" },
  { name: "Gaming & Entertainment",     sources: "USK · game · GamesWirtschaft" },
];
