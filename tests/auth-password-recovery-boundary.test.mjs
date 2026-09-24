import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("the recovery callback marks its temporary session", async () => {
  const [callback, recovery] = await Promise.all([
    readSource("../app/auth/callback/route.ts"),
    readSource("../lib/auth/password-recovery.ts"),
  ]);

  assert.match(callback, /if \(isRecovery\)[\s\S]*PASSWORD_RECOVERY_SESSION_COOKIE/);
  assert.match(callback, /httpOnly: true/);
  assert.match(callback, /sameSite: "lax"/);
  assert.match(recovery, /PASSWORD_RECOVERY_SESSION_MAX_AGE_SECONDS = 60 \* 60/);
});

test("the reset page and action both require a marked recovery session", async () => {
  const [page, actions] = await Promise.all([
    readSource("../app/(auth)/reset-password/page.tsx"),
    readSource("../features/auth/actions/auth.actions.ts"),
  ]);

  assert.match(page, /cookieStore\.has\(PASSWORD_RECOVERY_SESSION_COOKIE\)/);
  assert.match(actions, /cookieStore\.has\(PASSWORD_RECOVERY_SESSION_COOKIE\)/);
  assert.match(actions, /cookieStore\.delete\(PASSWORD_RECOVERY_SESSION_COOKIE\)/);
});

test("leaving password recovery clears both the marker and Supabase session", async () => {
  const [entrypoint, middleware] = await Promise.all([
    readSource("../middleware.ts"),
    readSource("../services/supabase/middleware.ts"),
  ]);

  assert.match(entrypoint, /"\/forgot-password"/);
  assert.match(
    middleware,
    /request\.cookies\.has\(PASSWORD_RECOVERY_SESSION_COOKIE\)[\s\S]*request\.nextUrl\.pathname !== RESET_PASSWORD_PATH/,
  );
  assert.match(middleware, /supabase\.auth\.signOut\(\{ scope: "local" \}\)/);
  assert.match(middleware, /isSupabaseAuthSessionCookieName\(cookie\.name\)/);
  assert.match(middleware, /response\.cookies\.delete\(PASSWORD_RECOVERY_SESSION_COOKIE\)/);
  assert.match(
    middleware,
    /request\.nextUrl\.pathname === "\/forgot-password" && request\.method === "POST"/,
  );
});
