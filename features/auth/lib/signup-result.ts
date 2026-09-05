type SignupError = {
  code?: string | undefined;
  status?: number | undefined;
};

type SignupUser = {
  identities?: readonly unknown[] | null;
} | null;

const existingAccountErrorCodes = new Set([
  "email_exists",
  "identity_already_exists",
  "user_already_exists",
]);

export function isExistingAccountError(error: SignupError): boolean {
  return typeof error.code === "string" && existingAccountErrorCodes.has(error.code);
}

/**
 * With email confirmation enabled, Supabase may hide an existing account behind a successful
 * signup response. The obscured user has no identities; a newly created email user has one.
 */
export function isObscuredExistingAccount(user: SignupUser): boolean {
  return Array.isArray(user?.identities) && user.identities.length === 0;
}

export function signupErrorMessage(error: SignupError): string {
  if (isExistingAccountError(error)) {
    return "An account already exists for this email. Sign in or reset your password.";
  }

  if (error.code === "email_address_not_authorized") {
    return "We could not send a verification email to this address. Please contact support.";
  }

  if (error.code === "over_email_send_rate_limit" || error.status === 429) {
    return "Too many verification emails have been requested. Please wait a few minutes and try again.";
  }

  if (typeof error.status === "number" && error.status >= 500) {
    return "The account service is temporarily unavailable. Please try again in a moment.";
  }

  return "We could not create your account. Please try again.";
}
