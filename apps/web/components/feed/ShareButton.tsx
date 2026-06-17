"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";

interface Props {
  articleId: string;
  title: string;
  size?: "sm" | "md";
}

export default function ShareButton({ articleId, title, size = "sm" }: Props) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : "https://distillfeed.eu"}/artikel/${articleId}`;

  async function handleShare(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
        return;
      } catch {
        // User cancelled or not supported — fall through to clipboard
      }
    }

    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silent fail
    }
  }

  const btnSize = size === "md" ? "w-9 h-9" : "w-7 h-7";
  const iconSize = size === "md" ? 14 : 12;

  return (
    <button
      onClick={handleShare}
      title={copied ? "Link kopiert!" : "Artikel teilen"}
      className={`relative flex items-center justify-center transition-all duration-200 flex-shrink-0 ${btnSize}`}
      style={{
        borderRadius: "8px",
        background: copied ? "#E8F5EE" : "#FAF8F4",
        border: copied ? "1px solid #A8D5A8" : "1px solid #E2DDD2",
        color: copied ? "#2D7553" : "#8C887E",
      }}
    >
      {copied
        ? <Check size={iconSize} strokeWidth={2.5} />
        : <Share2 size={iconSize} strokeWidth={1.75} />
      }
      {copied && (
        <span
          className="absolute -top-7 left-1/2 -translate-x-1/2 text-2xs font-medium px-2 py-0.5 rounded-md whitespace-nowrap pointer-events-none"
          style={{ background: "#1A1813", color: "#FAF8F4" }}
        >
          Link kopiert
        </span>
      )}
    </button>
  );
}
