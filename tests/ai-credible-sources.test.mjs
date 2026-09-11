import assert from "node:assert/strict";
import test from "node:test";

import {
  credibleSourcesForConversation,
  credibleSourcesForQuestion,
} from "../features/ai/data/credible-sources.ts";
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
  assert.match(credibleSourcesForQuestion("What does metformin do?")[0]?.title ?? "", /METFORMIN/i);
  assert.match(credibleSourcesForQuestion("What does Mounjaro do?")[0]?.title ?? "", /MOUNJARO/);
  assert.match(credibleSourcesForQuestion("What does maunjaro do?")[0]?.title ?? "", /MOUNJARO/);
  assert.equal(credibleSourcesForQuestion("What does tirzepatide do?")[0]?.organization, "FDA");
  assert.match(credibleSourcesForQuestion("How does Ozempic work?")[0]?.title ?? "", /OZEMPIC/);
  assert.match(credibleSourcesForQuestion("What does Jardiance do?")[0]?.title ?? "", /JARDIANCE/);
  assert.match(credibleSourcesForQuestion("What is Januvia used for?")[0]?.title ?? "", /JANUVIA/);
  assert.match(credibleSourcesForQuestion("How does glipizide work?")[0]?.title ?? "", /GLIPIZIDE/);
  assert.match(
    credibleSourcesForQuestion("What does pioglitazone do?")[0]?.title ?? "",
    /PIOGLITAZONE/,
  );
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

test("minor topic misspellings still retrieve reviewed evidence", () => {
  const cases = [
    ["How does exersise help?", /Active/],
    ["What is glocose?", /Diabetes Basics|Managing Diabetes|Diabetes Overview/],
    ["What causes neuropthy?", /Neuropathy/],
    ["What are carbohydates?", /Eating/],
  ];

  for (const [question, expectedTitle] of cases) {
    assert.match(credibleSourcesForQuestion(question)[0]?.title ?? "", expectedTitle, question);
  }
});

test("every tutor-suggested question has approved evidence", () => {
  const unsupported = AI_SUGGESTED_QUESTION_BANK.filter(
    (question) => credibleSourcesForQuestion(question).length === 0,
  );

  assert.deepEqual(unsupported, []);
});

test("common questions across the Type 2 diabetes learning scope receive evidence", () => {
  const questions = [
    "What is low blood sugar?",
    "Why does illness affect diabetes?",
    "How can diabetes affect the kidneys?",
    "What is diabetic neuropathy?",
    "How are diabetes and heart health connected?",
    "Why does diabetes affect gum health?",
    "Can diabetes affect sexual health?",
    "How do I prepare for travel with diabetes?",
    "What raises the risk of Type 2 diabetes?",
    "How are sleep and blood sugar connected?",
    "How does stress affect diabetes?",
    "Why does walking help blood sugar?",
    "How do carbohydrates affect glucose?",
  ];

  for (const question of questions) {
    assert.ok(credibleSourcesForQuestion(question).length > 0, question);
  }
});

test("multi-topic questions retrieve evidence for each supported part", () => {
  const sources = credibleSourcesForQuestion(
    "How do insulin, exercise, and low blood sugar relate?",
  );
  const titles = sources.map(({ title }) => title).join(" ");

  assert.match(titles, /Medicines/);
  assert.match(titles, /Active/);
  assert.match(titles, /Low Blood Sugar/);
});

test("the current question outranks conversation history while short follow-ups retain context", () => {
  const changedTopic = credibleSourcesForConversation({
    message: "How does exercise affect blood sugar?",
    priorUserMessages: ["What does Mounjaro do?", "What about its side effects?"],
  });
  const pronounFollowUp = credibleSourcesForConversation({
    message: "Should I take it daily?",
    priorUserMessages: ["What does Mounjaro do?"],
  });
  const standaloneAfterRestrictedTurn = credibleSourcesForConversation({
    message: "Well, what is metofrmin?",
    priorUserMessages: ["What does Mounjaro do?", "Should I take it daily?"],
  });

  assert.match(changedTopic[0]?.title ?? "", /Active/);
  assert.match(pronounFollowUp[0]?.title ?? "", /MOUNJARO/);
  assert.match(standaloneAfterRestrictedTurn[0]?.title ?? "", /METFORMIN/i);
});
