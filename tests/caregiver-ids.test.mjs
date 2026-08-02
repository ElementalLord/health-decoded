import assert from "node:assert/strict";
import test from "node:test";

import {
  caregiverCoreApplicationByModule,
  caregiverModuleIds,
  caregiverStableIds,
  isCaregiverStableId,
  toCaregiverStableId,
} from "../features/caregiver/content/caregiver-ids.ts";
import {
  caregiverSourceDocuments,
  caregiverSourceTraceById,
} from "../features/caregiver/content/caregiver-source-map.ts";
import {
  caregiverModuleInteractionMetadata,
  validateCaregiverFoundationIntegrity,
} from "../features/caregiver/lib/caregiver-content-integrity.ts";

test("all caregiver IDs are unique, recognized, and source-traceable", () => {
  assert.equal(new Set(caregiverStableIds).size, caregiverStableIds.length);
  assert.ok(caregiverStableIds.length > 200);

  for (const id of caregiverStableIds) {
    assert.equal(isCaregiverStableId(id), true, id);
    assert.ok(caregiverSourceTraceById[id], `${id} needs an authoritative source`);
    assert.ok(caregiverSourceDocuments.includes(caregiverSourceTraceById[id].document));
    assert.ok(caregiverSourceTraceById[id].heading);
  }

  assert.deepEqual(validateCaregiverFoundationIntegrity(), []);
});

test("unknown caregiver IDs cannot enter the typed registry", () => {
  assert.equal(isCaregiverStableId("CG-M6"), false);
  assert.throws(() => toCaregiverStableId("CG-M6"), /Unknown caregiver content ID/);
});

test("the correction register names exactly one core application per module", () => {
  assert.deepEqual(Object.keys(caregiverCoreApplicationByModule), caregiverModuleIds);
  assert.deepEqual(Object.values(caregiverCoreApplicationByModule), [
    "CG-M1-I01",
    "CG-M2-I03",
    "CG-M3-I02",
    "CG-M4-I02",
    "CG-M5-I01",
  ]);

  for (const [moduleId, coreApplicationId] of Object.entries(caregiverCoreApplicationByModule)) {
    const metadata = caregiverModuleInteractionMetadata.find(({ id }) => id === coreApplicationId);
    assert.equal(metadata?.moduleId, moduleId);
    assert.equal(metadata?.completionRole, "core-application");
    assert.equal(metadata?.maySkipForModuleCompletion, false);
  }

  const safety = caregiverModuleInteractionMetadata.find(({ id }) => id === "CG-M4-I03");
  assert.equal(safety?.completionRole, "safety-interruption");
  assert.equal(safety?.maySkipForModuleCompletion, true);
});
