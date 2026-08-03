export const universalSearchResultTypes = [
  "navigation",
  "lesson",
  "glossary",
  "story",
  "resource",
  "caregiver",
  "tool",
] as const;

export type UniversalSearchResultType = (typeof universalSearchResultTypes)[number];

export type UniversalSearchDocument = {
  id: string;
  type: UniversalSearchResultType;
  title: string;
  description: string;
  route: string;
  aliases?: readonly string[];
  keywords?: readonly string[];
  searchableText?: string;
  sectionLabel?: string;
  priority?: number;
  status: "available" | "hidden" | "draft" | "archived";
};

export type RankedSearchResult = UniversalSearchDocument & { score: number };
