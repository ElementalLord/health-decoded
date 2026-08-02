import assert from "node:assert/strict";
import test from "node:test";
import {
  applyCaregiverInteractionSubmission,
  applyUrgentInterruption,
  isCaregiverModuleComplete,
} from "../features/caregiver/lib/caregiver-completion.ts";

const initial = {
  moduleId: "CG-M4",
  state: "notStarted",
  centralIdeaReached: false,
  coreApplicationCompleted: false,
  takeawayViewed: false,
  keyIdeaUnderstood: null,
  lastSectionId: null,
};

test("only CG-M4-I02 sets the Module 4 core application", () => {
  for (const id of ["CG-M4-I01", "CG-M4-I03", "CG-M4-I04", "CG-M4-I05"])
    assert.equal(applyCaregiverInteractionSubmission(initial, id).coreApplicationCompleted, false);
  assert.equal(
    applyCaregiverInteractionSubmission(initial, "CG-M4-I02").coreApplicationCompleted,
    true,
  );
  assert.deepEqual(applyUrgentInterruption(initial), initial);
});

test("central idea, source matching, and takeaway alone determine completion", () => {
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
      coreApplicationCompleted: false,
      takeawayViewed: true,
    }),
    false,
  );
});
