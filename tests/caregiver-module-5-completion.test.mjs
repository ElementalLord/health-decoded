import assert from "node:assert/strict";
import test from "node:test";
import {
  applyCaregiverInteractionSubmission,
  isCaregiverModuleComplete,
} from "../features/caregiver/lib/caregiver-completion.ts";

const initial = {
  moduleId: "CG-M5",
  state: "notStarted",
  centralIdeaReached: false,
  coreApplicationCompleted: false,
  takeawayViewed: false,
  keyIdeaUnderstood: null,
  lastSectionId: null,
};
test("only CG-M5-I01 sets the Module 5 core application", () => {
  for (const id of ["CG-M5-I02", "CG-M5-I03", "CG-M5-I04", "CG-M5-I05"])
    assert.equal(applyCaregiverInteractionSubmission(initial, id).coreApplicationCompleted, false);
  assert.equal(
    applyCaregiverInteractionSubmission(initial, "CG-M5-I01").coreApplicationCompleted,
    true,
  );
});
test("completion needs the central idea, responsibility map, and takeaway", () => {
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
