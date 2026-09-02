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

type UniversalSearchDocumentBase = {
  id: string;
  type: UniversalSearchResultType;
  title: string;
  description: string;
  aliases?: readonly string[];
  keywords?: readonly string[];
  searchableText?: string;
  sectionLabel?: string;
  priority?: number;
  status: "available" | "hidden" | "draft" | "archived";
};

type UniversalSearchRouteDocument = UniversalSearchDocumentBase & {
  route: string;
  action?: never;
};

type UniversalSearchActionDocument = UniversalSearchDocumentBase & {
  action: "open-ai-tutor";
  route?: never;
};

export type UniversalSearchDocument = UniversalSearchRouteDocument | UniversalSearchActionDocument;

export type RankedSearchResult = UniversalSearchDocument & { score: number };
