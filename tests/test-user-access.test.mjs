import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("the homepage gives Congressional App Challenge reviewers a prominent Bob entry", async () => {
  const [home, login, component] = await Promise.all([
    read("app/(public)/page.tsx"),
    read("app/(auth)/login/page.tsx"),
    read("features/auth/components/test-user-access.tsx"),
  ]);

  assert.match(home, /<TestUserAccess next="\/journey"/);
  assert.doesNotMatch(login, /TestUserAccess/);
  assert.match(component, /Congressional App Challenge/);
  assert.match(component, /Enter as Bob with every lesson, activity, and resource unlocked/);
  assert.match(component, /text-xl[\s\S]*sm:text-2xl/);
});

test("Bob access is authenticated and restricted to the fixed test identity", async () => {
  const [action, migration, progressMapper] = await Promise.all([
    read("features/auth/actions/auth.actions.ts"),
    read("supabase/migrations/20261013000001_bob_test_access.sql"),
    read("features/progress/mappers/progress.mapper.ts"),
  ]);

  assert.match(action, /signInWithPassword/);
  assert.match(action, /database\.rpc\("enable_bob_test_access"\)/);
  assert.match(migration, /auth\.uid\(\)/);
  assert.match(migration, /bob@testing\.healthdecoded\.local/);
  assert.match(migration, /insert into public\.lesson_progress/);
  assert.match(migration, /assignment\.status = 'published'/);
  assert.match(migration, /display_name = 'Bob'/);
  assert.match(progressMapper, /progress\?\.status === "in_progress"[\s\S]*state: "available"/);
});
