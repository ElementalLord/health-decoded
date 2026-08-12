import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { credibleSourcesForQuestion } from "../../features/ai/data/credible-sources.ts";
import { parseAndValidateAiGroundedOutput } from "../../features/ai/services/ai-grounding.ts";
import { explainItBackChallenges } from "../../features/explain-it-back/content/explain-it-back-content.ts";
import { parseAndEnforceClassification } from "../../features/explain-it-back/services/explain-it-back-evaluator.ts";
import { aiTutorCases } from "./ai-tutor-cases.mjs";
import { explainItBackCases } from "./explain-it-back-cases.mjs";
import { runAllEvaluations } from "./eval-engine.mjs";

const read = (path) => readFile(new URL(`../../${path}`, import.meta.url), "utf8");

test("the adversarial banks meet the intended breadth without duplicate IDs", () => {
  assert.equal(aiTutorCases.length, 105);
  assert.equal(explainItBackCases.length, 50);
  assert.equal(new Set(aiTutorCases.map(({ id }) => id)).size, aiTutorCases.length);
  assert.equal(new Set(explainItBackCases.map(({ id }) => id)).size, explainItBackCases.length);
  assert.equal(new Set(explainItBackCases.map(({ challengeIndex }) => challengeIndex)).size, 10);
});

test("all deterministic adversarial cases pass their structural contract", () => {
  const results = runAllEvaluations();
  const failures = results.filter(({ status }) => status.startsWith("FAIL"));
  assert.deepEqual(failures, []);
});

test("Tutor grounding accepts only complete safe output citing retrieved source IDs", () => {
  const sources = credibleSourcesForQuestion("What is A1C?");
  const valid = parseAndValidateAiGroundedOutput(
    {
      answer: "A1C reflects average blood glucose over roughly three months.",
      sourceIds: [sources[0].id],
    },
    sources,
  );
  assert.equal(valid?.sources[0]?.id, sources[0].id);
  assert.equal(
    parseAndValidateAiGroundedOutput(
      { answer: "A1C reflects average blood glucose.", sourceIds: ["FAKE"] },
      sources,
    ),
    null,
  );
  assert.equal(
    parseAndValidateAiGroundedOutput(
      { answer: "<script>alert(1)</script>", sourceIds: [sources[0].id] },
      sources,
    ),
    null,
  );
});

test("Explain It Back rejects duplicates and every contradictory structured field", () => {
  const challenge = explainItBackChallenges[0];
  const ids = challenge.essentialConcepts.map(({ id }) => id);
  const valid = {
    verdict: "got_it",
    coveredConceptIds: ids,
    missingEssentialConceptIds: [],
    contradictionIds: [],
    offTopic: false,
    personalMedicalContent: false,
  };
  assert.equal(parseAndEnforceClassification(valid, challenge)?.verdict, "got_it");
  assert.equal(
    parseAndEnforceClassification({ ...valid, coveredConceptIds: [...ids, ids[0]] }, challenge),
    null,
  );
  assert.equal(
    parseAndEnforceClassification({ ...valid, missingEssentialConceptIds: [ids[0]] }, challenge),
    null,
  );
  assert.equal(parseAndEnforceClassification({ ...valid, verdict: "try_again" }, challenge), null);
  assert.equal(parseAndEnforceClassification({ ...valid, offTopic: true }, challenge), null);
});

test("Tutor context and AI logs exclude unrelated private product data", async () => {
  const [context, logging] = await Promise.all([
    read("features/ai/services/ai-context.server.ts"),
    read("features/ai/services/ai-logging.server.ts"),
  ]);
  assert.doesNotMatch(
    context,
    /appointment|reflection|spaced.review|explain.it.back|profile|caregiver/i,
  );
  assert.doesNotMatch(logging, /message\s*:|prompt\s*:|content\s*:/i);
  assert.match(logging, /request_size_bucket/);
});

test("raw learner explanations cannot enter persistence, analytics, or logs", async () => {
  const [server, route] = await Promise.all([
    read("features/explain-it-back/services/explain-it-back.server.ts"),
    read("app/api/explain-it-back/evaluate/route.ts"),
  ]);
  assert.doesNotMatch(server, /logger|analytics|insert\(|update\(|upsert\(/i);
  assert.doesNotMatch(
    route,
    /explanation:\s*parsed\.data\.explanation[\s\S]{0,200}(?:rpc|insert|update|log)/i,
  );
  assert.match(route, /result\.status === "evaluated"/);
  assert.match(route, /recordSpacedReviewResult/);
});

test("challenge and rubric authority remain server-owned", async () => {
  const schema = await read("features/explain-it-back/schemas/explain-it-back.schema.ts");
  assert.match(schema, /challengeId: z\.enum/);
  assert.doesNotMatch(schema, /rubric|essentialConcepts|misconceptions|sourceIds/);
  assert.match(schema, /\.strict\(\)/);
});
