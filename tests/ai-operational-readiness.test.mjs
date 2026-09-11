import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  credibleSourcesForConversation,
  credibleSourcesForQuestion,
} from "../features/ai/data/credible-sources.ts";
import { reviewedSuggestedAnswerFor } from "../features/ai/data/reviewed-suggested-answers.ts";
import { AI_SUGGESTED_QUESTION_BANK } from "../features/ai/data/suggested-questions.ts";
import { buildReviewedEvidenceFallback } from "../features/ai/services/ai-grounding.ts";
import { isAiAnswerRelevant } from "../features/ai/services/ai-search-grounding.ts";
import { assessAiSafety, buildAiSafetyInput } from "../features/ai/services/ai-safety-rules.ts";

const sourceIds = (sources) => sources.map(({ id }) => id);

test("a complete current question replaces the previous topic", () => {
  const sources = credibleSourcesForConversation({
    message: "Well, what is metofrmin?",
    priorUserMessages: ["What does Mounjaro do?", "Should I take it daily?"],
  });

  assert.ok(sourceIds(sources).includes("DAILYMED-METFORMIN-LABEL"));
  assert.equal(sourceIds(sources).includes("FDA-MOUNJARO-LABEL"), false);
});

test("an actual follow-up inherits the minimum evidence needed from its topic", () => {
  for (const followUp of ["How does it work?", "What about side effects?", "Tell me more"])
    assert.ok(
      sourceIds(
        credibleSourcesForConversation({
          message: followUp,
          priorUserMessages: ["What does Mounjaro do?"],
        }),
      ).includes("FDA-MOUNJARO-LABEL"),
      followUp,
    );
});

test("unknown and evidence-sensitive questions remain eligible for live source discovery", () => {
  for (const question of [
    "Tell me a secret about the universe.",
    "What is the latest experimental gene therapy threshold for diabetes?",
  ]) {
    assert.equal(assessAiSafety(question).kind, "allow", question);
    assert.deepEqual(credibleSourcesForQuestion(question), [], question);
  }
});

test("common educational questions and misspellings retain a useful answer path", () => {
  for (const question of [
    "What does maunjaro do?",
    "Well, what is metofrmin?",
    "How does exersise affect glocose?",
    "Can stress affect blood sugar?",
    "How can a caregiver help?",
  ]) {
    assert.equal(assessAiSafety(question).kind, "allow", question);
    assert.ok(credibleSourcesForQuestion(question).length > 0, question);
  }
});

test("ordinary diagnostic wording reaches a direct evidence-backed answer", () => {
  const question = "does a high score mean im diabetic";
  const safety = assessAiSafety(question);
  const sources = credibleSourcesForQuestion(question);
  const answer = buildReviewedEvidenceFallback({ question, sources });

  assert.equal(safety.kind, "allow");
  assert.notEqual(safety.category, "Unknown");
  assert.equal(sources[0]?.id, "NIDDK-DIABETES-TESTS-DIAGNOSIS");
  assert.match(answer, /^No—a high score by itself does not mean someone has diabetes/i);
  assert.match(answer, /which test was used/i);
  assert.doesNotMatch(answer, /don’t have reviewed information/i);
});

test("personal turns reach bounded generation while emergencies stay urgent", () => {
  const scheduleInput = buildAiSafetyInput({
    message: "Should I take it daily?",
    priorUserMessages: ["What does Mounjaro do?"],
  });
  const schedule = assessAiSafety(scheduleInput);
  const emergency = assessAiSafety("I have chest pain and cannot breathe.");

  assert.equal(schedule.kind, "allow");
  assert.equal(schedule.category, "Medical Advice Request");
  assert.equal(emergency.kind, "refuse");
  assert.equal(emergency.refusalType, "emergency");
  assert.match(emergency.message, /emergency services/i);
});

test("a Mounjaro schedule follow-up has a direct reviewed outage answer", () => {
  const question = "Should I take it daily?";
  const sources = credibleSourcesForConversation({
    message: question,
    priorUserMessages: ["What does Mounjaro do?"],
  });
  const answer = buildReviewedEvidenceFallback({ question, sources });

  assert.match(answer, /^Mounjaro is normally taken once-weekly, not daily\./);
  assert.match(answer, /prescription label/i);
  assert.doesNotMatch(answer, /don’t have reviewed information/i);
});

