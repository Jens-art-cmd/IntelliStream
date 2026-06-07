import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <span className="text-xl font-bold text-brand-700 dark:text-brand-400">
          IntelliStream
        </span>
        <div className="flex gap-4">
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            Anmelden
          </Link>
          <Link href="/register" className="text-sm bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700">
            Kostenlos starten
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center px-6 py-20">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white text-balance leading-tight">
          Was Bloomberg für Finanzen ist —{" "}
          <span className="text-brand-600">für alle 20 Branchen</span>
        </h1>
        <p className="mt-6 text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Tagesaktuelle, KI-aufbereitete Fachinformationen. Personalisiert auf deinen Beruf,
          quellentransparent, und bezahlbar.
        </p>
        <div className="mt-10 flex gap-4 justify-center flex-wrap">
          <Link href="/register" className="bg-brand-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-brand-700">
            Kostenlos testen
          </Link>
          <Link href="#branchen" className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-lg text-lg hover:bg-gray-50 dark:hover:bg-gray-800">
            Alle Branchen
          </Link>
        </div>
      </section>

      {/* Branchen grid */}
      <section id="branchen" className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">20 Branchen-Module</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {INDUSTRIES.map((name) => (
            <div key={name} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-700 dark:text-gray-300 text-center">
              {name}
            </div>
          ))}
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="bg-brand-600 text-white py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Ab 0 EUR/Monat starten</h2>
        <p className="text-brand-100 mb-8 max-w-xl mx-auto">
          Free: 1 Branche, wöchentlicher Newsletter. Starter: 9 EUR/Mo. Pro: 29 EUR/Mo.
        </p>
        <Link href="/register" className="bg-white text-brand-600 font-semibold px-8 py-3 rounded-lg hover:bg-brand-50">
          Jetzt kostenlos registrieren
        </Link>
      </section>
    </main>
  );
}

const INDUSTRIES = [
  "Energie & Erneuerbare", "ESG & Nachhaltigkeit", "Recht & Compliance",
  "IT & Cybersecurity", "Pharma & Life Science", "Finanzen & Kapitalmarkt",
  "Bau & Immobilien", "Automotive & Mobilität", "Gesundheit & MedTech",
  "Maschinenbau & Ind. 4.0", "HR & Arbeitsmarkt", "Agrar & Lebensmittel",
  "Logistik & Transport", "Versicherung & Risiko", "Chemie & Materialien",
  "E-Commerce & Retail", "Smart City & Kommunen", "Bildung & EdTech",
  "Maritime & Schifffahrt", "Gaming & Entertainment",
];
