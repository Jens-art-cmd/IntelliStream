"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

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
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-8 text-center space-y-3">
        <div className="text-4xl">📬</div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Bestätigungsmail gesendet</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Bitte prüfe dein Postfach und klicke den Link um dein Konto zu aktivieren.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-xl shadow p-8 space-y-4">
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
        <input
          type="text" autoComplete="name"
          value={name} onChange={e => setName(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

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
          type="password" required autoComplete="new-password" minLength={8}
          value={password} onChange={e => setPassword(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <p className="text-xs text-gray-500 mt-1">Mindestens 8 Zeichen</p>
      </div>

      <button
        type="submit" disabled={loading}
        className="w-full bg-brand-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50"
      >
        {loading ? "Registrieren…" : "Konto erstellen"}
      </button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Bereits registriert?{" "}
        <Link href="/login" className="text-brand-600 hover:underline">Anmelden</Link>
      </p>
    </form>
  );
}
