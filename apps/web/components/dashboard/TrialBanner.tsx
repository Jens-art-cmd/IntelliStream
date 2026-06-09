"use client";

import Link from "next/link";

interface TrialBannerProps {
  daysLeft: number | null;
  status: "trialing" | "active" | "free";
}

export default function TrialBanner({ daysLeft, status }: TrialBannerProps) {
  if (status === "active") return null;

  if (status === "trialing" && daysLeft !== null) {
    if (daysLeft > 7) {
      return (
        <div
          className="flex items-center justify-between rounded-2xl px-4 py-2.5 mb-4 text-xs"
          style={{
            background: "#e8eef5",
            boxShadow: "inset 2px 2px 5px #c5cad3, inset -2px -2px 5px #ffffff",
            borderLeft: "3px solid #f59e0b",
          }}
        >
          <span className="text-neutral-600">
            Sie testen IntelliStream Pro &mdash; noch {daysLeft} Tage
          </span>
          <Link
            href="/dashboard/settings"
            className="text-amber-500 font-semibold hover:text-amber-600 transition-colors ml-4 whitespace-nowrap"
          >
            Jetzt upgraden &rarr;
          </Link>
        </div>
      );
    }

    // daysLeft <= 7 — more prominent warning
    return (
      <div
        className="flex items-center justify-between rounded-2xl px-4 py-2.5 mb-4 text-xs"
        style={{
          background: "rgba(245,158,11,0.08)",
          boxShadow: "inset 2px 2px 5px #c5cad3, inset -2px -2px 5px #ffffff",
          borderLeft: "3px solid #f59e0b",
        }}
      >
        <span className="text-amber-700 font-bold">
          Test endet in {daysLeft} Tag{daysLeft === 1 ? "" : "en"} &mdash; danach kostenloser Zugang (1 Branche)
        </span>
        <Link
          href="/dashboard/settings"
          className="text-amber-600 font-semibold hover:text-amber-700 transition-colors ml-4 whitespace-nowrap"
        >
          Jetzt upgraden &rarr;
        </Link>
      </div>
    );
  }

  // status === "free"
  return (
    <div
      className="rounded-2xl p-4 mb-5"
      style={{ boxShadow: "6px 6px 12px #c5cad3, -6px -6px 12px #ffffff" }}
    >
      <div className="flex items-start gap-3">
        <span className="text-lg leading-none mt-0.5">&#128275;</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-neutral-800 mb-0.5">
            Testen Sie IntelliStream Pro
          </p>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Vollständige KI-Zusammenfassungen, bis zu 5 Branchen, täglicher Newsletter
          </p>
        </div>
        <Link
          href="/dashboard/settings"
          className="flex-shrink-0 inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold text-neutral-900 transition-all hover:shadow-md hover:-translate-y-px"
          style={{ background: "linear-gradient(135deg, #ffca28 0%, #ffb300 100%)" }}
        >
          Kostenlos testen
        </Link>
      </div>
    </div>
  );
}
