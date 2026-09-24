import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("public entry points lead to sign in before registration", async () => {
  const [header, home, form] = await Promise.all([
    readSource("../components/layout/public-header.tsx"),
    readSource("../app/(public)/page.tsx"),
    readSource("../features/auth/components/auth-form.tsx"),
  ]);

  assert.match(header, /href="\/login"/);
  assert.doesNotMatch(home, /href="\/signup"/);
  assert.match(form, /Don&apos;t have an account yet\?/);
  assert.match(form, /Register here/);
});
