import assert from "node:assert/strict";
import test from "node:test";

import {
  isExistingAccountError,
  isObscuredExistingAccount,
  signupErrorMessage,
} from "../features/auth/lib/signup-result.ts";
import { signupSchema } from "../features/auth/schemas/auth.schemas.ts";

test("a Supabase obscured duplicate is not treated as a new account", () => {
  assert.equal(isObscuredExistingAccount({ identities: [] }), true);
  assert.equal(isObscuredExistingAccount({ identities: [{ provider: "email" }] }), false);
  assert.equal(isObscuredExistingAccount({}), false);
  assert.equal(isObscuredExistingAccount(null), false);
});

test("all documented duplicate-account errors are recognized", () => {
  for (const code of ["email_exists", "identity_already_exists", "user_already_exists"]) {
    assert.equal(isExistingAccountError({ code }), true, code);
    assert.match(signupErrorMessage({ code }), /already exists/i);
  }
});

test("email delivery failures give useful, safe guidance", () => {
  assert.match(signupErrorMessage({ code: "email_address_not_authorized" }), /contact support/i);
  assert.match(signupErrorMessage({ code: "over_email_send_rate_limit", status: 429 }), /wait/i);
  assert.match(signupErrorMessage({ status: 503 }), /temporarily unavailable/i);
  assert.doesNotMatch(signupErrorMessage({ code: "unexpected_failure" }), /unexpected_failure/);
});

test("new accounts require a minimum of eight password characters", () => {
  const account = {
    email: "learner@example.com",
    legalAcceptance: "on",
  };

  assert.equal(
    signupSchema.safeParse({
      ...account,
      password: "12345678",
      passwordConfirmation: "12345678",
    }).success,
    true,
  );
  assert.equal(
    signupSchema.safeParse({
      ...account,
      password: "1234567",
      passwordConfirmation: "1234567",
    }).success,
    false,
  );
});
