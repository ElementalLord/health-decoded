import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  draftCaregiverRegionFixture,
  expiredCaregiverRegionFixture,
  unavailableCaregiverRegionFixture,
  verifiedTestOnlyCaregiverRegionFixture,
} from "../features/caregiver/regional/caregiver-region-fixtures.ts";
import {
  resolveCaregiverRegionalPresentation,
  // @ts-expect-error -- Node's built-in TypeScript test runner requires an explicit extension.
} from "../features/caregiver/regional/caregiver-region-provider.ts";

const routeSource = await readFile(
  new URL("../app/(public)/caregiver/urgent-help/page.tsx", import.meta.url),
  "utf8",
);
const urgentComponentSource = await readFile(
  new URL(
    "../features/caregiver/components/safety/caregiver-urgent-help-page.tsx",
    import.meta.url,
  ),
  "utf8",
);
const publicLayoutSource = await readFile(
  new URL("../app/(public)/layout.tsx", import.meta.url),
  "utf8",
);
const middlewareSource = await readFile(
  new URL("../services/supabase/middleware.ts", import.meta.url),
  "utf8",
);

test("urgent-help route is public, SSR-readable, and requests no authentication or health data", () => {
  assert.match(routeSource, /CaregiverUrgentHelpPage/);
  assert.doesNotMatch(routeSource, /getAuthenticatedUser|redirect|login|profile/);
  assert.doesNotMatch(publicLayoutSource, /getAuthenticatedUser|protectedApplicationRoutes/);
  assert.match(middlewareSource, /publicRoutePaths\.has\(pathname\)[\s\S]*?return false/);
  assert.match(middlewareSource, /"\/caregiver\/urgent-help"/);
  assert.match(middlewareSource, /"\/caregiver\/urgent-help\/"/);
  assert.match(middlewareSource, /"\/caregiver"/);
  assert.doesNotMatch(middlewareSource, /pathname\.startsWith\([`"']\/caregiver\/urgent-help/);
  assert.doesNotMatch(urgentComponentSource, /<form|<input|symptom|glucoseReading|useState/);
});

test("unavailable, draft, and expired regions expose only the exact fallback", () => {
  for (const fixture of [
    unavailableCaregiverRegionFixture,
    draftCaregiverRegionFixture,
    expiredCaregiverRegionFixture,
  ]) {
    const result = resolveCaregiverRegionalPresentation(fixture);
    assert.equal(result.mode, "fallback");
    assert.equal(result.contactsWithheld, true);
    assert.equal(result.emergencyContact, null);
    assert.equal(result.heading, "Local details are unavailable.");
  }
});

test("only the current verified test fixture exposes its controlled contact", () => {
  const result = resolveCaregiverRegionalPresentation(
    verifiedTestOnlyCaregiverRegionFixture,
    new Date("2098-06-01T00:00:00.000Z"),
  );
  assert.equal(result.mode, "verified");
  assert.equal(result.contactsWithheld, false);
  assert.equal(result.emergencyContact, "TEST-CONTACT-NOT-FOR-PUBLIC-USE");
});

test("urgent heading receives predictable focus without gating or progress mutation", () => {
  assert.match(urgentComponentSource, /headingRef\.current\?\.focus\(\)/);
  assert.match(urgentComponentSource, /<h1/);
  assert.match(urgentComponentSource, /tabIndex=\{-1\}/);
  assert.match(urgentComponentSource, /returnHref = "\/caregiver"/);
  assert.match(urgentComponentSource, /returnLabel = caregiverUrgentHelpContent\.sectionName/);
  assert.doesNotMatch(
    urgentComponentSource,
    /moduleCompleted|centralIdeaReached|takeawayViewed|setProgress|animation/,
  );
});
