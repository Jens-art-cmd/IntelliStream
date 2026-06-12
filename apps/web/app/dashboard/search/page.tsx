import type { Metadata } from "next";
import SearchClient from "./SearchClient";

export const metadata: Metadata = { title: "Suche · DistillFeed" };

export default function SearchPage() {
  return <SearchClient />;
}
