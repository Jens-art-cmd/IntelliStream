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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

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
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({ industry_subscriptions: selected })
      .eq("id", user.id);

    setSaving(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSaved(true);
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {error && <p className="text-red-600 text-sm text-center">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {industries.map((industry) => {
          const isSelected = selected.includes(industry.id);
          const isDisabled = !isSelected && selected.length >= 5;
          return (
            <button
              key={industry.id}
              onClick={() => toggle(industry.id)}
              disabled={isDisabled}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? "border-brand-600 bg-brand-50 dark:bg-brand-900/20"
                  : isDisabled
                    ? "border-gray-200 dark:border-gray-800 opacity-40 cursor-not-allowed"
                    : "border-gray-200 dark:border-gray-800 hover:border-brand-400 bg-white dark:bg-gray-900"
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="font-medium text-sm text-gray-900 dark:text-white">
                  {industry.name}
                </span>
                {isSelected && <span className="text-brand-600 text-lg">✓</span>}
              </div>
              {industry.description && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                  {industry.description}
                </p>
              )}
            </button>
          );
        })}
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500 mb-4">{selected.length} / 5 Branchen ausgewählt</p>
        <button
          onClick={handleSave}
          disabled={saving || selected.length === 0}
          className="bg-brand-600 text-white px-10 py-3 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50"
        >
          {saving ? "Speichere…" : saved ? "Gespeichert ✓" : saveLabel}
        </button>
      </div>
    </div>
  );
}
