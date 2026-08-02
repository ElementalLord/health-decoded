import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const directory = new URL("../features/caregiver/", import.meta.url);
const [experience, orientation, sources, styles] = await Promise.all(
  [
    "components/modules/module-4/module-4-experience.tsx",
    "components/modules/module-4/module-4-orientation.tsx",
    "components/modules/module-4/guidance-source-matching.tsx",
    "styles/caregiver-module-4.module.css",
  ].map((name) => readFile(new URL(name, directory), "utf8")),
);
test("Module 4 exposes landmarks, heading focus, native controls, and reduced motion", () => {
  assert.match(experience, /<main/);
  assert.match(orientation, /tabIndex=\{-1\}/);
  assert.match(sources, /<select/);
  assert.doesNotMatch(experience, /UrgentSafetyInterruption/);
  assert.match(styles, /focus-visible/);
  assert.match(styles, /prefers-reduced-motion/);
  assert.match(styles, /@media \(max-width: 48rem\)/);
  assert.match(styles, /m4-observe[\s\S]*infinite/);
  assert.doesNotMatch(styles, /border-radius:\s*999px/);
});
