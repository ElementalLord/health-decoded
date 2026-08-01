import assert from "node:assert/strict";
import test from "node:test";

import {
  applyCaregiverInteractionSubmission,
  deriveCaregiverModuleState,
  isCaregiverModuleComplete,
} from "../features/caregiver/lib/caregiver-completion.ts";

const initial = {
  moduleId: "CG-M2",
  state: "notStarted",
  centralIdeaReached: false,
  coreApplicationCompleted: false,
  takeawayViewed: false,
  keyIdeaUnderstood: null,
  lastSectionId: null,
};

test("only I03 sets the Module 2 core application gate", () => {
  for (const interactionId of ["CG-M2-I01", "CG-M2-I02", "CG-M2-I04", "CG-M2-I05"]) {
    const next = applyCaregiverInteractionSubmission(initial, interactionId);
    assert.equal(next.coreApplicationCompleted, false, `${interactionId} must stay optional`);
    assert.equal(next.state, "inProgress");
  }
  const core = applyCaregiverInteractionSubmission(initial, "CG-M2-I03");
  assert.equal(core.coreApplicationCompleted, true);
  assert.equal(core.state, "inProgress");
});

test("central idea, I03, and takeaway are all required and jointly sufficient", () => {
  const complete = {
    centralIdeaReached: true,
    coreApplicationCompleted: true,
    takeawayViewed: true,
  };
  assert.equal(isCaregiverModuleComplete(complete), true);
  for (const gate of Object.keys(complete)) {
    assert.equal(isCaregiverModuleComplete({ ...complete, [gate]: false }), false);
  }
});

test("knowledge-check and reflection state never gate completion", () => {
  const progress = {
    ...initial,
    state: "inProgress",
    centralIdeaReached: true,
    coreApplicationCompleted: true,
    takeawayViewed: true,
    keyIdeaUnderstood: false,
  };
  assert.equal(deriveCaregiverModuleState(progress), "completed");
  assert.equal("reflection" in progress, false);
  assert.equal("answers" in progress, false);
});
