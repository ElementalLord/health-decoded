import type {
  GlossarySource,
  MedicalGlossaryEntry,
} from "@/features/glossary/types/medical-glossary";

export function validateMedicalGlossary(
  entries: readonly MedicalGlossaryEntry[],
  sources: readonly GlossarySource[],
) {
  const sourceIds = new Set(sources.map((source) => source.id));
  const unique = (values: readonly string[]) => new Set(values).size === values.length;
  const ids = entries.map((entry) => entry.id);
  const slugs = entries.map((entry) => entry.slug);
  const terms = entries.map((entry) => entry.term.toLocaleLowerCase("en"));
  const errors: string[] = [];
  if (!unique(ids)) errors.push("Glossary IDs must be unique.");
  if (!unique(slugs)) errors.push("Glossary slugs must be unique.");
  if (!unique(terms)) errors.push("Glossary primary terms must be unique.");
  for (const entry of entries) {
    if (!entry.definition.trim()) errors.push(`${entry.id} has no definition.`);
    if (entry.contentStatus !== "source-backed") errors.push(`${entry.id} is not source-backed.`);
    if (!entry.sourceIds.length || entry.sourceIds.some((id) => !sourceIds.has(id)))
      errors.push(`${entry.id} has invalid sources.`);
    if (entry.commonlyConfusedWith && !entry.commonlyConfusedWith.explanation.trim())
      errors.push(`${entry.id} has an empty comparison.`);
  }
  return errors;
}
