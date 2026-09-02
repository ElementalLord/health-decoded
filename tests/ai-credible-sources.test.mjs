import assert from "node:assert/strict";
import test from "node:test";

import { credibleSourcesForQuestion } from "../features/ai/data/credible-sources.ts";
import { AI_SUGGESTED_QUESTION_BANK } from "../features/ai/data/suggested-questions.ts";

test("general diabetes questions receive authoritative sources without Health Decoded content", () => {
  const sources = credibleSourcesForQuestion("How does the pancreas affect blood sugar?");

  assert.equal(sources.length >= 2, true);
  assert.equal(
    sources.every((source) => source.href.startsWith("https://")),
    true,
  );
  assert.equal(
    sources.every((source) => ["CDC", "NIDDK"].includes(source.organization)),
    true,
  );
});

test("topic-specific questions receive matching authoritative references", () => {
  assert.match(credibleSourcesForQuestion("What does A1C measure?")[0]?.title ?? "", /A1C/);
  assert.match(credibleSourcesForQuestion("What does metformin do?")[0]?.title ?? "", /Medicines/);
  assert.match(credibleSourcesForQuestion("Why does exercise help?")[0]?.title ?? "", /Active/);
  assert.match(
    credibleSourcesForQuestion("What does a continuous glucose monitor do?")[0]?.title ?? "",
    /Continuous Glucose Monitors/,
  );
  assert.match(
    credibleSourcesForQuestion("How does stress affect blood sugar?")[0]?.title ?? "",
    /Mental Health/,
  );
  assert.match(
    credibleSourcesForQuestion("Why are regular checkups part of diabetes care?")[0]?.title ?? "",
    /Care Schedule/,
  );
});

test("every tutor-suggested question has approved evidence", () => {
  const unsupported = AI_SUGGESTED_QUESTION_BANK.filter(
    (question) => credibleSourcesForQuestion(question).length === 0,
  );

  assert.deepEqual(unsupported, []);
});
