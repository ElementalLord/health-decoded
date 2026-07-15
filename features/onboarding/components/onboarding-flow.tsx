"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProgressBar } from "@/components/ui/progress-bar";
import { completeOnboardingAction } from "@/features/onboarding/actions/onboarding.actions";
import { initialOnboardingFormState } from "@/features/onboarding/types/onboarding";

const stepLabels = ["Welcome", "Your name", "Preferences", "Finish"];
const stepTitles = [
  "Welcome to Health Decoded",
  "What would you like us to call you?",
  "Reading and motion preferences",
  "Review your setup",
];

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
    <section className="mx-auto max-w-lg py-4 sm:py-8">
      <header className="space-y-4">
        <p className="text-sm font-medium text-muted-foreground">
          Step {step + 1} of {stepLabels.length}: {stepLabels[step]}
        </p>
        <ProgressBar
          label={`Onboarding progress: step ${step + 1} of ${stepLabels.length}`}
          value={((step + 1) / stepLabels.length) * 100}
        />
        <h1
          className="pt-2 font-serif-display text-[length:var(--text-card-title)] font-semibold tracking-tight text-balance"
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
          <p className="text-pretty leading-7 text-muted-foreground">
            Setup takes just a minute. We will guide you gradually, one small step at a time.
          </p>
        ) : null}

        {step === 1 ? (
          <label className="grid gap-2 text-sm font-medium" htmlFor="onboarding-name">
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
          <fieldset className="space-y-3">
            <legend className="mb-2 font-medium">Choose what feels comfortable</legend>
            <div className="divide-y divide-border border-y border-border">
              <label className="flex min-h-14 cursor-pointer items-center gap-3 py-3.5">
                <input
                  checked={textScale === "large"}
                  className="size-5 shrink-0 accent-primary"
                  onChange={(event) => setTextScale(event.target.checked ? "large" : "default")}
                  type="checkbox"
                />
                <span>Use larger text</span>
              </label>
              <label className="flex min-h-14 cursor-pointer items-center gap-3 py-3.5">
                <input
                  checked={reducedMotion}
                  className="size-5 shrink-0 accent-primary"
                  onChange={(event) => setReducedMotion(event.target.checked)}
                  type="checkbox"
                />
                <span>Reduce motion</span>
              </label>
            </div>
          </fieldset>
        ) : null}

        {step === 3 ? (
          <dl className="divide-y divide-border border-y border-border">
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
          <p className="text-sm text-destructive" id="onboarding-name-error" role="alert">
            {stepError}
          </p>
        ) : null}
        {state.message ? (
          <p aria-live="polite" className="text-sm text-destructive" role="alert">
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
              Continue
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
