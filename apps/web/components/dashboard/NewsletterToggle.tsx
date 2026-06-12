"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface Props {
  initialOptIn: boolean;
  frequency: "daily" | "weekly" | "realtime";
}

export default function NewsletterToggle({ initialOptIn, frequency: initialFreq }: Props) {
  const [optIn, setOptIn]     = useState(initialOptIn);
  const [freq, setFreq]       = useState(initialFreq);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]         = useState<string | null>(null);

  const showMsg = (text: string) => {
    setMsg(text);
    setTimeout(() => setMsg(null), 4000);
  };

  const handleToggle = async () => {
    setLoading(true);
    setMsg(null);
    try {
      if (optIn) {
        // Unsubscribe immediately
        const res = await fetch("/api/newsletter/unsubscribe", { method: "POST" });
        if (res.ok) {
          setOptIn(false);
          showMsg("Abgemeldet. Sie können sich jederzeit wieder anmelden.");
        } else {
          showMsg("Fehler beim Abmelden. Bitte erneut versuchen.");
        }
      } else {
        // Send confirmation email
        const res = await fetch("/api/newsletter/subscribe", { method: "POST" });
        const data = await res.json();
        if (res.ok) {
          showMsg("Bestätigungs-Mail gesendet — bitte prüfen Sie Ihr Postfach.");
        } else {
          showMsg((data.detail ? `${data.error}: ${data.detail}` : data.error) ?? "Fehler beim Anmelden.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFrequency = async (newFreq: "daily" | "weekly") => {
    setFreq(newFreq);
    await fetch("/api/user/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newsletter_frequency: newFreq }),
    });
  };

  return (
    <div className="space-y-4">

      {/* Toggle row */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: "#1A1813" }}>
            Newsletter abonnieren
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#8C887E" }}>
            {optIn
              ? "Sie erhalten Ihren personalisierten Newsletter"
              : "Melden Sie sich an, um kuratierte Branchennews zu erhalten"}
          </p>
        </div>

        <button
          onClick={handleToggle}
          disabled={loading}
          className="relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer disabled:opacity-60"
          style={{ background: optIn ? "#FFB300" : "#E2DDD2" }}
          aria-label={optIn ? "Newsletter abmelden" : "Newsletter anmelden"}
        >
          {loading ? (
            <span className="absolute inset-0 flex items-center justify-center">
              <Loader2 size={12} className="animate-spin" color={optIn ? "#1A1100" : "#8C887E"} />
            </span>
          ) : (
            <span
              className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
              style={{ transform: optIn ? "translateX(20px)" : "translateX(0)" }}
            />
          )}
        </button>
      </div>

      {/* Feedback message */}
      {msg && (
        <p
          className="text-xs px-3 py-2 rounded-lg"
          style={{ background: "#FFF6E0", color: "#E08900", border: "1px solid #FFD966" }}
        >
          {msg}
        </p>
      )}

      {/* Frequency selector — only when opted in */}
      {optIn && (
        <div className="flex items-center gap-3 pt-1">
          <span className="text-xs font-medium flex-shrink-0" style={{ color: "#8C887E" }}>
            Frequenz
          </span>
          <div className="flex gap-2">
            {(["daily", "weekly"] as const).map((f) => (
              <button
                key={f}
                onClick={() => handleFrequency(f)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer"
                style={
                  freq === f
                    ? { background: "#FFB300", color: "#1A1100", fontWeight: 600, border: "1px solid #FFB300" }
                    : { background: "#FAF8F4", color: "#57534A", border: "1px solid #E2DDD2" }
                }
              >
                {f === "daily" ? "Täglich" : "Wöchentlich"}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
