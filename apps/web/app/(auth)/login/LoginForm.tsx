"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail } from "lucide-react";
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
    if (error) { setError("E-Mail oder Passwort falsch."); setLoading(false); return; }
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
    <div
      className="p-8 rounded-2xl"
      style={{ background: "#FFFFFF", border: "1px solid #E2DDD2", boxShadow: "0 12px 40px -16px rgba(26,24,19,0.18)" }}
    >
      <div className="inline-flex items-center gap-3 mb-5">
        <span className="block w-7 h-px" style={{ background: "#E08900" }} />
        <span className="text-[11px] font-semibold uppercase" style={{ letterSpacing: "0.22em", color: "#E08900" }}>
          Anmelden
        </span>
      </div>
      <h1 className="text-[26px] font-light leading-tight mb-1.5" style={{ fontFamily: "var(--font-display), Georgia, serif", letterSpacing: "-0.015em", color: "#1A1813" }}>
        Willkommen zurück
      </h1>
      <p className="text-[14px] mb-7" style={{ color: "#57534A" }}>Melden Sie sich in Ihrem Konto an</p>

      {error && (
        <div
          className="text-red-600 text-xs font-medium px-3.5 py-2.5 mb-4 rounded-lg"
          style={{ background: "#fef2f2", border: "1px solid #fecaca", borderLeft: "3px solid #ef4444" }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#57534A" }}>E-Mail-Adresse</label>
          <input
            type="email" required autoComplete="email"
            value={email} onChange={e => setEmail(e.target.value)}
            placeholder="name@firma.de"
            className="fl-input w-full px-3.5 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="flex items-center justify-between text-xs font-semibold mb-1.5" style={{ color: "#57534A" }}>
            Passwort
            <a href="#" className="font-medium hover:underline" style={{ color: "#E08900" }}>Vergessen?</a>
          </label>
          <input
            type="password" required autoComplete="current-password"
            value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="fl-input w-full px-3.5 py-2.5 text-sm"
          />
        </div>
        <button
          type="submit" disabled={loading}
          className="w-full py-3 text-sm font-bold disabled:opacity-50 transition-all hover:-translate-y-px rounded-xl border-none"
          style={{ background: "#FFB300", color: "#1A1100", boxShadow: "0 4px 14px rgba(224,137,0,0.28)" }}
        >
          {loading ? "Anmelden…" : "Anmelden"}
        </button>
      </form>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px" style={{ background: "#E2DDD2" }} />
        <span className="text-xs" style={{ color: "#8C887E" }}>oder</span>
        <div className="flex-1 h-px" style={{ background: "#E2DDD2" }} />
      </div>

      <button
        type="button" onClick={handleMagicLink} disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium disabled:opacity-50 transition-all hover:-translate-y-px rounded-xl"
        style={{ background: "#F7F5F0", border: "1px solid #E2DDD2", color: "#1A1813" }}
      >
        <Mail size={15} strokeWidth={1.75} />
        Magic Link per E-Mail
      </button>

      <p className="text-center text-xs mt-6" style={{ color: "#57534A" }}>
        Noch kein Konto?{" "}
        <Link href="/register" className="font-semibold hover:underline" style={{ color: "#E08900" }}>
          Kostenlos registrieren
        </Link>
      </p>
    </div>
  );
}
