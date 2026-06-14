"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

const C = {
  paper:     "#F7F5F0",
  paperDeep: "#F1EDE4",
  ink:       "#1A1813",
  inkSoft:   "#57534A",
  inkFaint:  "#8C887E",
  amberDeep: "#E08900",
  line:      "#E2DDD2",
};

const serif = { fontFamily: "var(--font-display), Georgia, serif" };

type Status = "idle" | "sending" | "success" | "error";

export default function KontaktPage() {
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [subject,  setSubject]  = useState("");
  const [message,  setMessage]  = useState("");
  const [status,   setStatus]   = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) {
        setErrorMsg(data.error ?? "Ein Fehler ist aufgetreten.");
        setStatus("error");
      } else {
        setStatus("success");
      }
    } catch {
      setErrorMsg("Verbindungsfehler. Bitte prüfe deine Internetverbindung.");
      setStatus("error");
    }
  }

  return (
    <div className="px-6 pt-8 pb-12 max-w-3xl w-full mx-auto">

      {/* Eyebrow */}
      <div className="flex items-center gap-3 mb-5">
        <span className="block w-6 h-px" style={{ background: C.amberDeep }} />
        <span
          className="text-[10px] font-semibold uppercase"
          style={{ letterSpacing: "0.2em", color: C.inkFaint }}
        >
          Support
        </span>
      </div>

      <h1
        className="text-[32px] sm:text-[40px] font-light leading-[1.15] mb-3"
        style={{ ...serif, color: C.ink }}
      >
        Wie können wir{" "}
        <em style={{ color: C.amberDeep, fontStyle: "italic" }}>helfen?</em>
      </h1>
      <p className="text-[15px] leading-relaxed mb-10 max-w-lg" style={{ color: C.inkSoft }}>
        Fragen zu deinem Abonnement, technische Probleme oder Feedback —
        wir antworten in der Regel innerhalb von 24 Stunden.
      </p>

      <div className="grid sm:grid-cols-[1fr_210px] gap-10">

        {/* ── Form ── */}
        <div>
          {status === "success" ? (
            <div
              className="rounded-2xl p-8 flex flex-col items-start gap-4"
              style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}
            >
              <CheckCircle size={28} style={{ color: "#16A34A" }} strokeWidth={1.5} />
              <div>
                <h2 className="text-[17px] font-semibold mb-1" style={{ color: "#15803D" }}>
                  Nachricht gesendet!
                </h2>
                <p className="text-[14px] leading-relaxed" style={{ color: "#166534" }}>
                  Wir haben deine Anfrage erhalten und melden uns innerhalb von
                  24 Stunden unter <strong>{email}</strong>.
                </p>
              </div>
              <button
                onClick={() => { setStatus("idle"); setName(""); setEmail(""); setSubject(""); setMessage(""); }}
                className="text-[13px] font-medium underline underline-offset-2 cursor-pointer"
                style={{ color: "#16A34A" }}
              >
                Neue Anfrage
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

              {/* Name + Email */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-[11px] font-semibold uppercase" style={{ letterSpacing: "0.12em", color: C.inkFaint }}>
                    Name <span style={{ color: C.amberDeep }}>*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Max Mustermann"
                    className="px-4 py-3 rounded-xl text-[14px] outline-none transition-colors duration-150"
                    style={{ background: "#fff", border: `1px solid ${C.line}`, color: C.ink }}
                    onFocus={e => (e.currentTarget.style.borderColor = C.amberDeep)}
                    onBlur={e => (e.currentTarget.style.borderColor = C.line)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-[11px] font-semibold uppercase" style={{ letterSpacing: "0.12em", color: C.inkFaint }}>
                    E-Mail <span style={{ color: C.amberDeep }}>*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="max@firma.de"
                    className="px-4 py-3 rounded-xl text-[14px] outline-none transition-colors duration-150"
                    style={{ background: "#fff", border: `1px solid ${C.line}`, color: C.ink }}
                    onFocus={e => (e.currentTarget.style.borderColor = C.amberDeep)}
                    onBlur={e => (e.currentTarget.style.borderColor = C.line)}
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="subject" className="text-[11px] font-semibold uppercase" style={{ letterSpacing: "0.12em", color: C.inkFaint }}>
                  Betreff
                </label>
                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="z.B. Frage zu meinem Abonnement"
                  className="px-4 py-3 rounded-xl text-[14px] outline-none transition-colors duration-150"
                  style={{ background: "#fff", border: `1px solid ${C.line}`, color: C.ink }}
                  onFocus={e => (e.currentTarget.style.borderColor = C.amberDeep)}
                  onBlur={e => (e.currentTarget.style.borderColor = C.line)}
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-[11px] font-semibold uppercase" style={{ letterSpacing: "0.12em", color: C.inkFaint }}>
                  Nachricht <span style={{ color: C.amberDeep }}>*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Beschreibe dein Anliegen so genau wie möglich…"
                  className="px-4 py-3 rounded-xl text-[14px] outline-none transition-colors duration-150 resize-none leading-relaxed"
                  style={{ background: "#fff", border: `1px solid ${C.line}`, color: C.ink }}
                  onFocus={e => (e.currentTarget.style.borderColor = C.amberDeep)}
                  onBlur={e => (e.currentTarget.style.borderColor = C.line)}
                />
              </div>

              {/* Error */}
              {status === "error" && (
                <div
                  className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-[13px]"
                  style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626" }}
                >
                  <AlertCircle size={15} strokeWidth={2} className="flex-shrink-0 mt-0.5" />
                  {errorMsg}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "sending"}
                className="self-start flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-[14px] font-semibold transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5"
                style={{
                  background: C.amberDeep,
                  color: "#1A1100",
                  boxShadow: "0 4px 14px rgba(224,137,0,0.25)",
                }}
              >
                <Send size={14} strokeWidth={2.5} />
                {status === "sending" ? "Wird gesendet…" : "Nachricht senden"}
              </button>
            </form>
          )}
        </div>

        {/* ── Sidebar info ── */}
        <aside className="flex flex-col gap-5">
          <div
            className="rounded-2xl p-5"
            style={{ background: C.paperDeep, border: `1px solid ${C.line}` }}
          >
            <p className="text-[10px] font-semibold uppercase mb-3" style={{ letterSpacing: "0.15em", color: C.inkFaint }}>
              Direkt schreiben
            </p>
            <a
              href="mailto:support@distillfeed.eu"
              className="text-[13px] font-medium transition-colors duration-150"
              style={{ color: C.amberDeep }}
            >
              support@distillfeed.eu
            </a>
            <p className="text-[12px] mt-2 leading-relaxed" style={{ color: C.inkFaint }}>
              Antwort i.d.R. innerhalb von 24&nbsp;h (Mo–Fr)
            </p>
          </div>

          <div
            className="rounded-2xl p-5"
            style={{ background: C.paperDeep, border: `1px solid ${C.line}` }}
          >
            <p className="text-[10px] font-semibold uppercase mb-3" style={{ letterSpacing: "0.15em", color: C.inkFaint }}>
              Häufige Themen
            </p>
            <ul className="flex flex-col gap-2">
              {[
                "Abonnement & Abrechnung",
                "Technische Probleme",
                "Branchen-Einstellungen",
                "Datenschutz / Löschung",
                "Feedback & Vorschläge",
              ].map(t => (
                <li key={t} className="flex items-center gap-2 text-[12.5px]" style={{ color: C.inkSoft }}>
                  <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: C.amberDeep }} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
