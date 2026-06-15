"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

const TIME_OPTIONS = [
  { value: "06:00", label: "06:00 Uhr" },
  { value: "07:00", label: "07:00 Uhr" },
  { value: "08:00", label: "08:00 Uhr" },
  { value: "09:00", label: "09:00 Uhr" },
  { value: "10:00", label: "10:00 Uhr" },
];

interface Props {
  initialOptIn: boolean;
  frequency: "daily" | "weekly" | "realtime";
  initialTime?: string;
}

export default function NewsletterToggle({ initialOptIn, initialTime = "07:00" }: Props) {
  const [optIn, setOptIn]     = useState(initialOptIn);
  const [time, setTime]       = useState(initialTime);
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
        const res = await fetch("/api/newsletter/unsubscribe", { method: "POST" });
        if (res.ok) {
          setOptIn(false);
          showMsg("Abgemeldet. Du kannst dich jederzeit wieder anmelden.");
        } else {
          showMsg("Fehler beim Abmelden. Bitte erneut versuchen.");
        }
      } else {
        const res = await fetch("/api/newsletter/subscribe", { method: "POST" });
        const data = await res.json();
        if (res.ok) {
          showMsg("Bestätigungs-Mail gesendet — bitte prüfe dein Postfach.");
        } else {
          showMsg((data.detail ? `${data.error}: ${data.detail}` : data.error) ?? "Fehler beim Anmelden.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTime = async (newTime: string) => {
    setTime(newTime);
    await fetch("/api/user/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newsletter_frequency: "weekly", newsletter_time: newTime }),
    });
  };

  return (
    <div className="space-y-4">

      {/* Toggle row */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: "#1A1813" }}>
            Weekly Briefing abonnieren
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#8C887E" }}>
            {optIn
              ? "Du erhältst jeden Montag dein personalisiertes Briefing"
              : "Jeden Montag: Top 5 Meldungen aus deinen Branchen — impact-gerankt"}
          </p>
        </div>

        <button
          onClick={handleToggle}
          disabled={loading}
          className="relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer disabled:opacity-60"
          style={{ background: optIn ? "#FFB300" : "#E2DDD2" }}
          aria-label={optIn ? "Weekly Briefing abmelden" : "Weekly Briefing anmelden"}
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

      {/* Delivery time — only when opted in */}
      {optIn && (
        <div className="flex items-center gap-3 pt-1">
          <span className="text-xs font-medium flex-shrink-0 w-20" style={{ color: "#8C887E" }}>
            Uhrzeit
          </span>
          <div className="relative">
            <select
              value={time}
              onChange={(e) => handleTime(e.target.value)}
              className="text-xs font-medium rounded-full px-3 py-1.5 pr-7 appearance-none cursor-pointer"
              style={{ background: "#FAF8F4", color: "#57534A", border: "1px solid #E2DDD2", outline: "none" }}
            >
              {TIME_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs" style={{ color: "#8C887E" }}>
              ▾
            </span>
          </div>
          <span className="text-xs" style={{ color: "#C8C2B6" }}>
            montags (CEST)
          </span>
        </div>
      )}
    </div>
  );
}
