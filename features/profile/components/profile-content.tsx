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

type ProfileJourneyStats = {
  completedLessons: number;
  currentDay: number;
  totalConfidenceXp: number;
};

export function ProfileContent({
  data,
  journeyStats,
}: {
  data: ProfileSettings;
  journeyStats: ProfileJourneyStats | null;
}) {
  const [state, action, pending] = useActionState(updateDisplayNameAction, initialState);
  const hasError = state.status === "error";

  return (
    <section className="mx-auto max-w-5xl space-y-14 py-6 sm:py-10">
      <div className="motion-reveal grid gap-8 border-b border-border pb-9 sm:grid-cols-[1fr_auto] sm:items-end">
        <PageHeader
          description="Your account details and privacy at a glance."
          eyebrow="Your private space"
          title="Your profile."
        />
        <div
          aria-hidden="true"
          className="flex size-24 items-center justify-center rounded-full border border-accent-warm/35 bg-[#f2e3da] font-serif-display text-4xl text-accent-warm"
        >
          {(data.displayName.trim()[0] ?? "H").toUpperCase()}
        </div>
      </div>

      {journeyStats ? (
        <section
          aria-label="Your journey at a glance"
          className="motion-cascade motion-reveal grid divide-y divide-border border-y border-border py-3 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:py-10"
        >
          {[
            [String(journeyStats.currentDay).padStart(2, "0"), "Day in"],
            [String(journeyStats.completedLessons).padStart(2, "0"), "Lessons done"],
            [String(journeyStats.totalConfidenceXp), "Confidence XP"],
          ].map(([value, label], index) => (
            <div className="min-w-0 px-1 py-5 sm:px-8 sm:py-0 sm:first:pl-0" key={label}>
              <p
                className={cn(
                  "font-serif-display text-5xl font-light leading-none sm:text-7xl",
                  index === 1
                    ? "text-success"
                    : index === 2
                      ? "text-accent-warm"
                      : "text-foreground",
                )}
              >
                {value}
              </p>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground sm:text-sm">
                {label}
              </p>
            </div>
          ))}
        </section>
      ) : null}

      <section
        aria-labelledby="profile-information"
        className="motion-reveal grid gap-8 md:grid-cols-[0.65fr_1.35fr] md:gap-14"
      >
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

        <div className="space-y-8">
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
                className={cn(
                  "motion-status text-sm",
                  hasError ? "text-destructive" : "text-success",
                )}
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
        </div>
      </section>

      <section
        aria-labelledby="profile-privacy"
        className="motion-reveal space-y-4 border-t border-border pt-10"
      >
        <h2
          className="font-serif-display text-[length:var(--text-section-title)] font-medium tracking-tight"
          id="profile-privacy"
        >
          Privacy
        </h2>
        <p className="max-w-2xl text-pretty leading-7 text-muted-foreground">
          Health Decoded stores your profile and private educational progress. AI conversations
          clear when you leave the page and are not saved to your profile. Your information is not
          public and is not shared with caregivers.
        </p>
      </section>

      <section
        aria-labelledby="account-actions"
        className="motion-reveal space-y-6 border-t border-border pt-10"
      >
        <h2
          className="font-serif-display text-[length:var(--text-section-title)] font-medium tracking-tight"
          id="account-actions"
        >
          Account
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            className={cn(
              buttonVariants({ fullWidth: false, variant: "secondary" }),
              "min-h-12 px-6",
            )}
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
      </section>
    </section>
  );
}
