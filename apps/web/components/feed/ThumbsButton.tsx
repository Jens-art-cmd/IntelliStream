"use client";

import { useState, useTransition } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { createClient } from "@/lib/supabase";

interface Props {
  articleId: string;
  /** Optionaler Startzustand (aus SSR vorgeladen) */
  initialVote?: "up" | "down" | null;
  /** "compact" für Karten, "default" für Detailseite */
  size?: "compact" | "default";
}

export default function ThumbsButton({ articleId, initialVote = null, size = "compact" }: Props) {
  const [vote, setVote]       = useState<"up" | "down" | null>(initialVote);
  const [isPending, start]    = useTransition();

  async function handleVote(direction: "up" | "down") {
    const next = vote === direction ? null : direction; // Toggle
    setVote(next); // Optimistisch

    start(async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setVote(vote); return; } // Rollback wenn nicht eingeloggt

      // Alten Vote entfernen (delete)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any;
      await db
        .from("interactions")
        .delete()
        .eq("user_id", user.id)
        .eq("article_id", articleId)
        .in("event_type", ["thumbs_up", "thumbs_down"]);

      // Neuen Vote einfügen (wenn nicht Toggle-aus)
      if (next !== null) {
        await db.from("interactions").insert({
          user_id:    user.id,
          article_id: articleId,
          event_type: next === "up" ? "thumbs_up" : "thumbs_down",
        });
      }
    });
  }

  if (size === "compact") {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={e => { e.preventDefault(); e.stopPropagation(); handleVote("up"); }}
          disabled={isPending}
          aria-label="Hilfreich"
          title="Hilfreich"
          className="flex items-center justify-center w-6 h-6 rounded transition-all cursor-pointer disabled:opacity-40"
          style={{
            background: vote === "up" ? "#FFF6E0" : "transparent",
            color: vote === "up" ? "#E08900" : "#C8C2B6",
          }}
        >
          <ThumbsUp size={12} strokeWidth={vote === "up" ? 2.5 : 1.75} fill={vote === "up" ? "currentColor" : "none"} />
        </button>
        <button
          onClick={e => { e.preventDefault(); e.stopPropagation(); handleVote("down"); }}
          disabled={isPending}
          aria-label="Nicht relevant"
          title="Nicht relevant"
          className="flex items-center justify-center w-6 h-6 rounded transition-all cursor-pointer disabled:opacity-40"
          style={{
            background: vote === "down" ? "#FEF0EE" : "transparent",
            color: vote === "down" ? "#C0392B" : "#C8C2B6",
          }}
        >
          <ThumbsDown size={12} strokeWidth={vote === "down" ? 2.5 : 1.75} fill={vote === "down" ? "currentColor" : "none"} />
        </button>
      </div>
    );
  }

  // size === "default" — für die Artikel-Detailseite
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs mr-1" style={{ color: "#8C887E" }}>War diese Analyse hilfreich?</span>
      <button
        onClick={() => handleVote("up")}
        disabled={isPending}
        aria-label="Hilfreich"
        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all cursor-pointer disabled:opacity-40"
        style={{
          background: vote === "up" ? "#FFF6E0" : "#FAF8F4",
          border: vote === "up" ? "1px solid #FFD966" : "1px solid #E2DDD2",
          color: vote === "up" ? "#E08900" : "#57534A",
        }}
      >
        <ThumbsUp size={13} strokeWidth={1.75} fill={vote === "up" ? "currentColor" : "none"} />
        Hilfreich
      </button>
      <button
        onClick={() => handleVote("down")}
        disabled={isPending}
        aria-label="Nicht relevant"
        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all cursor-pointer disabled:opacity-40"
        style={{
          background: vote === "down" ? "#FEF0EE" : "#FAF8F4",
          border: vote === "down" ? "1px solid #F5C6C1" : "1px solid #E2DDD2",
          color: vote === "down" ? "#C0392B" : "#57534A",
        }}
      >
        <ThumbsDown size={13} strokeWidth={1.75} fill={vote === "down" ? "currentColor" : "none"} />
        Nicht relevant
      </button>
    </div>
  );
}
