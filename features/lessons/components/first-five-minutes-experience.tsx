"use client";

import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Copy,
  Leaf,
  Printer,
  ShieldAlert,
  Sparkle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import { CompanionIllustration } from "@/components/illustrations/editorial-illustrations";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { ActivityRenderer } from "@/features/activities/components/activity-renderer";
import {
  revealPredictionAction,
  type PredictionReveal,
} from "@/features/lessons/actions/first-five-minutes.actions";
import { completeLessonAction } from "@/features/lessons/actions/lesson-completion.actions";
import { saveLessonPositionAction } from "@/features/lessons/actions/lesson-progress.actions";
import {
  DayOneRecapPages,
  FirstDayBag,
  QuestionEnvelope,
  SupportUmbrella,
} from "@/features/lessons/components/day-one-interactions";
import { LessonMotionFigure } from "@/features/lessons/components/lesson-motion-figure";
import { LessonStoryImage } from "@/features/lessons/components/lesson-story-image";
import type { LessonPlayerViewModel } from "@/features/lessons/types/lesson-player";
import { cn } from "@/lib/utils";

const screenCount = 16;

const firstThoughts = [
  {
    id: "next",
    label: "I keep thinking about what happens next.",
    response:
      "Uncertainty can make the future feel much larger than it is. We will focus only on the next useful thing to know.",
  },
  {
    id: "scared",
    label: "I’m scared.",
    response:
      "That makes sense. Most people do not expect a diabetes diagnosis. Fear often comes from not knowing what happens next. This experience is here to answer those first questions.",
  },
  {
    id: "unsure",
    label: "I don’t really know how I feel.",
    response:
      "Not knowing is a real response too. You do not have to name a feeling before you can take in one small idea.",
  },
  {
    id: "confused",
    label: "I’m mostly confused.",
    response:
      "A diagnosis can arrive with too many unfamiliar words at once. We will leave most of them for another day.",
  },
  {
    id: "blame",
    label: "I’m worried I caused this.",
    response:
      "Many people ask themselves that question. A diagnosis is not a verdict about effort, character, or one choice you made.",
  },
  {
    id: "processing",
    label: "I’m just trying to take it in.",
    response:
      "Taking it in is enough for now. Nothing here asks you to make a complete life plan today.",
  },
] as const;

type ThoughtId = (typeof firstThoughts)[number]["id"];

const worries = [
  {
    id: "sick",
    label: "Am I going to get really sick?",
    response:
      "That fear can make the diagnosis itself feel like an emergency. We’ll separate what needs attention now from what can wait.",
  },
  {
    id: "fault",
    label: "Did I do this to myself?",
    response: "Many people wonder that. We’ll answer it together.",
  },
  {
    id: "food",
    label: "Will I have to stop eating everything I like?",
    response:
      "Food questions matter, but you do not have to solve them in these first few minutes. Today begins with what the diagnosis means.",
  },
  {
    id: "meaning",
    label: "I don’t know what diabetes even is.",
    response:
      "That is a useful place to begin. You only need one simple idea today, and we’ll uncover it slowly.",
  },
  {
    id: "other",
    label: "Something else.",
    response:
      "There may be more on your mind than these choices can hold. You can keep that question private and still continue.",
  },
] as const;

type WorryId = (typeof worries)[number]["id"];

const glucoseCards = [
  { accent: "bg-info/35", body: "Blood carries glucose.", label: "First idea" },
  { accent: "bg-primary/8", body: "Glucose gives your body energy.", label: "Then" },
  {
    accent: "bg-warning/12",
    body: "With Type 2 diabetes, too much glucose stays in your blood.",
    label: "The main idea",
  },
  {
    accent: "bg-success/8",
    body: "You’ll learn why tomorrow. Today, just remember that one idea.",
    label: "For today",
  },
] as const;

const surpriseChoices = [
  "I didn’t know people can have no symptoms.",
  "I thought diabetes meant immediate danger.",
  "I didn’t know it wasn’t my fault.",
  "I’m still unsure.",
] as const;

const tinyActions = [
  "Write down one question for my next appointment.",
  "Confirm when my next appointment is.",
  "Save the urgent warning signs for later.",
  "Pause here and come back when I’m ready.",
] as const;

const firstDayBagItems = [
  {
    belongsToday: true,
    id: "one_idea",
    label: "One clear idea about what the diagnosis means",
  },
  {
    belongsToday: false,
    id: "perfect_food_plan",
    label: "A detailed food plan for every future meal",
  },
  {
    belongsToday: true,
    id: "one_question",
    label: "One question for my next appointment",
  },
  {
    belongsToday: false,
    id: "all_medicines",
    label: "A complete understanding of every diabetes medicine",
  },
  {
    belongsToday: true,
    id: "urgent_signs",
    label: "Knowing which serious symptoms should not wait",
  },
  {
    belongsToday: false,
    id: "whole_future",
    label: "A solution for the rest of my life",
  },
] as const;

type FirstDayBagItemId = (typeof firstDayBagItems)[number]["id"];

const followUpAnchors = [
  {
    body: "Know how to reach the team that will interpret results, discuss treatment, and explain what comes next.",
    id: "care_team",
    label: "Care-team contact",
  },
  {
    body: "Keep the date, place, and any preparation instructions together so the next visit is easier to find.",
    id: "appointment_details",
    label: "Appointment details",
  },
  {
    body: "Use one dependable place to review unfamiliar terms and capture questions before the visit.",
    id: "learning_space",
    label: "Question parking place",
  },
] as const;

type FollowUpAnchorId = (typeof followUpAnchors)[number]["id"];

const appointmentQuestions = [
  "What do my test results mean?",
  "What are the next steps for treatment?",
  "Should I monitor anything at home?",
  "What should I focus on before my next visit?",
] as const;

