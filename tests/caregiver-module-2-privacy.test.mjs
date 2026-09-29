import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const [experience, provider] = await Promise.all([
  readFile(
    new URL("features/caregiver/components/modules/module-2/module-2-experience.tsx", root),
    "utf8",
  ),
  readFile(new URL("features/caregiver/state/caregiver-session-provider.tsx", root), "utf8"),
]);

test("the rebuilt Module 2 stores no answers, drafts, or personal reflections", () => {
  assert.doesNotMatch(
    experience,
    /localStorage|sessionStorage|indexedDB|fetch\(|useSearchParams|services\/ai|logging|textarea/,
  );
  assert.match(experience, /useState<Record<string, string>>/);
  assert.match(experience, /useState<Record<string, number>>/);
  assert.doesNotMatch(provider, /placements|assembledOffer|preferredOrder/);
});

test("only the approved milestone gates leave the session provider", () => {
  assert.match(provider, /accountPersistence: "milestone-gates-only"/);
  assert.match(provider, /browserPersistence: false/);
  assert.match(provider, /event: "caregiver_module_progressed"/);
  assert.match(provider, /centralIdeaReached: progress\.centralIdeaReached/);
  assert.match(provider, /coreApplicationCompleted: progress\.coreApplicationCompleted/);
  assert.match(provider, /takeawayViewed: progress\.takeawayViewed/);
  assert.match(provider, /aiTutorHandoff: false/);
});

test("the module introduces no contact collection or medical recommendation", () => {
  assert.doesNotMatch(experience, /\b(?:911|999|112)\b|https?:\/\/|\+?\d[\d\t ().-]{7,}/);
  assert.doesNotMatch(experience, /change your medication|stop taking|increase your dose/iu);
});
