"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AuthFormState } from "@/features/auth/types/auth-form";

type AuthAction = (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
type Mode = "forgot-password" | "login" | "resend-verification" | "reset-password" | "signup";

export function AuthForm({
  action,
  mode,
  next,
}: {
  action: AuthAction;
  mode: Mode;
  next?: string;
}) {
  const [state, formAction, pending] = useActionState(action, { status: "idle", message: null });
  const needsEmail =
    mode === "login" ||
    mode === "signup" ||
    mode === "forgot-password" ||
    mode === "resend-verification";
  const needsPassword = mode === "login" || mode === "signup" || mode === "reset-password";
  const needsConfirmation = mode === "signup" || mode === "reset-password";
  const submitLabel =
    mode === "login"
      ? "Sign in"
      : mode === "signup"
        ? "Create account"
        : mode === "forgot-password"
          ? "Send reset instructions"
          : mode === "resend-verification"
            ? "Send a new verification link"
            : "Set new password";
  const pendingLabel =
    mode === "login"
      ? "Signing in…"
      : mode === "signup"
        ? "Creating account…"
        : mode === "forgot-password"
          ? "Sending instructions…"
          : mode === "resend-verification"
            ? "Sending verification link…"
            : "Updating password…";
  const messageId = `${mode}-form-message`;
  const passwordHelpId = `${mode}-password-help`;
  const hasError = state.status === "error";

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {next ? <input name="next" type="hidden" value={next} /> : null}
      {needsEmail ? (
        <label className="grid gap-2 text-sm font-medium" htmlFor={`${mode}-email`}>
          Email
          <Input
            aria-describedby={state.message ? messageId : undefined}
            aria-invalid={hasError || undefined}
            autoComplete="email"
            id={`${mode}-email`}
            name="email"
            required
            type="email"
          />
        </label>
      ) : null}
      {needsPassword ? (
        <label className="grid gap-2 text-sm font-medium" htmlFor={`${mode}-password`}>
          {mode === "reset-password" ? "New password" : "Password"}
          <Input
            aria-describedby={
              mode === "signup" || mode === "reset-password"
                ? `${passwordHelpId}${state.message ? ` ${messageId}` : ""}`
                : state.message
                  ? messageId
                  : undefined
            }
            aria-invalid={hasError || undefined}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            id={`${mode}-password`}
            name="password"
            required
            type="password"
          />
          {mode === "signup" || mode === "reset-password" ? (
            <span
              className="text-xs font-normal leading-5 text-muted-foreground"
              id={passwordHelpId}
            >
              Use at least 12 characters.
            </span>
          ) : null}
        </label>
      ) : null}
      {needsConfirmation ? (
        <label className="grid gap-2 text-sm font-medium" htmlFor={`${mode}-confirmation`}>
          Confirm password
          <Input
            aria-describedby={state.message ? messageId : undefined}
            aria-invalid={hasError || undefined}
            autoComplete="new-password"
            id={`${mode}-confirmation`}
            name="passwordConfirmation"
            required
            type="password"
          />
        </label>
      ) : null}
      {state.message ? (
        <p
          aria-live="polite"
          className={
            hasError
              ? "motion-status text-sm text-destructive"
              : "motion-status text-sm text-success"
          }
          id={messageId}
          role={hasError ? "alert" : "status"}
        >
          {state.message}
        </p>
      ) : null}
      <Button disabled={pending} type="submit">
        {pending ? pendingLabel : submitLabel}
      </Button>
      {mode === "login" ? (
        <p className="text-sm text-muted-foreground">
          <Link className="text-primary underline" href="/forgot-password">
            Forgot password?
          </Link>{" "}
          ·{" "}
          <Link className="text-primary underline" href="/signup">
            Create an account
          </Link>
        </p>
      ) : null}
      {mode === "signup" ? (
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link className="text-primary underline" href="/login">
            Sign in
          </Link>
        </p>
      ) : null}
      {mode === "forgot-password" ? (
        <p className="text-sm text-muted-foreground">
          Remembered your password?{" "}
          <Link className="text-primary underline" href="/login">
            Return to sign in
          </Link>
        </p>
      ) : null}
      {mode === "resend-verification" ? (
        <p className="text-sm text-muted-foreground">
          Already verified your email?{" "}
          <Link className="text-primary underline" href="/login">
            Sign in
          </Link>
        </p>
      ) : null}
      {mode === "reset-password" ? (
        <p className="text-sm text-muted-foreground">
          Is this reset link no longer working?{" "}
          <Link className="text-primary underline" href="/forgot-password">
            Request another link
          </Link>
        </p>
      ) : null}
    </form>
  );
}
