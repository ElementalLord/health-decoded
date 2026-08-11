import assert from "node:assert/strict";
import test from "node:test";

import {
  AI_SUGGESTED_QUESTION_BANK,
  selectSuggestedQuestions,
} from "../features/ai/data/suggested-questions.ts";

test("AI Tutor selects a non-repeating subset from its question bank", () => {
  const suggestions = selectSuggestedQuestions(AI_SUGGESTED_QUESTION_BANK, 3);

  assert.equal(AI_SUGGESTED_QUESTION_BANK.length >= 6, true);
  assert.equal(suggestions.length, 3);
  assert.equal(new Set(suggestions).size, suggestions.length);
  assert.equal(
    suggestions.every((question) => AI_SUGGESTED_QUESTION_BANK.includes(question)),
    true,
  );
});
