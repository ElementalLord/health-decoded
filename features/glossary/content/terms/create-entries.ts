import type {
  GlossarySeed,
  GlossaryTopic,
  MedicalGlossaryEntry,
} from "@/features/glossary/types/medical-glossary";

function slugify(term: string) {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function createEntries(
  topic: GlossaryTopic,
  sourceIds: readonly string[],
  seeds: readonly GlossarySeed[],
): readonly MedicalGlossaryEntry[] {
  return seeds.map(([term, definition, options]) => {
    const slug = slugify(term);
    return {
      id: `GLOSSARY-${slug.toUpperCase()}`,
      slug,
      term,
      definition,
      sourceIds,
      contentStatus: "source-backed" as const,
      topic,
      ...(options?.abbreviation ? { abbreviation: options.abbreviation } : {}),
      ...(options?.aliases ? { aliases: options.aliases } : {}),
      ...(options?.misspellings ? { misspellings: options.misspellings } : {}),
      ...(options?.confused ? { commonlyConfusedWith: options.confused } : {}),
    };
  });
}
