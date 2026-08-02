import type { CaregiverRegionConfiguration } from "../types/caregiver-region.ts";

export const CAREGIVER_SAFE_FALLBACK_HEADING = "Local details are unavailable.";

export const CAREGIVER_SAFE_FALLBACK_COPY =
  "Health Decoded cannot verify emergency contact information for your location right now. Contact your local emergency service if someone may be in immediate danger. For an urgent concern that is not an immediate emergency, contact an appropriate healthcare professional. Do not use a guessed number or wait for this page to update.";

const foundationFixture = {
  regionId: "internal-prototype",
  displayName: "Region not selected",
  language: "en",
  emergencyServiceLabel: null,
  emergencyContact: null,
  crisisServiceLabel: null,
  crisisContact: null,
  professionalResources: [] as [],
  sourceName: null,
  sourceReference: null,
  verifiedAt: null,
  expiresAt: null,
  reviewerName: null,
  reviewerRole: null,
  fallbackHeading: CAREGIVER_SAFE_FALLBACK_HEADING,
  fallbackCopy: CAREGIVER_SAFE_FALLBACK_COPY,
};

export const unavailableCaregiverRegionFixture: CaregiverRegionConfiguration = {
  ...foundationFixture,
  status: "unavailable",
};

export const draftCaregiverRegionFixture: CaregiverRegionConfiguration = {
  ...foundationFixture,
  regionId: "internal-draft",
  displayName: "Internal draft region",
  status: "draft",
};

export const expiredCaregiverRegionFixture: CaregiverRegionConfiguration = {
  ...foundationFixture,
  regionId: "internal-expired",
  displayName: "Internal expired region",
  status: "expired",
};

export const verifiedTestOnlyCaregiverRegionFixture: CaregiverRegionConfiguration = {
  ...foundationFixture,
  regionId: "internal-verified-test",
  displayName: "Internal verified test region",
  status: "verified",
  emergencyServiceLabel: "Test-only emergency label",
  emergencyContact: "TEST-CONTACT-NOT-FOR-PUBLIC-USE",
  sourceName: "Internal contract fixture",
  sourceReference: "TEST-SOURCE-NOT-FOR-PUBLIC-USE",
  verifiedAt: "2098-01-01T00:00:00.000Z",
  expiresAt: "2099-01-01T00:00:00.000Z",
  reviewerName: "Test Reviewer",
  reviewerRole: "Automated contract fixture",
};
