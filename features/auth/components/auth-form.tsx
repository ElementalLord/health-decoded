"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AuthFormState } from "@/features/auth/types/auth-form";

type AuthAction = (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
type Mode = "forgot-password" | "login" | "reset-password" | "signup";

export function AuthForm({ action, mode, next }: { action: AuthAction; mode: Mode; next?: string }) {
  const [state, formAction, pending] = useActionState(action, { status: "idle", message: null });
  const needsEmail = mode === "login" || mode === "signup" || mode === "forgot-password";
  const needsPassword = mode === "login" || mode === "signup" || mode === "reset-password";
  const needsConfirmation = mode === "signup" || mode === "reset-password";
  const submitLabel = mode === "login" ? "Sign in" : mode === "signup" ? "Create account" : mode === "forgot-password" ? "Send reset instructions" : "Set new password";

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {next ? <input name="next" type="hidden" value={next} /> : null}
      {needsEmail ? <label className="grid gap-2 text-sm font-medium">Email<Input autoComplete="email" name="email" required type="email" /></label> : null}
      {needsPassword ? <label className="grid gap-2 text-sm font-medium">{mode === "reset-password" ? "New password" : "Password"}<Input autoComplete={mode === "login" ? "current-password" : "new-password"} name="password" required type="password" /></label> : null}
      {needsConfirmation ? <label className="grid gap-2 text-sm font-medium">Confirm password<Input autoComplete="new-password" name="passwordConfirmation" required type="password" /></label> : null}
      {state.message ? <p aria-live="polite" className={state.status === "error" ? "text-sm text-destructive" : "text-sm text-success"}>{state.message}</p> : null}
      <Button disabled={pending} type="submit">{pending ? "Please wait…" : submitLabel}</Button>
      {mode === "login" ? <p className="text-sm text-muted-foreground"><Link className="text-primary underline" href="/forgot-password">Forgot password?</Link> · <Link className="text-primary underline" href="/signup">Create an account</Link></p> : null}
      {mode === "signup" ? <p className="text-sm text-muted-foreground">Already have an account? <Link className="text-primary underline" href="/login">Sign in</Link></p> : null}
    </form>
  );
}
