"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Lock, Zap } from "lucide-react";

interface Industry {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

interface Props {
  industries: Industry[];
  initialSelected: number[];
  redirectTo?: string;
  saveLabel?: string;
  /** Max. Branchen, die der User wählen darf (2 = Free, 15 = Pro/Trial) */
  maxIndustries?: number;
  /** Ob der User vollen Zugang hat (Trial oder bezahlter Plan) */
  isFullAccess?: boolean;
}

export default function IndustrySelector({
  industries,
  initialSelected,
  redirectTo = "/dashboard/feed",
  saveLabel = "Speichern",
  maxIndustries = 15,
  isFullAccess = true,
}: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<number[]>(initialSelected);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [saved, setSaved]       = useState(false);

  function toggle(id: number) {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : prev.length < maxIndustries
          ? [...prev, id]
          : prev,
    );
    setSaved(false);
  }

  async function handleSave() {
    if (selected.length === 0) { setError("Bitte mindestens eine Branche auswählen."); return; }
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    const { error: updateError } = await supabase
      .from("users")
      .update({ industry_subscriptions: selected })
      .eq("id", user.id);

    setSaving(false);
    if (updateError) { setError(updateError.message); return; }
    setSaved(true);
    router.push(redirectTo);
    router.refresh();
  }

  const quota = selected.length;
  const limitReached = quota >= maxIndustries;

  return (
    <div className="space-y-5">
      {error && (
        <div
          className="text-xs font-medium rounded-lg px-3.5 py-2.5"
          style={{ background: "#FEF0EE", border: "1px solid #F5C6C1", color: "#C0392B" }}
        >
          {error}
        </div>
      )}

      {/* Industry grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {industries.map((industry) => {
          const isSelected = selected.includes(industry.id);
          // Gesperrt = nicht ausgewählt UND Limit erreicht
          const isLocked   = !isSelected && limitReached;

          return (
            <button
              key={industry.id}
              onClick={() => toggle(industry.id)}
              disabled={isLocked}
              className={`text-left p-3.5 rounded-xl transition-all duration-150 flex items-start justify-between gap-3 ${
                isLocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
              style={
                isSelected
                  ? { background: "#FFF6E0", border: "1.5px solid #FFB300" }
                  : isLocked
                    ? { background: "#FAF8F4", border: "1px solid #E2DDD2" }
                    : { background: "#FFFFFF", border: "1px solid #E2DDD2" }
              }
            >
              <div className="min-w-0">
                <span className="block text-xs font-semibold leading-snug" style={{ color: "#1A1813" }}>
                  {industry.name}
                </span>
                {industry.description && (
                  <span className="block mt-0.5 text-2xs line-clamp-2 leading-relaxed" style={{ color: "#8C887E" }}>
                    {industry.description}
                  </span>
                )}
              </div>

              {/* Checkbox / Lock-Icon */}
              <div
                className="flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "5px",
                  background: isSelected ? "#FFB300" : isLocked ? "#F1EDE4" : "#FFFFFF",
                  border: isSelected ? "1.5px solid #FFB300" : isLocked ? "1.5px solid #E2DDD2" : "1.5px solid #C8C2B6",
                }}
              >
                {isSelected && (
                  <svg width="10" height="10" fill="none" viewBox="0 0 12 12" stroke="#1A1100" strokeWidth="2.5">
                    <polyline points="2 6 5 9 10 3" />
                  </svg>
                )}
                {isLocked && !isFullAccess && (
                  <Lock size={9} strokeWidth={2.5} color="#8C887E" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Upsell-Banner — nur wenn Free-User das Limit erreicht hat */}
      {!isFullAccess && limitReached && (
        <div
          className="flex items-center justify-between gap-3 rounded-xl px-4 py-3"
          style={{ background: "#FFF6E0", border: "1.5px solid #FFB300" }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "#FFB300" }}
            >
              <Zap size={13} strokeWidth={2.5} color="#1A1100" />
            </div>
            <div>
              <p className="text-xs font-semibold leading-snug" style={{ color: "#1A1813" }}>
                Branchen-Limit erreicht ({maxIndustries}/{maxIndustries})
              </p>
              <p className="text-2xs mt-0.5" style={{ color: "#57534A" }}>
                Mit Pro alle 15 Branchen gleichzeitig beobachten
              </p>
            </div>
          </div>
          <a
            href="/dashboard/settings"
            className="flex-shrink-0 text-2xs font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-90 cursor-pointer whitespace-nowrap"
            style={{ background: "#FFB300", color: "#1A1100" }}
          >
            Pro →
          </a>
        </div>
      )}

      {/* Quota + save */}
      <div className="space-y-3 pt-1">
        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#E2DDD2" }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min((quota / maxIndustries) * 100, 100)}%`,
                background: "linear-gradient(90deg, #FFB300, #E08900)",
              }}
            />
          </div>
          <span className="text-xs font-medium w-28 flex-shrink-0 text-right" style={{ color: "#57534A" }}>
            {quota} / {maxIndustries} Branchen
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: "#8C887E" }}>
            {quota === 0 && "Noch keine Branche ausgewählt"}
            {quota === maxIndustries && "Maximum erreicht"}
            {quota > 0 && quota < maxIndustries && `${maxIndustries - quota} weitere möglich`}
          </span>
          <button
            onClick={handleSave}
            disabled={saving || selected.length === 0}
            className="text-sm font-bold px-5 py-2 rounded-xl hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200 cursor-pointer"
            style={{ background: "#FFB300", color: "#1A1100", boxShadow: "0 4px 14px rgba(224,137,0,0.22)" }}
          >
            {saving ? "Speichere…" : saved ? "Gespeichert ✓" : saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
