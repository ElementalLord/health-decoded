"use client";

import {
  ArrowRight,
  BookOpen,
  Check,
  ChartNoAxesColumnIncreasing,
  HeartHandshake,
  NotebookPen,
  Search,
  ScanText,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { Button } from "@/components/ui/button";
import { completeOnboardingAction } from "@/features/onboarding/actions/onboarding.actions";
import {
  initialOnboardingFormState,
  type OnboardingIntent,
  type OnboardingMode,
} from "@/features/onboarding/types/onboarding";
import { cn } from "@/lib/utils";

import styles from "./onboarding-flow.module.css";

const stepNames = ["Welcome", "Explore", "Choose a focus", "Ready"] as const;

const capabilities = [
  {
    description:
      "Follow the 14-day Journey, revisit ideas at the right time, and see your progress grow.",
    features: ["14 short lessons", "Spaced review", "Progress and milestones"],
    icon: BookOpen,
    title: "Learn step by step",
  },
  {
    description:
      "Try Myth Check, Explain It Back, Decode the Label, and stories that turn information into everyday choices.",
    features: ["Myth Check", "Explain It Back", "Decode the Label", "Interactive stories"],
    icon: Sparkles,
    title: "Practice the ideas",
  },
  {
    description:
      "Look up unfamiliar terms, browse carefully selected reading, or search across Health Decoded.",
    features: ["Medical glossary", "Curated resources", "Search"],
    icon: Search,
    title: "Find clear information",
  },
  {
    description:
      "Prepare for appointments, ask the AI guide an educational question, or learn how to support someone with care.",
    features: ["Appointment preparation", "AI guide", "Caregiver path"],
    icon: HeartHandshake,
    title: "Prepare and support",
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
  {
    action: string;
    copy: string;
    destination: string;
    eyebrow: string;
    heading: string;
    highlights: readonly string[];
    icon: typeof BookOpen;
  }
> = {
  "recently-diagnosed": {
    action: "Start the first lesson",
    copy: "The first lessons are designed to make the early information easier to understand without trying to cover everything at once.",
    destination: "/lessons/1",
    eyebrow: "Foundation lessons",
    heading: "Start with the foundation.",
    highlights: ["A short first lesson", "Plain language", "Your progress saves automatically"],
    icon: BookOpen,
  },
  "learn-basics": {
    action: "Open my Journey",
    copy: "Your Journey keeps the next useful lesson or review in one place, with practice tools nearby whenever you want to test an idea.",
    destination: "/journey",
    eyebrow: "Your learning path",
    heading: "Build the big picture first.",
    highlights: ["A clear next step", "Practice between lessons", "Progress and milestones"],
    icon: ChartNoAxesColumnIncreasing,
  },
  "support-someone": {
    action: "Explore support guidance",
    copy: "The Caregiver path uses realistic situations to help you offer useful support without taking over someone else's diabetes care.",
    destination: "/caregiver",
    eyebrow: "Support guidance",
    heading: "Start with support that respects their choices.",
    highlights: ["Five guided modules", "Everyday scenarios", "Boundaries and shared plans"],
    icon: HeartHandshake,
  },
  "prepare-appointment": {
    action: "Prepare for an appointment",
    copy: "Use the private, session-only workspace to collect questions, changes, and topics you want to discuss with a health professional.",
    destination: "/appointment-prep",
    eyebrow: "Appointment preparation",
    heading: "Get your thoughts organized.",
    highlights: [
      "Build a question list",
      "Organize conversation topics",
      "Print or save a summary",
    ],
    icon: NotebookPen,
  },
};

function Screen({ children }: { children: ReactNode }) {
  return <div className={styles.screen}>{children}</div>;
}

export function OnboardingFlow({ mode }: { mode: OnboardingMode }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [intent, setIntent] = useState<OnboardingIntent | null>(null);
  const [activeCapability, setActiveCapability] = useState(0);
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
  const capability = capabilities[activeCapability] ?? capabilities[0];

  function moveTo(nextStep: number) {
    setStep(Math.max(0, Math.min(nextStep, stepNames.length - 1)));
  }

  function moveCapabilityFocus(event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % capabilities.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + capabilities.length) % capabilities.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = capabilities.length - 1;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    setActiveCapability(nextIndex);
    event.currentTarget.parentElement
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      .item(nextIndex)
      .focus();
  }

  return (
    <section className={styles.shell} aria-label="Health Decoded introduction">
      <div className={styles.topline}>
        <div>
          <p className="editorial-eyebrow">Health Decoded</p>
          {mode === "preview" ? <span className={styles.previewBadge}>Preview</span> : null}
        </div>
        <nav aria-label="Onboarding progress" className={styles.progress}>
          <span className="sr-only">
            {stepNames[step]}, {step + 1} of {stepNames.length}
          </span>
          {stepNames.map((name, index) => (
            <button
              aria-current={index === step ? "step" : undefined}
              aria-label={`${name}, step ${index + 1} of ${stepNames.length}${index < step ? ". Go back to this step." : ""}`}
              className={cn(styles.marker, index === step && styles.currentMarker)}
              data-complete={index < step || undefined}
              disabled={index >= step}
              key={name}
              onClick={() => moveTo(index)}
              type="button"
            >
              <span aria-hidden="true" className={styles.markerDot} />
              <span className={styles.markerLabel}>{name}</span>
            </button>
          ))}
        </nav>
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
                  Follow a guided Journey, practice with interactive tools, explore real-life
                  stories, prepare for appointments, and find trusted information when you need it.
                </p>
              </div>

              <div aria-hidden="true" className={styles.ecosystem}>
                <div className={styles.ecosystemCore}>Health, decoded.</div>
                {capabilities.map(({ icon: Icon, title }, index) => (
                  <div className={styles.ecosystemItem} data-position={index + 1} key={title}>
                    <Icon />
                    <span>{title.split(" ")[0]}</span>
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
                <Button
                  disabled={pending}
                  name="completionTarget"
                  type="submit"
                  value="journey"
                  variant="text"
                >
                  {pending ? "Opening your Journey…" : "Skip to my Journey"}
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
                One app, a few useful ways in.
              </h1>
              <p className={styles.lead}>
                Choose a section to see how the updated Health Decoded experience can help. You can
                move between all of these anytime.
              </p>
            </div>

            <div className={styles.explorer}>
              <div
                aria-label="Explore Health Decoded sections"
                className={styles.capabilityTabs}
                role="tablist"
              >
                {capabilities.map(({ icon: Icon, title }, index) => (
                  <button
                    aria-controls="capability-panel"
                    aria-selected={activeCapability === index}
                    className={styles.capabilityTab}
                    data-selected={activeCapability === index || undefined}
                    id={`capability-tab-${index}`}
                    key={title}
                    onClick={() => setActiveCapability(index)}
                    onKeyDown={(event) => moveCapabilityFocus(event, index)}
                    role="tab"
                    tabIndex={activeCapability === index ? 0 : -1}
                    type="button"
                  >
                    <Icon aria-hidden="true" />
                    <span>{title}</span>
                    <ArrowRight aria-hidden="true" className={styles.tabArrow} />
                  </button>
                ))}
              </div>

              <div
                aria-labelledby={`capability-tab-${activeCapability}`}
                className={styles.capabilityPanel}
                id="capability-panel"
                role="tabpanel"
                tabIndex={0}
              >
                <div aria-hidden="true" className={styles.capabilityPanelIcon}>
                  <capability.icon />
                </div>
                <p className={styles.panelEyebrow}>Inside this section</p>
                <h2>{capability.title}</h2>
                <p>{capability.description}</p>
                <ul aria-label={`Features for ${capability.title}`} className={styles.featureList}>
                  {capability.features.map((feature) => (
                    <li key={feature}>
                      <Check aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
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
                <result.icon />
              </div>
              <div className={styles.copyColumn}>
                <p className={styles.kicker}>{result.eyebrow}</p>
                <h1 className={styles.title} ref={headingRef} tabIndex={-1}>
                  {result.heading}
                </h1>
                <p className={styles.lead}>{result.copy}</p>
                <p className={styles.recommendationNote}>
                  Based on what you chose, this is a useful place to start. Your Journey will remain
                  your home base, and every section stays available.
                </p>
                <ul className={styles.resultHighlights}>
                  {result.highlights.map((highlight) => (
                    <li key={highlight}>
                      <Check aria-hidden="true" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

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

        {state.message ? (
          <div className={styles.error} role="alert">
            <p>{state.message}</p>
            {state.status === "auth" ? <Link href="/login?next=/onboarding">Sign in</Link> : null}
          </div>
        ) : null}
      </form>
    </section>
  );
}
