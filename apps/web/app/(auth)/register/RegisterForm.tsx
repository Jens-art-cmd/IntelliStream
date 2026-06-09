"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { isBusinessEmail, BUSINESS_EMAIL_ERROR } from "../../../../../packages/shared/src/business-email";

export default function RegisterForm() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]         = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [emailError, setEmailError] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setEmailError(false);
    setLoading(true);

    // Business-E-Mail-Pflicht: Gratis-Anbieter werden nicht akzeptiert
    if (!isBusinessEmail(email)) {
      setError(BUSINESS_EMAIL_ERROR);
      setEmailError(true);
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${location.origin}/auth/confirm`,
      },
    });

    setLoading(false);
    if (error) { setError(error.message); return; }
    setDone(true);
  }

  if (done) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-xl text-center space-y-3">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-md"
          style={{ background: "linear-gradient(135deg, #ffca28 0%, #ff8f00 100%)" }}
        >
          <span className="text-2xl">📬</span>
        </div>
        <h2 className="text-base font-bold text-neutral-900">Bestätigungsmail gesendet</h2>
        <p className="text-sm text-neutral-500 leading-relaxed">
          Bitte prüfen Sie Ihr Postfach und klicken Sie den Link um Ihr Konto zu aktivieren.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl">
      <h1 className="text-xl font-bold tracking-tighter-md text-neutral-900 mb-1">Konto erstellen</h1>
      <p className="text-sm text-neutral-500 mb-6">Kostenlos starten — keine Kreditkarte nötig</p>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-medium rounded-lg px-3.5 py-2.5 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Name</label>
          <input
            type="text" autoComplete="name"
            value={name} onChange={e => setName(e.target.value)}
            placeholder="Ihr Name"
            className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-amber-400 focus:ring-gold transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
            Geschäftliche E-Mail-Adresse
          </label>
          <input
            type="email" required autoComplete="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setEmailError(false); }}
            placeholder="name@ihrefirma.de"
            className={`w-full border rounded-xl px-3.5 py-2.5 text-sm bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none transition-all ${
              emailError
                ? "border-red-400 focus:border-red-400 bg-red-50"
                : "border-neutral-200 focus:border-amber-400 focus:ring-gold"
            }`}
          />
          <p className="mt-1.5 text-xs text-neutral-400">
            Nur geschäftliche Adressen — kein Gmail, GMX o.ä.
          </p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Passwort</label>
          <input
            type="password" required autoComplete="new-password" minLength={8}
            value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Mindestens 8 Zeichen"
            className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-amber-400 focus:ring-gold transition-all"
          />
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full py-2.5 rounded-xl text-sm font-bold text-neutral-900 shadow-sm hover:shadow-md hover:-translate-y-px disabled:opacity-50 disabled:transform-none transition-all duration-200"
          style={{ background: "linear-gradient(135deg, #ffca28 0%, #ffb300 100%)" }}
        >
          {loading ? "Registrieren…" : "Konto erstellen"}
        </button>
      </form>

      <p className="text-center text-xs text-neutral-500 mt-5">
        Bereits registriert?{" "}
        <Link href="/login" className="text-amber-600 font-semibold hover:underline">
          Anmelden
        </Link>
      </p>
    </div>
  );
}
