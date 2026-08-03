import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { mythCheckCards } from "../features/mythbusters/content/myth-check-cards.ts";
import { mythCheckSources } from "../features/mythbusters/content/myth-check-sources.ts";
import {
  createMythCheckRound,
  publishedMythCheckCards,
} from "../features/mythbusters/lib/myth-check-rounds.ts";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const [component, resources, routes, bottomNavigation, styles] = await Promise.all([
  read("features/mythbusters/components/diabetes-myth-check.tsx"),
  read("features/resources/components/resources.tsx"),
  read("lib/routes.ts"),
  read("components/layout/bottom-navigation.tsx"),
  read("features/mythbusters/styles/diabetes-myth-check.module.css"),
]);

test("first release has 32 source-backed cards with unique stable IDs", () => {
  assert.equal(mythCheckCards.length, 32);
  assert.equal(new Set(mythCheckCards.map((card) => card.id)).size, mythCheckCards.length);
  assert.ok(mythCheckCards.every((card) => /^MYTH-(BASICS|FOOD|MONITORING|TREATMENT)-\d{2}$/.test(card.id)));
  assert.ok(mythCheckCards.every((card) => card.status === "source-backed"));
});

test("every card has a valid verdict, explanation, takeaway, and registered sources", () => {
  const verdicts = new Set(["myth", "fact", "depends"]);
  const sourceIds = new Set(mythCheckSources.map((source) => source.id));
  for (const card of mythCheckCards) {
    assert.ok(verdicts.has(card.verdict));
    assert.ok(card.explanation.trim().length > 30);
    assert.ok(card.takeaway.trim().length > 15);
    assert.ok(card.sourceIds.length > 0);
    assert.ok(card.sourceIds.every((id) => sourceIds.has(id)), `${card.id} has an unknown source`);
  }
});

test("draft and archived cards are excluded", () => {
  const extra = [
    ...mythCheckCards,
    { ...mythCheckCards[0], id: "DRAFT", status: "draft" },
    { ...mythCheckCards[0], id: "ARCHIVED", status: "archived" },
  ];
  assert.equal(publishedMythCheckCards(extra).length, 32);
});

test("topic rounds contain only the requested category", () => {
  for (const category of ["basics", "food", "monitoring", "treatment"]) {
    const round = createMythCheckRound(mythCheckCards, category);
    assert.ok(round.length > 0);
    assert.ok(round.every((card) => card.category === category));
  }
});

test("Quick Mix has eight nonduplicated cards and deterministic random support", () => {
  const first = createMythCheckRound(mythCheckCards, "quick", () => 0.25);
  const second = createMythCheckRound(mythCheckCards, "quick", () => 0.25);
  assert.equal(first.length, 8);
  assert.equal(new Set(first.map((card) => card.id)).size, 8);
  assert.deepEqual(first.map((card) => card.id), second.map((card) => card.id));
});

test("answering reveals locked, neutral feedback and supports missed-card replay", () => {
  assert.match(component, /setSelected\(verdict\)/);
  assert.match(component, /disabled=\{selected !== null\}/);
  assert.match(component, /That’s the best answer\./);
  assert.match(component, /The best answer is/);
  assert.doesNotMatch(component, /\bWrong\b|\bFailure\b|leaderboard|scoreboard|confetti/i);
  assert.match(component, /answers\.filter\(\(answer\) => !answer\.understood\)/);
  assert.match(component, /Replay these claims/);
  assert.match(component, /entry\.takeaway/);
});

test("focus, announcements, source disclosure, and responsive controls are present", () => {
  assert.match(component, /feedbackRef\.current\?\.focus/);
  assert.match(component, /claimRef\.current\?\.focus/);
  assert.match(component, /aria-live="polite"/);
  assert.match(component, /<details/);
  assert.match(component, /rel="noreferrer noopener"/);
  assert.match(styles, /@media \(max-width: 47\.99rem\)/);
  assert.match(styles, /@media \(max-width: 24rem\)/);
  assert.match(styles, /prefers-reduced-motion/);
  assert.doesNotMatch(styles, /overflow-x:\s*auto/);
});

test("answers remain session-only and are not sent to storage, AI, Supabase, or analytics", () => {
  assert.doesNotMatch(component, /localStorage|sessionStorage|indexedDB|supabase|fetch\(|analytics|services\/ai|\/api\/ai|router\.push/i);
  assert.match(component, /useState<readonly MythCheckAnswer\[\]>\(\[\]\)/);
});

test("Resources links to Myth Check without adding permanent navigation", () => {
  assert.match(resources, /href="\/myth-check"/);
  assert.match(resources, /Diabetes Myth Check/);
  assert.doesNotMatch(routes, /myth-check/);
  assert.doesNotMatch(bottomNavigation, /myth-check/);
});
