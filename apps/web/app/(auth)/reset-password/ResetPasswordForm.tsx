"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [password,  setPassword]  = useState("");
  const [password2, setPassword2] = useState("");
  const [status,    setStatus]    = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg,  setErrorMsg]  = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (password.length < 8) {
      setErrorMsg("Passwort muss mindestens 8 Zeichen lang sein.");
      return;
    }
    if (password !== password2) {
      setErrorMsg("Passwörter stimmen nicht überein.");
      return;
    }

    setStatus("loading");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setErrorMsg("Fehler beim Speichern. Bitte den Reset-Link erneut anfordern.");
      setStatus("error");
      return;
    }

    setStatus("done");
    setTimeout(() => router.push("/dashboard/feed"), 2000);
  }

  if (status === "done") {
    return (
      <div className="p-8 rounded-2xl" style={{ background: "#FFFFFF", border: "1px solid #E2DDD2" }}>
        <div className="inline-flex items-center gap-3 mb-5">
          <span className="block w-7 h-px" style={{ background: "#E08900" }} />
          <span className="text-[11px] font-semibold uppercase" style={{ letterSpacing: "0.22em", color: "#2D7553" }}>
            Passwort gespeichert
          </span>
        </div>
        <p className="text-[14px]" style={{ color: "#57534A" }}>
          Dein Passwort wurde erfolgreich geändert. Du wirst gleich weitergeleitet…
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 rounded-2xl" style={{ background: "#FFFFFF", border: "1px solid #E2DDD2", boxShadow: "0 12px 40px -16px rgba(26,24,19,0.18)" }}>
      <div className="inline-flex items-center gap-3 mb-5">
        <span className="block w-7 h-px" style={{ background: "#E08900" }} />
        <span className="text-[11px] font-semibold uppercase" style={{ letterSpacing: "0.22em", color: "#E08900" }}>
          Neues Passwort
        </span>
      </div>
      <h1 className="text-[26px] font-light leading-tight mb-1.5" style={{ fontFamily: "var(--font-display), Georgia, serif", letterSpacing: "-0.015em", color: "#1A1813" }}>
        Passwort festlegen
      </h1>
      <p className="text-[14px] mb-7" style={{ color: "#57534A" }}>
        Wähle ein neues Passwort für dein Konto.
      </p>

      {(status === "error" || errorMsg) && (
        <div className="text-red-600 text-xs font-medium px-3.5 py-2.5 mb-4 rounded-lg" style={{ background: "#fef2f2", border: "1px solid #fecaca", borderLeft: "3px solid #ef4444" }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#57534A" }}>Neues Passwort</label>
          <input
            type="password" required minLength={8}
            value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Mindestens 8 Zeichen"
            className="fl-input w-full px-3.5 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#57534A" }}>Passwort bestätigen</label>
          <input
            type="password" required
            value={password2} onChange={e => setPassword2(e.target.value)}
            placeholder="Passwort wiederholen"
            className="fl-input w-full px-3.5 py-2.5 text-sm"
          />
        </div>
        <button
          type="submit" disabled={status === "loading"}
          className="w-full py-3 text-sm font-bold disabled:opacity-50 transition-all hover:-translate-y-px rounded-xl border-none"
          style={{ background: "#FFB300", color: "#1A1100", boxShadow: "0 4px 14px rgba(224,137,0,0.28)" }}
        >
          {status === "loading" ? "Wird gespeichert…" : "Passwort speichern"}
        </button>
      </form>
    </div>
  );
}
