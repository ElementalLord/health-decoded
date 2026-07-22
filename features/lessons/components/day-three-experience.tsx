"use client";

import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronRight,
  CloudSun,
  Droplets,
  Film,
  Footprints,
  Gauge,
  MoonStar,
  ScanLine,
  Sparkles,
  Sun,
  TestTube2,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { ProgressBar } from "@/components/ui/progress-bar";
import { dayThreeGlossary } from "@/features/glossary/data/day-three-glossary";
import {
  evaluateDayThreeAction,
  type DayThreeEvaluationFeedback,
} from "@/features/lessons/actions/day-three.actions";
import { completeLessonAction } from "@/features/lessons/actions/lesson-completion.actions";
import { saveLessonPositionAction } from "@/features/lessons/actions/lesson-progress.actions";
import styles from "@/features/lessons/components/day-three-experience.module.css";
import { LessonMotionFigure } from "@/features/lessons/components/lesson-motion-figure";
import { LessonStoryImage } from "@/features/lessons/components/lesson-story-image";
import type { LessonPlayerViewModel } from "@/features/lessons/types/lesson-player";
import { cn } from "@/lib/utils";

const stageCount = 15;

type EvaluationKey = "window" | "threshold" | "pattern" | "tests" | "teachBack";

const numberFeelings = [
  ["grade", "It feels like a grade."],
  ["warning", "It feels like a warning."],
  ["mystery", "It still feels mysterious."],
  ["information", "It already feels like information."],
] as const;

type NumberFeeling = (typeof numberFeelings)[number][0];

const feelingResponses: Record<NumberFeeling, string> = {
  grade:
    "A number can start to feel like proof of how well you have behaved. Today, we will give it a smaller and more accurate job: reporting information.",
  warning:
    "Numbers can sound like alarms when no one explains their time window. Today, you will learn what each one can, and cannot, say.",
  mystery:
    "That is a reasonable place to begin. A number without context is difficult to use. We will add the context one layer at a time.",
  information:
    "That is exactly where this lesson is heading. Information becomes useful when you know what was measured, when, and why.",
};

const measurementLayers = [
  {
    body: "The concentration of glucose present in the blood.",
    id: "what",
    label: "What it measures",
  },
  {
    body: "One particular moment, the time the sample was taken.",
    id: "when",
    label: "When it measures",
  },
  {
    body: "Often milligrams per deciliter, written mg/dL in the United States.",
    id: "unit",
    label: "How it is written",
  },
] as const;

type MeasurementLayerId = (typeof measurementLayers)[number]["id"];

const dailyMoments = [
  {
    body: "After a night without food, this reading is taken under a fasting condition.",
    id: "morning",
    label: "Before breakfast",
    note: "One morning snapshot",
    x: 100,
    y: 145,
  },
  {
    body: "Glucose often rises after carbohydrate-containing food is digested. The amount and timing vary.",
    id: "meal",
    label: "After a meal",
    note: "A natural rise",
    x: 300,
    y: 78,
  },
  {
    body: "Active muscles can use glucose. Movement is one of many things that can influence the next reading.",
    id: "walk",
    label: "After movement",
    note: "The curve can shift again",
    x: 470,
    y: 132,
  },
  {
    body: "Sleep, stress, illness, food, movement, and medicines may all shape the day. No single curve is universal.",
    id: "evening",
    label: "Later that day",
    note: "Another moment, more context",
    x: 650,
    y: 118,
  },
] as const;

type DailyMomentId = (typeof dailyMoments)[number]["id"];

const curveFactors = [
  {
    body: "Carbohydrate-containing food is broken down into glucose, so the curve may rise after eating.",
    icon: Utensils,
    id: "food",
    label: "Food",
  },
  {
    body: "Active muscles use glucose, so movement can change what happens next.",
    icon: Footprints,
    id: "movement",
    label: "Movement",
  },
  {
    body: "Stress and illness hormones can prompt the body to release more glucose.",
    icon: CloudSun,
    id: "stress",
    label: "Stress or illness",
  },
  {
    body: "Sleep and glucose-lowering medicines can also shape the pattern. Their effects differ by person and treatment.",
    icon: MoonStar,
    id: "sleep_medicine",
    label: "Sleep and medicine",
  },
] as const;

type CurveFactorId = (typeof curveFactors)[number]["id"];

const timeLenses = [
  {
    body: "A blood-glucose reading reports the glucose concentration when that sample was taken. Timing and context help explain it.",
    id: "snapshot",
    label: "Blood-glucose reading",
    limit: "It cannot summarize the weeks before or after that moment.",
    window: "One moment",
  },
  {
    body: "A1C estimates average glucose exposure across red blood cells of different ages, giving a wider view across roughly two to three months.",
    id: "pattern",
    label: "A1C",
    limit: "It cannot replay every individual rise, fall, meal, or day.",
    window: "Roughly 2–3 months",
  },
] as const;

type TimeLensId = (typeof timeLenses)[number]["id"];

const testWindows = [
  {
    cannot: "It cannot show every rise and fall inside those months.",
    id: "a1c",
    label: "A1C",
    preparation: "Usually no fasting is needed for the A1C itself.",
    reveals: "A longer estimate of average glucose exposure.",
    window: "Roughly 2–3 months",
  },
  {
    cannot: "It cannot describe the rest of that day or the previous months.",
    id: "fasting",
    label: "Fasting glucose",
    preparation: "Measured after an overnight fast.",
    reveals: "A standardized point-in-time reading before eating.",
    window: "One morning moment",
  },
  {
    cannot: "Without timing, symptoms, and context, it is not the whole story.",
    id: "random",
    label: "Random glucose",
    preparation: "No fasting period is required.",
    reveals: "The glucose concentration at the time of the test.",
    window: "One unplanned moment",
  },
  {
    cannot: "It does not replace every other source of clinical context.",
    id: "tolerance",
    label: "Glucose tolerance",
    preparation: "Fasting, followed by a glucose drink and timed blood samples.",
    reveals: "How the body handles a standardized glucose load over time.",
    window: "Before and after a set drink",
  },
] as const;

type TestWindowId = (typeof testWindows)[number]["id"];

const diagnosticThresholds = [
  {
    id: "a1c",
    label: "A1C",
    note: "A laboratory A1C used for diagnosis",
    value: "6.5% or higher",
  },
  {
    id: "fasting",
    label: "Fasting plasma glucose",
    note: "After an overnight fast",
    value: "126 mg/dL or higher",
  },
  {
    id: "tolerance",
    label: "2-hour glucose tolerance",
    note: "Two hours after the glucose drink",
    value: "200 mg/dL or higher",
  },
  {
    id: "random",
    label: "Random plasma glucose",
    note: "With classic symptoms of high glucose or a hyperglycemic crisis",
    value: "200 mg/dL or higher",
  },
] as const;

