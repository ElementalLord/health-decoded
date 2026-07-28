import assert from "node:assert/strict";
import test from "node:test";

import {
  canNavigateToLessonStage,
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

test("ungated chapters and review mode remain freely navigable", () => {
  assert.equal(
    isLessonStageLocked({
      accessMode: "active",
      gates,
      readyStages: new Set(),
      stage: 2,
    }),
    false,
  );
  assert.equal(
    canNavigateToLessonStage({
      accessMode: "review",
      currentStage: 1,
      gates,
      nextStage: 2,
      readyStages: new Set(),
    }),
    true,
  );
});
