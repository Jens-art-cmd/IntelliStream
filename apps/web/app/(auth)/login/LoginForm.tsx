"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard/feed";

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("E-Mail oder Passwort falsch.");
      setLoading(false);
      return;
    }

    router.push(next);
    router.refresh();
  }

  async function handleMagicLink() {
    if (!email) { setError("Bitte E-Mail eingeben."); return; }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/confirm?next=${next}` },
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setError(null);
    alert("Magic Link gesendet. Bitte E-Mail prüfen.");
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl">
      <h1 className="text-xl font-bold tracking-tighter-md text-neutral-900 mb-1">Willkommen zurück</h1>
      <p className="text-sm text-neutral-500 mb-6">Melden Sie sich in Ihrem Konto an</p>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-medium rounded-lg px-3.5 py-2.5 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1.5">E-Mail-Adresse</label>
          <input
            type="email" required autoComplete="email"
            value={email} onChange={e => setEmail(e.target.value)}
            placeholder="name@firma.de"
            className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-amber-400 focus:ring-gold transition-all"
          />
        </div>

        <div>
          <label className="flex items-center justify-between text-xs font-semibold text-neutral-700 mb-1.5">
            Passwort
            <a href="#" className="text-amber-600 font-medium hover:underline">Vergessen?</a>
          </label>
          <input
            type="password" required autoComplete="current-password"
            value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-amber-400 focus:ring-gold transition-all"
          />
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full py-2.5 rounded-xl text-sm font-bold text-neutral-900 shadow-sm hover:shadow-md hover:-translate-y-px disabled:opacity-50 disabled:transform-none transition-all duration-200"
          style={{ background: "linear-gradient(135deg, #ffca28 0%, #ffb300 100%)" }}
        >
          {loading ? "Anmelden…" : "Anmelden"}
        </button>
      </form>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-neutral-100" />
        <span className="text-xs text-neutral-400">oder</span>
        <div className="flex-1 h-px bg-neutral-100" />
      </div>

      <button
        type="button" onClick={handleMagicLink} disabled={loading}
        className="w-full flex items-center justify-center gap-2 border border-neutral-200 text-neutral-700 py-2.5 rounded-xl text-sm font-medium hover:border-neutral-300 hover:bg-neutral-50 disabled:opacity-50 transition-all"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
          <path d="m22 6-10 7L2 6" />
        </svg>
        Magic Link per E-Mail
      </button>

      <p className="text-center text-xs text-neutral-500 mt-5">
        Noch kein Konto?{" "}
        <Link href="/register" className="text-amber-600 font-semibold hover:underline">
          Kostenlos registrieren
        </Link>
      </p>
    </div>
  );
}