function TodayProgress({ screen }: { screen: number }) {
  const radius = 15;
  const circumference = 2 * Math.PI * radius;
  const progress = (screen + 1) / screenCount;

  return (
    <div
      aria-label={`Today’s experience, part ${screen + 1} of ${screenCount}`}
      aria-valuemax={screenCount}
      aria-valuemin={1}
      aria-valuenow={screen + 1}
      className="relative size-10"
      role="progressbar"
    >
      <svg aria-hidden="true" className="-rotate-90" height="40" viewBox="0 0 40 40" width="40">
        <circle className="fill-none stroke-muted" cx="20" cy="20" r={radius} strokeWidth="3" />
        <circle
          className="fill-none stroke-accent-warm transition-[stroke-dashoffset] duration-500"
          cx="20"
          cy="20"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          strokeLinecap="round"
          strokeWidth="3"
        />
      </svg>
      <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
        <Leaf className="size-3.5 text-primary" />
      </span>
    </div>
  );
}

function UnderstandingBloom({ screen }: { screen: number }) {
  const growth = screen >= 14 ? 4 : screen >= 10 ? 3 : screen >= 6 ? 2 : screen >= 3 ? 1 : 0;

  return (
    <div className="flex items-center gap-2" role="status">
      <span className="text-xs text-muted-foreground">Understanding</span>
      <div aria-label={`${growth} of 4 understanding leaves have grown`} className="flex gap-1">
        {[1, 2, 3, 4].map((leaf) => (
          <span
            aria-hidden="true"
            className={cn(
              "h-3 w-2 rotate-[-25deg] rounded-[100%_0_100%_0] border border-primary/15 bg-muted transition duration-500",
              leaf <= growth && "bg-primary/65",
            )}
            key={leaf}
          />
        ))}
      </div>
    </div>
  );
}

function ExperienceHeading({ children, eyebrow }: { children: React.ReactNode; eyebrow?: string }) {
  return (
    <div className="space-y-3">
      {eyebrow ? <p className="editorial-eyebrow">{eyebrow}</p> : null}
      <h1 className="font-serif-display text-[length:var(--text-page-title)] font-normal leading-[0.98] text-balance">
        {children}
      </h1>
    </div>
  );
}

function ArrivalIllustration() {
  return (
    <figure className="mx-auto w-full max-w-lg">
      <CompanionIllustration title="A companion standing close in a reassuring embrace" />
      <figcaption className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
        You do not have to take this in alone
      </figcaption>
    </figure>
  );
}

function SoftChoice({
  children,
  dimmed = false,
  onClick,
  selected,
}: {
  children: React.ReactNode;
  dimmed?: boolean;
  onClick: () => void;
  selected: boolean;
}) {
  return (
    <button
      aria-pressed={selected}
      className={cn(
        "flex min-h-20 w-full items-center gap-4 rounded-[9px] border bg-card px-5 py-5 text-left text-base leading-7 shadow-[0_2px_0_rgb(61_47_41/0.08)] transition duration-300 hover:-translate-y-0.5 hover:border-accent-warm",
        selected && "border-accent-warm bg-[#f6e7df] shadow-[0_3px_0_rgb(185_108_85/0.18)]",
        dimmed && "scale-[0.98] opacity-35",
      )}
      onClick={onClick}
      type="button"
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-border",
          selected && "border-success bg-success text-success-foreground",
        )}
      >
        {selected ? <Check className="size-3.5" /> : null}
      </span>
      <span>{children}</span>
    </button>
  );
}

