import assert from "node:assert/strict";
import test from "node:test";
import {
  applyCaregiverInteractionSubmission,
  isCaregiverModuleComplete,
} from "../features/caregiver/lib/caregiver-completion.ts";

const initial = {
  moduleId: "CG-M1",
  state: "notStarted",
  centralIdeaReached: false,
  coreApplicationCompleted: false,
  takeawayViewed: false,
  keyIdeaUnderstood: null,
  lastSectionId: null,
};

test("only CG-M1-I01 sets the Module 1 core application", () => {
  assert.equal(
    applyCaregiverInteractionSubmission(initial, "CG-M1-I01").coreApplicationCompleted,
    true,
  );
  assert.equal(
    applyCaregiverInteractionSubmission(initial, "CG-M1-I02").coreApplicationCompleted,
    false,
  );
  assert.equal(
    applyCaregiverInteractionSubmission(initial, "CG-M1-I03").coreApplicationCompleted,
    false,
  );
});

test("central idea, I01, and takeaway alone determine completion", () => {
  assert.equal(
    isCaregiverModuleComplete({
      centralIdeaReached: true,
      coreApplicationCompleted: true,
      takeawayViewed: true,
    }),
    true,
  );
  assert.equal(
    isCaregiverModuleComplete({
      centralIdeaReached: true,
      coreApplicationCompleted: true,
      takeawayViewed: false,
    }),
    false,
  );
});
