"use client";

import { useState, useTransition } from "react";
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
      className={`flex items-center justify-center rounded-lg transition-all duration-200 flex-shrink-0 ${
        size === "md" ? "w-9 h-9" : "w-7 h-7"
      } ${
        bookmarked
          ? "text-amber-500 bg-amber-50 hover:bg-amber-100"
          : "text-neutral-300 hover:text-amber-400 hover:bg-amber-50"
      } ${isPending ? "opacity-60" : ""}`}
    >
      <svg
        className={iconSize}
        viewBox="0 0 24 24"
        fill={bookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={bookmarked ? "0" : "2"}
      >
        <path
          d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
