import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { stripTypeScriptTypes } from "node:module";
import test from "node:test";
import { glossaryKnowledgeFor } from "../features/ai/services/ai-knowledge.ts";
import { allCredibleSources } from "../features/ai/data/credible-sources.ts";
import {
  boundedDiabetesKnowledge,
  diabetesAnswerFor,
  diabetesKnowledge,
  diabetesKnowledgeFor,
  diabetesSourceBank,
} from "../features/ai/data/diabetes-knowledge.ts";

test("Gemini receives the full topic bank independent of question wording within the prompt limit", () => {
  const bank = diabetesSourceBank(allCredibleSources);
  for (const entry of diabetesKnowledge)
    assert.ok(
      bank.some(({ id }) => id === entry.id),
      entry.id,
    );
  assert.equal(new Set(bank.map(({ id }) => id)).size, bank.length);
  const prompt = buildReviewedCorpusPrompt({
    question: "x".repeat(2000),
    previousQuestion: "x".repeat(2000),
    previousAnswers: ["x".repeat(8000), "x".repeat(8000)],
    sources: bank,
  });
  assert.ok(prompt.length < 128_000);
});
import {
  buildReviewedCorpusPrompt,
  buildReviewedEvidenceFallback,
} from "../features/ai/services/ai-grounding.ts";

async function loadStaticModule(path, dependencies = {}) {
  const original = await readFile(new URL(`../${path}`, import.meta.url), "utf8");
  const exports = [...original.matchAll(/export (?:const|function) (\w+)/g)].map(
    (match) => match[1],
  );
  const source = stripTypeScriptTypes(original)
    .replace(/^import\b[\s\S]*?;\n/gm, "")
    .replace(/^export /gm, "");
  return new Function(...Object.keys(dependencies), `${source}\nreturn {${exports.join(",")}};`)(
    ...Object.values(dependencies),
  );
}
const { createEntries } = await loadStaticModule(
  "features/glossary/content/terms/create-entries.ts",
);
const { glossarySources } = await loadStaticModule("features/glossary/content/glossary-sources.ts");
const entries = [];
for (const name of [
  "foundations",
  "tests-monitoring",
  "medicines",
  "nutrition-activity",
  "urgent-long-term",
  "care-emotional",
  "insurance-appointments",
]) {
  const termsModule = await loadStaticModule(`features/glossary/content/terms/${name}.ts`, {
    createEntries,
  });
  entries.push(...Object.values(termsModule).flat());
}

test("the knowledge library retrieves definitions across the entire glossary", () => {
  assert.ok(entries.length > 100);
  for (const term of [
    "Neuropathy",
    "Glycemic index",
    "eGFR",
    "Metformin",
    "Durable medical equipment",
  ]) {
    const knowledge = glossaryKnowledgeFor(`What is ${term}?`, entries, glossarySources);
    assert.ok(knowledge.length > 0, term);
    assert.match(knowledge[0].summary.toLowerCase(), new RegExp(term.toLowerCase()));
    assert.ok(knowledge[0].href.startsWith("https://"));
  }
});

test("definitions remain answerable without any AI or web request", () => {
  for (const term of ["Neuropathy", "Glycemic index", "eGFR", "Durable medical equipment"]) {
    const question = `What is ${term}?`;
    const answer = buildReviewedEvidenceFallback({
      question,
      sources: glossaryKnowledgeFor(question, entries, glossarySources),
    });
    assert.match(answer.toLowerCase(), new RegExp(term.toLowerCase()));
    assert.doesNotMatch(answer, /internet|unavailable|don’t have enough/i);
  }
});

test("a complete question retrieves its own knowledge while a referential follow-up inherits the topic", () => {
  const current = glossaryKnowledgeFor(
    "What is neuropathy?",
    entries,
    glossarySources,
    "What is metformin?",
  );
  assert.ok(current.some(({ title }) => title.startsWith("Neuropathy")));
  assert.equal(
    current.some(({ title }) => title.startsWith("Metformin")),
    false,
  );
  const followUp = glossaryKnowledgeFor(
    "How does it work?",
    entries,
    glossarySources,
    "What is metformin?",
  );
  assert.ok(followUp.some(({ title }) => title.startsWith("Metformin")));
});

test("expanded knowledge respects the prompt size and citation ID limits", () => {
  for (const question of [
    "Compare insulin, blood glucose, A1C, food and diabetes",
    "What are the different medicines for diabetes?",
    "What is neuropathy?",
  ]) {
    const sources = [
      ...glossaryKnowledgeFor(question, entries, glossarySources),
      ...allCredibleSources,
    ];
    assert.ok(buildReviewedCorpusPrompt({ question, sources }).length < 32_000);
    assert.ok(sources.every(({ id }) => id.length <= 64));
  }
});

test("detailed knowledge covers common topics and keeps source provenance", () => {
  assert.ok(diabetesKnowledge.length >= 140);
  assert.equal(new Set(diabetesKnowledge.map(({ id }) => id)).size, diabetesKnowledge.length);
  for (const entry of diabetesKnowledge) {
    assert.ok(entry.summary.length > 100, entry.id);
    assert.ok(entry.href.startsWith("https://"), entry.id);
    assert.ok(entry.id.length <= 64, entry.id);
    for (const question of entry.questions) {
      assert.deepEqual(diabetesAnswerFor(question), {
        answer: entry.summary,
        reviewedSourceKeys: [entry.id],
      });
      assert.equal(diabetesKnowledgeFor(question)[0].id, entry.id, question);
    }
  }
});

