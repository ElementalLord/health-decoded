import type { MedicalGlossaryEntry } from "@/features/glossary/types/medical-glossary";

export function normalizeGlossaryQuery(value: string) {
  return value.trim().toLocaleLowerCase("en").replace(/\s+/g, " ");
}

function normalizedValues(values: readonly string[] | undefined) {
  return (values ?? []).map(normalizeGlossaryQuery);
}

function scoreEntry(entry: MedicalGlossaryEntry, query: string) {
  const term = normalizeGlossaryQuery(entry.term);
  const abbreviation = entry.abbreviation ? normalizeGlossaryQuery(entry.abbreviation) : "";
  const aliases = normalizedValues(entry.aliases);
  const misspellings = normalizedValues(entry.misspellings);
  const definition = normalizeGlossaryQuery(entry.definition);
  if (term === query) return 0;
  if (abbreviation === query) return 1;
  if (aliases.includes(query)) return 2;
  if (misspellings.includes(query)) return 3;
  if (term.startsWith(query)) return 4;
  if (term.includes(query)) return 5;
  if (abbreviation.includes(query)) return 6;
  if (aliases.some((alias) => alias.includes(query))) return 7;
  if (definition.includes(query)) return 8;
  return null;
}

export function searchGlossary(entries: readonly MedicalGlossaryEntry[], rawQuery: string) {
  const query = normalizeGlossaryQuery(rawQuery);
  if (!query) return [...entries];
  return entries
    .map((entry) => ({ entry, score: scoreEntry(entry, query) }))
    .filter(
      (candidate): candidate is { entry: MedicalGlossaryEntry; score: number } =>
        candidate.score !== null,
    )
    .sort(
      (a, b) =>
        a.score - b.score ||
        a.entry.term.localeCompare(b.entry.term, "en", { sensitivity: "base" }),
    )
    .map(({ entry }) => entry);
}

export function filterGlossaryByLetter(entries: readonly MedicalGlossaryEntry[], letter: string) {
  if (letter === "All") return [...entries];
  return entries.filter((entry) => entry.term.toUpperCase().startsWith(letter));
}
