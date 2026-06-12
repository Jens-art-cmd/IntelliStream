"use client";

import Link from "next/link";

interface TrialBannerProps {
  daysLeft: number | null;
  status: "trialing" | "active" | "free";
}

export default function TrialBanner({ daysLeft, status }: TrialBannerProps) {
  if (status === "active") return null;

  if (status === "trialing" && daysLeft !== null) {
    return (
      <div
        className="flex items-center justify-between px-4 py-2.5 mb-4 text-xs rounded-lg"
        style={{
          background: "#FFF6E0",
          border: "1px solid #FFD966",
          borderLeft: "3px solid #FFB300",
        }}
      >
        <span
          className="font-medium"
          style={{ color: daysLeft <= 7 ? "#E08900" : "#57534A" }}
        >
          {daysLeft <= 7
            ? `Test endet in ${daysLeft} Tag${daysLeft === 1 ? "" : "en"} — danach kostenloser Zugang`
            : `Sie testen DistillFeed Pro — noch ${daysLeft} Tage`}
        </span>
        <Link
          href="/dashboard/settings"
          className="ml-4 whitespace-nowrap text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:-translate-y-px"
          style={{ background: "#FFB300", color: "#1A1100" }}
        >
          Jetzt upgraden →
        </Link>
      </div>
    );
  }

  // free plan — editorial card
  return (
    <div
      className="flex items-center justify-between gap-4 px-4 py-3 mb-5 rounded-xl"
      style={{ background: "#FFFFFF", border: "1px solid #E2DDD2" }}
    >
      <div className="min-w-0">
        <p className="text-[13px] font-semibold mb-0.5" style={{ color: "#1A1813" }}>
          DistillFeed Pro testen
        </p>
        <p className="text-[12px] leading-relaxed" style={{ color: "#57534A" }}>
          Vollständige KI-Zusammenfassungen, alle 15 Branchen, täglicher Newsletter
        </p>
      </div>
      <Link
        href="/dashboard/settings"
        className="flex-shrink-0 text-[12px] font-bold px-4 py-2 rounded-lg transition-all hover:-translate-y-px whitespace-nowrap"
        style={{ background: "#FFB300", color: "#1A1100", boxShadow: "0 2px 8px rgba(224,137,0,0.22)" }}
      >
        Kostenlos testen
      </Link>
    </div>
  );
}
