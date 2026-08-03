import type { Metadata } from "next";

import { UniversalSearchPage } from "@/features/universal-search/components/search-page";

export const metadata: Metadata = { title: "Search Health Decoded" };

export default function SearchPage() {
  return <UniversalSearchPage />;
}
