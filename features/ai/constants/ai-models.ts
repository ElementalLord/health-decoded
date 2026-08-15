/** Stable, low-latency Gemini API model for the text-only AI tutor. */
export const DEFAULT_AI_MODEL = "gemini-3.1-flash-lite";

/** Deterministic default so the same question returns a stable grounded answer. */
export const AI_DEFAULT_TEMPERATURE = 0;

/**
 * Regeneration asks the model for the same grounded evidence in different words,
 * so it needs sampling variation. A deterministic retry would repeat the answer
 * the learner already rejected.
 */
export const AI_REGENERATION_TEMPERATURE = 0.7;
