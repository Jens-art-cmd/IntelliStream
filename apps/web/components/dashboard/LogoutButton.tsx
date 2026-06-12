"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
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
      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-medium transition-all duration-150 cursor-pointer"
      style={{ color: "#8C887E" }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.color = "#1A1813";
        (e.currentTarget as HTMLElement).style.background = "#EBE7DD";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.color = "#8C887E";
        (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      <LogOut size={14} strokeWidth={1.75} className="flex-shrink-0" />
      Abmelden
    </button>
  );
}
