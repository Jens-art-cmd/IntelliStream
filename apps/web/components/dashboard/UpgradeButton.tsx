"use client";

import { useState } from "react";

interface UpgradeButtonProps {
  priceKey: "pro_monthly" | "pro_yearly";
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function UpgradeButton({
  priceKey,
  label = "Jetzt upgraden",
  className,
  style,
}: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ priceKey }),
      });

      const data = await res.json() as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        setError(data.error ?? "Checkout konnte nicht gestartet werden.");
        return;
      }

      // Weiterleitung zu Stripe Checkout
      window.location.href = data.url;
    } catch {
      setError("Verbindungsfehler — bitte versuchen Sie es erneut.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className={className}
        style={style}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Weiterleitung…
          </span>
        ) : label}
      </button>
      {error && (
        <p className="text-xs text-red-500 mt-2 text-center">{error}</p>
      )}
    </div>
  );
}
