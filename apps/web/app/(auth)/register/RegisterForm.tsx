"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function RegisterForm() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]         = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

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
      <div className="bg-neutral-0 border border-neutral-150 rounded-xl p-8 shadow-md text-center space-y-3">
        <div className="text-4xl">📬</div>
        <h2 className="text-base font-bold text-neutral-900">Bestätigungsmail gesendet</h2>
        <p className="text-sm text-neutral-500 leading-relaxed">
          Bitte prüfen Sie Ihr Postfach und klicken Sie den Link um Ihr Konto zu aktivieren.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-0 border border-neutral-150 rounded-xl p-8 shadow-md">
      <h1 className="text-xl font-bold tracking-tighter-md text-neutral-900 mb-1">Konto erstellen</h1>
      <p className="text-sm text-neutral-500 mb-6">Kostenlos starten — keine Kreditkarte nötig</p>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-medium rounded-md px-3 py-2 mb-4">
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
            className="w-full border-[1.5px] border-neutral-200 rounded-md px-3 py-2 text-sm bg-neutral-0 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-brand-500 focus:ring-3 focus:ring-brand-50 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1.5">E-Mail-Adresse</label>
          <input
            type="email" required autoComplete="email"
            value={email} onChange={e => setEmail(e.target.value)}
            placeholder="name@firma.de"
            className="w-full border-[1.5px] border-neutral-200 rounded-md px-3 py-2 text-sm bg-neutral-0 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-brand-500 focus:ring-3 focus:ring-brand-50 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Passwort</label>
          <input
            type="password" required autoComplete="new-password" minLength={8}
            value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Mindestens 8 Zeichen"
            className="w-full border-[1.5px] border-neutral-200 rounded-md px-3 py-2 text-sm bg-neutral-0 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-brand-500 focus:ring-3 focus:ring-brand-50 transition-all"
          />
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full bg-brand-600 text-white py-2.5 rounded-md text-sm font-semibold hover:bg-brand-700 disabled:opacity-50 transition-colors tracking-tight-sm"
        >
          {loading ? "Registrieren…" : "Konto erstellen"}
        </button>
      </form>

      <p className="text-center text-xs text-neutral-500 mt-5">
        Bereits registriert?{" "}
        <Link href="/login" className="text-brand-600 font-medium hover:underline">Anmelden</Link>
      </p>
    </div>
  );
}
