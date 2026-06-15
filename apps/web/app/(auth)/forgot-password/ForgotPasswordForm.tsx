"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function ForgotPasswordForm() {
  const [email,   setEmail]   = useState("");
  const [status,  setStatus]  = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/confirm?type=recovery&next=/reset-password`,
    });

    if (error) {
      setErrorMsg("Fehler beim Senden. Bitte versuche es erneut.");
      setStatus("error");
      return;
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="p-8 rounded-2xl" style={{ background: "#FFFFFF", border: "1px solid #E2DDD2" }}>
        <div className="inline-flex items-center gap-3 mb-5">
          <span className="block w-7 h-px" style={{ background: "#E08900" }} />
          <span className="text-[11px] font-semibold uppercase" style={{ letterSpacing: "0.22em", color: "#E08900" }}>
            E-Mail gesendet
          </span>
        </div>
        <h1 className="text-[22px] font-light leading-tight mb-3" style={{ fontFamily: "var(--font-display), Georgia, serif", color: "#1A1813" }}>
          Prüfe dein Postfach
        </h1>
        <p className="text-[14px] leading-relaxed mb-6" style={{ color: "#57534A" }}>
          Falls ein Konto mit <strong>{email}</strong> existiert, hast du eine E-Mail mit einem Link zum Zurücksetzen deines Passworts erhalten.
        </p>
        <Link
          href="/login"
          className="text-sm font-semibold hover:underline"
          style={{ color: "#E08900" }}
        >
          ← Zurück zur Anmeldung
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 rounded-2xl" style={{ background: "#FFFFFF", border: "1px solid #E2DDD2", boxShadow: "0 12px 40px -16px rgba(26,24,19,0.18)" }}>
      <div className="inline-flex items-center gap-3 mb-5">
        <span className="block w-7 h-px" style={{ background: "#E08900" }} />
        <span className="text-[11px] font-semibold uppercase" style={{ letterSpacing: "0.22em", color: "#E08900" }}>
          Passwort zurücksetzen
        </span>
      </div>
      <h1 className="text-[26px] font-light leading-tight mb-1.5" style={{ fontFamily: "var(--font-display), Georgia, serif", letterSpacing: "-0.015em", color: "#1A1813" }}>
        Passwort vergessen?
      </h1>
      <p className="text-[14px] mb-7" style={{ color: "#57534A" }}>
        Gib deine E-Mail-Adresse ein — wir schicken dir einen Reset-Link.
      </p>

      {status === "error" && (
        <div className="text-red-600 text-xs font-medium px-3.5 py-2.5 mb-4 rounded-lg" style={{ background: "#fef2f2", border: "1px solid #fecaca", borderLeft: "3px solid #ef4444" }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#57534A" }}>E-Mail-Adresse</label>
          <input
            type="email" required
            value={email} onChange={e => setEmail(e.target.value)}
            placeholder="name@firma.de"
            className="fl-input w-full px-3.5 py-2.5 text-sm"
          />
        </div>
        <button
          type="submit" disabled={status === "loading"}
          className="w-full py-3 text-sm font-bold disabled:opacity-50 transition-all hover:-translate-y-px rounded-xl border-none"
          style={{ background: "#FFB300", color: "#1A1100", boxShadow: "0 4px 14px rgba(224,137,0,0.28)" }}
        >
          {status === "loading" ? "Wird gesendet…" : "Reset-Link senden"}
        </button>
      </form>

      <p className="text-center text-xs mt-6" style={{ color: "#57534A" }}>
        <Link href="/login" className="font-semibold hover:underline" style={{ color: "#E08900" }}>
          ← Zurück zur Anmeldung
        </Link>
      </p>
    </div>
  );
}
