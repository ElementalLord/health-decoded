import assert from "node:assert/strict";
import test from "node:test";

import {
  hasSupabaseAuthSessionCookie,
  isSupabaseAuthSessionCookieName,
  isUnauthenticatedSessionCheck,
} from "../lib/auth/supabase-session.ts";

test("anonymous requests do not invoke a Supabase user check", () => {
  assert.equal(hasSupabaseAuthSessionCookie([]), false);
  assert.equal(isUnauthenticatedSessionCheck(false, { status: 400 }), true);
});

test("a genuine session-check dependency failure remains unavailable", () => {
  assert.equal(hasSupabaseAuthSessionCookie([{ name: "sb-project-auth-token" }]), true);
  assert.equal(isUnauthenticatedSessionCheck(true, { status: 400 }), false);
  assert.equal(isUnauthenticatedSessionCheck(true, { status: 503 }), false);
});

test("session cleanup targets complete and chunked auth cookies only", () => {
  assert.equal(isSupabaseAuthSessionCookieName("sb-project-auth-token"), true);
  assert.equal(isSupabaseAuthSessionCookieName("sb-project-auth-token.0"), true);
  assert.equal(isSupabaseAuthSessionCookieName("sb-project-auth-token.12"), true);
  assert.equal(isSupabaseAuthSessionCookieName("sb-project-auth-token-code-verifier"), false);
  assert.equal(isSupabaseAuthSessionCookieName("unrelated-cookie"), false);
});

test("expired or rejected Supabase sessions remain controlled authorization failures", () => {
  assert.equal(isUnauthenticatedSessionCheck(true, { status: 401 }), true);
  assert.equal(isUnauthenticatedSessionCheck(true, { status: 403 }), true);
  assert.equal(isUnauthenticatedSessionCheck(true, null), true);
});
