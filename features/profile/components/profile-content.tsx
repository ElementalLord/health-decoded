"use client";

import Link from "next/link";
import { useActionState } from "react";

import { PageHeader } from "@/components/shared/page-header";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logoutAction } from "@/features/auth/actions/auth.actions";
import {
  updateDisplayNameAction,
  type ProfileActionState,
} from "@/features/profile/actions/profile-settings.actions";
import type { ProfileSettings } from "@/features/profile/types/profile-settings";
import { cn } from "@/lib/utils";

const initialState: ProfileActionState = { status: "idle", message: "" };

export function ProfileContent({ data }: { data: ProfileSettings }) {
  const [state, action, pending] = useActionState(updateDisplayNameAction, initialState);
  const hasError = state.status === "error";

  return (
    <section className="mx-auto max-w-3xl space-y-12 py-6 sm:py-10">
      <PageHeader description="Your account details and privacy at a glance." title="Profile" />

      <section aria-labelledby="profile-information" className="space-y-6">
        <div className="space-y-1.5">
          <h2
            className="font-serif-display text-[length:var(--text-section-title)] font-medium tracking-tight"
            id="profile-information"
          >
            Your information
          </h2>
          <p className="text-pretty text-sm leading-6 text-muted-foreground">
            Your email is verified through your account and cannot be changed here.
          </p>
        </div>

        <form action={action} className="max-w-xl space-y-4">
          <label className="grid gap-2 text-sm font-medium" htmlFor="profile-display-name">
            Display name
            <Input
              aria-describedby={state.message ? "profile-form-message" : undefined}
              aria-invalid={hasError || undefined}
              defaultValue={data.displayName}
              id="profile-display-name"
              name="displayName"
              required
            />
          </label>
          <Button disabled={pending} fullWidth={false}>
            {pending ? "Saving…" : "Save name"}
          </Button>
          {state.message ? (
            <p
              aria-live="polite"
              className={hasError ? "text-sm text-destructive" : "text-sm text-success"}
              id="profile-form-message"
              role={hasError ? "alert" : "status"}
            >
              {state.message}
            </p>
          ) : null}
        </form>

        <dl className="max-w-xl divide-y divide-border border-y border-border">
          <div className="grid gap-1 py-3.5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4">
            <dt className="text-sm text-muted-foreground">Email</dt>
            <dd className="break-words">{data.email}</dd>
          </div>
          <div className="grid gap-1 py-3.5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4">
            <dt className="text-sm text-muted-foreground">Onboarding</dt>
            <dd>{data.onboardingComplete ? "Complete" : "Not complete"}</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="profile-privacy" className="space-y-4 border-t border-border pt-10">
        <h2
          className="font-serif-display text-[length:var(--text-section-title)] font-medium tracking-tight"
          id="profile-privacy"
        >
          Privacy
        </h2>
        <p className="max-w-2xl text-pretty leading-7 text-muted-foreground">
          Health Decoded stores your profile and private educational progress. Reflections and
          future AI conversations are private. Your information is not public and is not shared with
          caregivers.
        </p>
      </section>

      <section aria-labelledby="account-actions" className="space-y-6 border-t border-border pt-10">
        <h2
          className="font-serif-display text-[length:var(--text-section-title)] font-medium tracking-tight"
          id="account-actions"
        >
          Account
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            className={cn(buttonVariants({ fullWidth: false, variant: "secondary" }), "min-h-12 px-6")}
            href="/settings"
          >
            Open settings
          </Link>
          <form action={logoutAction}>
            <Button fullWidth={false} variant="secondary">
              Sign out
            </Button>
          </form>
        </div>
        <div className="space-y-2 border-t border-border pt-5">
          <h3 className="font-medium">Account deletion</h3>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Account deletion is not available in this prototype. No data will be deleted from this
            screen.
          </p>
          <p className="text-sm font-medium text-muted-foreground">Unavailable in this prototype</p>
        </div>
      </section>
    </section>
  );
}
