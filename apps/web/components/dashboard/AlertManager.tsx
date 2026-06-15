"use client";

import { useState } from "react";
import { Bell, Check } from "lucide-react";

type ImpactLevel = "high" | "medium" | "low";
type AlertChannel = "email" | "push" | "both";

interface Alert {
  id: string;
  name: string;
  keywords: string[];   // speichert Industry-IDs als Strings: ["4", "6"]
  companies: string[];
  laws: string[];
  min_impact: ImpactLevel;
  channel: AlertChannel;
  is_active: boolean;
  created_at: string;
}

interface Industry {
  id: number;
  name: string;
}

interface Props {
  initialAlerts: Alert[];
  industries: Industry[];   // abonnierte Branchen des Users
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

const FORM_INIT = {
  name:        "",
  industryIds: [] as number[],
  minImpact:   "medium" as ImpactLevel,
};

function industryNamesFor(keywords: string[], industries: Industry[]): string[] {
  return keywords
    .map(kw => industries.find(i => String(i.id) === kw)?.name)
    .filter(Boolean) as string[];
}

export default function AlertManager({ initialAlerts, industries }: Props) {
  const [alerts, setAlerts]       = useState<Alert[]>(initialAlerts);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(FORM_INIT);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving]       = useState(false);
  const [busy, setBusy]           = useState<string | null>(null);

  function toggleIndustry(id: number) {
    setForm(f => ({
      ...f,
      industryIds: f.industryIds.includes(id)
        ? f.industryIds.filter(i => i !== id)
        : [...f.industryIds, id],
    }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!form.name.trim())          { setFormError("Bitte einen Namen eingeben."); return; }
    if (form.industryIds.length === 0) { setFormError("Mindestens eine Branche auswählen."); return; }

    // Industry-IDs als Strings in keywords speichern
    const keywords = form.industryIds.map(String);

    setSaving(true);
    const res = await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name:       form.name,
        keywords,
        companies:  [],
        laws:       [],
        min_impact: form.minImpact,
        channel:    "email",
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
            {alerts.filter(a => a.is_active).length} aktiver Alert
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
          <form onSubmit={handleCreate} className="space-y-5">

            {formError && (
              <div className="text-xs font-medium rounded-lg px-3.5 py-2.5" style={{ background: "#FEF0EE", border: "1px solid #F5C6C1", color: "#C0392B" }}>
                {formError}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#57534A" }}>Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="z.B. IT-Security täglich"
                className="fl-input w-full px-3.5 py-2.5 text-sm"
              />
            </div>

            {/* Branche(n) */}
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: "#57534A" }}>
                Branche(n){" "}
                <span className="font-normal" style={{ color: "#8C887E" }}>— eine oder mehrere auswählen</span>
              </label>

              {industries.length === 0 ? (
                <p className="text-xs" style={{ color: "#8C887E" }}>
                  Du hast noch keine Branchen abonniert.{" "}
                  <a href="/dashboard/settings" className="underline" style={{ color: "#E08900" }}>Einstellungen öffnen →</a>
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {industries.map(ind => {
                    const selected = form.industryIds.includes(ind.id);
                    return (
                      <button
                        key={ind.id}
                        type="button"
                        onClick={() => toggleIndustry(ind.id)}
                        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-left transition-all duration-150 cursor-pointer"
                        style={selected
                          ? { background: "#FFF6E0", border: "1px solid #FFB300", color: "#1A1813" }
                          : { background: "#FAF8F4", border: "1px solid #E2DDD2", color: "#57534A" }
                        }
                      >
                        <span
                          className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all"
                          style={selected
                            ? { background: "#FFB300" }
                            : { background: "#FFFFFF", border: "1px solid #E2DDD2" }
                          }
                        >
                          {selected && <Check size={10} strokeWidth={3} color="#1A1100" />}
                        </span>
                        {ind.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mindest-Impact */}
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
            Erstelle deinen ersten Alert, um täglich per E-Mail über neue Artikel aus deinen Branchen informiert zu werden.
          </p>
        </div>
      )}

      {/* ── Alert-Liste ────────────────────────────────────── */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map(alert => {
            const branchenNames = industryNamesFor(alert.keywords, industries);
            return (
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
                    </div>
                    {/* Branchen-Pills */}
                    {branchenNames.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {branchenNames.map(name => (
                          <span
                            key={name}
                            className="text-2xs px-2 py-0.5 rounded-full"
                            style={{ background: "#FFF6E0", border: "1px solid #FFD966", color: "#E08900" }}
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    )}
                    {/* Fallback: alte Keyword-Alerts ohne Branchenbezug */}
                    {branchenNames.length === 0 && alert.keywords.length > 0 && (
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
                        style={{ background: "#FFFFFF", left: alert.is_active ? "18px" : "2px" }}
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
            );
          })}
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
            Täglich um 08:00 Uhr werden neue Artikel aus deinen gewählten Branchen geprüft.
            Bei Treffern oberhalb deines Impact-Filters erhältst du eine E-Mail.
            Du kannst Alerts jederzeit pausieren oder löschen.
          </p>
        </div>
      </div>

    </div>
  );
}
