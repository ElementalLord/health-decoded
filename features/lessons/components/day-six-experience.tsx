"use client";

import {
  Activity,
  AlarmClock,
  Armchair,
  ArrowLeft,
  BookOpen,
  Check,
  Clock3,
  CloudRain,
  Footprints,
  Moon,
  MoveRight,
  Pause,
  PersonStanding,
  RefreshCcw,
  Route,
  ShieldCheck,
  Sparkles,
  Utensils,
  Wind,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ProgressBar } from "@/components/ui/progress-bar";
import { daySixGlossary } from "@/features/glossary/data/day-six-glossary";
import {
  evaluateDaySixAction,
  type DaySixEvaluationFeedback,
} from "@/features/lessons/actions/day-six.actions";
import { completeLessonAction } from "@/features/lessons/actions/lesson-completion.actions";
import { saveLessonPositionAction } from "@/features/lessons/actions/lesson-progress.actions";
import styles from "@/features/lessons/components/day-six-experience.module.css";
import { LessonMotionFigure } from "@/features/lessons/components/lesson-motion-figure";
import type { LessonPlayerViewModel } from "@/features/lessons/types/lesson-player";
import { cn } from "@/lib/utils";

const stageCount = 15;

type EvaluationKey = "safety" | "teachBack";

type BreakMotion = "stand" | "stretch" | "walk";

const breakMotionLabels: Record<BreakMotion, string> = {
  stand: "Stand",
  stretch: "Stretch",
  walk: "Walk",
};

const openingNeeds = [
  ["time", "I need movement to fit a crowded day."],
  ["energy", "I need a plan that can change with my energy."],
  ["comfort", "I need options that respect my body and ability."],
  ["memory", "I need a way to remember without another alarm."],
] as const;

type OpeningNeed = (typeof openingNeeds)[number][0];

const openingResponses: Record<OpeningNeed, string> = {
  comfort:
    "We will build with adaptable choices. A useful plan respects pain, balance, mobility, recovery, and the guidance of your care team.",
  energy:
    "Your plan will have a full-size version and a smaller backup. A low-energy day does not have to become a zero-or-failure day.",
  memory:
    "You will attach movement to something that already happens, so the day itself can become the reminder.",
  time: "We will look for seams in the day, not a missing hour. Brief movement can live between ordinary events.",
};

const daySeams = [
  { id: "breakfast", label: "Breakfast ends", note: "A meal is already an anchor." },
  { id: "commute", label: "Arrive somewhere", note: "Before moving to the next task." },
  { id: "call", label: "A call finishes", note: "A natural change of posture." },
  { id: "lunch", label: "Lunch ends", note: "An optional fuel-use window." },
  { id: "television", label: "A show pauses", note: "A break already exists." },
  { id: "kitchen", label: "The kitchen closes", note: "A calm evening cue." },
] as const;

type DaySeamId = (typeof daySeams)[number]["id"];

const movementBouts = [
  { id: "hall", label: "One hallway loop", minutes: 2 },
  { id: "chair", label: "Seated movement", minutes: 3 },
  { id: "outside", label: "A short outside walk", minutes: 5 },
  { id: "music", label: "Move through one song", minutes: 4 },
  { id: "stretch", label: "Stand and stretch", minutes: 2 },
] as const;

type MovementBoutId = (typeof movementBouts)[number]["id"];

const sequenceCards = [
  { id: "meal", label: "A meal supplies fuel", number: "01" },
  { id: "digestion", label: "Digestion adds glucose to the blood", number: "02" },
  { id: "movement", label: "Comfortable movement asks muscles to work", number: "03" },
  { id: "fuel", label: "Working muscles use fuel", number: "04" },
] as const;

type SequenceId = (typeof sequenceCards)[number]["id"];

const responseFactors = [
  {
    body: "Type, pace, duration, and timing all shape the demand on muscles.",
    id: "movement",
    label: "The movement",
  },
  {
    body: "Meal size and composition affect what glucose is arriving and when.",
    id: "food",
    label: "Food and timing",
  },
  {
    body: "Insulin and some medicines can change both the response and low-glucose risk.",
    id: "medicine",
    label: "Medicines",
  },
  {
    body: "Sleep, stress, illness, temperature, and many individual factors add context.",
    id: "day",
    label: "The rest of the day",
  },
] as const;

type ResponseFactorId = (typeof responseFactors)[number]["id"];

const movementContexts = [
  {
    id: "indoors",
    label: "I need an indoor option",
    options: ["A hallway loop", "Movement with one song", "A few chair-to-stands"],
  },
  {
    id: "seated",
    label: "I need a seated option",
    options: ["Seated marching", "Arm circles", "Resistance-band pulls"],
  },
  {
    id: "social",
    label: "I would rather not do it alone",
    options: ["Walk with a friend", "Call someone while moving", "Join an adapted class"],
  },
  {
    id: "quiet",
    label: "I need something calm",
    options: ["A comfortable walk", "Gentle mobility", "A quiet garden task"],
  },
] as const;

type MovementContextId = (typeof movementContexts)[number]["id"];

const disruptions = [
  {
    backups: ["Walk an indoor route", "Move beside a chair", "Use a covered public space"],
    icon: CloudRain,
    id: "weather",
    label: "The weather changed",
  },
  {
    backups: ["Use a two-minute version", "Choose seated movement", "Move at a gentler pace"],
    icon: Wind,
    id: "energy",
    label: "My energy changed",
  },
  {
    backups: ["Use the next natural break", "Move while a task runs", "Carry the plan to tomorrow"],
    icon: Clock3,
    id: "schedule",
    label: "The schedule changed",
  },
] as const;

type DisruptionId = (typeof disruptions)[number]["id"];

const habitAnchors = [
  "After breakfast",
  "When a call ends",
  "When a show pauses",
  "After dinner",
] as const;
const habitMovements = [
  "walk for a few minutes",
  "use seated movement",
  "stand and stretch",
  "move through one song",
] as const;
const habitClosings = [
  "mark it done",
  "take one slow breath",
  "drink some water",
  "say, ‘That counted’",
] as const;
const planScales = ["10 comfortable minutes", "5 comfortable minutes", "2 gentle minutes"] as const;

const movementMoments = [
  {
    id: "desk",
    explanation:
      "A brief, adapted interruption can break a sitting streak. It does not need to become a workout.",
    label: "A long desk stretch",
    verb: "Interrupt",
  },
  {
    id: "meal",
    explanation:
      "Post-meal movement can be one useful option. The meal is not a debt, and no exact reading is promised.",
    label: "After an ordinary meal",
    verb: "Choose",
  },
  {
    id: "hard",
    explanation:
      "A safe plan can shrink, adapt, pause, and restart. Protecting the body matters more than protecting a streak.",
    label: "A difficult body day",
    verb: "Adapt",
  },
] as const;

type MovementMomentId = (typeof movementMoments)[number]["id"];

