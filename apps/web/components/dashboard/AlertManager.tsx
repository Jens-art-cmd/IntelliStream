"use client";

import { useState } from "react";
import { Bell, Check } from "lucide-react";

type ImpactLevel = "high" | "medium" | "low";
type AlertChannel = "email" | "push" | "both";

interface Alert {
  id: string;
  name: string;
  keywords: string[];
  companies: string[];
  laws: string[];
  min_impact: ImpactLevel;
  channel: AlertChannel;
  is_active: boolean;
  created_at: string;
}

const IMPACT_OPTIONS: { value: ImpactLevel; label: string }[] = [
  { value: "low",    label: "Alle Artikel (niedrig und höher)" },
  { value: "medium", label: "Mittlerer Impact und höher" },
  { value: "high",   label: "Nur hoher Impact" },
];

const IMPACT_STYLE: Record<ImpactLevel, React.CSSProperties> = {
  high:   { background: "#FEF0EE", color: "#C0392B", border: "1px solid #F5C6C1" },
  medium: { background: "#FFF6E0", color: "#E08900", border: "1px solid #FFD966" },
  low:    { background: "#F0F7F0", color: "#2D7553", border: "1px solid #A8D5A8" },
};
const IMPACT_LABEL: Record<ImpactLevel, string> = {
  high: "Nur Hoch", medium: "Mittel+", low: "Alle",
};

const FORM_INIT = { name: "", keywords: [] as string[], kwInput: "", minImpact: "medium" as ImpactLevel };

