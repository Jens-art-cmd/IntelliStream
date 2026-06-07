"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

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
}

export default function IndustrySelector({
  industries,
  initialSelected,
  redirectTo = "/dashboard/feed",
  saveLabel = "Speichern",
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
        : prev.length < 5
          ? [...prev, id]
          : prev,
    );
    setSaved(false);
  }

  async function handleSave() {
    if (selected.length === 0) {
      setError("Bitte mindestens eine Branche auswählen.");
      return;
    }
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

  return (
    <div className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-medium rounded-lg px-3.5 py-2.5">
          {error}
        </div>
      )}

      {/* Industry grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {industries.map((industry) => {
          const isSelected = selected.includes(industry.id);
          const isDisabled = !isSelected && selected.length >= 5;

          return (
            <button
              key={industry.id}
              onClick={() => toggle(industry.id)}
              disabled={isDisabled}
              className={`text-left p-3.5 rounded-xl border-[1.5px] transition-all duration-150 flex items-start justify-between gap-3 ${
                isSelected
                  ? "border-amber-400 bg-amber-50/60 ring-gold"
                  : isDisabled
                    ? "border-neutral-100 opacity-40 cursor-not-allowed bg-neutral-25"
                    : "border-neutral-150 hover:border-neutral-300 hover:shadow-sm bg-white"
              }`}
            >
              <div className="min-w-0">
                <span className="block text-xs font-semibold text-neutral-900 leading-snug">
                  {industry.name}
                </span>
                {industry.description && (
                  <span className="block mt-0.5 text-2xs text-neutral-500 line-clamp-2 leading-relaxed">
                    {industry.description}
                  </span>
                )}
              </div>

              {/* Checkbox */}
              <div
                className={`rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 border transition-all ${
                  isSelected
                    ? "border-amber-500 text-white"
                    : "border-neutral-300 bg-white"
                }`}
                style={{
                  width: "18px",
                  height: "18px",
                  background: isSelected ? "linear-gradient(135deg, #ffca28, #ffb300)" : undefined,
                }}
              >
                {isSelected && (
                  <svg width="10" height="10" fill="none" viewBox="0 0 12 12" stroke="white" strokeWidth="2.5">
                    <polyline points="2 6 5 9 10 3" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Quota + save */}
      <div className="space-y-3 pt-1">
        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${(quota / 5) * 100}%`,
                background: "linear-gradient(90deg, #ffca28, #ffb300)",
              }}
            />
          </div>
          <span className="text-xs text-neutral-500 font-medium w-24 flex-shrink-0 text-right">
            {quota} / 5 Branchen
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-400">
            {quota === 0 && "Noch keine Branche ausgewählt"}
            {quota === 5 && "Maximum erreicht"}
            {quota > 0 && quota < 5 && `${5 - quota} weitere möglich`}
          </span>
          <button
            onClick={handleSave}
            disabled={saving || selected.length === 0}
            className="text-sm font-bold px-5 py-2 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200 text-neutral-900"
            style={{ background: "linear-gradient(135deg, #ffca28 0%, #ffb300 100%)" }}
          >
            {saving ? "Speichere…" : saved ? "Gespeichert ✓" : saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
