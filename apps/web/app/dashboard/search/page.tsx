import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import SearchClient from "./SearchClient";

export const metadata: Metadata = { title: "Suche · DistillFeed" };

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  impact_filter: string | null;
  industry_ids: number[];
  created_at: string;
}

export default async function SearchPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  let savedSearches: SavedSearch[] = [];
  if (user) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from("saved_searches")
      .select("id, name, query, impact_filter, industry_ids, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    savedSearches = data ?? [];
  }

  return <SearchClient initialSavedSearches={savedSearches} />;
}
