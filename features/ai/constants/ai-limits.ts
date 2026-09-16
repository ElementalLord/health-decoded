export const AI_MAX_REQUEST_BYTES = 16_000;
export const AI_MAX_MESSAGE_CHARACTERS = 2_000;
export const AI_MAX_CONVERSATION_MESSAGES = 6;
export const AI_MAX_SESSION_HISTORY_BYTES = 10_000;
export const AI_MAX_OUTPUT_CHARACTERS = 8_000;
// Permit the bundled source bank in one generation call, so Gemini can choose
// evidence semantically without a second retrieval request.
export const AI_MAX_PROMPT_CHARACTERS = 128_000;
