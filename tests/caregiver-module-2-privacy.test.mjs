import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const paths = [
  "../features/caregiver/content/caregiver-module-2.ts",
  "../features/caregiver/state/caregiver-session-provider.tsx",
  "../features/caregiver/components/modules/module-2/module-2-experience.tsx",
  "../features/caregiver/components/modules/module-2/intention-impact-map.tsx",
  "../features/caregiver/components/modules/module-2/support-boundary-continuum.tsx",
  "../features/caregiver/components/modules/module-2/permission-language-builder.tsx",
  "../features/caregiver/components/modules/module-2/refusal-branching-conversation.tsx",
  "../features/caregiver/components/modules/module-2/repair-sequence.tsx",
  "../features/caregiver/components/modules/module-2/module-2-knowledge-check.tsx",
  "../features/caregiver/components/modules/module-2/module-2-reflection.tsx",
];
const combined = (
  await Promise.all(paths.map((path) => readFile(new URL(path, import.meta.url), "utf8")))
).join("\n");
const provider = await readFile(
  new URL("../features/caregiver/state/caregiver-session-provider.tsx", import.meta.url),
  "utf8",
);
const reflection = await readFile(
  new URL(
    "../features/caregiver/components/modules/module-2/module-2-reflection.tsx",
    import.meta.url,
  ),
  "utf8",
);

test("Module 2 has no persistence, server submission, analytics, logs, AI, or URL state", () => {
  assert.doesNotMatch(
    combined,
    /localStorage\.|sessionStorage\.|indexedDB\.|@supabase|createClient|\bfetch\(|server action|features\/ai|console\.|useSearchParams|URLSearchParams|router\.replace/,
  );
  assert.match(provider, /useState<CaregiverSessionState>/);
  assert.match(provider, /accountPersistence: false/);
  assert.match(provider, /browserPersistence: false/);
  assert.match(provider, /serverSubmission: false/);
  assert.match(provider, /aiTutorHandoff: false/);
  assert.match(provider, /urlState: false/);
});

test("the optional reflection is session-only, skippable, and explicitly clearable", () => {
  assert.match(reflection, /data-storage="session-only"/);
  assert.match(reflection, /const nextValue = event\.currentTarget\.value/);
  assert.match(reflection, /setReflection\(nextValue\)/);
  assert.match(reflection, /skipReflection/);
  assert.match(reflection, /clearReflection/);
  assert.match(reflection, /window\.confirm\("Clear reflection\?"\)/);
  assert.match(provider, /scope: "session-only"/);
});

test("interaction answers are local component state and persistent progress stores no answers", () => {
  assert.match(combined, /useState/);
  assert.doesNotMatch(
    provider,
    /placements|firstChoice|secondChoice|assembledOffer|preferredOrder/,
  );
  assert.match(provider, /markInteractionSubmitted: \(interactionId: string\)/);
});

test("the module introduces no real regional contact or medical recommendation", () => {
  assert.doesNotMatch(combined, /\b(?:911|999|112)\b|https?:\/\/|\+?\d[\d\s().-]{7,}/);
  assert.doesNotMatch(combined, /change your medication|stop taking|increase your dose/iu);
});
