import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { recommendNextStep } from "../features/next-step/lib/recommend-next-step.ts";

function progress(overrides = {}) {
  return {
    completedLessonCount: 4,
    currentLesson: {
      dayNumber: 5,
      estimatedMinutes: 8,
      status: "not_started",
      title: "Understanding patterns",
    },
    earnedMilestoneIds: new Set(),
    lastDismissed: null,
    today: "2026-08-03",
    ...overrides,
  };
}

test("an in-progress lesson is the first recommendation", () => {
  const result = recommendNextStep(
    progress({ currentLesson: { ...progress().currentLesson, status: "in_progress" } }),
  );
  assert.equal(result.primary.type, "continue-lesson");
  assert.equal(result.primary.route, "/lessons/5");
});

test("the next required lesson is returned when none is in progress", () => {
  const result = recommendNextStep(progress());
  assert.equal(result.primary.type, "next-lesson");
  assert.equal(result.primary.actionLabel, "Start lesson");
});

test("optional tools use controlled progress eligibility", () => {
  assert.deepEqual(recommendNextStep(progress({ completedLessonCount: 2 })).alternatives, []);
  const eligible = recommendNextStep(progress({ completedLessonCount: 5 }));
  assert.deepEqual(
    eligible.alternatives.map((item) => item.id),
    ["myth-check", "appointment-prep"],
  );
});

test("a dismissed optional recommendation rotates for seven calendar days", () => {
  const completed = progress({ completedLessonCount: 14, currentLesson: null });
  const first = recommendNextStep(completed);
  assert.equal(first.primary.id, "myth-check");
  const rotated = recommendNextStep({
    ...completed,
    lastDismissed: { id: "myth-check", date: "2026-08-03" },
  });
  assert.equal(rotated.primary.id, "appointment-prep");
  const eligibleAgain = recommendNextStep({
    ...completed,
    today: "2026-08-10",
    lastDismissed: { id: "myth-check", date: "2026-08-03" },
  });
  assert.equal(eligibleAgain.primary.id, "myth-check");
});

test("a dismissed required lesson remains an eligible alternative", () => {
  const result = recommendNextStep({
    ...progress({ completedLessonCount: 5 }),
    lastDismissed: { id: "start-lesson-5", date: "2026-08-03" },
  });
  assert.ok(
    [result.primary, ...result.alternatives].some(
      (recommendation) => recommendation.id === "start-lesson-5",
    ),
  );
});

test("recommendation engine does not read medical or AI data", async () => {
  const source = await readFile(
    new URL("../features/next-step/lib/recommend-next-step.ts", import.meta.url),
    "utf8",
  );
  for (const forbidden of ["symptom", "glucose", "medicine", "diagnosis", "a1c", "ai tutor"]) {
    assert.equal(source.toLowerCase().includes(forbidden), false, forbidden);
  }
});

test("Journey contains both compact features without adding navigation", async () => {
  const [journey, routes, bottomNavigation] = await Promise.all([
    readFile(new URL("../app/(app)/journey/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/routes.ts", import.meta.url), "utf8"),
    readFile(new URL("../components/layout/bottom-navigation.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(journey, /NextStepPanel/);
  assert.match(journey, /LearningStreakPanel/);
  assert.doesNotMatch(routes, /learning-streak|next-step/);
  assert.doesNotMatch(bottomNavigation, /Learning streak|Your Next Step/);
});
