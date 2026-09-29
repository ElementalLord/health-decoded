import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const directory = new URL("../features/caregiver/", import.meta.url);
const [experience, styles] = await Promise.all(
  [
    "components/modules/module-5/module-5-experience.tsx",
    "styles/caregiver-module-1-story.module.css",
  ].map((name) => readFile(new URL(name, directory), "utf8")),
);

test("Module 5 uses the accessible story reader contract", () => {
  assert.match(experience, /<main/);
  assert.match(experience, /role="progressbar"/);
  assert.match(experience, /tabIndex=\{-1\}/);
  assert.match(experience, /role="tablist"/);
  assert.match(experience, /role="radiogroup"/);
  assert.match(experience, /aria-current=/);
  assert.match(experience, /aria-live="polite"/);
  assert.match(experience, /data-required="true"/);
  assert.match(styles, /focus-visible/);
  assert.match(styles, /prefers-reduced-motion/);
  assert.match(styles, /@media \(max-width: 38rem\)/);
});

test("Module 5 uses warm scoped states instead of green selected controls", () => {
  const start = styles.indexOf("/* Module 5");
  const scope = styles.slice(start, styles.indexOf(".moduleTwo", start));
  assert.match(scope, /\.moduleFive/);
  assert.match(scope, /#f5e7df/);
  assert.match(scope, /#955842/);
  assert.doesNotMatch(scope, /#47695e|#3d6055|#5f817a/);
});
