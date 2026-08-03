import type {
  RankedSearchResult,
  UniversalSearchDocument,
} from "@/features/universal-search/types/universal-search";

export function normalizeSearchQuery(value: string) {
  return value
    .normalize("NFKD")
    .toLocaleLowerCase("en")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function values(values: readonly string[] | undefined) {
  return (values ?? []).map(normalizeSearchQuery);
}

function typeExactWeight(type: UniversalSearchDocument["type"]) {
  if (type === "glossary") return 0;
  if (type === "navigation" || type === "tool") return 1;
  if (type === "lesson") return 2;
  return 3;
}

function scoreDocument(document: UniversalSearchDocument, query: string) {
  const title = normalizeSearchQuery(document.title);
  const aliases = values(document.aliases);
  const keywords = values(document.keywords);
  const section = normalizeSearchQuery(document.sectionLabel ?? "");
  const description = normalizeSearchQuery(document.description);
  const searchable = normalizeSearchQuery(document.searchableText ?? "");
  if (title === query) return typeExactWeight(document.type);
  if (aliases.includes(query)) return 5 + (document.priority ?? 5);
  if (title.startsWith(query)) return 20 + (document.priority ?? 5);
  if (title.includes(query)) return 30 + (document.priority ?? 5);
  if (keywords.includes(query)) return 40 + (document.priority ?? 5);
  if (keywords.some((value) => value.includes(query))) return 50 + (document.priority ?? 5);
  if (aliases.some((value) => value.includes(query))) return 60 + (document.priority ?? 5);
  if (section.includes(query)) return 70 + (document.priority ?? 5);
  if (description.includes(query)) return 80 + (document.priority ?? 5);
  if (searchable.includes(query)) return 90 + (document.priority ?? 5);
  const tokens = query.split(" ");
  const combined = [title, ...aliases, ...keywords, section, description, searchable].join(" ");
  return tokens.every((token) => combined.includes(token)) ? 100 + (document.priority ?? 5) : null;
}

export function searchHealthDecoded(
  documents: readonly UniversalSearchDocument[],
  rawQuery: string,
  limit = 80,
): RankedSearchResult[] {
  const query = normalizeSearchQuery(rawQuery);
  if (!query) return [];
  return documents
    .filter((document) => document.status === "available")
    .map((document) => ({ document, score: scoreDocument(document, query) }))
    .filter(
      (candidate): candidate is { document: UniversalSearchDocument; score: number } =>
        candidate.score !== null,
    )
    .sort(
      (left, right) =>
        left.score - right.score ||
        left.document.title.localeCompare(right.document.title, "en", { sensitivity: "base" }) ||
        left.document.id.localeCompare(right.document.id),
    )
    .slice(0, limit)
    .map(({ document, score }) => ({ ...document, score }));
}
