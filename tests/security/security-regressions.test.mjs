import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

import { explainItBackRequestSchema } from "../../features/explain-it-back/schemas/explain-it-back.schema.ts";
import { getSafeRedirectPath } from "../../lib/auth/redirects.ts";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("internal authentication return paths remain allowed", () => {
  assert.equal(getSafeRedirectPath("/journey?welcome=1"), "/journey?welcome=1");
});

for (const value of [
  "https://evil.example",
  "//evil.example",
  "///evil.example",
  "/\\evil.example",
  "javascript:alert(1)",
  "https:%2f%2fevil.example",
]) {
  test(`external authentication redirect is rejected: ${value}`, () => {
    assert.equal(getSafeRedirectPath(value), "/journey");
  });
}

test("AI input schema rejects markup and unknown mass-assigned fields", async () => {
  const source = await read("features/ai/schemas/ai-chat.schema.ts");
  assert.match(source, /markupPattern/);
  assert.match(source, /\.strict\(\)/);
  assert.match(source, /\.max\(AI_MAX_MESSAGE_CHARACTERS\)/);
});

test("AI input schema rejects unsafe controls", async () => {
  const source = await read("features/ai/schemas/ai-chat.schema.ts");
  assert.match(source, /unsafeControlPattern/);
  assert.match(source, /refine\(isSafePlainText/);
});

test("Explain It Back rejects unknown challenge and caller-provided rubric", () => {
  const base = { challengeId: "unknown", explanation: "This explanation has enough words." };
  assert.equal(explainItBackRequestSchema.safeParse(base).success, false);
  assert.equal(
    explainItBackRequestSchema.safeParse({ ...base, challengeId: "a1c", rubric: ["attacker"] })
      .success,
    false,
  );
});

test("Explain It Back rejects forged review mode without an idempotency token", () => {
  assert.equal(
    explainItBackRequestSchema.safeParse({
      challengeId: "a1c",
      explanation: "This explanation has enough words.",
      mode: "spaced-review",
    }).success,
    false,
  );
});

test("AI output renderer has no raw HTML or arbitrary link rendering", async () => {
  const source = await read("features/ai/components/ai-response-content.tsx");
  assert.doesNotMatch(source, /dangerouslySetInnerHTML|innerHTML|href\s*=/);
  assert.match(source, /<Fragment key=/);
});

test("AI citations come from the authoritative source registry", async () => {
  const [context, sources] = await Promise.all([
    read("features/ai/services/ai-context.server.ts"),
    read("features/ai/data/credible-sources.ts"),
  ]);
  assert.match(context, /publicCredibleSources\(credibleSources\)/);
  assert.doesNotMatch(context, /provider.*href|model.*href/i);
  assert.match(sources, /https:\/\/www\.(?:niddk\.nih\.gov|cdc\.gov)/);
});

test("model endpoints authenticate before parsing or invoking providers", async () => {
  for (const [path, invocation] of [
    ["app/api/ai/chat/route.ts", "createAiChatStream("],
    ["app/api/explain-it-back/evaluate/route.ts", "evaluateExplanation({"],
  ]) {
    const source = await read(path);
    assert.ok(source.indexOf("getAuthenticatedUser()") < source.indexOf("JSON.parse"), path);
    assert.ok(source.indexOf("getAuthenticatedUser()") < source.indexOf(invocation), path);
  }
});

test("AI authentication keeps anonymous requests separate from dependency failures", async () => {
  const [route, auth] = await Promise.all([
    read("app/api/ai/chat/route.ts"),
    read("features/auth/services/auth.server.ts"),
  ]);
  assert.match(auth, /hasSupabaseAuthSessionCookie\(cookieStore\.getAll\(\)\)/);
  assert.match(auth, /if \(!hasSessionCookie\) return err\(authorizationError\(\)\)/);
  assert.match(auth, /isUnauthenticatedSessionCheck\(hasSessionCookie, error\)/);
  assert.match(route, /errorResponse\(401, "UNAUTHORIZED"/);
  assert.match(route, /errorResponse\(503, "AUTH_UNAVAILABLE"/);
});

test("model endpoints enforce same-origin JSON and bounded bodies", async () => {
  for (const path of ["app/api/ai/chat/route.ts", "app/api/explain-it-back/evaluate/route.ts"]) {
    const source = await read(path);
    assert.match(source, /hasTrustedAiRequestOrigin\(request\)/, path);
    assert.match(source, /hasJsonContentType\(request\)/, path);
    assert.match(source, /readBoundedAiRequestBody\(request/, path);
  }
});

test("private API responses disable shared caching", async () => {
  for (const path of [
    "app/api/ai/chat/route.ts",
    "app/api/explain-it-back/evaluate/route.ts",
    "app/api/search/route.ts",
  ])
    assert.match(await read(path), /no-store/, path);
});

test("server logger redacts common credential and health-text keys", async () => {
  const source = await read("lib/logging/server.ts");
  for (const key of [
    "authorization",
    "cookie",
    "health",
    "message",
    "prompt",
    "reflection",
    "secret",
    "token",
  ])
    assert.match(source, new RegExp(key));
  assert.match(source, /\[REDACTED\]/);
});

test("server secrets are isolated in server-only modules", async () => {
  const [env, provider] = await Promise.all([
    read("lib/env/server.ts"),
    read("services/ai/provider.ts"),
  ]);
  assert.match(env, /^import "server-only";/);
  assert.doesNotMatch(env, /NEXT_PUBLIC_GEMINI/);
  assert.doesNotMatch(provider, /NEXT_PUBLIC_GEMINI/);
});

test("tracked source contains no privileged Supabase credential name", async () => {
  const directories = ["app", "components", "features", "lib", "services"];
  for (const directory of directories) {
    const entries = await readdir(new URL(directory, root), {
      recursive: true,
      withFileTypes: true,
    });
    for (const entry of entries.filter(
      (value) => value.isFile() && /\.(?:ts|tsx|js|jsx)$/.test(value.name),
    )) {
      const source = await readFile(`${entry.parentPath}/${entry.name}`);
      assert.doesNotMatch(source.toString(), /SUPABASE_(?:SERVICE_ROLE|SECRET)|service_role/i);
    }
  }
});

test("all private tables are declared with RLS in migrations", async () => {
  const names = (await readdir(new URL("supabase/migrations", root))).filter((name) =>
    name.endsWith(".sql"),
  );
  const migrations = (await Promise.all(names.map((name) => read(`supabase/migrations/${name}`))))
    .join("\n")
    .toLowerCase();
  for (const table of [
    "profiles",
    "user_settings",
    "user_journeys",
    "lesson_progress",
    "activity_progress",
    "confidence_check_ins",
    "reflection_entries",
    "ai_conversations",
    "ai_messages",
    "user_milestones",
    "user_learning_streaks",
    "user_learning_activity_days",
    "user_next_step_preferences",
    "user_spaced_review_state",
  ])
    assert.match(
      migrations,
      new RegExp(`alter table public\\.${table} enable row level security`),
      table,
    );
});

test("migration-time Day 1 dependencies do not rely on the later seed phase", async () => {
  const [baseline, dependent] = await Promise.all([
    read("supabase/migrations/20260712000009_baseline_curriculum_dependencies.sql"),
    read("supabase/migrations/20260715000003_day_one_activity_and_day_two.sql"),
  ]);
  assert.match(baseline, /insert into public\.journeys/);
  assert.match(baseline, /insert into public\.lessons/);
  assert.match(baseline, /insert into public\.journey_lessons/);
  assert.match(baseline, /20000000-0000-0000-0000-000000000001/);
  assert.match(dependent, /20000000-0000-0000-0000-000000000001/);
});

test("all SECURITY DEFINER definitions use a restricted search path", async () => {
  const names = (await readdir(new URL("supabase/migrations", root))).filter((name) =>
    name.endsWith(".sql"),
  );
  const migrations = (await Promise.all(names.map((name) => read(`supabase/migrations/${name}`))))
    .join("\n")
    .toLowerCase();
  for (const block of migrations.split(/create(?: or replace)? function /).slice(1)) {
    if (block.includes("security definer")) assert.match(block, /set search_path\s*=\s*''/);
  }
});

test("authenticated-only RPCs revoke PUBLIC and anon execution", async () => {
  const migrationNames = (await readdir(new URL("supabase/migrations", root))).filter((name) =>
    name.endsWith(".sql"),
  );
  const migrations = (
    await Promise.all(migrationNames.map((name) => read(`supabase/migrations/${name}`)))
  )
    .join("\n")
    .toLowerCase();
  for (const rpc of [
    "complete_onboarding",
    "complete_current_lesson",
    "record_spaced_review_result",
  ])
    assert.match(
      migrations,
      new RegExp(`revoke all on function public\\.${rpc}[\\s\\S]*?from (?:public, anon|public)`),
      rpc,
    );
});

test("Spaced Review ownership is derived from auth.uid and early replay is denied", async () => {
  const migration = await read("supabase/migrations/20260811000001_security_hardening.sql");
  assert.match(migration, /v_user_id pg_catalog\.uuid := auth\.uid\(\)/);
  assert.match(migration, /where user_id = v_user_id and challenge_id = p_challenge_id/);
  assert.match(migration, /if v_state\.next_due_at > v_now then return false/);
  assert.match(migration, /last_result_token = p_result_token then return false/);
  assert.match(migration, /create or replace function public\.record_spaced_review_example/);
  assert.match(migration, /and next_due_at <= v_now/);
});

test("profile actions select fields explicitly and derive ownership from the session", async () => {
  const source = await read("features/profile/actions/profile-settings.actions.ts");
  assert.match(source, /getAuthenticatedUser\(\)/);
  assert.match(source, /\.update\(\{ display_name:/);
  assert.match(source, /\.eq\("id", user\.data\.id\)/);
  assert.doesNotMatch(source, /\.update\((?:body|input|Object\.fromEntries)/);
});

test("security headers deny framing and sniffing", async () => {
  const source = await read("next.config.ts");
  assert.match(source, /frame-ancestors 'none'/);
  assert.match(source, /X-Content-Type-Options/);
  assert.match(source, /Referrer-Policy/);
  assert.match(source, /Strict-Transport-Security/);
});
