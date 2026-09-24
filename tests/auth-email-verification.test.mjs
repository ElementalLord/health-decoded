import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("signup and resend links continue using the allowlisted auth callback", async () => {
  const actions = await readSource("../features/auth/actions/auth.actions.ts");
  const verificationCallbacks = actions.match(/callbackUrl\("\/auth\/callback"\)/g);

  assert.equal(verificationCallbacks?.length, 2);
});

test("a successful email confirmation signs out its temporary session and opens sign in", async () => {
  const callback = await readSource("../app/auth/callback/route.ts");
  const signOutIndex = callback.indexOf('supabase.auth.signOut({ scope: "local" })');
  const loginRedirectIndex = callback.indexOf("/login?emailVerified=1");

  assert.ok(signOutIndex >= 0, "verification must end the session created by Supabase");
  assert.ok(loginRedirectIndex > signOutIndex, "sign in must follow verification sign-out");
  assert.match(callback, /if \(isRecovery\)[\s\S]*NextResponse\.redirect\(new URL\(next/);
});

test("sign in displays verified-email guidance", async () => {
  const loginPage = await readSource("../app/(auth)/login/page.tsx");

  assert.match(loginPage, /emailVerified === "1"/);
  assert.match(loginPage, /Your email is verified/);
  assert.match(loginPage, /Sign in below to start your learning journey\./);
  assert.match(loginPage, /role="status"/);
});

test("the verification page gives an accurate cross-tab handoff", async () => {
  const verificationPage = await readSource("../app/(auth)/verify-email/page.tsx");

  assert.doesNotMatch(verificationPage, /SessionWatcher/);
  assert.doesNotMatch(verificationPage, /continue on its own/i);
  assert.match(verificationPage, /sign in from the page it opens/i);
});
