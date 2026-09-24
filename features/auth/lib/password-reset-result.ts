type PasswordResetRequestError = {
  code?: string | undefined;
  status?: number | undefined;
};

const temporaryDeliveryFailureCodes = new Set([
  "email_provider_disabled",
  "hook_timeout",
  "hook_timeout_after_retry",
  "request_timeout",
  "unexpected_failure",
]);

export function passwordResetRequestErrorMessage(error: PasswordResetRequestError): string | null {
  if (
    error.code === "over_email_send_rate_limit" ||
    error.code === "over_request_rate_limit" ||
    error.status === 429
  ) {
    return "The email limit has been reached. Please try again in up to one hour. If this keeps happening, contact support.";
  }

  if (error.code === "email_address_not_authorized") {
    return "We could not send a password reset email to this address. Please contact support.";
  }

  if (
    (typeof error.code === "string" && temporaryDeliveryFailureCodes.has(error.code)) ||
    (typeof error.status === "number" && error.status >= 500)
  ) {
    return "The account service is temporarily unavailable. Please try again in a moment.";
  }

  // Keep account-specific failures indistinguishable so this form cannot be used to discover
  // whether an email address has an account.
  return null;
}
