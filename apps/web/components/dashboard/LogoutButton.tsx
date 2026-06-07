"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-medium text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-150"
    >
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" className="flex-shrink-0">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      Abmelden
    </button>
  );
}
