"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  label?: string;
  className?: string;
  style?: React.CSSProperties;
  variant?: "link" | "button";
}

export default function BackButton({
  label = "Zurück",
  className = "",
  style,
  variant = "link",
}: BackButtonProps) {
  const router = useRouter();

  if (variant === "link") {
    return (
      <button
        onClick={() => router.back()}
        className={`flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer ${className}`}
        style={{ color: "#8C887E", ...style }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#1A1813"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#8C887E"; }}
      >
        <ArrowLeft size={13} strokeWidth={2} />
        {label}
      </button>
    );
  }

  return (
    <button
      onClick={() => router.back()}
      className={`inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:-translate-y-px cursor-pointer ${className}`}
      style={style ?? { background: "#FAF8F4", color: "#57534A", border: "1px solid #E2DDD2" }}
    >
      <ArrowLeft size={13} strokeWidth={2} />
      {label}
    </button>
  );
}