export default function AlertManager({ initialAlerts }: { initialAlerts: Alert[] }) {
  const [alerts, setAlerts]       = useState<Alert[]>(initialAlerts);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(FORM_INIT);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving]       = useState(false);
  const [busy, setBusy]           = useState<string | null>(null);

  function addKeyword() {
    const kw = form.kwInput.trim().toLowerCase();
    if (kw && !form.keywords.includes(kw)) {
      setForm(f => ({ ...f, keywords: [...f.keywords, kw], kwInput: "" }));
    } else {
      setForm(f => ({ ...f, kwInput: "" }));
    }
  }
  function removeKeyword(kw: string) {
    setForm(f => ({ ...f, keywords: f.keywords.filter(k => k !== kw) }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const keywords = form.kwInput.trim()
      ? [...new Set([...form.keywords, form.kwInput.trim().toLowerCase()])]
      : form.keywords;

    if (!form.name.trim()) { setFormError("Bitte einen Namen eingeben."); return; }
    if (keywords.length === 0) { setFormError("Mindestens ein Stichwort ist erforderlich."); return; }

    setSaving(true);
    const res = await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, keywords, companies: [], laws: [], min_impact: form.minImpact, channel: "email" }),
    });
    setSaving(false);

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setFormError((json as { error?: string }).error ?? "Fehler beim Speichern");
      return;
    }
    const { alert } = await res.json();
    setAlerts(prev => [alert, ...prev]);
    setForm(FORM_INIT);
    setShowForm(false);
  }

  async function toggleAlert(id: string, current: boolean) {
    setBusy(id);
    await fetch(`/api/alerts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !current }),
    });
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_active: !current } : a));
    setBusy(null);
  }

  async function deleteAlert(id: string, name: string) {
    if (!confirm(`Alert „${name}" wirklich löschen?`)) return;
    setBusy(id);
    await fetch(`/api/alerts/${id}`, { method: "DELETE" });
    setAlerts(prev => prev.filter(a => a.id !== id));
    setBusy(null);
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-7">

      {/* ── Page header ───────────────────────────────────── */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="block w-5 h-px" style={{ background: "#E08900" }} />
            <span className="text-[10px] font-semibold uppercase" style={{ letterSpacing: "0.2em", color: "#E08900" }}>
              Alerts
            </span>
          </div>
          <h1
            className="text-[22px] font-light leading-tight"
            style={{ fontFamily: "var(--font-display), Georgia, serif", color: "#1A1813", letterSpacing: "-0.015em" }}
          >
            Meine Alerts
          </h1>
          <p className="text-xs mt-1" style={{ color: "#8C887E" }}>
            {alerts.filter(a => a.is_active).length} aktive
            {alerts.filter(a => a.is_active).length !== 1 ? "" : "r"} Alert
            {alerts.filter(a => a.is_active).length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => { setShowForm(v => !v); setFormError(null); }}
          className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all hover:opacity-90 cursor-pointer"
          style={showForm
            ? { background: "#FAF8F4", border: "1px solid #E2DDD2", color: "#57534A" }
            : { background: "#FFB300", color: "#1A1100", boxShadow: "0 4px 14px rgba(224,137,0,0.22)" }
          }
        >
          {showForm ? "Abbrechen" : "+ Neuer Alert"}
        </button>
      </div>

      {/* ── Erstellungsformular ────────────────────────────── */}
      {showForm && (
        <div className="rounded-xl p-5 mb-4" style={{ background: "#FFFFFF", border: "1px solid #E2DDD2" }}>
          <div className="flex items-center gap-2.5 mb-4">
            <span className="block w-4 h-px" style={{ background: "#E08900" }} />
            <span className="text-[9px] font-bold uppercase" style={{ letterSpacing: "0.16em", color: "#8C887E" }}>
              Alert erstellen
            </span>
          </div>
          <form onSubmit={handleCreate} className="space-y-4">

            {formError && (
              <div className="text-xs font-medium rounded-lg px-3.5 py-2.5" style={{ background: "#FEF0EE", border: "1px solid #F5C6C1", color: "#C0392B" }}>
                {formError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#57534A" }}>Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="z.B. Energiepolitik Deutschland"
                className="fl-input w-full px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#57534A" }}>
                Stichwörter{" "}
                <span className="font-normal" style={{ color: "#8C887E" }}>— Enter oder Komma zum Hinzufügen</span>
              </label>
              <div
                className="fl-input px-3 py-2 min-h-[44px] flex flex-wrap gap-1.5 items-center cursor-text"
                onClick={e => (e.currentTarget.querySelector("input") as HTMLInputElement | null)?.focus()}
              >
                {form.keywords.map(kw => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                    style={{ background: "#FFF6E0", color: "#E08900", border: "1px solid #FFD966" }}
                  >
                    {kw}
                    <button
                      type="button"
                      onClick={() => removeKeyword(kw)}
                      className="leading-none hover:opacity-60 cursor-pointer"
                      style={{ color: "#E08900" }}
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={form.kwInput}
                  onChange={e => setForm(f => ({ ...f, kwInput: e.target.value }))}
                  onKeyDown={e => {
                    if (e.key === "Enter") { e.preventDefault(); addKeyword(); }
                    if (e.key === ",")     { e.preventDefault(); addKeyword(); }
                    if (e.key === "Backspace" && !form.kwInput && form.keywords.length > 0) {
                      setForm(f => ({ ...f, keywords: f.keywords.slice(0, -1) }));
                    }
                  }}
                  onBlur={addKeyword}
                  placeholder={form.keywords.length === 0 ? "Photovoltaik, Netzentgelte, EEG…" : ""}
                  className="flex-1 min-w-[140px] text-sm bg-transparent focus:outline-none py-0.5"
                  style={{ color: "#1A1813" }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#57534A" }}>Mindest-Impact</label>
              <select
                value={form.minImpact}
                onChange={e => setForm(f => ({ ...f, minImpact: e.target.value as ImpactLevel }))}
                className="fl-input w-full px-3.5 py-2.5 text-sm"
              >
                {IMPACT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl text-xs font-bold disabled:opacity-50 transition-all hover:opacity-90 cursor-pointer"
                style={{ background: "#FFB300", color: "#1A1100" }}
              >
                {saving ? "Speichern…" : "Alert speichern"}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setForm(FORM_INIT); setFormError(null); }}
                className="px-5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer"
                style={{ background: "#FAF8F4", border: "1px solid #E2DDD2", color: "#57534A" }}
              >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Leerer Zustand ─────────────────────────────────── */}
      {alerts.length === 0 && !showForm && (
        <div className="text-center py-14">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
            style={{ background: "#FFF6E0", border: "1px solid #FFD966" }}
          >
            <Bell size={20} strokeWidth={1.75} color="#E08900" />
          </div>
          <p className="text-sm font-semibold mb-1" style={{ color: "#1A1813" }}>Noch keine Alerts</p>
          <p className="text-xs max-w-xs mx-auto leading-relaxed" style={{ color: "#57534A" }}>
            Erstelle deinen ersten Alert, um täglich über passende Artikel per E-Mail benachrichtigt zu werden.
          </p>
        </div>
      )}

      {/* ── Alert-Liste ────────────────────────────────────── */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map(alert => (
            <div
              key={alert.id}
              className={`rounded-xl px-5 py-4 transition-all ${!alert.is_active ? "opacity-50" : ""}`}
              style={{ background: "#FFFFFF", border: "1px solid #E2DDD2" }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="text-sm font-semibold truncate" style={{ color: "#1A1813" }}>
                      {alert.name}
                    </span>
                    <span
                      className="text-2xs font-semibold px-2 py-0.5 rounded-full"
                      style={IMPACT_STYLE[alert.min_impact]}
                    >
                      {IMPACT_LABEL[alert.min_impact]}
                    </span>
                    <span
                      className="text-2xs px-2 py-0.5 rounded-full"
                      style={{ color: "#8C887E", border: "1px solid #E2DDD2" }}
                    >
                      E-Mail
                    </span>
                  </div>
                  {alert.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {alert.keywords.map(kw => (
                        <span
                          key={kw}
                          className="text-2xs px-2 py-0.5 rounded-full"
                          style={{ background: "#FAF8F4", border: "1px solid #E2DDD2", color: "#57534A" }}
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2.5 flex-shrink-0 pt-0.5">
                  {/* Toggle */}
                  <button
                    onClick={() => toggleAlert(alert.id, alert.is_active)}
                    disabled={busy === alert.id}
                    aria-label={alert.is_active ? "Deaktivieren" : "Aktivieren"}
                    className="relative w-9 h-5 rounded-full transition-all flex-shrink-0 disabled:opacity-40 cursor-pointer"
                    style={alert.is_active ? { background: "#FFB300" } : { background: "#E2DDD2" }}
                  >
                    <span
                      className="absolute top-0.5 w-4 h-4 rounded-full shadow-sm transition-all"
                      style={{
                        background: "#FFFFFF",
                        left: alert.is_active ? "18px" : "2px",
                      }}
                    />
                  </button>
                  {/* Löschen */}
                  <button
                    onClick={() => deleteAlert(alert.id, alert.name)}
                    disabled={busy === alert.id}
                    aria-label="Alert löschen"
                    className="text-lg leading-none disabled:opacity-40 transition-colors cursor-pointer"
                    style={{ color: "#C8C2B6" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#C0392B"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#C8C2B6"; }}
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Info-Box ────────────────────────────────────────── */}
      <div
        className="mt-6 rounded-xl px-5 py-4"
        style={{ background: "#FAF8F4", border: "1px solid #E2DDD2" }}
      >
        <div className="flex items-start gap-2.5">
          <Check size={14} strokeWidth={2} style={{ color: "#E08900", flexShrink: 0, marginTop: "2px" }} />
          <p className="text-xs leading-relaxed" style={{ color: "#57534A" }}>
            <span className="font-semibold" style={{ color: "#1A1813" }}>Wie funktionieren Alerts?</span>{" "}
            Täglich um 08:00 Uhr werden neu verarbeitete Artikel gegen deine Stichwörter geprüft.
            Bei Treffern erhältst du eine E-Mail mit einer Zusammenfassung der passenden Artikel.
            Alerts können jederzeit pausiert oder gelöscht werden.
          </p>
        </div>
      </div>

    </div>
  );
}