function MovementMomentVideo({ variant }: { variant: MovementMomentId }) {
  if (variant === "desk") {
    return (
      <svg className={styles.momentSvg} viewBox="0 0 320 180" focusable="false">
        <g className={styles.widgetChair}>
          <rect height="54" rx="11" width="55" x="34" y="74" />
          <path d="M27 98h68M43 128v28M80 128v28" />
        </g>
        <path className={styles.widgetMutedLine} d="M112 125H286" />
        <g className={styles.widgetWarmPerson} transform="translate(73 70)">
          <circle cx="0" cy="0" r="12" />
          <path d="M0 14v35M0 28l24 16M0 49h31M31 49v29" />
          <animate
            attributeName="opacity"
            dur="5.4s"
            keyTimes="0;0.28;0.4;0.78;0.9;1"
            repeatCount="indefinite"
            values="1;1;0;0;1;1"
          />
        </g>
        <g className={styles.widgetGreenPerson} transform="translate(190 60)">
          <circle cx="0" cy="0" r="12" />
          <path d="M0 14v52M0 26l-22-18M0 26l22-18M0 66l-18 31M0 66l18 31" />
          <animate
            attributeName="opacity"
            dur="5.4s"
            keyTimes="0;0.32;0.45;0.76;0.88;1"
            repeatCount="indefinite"
            values="0;0;1;1;0;0"
          />
          <animateTransform
            additive="sum"
            attributeName="transform"
            dur="5.4s"
            keyTimes="0;0.42;0.58;0.74;1"
            repeatCount="indefinite"
            type="rotate"
            values="0;0;-8;8;0"
          />
        </g>
        <path className={styles.widgetSuccessLine} d="M112 125h63m34 0h77" opacity="0">
          <animate
            attributeName="opacity"
            dur="5.4s"
            keyTimes="0;0.35;0.48;0.78;1"
            repeatCount="indefinite"
            values="0;0;1;1;0"
          />
        </path>
        <circle className={styles.widgetBreak} cx="192" cy="125" r="0">
          <animate
            attributeName="r"
            dur="5.4s"
            keyTimes="0;0.35;0.52;0.78;1"
            repeatCount="indefinite"
            values="0;0;12;12;0"
          />
        </circle>
      </svg>
    );
  }

  if (variant === "meal") {
    return (
      <svg className={styles.momentSvg} viewBox="0 0 320 180" focusable="false">
        <g className={styles.widgetPlate}>
          <circle cx="45" cy="92" r="29" />
          <circle cx="45" cy="92" r="17" />
          <path d="M37 90c8-12 21-8 22 4-7 9-17 10-22-4z" />
        </g>
        <path className={styles.widgetTimeLine} d="M82 92H287" />
        <circle className={styles.widgetTimeNode} cx="96" cy="92" r="7" />
        <circle className={styles.widgetTimeNode} cx="276" cy="92" r="7" />
        <rect className={styles.widgetWindow} height="54" rx="27" width="102" x="130" y="65">
          <animate
            attributeName="opacity"
            dur="4.8s"
            keyTimes="0;0.15;0.75;1"
            repeatCount="indefinite"
            values="0.35;0.82;0.82;0.35"
          />
        </rect>
        <g className={styles.widgetClock} transform="translate(181 44)">
          <circle cx="0" cy="0" r="18" />
          <g>
            <path d="M0 0v-10M0 0l9 5" />
            <animateTransform
              attributeName="transform"
              dur="4.8s"
              repeatCount="indefinite"
              type="rotate"
              values="0;360"
            />
          </g>
          <animateTransform
            attributeName="transform"
            dur="4.8s"
            keyTimes="0;0.18;0.72;1"
            repeatCount="indefinite"
            type="translate"
            values="181 44;181 39;181 39;181 44"
          />
        </g>
        <g className={styles.widgetWindowWalker} opacity="0">
          <circle cx="0" cy="-13" r="7" />
          <path d="M0-5v20M0 1l-10 8M0 1l10 8M0 15l-9 14M0 15l10 14" />
          <animateMotion dur="4.8s" path="M145 92H218" repeatCount="indefinite" />
          <animate
            attributeName="opacity"
            dur="4.8s"
            keyTimes="0;0.15;0.78;1"
            repeatCount="indefinite"
            values="0;1;1;0"
          />
        </g>
        <text className={styles.widgetSvgLabel} x="181" y="145" textAnchor="middle">
          OPTIONAL WINDOW
        </text>
      </svg>
    );
  }

  return (
    <svg className={styles.momentSvg} viewBox="0 0 320 180" focusable="false">
      <g className={styles.widgetCloud}>
        <circle cx="48" cy="55" r="18" />
        <circle cx="68" cy="47" r="24" />
        <circle cx="92" cy="58" r="16" />
        <path d="M48 84l-8 17m31-17-8 17m31-17-8 17" />
        <animateTransform
          attributeName="transform"
          dur="5.8s"
          repeatCount="indefinite"
          type="translate"
          values="0 0;5 -4;5 -4;0 0"
        />
        <animate
          attributeName="opacity"
          dur="5.8s"
          repeatCount="indefinite"
          values="0.8;0.45;0.45;0.8"
        />
      </g>
      <path className={styles.widgetRoute} d="M52 126C117 145 164 91 256 106" />
      <circle className={styles.widgetTraveler} cx="0" cy="0" opacity="0" r="9">
        <animateMotion dur="5.8s" path="M52 126C117 145 164 91 256 106" repeatCount="indefinite" />
        <animate
          attributeName="opacity"
          dur="5.8s"
          keyTimes="0;0.1;0.88;1"
          repeatCount="indefinite"
          values="0;1;1;0"
        />
      </circle>
      <g className={styles.widgetShield} transform="translate(267 102)">
        <path d="M0-28 25-18v19c0 23-17 34-25 38C-8 35-25 24-25 1v-19z">
          <animate
            attributeName="stroke-width"
            dur="2.2s"
            repeatCount="indefinite"
            values="4;8;4"
          />
        </path>
        <path d="m-10 2 7 7 14-18" />
      </g>
    </svg>
  );
}

const reflectionOptions = [
  "I can see one seam where movement might fit.",
  "A smaller backup feels more realistic than a perfect plan.",
  "Movement feels more like a tool and less like punishment.",
  "I want to ask my care team how to personalize this safely.",
  "I am still deciding what would fit my body and life.",
] as const;

function DaySixHeading({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="space-y-3">
      {label ? <p className="editorial-eyebrow">{label}</p> : null}
      <h1 className="max-w-4xl font-serif-display text-[length:var(--text-page-title)] font-normal leading-[0.96] text-balance">
        {children}
      </h1>
    </div>
  );
}

function AnswerChoice({
  children,
  onClick,
  selected,
}: {
  children: ReactNode;
  onClick: () => void;
  selected: boolean;
}) {
  return (
    <button
      aria-pressed={selected}
      className={cn(
        "motion-tactile flex min-h-16 w-full items-start gap-4 rounded-[9px] border bg-card px-5 py-4 text-left leading-7 shadow-card",
        selected && "border-accent-warm bg-accent-warm/8 ring-1 ring-accent-warm/15",
      )}
      onClick={onClick}
      type="button"
    >
      <span
        aria-hidden="true"
        className={cn(
          "mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border",
          selected ? "border-success bg-success text-white" : "border-border",
        )}
      >
        {selected ? <Check className="size-3.5" /> : null}
      </span>
      <span>{children}</span>
    </button>
  );
}

