import { strict as assert } from "node:assert";
import test from "node:test";

import {
  AiResponseStreamNormalizer,
  normalizeAiResponseOpening,
  normalizeAiResponseText,
} from "../features/ai/services/ai-response-normalizer.ts";

test("removes the repeated diagnosis reassurance from the start of a reply", () => {
  const response = normalizeAiResponseOpening(
    "It is completely normal to feel overwhelmed or worried right now. Please know that this diagnosis is not a reflection of you or your choices; it is simply a health condition that you are now learning to manage.\n\nInsulin resistance means cells do not respond to insulin as effectively.",
  );

  assert.equal(
    response,
    "Insulin resistance means cells do not respond to insulin as effectively.",
  );
});

test("removes a standalone routine medical disclaimer", () => {
  const response = normalizeAiResponseText(
    "Insulin helps many cells take in glucose for energy.\n\nThis is educational information only, not medical advice. Please consult your doctor.",
  );

  assert.equal(response, "Insulin helps many cells take in glucose for energy.");
});

test("removes a routine personalized-advice closing sentence", () => {
  const response = normalizeAiResponseText(
    "Walking can help muscles use glucose. For personalized medical advice, consult your healthcare professional.",
  );

  assert.equal(response, "Walking can help muscles use glucose.");
});

test("keeps specific educational references to a healthcare team", () => {
  const response = normalizeAiResponseText(
    "A useful question for your healthcare team is: what side effects should I know about?",
  );

  assert.equal(
    response,
    "A useful question for your healthcare team is: what side effects should I know about?",
  );
});

test("holds the final paragraph until it can be normalized", () => {
  const normalizer = new AiResponseStreamNormalizer();
  const first = normalizer.append(
    "Glucose is a sugar the body uses for energy.\n\nThis is educational information only, ",
  );
  const second = normalizer.append("not medical advice.");

  assert.equal(first, "Glucose is a sugar the body uses for energy.\n\n");
  assert.equal(second, "");
  assert.equal(normalizer.finish(), "");
});
