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
        <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-medium rounded-md px-3 py-2">
          {error}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {industries.map((industry) => {
          const isSelected = selected.includes(industry.id);
          const isDisabled = !isSelected && selected.length >= 5;

          return (
            <button
              key={industry.id}
              onClick={() => toggle(industry.id)}
              disabled={isDisabled}
              className={`text-left p-3.5 rounded-lg border-[1.5px] transition-all duration-150 flex items-start justify-between gap-3 ${
                isSelected
                  ? "border-brand-500 bg-brand-50 shadow-[0_0_0_3px_theme(colors.brand.50)]"
                  : isDisabled
                    ? "border-neutral-100 opacity-40 cursor-not-allowed bg-neutral-25"
                    : "border-neutral-150 hover:border-brand-300 hover:shadow-sm bg-neutral-0"
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
                className={`w-4.5 h-4.5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border text-2xs font-bold transition-all ${
                  isSelected
                    ? "bg-brand-600 border-brand-600 text-white"
                    : "border-neutral-300 bg-neutral-0"
                }`}
                style={{ width: "18px", height: "18px" }}
              >
                {isSelected && "✓"}
              </div>
            </button>
          );
        })}
      </div>

      {/* Quota bar + save */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-neutral-150 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-300"
              style={{ width: `${(quota / 5) * 100}%` }}
            />
          </div>
          <span className="text-xs text-neutral-500 font-medium w-24 flex-shrink-0">
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
            className="bg-brand-600 text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-brand-700 disabled:opacity-50 transition-colors tracking-tight-sm"
          >
            {saving ? "Speichere…" : saved ? "Gespeichert ✓" : saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