type DiagnosticThresholdId = (typeof diagnosticThresholds)[number]["id"];

const misconceptionStatements = [
  {
    analogy: "One rainy hour cannot describe an entire season.",
    statement: "One unexpectedly high reading means every day has gone wrong.",
  },
  {
    analogy: "One purchase cannot describe an entire bank history.",
    statement: "One balanced meal means Type 2 diabetes has disappeared.",
  },
  {
    analogy: "A week of weather reveals more than one cloud.",
    statement: "Several readings with timing and context can begin to reveal a pattern.",
  },
] as const;

const reflectionOptions = [
  "My numbers feel less like grades.",
  "I understand why one reading is not the whole story.",
  "I can explain what A1C measures.",
  "I know why my doctor may compare several tests.",
  "I feel calmer, but I still want to review.",
  "I am still unsure what my own results mean.",
] as const;

function DayThreeHeading({ children, label }: { children: ReactNode; label?: string }) {
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

function ConceptFeedback({ feedback }: { feedback: DayThreeEvaluationFeedback }) {
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
      <div className="mt-5 border-t border-current/10 pt-4">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
          Why the other ideas do not fit
        </p>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-foreground/75">
          {feedback.whyOthers.map((reason) => (
            <li className="flex gap-2" key={reason}>
              <span aria-hidden="true" className="text-accent-warm">
                •{" "}
              </span>
              {reason}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function DailyTrace({ selectedMoment }: { selectedMoment: DailyMomentId | null }) {
  return (
    <div
      aria-label="A qualitative glucose curve showing natural rises and falls across a day. It is not a personal result or target range."
      className="overflow-hidden rounded-[1rem] border border-accent-warm/25 bg-[#f1e7de] p-4 sm:p-6"
      role="img"
    >
      <svg aria-hidden="true" className="h-auto w-full" viewBox="0 0 720 240">
        <text fill="#786b62" fontSize="13" x="42" y="24">
          Illustrative change, not a target range
        </text>
        <path d="M42 180H690" stroke="#d9c9ba" strokeWidth="2" />
        <path d="M42 34V180" stroke="#d9c9ba" strokeWidth="2" />
        <path
          className={styles.trace}
          d="M42 154 C100 142, 150 146, 220 137 C260 132, 270 78, 300 78 C350 78, 370 132, 440 132 C500 132, 530 110, 580 118 C620 124, 650 118, 690 108"
          fill="none"
          pathLength="1"
          stroke="#b96c55"
          strokeLinecap="round"
          strokeWidth="7"
        />
        {dailyMoments.map((moment) => (
          <g key={moment.id}>
            <circle
              className={selectedMoment === moment.id ? styles.pulseDot : undefined}
              cx={moment.x}
              cy={moment.y}
              fill={selectedMoment === moment.id ? "#6f947a" : "#fffaf3"}
              r={selectedMoment === moment.id ? 10 : 7}
              stroke={selectedMoment === moment.id ? "#476a53" : "#b96c55"}
              strokeWidth="3"
            />
          </g>
        ))}
        <text fill="#786b62" fontSize="14" x="42" y="215">
          Morning
        </text>
        <text fill="#786b62" fontSize="14" textAnchor="middle" x="360" y="215">
          Afternoon
        </text>
        <text fill="#786b62" fontSize="14" textAnchor="end" x="690" y="215">
          Evening
        </text>
      </svg>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        A teaching curve, not a target range or prediction of any one person’s day.
      </p>
    </div>
  );
}

function A1cTimeWindowVisual() {
  const weeks = Array.from({ length: 12 }, (_, index) => index);
  const circulatingCells = [
    { begin: "-1s", duration: "10s", glucoseOffset: -11, y: 128 },
    { begin: "-4.3s", duration: "11.5s", glucoseOffset: 10, y: 128 },
    { begin: "-7.2s", duration: "12.5s", glucoseOffset: -5, y: 128 },
  ] as const;

  return (
    <div
      aria-label="An animated teaching timeline spanning roughly twelve weeks. Red blood cells of different ages circulate across the window, while the most recent weeks receive gentle emphasis. This is not an exact week-by-week weighting formula."
      className={styles.a1cTimeWindow}
      role="img"
    >
      <svg aria-hidden="true" className={styles.a1cTimeWindowSvg} viewBox="0 0 900 270">
        <rect className={styles.a1cWindowEarlier} height="154" rx="20" width="260" x="36" y="42" />
        <rect className={styles.a1cWindowMiddle} height="154" rx="20" width="260" x="304" y="42" />
        <rect className={styles.a1cWindowRecent} height="154" rx="20" width="292" x="572" y="42">
          <animate
            attributeName="opacity"
            dur="4.8s"
            repeatCount="indefinite"
            values="0.72;1;0.72"
          />
        </rect>

        <text className={styles.a1cWindowZoneTitle} x="64" y="74">
          EARLIER WEEKS
        </text>
        <text className={styles.a1cWindowZoneTitle} x="332" y="74">
          MIDDLE WEEKS
        </text>
        <text className={styles.a1cWindowZoneTitle} x="600" y="74">
          RECENT WEEKS
        </text>

        <path className={styles.a1cWindowRail} d="M66 128H834" pathLength="1" />
        {weeks.map((week) => {
          const x = 66 + week * (768 / 11);
          return (
            <g key={week}>
              <line
                className={styles.a1cWeekTick}
                x1={x}
                x2={x}
                y1={week % 4 === 0 ? 112 : 118}
                y2={week % 4 === 0 ? 144 : 138}
              />
              <circle className={styles.a1cWeekPoint} cx={x} cy="128" r="4" />
            </g>
          );
        })}

        {circulatingCells.map((cell, index) => (
          <g key={cell.begin}>
            <animateMotion
              begin={cell.begin}
              dur={cell.duration}
              path={`M66 ${cell.y}H834`}
              repeatCount="indefinite"
            />
            <g className={styles.a1cCellBody}>
              <circle className={styles.a1cCellOuter} r="18" />
              <circle className={styles.a1cCellInner} r="10" />
              <circle className={styles.a1cGlucoseMark} cx={cell.glucoseOffset} cy="-9" r="4" />
              <circle
                className={styles.a1cGlucoseMark}
                cx={cell.glucoseOffset > 0 ? -8 : 9}
                cy="8"
                r="3.5"
              />
              <animateTransform
                attributeName="transform"
                dur={`${6 + index}s`}
                from="0 0 0"
                repeatCount="indefinite"
                to="360 0 0"
                type="rotate"
              />
            </g>
          </g>
        ))}

        <line className={styles.a1cTodayLine} x1="834" x2="834" y1="92" y2="166" />
        <circle className={styles.a1cTodayDot} cx="834" cy="128" r="7">
          <animate attributeName="r" dur="2.4s" repeatCount="indefinite" values="6;9;6" />
          <animate
            attributeName="opacity"
            dur="2.4s"
            repeatCount="indefinite"
            values="0.72;1;0.72"
          />
        </circle>

        <text className={styles.a1cWindowAxisLabel} x="66" y="230">
          ABOUT 12 WEEKS AGO
        </text>
        <text className={styles.a1cWindowAxisLabel} textAnchor="end" x="834" y="230">
          TODAY
        </text>
        <path className={styles.a1cWindowArrow} d="M66 210H824M812 199L824 210L812 221" />
      </svg>

      <div className={styles.a1cWindowLegend}>
        <p>
          <strong>Earlier weeks</strong>
          <span>Still belong to the estimate.</span>
        </p>
        <p>
          <strong>Middle weeks</strong>
          <span>Add more of the longer context.</span>
        </p>
        <p>
          <strong>Recent weeks</strong>
          <span>Usually contribute somewhat more.</span>
        </p>
      </div>
      <p className={styles.a1cWindowCaveat}>
        The changing emphasis is a teaching cue, not an exact week-by-week formula.
      </p>
    </div>
  );
}

export function DayThreeExperience({ lesson: experience }: { lesson: LessonPlayerViewModel }) {
  const router = useRouter();
  const [stage, setStage] = useState(0);
  const [numberFeeling, setNumberFeeling] = useState<NumberFeeling | null>(null);
  const [measurementParts, setMeasurementParts] = useState<Set<MeasurementLayerId>>(
    () => new Set(),
  );
  const [activeMeasurement, setActiveMeasurement] = useState<MeasurementLayerId | null>(null);
  const [viewedMoments, setViewedMoments] = useState<Set<DailyMomentId>>(() => new Set());
  const [selectedMoment, setSelectedMoment] = useState<DailyMomentId | null>(null);
  const [viewedFactors, setViewedFactors] = useState<Set<CurveFactorId>>(() => new Set());
  const [selectedFactor, setSelectedFactor] = useState<CurveFactorId | null>(null);
  const [viewedTimeLenses, setViewedTimeLenses] = useState<Set<TimeLensId>>(() => new Set());
  const [selectedTimeLens, setSelectedTimeLens] = useState<TimeLensId | null>(null);
  const [a1cWindowReviewed, setA1cWindowReviewed] = useState(false);
  const [patternComparisonChoice, setPatternComparisonChoice] = useState<
    "one_day" | "repeated_pattern" | null
  >(null);
  const [viewedTests, setViewedTests] = useState<Set<TestWindowId>>(() => new Set());
  const [selectedTest, setSelectedTest] = useState<TestWindowId | null>(null);
  const [viewedThresholds, setViewedThresholds] = useState<Set<DiagnosticThresholdId>>(
    () => new Set(),
  );
  const [selectedThreshold, setSelectedThreshold] = useState<DiagnosticThresholdId | null>(null);
  const [evaluations, setEvaluations] = useState<
    Partial<Record<EvaluationKey, DayThreeEvaluationFeedback>>
  >({});
  const [selectedAnswers, setSelectedAnswers] = useState<Partial<Record<EvaluationKey, string>>>(
    {},
  );
  const [mythIndex, setMythIndex] = useState(0);
  const [mythCompleted, setMythCompleted] = useState(0);
  const [mythFeedback, setMythFeedback] = useState<DayThreeEvaluationFeedback | null>(null);
  const [confidence, setConfidence] = useState<string | null>(null);
  const [reflection, setReflection] = useState<(typeof reflectionOptions)[number] | null>(null);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const stageRef = useRef<HTMLDivElement>(null);
  const storageKey = `health-decoded:day-three:${experience.lessonProgressId}`;

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

  function openMeasurement(id: MeasurementLayerId) {
    setActiveMeasurement(id);
    setMeasurementParts((current) => new Set([...current, id]));
  }

  function openMoment(id: DailyMomentId) {
    setSelectedMoment(id);
    setViewedMoments((current) => new Set([...current, id]));
  }

  function openFactor(id: CurveFactorId) {
    setSelectedFactor(id);
    setViewedFactors((current) => new Set([...current, id]));
  }

  function openTimeLens(id: TimeLensId) {
    setSelectedTimeLens(id);
    setViewedTimeLenses((current) => new Set([...current, id]));
  }

  function openTest(id: TestWindowId) {
    setSelectedTest(id);
    setViewedTests((current) => new Set([...current, id]));
  }

  function openThreshold(id: DiagnosticThresholdId) {
    setSelectedThreshold(id);
    setViewedThresholds((current) => new Set([...current, id]));
  }

  async function evaluate(input: unknown, key: EvaluationKey, answer: string) {
    setSelectedAnswers((current) => ({ ...current, [key]: answer }));
    const result = await evaluateDayThreeAction(input);
    if (result.ok) setEvaluations((current) => ({ ...current, [key]: result.data }));
    else setMessage(result.message);
  }

  async function evaluateMyth(answer: "single_moment" | "pattern_reasoning") {
    const result = await evaluateDayThreeAction({ answer, stage: "myth", statement: mythIndex });
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    setMythFeedback(result.data);
    if (mythIndex === misconceptionStatements.length - 1) {
      setMythCompleted(misconceptionStatements.length);
    }
  }

  function nextMyth() {
    setMythCompleted((current) => Math.max(current, mythIndex + 1));
    if (mythIndex < misconceptionStatements.length - 1) {
      setMythIndex((current) => current + 1);
      setMythFeedback(null);
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
    if (stage === 0) return numberFeeling !== null;
    if (stage === 1) return measurementParts.size === measurementLayers.length;
    if (stage === 2) return viewedMoments.size === dailyMoments.length;
    if (stage === 3) return viewedFactors.size === curveFactors.length;
    if (stage === 4)
      return viewedTimeLenses.size === timeLenses.length && Boolean(evaluations.window);
    if (stage === 5) return a1cWindowReviewed;
    if (stage === 6) return patternComparisonChoice !== null;
    if (stage === 7) return viewedTests.size === testWindows.length;
    if (stage === 8) return viewedThresholds.size === diagnosticThresholds.length;
    if (stage === 9) return Boolean(evaluations.threshold);
    if (stage === 10) return Boolean(evaluations.pattern);
    if (stage === 11) return mythCompleted === misconceptionStatements.length;
    if (stage === 12) return Boolean(evaluations.tests);
    if (stage === 13) return Boolean(evaluations.teachBack) && confidence !== null;
    return reflection !== null;
  }

  function stageRequirement() {
    const requirements = [
      "Choose the description closest to how numbers feel right now.",
      "Open all three parts of a blood-glucose measurement.",
      "Explore all four moments on the daily curve.",
      "Open all four influences that can shape a day.",
      "Open both time windows, then answer the question.",
      "Reveal how A1C gathers information across roughly two to three months.",
      "Compare the meaning of one unusual day with a repeated pattern.",
      "Open all four testing windows.",
      "Review all four diagnostic thresholds.",
      "Choose what a diagnostic threshold does.",
      "Choose the most useful pattern in the week.",
      "Classify all three statements.",
      "Choose why clinicians may compare several tests.",
      "Choose a plain-language explanation and a confidence check.",
      "Choose one reflection to complete Day 3.",
    ];
    return requirements[stage];
  }

  function continueLabel() {
    const labels = [
      "Give the number one job",
      "Watch a day change",
      "See what shapes the curve",
      "Compare the time windows",
      "Meet the A1C test",
      "Compare one day with a pattern",
      "Compare the tests",
      "Understand the thresholds",
      "Separate thresholds from goals",
      "Look for a pattern",
      "Challenge the one-number myths",
      "See why tests are compared",
      "Explain it in plain language",
      "Choose what you will carry forward",
    ] as const;
    return labels[stage] ?? "Continue";
  }

  function renderStage() {
    switch (stage) {
      case 0:
        return (
          <div className="space-y-9">
            <div className="grid gap-8 lg:grid-cols-[1fr_18rem] lg:items-end">
              <DayThreeHeading label="Day 03 · Understanding your numbers">
                A number can be useful without becoming a verdict.
              </DayThreeHeading>
              <div className="border-l-2 border-accent-warm pl-6">
                <p className="editorial-number">03</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Today we move from what is happening inside your body to how clinicians can see
                  part of that story.
                </p>
              </div>
            </div>
            <LessonStoryImage
              alt="A woman calmly checks her glucose at breakfast and writes a note beside the meter"
              caption="The reading becomes more useful when it travels with timing, food, sleep, stress, symptoms, and the question you want answered."
              emphasis="A number needs context."
              priority
              src="/lessons/day-03/reading-with-context.jpg"
            />
            <div className="grid gap-6 border-y border-border py-8 sm:grid-cols-[1fr_0.85fr] sm:items-center">
              <div className="space-y-4 text-lg leading-8 text-foreground/80">
                <p>
                  You may remember a blood-glucose result, an A1C percentage, or several tests from
                  the day you were diagnosed, without remembering what any of them meant.
                </p>
                <p>
                  A number without a time window can feel frightening. Today, each number gets
                  context, a purpose, and a limit.
                </p>
              </div>
              <div
                aria-label="An example A1C percentage, 6.5 percent, not the learner's personal result"
                className="relative flex min-h-52 items-center justify-center overflow-hidden rounded-full bg-[#efe5da]"
                role="img"
              >
                <span className="font-serif-display text-7xl text-accent-warm sm:text-8xl">
                  6.5%
                </span>
                <span className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  An example, not your result
                </span>
                <span className="absolute left-6 top-8 size-3 rounded-full bg-success/45" />
                <span className="absolute bottom-10 right-8 size-5 rounded-full border-2 border-accent-warm/35" />
                <span className="absolute right-12 top-9 h-px w-16 rotate-12 bg-accent-warm/30" />
              </div>
            </div>
            <div className="space-y-4">
              <p className="font-semibold">Before we begin, how does a diabetes number feel?</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {numberFeelings.map(([id, label]) => (
                  <AnswerChoice
                    key={id}
                    onClick={() => setNumberFeeling(id)}
                    selected={numberFeeling === id}
                  >
                    {label}
                  </AnswerChoice>
                ))}
              </div>
              {numberFeeling ? (
                <p
                  aria-live="polite"
                  className="animate-slide-up border-l-2 border-success bg-info p-5 leading-7"
                >
                  {feelingResponses[numberFeeling]}
                </p>
              ) : null}
            </div>
          </div>
        );
      case 1: {
        const selected = measurementLayers.find((layer) => layer.id === activeMeasurement);
        return (
          <div className="space-y-9">
            <DayThreeHeading label="First, shrink the mystery">
              A blood-glucose number has one small job.
            </DayThreeHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              It measures how much glucose is present in the blood at the moment the sample is
              taken. It does not measure health, effort, worth, or what will happen forever.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {measurementLayers.map((layer, index) => (
                <button
                  aria-pressed={activeMeasurement === layer.id}
                  className={cn(
                    "motion-tactile min-h-32 rounded-[1rem] border bg-card p-5 text-left shadow-card",
                    activeMeasurement === layer.id && "border-accent-warm bg-accent-warm/7",
                  )}
                  key={layer.id}
                  onClick={() => openMeasurement(layer.id)}
                  type="button"
                >
                  <span className="editorial-eyebrow">0{index + 1}</span>
                  <span className="mt-4 block font-serif-display text-2xl font-semibold">
                    {layer.label}
                  </span>
                </button>
              ))}
            </div>
            {selected ? (
              <div className="animate-slide-up grid gap-5 border-y border-border py-7 sm:grid-cols-[auto_1fr] sm:items-center">
                <Gauge aria-hidden="true" className="size-12 text-success" strokeWidth={1.4} />
                <div>
                  <p className="editorial-eyebrow">{selected.label}</p>
                  <p className="mt-2 font-serif-display text-2xl leading-8">{selected.body}</p>
                </div>
              </div>
            ) : null}
            <p className="text-sm text-muted-foreground">
              {measurementParts.size} of {measurementLayers.length} parts opened
            </p>
          </div>
        );
      }
      case 2: {
        const selected = dailyMoments.find((moment) => moment.id === selectedMoment);
        return (
          <div className="space-y-8">
            <DayThreeHeading label="One day, many moments">
              Blood glucose is meant to move.
            </DayThreeHeading>
            <div className="max-w-3xl space-y-3 text-lg leading-8 text-foreground/80">
              <p>
                Even without diabetes, glucose does not stay at one exact level all day. Food,
                movement, hormones, sleep, illness, stress, and medicines can all shape the curve.
              </p>
              <p>
                Tap each moment. Notice how the same day can contain more than one true reading.
              </p>
            </div>
            <LessonMotionFigure variant="reading-snapshot" />
            <DailyTrace selectedMoment={selectedMoment} />
            <div className="grid gap-3 sm:grid-cols-4">
              {dailyMoments.map((moment) => (
                <button
                  aria-pressed={selectedMoment === moment.id}
                  className={cn(
                    "motion-tactile min-h-20 rounded-[9px] border bg-card px-4 py-4 text-left text-sm font-semibold",
                    selectedMoment === moment.id && "border-success bg-info",
                  )}
                  key={moment.id}
                  onClick={() => openMoment(moment.id)}
                  type="button"
                >
                  {moment.label}
                  {viewedMoments.has(moment.id) ? (
                    <Check aria-hidden="true" className="mt-2 size-4 text-success" />
                  ) : null}
                </button>
              ))}
            </div>
            {selected ? (
              <div
                aria-live="polite"
                className="animate-slide-up border-l-2 border-accent-warm p-5"
              >
                <p className="font-serif-display text-2xl">{selected.note}</p>
                <p className="mt-2 leading-7 text-muted-foreground">{selected.body}</p>
              </div>
            ) : null}
          </div>
        );
      }
      case 3: {
        const selected = curveFactors.find((factor) => factor.id === selectedFactor);
        return (
          <div className="space-y-9">
            <DayThreeHeading label="Build the context">
              The number changes because life changes.
            </DayThreeHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              A reading does not arrive alone. Open each influence and place it beside the curve.
              This is why curiosity gives you more information than self-criticism.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {curveFactors.map((factor) => {
                const Icon = factor.icon;
                return (
                  <button
                    aria-pressed={selectedFactor === factor.id}
                    className={cn(
                      "motion-tactile grid min-h-24 grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[1rem] border bg-card p-5 text-left",
                      selectedFactor === factor.id && "border-accent-warm bg-[#f3e6dd]",
                    )}
                    key={factor.id}
                    onClick={() => openFactor(factor.id)}
                    type="button"
                  >
                    <span className="inline-flex size-11 items-center justify-center rounded-full bg-muted text-accent-warm">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <span className="font-semibold">{factor.label}</span>
                    {viewedFactors.has(factor.id) ? (
                      <Check aria-label="Opened" className="size-5 text-success" />
                    ) : (
                      <ChevronRight aria-hidden="true" className="size-5" />
                    )}
                  </button>
                );
              })}
            </div>
            {selected ? (
              <Card className="animate-slide-up rounded-[1rem] border-success/25 bg-info p-6 sm:p-8">
                <p className="editorial-eyebrow text-success">{selected.label}</p>
                <p className="mt-3 font-serif-display text-2xl leading-8">{selected.body}</p>
              </Card>
            ) : null}
            <p className="border-l-2 border-success px-5 py-2 font-serif-display text-2xl italic leading-9">
              Context does not excuse a number. It explains what question to ask next.
            </p>
          </div>
        );
      }
      case 4: {
        const selected = timeLenses.find((lens) => lens.id === selectedTimeLens);
        return (
          <div className="space-y-9">
            <DayThreeHeading label="Two measurements, two time windows">
              A snapshot and a longer pattern answer different questions.
            </DayThreeHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Open both measurements. The difference is not that one is better, it is the span of
              time each one can describe.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {timeLenses.map((lens) => (
                <button
                  aria-pressed={selectedTimeLens === lens.id}
                  className={cn(
                    "motion-tactile min-h-52 rounded-[1rem] border bg-card p-6 text-left shadow-card",
                    selectedTimeLens === lens.id && "border-success bg-info",
                  )}
                  key={lens.id}
                  onClick={() => openTimeLens(lens.id)}
                  type="button"
                >
                  <span className="editorial-eyebrow">{lens.window}</span>
                  <span className="mt-7 block font-serif-display text-3xl">{lens.label}</span>
                  <span className="mt-4 block leading-7 text-muted-foreground">{lens.body}</span>
                  {viewedTimeLenses.has(lens.id) ? (
                    <Check aria-hidden="true" className="mt-5 size-5 text-success" />
                  ) : null}
                </button>
              ))}
            </div>
            {selected ? (
              <div className="animate-slide-up border-l-2 border-accent-warm bg-[#f2e6dd] p-6">
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent-warm">
                  Its limit matters too
                </p>
                <p className="mt-3 text-lg leading-8">{selected.limit}</p>
              </div>
            ) : null}
            {viewedTimeLenses.size === timeLenses.length ? (
              <div className="animate-slide-up space-y-4 border-t border-border pt-7">
                <p className="font-semibold">Which description belongs to A1C?</p>
                {(
                  [
                    ["snapshot", "A snapshot of the exact moment the sample was taken"],
                    [
                      "three_month_pattern",
                      "An estimate of average glucose exposure over roughly two to three months",
                    ],
                    ["diagnosis_score", "A score showing how well someone behaved"],
                  ] as const
                ).map(([answer, label]) => (
                  <AnswerChoice
                    key={answer}
                    onClick={() => void evaluate({ answer, stage: "window" }, "window", answer)}
                    selected={selectedAnswers.window === answer}
                  >
                    {label}
                  </AnswerChoice>
                ))}
                {evaluations.window ? <ConceptFeedback feedback={evaluations.window} /> : null}
              </div>
            ) : null}
          </div>
        );
      }
      case 5:
        return (
          <div className="space-y-9">
            <DayThreeHeading label="Inside the A1C test">
              Red blood cells carry a quiet record.
            </DayThreeHeading>
            <div className="max-w-3xl space-y-3 text-lg leading-8 text-foreground/80">
              <p>
                Red blood cells contain hemoglobin, a protein that carries oxygen. Glucose naturally
                attaches to some hemoglobin in everyone.
              </p>
              <p>
                A1C reports the percentage of hemoglobin with glucose attached. Because circulating
                red blood cells have different ages, the result reflects a longer period rather than
                one instant.
              </p>
            </div>
            <LessonMotionFigure variant="a1c-window" />
            <div className="rounded-[1rem] border border-border bg-card p-6 shadow-card sm:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <p className="editorial-eyebrow">The time window</p>
                  <h2 className="mt-3 font-serif-display text-3xl">Roughly two to three months</h2>
                </div>
                {!a1cWindowReviewed ? (
                  <Button fullWidth={false} onClick={() => setA1cWindowReviewed(true)}>
                    Explore the time window
                  </Button>
                ) : null}
              </div>
              {a1cWindowReviewed ? (
                <div className="animate-slide-up mt-7">
                  <A1cTimeWindowVisual />
                </div>
              ) : (
                <p className="mt-6 max-w-2xl leading-7 text-muted-foreground">
                  Red blood cells of different ages carry information from different parts of the
                  longer window.
                </p>
              )}
            </div>
            {a1cWindowReviewed ? (
              <p className="animate-slide-up border-l-2 border-success bg-info p-6 leading-7">
                A1C estimates a longer average. It does not store a day-by-day replay, and it does
                not tell you exactly what happened after one meal.
              </p>
            ) : null}
          </div>
        );
      case 6:
        return (
          <div className="space-y-9">
            <DayThreeHeading label="One day versus a repeated pattern">
              Longer averages respond to what happens over time.
            </DayThreeHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Imagine one unusual celebration meal and, separately, a change that repeats across
              many days. Which is more likely to shape a longer average?
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                aria-pressed={patternComparisonChoice === "one_day"}
                className={cn(
                  "motion-tactile min-h-56 rounded-[1rem] border bg-card p-6 text-left shadow-card",
                  patternComparisonChoice === "one_day" && "border-accent-warm bg-[#f2e5dc]",
                )}
                onClick={() => setPatternComparisonChoice("one_day")}
                type="button"
              >
                <span className="editorial-eyebrow">One unusual day</span>
                <span className="mt-8 block font-serif-display text-3xl leading-tight">
                  A celebration meal happens once.
                </span>
                <span className="mt-4 block leading-7 text-muted-foreground">
                  It is real information, but it is one part of a much longer window.
                </span>
              </button>
              <button
                aria-pressed={patternComparisonChoice === "repeated_pattern"}
                className={cn(
                  "motion-tactile min-h-56 rounded-[1rem] border bg-card p-6 text-left shadow-card",
                  patternComparisonChoice === "repeated_pattern" && "border-success bg-info",
                )}
                onClick={() => setPatternComparisonChoice("repeated_pattern")}
                type="button"
              >
                <span className="editorial-eyebrow">A repeated pattern</span>
                <span className="mt-8 block font-serif-display text-3xl leading-tight">
                  A similar influence appears across many days.
                </span>
                <span className="mt-4 block leading-7 text-muted-foreground">
                  Repetition contributes more information to the longer average.
                </span>
              </button>
            </div>
            {patternComparisonChoice ? (
              <div
                aria-live="polite"
                className={cn(
                  "animate-slide-up border-l-2 p-6 text-lg leading-8",
                  patternComparisonChoice === "repeated_pattern"
                    ? "border-success bg-info"
                    : "border-accent-warm bg-[#f2e6dd]",
                )}
              >
                {patternComparisonChoice === "repeated_pattern"
                  ? "Yes. A repeated pattern is more likely to shape a longer average because it contributes across more of the time window."
                  : "One day contributes, but it does not define the whole result. A repeated pattern carries more influence across the longer window."}
              </div>
            ) : null}
            <p className="border-y border-border py-6 font-serif-display text-2xl leading-9">
              This is why one meal is information, not a verdict, and why patterns are more useful
              than perfection.
            </p>
          </div>
        );
      case 7: {
        const selected = testWindows.find((test) => test.id === selectedTest);
        return (
          <div className="space-y-9">
            <DayThreeHeading label="Four windows, four questions">
              Why might a clinician order several tests?
            </DayThreeHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              No test failed. Each one looks through a different window. Open every drawer and
              notice how its preparation, time window, and limits change.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {testWindows.map((test) => (
                <button
                  aria-pressed={selectedTest === test.id}
                  className={cn(
                    "motion-tactile grid min-h-28 grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[1rem] border bg-card p-5 text-left",
                    selectedTest === test.id && "border-success bg-info",
                  )}
                  key={test.id}
                  onClick={() => openTest(test.id)}
                  type="button"
                >
                  <span className="inline-flex size-12 items-center justify-center rounded-full bg-muted text-accent-warm">
                    {test.id === "a1c" ? (
                      <Film aria-hidden="true" className="size-5" />
                    ) : (
                      <TestTube2 aria-hidden="true" className="size-5" />
                    )}
                  </span>
                  <span>
                    <span className="block font-serif-display text-xl font-semibold">
                      {test.label}
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">{test.window}</span>
                  </span>
                  {viewedTests.has(test.id) ? (
                    <Check aria-label="Opened" className="size-5 text-success" />
                  ) : (
                    <ChevronRight aria-hidden="true" className="size-5" />
                  )}
                </button>
              ))}
            </div>
            {selected ? (
              <div className="animate-slide-up divide-y divide-border rounded-[1rem] border border-border bg-card px-6 sm:px-8">
                {[
                  ["Time window", selected.window],
                  ["Preparation", selected.preparation],
                  ["What it can reveal", selected.reveals],
                  ["What it cannot do", selected.cannot],
                ].map(([label, body]) => (
                  <div className="grid gap-2 py-5 sm:grid-cols-[11rem_1fr]" key={label}>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-warm">
                      {label}
                    </p>
                    <p className="leading-7">{body}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        );
      }
      case 8: {
        const selected = diagnosticThresholds.find((item) => item.id === selectedThreshold);
        return (
          <div className="space-y-9">
            <DayThreeHeading label="A reference point, not a report card">
              What do diagnosis thresholds mean?
            </DayThreeHeading>
            <div className="max-w-3xl space-y-3 text-lg leading-8 text-foreground/80">
              <p>
                Clinicians use agreed cut points to decide when results meet diagnostic criteria for
                diabetes. These are diagnostic thresholds, not universal treatment goals.
              </p>
              <p>
                When classic symptoms are absent, an abnormal result is usually confirmed with a
                repeat result or another diagnostic test. Your healthcare professional interprets
                the full situation.
              </p>
            </div>
            <div className="space-y-3">
              {diagnosticThresholds.map((threshold) => (
                <button
                  aria-pressed={selectedThreshold === threshold.id}
                  className={cn(
                    "motion-tactile grid min-h-20 w-full gap-3 rounded-[9px] border bg-card p-5 text-left sm:grid-cols-[13rem_1fr_auto] sm:items-center",
                    selectedThreshold === threshold.id && "border-accent-warm bg-[#f3e7df]",
                  )}
                  key={threshold.id}
                  onClick={() => openThreshold(threshold.id)}
                  type="button"
                >
                  <span className="font-serif-display text-xl font-semibold">
                    {threshold.label}
                  </span>
                  <span className="text-sm leading-6 text-muted-foreground">{threshold.note}</span>
                  <span className="font-semibold text-accent-warm">
                    {viewedThresholds.has(threshold.id) ? threshold.value : "Reveal"}
                  </span>
                </button>
              ))}
            </div>
            {selected ? (
              <div className="animate-slide-up overflow-hidden rounded-[1rem] border border-border bg-muted/60 p-6 sm:p-8">
                <div className="flex items-end justify-between gap-5">
                  <div>
                    <p className="editorial-eyebrow">{selected.label}</p>
                    <p className="mt-3 font-serif-display text-4xl text-accent-warm">
                      {selected.value}
                    </p>
                  </div>
                  <ScanLine aria-hidden="true" className="size-12 text-success" strokeWidth={1.3} />
                </div>
                <div className="relative mt-7 h-2 rounded-full bg-border">
                  <span className="absolute left-[64%] top-1/2 size-6 -translate-y-1/2 rounded-full border-4 border-card bg-accent-warm shadow" />
                </div>
                <p className="mt-5 text-sm leading-6 text-muted-foreground">
                  This marker shows the idea of a cut point. It is not a personal target or an
                  interpretation of anyone’s result.
                </p>
              </div>
            ) : null}
          </div>
        );
      }
      case 9:
        return (
          <div className="space-y-8">
            <DayThreeHeading label="Knowledge check">
              A threshold is a starting line, not a finish line.
            </DayThreeHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              An A1C of 6.5% is one diagnostic cut point for diabetes. What does that threshold do?
            </p>
            {(
              [
                [
                  "same_for_everyone",
                  "It automatically becomes the treatment goal for every person.",
                ],
                [
                  "starting_line",
                  "It helps identify whether results meet diagnostic criteria; personal goals are decided separately.",
                ],
                ["emergency", "It means the person is having an emergency at that moment."],
              ] as const
            ).map(([answer, label]) => (
              <AnswerChoice
                key={answer}
                onClick={() => void evaluate({ answer, stage: "threshold" }, "threshold", answer)}
                selected={selectedAnswers.threshold === answer}
              >
                {label}
              </AnswerChoice>
            ))}
            {evaluations.threshold ? <ConceptFeedback feedback={evaluations.threshold} /> : null}
          </div>
        );
      case 10:
        return (
          <div className="space-y-9">
            <DayThreeHeading label="Pattern detective">
              Look for repetition, not the most dramatic dot.
            </DayThreeHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              This fictional week has no numbers because the task is not to interpret a personal
              target. It is to notice which information repeats.
            </p>
            <div
              aria-label="A seven-day teaching chart. Morning dots are repeatedly in a similar upper band, while one afternoon dot is the single highest point."
              className="rounded-[1rem] border border-border bg-card p-5 shadow-card sm:p-8"
              role="img"
            >
              <div className="grid grid-cols-7 gap-2 border-b border-border pb-4 text-center text-xs font-semibold text-muted-foreground">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
              <div className="relative mt-5 h-52 border-l border-b border-border">
                <div className="absolute inset-x-0 top-[34%] border-t border-dashed border-success/30" />
                {[30, 32, 29, 34, 31, 33, 30].map((top, index) => (
                  <span
                    className={cn(
                      styles.pulseDot,
                      "absolute size-4 rounded-full bg-success ring-4 ring-success/12",
                    )}
                    key={`morning-${index}`}
                    style={{ left: `${5 + index * 15}%`, top: `${top}%` }}
                  />
                ))}
                {[66, 54, 70, 18, 61, 74, 58].map((top, index) => (
                  <span
                    className="absolute size-3 rounded-full bg-accent-warm/70"
                    key={`later-${index}`}
                    style={{ left: `${8 + index * 15}%`, top: `${top}%` }}
                  />
                ))}
                <span className="absolute left-3 top-3 text-xs text-muted-foreground">
                  Higher on page
                </span>
                <span className="absolute bottom-2 left-3 text-xs text-muted-foreground">
                  Lower on page
                </span>
              </div>
              <div className="mt-5 flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <span className="size-3 rounded-full bg-success" /> Morning
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="size-3 rounded-full bg-accent-warm/70" /> Later context
                </span>
              </div>
            </div>
            <p className="font-semibold">Which observation gives the most useful pattern?</p>
            {(
              [
                ["highest_point", "Thursday has the single highest dot."],
                ["repeated_mornings", "The morning dots return to a similar band across the week."],
                ["best_day", "Saturday has one of the lowest later dots."],
              ] as const
            ).map(([answer, label]) => (
              <AnswerChoice
                key={answer}
                onClick={() => void evaluate({ answer, stage: "pattern" }, "pattern", answer)}
                selected={selectedAnswers.pattern === answer}
              >
                {label}
              </AnswerChoice>
            ))}
            {evaluations.pattern ? <ConceptFeedback feedback={evaluations.pattern} /> : null}
          </div>
        );
      case 11: {
        const current = misconceptionStatements[mythIndex]!;
        return (
          <div className="space-y-9">
            <DayThreeHeading label="Weather, money, and one meal">
              Does this use one moment, or pattern reasoning?
            </DayThreeHeading>
            <div className="relative overflow-hidden rounded-[1rem] border border-accent-warm/25 bg-[#efe5da] p-6 sm:p-10">
              <div className="absolute right-8 top-8 text-accent-warm/40">
                {mythIndex === 0 ? (
                  <CloudSun className={cn(styles.weatherMark, "size-20")} strokeWidth={1.1} />
                ) : mythIndex === 1 ? (
                  <Gauge className={cn(styles.weatherMark, "size-20")} strokeWidth={1.1} />
                ) : (
                  <Sun className={cn(styles.weatherMark, "size-20")} strokeWidth={1.1} />
                )}
              </div>
              <p className="editorial-eyebrow">Statement {mythIndex + 1} of 3</p>
              <blockquote className="relative mt-12 max-w-3xl font-serif-display text-3xl leading-tight sm:text-4xl">
                “{current.statement}”
              </blockquote>
              <p className="mt-8 max-w-2xl border-l-2 border-accent-warm pl-5 italic leading-7 text-muted-foreground">
                {current.analogy}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button onClick={() => void evaluateMyth("single_moment")} variant="secondary">
                One moment is doing too much
              </Button>
              <Button onClick={() => void evaluateMyth("pattern_reasoning")} variant="secondary">
                This uses pattern reasoning
              </Button>
            </div>
            {mythFeedback ? (
              <div className="space-y-4">
                <ConceptFeedback feedback={mythFeedback} />
                {mythIndex < misconceptionStatements.length - 1 ? (
                  <Button onClick={nextMyth}>Try the next statement</Button>
                ) : null}
              </div>
            ) : null}
            <p className="text-sm text-muted-foreground">
              {mythCompleted} of {misconceptionStatements.length} completed
            </p>
          </div>
        );
      }
      case 12:
        return (
          <div className="space-y-9">
            <DayThreeHeading label="Several clues, one conversation">
              Why is one test sometimes not enough?
            </DayThreeHeading>
            <LessonStoryImage
              alt="A patient and clinician sit together and review a simple glucose pattern on a tablet"
              caption="Several results can reveal what repeats. Your care team adds symptoms, routines, medications, and goals before deciding what the pattern means."
              emphasis="Patterns are interpreted together."
              src="/lessons/day-03/reviewing-patterns.jpg"
            />
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["One moment", "Fasting or random glucose", Droplets],
                ["Longer average", "A1C", Film],
                ["Human context", "Symptoms, history, and factors affecting accuracy", Sparkles],
              ].map(([heading, body, Icon]) => {
                const IconComponent = Icon as typeof Droplets;
                return (
                  <div className="border-t-2 border-accent-warm bg-card p-6" key={String(heading)}>
                    <IconComponent
                      aria-hidden="true"
                      className="size-8 text-success"
                      strokeWidth={1.4}
                    />
                    <h2 className="mt-7 font-serif-display text-2xl">{heading as string}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{body as string}</p>
                  </div>
                );
              })}
            </div>
            <div className="border-l-2 border-success bg-info p-6 leading-7">
              <p className="font-semibold">A1C is useful, but it is not infallible.</p>
              <p className="mt-2">
                Conditions that change red-blood-cell lifespan or hemoglobin, such as some anemias,
                recent blood loss or transfusion, kidney disease, and certain hemoglobin variants,
                can affect A1C accuracy. When results do not fit together, clinicians look more
                closely instead of blaming the person.
              </p>
            </div>
            <p className="font-semibold">Why might a clinician compare several tests?</p>
            {(
              [
                [
                  "different_windows",
                  "Different tests show different time windows and can confirm or add context to one another.",
                ],
                ["one_test_failed", "The first test must have been performed incorrectly."],
                ["more_tests_are_harsher", "More tests make the diagnosis feel more serious."],
              ] as const
            ).map(([answer, label]) => (
              <AnswerChoice
                key={answer}
                onClick={() => void evaluate({ answer, stage: "tests" }, "tests", answer)}
                selected={selectedAnswers.tests === answer}
              >
                {label}
              </AnswerChoice>
            ))}
            {evaluations.tests ? <ConceptFeedback feedback={evaluations.tests} /> : null}
          </div>
        );
      case 13:
        return (
          <div className="space-y-9">
            <DayThreeHeading label="Teach it back">
              How would you explain the numbers now?
            </DayThreeHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              A friend says, “My reading looked normal today, so maybe the diabetes is gone.” Which
              answer keeps the most context?
            </p>
            {(
              [
                [
                  "useful_windows",
                  "Today’s reading is one useful moment. A1C and repeated results show longer patterns, and your care team uses them with the rest of your health context.",
                ],
                ["daily_grade", "A normal reading means you earned a good grade today."],
                ["one_reading_decides", "One normal reading proves the diagnosis has disappeared."],
              ] as const
            ).map(([answer, label]) => (
              <AnswerChoice
                key={answer}
                onClick={() => void evaluate({ answer, stage: "teach_back" }, "teachBack", answer)}
                selected={selectedAnswers.teachBack === answer}
              >
                {label}
              </AnswerChoice>
            ))}
            {evaluations.teachBack ? <ConceptFeedback feedback={evaluations.teachBack} /> : null}
            {evaluations.teachBack ? (
              <div className="animate-slide-up border-y border-border py-7">
                <p className="font-semibold">Could you explain the difference in your own words?</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {[
                    "Yes, I could explain it.",
                    "I understand it, but need another look.",
                    "I would like help from my care team.",
                  ].map((choice) => (
                    <button
                      aria-pressed={confidence === choice}
                      className={cn(
                        "motion-tactile min-h-16 rounded-[9px] border bg-card p-4 text-left text-sm",
                        confidence === choice && "border-success bg-info",
                      )}
                      key={choice}
                      onClick={() => setConfidence(choice)}
                      type="button"
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        );
      default:
        return (
          <div className="space-y-10">
            <div className="text-center">
              <p className="editorial-eyebrow">Let the important parts settle</p>
              <h1 className="mx-auto mt-5 max-w-4xl font-serif-display text-[length:var(--text-page-title)] font-normal leading-[0.94] text-balance">
                Four truths are enough to carry forward.
              </h1>
            </div>
            <div className="space-y-0 border-y border-border">
              {[
                ["01", "Blood glucose", "A point-in-time measurement, a snapshot with context."],
                [
                  "02",
                  "A1C",
                  "A longer estimate of average glucose exposure over roughly two to three months.",
                ],
                ["03", "Different tests", "Different windows that can be compared and confirmed."],
                [
                  "04",
                  "The meaning",
                  "Numbers are tools for learning and care. They are not judgments about you.",
                ],
              ].map(([number, heading, body], index) => (
                <div
                  className="grid gap-3 py-6 sm:grid-cols-[5rem_12rem_1fr] sm:items-baseline"
                  key={number}
                >
                  <span className="font-serif-display text-4xl text-accent-warm/70">{number}</span>
                  <h2 className="font-serif-display text-2xl font-semibold">{heading}</h2>
                  <p className="leading-7 text-muted-foreground">{body}</p>
                  <span
                    aria-hidden="true"
                    className={cn(styles.truthLine, "h-px bg-border sm:col-span-3")}
                    style={{ animationDelay: `${index * 90}ms` }}
                  />
                </div>
              ))}
            </div>
            <div className="border-l-2 border-success py-2 pl-6 sm:pl-9">
              <p className="editorial-eyebrow text-success">Reflection</p>
              <h2 className="mt-4 font-serif-display text-3xl sm:text-4xl">
                What feels different about the numbers now?
              </h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
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
              {reflection ? (
                <p aria-live="polite" className="mt-5 bg-info p-5 leading-7">
                  {reflection === "I am still unsure what my own results mean."
                    ? "This lesson explains tests in general, but your own results belong in a conversation with your healthcare team, who can interpret them with your history and care plan."
                    : "That is enough for today. You can return to this lesson whenever a number needs its time window again."}
                </p>
              ) : null}
            </div>
            {reflection ? (
              <div className="animate-slide-up space-y-7">
                <div className="grid gap-6 border-y border-accent-warm/25 bg-[#f1e5dc] p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
                  <div>
                    <p className="editorial-eyebrow">Tomorrow · Day 4</p>
                    <h2 className="mt-3 font-serif-display text-3xl">
                      Food and blood sugar basics
                    </h2>
                    <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
                      You will use today’s time windows to understand what can change after eating,
                      without turning food into fear or a list of forbidden choices.
                    </p>
                  </div>
                  <Utensils
                    aria-hidden="true"
                    className="size-14 text-accent-warm"
                    strokeWidth={1.2}
                  />
                </div>
                <Button disabled={isPending} onClick={finishExperience} size="lg">
                  {isPending
                    ? "Saving your progress…"
                    : experience.accessMode === "review"
                      ? "Return to lesson library"
                      : "Complete Day 3"}
                </Button>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button fullWidth={false} onClick={() => goToStage(4)} variant="text">
                    Review snapshot versus A1C
                  </Button>
                  <Button fullWidth={false} onClick={() => goToStage(7)} variant="text">
                    Review the four tests
                  </Button>
                  <Link
                    className={buttonVariants({ fullWidth: false, variant: "text" })}
                    href="/lessons/2"
                  >
                    Return to Day 2
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
            <p className="text-sm font-semibold text-accent-warm">Day 3</p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Understanding Your Numbers
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
            label={`Day 3 chapter ${stage + 1} of ${stageCount}`}
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
        title="Leave Day 3 for now?"
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
        title="Day 3 glossary"
      >
        <div className="max-h-[60dvh] space-y-5 overflow-y-auto pr-2">
          {dayThreeGlossary.map((entry) => (
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
