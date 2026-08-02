import assert from "node:assert/strict";
import test from "node:test";
import {
  draftCaregiverRegionFixture,
  expiredCaregiverRegionFixture,
  unavailableCaregiverRegionFixture,
  verifiedTestOnlyCaregiverRegionFixture,
} from "../features/caregiver/regional/caregiver-region-fixtures.ts";
import { resolveCaregiverRegionalPresentation } from "../features/caregiver/regional/caregiver-region-provider.ts";

test("unavailable, draft, and expired contacts are withheld", () => {
  for (const fixture of [
    unavailableCaregiverRegionFixture,
    draftCaregiverRegionFixture,
    expiredCaregiverRegionFixture,
  ]) {
    const result = resolveCaregiverRegionalPresentation(fixture, new Date("2098-06-01"));
    assert.equal(result.mode, "fallback");
    assert.equal(result.emergencyContact, null);
  }
});
test("only the controlled current fixture is presented as verified", () => {
  const result = resolveCaregiverRegionalPresentation(
    verifiedTestOnlyCaregiverRegionFixture,
    new Date("2098-06-01"),
  );
  assert.equal(result.mode, "verified");
  assert.match(result.emergencyContact, /TEST-CONTACT-NOT-FOR-PUBLIC-USE/);
});