test("personal yes-or-no follow-ups are read by the grounded model", () => {
  const result = assessAiSafety(
    buildAiSafetyInput({
      message: "Should I use it?",
      priorUserMessages: ["What does Mounjaro do?"],
    }),
  );

  assert.equal(result.kind, "allow");
  assert.equal(result.category, "Medical Advice Request");
});

test("short factual fallbacks answer only the named subject", () => {
  const question = "What is metformin?";
  const answer = buildReviewedEvidenceFallback({
    question,
    sources: credibleSourcesForQuestion(question),
  });

  assert.match(answer, /^Metformin is an oral biguanide medicine/i);
  assert.match(answer, /reducing glucose production in the liver/i);
  assert.doesNotMatch(answer, /ADA|SGLT2|DPP-4|medication classes/i);
});

test("reviewed fallback always returns a usable response for retrieved evidence", () => {
  const question = "What does Mounjaro do?";
  const sources = credibleSourcesForQuestion(question);
  const answer = buildReviewedEvidenceFallback({ question, sources });

  assert.ok(answer.length > 30);
  assert.match(answer, /Mounjaro|tirzepatide/i);
});

test("every tutor-suggested question has a direct reviewed answer and matching source", () => {
  for (const question of AI_SUGGESTED_QUESTION_BANK) {
    const reviewed = reviewedSuggestedAnswerFor(question);
    const sources = credibleSourcesForQuestion(question);
    const answer = buildReviewedEvidenceFallback({ question, sources });

    assert.ok(reviewed, question);
    assert.ok(reviewed.answer.length >= 80, question);
    assert.equal(answer, reviewed.answer, question);
    assert.equal(isAiAnswerRelevant(answer, { question }), true, question);
    assert.equal(
      reviewed.reviewedSourceKeys.some((id) => sources.some((source) => source.id === id)),
      true,
      `${question} must retrieve one of its answer sources`,
    );
    assert.doesNotMatch(answer, /don’t have reviewed information|diabetes management can include/i);
  }
});

test("another-way follow-ups materially reframe a reviewed fallback", () => {
  const originalQuestion = "Why might blood sugar change throughout the day?";
  const sources = credibleSourcesForConversation({
    message: "Can you explain that another way?",
    priorUserMessages: [originalQuestion],
  });
  const first = buildReviewedEvidenceFallback({
    question: originalQuestion,
    sources,
  });
  const followUp = buildReviewedEvidenceFallback({
    previousAnswers: [first],
    question: "Can you explain that another way?",
    sources,
  });

  assert.notEqual(followUp, first);
  assert.doesNotMatch(followUp, /^In short:/i);
  assert.doesNotMatch(followUp, /Blood glucose can change throughout the day in response/i);
  assert.match(followUp, /does not stay at one level/i);
  assert.match(followUp, /food, medicines, and physical activity/i);
});

test("sleep questions cannot fall through to an unrelated complications sentence", () => {
  const question = "How can sleep affect blood sugar?";
  const sources = credibleSourcesForQuestion(question);
  const answer = buildReviewedEvidenceFallback({ question, sources: sources.slice(0, 2) });

  assert.equal(sources[0]?.id, "NIDDK-SLEEP-AND-GLUCOSE");
  assert.match(answer, /sleep/i);
  assert.match(answer, /insulin sensitivity|glucose tolerance|blood glucose/i);
  assert.doesNotMatch(answer, /heart, eye, kidney, nerve, and foot problems/i);
});

test("client loading, cancellation, malformed-stream, and scroll paths are bounded", async () => {
  const client = await readFile(
    new URL("../features/ai/components/ai-chat.tsx", import.meta.url),
    "utf8",
  );

  assert.match(
    client,
    /const timeoutTimer = window\.setTimeout\([\s\S]{0,100}controller\.abort\(\)/,
  );
  assert.match(client, /if \(!event\.success\) \{[\s\S]{0,100}streamFailed = true/);
  assert.match(client, /finally \{[\s\S]{0,300}setIsStreaming\(false\)/);
  assert.match(client, /pendingScrollMessageIdRef\.current = userMessage\.id/);
  assert.match(client, /target\.scrollIntoView\(\{ behavior, block: "start" \}\)/);
  assert.doesNotMatch(client, /messagesEndRef|scrollTo\(\{[^}]*scrollHeight/s);
});
