import type { Metadata } from "next";

import { UniversalSearchPage } from "@/features/universal-search/components/search-page";
import { sectionIcons } from "@/lib/section-icons";

export const metadata: Metadata = { title: "Search Health Decoded", icons: sectionIcons("tools") };

export default function SearchPage() {
  return <UniversalSearchPage />;
}
