"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getSafeRedirectPath, DEFAULT_AUTHENTICATED_DESTINATION } from "@/lib/auth/redirects";
import { getServerDatabaseClient } from "@/lib/database/server";
import { createServerLogger } from "@/lib/logging/server";
import { forgotPasswordSchema, loginSchema, resetPasswordSchema, signupSchema } from "@/features/auth/schemas/auth.schemas";
import type { AuthFormState } from "@/features/auth/types/auth-form";

const logger = createServerLogger();

function failure(message: string): AuthFormState {
  return { status: "error", message };
}

function values(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

async function callbackUrl(path: string): Promise<string> {
  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin") ?? "http://localhost:3000";

  return new URL(path, origin).toString();
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

  if (error) return failure("We could not create your account. Please try again.");
  redirect(data.session ? DEFAULT_AUTHENTICATED_DESTINATION : "/verify-email");
}

export async function loginAction(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse(values(formData));
  if (!parsed.success) return failure(parsed.error.issues[0]?.message ?? "Check your information.");

  const database = await getServerDatabaseClient();
  const { error } = await database.auth.signInWithPassword(parsed.data);
  if (error) return failure("We could not sign you in with those details. Check your information and try again.");

  redirect(getSafeRedirectPath(formData.get("next")?.toString()));
}

export async function forgotPasswordAction(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = forgotPasswordSchema.safeParse(values(formData));
  if (!parsed.success) return failure(parsed.error.issues[0]?.message ?? "Enter a valid email address.");

  const database = await getServerDatabaseClient();
  const { error } = await database.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: await callbackUrl("/auth/callback?next=/reset-password"),
  });
  if (error) logger.error("auth.password_reset_request_failed");

  return {
    status: "success",
    message: "If an account exists for that email, password reset instructions will be sent.",
  };
}

export async function resetPasswordAction(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = resetPasswordSchema.safeParse(values(formData));
  if (!parsed.success) return failure(parsed.error.issues[0]?.message ?? "Check your information.");

  const database = await getServerDatabaseClient();
  const { error } = await database.auth.updateUser({ password: parsed.data.password });
  if (error) return failure("Your reset link may be invalid or expired. Please request a new one.");

  redirect("/login");
}

export async function logoutAction(): Promise<void> {
  const database = await getServerDatabaseClient();
  const { error } = await database.auth.signOut();
  if (error) logger.error("auth.logout_failed");
  redirect("/login");
}
