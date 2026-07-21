"use client";

import {
  Activity,
  Armchair,
  ArrowLeft,
  Bike,
  BookOpen,
  Check,
  Clock3,
  Dumbbell,
  Footprints,
  Heart,
  Home,
  Moon,
  MoveRight,
  PersonStanding,
  ShieldCheck,
  Smile,
  Sparkles,
  Sun,
  Utensils,
  Waves,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ProgressBar } from "@/components/ui/progress-bar";
import { dayFiveGlossary } from "@/features/glossary/data/day-five-glossary";
import {
  evaluateDayFiveAction,
  type DayFiveEvaluationFeedback,
} from "@/features/lessons/actions/day-five.actions";
import { completeLessonAction } from "@/features/lessons/actions/lesson-completion.actions";
import { saveLessonPositionAction } from "@/features/lessons/actions/lesson-progress.actions";
import styles from "@/features/lessons/components/day-five-experience.module.css";
import { LessonMotionFigure } from "@/features/lessons/components/lesson-motion-figure";
import type { LessonPlayerViewModel } from "@/features/lessons/types/lesson-player";
import { cn } from "@/lib/utils";

const stageCount = 16;

type EvaluationKey = "safety" | "teachBack";

const openingFeelings = [
  ["pressure", "Exercise sounds like another demand."],
  ["gym", "I picture a gym or a hard workout."],
  ["tired", "I already feel too tired or busy."],
  ["curious", "I want to know what movement actually changes."],
] as const;

type OpeningFeeling = (typeof openingFeelings)[number][0];

const openingResponses: Record<OpeningFeeling, string> = {
  pressure:
    "Today is not a performance test. It is a calm look at what working muscles do and one way movement might fit your real life.",
  gym: "A gym is only one setting. Walking, chores, dancing, gardening, and adapted movement can all ask muscles to work.",
  tired:
    "We will not build an idealized routine. We will look for one small opening that respects your energy, ability, and schedule.",
  curious: "You will see the mechanism first, then use it to design one realistic next step.",
};

const everydayMovements = [
  { body: "A few minutes between ordinary tasks.", icon: Footprints, id: "walk", label: "Walking" },
  {
    body: "Reaching, lifting, and moving through a room.",
    icon: Home,
    id: "chores",
    label: "Household tasks",
  },
  {
    body: "Rhythm, balance, and large muscle groups.",
    icon: Activity,
    id: "dance",
    label: "Dancing",
  },
  {
    body: "Pushing, pulling, carrying, and changing levels.",
    icon: Sun,
    id: "garden",
    label: "Gardening",
  },
  {
    body: "A low-impact way to work many muscle groups.",
    icon: Waves,
    id: "swim",
    label: "Water movement",
  },
  {
    body: "Arm raises, band work, or other adapted options.",
    icon: Armchair,
    id: "seated",
    label: "Seated movement",
  },
] as const;

type EverydayMovementId = (typeof everydayMovements)[number]["id"];

const dayWindows = [
  { id: "morning", label: "Morning", note: "After getting ready" },
  { id: "midday", label: "Midday", note: "Between tasks" },
  { id: "afternoon", label: "Afternoon", note: "After a long sit" },
  { id: "evening", label: "Evening", note: "Around dinner" },
] as const;

type DayWindowId = (typeof dayWindows)[number]["id"];

const movementStudio = [
  { answer: "aerobic", id: "walking", label: "A comfortable walk" },
  { answer: "strength", id: "bands", label: "Resistance-band pulls" },
  { answer: "aerobic", id: "cycling", label: "Cycling" },
  { answer: "strength", id: "wall", label: "Wall push-ups" },
  { answer: "aerobic", id: "dancing", label: "Dancing" },
  { answer: "strength", id: "chair", label: "Sit-to-stand practice" },
] as const;

type StudioActivityId = (typeof movementStudio)[number]["id"];
type StudioCategory = "aerobic" | "strength";

const bodyBenefits = [
  {
    body: "Regular activity supports the heart and circulation.",
    icon: Heart,
    id: "heart",
    label: "Heart",
  },
  {
    body: "Movement can support balance, function, and everyday independence.",
    icon: PersonStanding,
    id: "function",
    label: "Function",
  },
  { body: "Physical activity can support sleep quality.", icon: Moon, id: "sleep", label: "Sleep" },
  { body: "Movement can support mood and reduce stress.", icon: Smile, id: "mood", label: "Mood" },
  {
    body: "Strength work helps maintain muscle and bone strength.",
    icon: Dumbbell,
    id: "strength",
    label: "Strength",
  },
  {
    body: "Working muscles use glucose as fuel.",
    icon: Sparkles,
    id: "glucose",
    label: "Glucose use",
  },
] as const;

type BodyBenefitId = (typeof bodyBenefits)[number]["id"];

const myths = [
  "Movement only counts when it happens at a gym.",
  "Several small bouts of activity can still be meaningful.",
  "Exercise only matters if the number on the scale changes.",
] as const;

const mythCorrections = [
  "Movement can happen at home, outside, in water, in a chair, or anywhere muscles work.",
  "Several small bouts can still give muscles useful work across a day.",
  "Movement supports glucose use, the heart, strength, mood, sleep, and function, even without a scale change.",
] as const;

const barriers = [
  { id: "time", label: "There is no spare hour." },
  { id: "energy", label: "My energy changes from day to day." },
  { id: "weather", label: "Weather or location gets in the way." },
  { id: "ability", label: "Walking is not comfortable or possible for me." },
] as const;

type BarrierId = (typeof barriers)[number]["id"];

const barrierOptions: Record<BarrierId, readonly string[]> = {
  time: [
    "Try one five-minute opening.",
    "Link movement to an existing task.",
    "Break activity into smaller bouts.",
  ],
  energy: [
    "Choose a gentler version.",
    "Use an energy window that tends to work better.",
    "Let a smaller effort still count.",
  ],
  weather: ["Use an indoor route.", "Move with music at home.", "Choose a safe community space."],
  ability: [
    "Try seated arm or band movements.",
    "Ask about adapted movement.",
    "Choose a comfortable range and pace.",
  ],
};

