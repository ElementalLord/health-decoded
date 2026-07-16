"use server";

import type { AuthError } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getSafeRedirectPath, DEFAULT_AUTHENTICATED_DESTINATION } from "@/lib/auth/redirects";
import { getServerDatabaseClient } from "@/lib/database/server";
import { createServerLogger } from "@/lib/logging/server";
import {
  forgotPasswordSchema,
  loginSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  signupSchema,
} from "@/features/auth/schemas/auth.schemas";
import type { AuthFormState } from "@/features/auth/types/auth-form";

const logger = createServerLogger();

function failure(message: string): AuthFormState {
  return { status: "error", message };
}

function values(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

function validHttpOrigin(value: string | null): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    return (url.protocol === "http:" || url.protocol === "https:") &&
      !url.username &&
      !url.password &&
      url.pathname === "/" &&
      !url.search &&
      !url.hash
      ? url.origin
      : null;
  } catch {
    return null;
  }
}

function logAuthError(event: string, error: AuthError) {
  logger.error(event, { error_code: error.code ?? "unknown", status: error.status });
}

function authFailureMessage(error: AuthError, fallback: string) {
  if (error.status === 429) return "Too many attempts. Please wait a moment and try again.";
  if (typeof error.status === "number" && error.status >= 500) {
    return "The account service is temporarily unavailable. Please try again in a moment.";
  }
  return fallback;
}

async function callbackUrl(path: string): Promise<string> {
  const requestHeaders = await headers();
  const requestOrigin = validHttpOrigin(requestHeaders.get("origin"));
  if (requestOrigin) return new URL(path, requestOrigin).toString();

  const forwardedHost = requestHeaders.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost ?? requestHeaders.get("host");
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol =
    forwardedProtocol === "http" || forwardedProtocol === "https"
      ? forwardedProtocol
      : process.env.NODE_ENV === "production"
        ? "https"
        : "http";
  const forwardedOrigin = validHttpOrigin(host ? `${protocol}://${host}` : null);
  if (forwardedOrigin) return new URL(path, forwardedOrigin).toString();

  logger.error("auth.callback_origin_unavailable");
  return new URL(path, "http://localhost:3000").toString();
}

export async function signupAction(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = signupSchema.safeParse(values(formData));
  if (!parsed.success) return failure(parsed.error.issues[0]?.message ?? "Check your information.");

  const database = await getServerDatabaseClient();
  const { data, error } = await database.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { emailRedirectTo: await callbackUrl("/auth/callback") },
  });

  if (error) {
    logAuthError("auth.signup_failed", error);
    return failure(
      authFailureMessage(error, "We could not create your account. Please try again."),
    );
  }
  redirect(data.session ? DEFAULT_AUTHENTICATED_DESTINATION : "/verify-email");
}

export async function loginAction(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse(values(formData));
  if (!parsed.success) return failure(parsed.error.issues[0]?.message ?? "Check your information.");

  const database = await getServerDatabaseClient();
  const { error } = await database.auth.signInWithPassword(parsed.data);
  if (error) {
    logAuthError("auth.login_failed", error);
    return failure(
      authFailureMessage(
        error,
        "We could not sign you in with those details. Check your information and try again.",
      ),
    );
  }

  redirect(getSafeRedirectPath(formData.get("next")?.toString()));
}

export async function forgotPasswordAction(
  _: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = forgotPasswordSchema.safeParse(values(formData));
  if (!parsed.success)
    return failure(parsed.error.issues[0]?.message ?? "Enter a valid email address.");

  const database = await getServerDatabaseClient();
  const { error } = await database.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: await callbackUrl("/auth/callback?next=/reset-password"),
  });
  if (error) logAuthError("auth.password_reset_request_failed", error);

  return {
    status: "success",
    message: "If an account exists for that email, password reset instructions will be sent.",
  };
}

export async function resendVerificationAction(
  _: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = resendVerificationSchema.safeParse(values(formData));
  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Enter a valid email address.");
  }

  const database = await getServerDatabaseClient();
  const { error } = await database.auth.resend({
    type: "signup",
    email: parsed.data.email,
    options: { emailRedirectTo: await callbackUrl("/auth/callback") },
  });
  if (error) logAuthError("auth.verification_resend_failed", error);

  return {
    status: "success",
    message: "If that account is waiting for verification, a new link will be sent.",
  };
}

export async function resetPasswordAction(
  _: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = resetPasswordSchema.safeParse(values(formData));
  if (!parsed.success) return failure(parsed.error.issues[0]?.message ?? "Check your information.");

  const database = await getServerDatabaseClient();
  const { error } = await database.auth.updateUser({ password: parsed.data.password });
  if (error) {
    logAuthError("auth.password_reset_failed", error);
    return failure(
      authFailureMessage(
        error,
        "Your reset link may be invalid or expired. Please request a new one.",
      ),
    );
  }

  const signOutResult = await database.auth.signOut({ scope: "local" });
  if (signOutResult.error) logAuthError("auth.password_reset_signout_failed", signOutResult.error);
  redirect("/login?passwordReset=1");
}

export async function logoutAction(): Promise<void> {
  const database = await getServerDatabaseClient();
  const { error } = await database.auth.signOut({ scope: "local" });
  if (error) logAuthError("auth.logout_failed", error);
  redirect("/login");
}
