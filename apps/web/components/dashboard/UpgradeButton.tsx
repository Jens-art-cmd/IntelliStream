"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

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
            <Loader2 className="animate-spin h-4 w-4" />
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