const planMovements = [
  "A short walk",
  "Seated movement",
  "Dancing",
  "Household movement",
  "Strength practice",
] as const;
const planAnchors = [
  "After one meal",
  "After getting dressed",
  "During a break",
  "Before an evening routine",
] as const;
const planDurations = [
  "5 minutes",
  "10 minutes",
  "One comfortable song",
  "A few movement breaks",
] as const;

const reflectionOptions = [
  "Movement feels less like punishment.",
  "I understand why working muscles use glucose.",
  "I can see more than one kind of activity that counts.",
  "I have one small option that could fit my week.",
  "I want to ask my care team about moving safely.",
  "I am still deciding what movement could look like for me.",
] as const;

function DayFiveHeading({ children, label }: { children: ReactNode; label?: string }) {
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

function ConceptFeedback({ feedback }: { feedback: DayFiveEvaluationFeedback }) {
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

export function DayFiveExperience({ lesson: experience }: { lesson: LessonPlayerViewModel }) {
  const router = useRouter();
  const [stage, setStage] = useState(0);
  const [openingFeeling, setOpeningFeeling] = useState<OpeningFeeling | null>(null);
  const [fuelCycles, setFuelCycles] = useState(0);
  const [mealJourney, setMealJourney] = useState(0);
  const [pathwaysSeen, setPathwaysSeen] = useState<Set<"during" | "regular">>(() => new Set());
  const [atlasOpened, setAtlasOpened] = useState<Set<EverydayMovementId>>(() => new Set());
  const [activeAtlas, setActiveAtlas] = useState<EverydayMovementId | null>(null);
  const [movementWindows, setMovementWindows] = useState<Set<DayWindowId>>(() => new Set());
  const [studioAnswers, setStudioAnswers] = useState<
    Partial<Record<StudioActivityId, StudioCategory>>
  >({});
  const [studioAttempts, setStudioAttempts] = useState(0);
  const [studioChecked, setStudioChecked] = useState(false);
  const [studioResolved, setStudioResolved] = useState(false);
  const [benefitsOpened, setBenefitsOpened] = useState<Set<BodyBenefitId>>(() => new Set());
  const [activeBenefit, setActiveBenefit] = useState<BodyBenefitId | null>(null);
  const [mythsOpened, setMythsOpened] = useState<Set<number>>(() => new Set());
  const [returnedAfterPause, setReturnedAfterPause] = useState(false);
  const [barrier, setBarrier] = useState<BarrierId | null>(null);
  const [barrierOption, setBarrierOption] = useState<string | null>(null);
  const [safetyCards, setSafetyCards] = useState<Set<string>>(() => new Set());
  const [planMovement, setPlanMovement] = useState<(typeof planMovements)[number] | null>(null);
  const [planAnchor, setPlanAnchor] = useState<(typeof planAnchors)[number] | null>(null);
  const [planDuration, setPlanDuration] = useState<(typeof planDurations)[number] | null>(null);
  const [supportChoice, setSupportChoice] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<string | null>(null);
  const [reflection, setReflection] = useState<(typeof reflectionOptions)[number] | null>(null);
  const [evaluations, setEvaluations] = useState<
    Partial<Record<EvaluationKey, DayFiveEvaluationFeedback>>
  >({});
  const [selectedAnswers, setSelectedAnswers] = useState<Partial<Record<EvaluationKey, string>>>(
    {},
  );
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const stageRef = useRef<HTMLDivElement>(null);
  const storageKey = `health-decoded:day-five:${experience.lessonProgressId}`;

  const studioAccurate = movementStudio.every((item) => studioAnswers[item.id] === item.answer);

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
    const result = await evaluateDayFiveAction(input);
    if (result.ok) setEvaluations((current) => ({ ...current, [key]: result.data }));
    else setMessage(result.message);
  }

  function checkStudio() {
    const nextAttempt = studioAttempts + 1;
    setStudioAttempts(nextAttempt);
    setStudioChecked(true);
    if (!studioAccurate && nextAttempt >= 2) {
      const revealed = Object.fromEntries(
        movementStudio.map((item) => [item.id, item.answer]),
      ) as Record<StudioActivityId, StudioCategory>;
      setStudioAnswers(revealed);
      setStudioResolved(true);
    }
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
    if (stage === 0) return openingFeeling !== null;
    if (stage === 1) return fuelCycles >= 3;
    if (stage === 2) return pathwaysSeen.size === 2;
    if (stage === 3) return atlasOpened.size >= 4;
    if (stage === 4) return movementWindows.size >= 2;
    if (stage === 5) return studioAccurate || studioResolved;
    if (stage === 6) return benefitsOpened.size >= 4;
    if (stage === 7) return mealJourney >= 3;
    if (stage === 8) return mythsOpened.size === myths.length;
    if (stage === 9) return returnedAfterPause;
    if (stage === 10) return barrier !== null && barrierOption !== null;
    if (stage === 11) return safetyCards.size === 3 && Boolean(evaluations.safety);
    if (stage === 12) return planMovement !== null && planAnchor !== null && planDuration !== null;
    if (stage === 13) return supportChoice !== null;
    if (stage === 14) return Boolean(evaluations.teachBack) && confidence !== null;
    return reflection !== null;
  }

  function stageRequirement() {
    const requirements = [
      "Choose the sentence closest to how exercise feels right now.",
      "Activate the muscle three times and watch the full fuel cycle.",
      "Open both timeframes in the movement mechanism.",
      "Open at least four kinds of everyday movement.",
      "Add two realistic movement openings to the day.",
      "Sort all six activities. After two attempts, the studio will reveal the answer.",
      "Open at least four benefits that are not about earning food.",
      "Move the meal-time visual through all three transitions.",
      "Open all three narrow rules to reveal the wider truth.",
      "Use the return button after the interrupted day.",
      "Choose one real barrier and one workable response.",
      "Open all three safety notes and choose the safe medication response.",
      "Choose a movement, an anchor, and a small starting amount.",
      "Choose one kind of support that would protect your plan.",
      "Choose a plain-language explanation and a confidence response.",
      "Choose one reflection to complete Day 5.",
    ];
    return requirements[stage];
  }

  function continueLabel() {
    const labels = [
      "See what working muscles do",
      "Follow the second pathway",
      "Find movement beyond the gym",
      "Build movement into a real day",
      "Visit the movement studio",
      "See what else movement supports",
      "Walk through a meal-time option",
      "Clear the all-or-nothing myths",
      "Practice returning",
      "Work with a real barrier",
      "Start with safety",
      "Build one first-week plan",
      "Protect the plan with support",
      "Explain it in plain language",
      "Choose what you will carry forward",
    ] as const;
    return labels[stage] ?? "Continue";
  }

  function renderStage() {
    switch (stage) {
      case 0:
        return (
          <div className="space-y-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_19rem] lg:items-end">
              <DayFiveHeading label="Day 05 · Movement: your body's secret superpower">
                Movement can begin before motivation does.
              </DayFiveHeading>
              <div className="border-l-2 border-success pl-6">
                <p className="editorial-number text-success">05</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  No gym test. No food debt. One body mechanism and one realistic opening.
                </p>
              </div>
            </div>
            <div className="grid gap-8 border-y border-border py-9 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div
                className={cn(
                  styles.motionSampler,
                  "relative grid min-h-72 grid-cols-2 gap-px overflow-hidden rounded-[2.5rem_2.5rem_1rem_1rem] border border-success/20 bg-success/20 p-px",
                )}
                aria-label="Four animated examples of ordinary movement: walking, household movement, dancing, and seated movement"
                role="img"
              >
                {[
                  { icon: Footprints, label: "Walk" },
                  { icon: Home, label: "Chores" },
                  { icon: Activity, label: "Dance" },
                  { icon: Armchair, label: "Seated" },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      className={cn(
                        styles.motionSample,
                        "flex flex-col items-center justify-center bg-[#e5eee8]",
                      )}
                      key={item.label}
                      style={{ animationDelay: `${index * 130}ms` }}
                    >
                      <Icon className="size-10 text-success" strokeWidth={1.35} />
                      <span className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-success">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
                <span className={styles.motionPulse} aria-hidden="true" />
              </div>
              <div className="space-y-5 text-lg leading-8 text-foreground/80">
                <p>
                  After diagnosis, the word <em>exercise</em> can sound like a command: become
                  athletic, lose weight, never miss a day.
                </p>
                <p>
                  This lesson starts somewhere more useful. Working muscles need fuel. Physical
                  activity gives them a reason to use it, whether movement happens in a gym, a
                  kitchen, a garden, a pool, or a chair.
                </p>
                <p className="font-serif-display text-2xl italic text-foreground">
                  Your body responds to movement, not perfection.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <p className="font-semibold">What does the word “exercise” bring up for you today?</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {openingFeelings.map(([id, label]) => (
                  <AnswerChoice
                    key={id}
                    onClick={() => setOpeningFeeling(id)}
                    selected={openingFeeling === id}
                  >
                    {label}
                  </AnswerChoice>
                ))}
              </div>
              {openingFeeling ? (
                <p className="animate-slide-up border-l-2 border-success bg-info p-5 leading-7">
                  {openingResponses[openingFeeling]}
                </p>
              ) : null}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-9">
            <DayFiveHeading label="The muscle fuel room">
              Give glucose somewhere useful to go.
            </DayFiveHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Glucose is fuel, but it has to enter cells to be useful. Contracting muscles ask for
              more energy. Activate the muscle and watch the teaching model.
            </p>
            <LessonMotionFigure variant="muscle-fuel" />
            <div
              className={cn(
                styles.fuelRoom,
                "relative overflow-hidden rounded-[1.5rem] border border-accent-warm/30 bg-[#f1e4da] p-6 sm:p-10",
              )}
            >
              <div className="grid min-h-72 gap-8 sm:grid-cols-[1fr_13rem] sm:items-center">
                <div
                  className="relative h-28 overflow-hidden rounded-full border-2 border-accent-warm/35 bg-[#e7bba9]/55"
                  aria-label={`${Math.min(fuelCycles, 3)} of 3 glucose groups have moved toward the working muscle`}
                  role="img"
                >
                  {[0, 1, 2, 3, 4].map((dot) => (
                    <span
                      className={cn(
                        styles.glucoseDot,
                        fuelCycles > dot % 3 && styles.glucoseMoving,
                      )}
                      key={dot}
                      style={{
                        left: `${10 + dot * 14}%`,
                        top: `${24 + (dot % 2) * 34}%`,
                        transitionDelay: `${dot * 70}ms`,
                      }}
                    >
                      <span className="sr-only">Glucose</span>
                    </span>
                  ))}
                </div>
                <div
                  className={cn(
                    styles.muscleCell,
                    fuelCycles > 0 && styles.muscleActive,
                    "relative mx-auto flex size-48 items-center justify-center rounded-full border-[10px] border-success/25 bg-[#dfe9df] text-center shadow-card",
                  )}
                >
                  <div>
                    <Dumbbell aria-hidden="true" className="mx-auto size-10 text-success" />
                    <p className="mt-2 font-semibold">Working muscle</p>
                    <p className="mt-1 text-xs text-muted-foreground">uses fuel</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-accent-warm/20 pt-6">
                <Button
                  fullWidth={false}
                  onClick={() => setFuelCycles((current) => Math.min(3, current + 1))}
                  disabled={fuelCycles >= 3}
                >
                  <Activity className="size-4" /> Contract the muscle
                </Button>
                <p className="text-sm text-muted-foreground">
                  Fuel requests completed: {Math.min(fuelCycles, 3)} of 3
                </p>
              </div>
            </div>
            {fuelCycles >= 3 ? (
              <div
                className={cn(
                  styles.energyReveal,
                  "grid gap-px overflow-hidden rounded-[1.25rem] border border-border bg-border sm:grid-cols-3",
                )}
              >
                {[
                  ["01", "Muscle contracts", "The working muscle asks for energy."],
                  ["02", "Glucose enters", "Fuel moves from the blood toward the muscle cell."],
                  ["03", "Energy is used", "Glucose is used or stored, it is not erased."],
                ].map(([number, title, body]) => (
                  <div className="bg-card p-5" key={number}>
                    <span className="font-serif-display text-4xl text-accent-warm">{number}</span>
                    <h2 className="mt-6 font-serif-display text-2xl">{title}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
                  </div>
                ))}
              </div>
            ) : null}
            <p className="border-l-2 border-success bg-info px-5 py-4 text-sm leading-6 text-foreground/75">
              A simplified model: muscle contraction can increase glucose uptake. It does not
              predict how far any person’s glucose will move.
            </p>
          </div>
        );
      case 2:
        return (
          <div className="space-y-9">
            <DayFiveHeading label="Two pathways, one useful tool">
              Movement helps now, and regular movement can help later.
            </DayFiveHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              There are two ideas worth separating. Open each pathway to see what changes.
            </p>
            <div className="grid gap-5 md:grid-cols-2">
              {[
                {
                  body: "When muscles contract, they can take up glucose for energy through pathways that do not depend entirely on insulin.",
                  id: "during" as const,
                  label: "During activity",
                  number: "01",
                },
                {
                  body: "With regular activity, cells can become more sensitive to insulin, so the signal works more effectively.",
                  id: "regular" as const,
                  label: "With repetition",
                  number: "02",
                },
              ].map((pathway) => (
                <button
                  aria-pressed={pathwaysSeen.has(pathway.id)}
                  className={cn(
                    styles.pathwayPanel,
                    "motion-tactile min-h-72 rounded-[1.4rem] border p-7 text-left",
                    pathwaysSeen.has(pathway.id)
                      ? "border-success bg-info"
                      : "border-border bg-card",
                  )}
                  key={pathway.id}
                  onClick={() => setPathwaysSeen((current) => new Set([...current, pathway.id]))}
                  type="button"
                >
                  <span className="font-serif-display text-6xl text-accent-warm/70">
                    {pathway.number}
                  </span>
                  <h2 className="mt-8 font-serif-display text-3xl">{pathway.label}</h2>
                  <p
                    className={cn(
                      "mt-4 leading-7",
                      pathwaysSeen.has(pathway.id) ? "text-foreground/80" : "text-muted-foreground",
                    )}
                  >
                    {pathwaysSeen.has(pathway.id) ? pathway.body : "Open this pathway"}
                  </p>
                </button>
              ))}
            </div>
            {pathwaysSeen.size === 2 ? (
              <div
                className={cn(
                  styles.pathwayBridge,
                  "relative overflow-hidden rounded-[1.25rem] border border-success/25 bg-info p-6 sm:p-8",
                )}
              >
                <div className="flex items-center gap-4">
                  <Activity className="size-8 shrink-0 text-success" />
                  <span className="h-px flex-1 bg-success/35" />
                  <Sparkles className="size-8 shrink-0 text-success" />
                  <span className="h-px flex-1 bg-success/35" />
                  <ShieldCheck className="size-8 shrink-0 text-success" />
                </div>
                <p className="mt-6 font-serif-display text-2xl italic text-success">
                  Movement can help muscles use fuel now. Repeated activity can help the insulin
                  signal work more effectively over time.
                </p>
              </div>
            ) : null}
          </div>
        );
      case 3: {
        const selected = everydayMovements.find((item) => item.id === activeAtlas);
        return (
          <div className="space-y-9">
            <DayFiveHeading label="An atlas of ordinary movement">
              The gym does not own movement.
            </DayFiveHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Your muscles do not check where activity happened. Open four places movement can
              already live.
            </p>
            <div
              className={cn(
                styles.movementAtlas,
                "grid gap-px overflow-hidden rounded-[1.5rem] border border-border bg-border sm:grid-cols-2 lg:grid-cols-3",
              )}
            >
              {everydayMovements.map((item) => {
                const Icon = item.icon;
                const opened = atlasOpened.has(item.id);
                return (
                  <button
                    aria-pressed={opened}
                    className={cn(
                      "motion-tactile min-h-48 bg-card p-6 text-left",
                      opened && "bg-[#e5eee8]",
                    )}
                    key={item.id}
                    onClick={() => {
                      setActiveAtlas(item.id);
                      setAtlasOpened((current) => new Set([...current, item.id]));
                    }}
                    type="button"
                  >
                    <Icon
                      aria-hidden="true"
                      className={cn("size-8", opened ? "text-success" : "text-accent-warm")}
                      strokeWidth={1.5}
                    />
                    <h2 className="mt-8 font-serif-display text-2xl">{item.label}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {opened ? "Added to the map" : "Open this place"}
                    </p>
                  </button>
                );
              })}
            </div>
            {selected ? (
              <div className="animate-slide-up flex gap-4 border-l-2 border-success bg-info p-5">
                <Footprints aria-hidden="true" className="mt-1 size-5 shrink-0 text-success" />
                <p className="leading-7">
                  <strong>{selected.label}:</strong> {selected.body}
                </p>
              </div>
            ) : null}
            <p className="text-sm text-muted-foreground">
              Places opened: {atlasOpened.size} of {everydayMovements.length}. Four are enough to
              continue.
            </p>
          </div>
        );
      }
      case 4:
        return (
          <div className="space-y-9">
            <DayFiveHeading label="A day with openings">
              Small bouts can interrupt a long stretch of sitting.
            </DayFiveHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Do not search for a missing hour. Add two short movement openings to this ordinary
              day.
            </p>
            <div className="rounded-[1.5rem] border border-border bg-card p-5 sm:p-8">
              <div className="relative grid gap-4 lg:grid-cols-4">
                <span
                  aria-hidden="true"
                  className="absolute left-[8%] right-[8%] top-12 hidden h-px bg-border lg:block"
                />
                {dayWindows.map((window) => {
                  const active = movementWindows.has(window.id);
                  return (
                    <button
                      aria-pressed={active}
                      className={cn(
                        styles.dayWindow,
                        "motion-tactile relative min-h-48 rounded-[1rem] border p-5 text-left",
                        active ? "border-success bg-info" : "border-border bg-background",
                      )}
                      key={window.id}
                      onClick={() =>
                        setMovementWindows((current) => {
                          const next = new Set(current);
                          if (next.has(window.id)) next.delete(window.id);
                          else next.add(window.id);
                          return next;
                        })
                      }
                      type="button"
                    >
                      <span
                        className={cn(
                          "relative z-10 inline-flex size-10 items-center justify-center rounded-full border",
                          active ? "border-success bg-success text-white" : "border-border bg-card",
                        )}
                      >
                        <Clock3 className="size-4" />
                      </span>
                      <h2 className="mt-8 font-serif-display text-2xl">{window.label}</h2>
                      <p className="mt-2 text-sm text-muted-foreground">{window.note}</p>
                      <p
                        className={cn(
                          "mt-5 text-sm font-semibold",
                          active ? "text-success" : "text-accent-warm",
                        )}
                      >
                        {active ? "Movement opening added" : "+ Add a short opening"}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
              <p className="font-serif-display text-5xl text-success">{movementWindows.size}</p>
              <p className="max-w-xl leading-7 text-foreground/75">
                {movementWindows.size >= 2
                  ? "Two openings are enough to change the shape of the day. They do not need to become long workouts."
                  : "Choose any two moments that could hold a brief stand, stretch, walk, or adapted movement."}
              </p>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-9">
            <DayFiveHeading label="The movement studio">
              Two kinds of work. Different benefits. Same body.
            </DayFiveHeading>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="border-l-2 border-accent-warm pl-5">
                <Bike className="size-7 text-accent-warm" />
                <h2 className="mt-4 font-serif-display text-3xl">Aerobic activity</h2>
                <p className="mt-2 leading-7 text-foreground/75">
                  Uses large muscle groups continuously and supports the heart, lungs, and
                  endurance.
                </p>
              </div>
              <div className="border-l-2 border-success pl-5">
                <Dumbbell className="size-7 text-success" />
                <h2 className="mt-4 font-serif-display text-3xl">Strength activity</h2>
                <p className="mt-2 leading-7 text-foreground/75">
                  Makes muscles work against resistance and supports strength, function, muscles,
                  and bones.
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {movementStudio.map((item) => (
                <div
                  className={cn(
                    "rounded-[1rem] border bg-card p-5",
                    studioChecked && studioAnswers[item.id] === item.answer
                      ? "border-success"
                      : "border-border",
                  )}
                  key={item.id}
                >
                  <p className="font-semibold">{item.label}</p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {(["aerobic", "strength"] as const).map((category) => (
                      <button
                        aria-pressed={studioAnswers[item.id] === category}
                        className={cn(
                          "min-h-11 rounded-md border px-3 text-sm font-semibold",
                          studioAnswers[item.id] === category
                            ? "border-accent-warm bg-accent-warm/10"
                            : "border-border",
                        )}
                        disabled={studioResolved}
                        key={category}
                        onClick={() => {
                          setStudioChecked(false);
                          setStudioAnswers((current) => ({ ...current, [item.id]: category }));
                        }}
                        type="button"
                      >
                        {category === "aerobic" ? "Aerobic" : "Strength"}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button
                fullWidth={false}
                disabled={
                  Object.keys(studioAnswers).length < movementStudio.length || studioResolved
                }
                onClick={checkStudio}
              >
                Check the studio
              </Button>
              <p className="text-sm text-muted-foreground">
                {studioResolved
                  ? "The studio revealed every match so you can continue."
                  : `Attempt ${studioAttempts} of 2 before the answer is revealed.`}
              </p>
            </div>
            {studioChecked ? (
              <p
                aria-live="polite"
                className={cn(
                  "border-l-2 p-5 leading-7",
                  studioAccurate || studioResolved
                    ? "border-success bg-info"
                    : "border-warning bg-warning/10",
                )}
                role="status"
              >
                {studioAccurate || studioResolved
                  ? "Every activity has a clear home. Real routines can include both kinds, adapted to the person."
                  : "A few movements are still in the wrong studio. Look at whether the activity is continuous or works against resistance."}
              </p>
            ) : null}
          </div>
        );
      case 6: {
        const selected = bodyBenefits.find((benefit) => benefit.id === activeBenefit);
        return (
          <div className="space-y-9">
            <DayFiveHeading label="A wider field of benefits">
              Movement is doing more than burning calories.
            </DayFiveHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Open four parts of the body-wide story. None depends on becoming an athlete.
            </p>
            <div
              className={cn(
                styles.benefitField,
                "relative grid gap-3 rounded-[48%_48%_1.5rem_1.5rem] bg-[#e5eee8] p-6 sm:grid-cols-2 sm:p-10 lg:grid-cols-3",
              )}
            >
              {bodyBenefits.map((benefit) => {
                const Icon = benefit.icon;
                const opened = benefitsOpened.has(benefit.id);
                return (
                  <button
                    aria-pressed={opened}
                    className={cn(
                      "motion-tactile min-h-36 rounded-[45%] border bg-card p-5 text-center shadow-card",
                      opened && "border-success bg-[#f8f5ef]",
                    )}
                    key={benefit.id}
                    onClick={() => {
                      setActiveBenefit(benefit.id);
                      setBenefitsOpened((current) => new Set([...current, benefit.id]));
                    }}
                    type="button"
                  >
                    <Icon
                      aria-hidden="true"
                      className={cn("mx-auto size-7", opened ? "text-success" : "text-accent-warm")}
                    />
                    <p className="mt-4 font-semibold">{benefit.label}</p>
                  </button>
                );
              })}
            </div>
            {selected ? (
              <p className="animate-slide-up border-l-2 border-success bg-info p-5 text-lg leading-8">
                {selected.body}
              </p>
            ) : null}
          </div>
        );
      }
      case 7:
        return (
          <div className="space-y-9">
            <DayFiveHeading label="One possible moment">
              After a meal, movement can give fuel a job.
            </DayFiveHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Move the scene forward. The visual shows one optional sequence, not a requirement to
              exercise after every meal and not a promise about a specific reading.
            </p>
            <LessonMotionFigure variant="circulation-rhythm" />
            <div
              className={cn(
                styles.mealJourney,
                "relative overflow-hidden rounded-[1.5rem] border border-accent-warm/25 bg-[#f2e7de] p-6 sm:p-9",
              )}
            >
              <div className="grid grid-cols-4 gap-2">
                {["Meal", "Digestion", "Movement", "Fuel used"].map((label, index) => (
                  <div className="text-center" key={label}>
                    <span
                      className={cn(
                        "mx-auto flex size-10 items-center justify-center rounded-full border text-sm font-bold",
                        mealJourney >= index
                          ? "border-success bg-success text-white"
                          : "border-border bg-card text-muted-foreground",
                      )}
                    >
                      {index + 1}
                    </span>
                    <span className="mt-2 hidden text-xs font-semibold sm:block">{label}</span>
                  </div>
                ))}
              </div>
              <div className="relative mt-8 min-h-64 border-y border-accent-warm/20">
                <div className="absolute left-[4%] top-1/2 flex size-24 -translate-y-1/2 items-center justify-center rounded-full border border-accent-warm/30 bg-card">
                  <Utensils className="size-9 text-accent-warm" />
                </div>
                <span className="absolute left-[18%] right-[18%] top-1/2 h-16 -translate-y-1/2 rounded-full border border-accent-warm/25 bg-[#e9bca9]/45" />
                {[0, 1, 2, 3, 4].map((dot) => (
                  <span
                    className={cn(
                      styles.mealGlucose,
                      mealJourney >= 1 && styles.mealGlucoseReleased,
                      mealJourney >= 3 && styles.mealGlucoseUsed,
                    )}
                    key={dot}
                    style={{ top: `${40 + (dot % 2) * 18}%`, transitionDelay: `${dot * 90}ms` }}
                  />
                ))}
                <div className="absolute right-[3%] top-1/2 flex size-28 -translate-y-1/2 items-center justify-center rounded-[45%] border-8 border-success/25 bg-[#dfe9df] text-center">
                  <div>
                    <Dumbbell className="mx-auto size-7 text-success" />
                    <span className="mt-1 block text-xs font-semibold">Muscle</span>
                  </div>
                </div>
                <div
                  className={cn(
                    styles.mealWalker,
                    mealJourney >= 2 && styles.mealWalkerMoving,
                    "absolute bottom-3 left-[28%] h-16 w-10",
                  )}
                  aria-hidden="true"
                >
                  <span className="absolute left-2 top-0 size-6 rounded-full bg-[#c79679]" />
                  <span className="absolute bottom-0 left-2 h-11 w-6 rounded-t-full bg-accent-warm" />
                  <span className={styles.mealWalkerLegOne} />
                  <span className={styles.mealWalkerLegTwo} />
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <p className="max-w-xl leading-7 text-foreground/75">
                  {
                    [
                      "A meal supplies the body with fuel.",
                      "Digestion releases glucose into the bloodstream.",
                      "Comfortable movement asks muscles to work.",
                      "Working muscles can take up and use fuel. The meal was not erased or repaid.",
                    ][mealJourney]
                  }
                </p>
                <Button
                  disabled={mealJourney >= 3}
                  fullWidth={false}
                  onClick={() => setMealJourney((current) => Math.min(3, current + 1))}
                >
                  {mealJourney >= 3 ? (
                    <>
                      <Check className="size-4" /> Sequence complete
                    </>
                  ) : (
                    <>
                      Move the moment forward <MoveRight className="size-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="space-y-9">
            <DayFiveHeading label="Rules worth reopening">
              Three movement rules became too small for real life.
            </DayFiveHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Open each narrow rule. The paper does not disappear; it unfolds into an explanation
              that leaves more room for different bodies, schedules, and lives.
            </p>
            <div className="grid gap-5 lg:grid-cols-3">
              {myths.map((myth, index) => {
                const opened = mythsOpened.has(index);

                return (
                  <button
                    aria-expanded={opened}
                    className={cn(
                      styles.mythSheet,
                      opened && styles.mythSheetOpen,
                      "relative overflow-hidden rounded-[1.35rem] border border-border bg-card p-6 text-left shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:p-7",
                    )}
                    key={myth}
                    onClick={() =>
                      setMythsOpened((current) => {
                        const next = new Set(current);
                        next.add(index);
                        return next;
                      })
                    }
                    type="button"
                  >
                    <span className="editorial-eyebrow">
                      Rule {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-5 block font-serif-display text-2xl leading-tight">
                      “{myth}”
                    </span>
                    <span className={cn(styles.mythFold, "mt-7 block border-t border-border pt-5")}>
                      {opened ? (
                        <span className={styles.mythCorrection}>
                          <Check
                            aria-hidden="true"
                            className="mt-0.5 size-5 shrink-0 text-success"
                          />
                          <span>{mythCorrections[index]}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 font-bold text-accent-warm">
                          Open this rule <MoveRight aria-hidden="true" className="size-4" />
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
            {mythsOpened.size === myths.length ? (
              <div
                className={cn(
                  styles.widerTruth,
                  "border-l-2 border-success bg-info px-6 py-5 font-serif-display text-2xl italic text-success",
                )}
              >
                Movement can be flexible and still be meaningful.
              </div>
            ) : null}
          </div>
        );
      case 9:
        return (
          <div className="space-y-9">
            <DayFiveHeading label="Consistency without perfection">
              A pause is not the end of the path.
            </DayFiveHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Real routines are interrupted by illness, travel, work, caregiving, weather, and
              ordinary exhaustion. Practice the part that actually builds consistency: returning.
            </p>
            <div className="rounded-[1.5rem] border border-border bg-card p-6 sm:p-9">
              <div className="grid grid-cols-7 gap-2">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => {
                  const pause = index === 3;
                  const returned = returnedAfterPause && index > 3;
                  return (
                    <div
                      className={cn(
                        styles.weekDay,
                        "flex aspect-[0.8] flex-col items-center justify-center rounded-[1rem] border text-center",
                        pause
                          ? "border-dashed border-muted-foreground/40 bg-muted"
                          : returned || index < 3
                            ? "border-success/35 bg-info"
                            : "border-border bg-background",
                      )}
                      key={`${day}-${index}`}
                      style={{ animationDelay: `${index * 90}ms` }}
                    >
                      <span className="text-xs font-bold text-muted-foreground">{day}</span>
                      {pause ? (
                        <span className="mt-3 text-xs">Paused</span>
                      ) : (
                        <Footprints
                          aria-hidden="true"
                          className={cn(
                            "mt-3 size-5",
                            returned || index < 3 ? "text-success" : "text-border",
                          )}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 flex flex-col items-start gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-xl leading-7 text-foreground/75">
                  Thursday did not erase Monday through Wednesday. The next useful action is simply
                  another beginning.
                </p>
                <Button
                  fullWidth={false}
                  disabled={returnedAfterPause}
                  onClick={() => setReturnedAfterPause(true)}
                >
                  {returnedAfterPause ? (
                    <>
                      <Check className="size-4" /> Returned
                    </>
                  ) : (
                    "Return on Friday"
                  )}
                </Button>
              </div>
            </div>
            {returnedAfterPause ? (
              <p className="animate-slide-up font-serif-display text-3xl italic text-success">
                Consistency means coming back, not never stopping.
              </p>
            ) : null}
          </div>
        );
      case 10:
        return (
          <div className="space-y-9">
            <DayFiveHeading label="A barrier is information">
              Design around the real obstacle.
            </DayFiveHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              “Try harder” is not a plan. Choose one barrier, then choose one smaller door that
              could work around it.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {barriers.map((item) => (
                <AnswerChoice
                  key={item.id}
                  onClick={() => {
                    setBarrier(item.id);
                    setBarrierOption(null);
                  }}
                  selected={barrier === item.id}
                >
                  {item.label}
                </AnswerChoice>
              ))}
            </div>
            {barrier ? (
              <div
                className={cn(
                  styles.barrierDoor,
                  "animate-slide-up rounded-[1.5rem] border border-accent-warm/25 bg-[#f1e4da] p-6 sm:p-8",
                )}
              >
                <p className="editorial-eyebrow">A smaller door</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {barrierOptions[barrier].map((option) => (
                    <button
                      aria-pressed={barrierOption === option}
                      className={cn(
                        "motion-tactile min-h-32 rounded-[0.8rem] border bg-card p-5 text-left leading-6 shadow-card",
                        barrierOption === option && "border-success bg-info",
                      )}
                      key={option}
                      onClick={() => setBarrierOption(option)}
                      type="button"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            {barrierOption ? (
              <p className="border-l-2 border-success bg-info p-5 leading-7">
                That option is not a promise or a prescription. It is a realistic experiment you can
                adapt or discuss with your care team.
              </p>
            ) : null}
          </div>
        );
      case 11:
        return (
          <div className="space-y-9">
            <DayFiveHeading label="Safety before intensity">
              A good start respects the body you have today.
            </DayFiveHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Open all three safety notes. This is general education; your care team can account for
              your health, medicines, symptoms, and abilities.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  body: "Begin gradually and choose an activity that feels stable and manageable.",
                  id: "gradual",
                  label: "Start where you are",
                },
                {
                  body: "Comfortable footwear, water, and a safe setting support a steadier start.",
                  id: "setup",
                  label: "Set up for comfort",
                },
                {
                  body: "Stop if something feels wrong. Chest pain, fainting, severe shortness of breath, or another concerning symptom needs prompt medical attention.",
                  id: "listen",
                  label: "Listen and respond",
                },
              ].map((card) => {
                const opened = safetyCards.has(card.id);
                return (
                  <button
                    aria-pressed={opened}
                    className={cn(
                      "motion-tactile min-h-60 rounded-[1.2rem] border p-6 text-left",
                      opened ? "border-success bg-info" : "border-border bg-card",
                    )}
                    key={card.id}
                    onClick={() => setSafetyCards((current) => new Set([...current, card.id]))}
                    type="button"
                  >
                    <ShieldCheck
                      aria-hidden="true"
                      className={cn("size-7", opened ? "text-success" : "text-accent-warm")}
                    />
                    <h2 className="mt-7 font-serif-display text-2xl">{card.label}</h2>
                    <p className="mt-4 text-sm leading-6 text-foreground/75">
                      {opened ? card.body : "Open this note"}
                    </p>
                  </button>
                );
              })}
            </div>
            {safetyCards.size === 3 ? (
              <div className="space-y-4">
                <p className="font-semibold">
                  If someone uses insulin or a diabetes medicine that can cause low blood glucose,
                  what is the safe next step before changing activity?
                </p>
                <div className="grid gap-3">
                  {(
                    [
                      [
                        "ask_care_team",
                        "Ask the care team whether monitoring, food, or medicine planning is needed.",
                      ],
                      ["stop_medicine", "Stop the medicine before being active."],
                      ["push_through", "Ignore symptoms and push through the activity."],
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
                </div>
                {evaluations.safety ? <ConceptFeedback feedback={evaluations.safety} /> : null}
              </div>
            ) : null}
          </div>
        );
      case 12:
        return (
          <div className="space-y-9">
            <DayFiveHeading label="Your first-week draft">
              Make one action small enough to begin.
            </DayFiveHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              This plan stays in this lesson and is not saved as health information. Choose a
              movement, an anchor, and a starting amount that feels possible, not impressive.
            </p>
            <div className="space-y-8 rounded-[1.5rem] border border-border bg-card p-6 shadow-card sm:p-9">
              <fieldset>
                <legend className="font-serif-display text-2xl">1. What kind of movement?</legend>
                <div className="mt-4 flex flex-wrap gap-2">
                  {planMovements.map((option) => (
                    <button
                      aria-pressed={planMovement === option}
                      className={cn(
                        "min-h-12 rounded-full border px-5 font-semibold",
                        planMovement === option
                          ? "border-success bg-info text-success"
                          : "border-border",
                      )}
                      key={option}
                      onClick={() => setPlanMovement(option)}
                      type="button"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset className="border-t border-border pt-7">
                <legend className="font-serif-display text-2xl">2. What can remind you?</legend>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {planAnchors.map((option) => (
                    <AnswerChoice
                      key={option}
                      onClick={() => setPlanAnchor(option)}
                      selected={planAnchor === option}
                    >
                      {option}
                    </AnswerChoice>
                  ))}
                </div>
              </fieldset>
              <fieldset className="border-t border-border pt-7">
                <legend className="font-serif-display text-2xl">
                  3. What is a gentle starting amount?
                </legend>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {planDurations.map((option) => (
                    <AnswerChoice
                      key={option}
                      onClick={() => setPlanDuration(option)}
                      selected={planDuration === option}
                    >
                      {option}
                    </AnswerChoice>
                  ))}
                </div>
              </fieldset>
            </div>
            {planMovement && planAnchor && planDuration ? (
              <div
                className={cn(
                  styles.planTicket,
                  "animate-slide-up border-y-2 border-success/40 bg-info px-6 py-8 sm:px-10",
                )}
              >
                <p className="editorial-eyebrow text-success">A first-week draft</p>
                <p className="mt-4 font-serif-display text-3xl leading-tight">
                  {planMovement}, {planDuration.toLowerCase()}, {planAnchor.toLowerCase()}.
                </p>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  Adapt it, pause it, or discuss it with your care team. The plan serves you; you do
                  not serve the plan.
                </p>
              </div>
            ) : null}
          </div>
        );
      case 13:
        return (
          <div className="space-y-9">
            <DayFiveHeading label="Make support concrete">
              Protect the opening instead of policing the effort.
            </DayFiveHeading>
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div
                className={cn(
                  styles.walkTogether,
                  supportChoice && styles.walkTogetherActive,
                  "relative min-h-80 overflow-hidden rounded-[42%] bg-[#e5eee8]",
                )}
                aria-label="A teaching illustration of two people walking together at the same pace"
                role="img"
              >
                <span className={styles.walkPath} aria-hidden="true" />
                <span className={styles.walkSun} aria-hidden="true" />
                <span className={styles.walkTree} aria-hidden="true">
                  <span />
                </span>
                <span className={styles.walkingGroup} aria-hidden="true">
                  {["#bd7158", "#6f947a"].map((color, index) => (
                    <span className={styles.walker} key={color}>
                      <span className={styles.walkerHead} />
                      <span className={styles.walkerBody} style={{ backgroundColor: color }} />
                      <span className={styles.walkerArm} style={{ backgroundColor: color }} />
                      <span className={styles.walkerArmBack} style={{ backgroundColor: color }} />
                      <span className={styles.walkerLeg} />
                      <span className={styles.walkerLegBack} />
                      {index === 0 ? <span className={styles.walkerSpeech}>Together?</span> : null}
                    </span>
                  ))}
                </span>
                <span className={styles.walkPrompt}>
                  {supportChoice
                    ? "A shared pace, not supervision."
                    : "Choose the support that fits."}
                </span>
              </div>
              <div className="space-y-4">
                <p className="text-lg leading-8 text-foreground/80">
                  Support does not have to mean supervision. It can make one small action easier to
                  begin or repeat.
                </p>
                {[
                  "Invite someone to join one comfortable walk or activity.",
                  "Ask someone to protect ten quiet minutes from interruptions.",
                  "Choose encouragement without scorekeeping.",
                  "Keep the plan private and ask for space instead.",
                ].map((option) => (
                  <AnswerChoice
                    key={option}
                    onClick={() => setSupportChoice(option)}
                    selected={supportChoice === option}
                  >
                    {option}
                  </AnswerChoice>
                ))}
              </div>
            </div>
            {supportChoice ? (
              <p className="border-l-2 border-success bg-info p-5 leading-7">
                <strong>Your boundary:</strong> {supportChoice}
              </p>
            ) : null}
          </div>
        );
      case 14:
        return (
          <div className="space-y-9">
            <DayFiveHeading label="Teach it back">
              What makes movement a glucose tool?
            </DayFiveHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Choose the explanation you would give a friend. A useful explanation should be
              accurate without turning movement into punishment.
            </p>
            <div className="grid gap-3">
              {(
                [
                  [
                    "movement_is_tool",
                    "Working muscles use glucose, regular activity can improve insulin sensitivity, and small, safe bouts can count.",
                  ],
                  ["only_gym_counts", "Only a formal gym workout is strong enough to help."],
                  [
                    "perfect_or_none",
                    "Movement only matters when the routine is perfect and uninterrupted.",
                  ],
                ] as const
              ).map(([answer, label]) => (
                <AnswerChoice
                  key={answer}
                  onClick={() => evaluate({ answer, stage: "teach_back" }, "teachBack", answer)}
                  selected={selectedAnswers.teachBack === answer}
                >
                  {label}
                </AnswerChoice>
              ))}
            </div>
            {evaluations.teachBack ? <ConceptFeedback feedback={evaluations.teachBack} /> : null}
            {evaluations.teachBack ? (
              <div className="border-t border-border pt-7">
                <p className="font-semibold">
                  How confident do you feel explaining one way movement changes glucose use?
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["I can explain it", "I have the main idea", "I want to review the visual"].map(
                    (option) => (
                      <button
                        aria-pressed={confidence === option}
                        className={cn(
                          "min-h-12 rounded-full border px-5 font-semibold",
                          confidence === option
                            ? "border-success bg-info text-success"
                            : "border-border",
                        )}
                        key={option}
                        onClick={() => setConfidence(option)}
                        type="button"
                      >
                        {option}
                      </button>
                    ),
                  )}
                </div>
              </div>
            ) : null}
          </div>
        );
      default:
        return (
          <div className="space-y-10">
            <div className="text-center">
              <p className="editorial-eyebrow">Day 5 · Complete</p>
              <h1 className="mt-5 font-serif-display text-[length:var(--text-hero)] font-normal leading-[0.9]">
                Your body already knows how to begin.
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                Movement gives working muscles a reason to use fuel. It can be small, adapted,
                interrupted, and returned to.
              </p>
            </div>
            <div className="grid gap-5 border-y border-border py-8 md:grid-cols-3">
              {[
                ["01", "Working muscles use glucose for energy."],
                ["02", "Regular activity can improve insulin sensitivity."],
                ["03", "Small, safe, repeatable movement counts."],
              ].map(([number, truth]) => (
                <div className="min-h-48 p-5" key={number}>
                  <p className="font-serif-display text-5xl text-accent-warm/70">{number}</p>
                  <p className="mt-7 font-serif-display text-2xl leading-tight">{truth}</p>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <p className="editorial-eyebrow text-success">Reflection</p>
              <h2 className="font-serif-display text-4xl">What changed in how movement feels?</h2>
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
                  Progress is a return, not a perfect streak.
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  Tomorrow: medicines as tools, not judgments.
                </p>
                <Button disabled={isPending} onClick={finishExperience}>
                  {isPending
                    ? "Saving your progress…"
                    : experience.accessMode === "review"
                      ? "Return to journey"
                      : "Complete Day 5"}
                </Button>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button fullWidth={false} onClick={() => goToStage(1)} variant="text">
                    Review the muscle visual
                  </Button>
                  <Button fullWidth={false} onClick={() => goToStage(12)} variant="text">
                    Rebuild the first-week plan
                  </Button>
                  <Link
                    className={buttonVariants({ fullWidth: false, variant: "text" })}
                    href="/lessons/4"
                  >
                    Return to Day 4
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
            <p className="text-sm font-semibold text-accent-warm">Day 5</p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Movement: Your Body&apos;s Secret Superpower
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
            label={`Day 5 chapter ${stage + 1} of ${stageCount}`}
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
        title="Leave Day 5 for now?"
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
        title="Day 5 glossary"
      >
        <div className="max-h-[60dvh] space-y-5 overflow-y-auto pr-2">
          {dayFiveGlossary.map((entry) => (
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
