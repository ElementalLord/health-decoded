const sensitiveAiDataSource = String.raw`\b(?:authorization|cookie|password|passwd|secret|session[_ -]?token|access[_ -]?token|refresh[_ -]?token|api[_ -]?key)\s*[:=]\s*\S+|\bBearer\s+[A-Za-z0-9._~-]{12,}|\b(?:AIza[\w-]{20,}|AQ\.[\w-]{20,})\b|\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b|\b\d{3}-\d{2}-\d{4}\b|\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b|\b(?:MRN|medical record number)\s*[:#]?\s*[A-Z0-9-]{4,}\b`;

const sensitiveAiDataPattern = new RegExp(sensitiveAiDataSource, "i");
const sensitiveAiDataReplacementPattern = new RegExp(sensitiveAiDataSource, "gi");
const unsafeControlPattern =
  /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\u202a-\u202e\u2066-\u2069]/gu;
const markupPattern = /<\/?[a-z][^>]*>/gi;

/** @param {string} value */
export function containsSensitiveAiData(value) {
  return sensitiveAiDataPattern.test(value);
}

/**
 * Sanitizes reviewed database copy before it is placed in an external-provider prompt.
 * @param {string} value
 * @param {number} maximumCharacters
 */
export function minimizeReviewedAiText(value, maximumCharacters) {
  return value
    .replace(sensitiveAiDataReplacementPattern, "[REDACTED]")
    .replace(markupPattern, " ")
    .replace(unsafeControlPattern, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maximumCharacters);
}
