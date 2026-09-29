import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(
  new URL(
    "../features/caregiver/components/modules/module-1/module-1-experience.tsx",
    import.meta.url,
  ),
  "utf8",
);

test("Module 1 completion offers implemented exits and a review path", () => {
  assert.match(source, /caregiverModuleRegistry\["support-without-taking-over"\]\.route/);
  assert.match(source, /href="\/caregiver"/);
  assert.match(source, /Review fact or guess/);
  assert.match(source, /function restart\(\)/);
});
