import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const directory = new URL("../features/caregiver/", import.meta.url);
const [experience, orientation, map, boundary, network, styles] = await Promise.all(
  [
    "components/modules/module-5/module-5-experience.tsx",
    "components/modules/module-5/module-5-orientation.tsx",
    "components/modules/module-5/responsibility-map.tsx",
    "components/modules/module-5/boundary-rehearsal.tsx",
    "components/modules/module-5/support-network-map.tsx",
    "styles/caregiver-module-5.module.css",
  ].map((name) => readFile(new URL(name, directory), "utf8")),
);
test("Module 5 exposes landmarks, heading focus, native groups, and reduced motion", () => {
  assert.match(experience, /<main/);
  assert.match(orientation, /tabIndex=\{-1\}/);
  assert.match(map, /<select/);
  assert.match(boundary, /<fieldset/);
  assert.match(network, /<select/);
  assert.match(styles, /focus-visible/);
  assert.match(styles, /prefers-reduced-motion/);
  assert.match(styles, /@media \(max-width: 48rem\)/);
});
