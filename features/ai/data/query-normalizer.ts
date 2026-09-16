/**
 * Vocabulary used only to recover likely spelling mistakes before deterministic
 * safety classification, evidence retrieval, and answer-relevance checks. A
 * correction is applied only when one candidate is clearly closest, so messy
 * typing remains usable without silently changing an ambiguous question.
 */
const reviewedVocabulary = [
  "a1c",
  "breastfeeding",
  "carbs",
  "cgm",
  "dehydration",
  "fasting",
  "gastroparesis",
  "gestational",
  "gluten",
  "hormonal",
  "hyperosmolar",
  "ketoacidosis",
  "menopause",
  "menstrual",
  "monogenic",
  "pancreatitis",
  "pregnancy",
  "pregnant",
  "ramadan",
  "sensor",
  "steroids",
  "thyroid",
  "activity",
  "albuminuria",
  "alcohol",
  "anxiety",
  "bladder",
  "blood",
  "carbohydrate",
  "carbohydrates",
  "cardiovascular",
  "caregiver",
  "cataract",
  "cataracts",
  "cholesterol",
  "diabetes",
  "diabetic",
  "diet",
  "distress",
  "dulaglutide",
  "education",
  "empagliflozin",
  "exercise",
  "glimepiride",
  "glipizide",
  "glucagon",
  "glucose",
  "hypoglycemia",
  "hyperglycemia",
  "inject",
  "injected",
  "injecting",
  "injection",
  "injections",
  "insulin",
  "januvia",
  "jardiance",
  "ketones",
  "kidney",
  "medication",
  "medications",
  "medicine",
  "metformin",
  "monitoring",
  "mounjaro",
  "neuropathy",
  "nutrition",
  "ozempic",
  "pancreas",
  "pioglitazone",
  "prediabetes",
  "prescription",
  "rotate",
  "retinopathy",
  "semaglutide",
  "sitagliptin",
  "stress",
  "sugar",
  "tirzepatide",
  "trulicity",
  "urination",
  "wegovy",
  "zepbound",
  "could",
  "should",
  "would",
] as const;

function editDistance(left: string, right: string) {
  const rows = Array.from({ length: left.length + 1 }, () =>
    Array<number>(right.length + 1).fill(0),
  );
  for (let leftIndex = 0; leftIndex <= left.length; leftIndex += 1) rows[leftIndex]![0] = leftIndex;
  for (let rightIndex = 0; rightIndex <= right.length; rightIndex += 1) {
    rows[0]![rightIndex] = rightIndex;
  }

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const substitution = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;
      rows[leftIndex]![rightIndex] = Math.min(
        rows[leftIndex - 1]![rightIndex]! + 1,
        rows[leftIndex]![rightIndex - 1]! + 1,
        rows[leftIndex - 1]![rightIndex - 1]! + substitution,
      );
      if (
        leftIndex > 1 &&
        rightIndex > 1 &&
        left[leftIndex - 1] === right[rightIndex - 2] &&
        left[leftIndex - 2] === right[rightIndex - 1]
      ) {
        rows[leftIndex]![rightIndex] = Math.min(
          rows[leftIndex]![rightIndex]!,
          rows[leftIndex - 2]![rightIndex - 2]! + 1,
        );
      }
    }
  }
  return rows[left.length]![right.length]!;
}

function correctedToken(token: string) {
  if (
    token.length < 5 ||
    reviewedVocabulary.includes(token as (typeof reviewedVocabulary)[number])
  ) {
    return token;
  }

  const maximumDistance = token.length >= 8 ? 2 : 1;
  const candidates = reviewedVocabulary
    .filter((term) => term.length >= 5 && Math.abs(token.length - term.length) <= maximumDistance)
    .map((term) => ({ distance: editDistance(token, term), term }))
    .filter(({ distance }) => distance <= maximumDistance)
    .sort((left, right) => left.distance - right.distance);
  if (!candidates.length || candidates[0]?.distance === candidates[1]?.distance) return token;
  return candidates[0]!.term;
}

/** Lowercases, tidies, and safely repairs unambiguous topic-term typos. */
export function normalizeAiQuery(message: string) {
  return message
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/([a-z])\1{2,}/g, "$1$1")
    .replace(/[a-z][a-z'-]*/g, correctedToken)
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^(?:wat|wht)\b/, "what")
    .replace(/^were (?=(?:can|could|do|does|should|would)\b)/, "where ");
}