function ConceptFeedback({ feedback }: { feedback: DaySixEvaluationFeedback }) {
  return (
    <div
      aria-live="polite"
      className={cn(
        "animate-slide-up rounded-[1rem] border p-5 sm:p-7",
        feedback.accurate ? "border-success/30 bg-info" : "border-warning/35 bg-warning/10",
      )}
      role="status"
    >
      <p className={cn("font-serif-display text-2xl italic", feedback.accurate && "text-success")}>
        {feedback.heading}
      </p>
      <p className="mt-2 leading-7 text-foreground/85">{feedback.body}</p>
      <ul className="mt-5 space-y-2 border-t border-current/10 pt-4 text-sm leading-6 text-foreground/75">
        {feedback.details.map((detail) => (
          <li className="flex gap-2" key={detail}>
            <span aria-hidden="true" className="text-accent-warm">
              •{" "}
            </span>
            {detail}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DaySixExperience({ lesson: experience }: { lesson: LessonPlayerViewModel }) {
  const router = useRouter();
  const [stage, setStage] = useState(0);
  const [openingNeed, setOpeningNeed] = useState<OpeningNeed | null>(null);
  const [recapOpened, setRecapOpened] = useState<Set<"now" | "later">>(() => new Set());
  const [daySeam, setDaySeam] = useState<DaySeamId | null>(null);
  const [sittingBreaks, setSittingBreaks] = useState<Partial<Record<number, BreakMotion>>>({});
  const [activeBreak, setActiveBreak] = useState<BreakMotion | null>(null);
  const [selectedBouts, setSelectedBouts] = useState<Set<MovementBoutId>>(() => new Set());
  const [sequenceOrder, setSequenceOrder] = useState<SequenceId[]>([]);
  const [sequenceAttempts, setSequenceAttempts] = useState(0);
  const [sequenceChecked, setSequenceChecked] = useState(false);
  const [sequenceResolved, setSequenceResolved] = useState(false);
  const [responseOpened, setResponseOpened] = useState<Set<ResponseFactorId>>(() => new Set());
  const [activeResponse, setActiveResponse] = useState<ResponseFactorId | null>(null);
  const [movementContext, setMovementContext] = useState<MovementContextId | null>(null);
  const [movementChoice, setMovementChoice] = useState<string | null>(null);
  const [disruption, setDisruption] = useState<DisruptionId | null>(null);
  const [backupChoice, setBackupChoice] = useState<string | null>(null);
  const [habitAnchor, setHabitAnchor] = useState<(typeof habitAnchors)[number] | null>(null);
  const [habitMovement, setHabitMovement] = useState<(typeof habitMovements)[number] | null>(null);
  const [habitClosing, setHabitClosing] = useState<(typeof habitClosings)[number] | null>(null);
  const [planScale, setPlanScale] = useState<(typeof planScales)[number] | null>(null);
  const [safetyOpened, setSafetyOpened] = useState(false);
  const [momentsOpened, setMomentsOpened] = useState<Set<MovementMomentId>>(() => new Set());
  const [reflection, setReflection] = useState<(typeof reflectionOptions)[number] | null>(null);
  const [evaluations, setEvaluations] = useState<
    Partial<Record<EvaluationKey, DaySixEvaluationFeedback>>
  >({});
  const [selectedAnswers, setSelectedAnswers] = useState<Partial<Record<EvaluationKey, string>>>(
    {},
  );
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const stageRef = useRef<HTMLDivElement>(null);
  const storageKey = `health-decoded:day-six:${experience.lessonProgressId}`;

  const selectedBoutMinutes = movementBouts
    .filter((bout) => selectedBouts.has(bout.id))
    .reduce((total, bout) => total + bout.minutes, 0);
  const correctSequence = sequenceCards.map((card) => card.id);
  const sequenceAccurate =
    sequenceOrder.every((item, index) => item === correctSequence[index]) &&
    sequenceOrder.length === correctSequence.length;
  const selectedContext = movementContexts.find((item) => item.id === movementContext);
  const selectedDisruption = disruptions.find((item) => item.id === disruption);
  const sittingBreakCount = Object.keys(sittingBreaks).length;

  useEffect(() => {
    if (experience.accessMode === "review") return;
    const stored = Number(window.localStorage.getItem(storageKey));
    if (Number.isInteger(stored) && stored >= 0 && stored < stageCount) setStage(stored);
  }, [experience.accessMode, storageKey]);

  useEffect(() => {
    if (stage > 0) stageRef.current?.focus();
  }, [stage]);

  function saveStage(nextStage: number) {
    if (experience.accessMode === "review") return;
    window.localStorage.setItem(storageKey, String(nextStage));
    const maximumBlock = Math.max(experience.blocks.length - 1, 0);
    const blockIndex = Math.min(
      maximumBlock,
      Math.floor((nextStage / (stageCount - 1)) * maximumBlock),
    );
    startTransition(async () => {
      const result = await saveLessonPositionAction({
        blockIndex,
        lessonProgressId: experience.lessonProgressId,
      });
      setMessage(result.ok ? null : result.message);
    });
  }

  function goToStage(nextStage: number) {
    const normalized = Math.max(0, Math.min(stageCount - 1, nextStage));
    setStage(normalized);
    saveStage(normalized);
    const reduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.querySelector('[data-reduced-motion="true"]') !== null;
    window.scrollTo({ behavior: reduced ? "auto" : "smooth", top: 0 });
  }

  async function evaluate(input: unknown, key: EvaluationKey, answer: string) {
    setSelectedAnswers((current) => ({ ...current, [key]: answer }));
    const result = await evaluateDaySixAction(input);
    if (result.ok) setEvaluations((current) => ({ ...current, [key]: result.data }));
    else setMessage(result.message);
  }

  function addSequenceCard(id: SequenceId) {
    if (sequenceOrder.includes(id) || sequenceResolved) return;
    setSequenceChecked(false);
    setSequenceOrder((current) => [...current, id]);
  }

  function checkSequence() {
    const nextAttempt = sequenceAttempts + 1;
    setSequenceAttempts(nextAttempt);
    setSequenceChecked(true);
    if (!sequenceAccurate && nextAttempt >= 2) {
      setSequenceOrder(correctSequence);
      setSequenceResolved(true);
    }
  }

  function cycleSittingBreak(slot: number) {
    setSittingBreaks((current) => {
      const active = current[slot];
      const nextMotion: BreakMotion =
        active === "stand"
          ? "stretch"
          : active === "stretch"
            ? "walk"
            : active === "walk"
              ? "stand"
              : slot % 3 === 0
                ? "stand"
                : slot % 3 === 1
                  ? "stretch"
                  : "walk";
      setActiveBreak(nextMotion);
      return { ...current, [slot]: nextMotion };
    });
  }

  function runMovementMoment(id: MovementMomentId) {
    setMomentsOpened((current) => new Set([...current, id]));
  }

  function finishExperience() {
    if (experience.accessMode === "review") {
      router.push("/journey");
      return;
    }
    startTransition(async () => {
      const blockIndex = Math.max(experience.blocks.length - 1, 0);
      const positionResult = await saveLessonPositionAction({
        blockIndex,
        lessonProgressId: experience.lessonProgressId,
      });
      if (!positionResult.ok) {
        setMessage(positionResult.message);
        return;
      }
      const result = await completeLessonAction({ lessonProgressId: experience.lessonProgressId });
      if (!result.ok) {
        setMessage(result.message);
        return;
      }
      window.localStorage.removeItem(storageKey);
      router.push(`/journey?completed=${experience.dayNumber}`);
    });
  }

  function canContinue() {
    if (stage === 0) return openingNeed !== null;
    if (stage === 1) return recapOpened.size === 2;
    if (stage === 2) return daySeam !== null;
    if (stage === 3) return sittingBreakCount >= 2;
    if (stage === 4) return selectedBouts.size >= 2;
    if (stage === 5) return sequenceAccurate || sequenceResolved;
    if (stage === 6) return responseOpened.size === responseFactors.length;
    if (stage === 7) return movementContext !== null && movementChoice !== null;
    if (stage === 8) return disruption !== null && backupChoice !== null;
    if (stage === 9) return habitAnchor !== null && habitMovement !== null && habitClosing !== null;
    if (stage === 10) return planScale !== null;
    if (stage === 11) return safetyOpened && Boolean(evaluations.safety);
    if (stage === 12) return momentsOpened.size === movementMoments.length;
    if (stage === 13) return Boolean(evaluations.teachBack);
    return reflection !== null;
  }

  function stageRequirement() {
    return [
      "Choose what would make movement feel more usable today.",
      "Open both timeframes and watch them connect.",
      "Choose one seam in an ordinary day.",
      "Turn at least two sitting points into a standing, stretching, or walking break.",
      "Choose at least two small movement bouts.",
      "Put all four moments in order. After two attempts, the sequence will reveal itself.",
      "Open all four sources of context.",
      "Choose one movement context and one option that could fit it.",
      "Choose one disruption and build a backup route.",
      "Choose a cue, a movement, and a kind closing signal.",
      "Fold the plan to the starting size that feels usable.",
      "Open the safety pocket and choose the safe medicine response.",
      "Run all three real-life movement moments.",
      "Choose the plain-language explanation you would give a friend.",
      "Choose one reflection to complete Day 6.",
    ][stage];
  }

  function continueLabel() {
    return (
      [
        "Separate today from over time",
        "Find a seam in the day",
        "Interrupt a sitting streak",
        "Let smaller bouts add up",
        "Sequence a post-meal option",
        "Make room for different responses",
        "Build a movement menu",
        "Plan for a day that changes",
        "Attach movement to real life",
        "Fold the plan until it fits",
        "Carry the safety pocket",
        "Practice three real moments",
        "Explain the tool gently",
        "See what you built",
      ][stage] ?? "Continue"
    );
  }

  function renderStage() {
    switch (stage) {
      case 0:
        return (
          <div className="space-y-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_18rem] lg:items-end">
              <DaySixHeading label="Day 06 · Movement as a glucose tool">
                A tool becomes useful when it fits your hands.
              </DaySixHeading>
              <div className="border-l-2 border-accent-warm pl-6">
                <p className="editorial-number text-accent-warm">06</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Yesterday was the mechanism. Today is timing, adaptation, and one plan that can
                  survive real life.
                </p>
              </div>
            </div>
            <div className="grid gap-7 border-y border-border py-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div
                className={cn(
                  styles.routineWindow,
                  "relative min-h-72 overflow-hidden rounded-[2.5rem_2.5rem_1.5rem_1.5rem] border border-success/20 bg-[#e6eee8] p-6 sm:p-8",
                )}
                aria-label="An animated day showing movement fitting after breakfast, between desk tasks, and during an evening pause"
                role="img"
              >
                <div className={styles.routineTrack}>
                  {[
                    { icon: Utensils, label: "Breakfast ends", time: "Morning" },
                    { icon: Armchair, label: "A task ends", time: "Midday" },
                    { icon: Moon, label: "A show pauses", time: "Evening" },
                  ].map((moment, index) => {
                    const Icon = moment.icon;
                    return (
                      <span className={styles.routineMoment} key={moment.label}>
                        <span className={styles.routineIcon}>
                          <Icon aria-hidden="true" className="size-7" strokeWidth={1.45} />
                        </span>
                        <span className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-success">
                          {moment.time}
                        </span>
                        <span className="mt-1 text-center text-sm font-semibold">
                          {moment.label}
                        </span>
                        {index < 2 ? (
                          <MoveRight aria-hidden="true" className={styles.routineArrow} />
                        ) : null}
                      </span>
                    );
                  })}
                </div>
                <p className="absolute inset-x-6 bottom-5 text-center text-xs font-semibold tracking-[0.08em] text-success uppercase">
                  The day supplies the reminders
                </p>
              </div>
              <div>
                <p className="font-serif-display text-3xl">
                  What would make movement feel more usable today?
                </p>
                <div className="mt-5 grid gap-3">
                  {openingNeeds.map(([id, label]) => (
                    <AnswerChoice
                      key={id}
                      onClick={() => setOpeningNeed(id)}
                      selected={openingNeed === id}
                    >
                      {label}
                    </AnswerChoice>
                  ))}
                </div>
              </div>
            </div>
            {openingNeed ? (
              <p className="animate-slide-up border-l-2 border-success bg-info p-5 text-lg leading-8">
                {openingResponses[openingNeed]}
              </p>
            ) : null}
          </div>
        );
      case 1:
        return (
          <div className="space-y-9">
            <DaySixHeading label="A 60-second bridge">One tool. Two timeframes.</DaySixHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Day 5 explained why movement matters. Open the two ideas we need before using them in
              a real day.
            </p>
            <div className="grid gap-5 md:grid-cols-[1.08fr_0.92fr]">
              {[
                {
                  id: "now" as const,
                  number: "NOW",
                  title: "While muscles work",
                  body: "Active muscles need energy and can take up glucose to use as fuel.",
                },
                {
                  id: "later" as const,
                  number: "OVER TIME",
                  title: "When movement repeats",
                  body: "Regular activity can improve insulin sensitivity, helping cells respond more effectively to available insulin.",
                },
              ].map((item, index) => {
                const opened = recapOpened.has(item.id);
                return (
                  <button
                    aria-pressed={opened}
                    className={cn(
                      styles.timeframe,
                      "motion-tactile min-h-72 border p-7 text-left",
                      index === 0
                        ? "rounded-[1.5rem_1.5rem_4rem_1.5rem]"
                        : "rounded-[4rem_1.5rem_1.5rem_1.5rem]",
                      opened ? "border-success bg-info" : "border-border bg-card",
                    )}
                    key={item.id}
                    onClick={() => setRecapOpened((current) => new Set([...current, item.id]))}
                    type="button"
                  >
                    <span className="text-xs font-semibold tracking-[0.22em] text-accent-warm">
                      {item.number}
                    </span>
                    <h2 className="mt-12 font-serif-display text-3xl">{item.title}</h2>
                    <p className="mt-4 leading-7 text-foreground/75">
                      {opened ? item.body : "Open this timeframe"}
                    </p>
                  </button>
                );
              })}
            </div>
            {recapOpened.size === 2 ? (
              <div
                className={cn(
                  styles.timeBridge,
                  "grid gap-4 border-l-2 border-success bg-info p-6 sm:grid-cols-[auto_1fr_auto_1fr_auto] sm:items-center",
                )}
              >
                <Activity aria-hidden="true" className="size-8 text-success" />
                <span className="h-px bg-success/30" />
                <Sparkles aria-hidden="true" className="size-8 text-success" />
                <span className="h-px bg-success/30" />
                <div>
                  <p className="font-serif-display text-2xl italic text-success">
                    Now can become later.
                  </p>
                  <p className="mt-2 text-sm leading-6 text-foreground/75">
                    Working muscles use fuel during activity. Repetition can support insulin
                    sensitivity over time. Neither idea erases food or depends on weight change.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        );
      case 2:
        return (
          <div className="space-y-9">
            <DaySixHeading label="The day already has seams">
              Do not search for an extra hour.
            </DaySixHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              A seam is the small moment between two things that already happen. Choose one place
              where a brief movement option could be remembered, not guaranteed.
            </p>
            <div
              className={cn(
                styles.dayRibbon,
                "relative overflow-hidden rounded-[1.5rem] border border-border bg-card p-6 sm:p-9",
              )}
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {daySeams.map((seam) => {
                  const active = daySeam === seam.id;
                  return (
                    <button
                      aria-pressed={active}
                      className={cn(
                        "motion-tactile relative min-h-40 rounded-[1rem] border p-5 text-left",
                        active ? "border-success bg-info" : "border-border bg-background",
                      )}
                      key={seam.id}
                      onClick={() => setDaySeam(seam.id)}
                      type="button"
                    >
                      <span
                        className={cn(
                          "inline-flex size-9 items-center justify-center rounded-full border",
                          active ? "border-success bg-success text-white" : "border-border bg-card",
                        )}
                      >
                        <Clock3 className="size-4" />
                      </span>
                      <h2 className="mt-5 font-serif-display text-2xl">{seam.label}</h2>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{seam.note}</p>
                    </button>
                  );
                })}
              </div>
            </div>
            {daySeam ? (
              <div className="animate-slide-up grid gap-3 border-l-2 border-success bg-info p-5 sm:grid-cols-[auto_1fr] sm:items-center">
                <AlarmClock className="size-7 text-success" />
                <p className="leading-7">
                  <strong>{daySeams.find((item) => item.id === daySeam)?.label}</strong> can become
                  a reminder. The action itself can stay small and adaptable.
                </p>
              </div>
            ) : null}
          </div>
        );
      case 3:
        return (
          <div className="space-y-9">
            <DaySixHeading label="Break the sitting spell">
              A long still stretch can have punctuation.
            </DaySixHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Tap two or more pauses to imagine standing, stretching, walking briefly, or using an
              adapted movement. This is an exploration, not a schedule prescribed for you.
            </p>
            <LessonMotionFigure variant="sitting-interruption" />
            <div
              className={cn(
                styles.sittingScene,
                "rounded-[1.5rem] border border-accent-warm/25 bg-[#f2e7de] p-6 sm:p-9",
              )}
            >
              <div className={styles.breakDemonstration}>
                <div
                  aria-label={`${sittingBreakCount} movement changes split one long sitting stretch into ${sittingBreakCount + 1} shorter sections`}
                  className={styles.breakRibbon}
                  role="img"
                >
                  {[0, 1, 2, 3, 4].map((slot) => {
                    const motion = sittingBreaks[slot];
                    return (
                      <span
                        className={cn(
                          styles.stillSegment,
                          motion && styles.movementSegment,
                          motion === "stand" && styles.movementSegmentStand,
                          motion === "stretch" && styles.movementSegmentStretch,
                          motion === "walk" && styles.movementSegmentWalk,
                        )}
                        key={slot}
                      >
                        {motion === "walk" ? (
                          <Footprints className="size-7" />
                        ) : motion === "stretch" ? (
                          <Activity className="size-7" />
                        ) : motion === "stand" ? (
                          <PersonStanding className="size-7" />
                        ) : (
                          <Pause className="size-5" />
                        )}
                        <span>{motion ? breakMotionLabels[motion] : "Still"}</span>
                      </span>
                    );
                  })}
                </div>
                <div className={styles.breakEquation}>
                  <span>One unbroken stretch</span>
                  <MoveRight aria-hidden="true" className="size-5" />
                  <strong>
                    {sittingBreakCount === 0
                      ? "Add a change"
                      : `${sittingBreakCount + 1} shorter sections`}
                  </strong>
                </div>
                <p className={styles.breakCaption} aria-live="polite">
                  {activeBreak
                    ? `${breakMotionLabels[activeBreak]} changes the shape of the sitting ribbon. Tap that point again to try another kind of movement.`
                    : "Choose a point below and watch one long ribbon split."}
                </p>
              </div>
              <div className="mt-7 grid grid-cols-5 gap-2">
                {[0, 1, 2, 3, 4].map((slot) => {
                  const motion = sittingBreaks[slot];
                  return (
                    <button
                      aria-label={`Movement point ${slot + 1}: ${motion ? breakMotionLabels[motion] : "sitting"}. Activate to choose the next movement.`}
                      aria-pressed={Boolean(motion)}
                      className={cn(
                        styles.sittingMarker,
                        "motion-tactile min-h-24 rounded-full border text-center",
                        motion ? "border-success bg-success text-white" : "border-border bg-card",
                      )}
                      key={slot}
                      onClick={() => cycleSittingBreak(slot)}
                      type="button"
                    >
                      {motion === "walk" ? (
                        <Footprints className="mx-auto size-6" />
                      ) : motion === "stretch" ? (
                        <Activity className="mx-auto size-6" />
                      ) : motion === "stand" ? (
                        <PersonStanding className="mx-auto size-6" />
                      ) : (
                        <Pause className="mx-auto size-5 text-muted-foreground" />
                      )}
                      <span className="mt-2 block text-xs font-semibold">
                        {motion ? breakMotionLabels[motion] : "Sitting"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-5">
              <p className="font-serif-display text-6xl text-success">{sittingBreakCount}</p>
              <p className="max-w-xl leading-7 text-foreground/75">
                {sittingBreakCount >= 2
                  ? "The still stretch now has openings. Brief movement can interrupt sitting without becoming a formal workout."
                  : "Add two possible openings. They can be standing, walking, stretching, or an adapted movement."}
              </p>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-9">
            <DaySixHeading label="Some is not none">Let small bouts form a pattern.</DaySixHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Choose at least two moments that could exist on a busy day. The minutes are examples,
              not a quota or personalized prescription.
            </p>
            <div className="grid gap-8 lg:grid-cols-[1fr_18rem] lg:items-stretch">
              <div className="grid gap-3 sm:grid-cols-2">
                {movementBouts.map((bout) => {
                  const active = selectedBouts.has(bout.id);
                  return (
                    <button
                      aria-pressed={active}
                      className={cn(
                        "motion-tactile min-h-32 rounded-[1rem] border p-5 text-left",
                        active ? "border-success bg-info" : "border-border bg-card",
                      )}
                      key={bout.id}
                      onClick={() =>
                        setSelectedBouts((current) => {
                          const next = new Set(current);
                          if (next.has(bout.id)) next.delete(bout.id);
                          else next.add(bout.id);
                          return next;
                        })
                      }
                      type="button"
                    >
                      <span className="font-serif-display text-4xl text-accent-warm">
                        {bout.minutes}
                      </span>
                      <span className="ml-2 text-xs uppercase tracking-widest text-muted-foreground">
                        example min
                      </span>
                      <p className="mt-5 font-semibold">{bout.label}</p>
                    </button>
                  );
                })}
              </div>
              <div
                className={cn(
                  styles.minuteVessel,
                  "flex min-h-72 flex-col justify-end overflow-hidden rounded-[7rem_7rem_1.25rem_1.25rem] border border-success/30 bg-[#e8eee8] p-5 text-center",
                )}
              >
                <div className="relative flex-1">
                  {Array.from({ length: Math.min(selectedBoutMinutes, 16) }).map((_, index) => (
                    <span
                      className={styles.minuteDot}
                      key={index}
                      style={{
                        animationDelay: `${index * 45}ms`,
                        left: `${12 + (index % 4) * 21}%`,
                        bottom: `${8 + Math.floor(index / 4) * 18}%`,
                      }}
                    />
                  ))}
                </div>
                <p className="font-serif-display text-6xl text-success">{selectedBoutMinutes}</p>
                <p className="mt-1 text-sm text-muted-foreground">example minutes across the day</p>
              </div>
            </div>
            <p className="border-l-2 border-accent-warm px-5 py-3 leading-7 text-foreground/75">
              Several small bouts can be more approachable than waiting for one ideal block. They do
              not have to look identical or happen every day.
            </p>
          </div>
        );
      case 5:
        return (
          <div className="space-y-9">
            <DaySixHeading label="One optional fuel window">
              Put the post-meal story in order.
            </DaySixHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Tap the four moments in the order that makes biological sense. This is a teaching
              sequence, not a rule that every meal needs movement.
            </p>
            <LessonMotionFigure variant="post-meal-window" />
            <div className="grid gap-3 sm:grid-cols-2">
              {sequenceCards.map((card) => {
                const position = sequenceOrder.indexOf(card.id);
                return (
                  <button
                    className={cn(
                      "motion-tactile min-h-32 rounded-[1rem] border p-5 text-left",
                      position >= 0
                        ? "border-accent-warm bg-accent-warm/8"
                        : "border-border bg-card",
                    )}
                    disabled={position >= 0 || sequenceResolved}
                    key={card.id}
                    onClick={() => addSequenceCard(card.id)}
                    type="button"
                  >
                    <span className="text-xs font-semibold tracking-[0.2em] text-accent-warm">
                      {position >= 0 ? `POSITION ${position + 1}` : "ADD TO SEQUENCE"}
                    </span>
                    <p className="mt-5 font-serif-display text-2xl">{card.label}</p>
                  </button>
                );
              })}
            </div>
            <div
              className={cn(
                styles.sequenceTrack,
                "flex min-h-28 flex-wrap items-center gap-3 rounded-[1.25rem] border border-border bg-[#f2ebe2] p-5",
              )}
              aria-live="polite"
            >
              {sequenceOrder.length === 0 ? (
                <p className="text-sm text-muted-foreground">Your sequence will appear here.</p>
              ) : (
                sequenceOrder.map((id, index) => (
                  <div className="flex items-center gap-3" key={id}>
                    <span className="inline-flex min-h-14 items-center rounded-full border border-accent-warm/30 bg-card px-4 text-sm font-semibold">
                      {sequenceCards.find((card) => card.id === id)?.label}
                    </span>
                    {index < sequenceOrder.length - 1 ? (
                      <MoveRight className="size-5 text-accent-warm" />
                    ) : null}
                  </div>
                ))
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                disabled={sequenceOrder.length < sequenceCards.length || sequenceResolved}
                fullWidth={false}
                onClick={checkSequence}
              >
                Check the sequence
              </Button>
              <Button
                disabled={sequenceResolved}
                fullWidth={false}
                onClick={() => {
                  setSequenceOrder([]);
                  setSequenceChecked(false);
                }}
                variant="secondary"
              >
                <RefreshCcw className="size-4" /> Reset
              </Button>
            </div>
            {sequenceChecked ? (
              <p
                className={cn(
                  "border-l-2 p-5 leading-7",
                  sequenceAccurate || sequenceResolved
                    ? "border-success bg-info"
                    : "border-warning bg-warning/10",
                )}
                role="status"
              >
                {sequenceAccurate || sequenceResolved
                  ? "The sequence now shows the useful idea: digestion supplies fuel, and comfortable movement can give working muscles a reason to use some of it. No exact glucose result is promised."
                  : `The order is not quite there yet. Attempt ${sequenceAttempts} of 2; after the next check, the sequence will reveal itself.`}
              </p>
            ) : null}
          </div>
        );
      case 6: {
        const selected = responseFactors.find((factor) => factor.id === activeResponse);
        return (
          <div className="space-y-9">
            <DaySixHeading label="No promised number">A response has context.</DaySixHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              The same movement does not guarantee the same glucose result for every person, or even
              on every day. Open the four pieces of context.
            </p>
            <div
              className={cn(
                styles.contextOrbit,
                "relative mx-auto grid max-w-3xl gap-3 rounded-[50%] border border-border bg-[#e7eee8] p-9 sm:grid-cols-2 sm:p-14",
              )}
            >
              {responseFactors.map((factor) => {
                const opened = responseOpened.has(factor.id);
                return (
                  <button
                    aria-pressed={opened}
                    className={cn(
                      "motion-tactile min-h-32 rounded-[42%] border bg-card p-5 text-center",
                      opened ? "border-success" : "border-border",
                    )}
                    key={factor.id}
                    onClick={() => {
                      setActiveResponse(factor.id);
                      setResponseOpened((current) => new Set([...current, factor.id]));
                    }}
                    type="button"
                  >
                    <Sparkles
                      className={cn("mx-auto size-5", opened ? "text-success" : "text-accent-warm")}
                    />
                    <p className="mt-4 font-semibold">{factor.label}</p>
                  </button>
                );
              })}
            </div>
            {selected ? (
              <p className="animate-slide-up border-l-2 border-success bg-info p-5 text-lg leading-8">
                {selected.body}
              </p>
            ) : null}
            {responseOpened.size === responseFactors.length ? (
              <div
                className={cn(
                  styles.contextComplete,
                  "grid gap-5 border-y border-success/30 bg-info px-6 py-7 sm:grid-cols-[auto_1fr] sm:items-center",
                )}
              >
                <span className={styles.contextWeather} aria-hidden="true">
                  <Sparkles className="size-7" />
                  <CloudRain className="size-7" />
                  <Wind className="size-7" />
                </span>
                <div>
                  <p className="font-serif-display text-2xl italic text-success">
                    A response is a pattern with context, not a grade.
                  </p>
                  <p className="mt-2 leading-7 text-foreground/75">
                    Activity, food, medicine, timing, sleep, stress, illness, and many individual
                    factors can change what happens. One unexpected number does not prove the
                    movement failed.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        );
      }
      case 7:
        return (
          <div className="space-y-9">
            <DaySixHeading label="A movement menu">
              Start with the life. Then choose the movement.
            </DaySixHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              A routine is easier to repeat when it respects setting, ability, company, and
              preference. Choose the context closest to what would help.
            </p>
            <div className="grid gap-px overflow-hidden rounded-[1.5rem] border border-border bg-border sm:grid-cols-2">
              {movementContexts.map((context) => (
                <button
                  aria-pressed={movementContext === context.id}
                  className={cn(
                    "motion-tactile min-h-40 bg-card p-6 text-left",
                    movementContext === context.id && "bg-info",
                  )}
                  key={context.id}
                  onClick={() => {
                    setMovementContext(context.id);
                    setMovementChoice(null);
                  }}
                  type="button"
                >
                  <Route
                    className={cn(
                      "size-6",
                      movementContext === context.id ? "text-success" : "text-accent-warm",
                    )}
                  />
                  <p className="mt-8 font-serif-display text-2xl">{context.label}</p>
                </button>
              ))}
            </div>
            {selectedContext ? (
              <div className="animate-slide-up space-y-4 border-l-2 border-success pl-6">
                <h2 className="font-serif-display text-3xl">Three possible routes</h2>
                <div className="grid gap-3 sm:grid-cols-3">
                  {selectedContext.options.map((option) => (
                    <button
                      aria-pressed={movementChoice === option}
                      className={cn(
                        "motion-tactile min-h-28 rounded-[1rem] border p-4 text-left font-semibold",
                        movementChoice === option
                          ? "border-success bg-info"
                          : "border-border bg-card",
                      )}
                      key={option}
                      onClick={() => setMovementChoice(option)}
                      type="button"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            {movementChoice ? (
              <p className="rounded-[1rem] bg-[#f2ebe2] p-5 leading-7">
                <strong>{movementChoice}</strong> is not the one correct exercise. It is one option
                selected because it fits the context you named.
              </p>
            ) : null}
          </div>
        );
      case 8:
        return (
          <div className="space-y-9">
            <DaySixHeading label="Real life reroutes">
              A changed day needs a route, not a verdict.
            </DaySixHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Choose what tends to knock plans off course. Then make a backup small enough to remain
              possible.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {disruptions.map((item) => {
                const Icon = item.icon;
                const active = disruption === item.id;
                return (
                  <button
                    aria-pressed={active}
                    className={cn(
                      styles.rerouteDoor,
                      "motion-tactile min-h-52 rounded-[1.25rem] border p-6 text-left",
                      active ? "border-accent-warm bg-[#f2e7de]" : "border-border bg-card",
                    )}
                    key={item.id}
                    onClick={() => {
                      setDisruption(item.id);
                      setBackupChoice(null);
                    }}
                    type="button"
                  >
                    <Icon
                      className={cn(
                        "size-8",
                        active ? "text-accent-warm" : "text-muted-foreground",
                      )}
                    />
                    <p className="mt-16 font-serif-display text-2xl">{item.label}</p>
                  </button>
                );
              })}
            </div>
            {selectedDisruption ? (
              <div className="animate-slide-up grid gap-3 sm:grid-cols-3">
                {selectedDisruption.backups.map((backup) => (
                  <button
                    aria-pressed={backupChoice === backup}
                    className={cn(
                      "motion-tactile min-h-28 rounded-[1rem] border p-5 text-left",
                      backupChoice === backup ? "border-success bg-info" : "border-border bg-card",
                    )}
                    key={backup}
                    onClick={() => setBackupChoice(backup)}
                    type="button"
                  >
                    <RefreshCcw className="size-5 text-success" />
                    <p className="mt-4 font-semibold">{backup}</p>
                  </button>
                ))}
              </div>
            ) : null}
            {backupChoice ? (
              <p className="border-l-2 border-success bg-info p-5 text-lg leading-8">
                The backup is part of the plan, not evidence that the original plan failed.
              </p>
            ) : null}
          </div>
        );
      case 9:
        return (
          <div className="space-y-9">
            <DaySixHeading label="The habit bridge">
              Let something familiar carry the new action.
            </DaySixHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Build one three-part bridge: a cue that already happens, a small movement, and a
              closing signal that feels kind rather than judgmental.
            </p>
            <div
              className={cn(
                styles.habitBridge,
                "relative grid gap-5 rounded-[1.5rem] bg-[#e6eee8] p-6 lg:grid-cols-3 lg:p-9",
              )}
            >
              {[
                {
                  label: "01 · When",
                  values: habitAnchors,
                  selected: habitAnchor,
                  select: (value: (typeof habitAnchors)[number]) => setHabitAnchor(value),
                },
                {
                  label: "02 · I will",
                  values: habitMovements,
                  selected: habitMovement,
                  select: (value: (typeof habitMovements)[number]) => setHabitMovement(value),
                },
                {
                  label: "03 · Then",
                  values: habitClosings,
                  selected: habitClosing,
                  select: (value: (typeof habitClosings)[number]) => setHabitClosing(value),
                },
              ].map((group) => (
                <div
                  className="relative z-10 rounded-[1.15rem] border border-success/20 bg-card p-5"
                  key={group.label}
                >
                  <p className="text-xs font-semibold tracking-[0.18em] text-success">
                    {group.label}
                  </p>
                  <div className="mt-5 space-y-2">
                    {group.values.map((value) => (
                      <button
                        aria-pressed={group.selected === value}
                        className={cn(
                          "min-h-12 w-full rounded-md border px-3 py-2 text-left text-sm",
                          group.selected === value
                            ? "border-accent-warm bg-accent-warm/8"
                            : "border-border",
                        )}
                        key={value}
                        onClick={() => group.select(value as never)}
                        type="button"
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {habitAnchor && habitMovement && habitClosing ? (
              <blockquote className="animate-slide-up border-l-2 border-accent-warm pl-6 font-serif-display text-3xl italic leading-tight">
                “{habitAnchor}, I will {habitMovement}. Then I will {habitClosing}.”
              </blockquote>
            ) : null}
          </div>
        );
      case 10: {
        const planScaleIndex = planScale ? planScales.indexOf(planScale) : -1;
        return (
          <div className="space-y-9">
            <DaySixHeading label="Let the plan bend">Fold the plan until it fits.</DaySixHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Choose a starting size and watch the same plan physically fold. Smaller is not a lower
              score. It is less surface area for a difficult day to knock over.
            </p>
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-3">
                {planScales.map((scale, index) => (
                  <button
                    aria-pressed={planScale === scale}
                    className={cn(
                      "motion-tactile flex min-h-24 w-full items-center justify-between rounded-[1rem] border px-5 text-left",
                      planScale === scale ? "border-success bg-info" : "border-border bg-card",
                    )}
                    key={scale}
                    onClick={() => setPlanScale(scale)}
                    type="button"
                  >
                    <span className="font-semibold">{scale}</span>
                    <span className="font-serif-display text-3xl text-accent-warm">
                      {index === 0 ? "full" : index === 1 ? "small" : "tiny"}
                    </span>
                  </button>
                ))}
              </div>
              <div
                className={cn(
                  styles.planFoldingDesk,
                  "relative flex min-h-80 flex-col justify-between overflow-hidden rounded-[1.5rem] border border-border bg-[#f2e7de] p-7",
                )}
                aria-live="polite"
              >
                <div>
                  <p className="editorial-eyebrow text-accent-warm">The same intention</p>
                  <p className="mt-3 font-serif-display text-3xl">{planScale ?? "Choose a fold"}</p>
                </div>
                <div className={styles.planFoldSurface} aria-hidden="true">
                  <span
                    className={cn(
                      styles.planPaper,
                      planScaleIndex === 0 && styles.planPaperFull,
                      planScaleIndex === 1 && styles.planPaperSmall,
                      planScaleIndex === 2 && styles.planPaperTiny,
                    )}
                  >
                    {[0, 1, 2, 3, 4].map((section) => (
                      <span key={section} />
                    ))}
                  </span>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {planScaleIndex === -1
                    ? "Full, small, and tiny are three versions of one plan."
                    : planScaleIndex === 0
                      ? "Keep the full version when it truly fits the day."
                      : planScaleIndex === 1
                        ? "One fold keeps the plan recognizable and easier to begin."
                        : "Two folds protect the smallest useful version for a difficult day."}
                </p>
              </div>
            </div>
            {planScale ? (
              <p className="border-l-2 border-success bg-info p-5 leading-7" role="status">
                <strong>{planScale}</strong> is now the starting version. The larger version still
                exists; it simply does not have to be the price of beginning.
              </p>
            ) : (
              <p className="border-l-2 border-accent-warm bg-accent-warm/8 p-5 leading-7">
                Pick the version you would be most willing to start on an ordinary week.
              </p>
            )}
          </div>
        );
      }
      case 11:
        return (
          <div className="space-y-9">
            <DaySixHeading label="A small safety pocket">
              Personal plans need personal guidance.
            </DaySixHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Day 6 does not prescribe an exercise dose. Open the pocket for the one medication note
              worth carrying into the plan.
            </p>
            <button
              aria-expanded={safetyOpened}
              className={cn(
                styles.safetyPocket,
                "motion-tactile min-h-64 w-full rounded-[1.5rem] border p-7 text-left",
                safetyOpened ? "border-success bg-info" : "border-border bg-card",
              )}
              onClick={() => setSafetyOpened(true)}
              type="button"
            >
              <div className="flex items-center justify-between gap-5">
                <ShieldCheck className="size-10 text-success" />
                <span className="text-sm font-semibold text-success">
                  {safetyOpened ? "Pocket open" : "Open safety pocket"}
                </span>
              </div>
              <h2 className="mt-14 font-serif-display text-3xl">
                {safetyOpened
                  ? "Insulin and some medicines can raise low-glucose risk during or after activity."
                  : "One note, kept close."}
              </h2>
              {safetyOpened ? (
                <p className="mt-4 max-w-3xl leading-7 text-foreground/75">
                  The healthcare team can explain whether monitoring, food, or medicine planning is
                  needed for the person’s activity plan. New, vigorous, or difficult activity may
                  also need individualized guidance.
                </p>
              ) : null}
            </button>
            {safetyOpened ? (
              <div className="space-y-4">
                <p className="font-semibold">
                  What is the safe next step for someone using insulin or a medicine that may cause
                  lows?
                </p>
                {(
                  [
                    ["ask_care_team", "Ask the care team how to plan activity safely."],
                    ["skip_medicine", "Skip the medicine whenever movement is planned."],
                    ["ignore_symptoms", "Ignore concerning symptoms and finish the activity."],
                  ] as const
                ).map(([answer, label]) => (
                  <AnswerChoice
                    key={answer}
                    onClick={() => evaluate({ answer, stage: "safety" }, "safety", answer)}
                    selected={selectedAnswers.safety === answer}
                  >
                    {label}
                  </AnswerChoice>
                ))}
                {evaluations.safety ? <ConceptFeedback feedback={evaluations.safety} /> : null}
              </div>
            ) : null}
          </div>
        );
      case 12: {
        return (
          <div className="space-y-9">
            <DaySixHeading label="The three-moment lab">
              Use the tool without turning it into a rule.
            </DaySixHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Watch each real-life moment loop. The useful action changes with the situation:
              interrupt a long sit, choose an optional movement window, or reroute a difficult day.
            </p>
            <div className={styles.momentLab}>
              {movementMoments.map((moment) => {
                const opened = momentsOpened.has(moment.id);
                return (
                  <article
                    className={cn(
                      styles.momentRow,
                      "overflow-hidden rounded-[1.4rem] border p-5 text-left shadow-card sm:p-7",
                      opened ? "border-success bg-info" : "border-border bg-card",
                    )}
                    key={moment.id}
                  >
                    <div className={styles.momentCopy}>
                      <p className="editorial-eyebrow text-accent-warm">{moment.verb}</p>
                      <h2 className="mt-3 font-serif-display text-3xl leading-tight">
                        {moment.label}
                      </h2>
                      <p className="mt-4 leading-7 text-foreground/75">{moment.explanation}</p>
                      <Button
                        className="mt-5"
                        fullWidth={false}
                        onClick={() => runMovementMoment(moment.id)}
                        variant="secondary"
                      >
                        {opened ? (
                          <>
                            <Check className="size-4" /> Explored
                          </>
                        ) : (
                          "Mark this moment explored"
                        )}
                      </Button>
                    </div>
                    <div
                      className={cn(
                        styles.momentVideo,
                        moment.id === "desk" && styles.interruptVideo,
                        moment.id === "meal" && styles.chooseVideo,
                        moment.id === "hard" && styles.adaptVideo,
                      )}
                      aria-hidden="true"
                    >
                      <MovementMomentVideo variant={moment.id} />
                      <p className={styles.videoLabel}>
                        {moment.id === "desk"
                          ? "sit · rise · reset"
                          : moment.id === "meal"
                            ? "after a meal · optional, flexible window"
                            : "notice · reroute · protect the body"}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
            {momentsOpened.size === movementMoments.length ? (
              <div
                className={cn(
                  styles.momentsComplete,
                  "border-l-2 border-success bg-info p-5 text-lg leading-8",
                )}
              >
                You used the same tool three different ways: interrupt, choose, and adapt. That is
                more useful than one rigid rule.
              </div>
            ) : null}
          </div>
        );
      }
      case 13:
        return (
          <div className="space-y-9">
            <DaySixHeading label="Teach it gently">What would you tell a friend?</DaySixHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              They ask, “Why does everyone keep telling me to exercise?” Choose the answer that
              explains the body without adding pressure.
            </p>
            <div className="grid gap-4">
              {(
                [
                  [
                    "useful_tool",
                    "Movement gives working muscles a way to use glucose. Small, safe bouts can fit real life, and regular movement can support insulin sensitivity.",
                  ],
                  ["food_payment", "Movement is how you pay for eating carbohydrate."],
                  ["perfect_workout", "Only a perfect workout routine will make a difference."],
                ] as const
              ).map(([answer, label], index) => (
                <button
                  aria-pressed={selectedAnswers.teachBack === answer}
                  className={cn(
                    styles.friendNote,
                    "motion-tactile min-h-36 rounded-[1.25rem] border p-6 text-left",
                    selectedAnswers.teachBack === answer
                      ? "border-success bg-info"
                      : "border-border bg-card",
                  )}
                  key={answer}
                  onClick={() => evaluate({ answer, stage: "teach_back" }, "teachBack", answer)}
                  type="button"
                >
                  <span className="font-serif-display text-4xl text-accent-warm/65">
                    0{index + 1}
                  </span>
                  <p className="mt-5 leading-7">{label}</p>
                </button>
              ))}
            </div>
            {evaluations.teachBack ? <ConceptFeedback feedback={evaluations.teachBack} /> : null}
          </div>
        );
      default:
        return (
          <div className="space-y-10">
            <div className="text-center">
              <p className="editorial-eyebrow">Day 6 · Complete</p>
              <h1 className="mt-5 font-serif-display text-[length:var(--text-hero)] font-normal leading-[0.9]">
                You built a plan that knows how to bend.
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                It has a seam, a movement, a starting size, a closing signal, and a route for
                changed days.
              </p>
            </div>
            <div
              className={cn(
                styles.planPortrait,
                "grid gap-5 rounded-[1.5rem] border border-border bg-[#f2ebe2] p-6 sm:p-9 lg:grid-cols-[1fr_1fr]",
              )}
            >
              <div>
                <p className="editorial-eyebrow text-accent-warm">Your working draft</p>
                <blockquote className="mt-6 font-serif-display text-3xl leading-tight">
                  “{habitAnchor ?? "At one familiar moment"}, I will{" "}
                  {habitMovement ?? movementChoice?.toLowerCase() ?? "use a small movement"}.”
                </blockquote>
                <p className="mt-5 leading-7 text-foreground/75">
                  Starting size: <strong>{planScale ?? "the smallest useful version"}</strong>
                </p>
                <p className="mt-2 leading-7 text-foreground/75">
                  Backup: <strong>{backupChoice ?? "adapt when the day changes"}</strong>
                </p>
              </div>
              <div className="grid gap-px overflow-hidden rounded-[1rem] border border-border bg-border">
                {[
                  ["01", "Movement helps working muscles use fuel."],
                  ["02", "Small bouts and sitting breaks can create usable openings."],
                  ["03", "A flexible plan can shrink, adapt, and restart."],
                ].map(([number, truth]) => (
                  <div className="bg-card p-5" key={number}>
                    <span className="font-serif-display text-4xl text-success">{number}</span>
                    <p className="mt-3 leading-7">{truth}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <p className="editorial-eyebrow text-success">Reflection</p>
              <h2 className="font-serif-display text-4xl">What feels different now?</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {reflectionOptions.map((option) => (
                  <AnswerChoice
                    key={option}
                    onClick={() => setReflection(option)}
                    selected={reflection === option}
                  >
                    {option}
                  </AnswerChoice>
                ))}
              </div>
            </div>
            {reflection ? (
              <div className="space-y-6 rounded-[1.5rem] bg-info p-7 text-center sm:p-10">
                <p className="font-serif-display text-3xl italic text-success">
                  A tool is allowed to fit the person using it.
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  Tomorrow: medicines as tools, not judgments.
                </p>
                <Button disabled={isPending} onClick={finishExperience}>
                  {isPending
                    ? "Saving your progress…"
                    : experience.accessMode === "review"
                      ? "Return to journey"
                      : "Complete Day 6"}
                </Button>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button fullWidth={false} onClick={() => goToStage(9)} variant="text">
                    Rebuild the habit bridge
                  </Button>
                  <Button fullWidth={false} onClick={() => goToStage(10)} variant="text">
                    Refold the plan
                  </Button>
                  <Link
                    className={buttonVariants({ fullWidth: false, variant: "text" })}
                    href="/lessons/5"
                  >
                    Return to Day 5
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        );
    }
  }

  return (
    <section className="mx-auto flex min-h-[calc(100dvh-10rem)] max-w-[980px] flex-col py-1 sm:py-4">
      <header className="border-b border-border pb-5">
        <div className="flex items-center justify-between gap-3">
          {stage > 0 ? (
            <Button fullWidth={false} onClick={() => goToStage(stage - 1)} variant="text">
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
          <div className="text-center">
            <p className="text-sm font-semibold text-accent-warm">Day 6</p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Movement as a Glucose Tool
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              aria-label="Open glossary"
              fullWidth={false}
              onClick={() => setGlossaryOpen(true)}
              variant="text"
            >
              <BookOpen className="size-4" />
              <span className="hidden sm:inline">Glossary</span>
            </Button>
            <Button fullWidth={false} onClick={() => setExitOpen(true)} variant="text">
              Save &amp; exit
            </Button>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Chapter {stage + 1}</span>
            <span>{stageCount} chapters</span>
          </div>
          <ProgressBar
            label={`Day 6 chapter ${stage + 1} of ${stageCount}`}
            value={((stage + 1) / stageCount) * 100}
          />
        </div>
      </header>
      <div className="flex-1 py-8 sm:py-12" ref={stageRef} tabIndex={-1}>
        <div className="animate-fade-in" key={stage}>
          {renderStage()}
        </div>
      </div>
      {stage < stageCount - 1 ? (
        <footer className="border-t border-border pt-5">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button
              disabled={stage === 0 || isPending}
              onClick={() => goToStage(stage - 1)}
              variant="secondary"
            >
              Previous
            </Button>
            <Button disabled={!canContinue() || isPending} onClick={() => goToStage(stage + 1)}>
              {continueLabel()}
            </Button>
          </div>
          {!canContinue() ? (
            <p aria-live="polite" className="mt-3 text-sm text-muted-foreground" role="status">
              To continue: {stageRequirement()}
            </p>
          ) : null}
        </footer>
      ) : null}
      <p
        aria-live="polite"
        className={cn("mt-3 min-h-6 text-sm text-destructive", !message && "invisible")}
        role={message ? "alert" : undefined}
      >
        {message ?? ""}
      </p>
      <Modal
        description="Your chapter will be saved. Practice choices and reflections stay in this browser and are not saved as health information."
        onOpenChange={setExitOpen}
        open={exitOpen}
        title="Leave Day 6 for now?"
      >
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button fullWidth={false} onClick={() => setExitOpen(false)} variant="secondary">
            Keep exploring
          </Button>
          <Link className={buttonVariants({ fullWidth: false })} href="/journey">
            Save and exit
          </Link>
        </div>
      </Modal>
      <Modal
        description="Plain-language definitions used in this lesson."
        onOpenChange={setGlossaryOpen}
        open={glossaryOpen}
        title="Day 6 glossary"
      >
        <div className="max-h-[60dvh] space-y-5 overflow-y-auto pr-2">
          {daySixGlossary.map((entry) => (
            <section key={entry.id}>
              <h2 className="font-serif-display text-xl font-semibold">{entry.term}</h2>
              <p className="mt-1 text-sm leading-6">{entry.definition}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {entry.simpleExplanation}
              </p>
            </section>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <Button fullWidth={false} onClick={() => setGlossaryOpen(false)} variant="secondary">
            Close
          </Button>
        </div>
      </Modal>
    </section>
  );
}
