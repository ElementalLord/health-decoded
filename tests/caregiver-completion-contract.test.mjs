import assert from "node:assert/strict";
import test from "node:test";

import {
  applyUrgentInterruption,
  deriveCaregiverModuleState,
  deriveCaregiverSectionState,
  isCaregiverModuleComplete,
  isCaregiverSectionComplete,
} from "../features/caregiver/lib/caregiver-completion.ts";

const completeInputs = {
  centralIdeaReached: true,
  coreApplicationCompleted: true,
  takeawayViewed: true,
};

test("module completion uses only the three approved gates", () => {
  assert.equal(isCaregiverModuleComplete(completeInputs), true);

  for (const field of Object.keys(completeInputs)) {
    assert.equal(
      isCaregiverModuleComplete({ ...completeInputs, [field]: false }),
      false,
      `${field} must gate completion`,
    );
  }
});

test("quiz understanding and reflection participation remain separate from completion", () => {
  const completedWithMissedIdea = {
    moduleId: "CG-M1",
    state: "inProgress",
    ...completeInputs,
    keyIdeaUnderstood: false,
    lastSectionId: "CG-M1-S07",
  };

  assert.equal(deriveCaregiverModuleState(completedWithMissedIdea), "completed");
  assert.equal("reflectionState" in completeInputs, false);
  assert.equal("keyIdeaUnderstood" in completeInputs, false);
});

test("revisit preserves completion and urgent interruption changes no progress", () => {
  const revisit = {
    moduleId: "CG-M4",
    state: "revisit",
    ...completeInputs,
    keyIdeaUnderstood: null,
    lastSectionId: "CG-M4-S08",
  };

  assert.equal(deriveCaregiverModuleState(revisit), "revisit");
  assert.equal(applyUrgentInterruption(revisit), revisit);
});

test("section completion requires all modules and one saved category, never tools", () => {
  const completedModuleIds = ["CG-M1", "CG-M2", "CG-M3", "CG-M4", "CG-M5"];

  assert.equal(
    isCaregiverSectionComplete({
      completedModuleIds,
      currentNextStepCategory: "Review a boundary",
    }),
    true,
  );
  assert.equal(
    isCaregiverSectionComplete({
      completedModuleIds: completedModuleIds.slice(0, 4),
      currentNextStepCategory: "Review a boundary",
    }),
    false,
  );
  assert.equal(
    isCaregiverSectionComplete({
      completedModuleIds,
      currentNextStepCategory: null,
    }),
    false,
  );
  assert.equal(
    deriveCaregiverSectionState({
      completedModuleIds,
      currentNextStepCategory: null,
    }),
    "inProgress",
  );
});
