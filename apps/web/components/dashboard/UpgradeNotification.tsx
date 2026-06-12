"use client";

import { CheckCircle2, ArrowLeft } from "lucide-react";

interface Props { status?: string }

export default function UpgradeNotification({ status }: Props) {
  if (!status) return null;

  if (status === "success") {
    return (
      <div
        className="flex items-center gap-3 rounded-xl px-4 py-3 mb-6"
        style={{ background: "#F0F7F0", border: "1px solid #A8D5A8" }}
      >
        <CheckCircle2 size={18} strokeWidth={1.75} style={{ color: "#2D7553", flexShrink: 0 }} />
        <div>
          <p className="text-sm font-semibold" style={{ color: "#1A3A2A" }}>Upgrade erfolgreich!</p>
          <p className="text-xs mt-0.5" style={{ color: "#2D7553" }}>
            Dein DistillFeed Pro-Zugang ist jetzt aktiv. Willkommen an Bord.
          </p>
        </div>
      </div>
    );
  }

  if (status === "cancelled") {
    return (
      <div
        className="flex items-center gap-3 rounded-xl px-4 py-3 mb-6"
        style={{ background: "#FFF6E0", border: "1px solid #FFD966" }}
      >
        <ArrowLeft size={18} strokeWidth={1.75} style={{ color: "#E08900", flexShrink: 0 }} />
        <div>
          <p className="text-sm font-semibold" style={{ color: "#1A1813" }}>Checkout abgebrochen</p>
          <p className="text-xs mt-0.5" style={{ color: "#57534A" }}>
            Kein Problem — dein Probemonat läuft weiter. Du kannst jederzeit upgraden.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
