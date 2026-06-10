"use client";

import { useState } from "react";

// ── Typen ──────────────────────────────────────────────────────────────────
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

// ── Hilfskonstanten ────────────────────────────────────────────────────────
const IMPACT_OPTIONS: { value: ImpactLevel; label: string }[] = [
  { value: "low",    label: "Alle Artikel (niedrig und höher)" },
  { value: "medium", label: "Mittlerer Impact und höher" },
  { value: "high",   label: "Nur hoher Impact" },
];

const IMPACT_BADGE: Record<ImpactLevel, string> = {
  high:   "bg-red-50 text-red-700 border-red-100",
  medium: "bg-amber-50 text-amber-700 border-amber-100",
  low:    "bg-emerald-50 text-emerald-700 border-emerald-100",
};
const IMPACT_LABEL: Record<ImpactLevel, string> = {
  high: "Nur Hoch", medium: "Mittel+", low: "Alle",
};

// ── Formular-Startzustand ──────────────────────────────────────────────────
const FORM_INIT = { name: "", keywords: [] as string[], kwInput: "", minImpact: "medium" as ImpactLevel };

// ── Hauptkomponente ────────────────────────────────────────────────────────
export default function AlertManager({ initialAlerts }: { initialAlerts: Alert[] }) {
  const [alerts, setAlerts]       = useState<Alert[]>(initialAlerts);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(FORM_INIT);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving]       = useState(false);
  const [busy, setBusy]           = useState<string | null>(null); // id of alert being toggled/deleted

  // ── Keyword-Chip helpers ─────────────────────────────────────────────────
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

  // ── Alert erstellen ──────────────────────────────────────────────────────
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    // Letztes Keyword-Input noch committen, falls der User Enter nicht gedrückt hat
    const keywords = form.kwInput.trim()
      ? [...new Set([...form.keywords, form.kwInput.trim().toLowerCase()])]
      : form.keywords;

    if (!form.name.trim()) { setFormError("Bitte geben Sie einen Namen ein."); return; }
    if (keywords.length === 0) { setFormError("Mindestens ein Stichwort ist erforderlich."); return; }

    setSaving(true);
    const res = await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        keywords,
        companies: [],
        laws: [],
        min_impact: form.minImpact,
        channel: "email",
      }),
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

  // ── Toggle aktiv/inaktiv ─────────────────────────────────────────────────
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

  // ── Alert löschen ────────────────────────────────────────────────────────
  async function deleteAlert(id: string, name: string) {
    if (!confirm(`Alert „${name}" wirklich löschen?`)) return;
    setBusy(id);
    await fetch(`/api/alerts/${id}`, { method: "DELETE" });
    setAlerts(prev => prev.filter(a => a.id !== id));
    setBusy(null);
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto px-6 py-7">

      {/* ── Page header ───────────────────────────────────── */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-bold tracking-tighter-md text-neutral-900">Meine Alerts</h1>
          <p className="text-xs text-neutral-400 mt-1">
            {alerts.filter(a => a.is_active).length}{" "}
            aktive{alerts.filter(a => a.is_active).length !== 1 ? "" : "r"} Alert
            {alerts.filter(a => a.is_active).length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => { setShowForm(v => !v); setFormError(null); }}
          className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl text-neutral-900 transition-all hover:opacity-90 active:opacity-80"
          style={showForm ? { background: "#e8eef5", border: "1px solid #d1d5db" } : { background: "linear-gradient(135deg, #ffca28 0%, #ffb300 100%)" }}
        >
          {showForm ? "Abbrechen" : "+ Neuer Alert"}
        </button>
      </div>

      {/* ── Erstellungsformular ────────────────────────────── */}
      {showForm && (
        <div className="bg-white border border-neutral-100 rounded-xl p-5 mb-4 shadow-xs">
          <h2 className="text-sm font-semibold text-neutral-900 mb-4">Alert erstellen</h2>
          <form onSubmit={handleCreate} className="space-y-4">

            {formError && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-medium rounded-lg px-3.5 py-2.5">
                {formError}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="z.B. Energiepolitik Deutschland"
                className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-amber-400 transition-all"
              />
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Stichwörter{" "}
                <span className="font-normal text-neutral-400">— Enter oder Komma zum Hinzufügen</span>
              </label>
              <div
                className="border border-neutral-200 rounded-xl px-3 py-2 focus-within:border-amber-400 transition-all min-h-[44px] flex flex-wrap gap-1.5 items-center cursor-text"
                onClick={e => (e.currentTarget.querySelector("input") as HTMLInputElement | null)?.focus()}
              >
                {form.keywords.map(kw => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full"
                  >
                    {kw}
                    <button
                      type="button"
                      onClick={() => removeKeyword(kw)}
                      className="text-amber-500 hover:text-amber-700 leading-none"
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
                  className="flex-1 min-w-[140px] text-sm bg-transparent text-neutral-900 placeholder-neutral-400 focus:outline-none py-0.5"
                />
              </div>
            </div>

            {/* Min. Impact */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Mindest-Impact</label>
              <select
                value={form.minImpact}
                onChange={e => setForm(f => ({ ...f, minImpact: e.target.value as ImpactLevel }))}
                className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm bg-white text-neutral-900 focus:outline-none focus:border-amber-400 transition-all"
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
                className="px-5 py-2 rounded-xl text-xs font-bold text-neutral-900 disabled:opacity-50 transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #ffca28 0%, #ffb300 100%)" }}
              >
                {saving ? "Speichern…" : "Alert speichern"}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setForm(FORM_INIT); setFormError(null); }}
                className="px-5 py-2 rounded-xl text-xs font-medium text-neutral-600 border border-neutral-200 hover:border-neutral-400 transition-all"
              >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Leerer Zustand ─────────────────────────────────── */}
      {alerts.length === 0 && !showForm && (
        <div className="text-center py-16">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
            style={{ background: "linear-gradient(135deg, #f0f4f8 0%, #e8eef5 100%)", boxShadow: "4px 4px 8px #c5cad3, -2px -2px 6px #ffffff" }}
          >
            <span className="text-xl">🔔</span>
          </div>
          <p className="text-sm font-semibold text-neutral-700 mb-1">Noch keine Alerts</p>
          <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
            Erstellen Sie Ihren ersten Alert, um täglich über passende Artikel per E-Mail benachrichtigt zu werden.
          </p>
        </div>
      )}

      {/* ── Alert-Liste ────────────────────────────────────── */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map(alert => (
            <div
              key={alert.id}
              className={`bg-white border border-neutral-100 rounded-xl px-5 py-4 shadow-xs transition-all ${
                !alert.is_active ? "opacity-50" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="text-sm font-semibold text-neutral-900 truncate">{alert.name}</span>
                    <span className={`text-2xs font-semibold px-2 py-0.5 rounded-full border ${IMPACT_BADGE[alert.min_impact]}`}>
                      {IMPACT_LABEL[alert.min_impact]}
                    </span>
                    <span className="text-2xs text-neutral-400 border border-neutral-200 px-2 py-0.5 rounded-full">
                      E-Mail
                    </span>
                  </div>
                  {alert.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {alert.keywords.map(kw => (
                        <span key={kw} className="text-2xs text-neutral-500 bg-neutral-50 border border-neutral-200 px-2 py-0.5 rounded-full">
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Aktionen */}
                <div className="flex items-center gap-2.5 flex-shrink-0 pt-0.5">
                  {/* Toggle */}
                  <button
                    onClick={() => toggleAlert(alert.id, alert.is_active)}
                    disabled={busy === alert.id}
                    aria-label={alert.is_active ? "Deaktivieren" : "Aktivieren"}
                    className={`relative w-9 h-5 rounded-full transition-all flex-shrink-0 disabled:opacity-40 ${
                      !alert.is_active ? "bg-neutral-200" : ""
                    }`}
                    style={alert.is_active ? { background: "linear-gradient(135deg, #ffca28, #ffb300)" } : {}}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${
                        alert.is_active ? "left-4" : "left-0.5"
                      }`}
                    />
                  </button>
                  {/* Löschen */}
                  <button
                    onClick={() => deleteAlert(alert.id, alert.name)}
                    disabled={busy === alert.id}
                    aria-label="Alert löschen"
                    className="text-neutral-300 hover:text-red-400 disabled:opacity-40 transition-colors text-lg leading-none"
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
      <div className="mt-6 bg-white border border-neutral-100 rounded-xl px-5 py-4 shadow-xs">
        <p className="text-xs text-neutral-500 leading-relaxed">
          <span className="font-semibold text-neutral-700">Wie funktionieren Alerts?</span>{" "}
          Täglich um 08:00 Uhr werden neu verarbeitete Artikel gegen Ihre Stichwörter geprüft.
          Bei Treffern erhalten Sie eine E-Mail mit einer Zusammenfassung der passenden Artikel.
          Alerts können jederzeit pausiert oder gelöscht werden.
        </p>
      </div>

    </div>
  );
}
