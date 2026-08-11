"use client";

import {
  ArrowRight,
  BookOpen,
  Check,
  HeartHandshake,
  MessageCircleQuestion,
  NotebookPen,
  ScanText,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { completeOnboardingAction } from "@/features/onboarding/actions/onboarding.actions";
import {
  initialOnboardingFormState,
  type OnboardingIntent,
  type OnboardingMode,
} from "@/features/onboarding/types/onboarding";
import { cn } from "@/lib/utils";

import styles from "./onboarding-flow.module.css";

const stepNames = ["Welcome", "What you can do", "Starting point", "Your next step"] as const;

const capabilities = [
  {
    description: "Short lessons explain the foundations step by step.",
    icon: BookOpen,
    title: "Learn",
  },
  {
    description:
      "Use the glossary, Myth Check, Explain It Back, and practical activities when something is confusing.",
    icon: ScanText,
    title: "Understand",
  },
  {
    description: "Organize questions and information for a future appointment.",
    icon: NotebookPen,
    title: "Prepare",
  },
  {
    description: "Use the AI Tutor for source-backed explanations about what you're learning.",
    icon: MessageCircleQuestion,
    title: "Ask",
  },
] as const;

const intentions: Array<{
  description: string;
  icon: typeof BookOpen;
  title: string;
  value: OnboardingIntent;
}> = [
  {
    description: "Start with the first lessons and build a clear foundation.",
    icon: BookOpen,
    title: "I was recently diagnosed",
    value: "recently-diagnosed",
  },
  {
    description: "Start with the core ideas behind Type 2 diabetes.",
    icon: ScanText,
    title: "I want to understand the basics",
    value: "learn-basics",
  },
  {
    description: "Start with guidance for supporting someone without taking over.",
    icon: HeartHandshake,
    title: "I'm helping someone else",
    value: "support-someone",
  },
  {
    description: "Organize questions, changes, and things you want to discuss.",
    icon: NotebookPen,
    title: "I want to prepare for an appointment",
    value: "prepare-appointment",
  },
];

const results: Record<
  OnboardingIntent,
  { action: string; copy: string; destination: string; eyebrow: string; heading: string }
> = {
  "recently-diagnosed": {
    action: "Start the first lesson",
    copy: "The first lessons are designed to make the early information easier to understand without trying to cover everything at once.",
    destination: "/lessons/1",
    eyebrow: "Foundation lessons",
    heading: "Start with the foundation.",
  },
  "learn-basics": {
    action: "Start learning",
    copy: "Start with the core lessons, then use tools like Myth Check and Explain It Back when you want to test your understanding.",
    destination: "/journey",
    eyebrow: "Your learning path",
    heading: "Build the big picture first.",
  },
  "support-someone": {
    action: "Explore support guidance",
    copy: "Health Decoded can help you understand how to be useful without taking over someone else's diabetes care.",
    destination: "/caregiver",
    eyebrow: "Support guidance",
    heading: "Start with support that respects their choices.",
  },
  "prepare-appointment": {
    action: "Prepare for an appointment",
    copy: "Use Appointment Preparation to collect questions, changes, and things you want to bring up with a health professional.",
    destination: "/appointment-prep",
    eyebrow: "Appointment preparation",
    heading: "Get your thoughts organized.",
  },
};

function Screen({ children }: { children: ReactNode }) {
  return <div className={styles.screen}>{children}</div>;
}

export function OnboardingFlow({ mode }: { mode: OnboardingMode }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [intent, setIntent] = useState<OnboardingIntent | null>(null);
  const [state, action, pending] = useActionState(
    completeOnboardingAction,
    initialOnboardingFormState,
  );
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(step);

  useEffect(() => {
    if (previousStep.current !== step) {
      headingRef.current?.focus();
      previousStep.current = step;
    }
  }, [step]);

  const result = intent ? results[intent] : null;

  function moveTo(nextStep: number) {
    setStep(Math.max(0, Math.min(nextStep, stepNames.length - 1)));
  }

  return (
    <section className={styles.shell} aria-label="Health Decoded introduction">
      <div className={styles.topline}>
        <div>
          <p className="editorial-eyebrow">Health Decoded</p>
          {mode === "preview" ? <span className={styles.previewBadge}>Preview</span> : null}
        </div>
        <div
          aria-label={`${stepNames[step]}, ${step + 1} of ${stepNames.length}`}
          className={styles.progress}
          role="status"
        >
          <span className="sr-only">
            {stepNames[step]}, {step + 1} of {stepNames.length}
          </span>
          {stepNames.map((name, index) => (
            <span
              aria-hidden="true"
              className={cn(styles.marker, index === step && styles.currentMarker)}
              data-complete={index < step || undefined}
              key={name}
            />
          ))}
        </div>
      </div>

      <form action={action} className={styles.form}>
        <input name="onboardingIntent" type="hidden" value={intent ?? ""} />

        {step === 0 ? (
          <Screen>
            <div className={styles.welcomeGrid}>
              <div className={styles.copyColumn}>
                <p className={styles.kicker}>A clear place to begin</p>
                <h1 className={styles.title} ref={headingRef} tabIndex={-1}>
                  Welcome to Health Decoded
                </h1>
                <p className={styles.lead}>
                  Diabetes can come with a lot of new information. Health Decoded helps you make
                  sense of it one step at a time.
                </p>
                <p className={styles.supporting}>
                  Learn the basics, prepare for appointments, check confusing claims, and find clear
                  answers when you need them.
                </p>
              </div>

              <div aria-hidden="true" className={styles.ecosystem}>
                <div className={styles.ecosystemCore}>Health, decoded.</div>
                {capabilities.map(({ icon: Icon, title }, index) => (
                  <div className={styles.ecosystemItem} data-position={index + 1} key={title}>
                    <Icon />
                    <span>{title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.actions}>
              <Button onClick={() => moveTo(1)} type="button">
                Show me around <ArrowRight aria-hidden="true" className="size-4" />
              </Button>
              {mode === "preview" ? (
                <Button onClick={() => router.push("/journey")} type="button" variant="text">
                  Return to Journey
                </Button>
              ) : (
                <Button name="completionTarget" type="submit" value="journey" variant="text">
                  Skip introduction
                </Button>
              )}
            </div>
          </Screen>
        ) : null}

        {step === 1 ? (
          <Screen>
            <div className={styles.sectionHeading}>
              <p className={styles.kicker}>Here when you need it</p>
              <h1 className={styles.title} ref={headingRef} tabIndex={-1}>
                You don&apos;t have to learn everything at once.
              </h1>
              <p className={styles.lead}>
                Health Decoded gives you different ways to learn depending on what you need right
                now.
              </p>
            </div>

            <div className={styles.capabilityList}>
              {capabilities.map(({ description, icon: Icon, title }) => (
                <div className={styles.capabilityRow} key={title}>
                  <Icon aria-hidden="true" />
                  <h2>{title}</h2>
                  <p>{description}</p>
                </div>
              ))}
            </div>

            <div className={styles.actions}>
              <Button onClick={() => moveTo(2)} type="button">
                Continue <ArrowRight aria-hidden="true" className="size-4" />
              </Button>
              <Button onClick={() => moveTo(0)} type="button" variant="text">
                Back
              </Button>
            </div>
          </Screen>
        ) : null}

        {step === 2 ? (
          <Screen>
            <div className={styles.sectionHeading}>
              <p className={styles.kicker}>One simple choice</p>
              <h1 className={styles.title} ref={headingRef} tabIndex={-1}>
                What would be most useful right now?
              </h1>
              <p className={styles.lead} id="intention-help">
                This only helps Health Decoded choose where to start. You can use everything in the
                app anytime.
              </p>
            </div>

            <fieldset aria-describedby="intention-help" className={styles.choiceList}>
              <legend className="sr-only">Choose a starting preference</legend>
              {intentions.map(({ description, icon: Icon, title, value }) => {
                const selected = intent === value;
                return (
                  <label
                    className={styles.choice}
                    data-selected={selected || undefined}
                    key={value}
                  >
                    <input
                      checked={selected}
                      className="sr-only"
                      name="intent-choice"
                      onChange={() => setIntent(value)}
                      type="radio"
                      value={value}
                    />
                    <Icon aria-hidden="true" className={styles.choiceIcon} />
                    <span className={styles.choiceCopy}>
                      <span className={styles.choiceTitle}>{title}</span>
                      <span className={styles.choiceDescription}>{description}</span>
                    </span>
                    <span aria-hidden="true" className={styles.check}>
                      {selected ? <Check /> : null}
                    </span>
                    <span className="sr-only">{selected ? "Selected" : "Not selected"}</span>
                  </label>
                );
              })}
            </fieldset>

            <div className={styles.actions}>
              <Button disabled={!intent} onClick={() => moveTo(3)} type="button">
                Continue <ArrowRight aria-hidden="true" className="size-4" />
              </Button>
              <Button onClick={() => moveTo(1)} type="button" variant="text">
                Back
              </Button>
            </div>
          </Screen>
        ) : null}

        {step === 3 && result ? (
          <Screen>
            <div className={styles.resultGrid}>
              <div className={styles.resultIcon} aria-hidden="true">
                {intent === "support-someone" ? <HeartHandshake /> : <BookOpen />}
              </div>
              <div className={styles.copyColumn}>
                <p className={styles.kicker}>{result.eyebrow}</p>
                <h1 className={styles.title} ref={headingRef} tabIndex={-1}>
                  {result.heading}
                </h1>
                <p className={styles.lead}>{result.copy}</p>
                <p className={styles.recommendationNote}>
                  Based on what you chose, this is a useful place to start. You can go anywhere in
                  Health Decoded afterward.
                </p>
              </div>
            </div>

            {state.message ? (
              <p className={styles.error} role="alert">
                {state.message}
              </p>
            ) : null}

            <div className={styles.actions}>
              {mode === "preview" ? (
                <Button onClick={() => router.push(result.destination)} type="button">
                  Open this destination <ArrowRight aria-hidden="true" className="size-4" />
                </Button>
              ) : (
                <Button
                  disabled={pending}
                  name="completionTarget"
                  type="submit"
                  value="recommended"
                >
                  {pending ? "Saving your starting point…" : result.action}
                  {!pending ? <ArrowRight aria-hidden="true" className="size-4" /> : null}
                </Button>
              )}
              {mode === "preview" ? (
                <Button onClick={() => router.push("/journey")} type="button" variant="text">
                  Return to Journey
                </Button>
              ) : (
                <Button
                  disabled={pending}
                  name="completionTarget"
                  type="submit"
                  value="journey"
                  variant="text"
                >
                  Go to Journey
                </Button>
              )}
              <Button disabled={pending} onClick={() => moveTo(2)} type="button" variant="text">
                Back
              </Button>
            </div>
          </Screen>
        ) : null}
      </form>
    </section>
  );
}