test("different wording and misspellings retrieve detailed local explanations", () => {
  for (const [question, id] of [
    ["Explain why glucose jumps before breakfast", "KB-DAWN"],
    ["Tell me about cgm sensor lag", "KB-CGM-FLUID"],
    ["Tell me about hypoglycmia unawareness", "KB-UNAWARENESS"],
    ["How does metofrmin work in the liver?", "KB-METFORMIN-ACTION"],
    ["How does soluble fiber slow digestion?", "KB-FIBER-SOLUBLE"],
    ["How can diabetes affect nerves controlling organs and digestion?", "KB-NERVE-TYPES"],
  ]) {
    assert.ok(
      diabetesKnowledgeFor(question).some((entry) => entry.id === id),
      question,
    );
  }
  assert.ok(
    diabetesKnowledgeFor("How does it work?", "How does Jardiance work?").some(
      ({ id }) => id === "KB-SGLT2-ACTION",
    ),
  );
  assert.equal(diabetesAnswerFor("Should I double my insulin?"), null);
  assert.equal(diabetesAnswerFor("What medicine was approved this morning?"), null);
});

test("rich knowledge stays within the prompt boundary even with maximum history", () => {
  const question =
    "Compare insulin, metformin, food, kidneys, CGM, glucose, A1C, neuropathy, sleep and blood pressure";
  const sources = boundedDiabetesKnowledge([
    ...diabetesKnowledgeFor(question),
    ...glossaryKnowledgeFor(question, entries, glossarySources),
    ...allCredibleSources,
    ...diabetesKnowledge,
  ]);
  const prompt = buildReviewedCorpusPrompt({
    question: question.padEnd(2000, " "),
    previousQuestion: "x".repeat(2000),
    previousAnswers: ["x".repeat(8000), "x".repeat(8000)],
    sources,
  });
  assert.ok(prompt.length < 32_000);
  assert.equal(new Set(sources.map(({ id }) => id)).size, sources.length);
  assert.ok(sources.some(({ id }) => id.startsWith("KB-")));
});

test("expanded clinical and life-stage topics retrieve relevant evidence for unfamiliar wording", () => {
  for (const [question, id] of [
    ["Tell me about inherited MODY", "KB-MODY"],
    ["Explain autoimmune LADA in adults", "KB-LADA"],
    ["Explain pancreatogenic diabetes", "KB-TYPE3C"],
    ["Explain preconception glucose care", "KB-PREGNANCY-PLANNING"],
    ["Tell me about school nurse support", "KB-SCHOOL-PLAN"],
    ["Explain memory difficulties with diabetes care", "KB-OLDER-SUPPORT"],
    ["Explain delayed stomach emptying", "KB-GASTROPARESIS-DETAIL"],
    ["Why do steroids push my readings up?", "KB-STEROID-DIABETES"],
    ["Explain glucose meter control solution", "KB-METER-CONTROL"],
    ["Tell me about Ramadan glucose checks", "KB-FASTING-MONITORING"],
    ["How do hormonal cycles affect readings?", "KB-MENSTRUAL-PATTERNS"],
    ["What happens in hyperosmolar dehydration?", "KB-HHS"],
    ["Explain metabolic surgery benefits", "KB-METABOLIC-SURGERY"],
    ["What are the concerns around driving safety?", "KB-DRIVING-DIABETES"],
  ]) {
    assert.ok(
      diabetesKnowledgeFor(question).some((entry) => entry.id === id),
      question,
    );
  }
  assert.equal(diabetesAnswerFor("What vaccines are required today in my country?"), null);
  assert.equal(diabetesAnswerFor("When should I stop my medication before my surgery?"), null);
});

test("messy typing and everyday descriptions retrieve concepts without an exact answer match", () => {
  for (const [question, id] of [
    ["why my sugars jump up when waking up without food", "KB-DAWN"],
    ["can u explain gestatinal diabtes in pregancy", "KB-PREGNANCY-DIABETES"],
    ["my tummy emptys slow gastroparesis whats that", "KB-GASTROPARESIS-DETAIL"],
    ["why cant someone feel their lows anymore", "KB-UNAWARENESS"],
    ["why do steriods push readings up", "KB-STEROID-DIABETES"],
  ]) {
    assert.equal(diabetesAnswerFor(question), null);
    assert.ok(
      diabetesKnowledgeFor(question).some((entry) => entry.id === id),
      question,
    );
  }
  assert.equal(
    diabetesKnowledgeFor("what does that mean in simpler words", "How does metformin work?")[0].id,
    "KB-METFORMIN-ACTION",
  );
  assert.equal(
    diabetesKnowledgeFor(
      "my tummy emptys slow gastroparesis whats that",
      "How does metformin work?",
    )[0].id,
    "KB-GASTROPARESIS-DETAIL",
    "an explicit new topic must take precedence over the previous topic",
  );
});
