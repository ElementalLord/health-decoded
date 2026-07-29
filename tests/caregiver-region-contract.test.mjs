import assert from "node:assert/strict";
import test from "node:test";

import {
  draftCaregiverRegionFixture,
  expiredCaregiverRegionFixture,
  unavailableCaregiverRegionFixture,
  verifiedTestOnlyCaregiverRegionFixture,
} from "../features/caregiver/regional/caregiver-region-fixtures.ts";
import { resolveCaregiverRegionalPresentation } from "../features/caregiver/regional/caregiver-region-provider.ts";
import { caregiverRegionConfigurationSchema } from "../features/caregiver/schemas/caregiver-region.schema.ts";

test("unavailable, draft, and expired regional data always use the safe fallback", () => {
  for (const fixture of [
    unavailableCaregiverRegionFixture,
    draftCaregiverRegionFixture,
    expiredCaregiverRegionFixture,
  ]) {
    const presentation = resolveCaregiverRegionalPresentation(fixture);
    assert.equal(presentation.mode, "fallback");
    assert.equal(presentation.contactsWithheld, true);
    assert.equal(presentation.emergencyContact, null);
    assert.equal(presentation.crisisContact, null);
    assert.match(presentation.copy, /Do not use a guessed number/);
  }
});

test("draft contacts are withheld even if internal configuration contains one", () => {
  const presentation = resolveCaregiverRegionalPresentation({
    ...draftCaregiverRegionFixture,
    emergencyServiceLabel: "Internal draft label",
    emergencyContact: "TEST-DRAFT-CONTACT",
  });

  assert.equal(presentation.mode, "fallback");
  assert.equal(presentation.emergencyServiceLabel, null);
  assert.equal(presentation.emergencyContact, null);
});

test("only current verified configuration may expose its test-only contact", () => {
  const current = resolveCaregiverRegionalPresentation(
    verifiedTestOnlyCaregiverRegionFixture,
    new Date("2098-06-01T00:00:00.000Z"),
  );
  assert.equal(current.mode, "verified");
  assert.equal(current.contactsWithheld, false);
  assert.equal(current.emergencyContact, "TEST-CONTACT-NOT-FOR-PUBLIC-USE");

  const expiredByDate = resolveCaregiverRegionalPresentation(
    verifiedTestOnlyCaregiverRegionFixture,
    new Date("2100-01-01T00:00:00.000Z"),
  );
  assert.equal(expiredByDate.mode, "fallback");
  assert.equal(expiredByDate.emergencyContact, null);
});

test("verified configuration requires review, source, contact, and expiry metadata", () => {
  assert.equal(
    caregiverRegionConfigurationSchema.safeParse({
      ...unavailableCaregiverRegionFixture,
      status: "verified",
    }).success,
    false,
  );
  assert.equal(
    caregiverRegionConfigurationSchema.safeParse(verifiedTestOnlyCaregiverRegionFixture).success,
    true,
  );
});

test("internal fixtures contain no plausible public phone number", () => {
  for (const fixture of [
    unavailableCaregiverRegionFixture,
    draftCaregiverRegionFixture,
    expiredCaregiverRegionFixture,
    verifiedTestOnlyCaregiverRegionFixture,
  ]) {
    assert.doesNotMatch(fixture.emergencyContact ?? "", /\+?\d[\d()\s-]{6,}\d/);
    assert.doesNotMatch(fixture.crisisContact ?? "", /\+?\d[\d()\s-]{6,}\d/);
  }
});
