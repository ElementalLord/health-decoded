import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync("app/(app)/profile/page.tsx", "utf8");
const component = readFileSync("features/profile/components/profile-content.tsx", "utf8");
const styles = readFileSync("features/profile/components/profile-content.module.css", "utf8");
const reflectionsService = readFileSync(
  "features/profile/services/profile-reflections.server.ts",
  "utf8",
);

test("profile stays distinct from Journey and Progress", () => {
  assert.doesNotMatch(page, /getProgressData/);
  assert.doesNotMatch(component, /Confidence XP|lessons done|current phase|90-day path/i);
  assert.match(component, /The lessons live in your journey/);
  assert.match(component, /Reading comfort and motion choices\s+remain in Settings/);
});

test("profile reflections are real, private records rather than invented content", () => {
  assert.match(page, /getProfileReflections/);
  assert.match(reflectionsService, /getAuthenticatedUser/);
  assert.match(reflectionsService, /\.eq\("user_id", user\.data\.id\)/);
  assert.match(reflectionsService, /\.from\("reflection_entries"\)/);
  assert.match(reflectionsService, /\{ count: "exact" \}/);
  assert.match(component, /Nothing is missing here/);
  assert.doesNotMatch(component, /fake|placeholder reflection|sample reflection/i);
});

test("the personal journal scene uses purposeful, motion-safe animation", () => {
  for (const element of ["lampGlow", "plantLeafOne", "journalRight", "bookmark"]) {
    assert.match(component, new RegExp(`styles\\.${element}`));
  }

  assert.match(styles, /profile-lamp-glow 5\.8s ease-in-out infinite/);
  assert.match(styles, /profile-leaf-sway 6\.4s ease-in-out infinite/);
  assert.match(styles, /profile-page-lift 7\.5s ease-in-out infinite/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(styles, /border-radius:\s*(?:9999px|999px)/);
});

test("the redesigned profile remains responsive and keyboard friendly", () => {
  assert.match(styles, /@media \(max-width: 56rem\)/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(component, /<summary>/);
  assert.match(component, /aria-live="polite"/);
  assert.match(component, /aria-label="Profile actions"/);
});
