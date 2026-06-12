"use client";

import { useState, useTransition } from "react";
import { Bookmark } from "lucide-react";
import { createClient } from "@/lib/supabase";

interface Props {
  articleId: string;
  initialBookmarked: boolean;
  size?: "sm" | "md";
}

export default function BookmarkButton({ articleId, initialBookmarked, size = "sm" }: Props) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [isPending, startTransition] = useTransition();

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const next = !bookmarked;
    setBookmarked(next); // Optimistic update

    startTransition(async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setBookmarked(!next); return; }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any;
      if (next) {
        const { error } = await db
          .from("bookmarks")
          .insert({ user_id: user.id, article_id: articleId });
        if (error) setBookmarked(false);
      } else {
        const { error } = await db
          .from("bookmarks")
          .delete()
          .eq("user_id", user.id)
          .eq("article_id", articleId);
        if (error) setBookmarked(true);
      }
    });
  }

  const iconSize = size === "md" ? "w-5 h-5" : "w-4 h-4";

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      title={bookmarked ? "Lesezeichen entfernen" : "Lesezeichen setzen"}
      className={`flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
        size === "md" ? "w-9 h-9" : "w-7 h-7"
      } ${isPending ? "opacity-60" : ""}`}
      style={{
        borderRadius: "8px",
        background: bookmarked ? "#FFF6E0" : "#FAF8F4",
        border: bookmarked ? "1px solid #FFD966" : "1px solid #E2DDD2",
        color: bookmarked ? "#E08900" : "#8C887E",
      }}
    >
      <Bookmark
        className={iconSize}
        fill={bookmarked ? "currentColor" : "none"}
        strokeWidth={bookmarked ? 0 : 2}
      />
    </button>
  );
}