function PredictionButton({
  children,
  onClick,
  selected,
}: {
  children: React.ReactNode;
  onClick: () => void;
  selected: boolean;
}) {
  return (
    <button
      aria-pressed={selected}
      className={cn(
        "min-h-12 rounded-[9px] border bg-card px-6 py-3 text-sm font-medium shadow-[0_2px_0_rgb(61_47_41/0.08)] transition hover:-translate-y-0.5 hover:border-accent-warm",
        selected && "border-accent-warm bg-[#f6e7df] text-foreground",
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function SafetyReference() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl bg-warning/10 p-5">
        <h3 className="font-semibold">Seek urgent medical care</h3>
        <p className="mt-2 text-sm leading-6 text-foreground/75">
          Repeated vomiting, severe abdominal pain, deep or difficult breathing, or being unable to
          keep liquids down should not wait for a routine appointment.
        </p>
      </div>
      <div className="rounded-2xl bg-accent-warm/8 p-5">
        <h3 className="font-semibold">Call emergency services now</h3>
        <p className="mt-2 text-sm leading-6 text-foreground/75">
          Severe trouble breathing, fainting, inability to wake, or severe confusion need emergency
          help now.
        </p>
      </div>
    </div>
  );
}

export function FirstFiveMinutesExperience({
  lesson: experience,
}: {
  lesson: LessonPlayerViewModel;
}) {
  const router = useRouter();
  const [screen, setScreen] = useState(0);
  const [thought, setThought] = useState<ThoughtId | null>(null);
  const [worry, setWorry] = useState<WorryId | null>(null);
  const [importantReveal, setImportantReveal] = useState(1);
  const [glucoseCard, setGlucoseCard] = useState(0);
  const [selfBlameAnswer, setSelfBlameAnswer] = useState<"yes" | "no" | null>(null);
  const [selfBlameReveal, setSelfBlameReveal] = useState<PredictionReveal | null>(null);
  const [symptomAnswer, setSymptomAnswer] = useState<"yes" | "not_sure" | "no" | null>(null);
  const [symptomReveal, setSymptomReveal] = useState<PredictionReveal | null>(null);
  const [manageabilityRevealed, setManageabilityRevealed] = useState(false);
  const [safetyPanel, setSafetyPanel] = useState<"planned" | "urgent" | null>(null);
  const [viewedSafetyPanels, setViewedSafetyPanels] = useState<Set<"planned" | "urgent">>(
    () => new Set(),
  );
  const [packedTodayItems, setPackedTodayItems] = useState<Set<FirstDayBagItemId>>(() => new Set());
  const [bagMessage, setBagMessage] = useState<string | null>(null);
  const [openedFollowUp, setOpenedFollowUp] = useState<Set<FollowUpAnchorId>>(() => new Set());
  const [appointmentQuestion, setAppointmentQuestion] = useState<
    (typeof appointmentQuestions)[number] | null
  >(null);
  const [surprise, setSurprise] = useState<(typeof surpriseChoices)[number] | null>(null);
  const [tinyAction, setTinyAction] = useState<(typeof tinyActions)[number] | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const [completedActivityIds, setCompletedActivityIds] = useState(
    () =>
      new Set(
        experience.activities
          .filter((activity) => activity.isComplete)
          .map((activity) => activity.id),
      ),
  );
  const [exitOpen, setExitOpen] = useState(false);
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const screenRef = useRef<HTMLDivElement>(null);
  const requiredActivityHeadingRef = useRef<HTMLHeadingElement>(null);
  const swipeStartX = useRef<number | null>(null);
  const storageKey = `health-decoded:first-five-minutes:${experience.lessonProgressId}`;
  const incompleteActivities = experience.activities.filter(
    (activity) => !completedActivityIds.has(activity.id),
  );

  useEffect(() => {
    if (experience.accessMode === "review") return;
    const stored = Number(window.localStorage.getItem(storageKey));
    if (Number.isInteger(stored) && stored >= 0 && stored < screenCount) setScreen(stored);
  }, [experience.accessMode, storageKey]);

  useEffect(() => {
    if (screen > 0) screenRef.current?.focus();
  }, [screen]);

  function persistedBlockForScreen(nextScreen: number) {
    const maximumBlock = Math.max(experience.blocks.length - 1, 0);
    return Math.min(maximumBlock, Math.floor((nextScreen / (screenCount - 1)) * maximumBlock));
  }

  function saveScreen(nextScreen: number) {
    if (experience.accessMode === "review") return;
    window.localStorage.setItem(storageKey, String(nextScreen));
    startTransition(async () => {
      const result = await saveLessonPositionAction({
        blockIndex: persistedBlockForScreen(nextScreen),
        lessonProgressId: experience.lessonProgressId,
      });
      setMessage(result.ok ? null : result.message);
    });
  }

  function goToScreen(nextScreen: number) {
    const normalized = Math.max(0, Math.min(screenCount - 1, nextScreen));
    setScreen(normalized);
    saveScreen(normalized);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ behavior: reducedMotion ? "auto" : "smooth", top: 0 });
  }

  async function revealSelfBlame(answer: "yes" | "no") {
    setSelfBlameAnswer(answer);
    const result = await revealPredictionAction({ answer, prediction: "self_blame" });
    if (result.ok) setSelfBlameReveal(result.data);
    else setMessage(result.message);
  }

  async function revealSymptoms(answer: "yes" | "not_sure" | "no") {
    setSymptomAnswer(answer);
    const result = await revealPredictionAction({ answer, prediction: "symptoms" });
    if (result.ok) setSymptomReveal(result.data);
    else setMessage(result.message);
  }

  function moveGlucoseCard(direction: -1 | 1) {
    setGlucoseCard((current) =>
      Math.max(0, Math.min(glucoseCards.length - 1, current + direction)),
    );
  }

  function chooseBagItem(item: (typeof firstDayBagItems)[number]) {
    if (!item.belongsToday) {
      setBagMessage("That can wait. Today does not need to carry the weight of your whole future.");
      return;
    }

    setPackedTodayItems((current) => new Set([...current, item.id]));
    setBagMessage(
      packedTodayItems.has(item.id)
        ? "That is already in your first-day bag."
        : "Yes. That is useful enough to carry today.",
    );
  }

  function openFollowUp(id: FollowUpAnchorId) {
    setOpenedFollowUp((current) => new Set([...current, id]));
  }

  function openSafetyPanel(panel: "planned" | "urgent") {
    setViewedSafetyPanels((current) => new Set([...current, panel]));
    setSafetyPanel((current) => (current === panel ? null : panel));
  }

  async function copyTinyAction() {
    if (!tinyAction) return;
    try {
      await navigator.clipboard.writeText(tinyAction);
      setCopyMessage("Copied. Your next step is ready to paste somewhere useful.");
    } catch {
      setCopyMessage("Copy did not work. You can select the text above and copy it manually.");
    }
  }

  function finishExperience() {
    if (incompleteActivities.length > 0) {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      requiredActivityHeadingRef.current?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
      requiredActivityHeadingRef.current?.focus();
      return;
    }
    if (experience.accessMode === "review") {
      router.push("/journey");
      return;
    }
    startTransition(async () => {
      const result = await completeLessonAction({ lessonProgressId: experience.lessonProgressId });
      if (!result.ok) {
        setMessage(result.message);
        return;
      }
      window.localStorage.removeItem(storageKey);
      router.push(`/journey?completed=${experience.dayNumber}`);
    });
  }

  const selectedThought = firstThoughts.find((item) => item.id === thought);
  const selectedWorry = worries.find((item) => item.id === worry);

  function canContinue() {
    if (screen === 1) return thought !== null;
    if (screen === 2) return worry !== null;
    if (screen === 3) return importantReveal >= 3;
    if (screen === 4) return glucoseCard === glucoseCards.length - 1;
    if (screen === 5) return selfBlameReveal !== null;
    if (screen === 6) return symptomReveal !== null;
    if (screen === 7) return manageabilityRevealed;
    if (screen === 8) return viewedSafetyPanels.size === 2;
    if (screen === 9) return packedTodayItems.size === 3;
    if (screen === 10) return openedFollowUp.size === followUpAnchors.length;
    if (screen === 11) return appointmentQuestion !== null;
    if (screen === 12) return surprise !== null;
    if (screen === 13) return tinyAction !== null;
    return true;
  }

  function continueRequirement() {
    if (screen === 3) return "Reveal each part of the idea before continuing.";
    if (screen === 4) return "Tap through all four cards before continuing.";
    if (screen === 8) return "Open both cards to compare what can wait with what cannot.";
    if (screen === 9) return "Place the three useful first-day ideas in your bag.";
    if (screen === 10) return "Open all three follow-up anchors.";
    if (screen === 11) return "Choose one question for your next healthcare conversation.";
    if (screen === 12) return "Choose one reflection to continue.";
    if (screen === 13) return "Choose one small next step to continue.";
    return "Choose or reveal one response to continue.";
  }

  function continueLabel() {
    const labels = [
      "Begin with one thought",
      "Name what worries me",
      "Hear the most important idea",
      "Show me what it means",
      "Check a common belief",
      "Learn about symptoms",
      "See what manageable means",
      "Know what should not wait",
      "Pack what matters today",
      "Set up the first follow-up",
      "Save one question",
      "Pause and reflect",
      "Choose one small next step",
      "Review the three truths",
      "Review first-day essentials",
    ] as const;

    return labels[screen] ?? "Continue";
  }

  function renderScreen() {
    switch (screen) {
      case 0:
        return (
          <div className="space-y-9">
            <div className="grid min-h-[520px] content-center gap-9 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <ArrivalIllustration />
              <div className="space-y-6">
                <ExperienceHeading>Let&apos;s slow down for a moment.</ExperienceHeading>
                <div className="max-w-xl space-y-3 text-lg leading-8 text-foreground/80">
                  <p>You were just told you have Type 2 diabetes.</p>
                  <p>That&apos;s a lot to hear.</p>
                  <p>You don&apos;t have to understand everything today.</p>
                  <p>We&apos;ll take this one step at a time.</p>
                </div>
              </div>
            </div>
            <LessonStoryImage
              alt="A woman writes one question in a notebook at the kitchen table while her partner sits nearby with tea"
              caption="You do not need to solve the whole diagnosis today. One question, one breath, and one next step are enough for a beginning."
              emphasis="A gentle start still counts."
              priority
              src="/lessons/day-01/gentle-beginning.jpg"
            />
            <LessonMotionFigure variant="calm-breath" />
          </div>
        );
      case 1:
        return (
          <div className="space-y-7">
            <ExperienceHeading>When people first hear this diagnosis...</ExperienceHeading>
            <p className="text-lg leading-7 text-muted-foreground">
              One of these thoughts may feel familiar.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {firstThoughts.map((item) => (
                <SoftChoice
                  dimmed={thought !== null && thought !== item.id}
                  key={item.id}
                  onClick={() => setThought(item.id)}
                  selected={thought === item.id}
                >
                  “{item.label}”
                </SoftChoice>
              ))}
            </div>
            {selectedThought ? (
              <div
                aria-live="polite"
                className="animate-slide-up rounded-3xl bg-info/35 p-6 sm:p-8"
              >
                <p className="font-serif-display text-2xl font-semibold">
                  “{selectedThought.label}”
                </p>
                <p className="mt-4 max-w-2xl leading-7 text-foreground/80">
                  {selectedThought.response}
                </p>
              </div>
            ) : null}
            <LessonMotionFigure variant="comfort-hug" />
            <p className="text-sm text-muted-foreground">
              Your choice stays on this page and is not saved.
            </p>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <div className="mx-auto flex size-28 items-center justify-center rounded-full bg-primary/7 text-primary">
              <CircleHelp className="size-11" strokeWidth={1.4} />
            </div>
            <div className="space-y-3 text-center">
              <ExperienceHeading>Can I ask you something?</ExperienceHeading>
              <p className="text-lg text-muted-foreground">What worries you the most right now?</p>
            </div>
            <div className="mx-auto grid max-w-2xl gap-3">
              {worries.map((item) => (
                <SoftChoice
                  dimmed={worry !== null && worry !== item.id}
                  key={item.id}
                  onClick={() => setWorry(item.id)}
                  selected={worry === item.id}
                >
                  {item.label}
                </SoftChoice>
              ))}
            </div>
            {selectedWorry ? (
              <div
                aria-live="polite"
                className="animate-slide-up mx-auto max-w-2xl border-l-2 border-success bg-info p-6"
              >
                <p className="font-serif-display text-2xl font-semibold">“{selectedWorry.label}”</p>
                <p className="mt-3 leading-7 text-foreground/80">{selectedWorry.response}</p>
              </div>
            ) : null}
            <p className="text-center text-sm text-muted-foreground">
              Your choice is private and is not saved.
            </p>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <ExperienceHeading>Here&apos;s the most important thing to know.</ExperienceHeading>
            <Card className="rounded-[2rem] p-7 sm:p-10">
              <div className="space-y-6 text-center font-serif-display text-2xl font-semibold leading-9 sm:text-3xl sm:leading-10">
                <p>Type 2 diabetes is serious.</p>
                {importantReveal >= 2 ? (
                  <p className="animate-slide-up text-primary">
                    It is also something millions of people learn to live with every day.
                  </p>
                ) : null}
                {importantReveal >= 3 ? (
                  <div className="animate-slide-up space-y-5 border-t border-border/60 pt-6">
                    <p>The diagnosis itself is not an emergency.</p>
                    <p className="text-lg font-normal leading-8 text-muted-foreground">
                      Right now, your job isn&apos;t to know everything. It&apos;s simply to
                      understand what this diagnosis means.
                    </p>
                  </div>
                ) : null}
              </div>
              {importantReveal < 3 ? (
                <Button
                  className="mt-8"
                  onClick={() => setImportantReveal((value) => value + 1)}
                  variant="secondary"
                >
                  Reveal the next idea
                </Button>
              ) : null}
            </Card>
          </div>
        );
      case 4: {
        const card = glucoseCards[glucoseCard]!;
        return (
          <div className="space-y-8">
            <ExperienceHeading eyebrow="Discover one idea">Tap through slowly.</ExperienceHeading>
            <div
              className="overflow-hidden"
              onTouchEnd={(event) => {
                if (swipeStartX.current === null) return;
                const distance = event.changedTouches[0]!.clientX - swipeStartX.current;
                if (Math.abs(distance) > 45) moveGlucoseCard(distance < 0 ? 1 : -1);
                swipeStartX.current = null;
              }}
              onTouchStart={(event) => {
                swipeStartX.current = event.touches[0]!.clientX;
              }}
            >
              <button
                aria-label={`${card.label}: ${card.body}. Tap to reveal the next idea.`}
                className={cn(
                  "flex min-h-[360px] w-full flex-col items-center justify-center rounded-[2rem] border border-border/60 p-8 text-center shadow-card transition sm:min-h-[420px] sm:p-12",
                  card.accent,
                )}
                onClick={() => moveGlucoseCard(1)}
                type="button"
              >
                <span className="mb-7 text-sm font-semibold uppercase tracking-[0.12em] text-primary">
                  {card.label}
                </span>
                <span className="max-w-xl font-serif-display text-3xl font-semibold leading-tight text-balance sm:text-4xl">
                  {card.body}
                </span>
                {glucoseCard < glucoseCards.length - 1 ? (
                  <span className="mt-9 text-sm text-muted-foreground">
                    Tap or swipe to reveal the next idea
                  </span>
                ) : (
                  <span className="mt-9 inline-flex items-center gap-2 text-sm font-medium text-primary">
                    <Leaf className="size-4" /> One idea is enough for today
                  </span>
                )}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <Button
                aria-label="Show previous idea"
                disabled={glucoseCard === 0}
                fullWidth={false}
                onClick={() => moveGlucoseCard(-1)}
                variant="secondary"
              >
                <ChevronLeft className="size-4" /> Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                {glucoseCard + 1} of {glucoseCards.length}
              </span>
              <Button
                aria-label="Show next idea"
                disabled={glucoseCard === glucoseCards.length - 1}
                fullWidth={false}
                onClick={() => moveGlucoseCard(1)}
                variant="secondary"
              >
                Next <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        );
      }
      case 5:
        return (
          <div className="space-y-8">
            <div className="space-y-3 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">
                What do you think?
              </p>
              <ExperienceHeading>Someone says, “Type 2 diabetes means I failed.”</ExperienceHeading>
              <p className="text-lg text-muted-foreground">Do you agree?</p>
            </div>
            <div className="mx-auto min-h-72 max-w-2xl [perspective:1000px]">
              <div
                className="relative min-h-72 w-full transition-transform duration-500 [transform-style:preserve-3d]"
                style={{ transform: selfBlameReveal ? "rotateY(180deg)" : "rotateY(0deg)" }}
              >
                <Card
                  aria-hidden={Boolean(selfBlameReveal)}
                  className="absolute inset-0 flex items-center justify-center rounded-[2rem] p-8 text-center [backface-visibility:hidden]"
                >
                  <p className="font-serif-display text-4xl font-semibold">“I failed.”</p>
                </Card>
                <Card
                  aria-live="polite"
                  className="absolute inset-0 flex rotate-y-180 flex-col items-center justify-center rounded-[2rem] bg-primary/7 p-8 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]"
                >
                  {selfBlameReveal ? (
                    <>
                      <p className="font-serif-display text-2xl font-semibold">
                        {selfBlameReveal.heading}
                      </p>
                      <p className="mt-4 max-w-xl leading-7 text-foreground/80">
                        {selfBlameReveal.body}
                      </p>
                    </>
                  ) : null}
                </Card>
              </div>
            </div>
            <div className="flex justify-center gap-3">
              <PredictionButton
                onClick={() => void revealSelfBlame("yes")}
                selected={selfBlameAnswer === "yes"}
              >
                Yes
              </PredictionButton>
              <PredictionButton
                onClick={() => void revealSelfBlame("no")}
                selected={selfBlameAnswer === "no"}
              >
                No
              </PredictionButton>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-8">
            <div className="space-y-3 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">
                Make a prediction
              </p>
              <ExperienceHeading>Do you think this is true?</ExperienceHeading>
            </div>
            <Card className="rounded-[2rem] p-8 text-center sm:p-12">
              <p className="font-serif-display text-3xl font-semibold leading-tight text-balance">
                “Most people know they have diabetes because they feel sick.”
              </p>
            </Card>
            <div className="flex flex-wrap justify-center gap-3">
              {(["yes", "not_sure", "no"] as const).map((answer) => (
                <PredictionButton
                  key={answer}
                  onClick={() => void revealSymptoms(answer)}
                  selected={symptomAnswer === answer}
                >
                  {answer === "not_sure" ? "Not sure" : answer === "yes" ? "Yes" : "No"}
                </PredictionButton>
              ))}
            </div>
            {symptomReveal ? (
              <div
                aria-live="polite"
                className="animate-slide-up rounded-3xl bg-info/35 p-6 text-center sm:p-8"
              >
                <p className="font-serif-display text-2xl font-semibold">{symptomReveal.heading}</p>
                <p className="mx-auto mt-3 max-w-xl leading-7 text-foreground/80">
                  {symptomReveal.body}
                </p>
              </div>
            ) : null}
          </div>
        );
      case 7:
        return (
          <div className="grid min-h-[500px] content-center gap-8">
            <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-success/10 text-success">
              <Leaf className="size-10" strokeWidth={1.4} />
            </div>
            <div className="space-y-5 text-center">
              <ExperienceHeading>Type 2 diabetes is manageable.</ExperienceHeading>
              <p className="mx-auto max-w-xl text-lg leading-8 text-foreground/80">
                Manageable does not mean effortless. It means care, information, and support can
                help people live with it over time.
              </p>
            </div>
            {!manageabilityRevealed ? (
              <Button
                className="mx-auto sm:w-auto"
                onClick={() => setManageabilityRevealed(true)}
                variant="secondary"
              >
                What does that mean for today?
              </Button>
            ) : (
              <p
                aria-live="polite"
                className="animate-slide-up mx-auto max-w-xl rounded-3xl bg-primary/7 p-6 text-center text-lg leading-8"
              >
                It means you do not have to fix everything now. One appointment, one question, and
                one decision can happen at a time.
              </p>
            )}
          </div>
        );
      case 8:
        return (
          <div className="space-y-8">
            <ExperienceHeading>What can wait, and what cannot?</ExperienceHeading>
            <p className="text-lg leading-8 text-muted-foreground">
              Open both cards. The difference is the useful part.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                aria-expanded={safetyPanel === "planned"}
                className={cn(
                  "rounded-[2rem] border bg-card p-6 text-left transition duration-300",
                  safetyPanel && safetyPanel !== "planned" && "opacity-40",
                  safetyPanel === "planned" && "border-primary/30 bg-primary/7",
                )}
                onClick={() => openSafetyPanel("planned")}
                type="button"
              >
                <CalendarDays className="size-7 text-primary" />
                <h2 className="mt-5 font-serif-display text-2xl font-semibold">
                  Most questions can wait for follow-up.
                </h2>
                {safetyPanel === "planned" ? (
                  <p className="animate-slide-up mt-4 leading-7 text-foreground/80">
                    Test results, medicine questions, food, movement, and home monitoring can
                    usually be discussed at a planned appointment.
                  </p>
                ) : null}
              </button>
              <button
                aria-expanded={safetyPanel === "urgent"}
                className={cn(
                  "rounded-[2rem] border border-warning/25 bg-warning/7 p-6 text-left transition duration-300",
                  safetyPanel && safetyPanel !== "urgent" && "opacity-40",
                  safetyPanel === "urgent" && "border-warning/50 bg-warning/12",
                )}
                onClick={() => openSafetyPanel("urgent")}
                type="button"
              >
                <ShieldAlert className="size-7 text-warning-foreground" />
                <h2 className="mt-5 font-serif-display text-2xl font-semibold">
                  Serious symptoms should not wait.
                </h2>
                {safetyPanel === "urgent" ? (
                  <p className="animate-slide-up mt-4 leading-7 text-foreground/80">
                    Repeated vomiting, severe abdominal pain, difficulty breathing, fainting, severe
                    confusion, or inability to keep liquids down need urgent help.
                  </p>
                ) : null}
              </button>
            </div>
            <p aria-live="polite" className="text-sm text-muted-foreground">
              {viewedSafetyPanels.size === 2
                ? "You have compared both paths: most questions can wait; serious symptoms should not."
                : `${viewedSafetyPanels.size} of 2 cards opened.`}
            </p>
            <Button fullWidth={false} onClick={() => setSafetyOpen(true)} variant="text">
              View the full urgent-warning reference
            </Button>
          </div>
        );
      case 9:
        return (
          <div className="space-y-9">
            <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <FirstDayBag packedCount={packedTodayItems.size} />
              <div className="space-y-5">
                <ExperienceHeading eyebrow="Your first-day bag">
                  Carry only what belongs to today.
                </ExperienceHeading>
                <p className="text-lg leading-8 text-muted-foreground">
                  A new diagnosis can make every future decision feel urgent. It is not. Choose the
                  three things that are genuinely useful on the first day.
                </p>
                <p className="font-serif-display text-2xl text-accent-warm">
                  {packedTodayItems.size} of 3 packed
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {firstDayBagItems.map((item) => {
                const packed = packedTodayItems.has(item.id);
                return (
                  <button
                    aria-pressed={packed}
                    className={cn(
                      "flex min-h-20 items-center gap-4 rounded-[9px] border bg-card px-5 py-4 text-left leading-7 transition hover:-translate-y-0.5 hover:border-accent-warm",
                      packed && "border-success/50 bg-success/8",
                    )}
                    key={item.id}
                    onClick={() => chooseBagItem(item)}
                    type="button"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-border",
                        packed && "border-success bg-success text-white",
                      )}
                    >
                      {packed ? <Check className="size-4" /> : null}
                    </span>
                    {item.label}
                  </button>
                );
              })}
            </div>
            {bagMessage ? (
              <p
                aria-live="polite"
                className="animate-fade-in border-l-2 border-accent-warm py-2 pl-5 text-lg leading-8 text-foreground/80"
              >
                {bagMessage}
              </p>
            ) : null}
          </div>
        );
      case 10:
        return (
          <div className="space-y-9">
            <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-5 lg:order-2">
                <ExperienceHeading eyebrow="The first follow-up">
                  Know where the next steps live.
                </ExperienceHeading>
                <p className="text-lg leading-8 text-muted-foreground">
                  Today does not require a complete care plan. These three anchors make the next
                  appointment easier to locate, prepare for, and use.
                </p>
              </div>
              <SupportUmbrella openedCount={openedFollowUp.size} />
            </div>
            <LessonStoryImage
              alt="Two women share a long supportive hug on a sunny porch after a healthcare visit"
              caption="If you want company, someone you trust can help hold the appointment details or come with you. The follow-up still belongs to you."
              emphasis="The next step can be concrete."
              src="/lessons/day-01/supported-not-alone.jpg"
            />
            <div className="grid gap-4 sm:grid-cols-3">
              {followUpAnchors.map((option) => {
                const opened = openedFollowUp.has(option.id);
                return (
                  <button
                    aria-expanded={opened}
                    className={cn(
                      "min-h-44 border-t border-border px-1 py-5 text-left transition",
                      opened && "border-success",
                    )}
                    key={option.id}
                    onClick={() => openFollowUp(option.id)}
                    type="button"
                  >
                    <span className="editorial-eyebrow text-success">
                      {opened ? "Open" : "Tap to open"}
                    </span>
                    <span className="mt-4 block font-serif-display text-2xl leading-tight">
                      {option.label}
                    </span>
                    {opened ? (
                      <span className="animate-fade-in mt-3 block text-sm leading-6 text-muted-foreground">
                        {option.body}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
            {openedFollowUp.size === followUpAnchors.length ? (
              <p
                aria-live="polite"
                className="animate-fade-in font-serif-display text-2xl italic leading-8 text-success"
              >
                You now know where to place the appointment, the contact, and the question.
              </p>
            ) : null}
          </div>
        );
      case 11:
        return (
          <div className="space-y-8">
            <div className="max-w-4xl space-y-5 [--text-page-title:clamp(3.25rem,7vw,6.75rem)]">
              <ExperienceHeading eyebrow="One question is enough">
                Put one question somewhere safe.
              </ExperienceHeading>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                You do not need a complete list. Choose the question you would most like your
                healthcare team to answer next.
              </p>
            </div>
            <div className="grid gap-7 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)] lg:items-start">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {appointmentQuestions.map((question) => (
                  <SoftChoice
                    dimmed={appointmentQuestion !== null && appointmentQuestion !== question}
                    key={question}
                    onClick={() => setAppointmentQuestion(question)}
                    selected={appointmentQuestion === question}
                  >
                    {question}
                  </SoftChoice>
                ))}
              </div>
              <div className="rounded-[1.5rem] border border-border bg-[#f4ece4] p-5 sm:p-7">
                <div className="mx-auto w-full max-w-md">
                  <QuestionEnvelope hasQuestion={appointmentQuestion !== null} />
                </div>
                <div aria-live="polite" className="border-t border-border pt-5">
                  {appointmentQuestion ? (
                    <div className="animate-fade-in">
                      <p className="editorial-eyebrow text-success">Tucked safely inside</p>
                      <p className="mt-3 font-serif-display text-2xl leading-8">
                        “{appointmentQuestion}”
                      </p>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        This question stays on this page and is not saved to your profile.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="editorial-eyebrow text-accent-warm">Envelope open</p>
                      <p className="mt-3 leading-7 text-muted-foreground">
                        Choose one question. The note will slide in and the envelope will close.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case 12:
        return (
          <div className="space-y-8 border-l-2 border-success py-3 pl-6 sm:pl-9">
            <div className="space-y-4">
              <Sparkle className="size-8 text-accent-warm" strokeWidth={1.4} />
              <ExperienceHeading eyebrow="Reflection">What surprised you most?</ExperienceHeading>
            </div>
            <div className="mx-auto grid max-w-2xl gap-3 sm:grid-cols-2">
              {surpriseChoices.map((choice) => (
                <SoftChoice
                  dimmed={surprise !== null && surprise !== choice}
                  key={choice}
                  onClick={() => setSurprise(choice)}
                  selected={surprise === choice}
                >
                  {choice}
                </SoftChoice>
              ))}
            </div>
            {surprise ? (
              <p aria-live="polite" className="animate-fade-in leading-7 text-muted-foreground">
                Reflection helps an idea settle. Your choice is private and is not saved.
              </p>
            ) : null}
          </div>
        );
      case 13:
        return (
          <div className="space-y-8">
            <div className="space-y-3 text-center">
              <Leaf className="mx-auto size-8 text-primary" strokeWidth={1.4} />
              <ExperienceHeading>Choose one small next step.</ExperienceHeading>
              <p className="text-lg text-muted-foreground">
                Not a whole plan. Just one thing that may make tomorrow clearer.
              </p>
            </div>
            <div className="mx-auto grid max-w-2xl gap-3">
              {tinyActions.map((action) => (
                <SoftChoice
                  dimmed={tinyAction !== null && tinyAction !== action}
                  key={action}
                  onClick={() => {
                    setTinyAction(action);
                    setCopyMessage(null);
                  }}
                  selected={tinyAction === action}
                >
                  {action}
                </SoftChoice>
              ))}
            </div>
            {tinyAction ? (
              <div
                aria-live="polite"
                className="animate-slide-up mx-auto max-w-2xl rounded-3xl bg-info/35 p-6"
              >
                <p className="font-medium">For later</p>
                <p className="mt-2 leading-7 text-foreground/80">{tinyAction}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button
                    fullWidth={false}
                    onClick={() => void copyTinyAction()}
                    variant="secondary"
                  >
                    <Copy className="size-4" />{" "}
                    {copyMessage?.startsWith("Copied") ? "Copied" : "Copy"}
                  </Button>
                  <Button fullWidth={false} onClick={() => window.print()} variant="secondary">
                    <Printer className="size-4" /> Print
                  </Button>
                </div>
                <p aria-live="polite" className="mt-3 min-h-5 text-sm text-muted-foreground">
                  {copyMessage ?? "Your choice stays private unless you copy or print it."}
                </p>
              </div>
            ) : null}
          </div>
        );
      case 14:
        return (
          <div className="space-y-8">
            <div className="mx-auto max-w-3xl space-y-4 text-center">
              <ExperienceHeading eyebrow="Let the important parts settle">
                Your first-day map has three anchors.
              </ExperienceHeading>
              <p className="text-lg leading-8 text-muted-foreground">
                The details can return later. These are the ideas worth carrying out of your first
                lesson.
              </p>
            </div>
            <DayOneRecapPages />
            <p className="mx-auto max-w-2xl text-center font-serif-display text-2xl italic leading-8 text-success">
              You have already done something useful: you made the diagnosis a little more
              understandable.
            </p>
          </div>
        );
      default:
        return (
          <div className="space-y-10 py-6 sm:py-10">
            <ArrivalIllustration />
            <div className="space-y-3">
              <ExperienceHeading eyebrow="First-day essentials">
                Before you leave today...
              </ExperienceHeading>
            </div>
            <div className="divide-y divide-border border-y border-border">
              {[
                "You are not expected to know everything.",
                "This diagnosis is not a judgment.",
                "You now know what can wait, and what cannot.",
              ].map((idea) => (
                <div className="flex gap-5 py-5" key={idea}>
                  <span className="mt-2 size-2 shrink-0 rounded-full bg-accent-warm" />
                  <p className="font-serif-display text-2xl font-normal leading-8">{idea}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2 border-t border-border pt-7">
              <p className="editorial-eyebrow">Tomorrow, we&apos;ll answer one question:</p>
              <p className="font-serif-display text-3xl font-normal">
                Why is glucose staying in my blood?
              </p>
            </div>
            {incompleteActivities.length > 0 ? (
              <section className="space-y-6 border-y border-warning/35 bg-warning/8 px-5 py-8 sm:px-7">
                <div className="space-y-2">
                  <p className="editorial-eyebrow text-warning-foreground">
                    Let&apos;s practice · One step before continuing
                  </p>
                  <h2
                    className="font-serif-display text-4xl font-normal leading-tight"
                    ref={requiredActivityHeadingRef}
                    tabIndex={-1}
                  >
                    {incompleteActivities.length === 1
                      ? `Complete “${incompleteActivities[0]!.title}”`
                      : "Complete the activities below"}
                  </h2>
                  <p className="leading-7 text-foreground/80">
                    First choose a situation on the left, then choose its response on the right.
                    Match both situations and select “Check response.”
                  </p>
                </div>
                {incompleteActivities.map((activity) => (
                  <ActivityRenderer
                    activity={{ ...activity, isComplete: completedActivityIds.has(activity.id) }}
                    headingRef={requiredActivityHeadingRef}
                    key={activity.id}
                    lessonProgressId={experience.lessonProgressId}
                    onComplete={() =>
                      setCompletedActivityIds((current) => new Set([...current, activity.id]))
                    }
                  />
                ))}
              </section>
            ) : null}
            <Button disabled={isPending} onClick={finishExperience} size="lg">
              {isPending
                ? "Saving your progress…"
                : incompleteActivities.length
                  ? `Go to “${incompleteActivities[0]!.title}” ↑`
                  : experience.accessMode === "review"
                    ? "Return to lesson library"
                    : "Complete Day 1"}
            </Button>
          </div>
        );
    }
  }

  return (
    <section className="mx-auto flex min-h-[calc(100dvh-10rem)] max-w-[920px] flex-col py-1 sm:py-4">
      <header className="border-b border-border pb-5">
        <div className="flex items-center justify-between gap-3">
          {screen > 0 ? (
            <Button
              aria-label="Go back"
              fullWidth={false}
              onClick={() => goToScreen(screen - 1)}
              variant="text"
            >
              <ArrowLeft className="size-4" /> Back
            </Button>
          ) : (
            <Link
              className={cn(buttonVariants({ fullWidth: false, variant: "text" }), "gap-2")}
              href="/journey"
            >
              <ArrowLeft className="size-4" /> Back
            </Link>
          )}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">Today</p>
              <UnderstandingBloom screen={screen} />
            </div>
            <TodayProgress screen={screen} />
          </div>
          <Button fullWidth={false} onClick={() => setExitOpen(true)} variant="text">
            Save &amp; exit
          </Button>
        </div>
        <div className="mt-4 border-l-2 border-accent-warm bg-muted/55 px-4 py-3 text-center text-sm">
          <span className="font-semibold text-primary">Today&apos;s goal</span>
          <span className="text-muted-foreground"> · Understand what this diagnosis means.</span>
        </div>
      </header>

      <div className="flex-1 py-8 sm:py-12" ref={screenRef} tabIndex={-1}>
        <div className="animate-fade-in" key={screen}>
          {renderScreen()}
        </div>
      </div>

      {screen < screenCount - 1 ? (
        <footer className="border-t border-border pt-5">
          <Button
            disabled={!canContinue() || isPending}
            onClick={() => goToScreen(screen + 1)}
            size="lg"
          >
            {continueLabel()}
          </Button>
          {!canContinue() ? (
            <p
              aria-live="polite"
              className="mt-3 text-center text-sm text-muted-foreground"
              role="status"
            >
              {continueRequirement()}
            </p>
          ) : null}
        </footer>
      ) : null}

      <p
        aria-live="polite"
        className={cn("mt-3 min-h-6 text-sm text-destructive", !message && "invisible")}
      >
        {message ?? ""}
      </p>

      <Modal
        description="Your place in today’s experience will be saved on this device. Your thoughts, worries, follow-up selections, appointment question, reflection, and next step are not saved."
        onOpenChange={setExitOpen}
        open={exitOpen}
        title="Leave for now?"
      >
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button fullWidth={false} onClick={() => setExitOpen(false)} variant="secondary">
            Stay here
          </Button>
          <Link className={buttonVariants({ fullWidth: false })} href="/journey">
            Save and exit
          </Link>
        </div>
      </Modal>

      <Modal
        description="This is an educational reference. If an emergency is happening, call local emergency services."
        onOpenChange={setSafetyOpen}
        open={safetyOpen}
        title="When symptoms should not wait"
      >
        <SafetyReference />
        <div className="mt-6 flex justify-end">
          <Button fullWidth={false} onClick={() => setSafetyOpen(false)} variant="secondary">
            Close
          </Button>
        </div>
      </Modal>
    </section>
  );
}
