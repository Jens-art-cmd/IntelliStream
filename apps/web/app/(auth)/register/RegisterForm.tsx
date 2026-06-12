"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { isBusinessEmail, BUSINESS_EMAIL_ERROR } from "@/lib/business-email";

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
      <div className="rounded-2xl p-8 text-center" style={{ background: "#FFFFFF", border: "1px solid #E2DDD2", boxShadow: "0 12px 40px -16px rgba(26,24,19,0.18)" }}>
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: "#FFF6E0", border: "1px solid #FFB300" }}
        >
          <Mail size={22} strokeWidth={1.75} color="#E08900" />
        </div>
        <h2 className="text-[22px] font-light mb-2" style={{ fontFamily: "var(--font-display), Georgia, serif", color: "#1A1813" }}>
          Bestätigungsmail gesendet
        </h2>
        <p className="text-[14px] leading-relaxed" style={{ color: "#57534A" }}>
          Bitte prüfen Sie Ihr Postfach und klicken Sie den Link um Ihr Konto zu aktivieren.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-8" style={{ background: "#FFFFFF", border: "1px solid #E2DDD2", boxShadow: "0 12px 40px -16px rgba(26,24,19,0.18)" }}>
      <div className="inline-flex items-center gap-3 mb-5">
        <span className="block w-7 h-px" style={{ background: "#E08900" }} />
        <span className="text-[11px] font-semibold uppercase" style={{ letterSpacing: "0.22em", color: "#E08900" }}>
          Registrieren
        </span>
      </div>
      <h1 className="text-[26px] font-light leading-tight mb-1.5" style={{ fontFamily: "var(--font-display), Georgia, serif", letterSpacing: "-0.015em", color: "#1A1813" }}>
        Konto erstellen
      </h1>
      <p className="text-[14px] mb-7" style={{ color: "#57534A" }}>Kostenlos starten — keine Kreditkarte nötig</p>

      {error && (
        <div className="text-red-600 text-xs font-medium rounded-lg px-3.5 py-2.5 mb-4" style={{ background: "#fef2f2", border: "1px solid #fecaca", borderLeft: "3px solid #ef4444" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#57534A" }}>Name</label>
          <input
            type="text" autoComplete="name"
            value={name} onChange={e => setName(e.target.value)}
            placeholder="Ihr Name"
            className="fl-input w-full px-3.5 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#57534A" }}>
            Geschäftliche E-Mail-Adresse
          </label>
          <input
            type="email" required autoComplete="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setEmailError(false); }}
            placeholder="name@ihrefirma.de"
            className={`fl-input w-full px-3.5 py-2.5 text-sm ${emailError ? "border-red-400 bg-red-50" : ""}`}
          />
          <p className="mt-1.5 text-xs" style={{ color: "#8C887E" }}>
            Nur geschäftliche Adressen — kein Gmail, GMX o.ä.
          </p>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#57534A" }}>Passwort</label>
          <input
            type="password" required autoComplete="new-password" minLength={8}
            value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Mindestens 8 Zeichen"
            className="fl-input w-full px-3.5 py-2.5 text-sm"
          />
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-bold hover:-translate-y-px disabled:opacity-50 disabled:transform-none transition-all duration-200 border-none"
          style={{ background: "#FFB300", color: "#1A1100", boxShadow: "0 4px 14px rgba(224,137,0,0.28)" }}
        >
          {loading ? "Registrieren…" : "Konto erstellen"}
        </button>
      </form>

      <p className="text-center text-xs mt-6" style={{ color: "#57534A" }}>
        Bereits registriert?{" "}
        <Link href="/login" className="font-semibold hover:underline" style={{ color: "#E08900" }}>
          Anmelden
        </Link>
      </p>
    </div>
  );
}
