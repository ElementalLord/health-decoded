import assert from "node:assert/strict";
import test from "node:test";

import { passwordResetRequestErrorMessage } from "../features/auth/lib/password-reset-result.ts";

test("password-reset email rate limits give retry guidance", () => {
  assert.match(
    passwordResetRequestErrorMessage({ code: "over_email_send_rate_limit", status: 429 }),
    /up to one hour/i,
  );
  assert.match(
    passwordResetRequestErrorMessage({ code: "over_request_rate_limit" }),
    /up to one hour/i,
  );
});

test("password-reset delivery outages are visible without exposing account state", () => {
  assert.match(
    passwordResetRequestErrorMessage({ code: "email_address_not_authorized", status: 400 }),
    /contact support/i,
  );
  assert.match(
    passwordResetRequestErrorMessage({ code: "unexpected_failure", status: 503 }),
    /temporarily unavailable/i,
  );
  assert.match(
    passwordResetRequestErrorMessage({ code: "email_provider_disabled", status: 400 }),
    /temporarily unavailable/i,
  );
  assert.equal(passwordResetRequestErrorMessage({ code: "user_not_found", status: 400 }), null);
});
