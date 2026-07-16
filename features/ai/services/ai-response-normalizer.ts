const routineDisclaimerSuffixes = [
  /\s*(?:please\s+)?(?:remember|keep in mind|note)(?:\s+that)?[^\n]{0,140}(?:educational|general information)[^\n]{0,140}(?:not medical advice|not a substitute for medical advice|healthcare professional|doctor)[.!\s]*$/i,
  /\s*(?:this|the above|health decoded)[^\n]{0,100}(?:educational|general information)[^\n]{0,100}(?:not medical advice|not a substitute for medical advice)[.!\s]*$/i,
  /\s*(?:for personalized (?:medical )?(?:advice|guidance)|always)[,:]?\s+(?:consult|contact|speak (?:with|to)|talk (?:with|to)|ask)[^\n]{0,100}(?:doctor|clinician|healthcare (?:professional|provider|team))[.!\s]*$/i,
] as const;

const routineOpening =
  /^\s*It is completely normal to feel overwhelmed or worried right now\.\s+Please know that this diagnosis is not a reflection of you or your choices; it is simply a health condition that you are now learning to manage\.\s*/i;

export function normalizeAiResponseOpening(value: string) {
  return value.replace(routineOpening, "").replace(/^\n+/, "");
}

function isRoutineDisclaimerBlock(value: string) {
  const block = value.replace(/\s+/g, " ").trim();
  return (
    /\b(?:not medical advice|not a substitute for (?:professional )?medical advice|for educational (?:purposes|information) only)\b/i.test(
      block,
    ) && block.length <= 420
  );
}

export function normalizeAiResponseText(value: string) {
  let normalized = value.trimEnd();
  let previous = "";

  while (normalized !== previous) {
    previous = normalized;
    const blocks = normalized.split(/\n{2,}/);
    if (blocks.length > 1 && isRoutineDisclaimerBlock(blocks.at(-1) ?? "")) {
      blocks.pop();
      normalized = blocks.join("\n\n").trimEnd();
    }
    for (const suffix of routineDisclaimerSuffixes) normalized = normalized.replace(suffix, "");
    normalized = normalized.trimEnd().replace(/\n{3,}/g, "\n\n");
  }

  return normalized;
}

/**
 * Streams complete paragraphs immediately while retaining only the final paragraph.
 * The final paragraph is normalized before it reaches the browser, which prevents
 * a routine provider-added disclaimer from flashing and then disappearing.
 */
export class AiResponseStreamNormalizer {
  private openingNormalized = false;
  private pending = "";

  append(text: string) {
    this.pending += text;
    const boundary = this.pending.lastIndexOf("\n\n");
    if (!this.openingNormalized && (boundary >= 0 || this.pending.length > 320)) {
      this.pending = normalizeAiResponseOpening(this.pending);
      this.openingNormalized = true;
    }
    if (boundary < 0) {
      const retainedCharacters = 320;
      if (this.pending.length <= retainedCharacters) return "";
      const ready = this.pending.slice(0, -retainedCharacters);
      this.pending = this.pending.slice(-retainedCharacters);
      return ready;
    }

    const ready = this.pending.slice(0, boundary + 2);
    this.pending = this.pending.slice(boundary + 2);
    return ready;
  }

  finish() {
    const finalText = normalizeAiResponseText(normalizeAiResponseOpening(this.pending));
    this.pending = "";
    this.openingNormalized = false;
    return finalText;
  }
}
