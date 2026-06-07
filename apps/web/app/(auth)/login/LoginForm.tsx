"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard/feed";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    const { error } = await supabase.auth.signInWithOtp({ email,
      options: { emailRedirectTo: `${location.origin}/auth/confirm?next=${next}` },
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setError(null);
    alert("Magic Link gesendet. Bitte E-Mail prüfen.");
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-xl shadow p-8 space-y-4">
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-Mail</label>
        <input
          type="email" required autoComplete="email"
          value={email} onChange={e => setEmail(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Passwort</label>
        <input
          type="password" required autoComplete="current-password"
          value={password} onChange={e => setPassword(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <button
        type="submit" disabled={loading}
        className="w-full bg-brand-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50"
      >
        {loading ? "Anmelden…" : "Anmelden"}
      </button>

      <button
        type="button" onClick={handleMagicLink} disabled={loading}
        className="w-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        Magic Link per E-Mail
      </button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Noch kein Konto?{" "}
        <Link href="/register" className="text-brand-600 hover:underline">Registrieren</Link>
      </p>
    </form>
  );
}
