import type { Metadata } from "next";
import SearchClient from "./SearchClient";

export const metadata: Metadata = { title: "Suche · IntelliStream" };

export default function SearchPage() {
  return <SearchClient />;
}
