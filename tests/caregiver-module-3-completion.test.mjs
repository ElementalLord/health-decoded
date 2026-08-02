import assert from "node:assert/strict";
import test from "node:test";
import {
  applyCaregiverInteractionSubmission,
  isCaregiverModuleComplete,
} from "../features/caregiver/lib/caregiver-completion.ts";

const initial = {
  moduleId: "CG-M3",
  state: "notStarted",
  centralIdeaReached: false,
  coreApplicationCompleted: false,
  takeawayViewed: false,
  keyIdeaUnderstood: null,
  lastSectionId: null,
};

test("only CG-M3-I02 sets the Module 3 core application", () => {
  for (const id of ["CG-M3-I01", "CG-M3-I03", "CG-M3-I04"])
    assert.equal(applyCaregiverInteractionSubmission(initial, id).coreApplicationCompleted, false);
  assert.equal(
    applyCaregiverInteractionSubmission(initial, "CG-M3-I02").coreApplicationCompleted,
    true,
  );
});

test("central idea, I02, and takeaway alone determine completion", () => {
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
      centralIdeaReached: false,
      coreApplicationCompleted: true,
      takeawayViewed: true,
    }),
    false,
  );
});
