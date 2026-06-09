"use client";

interface Props { status?: string }

export default function UpgradeNotification({ status }: Props) {
  if (!status) return null;

  if (status === "success") {
    return (
      <div
        className="flex items-center gap-3 rounded-xl px-4 py-3 mb-6 text-sm"
        style={{ background: "#f0fdf4", border: "1px solid #86efac" }}
      >
        <span className="text-lg">🎉</span>
        <div>
          <p className="font-semibold text-green-800">Upgrade erfolgreich!</p>
          <p className="text-xs text-green-700 mt-0.5">
            Ihr IntelliStream Pro-Zugang ist jetzt aktiv. Willkommen an Bord.
          </p>
        </div>
      </div>
    );
  }

  if (status === "cancelled") {
    return (
      <div
        className="flex items-center gap-3 rounded-xl px-4 py-3 mb-6 text-sm"
        style={{ background: "#fefce8", border: "1px solid #fde68a" }}
      >
        <span className="text-lg">↩️</span>
        <div>
          <p className="font-semibold text-yellow-800">Checkout abgebrochen</p>
          <p className="text-xs text-yellow-700 mt-0.5">
            Kein Problem — Ihr Probemonat läuft weiter. Sie können jederzeit upgraden.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
