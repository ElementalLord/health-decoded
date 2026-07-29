import assert from "node:assert/strict";
import test from "node:test";

import {
  canNavigateToLessonStage,
  getLessonResumeStage,
  isLessonStageLocked,
} from "../features/lessons/lib/lesson-stage-gating.ts";

const gates = {
  1: "Complete the first interaction.",
  4: "Complete the second interaction.",
};

test("active learners cannot advance from a gated chapter before its interaction", () => {
  const readyStages = new Set();

  assert.equal(isLessonStageLocked({ accessMode: "active", gates, readyStages, stage: 1 }), true);
  assert.equal(
    canNavigateToLessonStage({
      accessMode: "active",
      currentStage: 1,
      gates,
      nextStage: 2,
      readyStages,
    }),
    false,
  );
});

test("the required interaction unlocks forward navigation without locking earlier chapters", () => {
  const readyStages = new Set([1]);

  assert.equal(
    canNavigateToLessonStage({
      accessMode: "active",
      currentStage: 1,
      gates,
      nextStage: 2,
      readyStages,
    }),
    true,
  );
  assert.equal(
    canNavigateToLessonStage({
      accessMode: "active",
      currentStage: 4,
      gates,
      nextStage: 3,
      readyStages: new Set(),
    }),
    true,
  );
});

test("ungated chapters remain freely navigable", () => {
  assert.equal(
    isLessonStageLocked({
      accessMode: "active",
      gates,
      readyStages: new Set(),
      stage: 2,
    }),
    false,
  );
});

test("review mode still requires the visible chapter interaction", () => {
  assert.equal(
    canNavigateToLessonStage({
      accessMode: "review",
      currentStage: 1,
      gates,
      nextStage: 2,
      readyStages: new Set(),
    }),
    false,
  );
});

test("a multi-chapter jump cannot bypass an unresolved gate in between", () => {
  assert.equal(
    canNavigateToLessonStage({
      accessMode: "active",
      currentStage: 0,
      gates,
      nextStage: 5,
      readyStages: new Set([1]),
    }),
    false,
  );
  assert.equal(
    canNavigateToLessonStage({
      accessMode: "active",
      currentStage: 0,
      gates,
      nextStage: 5,
      readyStages: new Set([1, 4]),
    }),
    true,
  );
});

test("a saved position resumes at the earliest unfinished gate instead of skipping it", () => {
  assert.equal(
    getLessonResumeStage({
      gates,
      readyStages: new Set([1]),
      storedStage: 5,
    }),
    4,
  );
  assert.equal(
    getLessonResumeStage({
      gates,
      readyStages: new Set([1, 4]),
      storedStage: 5,
    }),
    5,
  );
});
