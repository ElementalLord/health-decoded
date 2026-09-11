/**
 * Vocabulary used only to recover likely one-character spelling mistakes before
 * deterministic safety classification and evidence retrieval. A correction is
 * applied only when exactly one reviewed term is within one edit, which avoids
 * guessing when a learner's wording is ambiguous.
 */
const reviewedVocabulary = [
  "a1c",
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
  "empagliflozin",
  "exercise",
  "glimepiride",
  "glipizide",
  "glucagon",
  "glucose",
  "hypoglycemia",
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
] as const;

function isOneEditAway(left: string, right: string) {
  if (left === right) return true;
  if (Math.abs(left.length - right.length) > 1) return false;

  if (left.length === right.length) {
    const differences: number[] = [];
    for (let index = 0; index < left.length; index += 1) {
      if (left[index] !== right[index]) differences.push(index);
      if (differences.length > 2) return false;
    }
    if (differences.length === 1) return true;
    const firstDifference = differences[0];
    const secondDifference = differences[1];
    return (
      firstDifference !== undefined &&
      secondDifference !== undefined &&
      secondDifference === firstDifference + 1 &&
      left[firstDifference] === right[secondDifference] &&
      left[secondDifference] === right[firstDifference]
    );
  }

  const [shorter, longer] = left.length < right.length ? [left, right] : [right, left];
  let shortIndex = 0;
  let longIndex = 0;
  let skipped = false;
  while (shortIndex < shorter.length && longIndex < longer.length) {
    if (shorter[shortIndex] === longer[longIndex]) {
      shortIndex += 1;
      longIndex += 1;
      continue;
    }
    if (skipped) return false;
    skipped = true;
    longIndex += 1;
  }
  return true;
}

function correctedToken(token: string) {
  if (
    token.length < 5 ||
    reviewedVocabulary.includes(token as (typeof reviewedVocabulary)[number])
  ) {
    return token;
  }

  const candidates = reviewedVocabulary.filter(
    (term) => term.length >= 5 && isOneEditAway(token, term),
  );
  return candidates.length === 1 ? (candidates[0] ?? token) : token;
}

/** Lowercases a learner query and safely repairs unambiguous, minor topic-term typos. */
export function normalizeAiQuery(message: string) {
  return message.toLocaleLowerCase().replace(/[a-z][a-z'-]*/g, correctedToken);
}
