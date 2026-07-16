"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { CompanionIllustration } from "@/components/illustrations/editorial-illustrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProgressBar } from "@/components/ui/progress-bar";
import { completeOnboardingAction } from "@/features/onboarding/actions/onboarding.actions";
import { initialOnboardingFormState } from "@/features/onboarding/types/onboarding";
import { cn } from "@/lib/utils";

const stepLabels = ["Welcome", "Your name", "Preferences", "Finish"];
const stepTitles = [
  "Welcome to Health Decoded",
  "What would you like us to call you?",
  "Reading and motion preferences",
  "Review your setup",
];
const continueLabels = ["Start setup", "Save my name", "Review my choices"] as const;

export function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [textScale, setTextScale] = useState<"default" | "large">("default");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [timezone, setTimezone] = useState("UTC");
  const [stepError, setStepError] = useState<string | null>(null);
  const [state, action, pending] = useActionState(
    completeOnboardingAction,
    initialOnboardingFormState,
  );
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(step);

  useEffect(() => {
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
  }, []);

  useEffect(() => {
    if (previousStep.current !== step) {
      headingRef.current?.focus();
      previousStep.current = step;
    }
  }, [step]);

  function continueToNextStep() {
    if (step === 1 && !displayName.trim()) {
      setStepError("Enter the name you would like us to use.");
      return;
    }

    setStepError(null);
    setStep((currentStep) => Math.min(currentStep + 1, stepLabels.length - 1));
  }

  return (
    <section className="mx-auto max-w-2xl py-4 sm:py-8">
      <header className="space-y-4">
        <p className="text-sm font-medium text-muted-foreground">
          Step {step + 1} of {stepLabels.length}: {stepLabels[step]}
        </p>
        <ProgressBar
          label={`Onboarding progress: step ${step + 1} of ${stepLabels.length}`}
          value={((step + 1) / stepLabels.length) * 100}
        />
        <h1
          className="pt-3 font-serif-display text-3xl font-normal leading-tight text-balance sm:text-5xl"
          ref={headingRef}
          tabIndex={-1}
        >
          {stepTitles[step]}
        </h1>
      </header>

      <form action={action} className="mt-7 space-y-6 border-t border-border pt-7">
        <input name="displayName" type="hidden" value={displayName} />
        <input name="preferredTextScale" type="hidden" value={textScale} />
        <input name="reducedMotion" type="hidden" value={String(reducedMotion)} />
        <input name="locale" type="hidden" value="en" />
        <input name="timezone" type="hidden" value={timezone} />

        {step === 0 ? (
          <div className="animate-slide-up grid gap-6 sm:grid-cols-[0.8fr_1.2fr] sm:items-center">
            <CompanionIllustration />
            <div>
              <p className="text-pretty text-lg leading-8 text-muted-foreground">
                Setup takes just a minute. We will guide you gradually, one small step at a time.
              </p>
              <p className="mt-5 border-l-2 border-accent-warm pl-4 font-serif-display text-xl italic leading-8">
                No streaks. No pressure. Just gentle, daily understanding.
              </p>
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <label
            className="animate-slide-up grid gap-2 text-sm font-medium"
            htmlFor="onboarding-name"
          >
            Preferred name
            <Input
              aria-describedby={stepError ? "onboarding-name-error" : undefined}
              aria-invalid={Boolean(stepError) || undefined}
              autoComplete="name"
              id="onboarding-name"
              onChange={(event) => {
                setDisplayName(event.target.value);
                if (stepError) setStepError(null);
              }}
              required
              value={displayName}
            />
          </label>
        ) : null}

        {step === 2 ? (
          <fieldset className="animate-slide-up space-y-3">
            <legend className="mb-2 font-medium">Choose what feels comfortable</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <label
                className={cn(
                  "flex min-h-20 cursor-pointer items-center gap-3 rounded-[9px] border bg-card px-4 py-3.5 shadow-[0_2px_0_rgb(61_47_41/0.08)] transition-colors",
                  textScale === "large"
                    ? "border-accent-warm bg-accent-warm/5"
                    : "border-border hover:border-foreground/25",
                )}
              >
                <input
                  checked={textScale === "large"}
                  className="size-5 shrink-0 accent-primary"
                  onChange={(event) => setTextScale(event.target.checked ? "large" : "default")}
                  type="checkbox"
                />
                <span>
                  <span className="block font-medium">Use larger text</span>
                  <span className="mt-1 block text-sm leading-5 text-muted-foreground">
                    Increase the reading size throughout the app.
                  </span>
                </span>
              </label>
              <label
                className={cn(
                  "flex min-h-20 cursor-pointer items-center gap-3 rounded-[9px] border bg-card px-4 py-3.5 shadow-[0_2px_0_rgb(61_47_41/0.08)] transition-colors",
                  reducedMotion
                    ? "border-accent-warm bg-accent-warm/5"
                    : "border-border hover:border-foreground/25",
                )}
              >
                <input
                  checked={reducedMotion}
                  className="size-5 shrink-0 accent-primary"
                  onChange={(event) => setReducedMotion(event.target.checked)}
                  type="checkbox"
                />
                <span>
                  <span className="block font-medium">Reduce motion</span>
                  <span className="mt-1 block text-sm leading-5 text-muted-foreground">
                    Keep learning animations calm and still.
                  </span>
                </span>
              </label>
            </div>
          </fieldset>
        ) : null}

        {step === 3 ? (
          <dl className="animate-slide-up divide-y divide-border border-y border-border">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 py-3.5">
              <dt className="text-sm text-muted-foreground">Name</dt>
              <dd>{displayName || "Not provided"}</dd>
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 py-3.5">
              <dt className="text-sm text-muted-foreground">Text</dt>
              <dd>{textScale === "large" ? "Larger" : "Standard"}</dd>
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 py-3.5">
              <dt className="text-sm text-muted-foreground">Motion</dt>
              <dd>{reducedMotion ? "Reduced" : "Standard"}</dd>
            </div>
          </dl>
        ) : null}

        {stepError ? (
          <p
            className="motion-status text-sm text-destructive"
            id="onboarding-name-error"
            role="alert"
          >
            {stepError}
          </p>
        ) : null}
        {state.message ? (
          <p aria-live="polite" className="motion-status text-sm text-destructive" role="alert">
            {state.message}
          </p>
        ) : null}

        <div className="flex flex-col items-start gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          {step > 0 ? (
            <Button
              fullWidth={false}
              onClick={() => {
                setStepError(null);
                setStep((currentStep) => currentStep - 1);
              }}
              type="button"
              variant="text"
            >
              Back
            </Button>
          ) : null}
          {step < stepLabels.length - 1 ? (
            <Button
              className={step === 0 ? "sm:ml-auto" : undefined}
              onClick={continueToNextStep}
              type="button"
            >
              {continueLabels[step]}
            </Button>
          ) : (
            <Button disabled={pending} type="submit">
              {pending ? "Saving…" : "Finish setup"}
            </Button>
          )}
        </div>
      </form>
    </section>
  );
}
