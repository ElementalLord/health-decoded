"use client";

import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  BookOpen,
  Check,
  ChevronRight,
  CircleDot,
  Droplets,
  Dumbbell,
  GripVertical,
  HeartPulse,
  Layers3,
  RotateCcw,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { ProgressBar } from "@/components/ui/progress-bar";
import { dayTwoGlossary } from "@/features/glossary/data/day-two-glossary";
import {
  evaluateDayTwoAction,
  type DayTwoEvaluationFeedback,
} from "@/features/lessons/actions/day-two.actions";
import { completeLessonAction } from "@/features/lessons/actions/lesson-completion.actions";
import { saveLessonPositionAction } from "@/features/lessons/actions/lesson-progress.actions";
import { LessonMotionFigure } from "@/features/lessons/components/lesson-motion-figure";
import type { LessonPlayerViewModel } from "@/features/lessons/types/lesson-player";
import { cn } from "@/lib/utils";

const stageCount = 14;
type EvaluationKey = "connection" | "glucose" | "resistance" | "process" | "teachBack";

const previewItems = [
  [
    "digestive",
    "Digestive system",
    "Breaks carbohydrate-containing foods into glucose and other nutrients.",
  ],
  ["bloodstream", "Bloodstream", "Carries glucose to places where the body can use it."],
  ["pancreas", "Pancreas", "Makes insulin, which helps manage glucose."],
  ["muscle", "Muscle", "Uses a large amount of glucose for energy."],
  ["liver", "Liver", "Stores glucose and can also release glucose into the blood."],
] as const;

type PreviewId = (typeof previewItems)[number][0];

const organDetails = [
  [
    "pancreas",
    "Pancreas",
    "Makes insulin.",
    "It may not be able to make enough insulin to meet the body’s increased needs.",
  ],
  [
    "muscle",
    "Muscle",
    "Uses glucose for movement and everyday energy.",
    "Muscle cells may respond less effectively to insulin, so less glucose moves inside.",
  ],
  [
    "liver",
    "Liver",
    "Stores glucose and releases it when the body needs energy.",
    "It may continue releasing glucose even when there is already more glucose in the blood than the body needs.",
  ],
  [
    "fat",
    "Fat tissue",
    "Stores energy and communicates with other parts of the body.",
    "Fat tissue may become less responsive to insulin and can contribute to changes in how the body handles energy.",
  ],
  [
    "bloodstream",
    "Bloodstream",
    "Carries glucose, insulin, oxygen, and other substances around the body.",
    "More glucose remains in the blood over time.",
  ],
] as const;

type OrganId = (typeof organDetails)[number][0];

const processCards = [
  ["A", "The pancreas makes insulin."],
  ["B", "Insulin sends signals that help cells take in glucose."],
  ["C", "Some cells respond less effectively to insulin."],
  ["D", "The pancreas may try to make more insulin."],
  [
    "E",
    "Over time, insulin supply may not meet the body’s needs, so more glucose remains in the blood.",
  ],
] as const;

type ProcessKey = (typeof processCards)[number][0];

const causeStatements = [
  "I ate dessert, so I caused diabetes.",
  "Food can affect blood glucose, but Type 2 diabetes also involves insulin response and insulin supply.",
  "Only people in larger bodies develop Type 2 diabetes.",
  "Understanding the body’s mechanism can help me make sense of future lessons.",
] as const;

const clarityReviews = {
  "What glucose does":
    "Glucose is a source of energy carried through the blood so cells can use or store it.",
  "What insulin does":
    "Insulin is a hormone that sends signals helping many cells take in glucose.",
  "What insulin resistance means":
    "The insulin signal is present, but cells do not respond as effectively, so the body needs more insulin for the same response.",
  "Why the pancreas may not keep up":
    "The pancreas may make more insulin for a time, but the body’s need may eventually exceed its current supply.",
  "I need another look":
    "Start with two ideas: insulin helps the body manage glucose, and Type 2 diabetes can involve both less response to insulin and too little insulin for the body’s needs.",
} as const;

type ClarityChoice = keyof typeof clarityReviews;

const reflectionOptions = [
  "I understand that my body may still make insulin.",
  "I understand that insulin resistance is not the same as having no insulin.",
  "I see that more than one part of the body is involved.",
  "I feel less like one choice caused this.",
  "I understand the main idea, but I need time with it.",
  "I am still confused.",
] as const;

function iconForSystem(id: PreviewId | OrganId) {
  const className = "size-6";
  if (id === "digestive") return <Utensils className={className} />;
  if (id === "bloodstream") return <Droplets className={className} />;
  if (id === "pancreas") return <HeartPulse className={className} />;
  if (id === "muscle") return <Dumbbell className={className} />;
  if (id === "liver") return <Layers3 className={className} />;
  return <CircleDot className={className} />;
}

function DayTwoHeading({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="space-y-3">
      {label ? <p className="editorial-eyebrow">{label}</p> : null}
      <h1 className="font-serif-display text-[length:var(--text-page-title)] font-normal leading-[0.98] text-balance">
        {children}
      </h1>
    </div>
  );
}

function ConceptFeedback({ feedback }: { feedback: DayTwoEvaluationFeedback }) {
  return (
    <div
      aria-live="polite"
      className={cn(
        "animate-slide-up rounded-3xl border p-5 sm:p-6",
        feedback.accurate
          ? "border-[#277a72]/25 bg-[#277a72]/8"
          : "border-[#c58a35]/30 bg-[#c58a35]/10",
      )}
    >
      <p className={cn("font-serif-display text-2xl italic", feedback.accurate && "text-success")}>
        {feedback.heading}
      </p>
      <p className="mt-2 leading-7 text-foreground/80">{feedback.body}</p>
    </div>
  );
}

function AnswerChoice({
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
        "flex min-h-20 w-full items-start gap-4 rounded-[9px] border bg-card px-5 py-5 text-left text-base leading-7 shadow-card transition hover:-translate-y-0.5 hover:border-accent-warm/60",
        selected && "border-accent-warm bg-accent-warm/7 ring-1 ring-accent-warm/10",
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
      {children}
    </button>
  );
}

function BloodstreamDiagram({
  entered = 0,
  enteredParticles,
  insulinSignals = 0,
  resistant = false,
}: {
  entered?: number;
  enteredParticles?: ReadonlySet<number>;
  insulinSignals?: number;
  resistant?: boolean;
}) {
  const particles = [0, 1, 2] as const;
  const insidePositions = [
    { left: "calc(100% - 6rem)", top: "34%" },
    { left: "calc(100% - 3.4rem)", top: "39%" },
    { left: "calc(100% - 4.8rem)", top: "64%" },
  ] as const;

  return (
    <div
      aria-label={`${enteredParticles?.size ?? entered} of ${particles.length} glucose particles have moved into the muscle cell. ${resistant ? "The cell is responding less effectively to insulin, so more glucose remains in the bloodstream." : "Glucose particles are shown moving through the bloodstream."}`}
      className="relative min-h-56 overflow-hidden rounded-[1rem] border border-accent-warm/25 bg-[#efe7de] p-5"
      role="img"
    >
      <div className="absolute inset-x-4 top-1/2 h-20 -translate-y-1/2 rounded-full border border-accent-warm/25 bg-[#ead0c3]" />
      <div className="absolute right-5 top-1/2 z-10 size-24 -translate-y-1/2 rounded-full border-2 border-success/50 bg-info" />
      <div className="pointer-events-none absolute right-5 top-1/2 z-30 flex size-24 -translate-y-1/2 items-center justify-center text-center text-xs font-semibold text-info-foreground">
        <span className="rounded-full bg-info/90 px-2 py-1">Muscle cell</span>
      </div>
      {Array.from({ length: insulinSignals }, (_, signal) => (
        <span
          aria-hidden="true"
          className="absolute z-[15] h-4 w-8 rounded-full border border-success/60 bg-success/55"
          key={`signal-${signal}`}
          style={{ left: `${29 + signal * 13}%`, top: `${32 + (signal % 2) * 27}%` }}
        />
      ))}
      {particles.map((particle) => {
        const inside = enteredParticles ? enteredParticles.has(particle) : particle < entered;
        const restingLeft = resistant && !inside ? 52 + particle * 9 : 18 + particle * 14;
        const restingTop = 38 + (particle % 2) * 20;
        const position = inside
          ? insidePositions[particle]
          : { left: `${restingLeft}%`, top: `${restingTop}%` };

        return (
          <span
            aria-hidden="true"
            className="absolute z-20 size-4 rounded-full bg-[#d99a2b] shadow-sm transition-[left,top,transform,opacity] duration-700 ease-[var(--ease-standard)]"
            key={particle}
            style={{
              ...position,
              transitionDelay: `${particle * 90}ms`,
            }}
          />
        );
      })}
      <p className="absolute bottom-4 left-5 text-xs font-medium text-accent-warm">Bloodstream</p>
    </div>
  );
}

export function DayTwoExperience({ lesson: experience }: { lesson: LessonPlayerViewModel }) {
  const router = useRouter();
  const [stage, setStage] = useState(0);
  const [evaluations, setEvaluations] = useState<
    Partial<Record<EvaluationKey, DayTwoEvaluationFeedback>>
  >({});
  const [selectedAnswers, setSelectedAnswers] = useState<Partial<Record<EvaluationKey, string>>>(
    {},
  );
  const [systemPreview, setSystemPreview] = useState<PreviewId | null>(null);
  const [movedGlucose, setMovedGlucose] = useState<Set<number>>(() => new Set());
  const [signalSent, setSignalSent] = useState(false);
  const [signalArrived, setSignalArrived] = useState(false);
  const [signalReplay, setSignalReplay] = useState(0);
  const [normalStep, setNormalStep] = useState(1);
  const [resistanceLevel, setResistanceLevel] = useState(0);
  const [balanceFactors, setBalanceFactors] = useState<Set<string>>(() => new Set());
  const [selectedOrgan, setSelectedOrgan] = useState<OrganId | null>(null);
  const [viewedOrgans, setViewedOrgans] = useState<Set<OrganId>>(() => new Set());
  const [processOrder, setProcessOrder] = useState<ProcessKey[]>(["C", "A", "E", "B", "D"]);
  const [processAttempts, setProcessAttempts] = useState(0);
  const [processResolved, setProcessResolved] = useState(false);
  const [draggedProcess, setDraggedProcess] = useState<ProcessKey | null>(null);
  const [causeIndex, setCauseIndex] = useState(0);
  const [causeFeedback, setCauseFeedback] = useState<DayTwoEvaluationFeedback | null>(null);
  const [causeCompleted, setCauseCompleted] = useState(0);
  const [clarity, setClarity] = useState<ClarityChoice | null>(null);
  const [systemMode, setSystemMode] = useState<"effective" | "type2">("effective");
  const [reflection, setReflection] = useState<(typeof reflectionOptions)[number] | null>(null);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const stageRef = useRef<HTMLDivElement>(null);
  const signalTimerRef = useRef<number | null>(null);
  const storageKey = `health-decoded:day-two:${experience.lessonProgressId}`;

  useEffect(() => {
    if (experience.accessMode === "review") return;
    const stored = Number(window.localStorage.getItem(storageKey));
    if (Number.isInteger(stored) && stored >= 0 && stored < stageCount) setStage(stored);
  }, [experience.accessMode, storageKey]);

  useEffect(() => {
    if (stage > 0) stageRef.current?.focus();
  }, [stage]);

  useEffect(
    () => () => {
      if (signalTimerRef.current) window.clearTimeout(signalTimerRef.current);
    },
    [],
  );

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
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ behavior: reduced ? "auto" : "smooth", top: 0 });
  }

  async function evaluate(input: unknown, key: EvaluationKey, answer: string) {
    setSelectedAnswers((current) => ({ ...current, [key]: answer }));
    const result = await evaluateDayTwoAction(input);
    if (result.ok) setEvaluations((current) => ({ ...current, [key]: result.data }));
    else setMessage(result.message);
  }

  function playSignal() {
    if (signalTimerRef.current) window.clearTimeout(signalTimerRef.current);
    setSignalSent(false);
    setSignalArrived(false);
    setSignalReplay((value) => value + 1);
    const reducedMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.querySelector('[data-reduced-motion="true"]') !== null;

    window.requestAnimationFrame(() => {
      setSignalSent(true);
      if (reducedMotion) {
        setSignalArrived(true);
        return;
      }
      signalTimerRef.current = window.setTimeout(() => setSignalArrived(true), 900);
    });
  }

  function selectOrgan(id: OrganId) {
    setSelectedOrgan(id);
    setViewedOrgans((current) => new Set([...current, id]));
  }

  function moveProcessCard(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= processOrder.length) return;
    setProcessOrder((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target]!, next[index]!];
      return next;
    });
  }

  function dropProcessCard(target: ProcessKey) {
    if (!draggedProcess || draggedProcess === target) return;
    setProcessOrder((current) => {
      const withoutDragged = current.filter((key) => key !== draggedProcess);
      const targetIndex = withoutDragged.indexOf(target);
      withoutDragged.splice(targetIndex, 0, draggedProcess);
      return withoutDragged;
    });
    setDraggedProcess(null);
  }

  async function checkProcess() {
    const result = await evaluateDayTwoAction({ order: processOrder, stage: "process" });
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    setEvaluations((current) => ({ ...current, process: result.data }));
    setProcessAttempts((value) => value + 1);
    if (result.data.accurate) setProcessResolved(true);
  }

  async function evaluateCause(answer: "too_simple" | "more_accurate") {
    const result = await evaluateDayTwoAction({ answer, stage: "cause", statement: causeIndex });
    if (result.ok) {
      setCauseFeedback(result.data);
      if (causeIndex === causeStatements.length - 1) {
        setCauseCompleted(causeStatements.length);
      }
    } else setMessage(result.message);
  }

  function nextCauseStatement() {
    setCauseCompleted((value) => Math.max(value, causeIndex + 1));
    if (causeIndex < causeStatements.length - 1) {
      setCauseIndex((value) => value + 1);
      setCauseFeedback(null);
    }
  }

  function finishExperience() {
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
      router.push(result.data.nextRoute ?? "/journey");
    });
  }

  function canContinue() {
    if (stage === 0) return Boolean(evaluations.connection);
    if (stage === 1) return systemPreview !== null;
    if (stage === 2) return movedGlucose.size === 3 && Boolean(evaluations.glucose);
    if (stage === 3) return signalArrived;
    if (stage === 4) return normalStep === 5;
    if (stage === 5) return Boolean(evaluations.resistance);
    if (stage === 6) return resistanceLevel === 2;
    if (stage === 7) return balanceFactors.size === 3;
    if (stage === 8) return viewedOrgans.size === organDetails.length;
    if (stage === 9) return processResolved;
    if (stage === 10) return causeCompleted === causeStatements.length;
    if (stage === 11) return Boolean(evaluations.teachBack) && clarity !== null;
    if (stage === 12) return systemMode === "type2";
    return reflection !== null;
  }

  function stageRequirement() {
    const requirements = [
      "Choose the statement that best describes glucose.",
      "Open at least one part of the body system.",
      "Move all three glucose particles into the bloodstream, then answer what the body releases.",
      "Select “Send the insulin signal” to see how cells respond.",
      "Reveal all five steps in the glucose response.",
      "Choose what the pancreas could do next.",
      "Move the insulin-resistance control to its highest level.",
      "Select all three factors that shape the body’s insulin balance.",
      "Explore all five organs on the body map.",
      "Build the correct five-step sequence. After two attempts, you can reveal it.",
      "Classify all four statements as too simple or more accurate.",
      "Choose an explanation, then select which part feels clearest.",
      "Switch the system view to “With Type 2 diabetes.”",
      "Choose one reflection to complete Day 2.",
    ];

    return requirements[stage];
  }

  function continueLabel() {
    const labels = [
      "Follow the glucose",
      "See where glucose travels",
      "Meet insulin",
      "See the full response",
      "Compare the insulin signal",
      "See how the pancreas responds",
      "Look at the whole balance",
      "Explore the body system",
      "Put the process together",
      "Challenge a common myth",
      "Explain it in your own words",
      "Compare the two systems",
      "Reflect on what changed",
    ] as const;

    return labels[stage] ?? "Continue";
  }

  function renderStage() {
    switch (stage) {
      case 0:
        return (
          <div className="space-y-8">
            <DayTwoHeading label="A quick connection">
              Yesterday, you learned the main idea
            </DayTwoHeading>
            <Card className="rounded-[1rem] border-accent-warm/20 bg-[#f1e8df] p-6 sm:p-8">
              <p className="text-lg leading-8">
                Type 2 diabetes means that too much glucose is staying in your blood.
              </p>
              <p className="mt-3 text-lg leading-8">Today, we will look at why that happens.</p>
            </Card>
            <BloodstreamDiagram />
            <div className="space-y-3">
              <p className="font-semibold">Which statement best describes glucose?</p>
              {(
                [
                  ["A", "A source of energy your cells can use"],
                  ["B", "A waste product your body is trying to remove"],
                  ["C", "A medicine the pancreas makes"],
                ] as const
              ).map(([answer, label]) => (
                <AnswerChoice
                  key={answer}
                  onClick={() =>
                    void evaluate({ answer, stage: "connection" }, "connection", answer)
                  }
                  selected={selectedAnswers.connection === answer}
                >
                  <span>
                    <strong>{answer}.</strong> {label}
                  </span>
                </AnswerChoice>
              ))}
            </div>
            {evaluations.connection ? <ConceptFeedback feedback={evaluations.connection} /> : null}
          </div>
        );
      case 1: {
        const selected = previewItems.find(([id]) => id === systemPreview);
        return (
          <div className="space-y-8">
            <DayTwoHeading>Your body is not doing nothing</DayTwoHeading>
            <div className="space-y-3 text-lg leading-8 text-foreground/80">
              <p>
                Even with Type 2 diabetes, your body is still digesting food, producing energy,
                moving glucose through the blood, making insulin, and responding to changes
                throughout the day.
              </p>
              <p>
                The problem is that the system is no longer keeping blood glucose within a healthy
                range as effectively as it should.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {previewItems.map(([id, label]) => (
                <button
                  aria-pressed={systemPreview === id}
                  className={cn(
                    "flex min-h-28 flex-col items-center justify-center gap-3 rounded-2xl border bg-card p-3 text-center text-sm transition",
                    systemPreview === id
                      ? "scale-105 border-accent-warm/35 bg-accent-warm/8"
                      : "hover:border-accent-warm/25",
                  )}
                  key={id}
                  onClick={() => setSystemPreview(id)}
                  type="button"
                >
                  <span className="text-accent-warm">{iconForSystem(id)}</span>
                  {label}
                </button>
              ))}
            </div>
            {selected ? (
              <div
                aria-live="polite"
                className="animate-slide-up border-l-2 border-success bg-info p-6"
              >
                <p className="font-serif-display text-xl font-semibold">{selected[1]}</p>
                <p className="mt-2 leading-7">{selected[2]}</p>
              </div>
            ) : null}
            <p className="border-l-2 border-success bg-success/7 p-5 leading-7">
              Your body is still working. This is a change in how the system works. It is not
              evidence that your entire body has failed.
            </p>
          </div>
        );
      }
      case 2:
        return (
          <div className="space-y-8">
            <DayTwoHeading>Glucose is not the villain</DayTwoHeading>
            <div className="space-y-3 leading-7 text-foreground/80">
              <p>Glucose is a type of sugar your body can use for energy.</p>
              <p>
                Some glucose comes from carbohydrate-containing foods. Your liver can also release
                glucose when your body needs energy between meals or overnight.
              </p>
              <p>Your blood carries glucose to cells throughout the body.</p>
            </div>
            <div className="grid gap-3 text-center text-sm font-medium sm:grid-cols-3">
              {[
                "Food or liver",
                "Glucose enters the blood",
                "Glucose travels toward body cells",
              ].map((item, index) => (
                <div className="rounded-[9px] bg-muted p-4" key={item}>
                  {item}
                  {index < 2 ? (
                    <ChevronRight className="mx-auto mt-2 hidden size-4 sm:block" />
                  ) : null}
                </div>
              ))}
            </div>
            <div
              className="rounded-[1rem]"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                const particle = Number(event.dataTransfer.getData("text/plain"));
                if (Number.isInteger(particle))
                  setMovedGlucose((current) => new Set([...current, particle]));
              }}
            >
              <BloodstreamDiagram enteredParticles={movedGlucose} />
            </div>
            <div className="flex flex-wrap gap-3">
              {[0, 1, 2].map((particle) => (
                <button
                  aria-label={`Move glucose particle ${particle + 1} toward the muscle cell`}
                  className={cn(
                    "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm",
                    movedGlucose.has(particle) ? "border-success/30 bg-success/8" : "bg-card",
                  )}
                  draggable={!movedGlucose.has(particle)}
                  key={particle}
                  onClick={() => setMovedGlucose((current) => new Set([...current, particle]))}
                  onDragStart={(event) =>
                    event.dataTransfer.setData("text/plain", String(particle))
                  }
                  type="button"
                >
                  <span className="size-3 rounded-full bg-[#d99a2b]" />
                  {movedGlucose.has(particle) ? "Moved" : "Move glucose"}
                </button>
              ))}
            </div>
            {movedGlucose.size === 3 ? (
              <div className="animate-slide-up space-y-4">
                <p className="font-semibold">
                  Something helps glucose move into many cells. What do you think it is?
                </p>
                <div className="flex flex-wrap gap-3">
                  {(["insulin", "oxygen", "cholesterol"] as const).map((answer) => (
                    <Button
                      fullWidth={false}
                      key={answer}
                      onClick={() => void evaluate({ answer, stage: "glucose" }, "glucose", answer)}
                      variant={selectedAnswers.glucose === answer ? "primary" : "secondary"}
                    >
                      {answer[0]!.toUpperCase() + answer.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            ) : null}
            {evaluations.glucose ? <ConceptFeedback feedback={evaluations.glucose} /> : null}
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <DayTwoHeading>Insulin helps open the way</DayTwoHeading>
            <div className="space-y-3 leading-7 text-foreground/80">
              <p>Insulin is a hormone made by the pancreas.</p>
              <p>
                One of its main jobs is to help glucose move from the blood into many cells,
                including muscle and fat cells. Those cells can then use or store the glucose.
              </p>
            </div>
            <LessonMotionFigure variant="glucose-signal" />
            <div className="relative" key={signalReplay}>
              <BloodstreamDiagram entered={signalArrived ? 3 : 0} />
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-1/2 z-40 inline-flex h-8 w-20 -translate-y-1/2 items-center justify-center rounded-full border-2 border-success/50 bg-info text-[0.65rem] font-bold uppercase tracking-[0.1em] text-info-foreground shadow-sm transition-[left,opacity] duration-[900ms] ease-[var(--ease-standard)]",
                  signalSent ? "left-[72%] opacity-100" : "left-[12%] opacity-0",
                )}
              >
                Insulin
              </span>
            </div>
            <p className="border-l-2 border-success bg-info p-5 text-sm leading-6">
              This is a simplified picture. Insulin does not literally carry glucose or unlock a
              physical door. It sends signals that help cells take in and use glucose.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                disabled={signalSent && !signalArrived}
                fullWidth={false}
                onClick={playSignal}
              >
                {signalSent && !signalArrived ? "Signal traveling…" : "Send the insulin signal"}
              </Button>
              {signalArrived ? (
                <Button fullWidth={false} onClick={playSignal} variant="secondary">
                  <RotateCcw className="size-4" /> See it again
                </Button>
              ) : null}
            </div>
          </div>
        );
      case 4: {
        const steps = [
          "A meal contains carbohydrates.",
          "Digestion breaks some carbohydrates into glucose.",
          "Glucose enters the bloodstream.",
          "The pancreas releases insulin.",
          "Insulin helps many cells take in glucose, and the liver adjusts how much glucose it releases.",
        ];
        return (
          <div className="space-y-8">
            <DayTwoHeading>When the system responds well</DayTwoHeading>
            <p className="text-lg leading-8 text-muted-foreground">
              Reveal the response in order. Each step prepares the next one.
            </p>
            <div className="grid gap-3 sm:grid-cols-5">
              {steps.map((step, index) => {
                const revealed = index < normalStep;
                const isNext = index === normalStep;

                return (
                  <button
                    aria-label={
                      revealed
                        ? `Step ${index + 1}: ${step}`
                        : isNext
                          ? `Reveal step ${index + 1}`
                          : `Step ${index + 1} is waiting for the previous step`
                    }
                    className={cn(
                      "min-h-32 rounded-2xl border p-4 text-left text-sm leading-6 transition",
                      revealed && "border-success/25 bg-success/8",
                      isNext &&
                        "border-accent-warm/40 bg-card shadow-[0_2px_0_rgb(61_47_41/0.08)] hover:-translate-y-0.5",
                      !revealed && !isNext && "bg-card opacity-45",
                    )}
                    disabled={!isNext}
                    key={step}
                    onClick={() => setNormalStep(index + 1)}
                    type="button"
                  >
                    <span className="mb-3 block text-xs font-semibold text-success">
                      Step {index + 1}
                    </span>
                    {revealed ? (
                      step
                    ) : isNext ? (
                      <span className="font-semibold text-accent-warm">Reveal this step</span>
                    ) : (
                      <span className="text-muted-foreground">Waiting</span>
                    )}
                  </button>
                );
              })}
            </div>
            <ProgressBar
              label={`Normal glucose response: ${normalStep} of 5 steps`}
              value={(normalStep / 5) * 100}
            />
            {normalStep === 5 ? (
              <p className="animate-slide-up border-l-2 border-success bg-info p-5 leading-7">
                Blood glucose naturally rises and falls. Insulin helps keep those changes within a
                useful range.
              </p>
            ) : null}
          </div>
        );
      }
      case 5:
        return (
          <div className="space-y-8">
            <DayTwoHeading label="Compare">
              Sometimes the signal becomes less effective
            </DayTwoHeading>
            <div className="space-y-3 leading-7 text-foreground/80">
              <p>
                In insulin resistance, muscle, fat, and liver cells do not respond to insulin as
                effectively as they once did.
              </p>
              <p>
                The insulin signal is still present. The body simply needs more insulin to produce
                the same response.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="rounded-[1rem] border-success/20 bg-success/7">
                <h2 className="font-serif-display text-xl font-semibold">More responsive</h2>
                <div className="mt-4">
                  <BloodstreamDiagram entered={3} insulinSignals={1} />
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  One clear insulin signal helps all three glucose particles enter the cell.
                </p>
              </Card>
              <Card className="rounded-[1rem] border-accent-warm/20 bg-accent-warm/7">
                <h2 className="font-serif-display text-xl font-semibold">Less responsive</h2>
                <div className="mt-4">
                  <BloodstreamDiagram entered={1} insulinSignals={3} resistant />
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  More insulin is present, but two glucose particles still remain in the blood.
                </p>
              </Card>
            </div>
            <p className="font-semibold">What could the pancreas do next?</p>
            {(
              [
                ["A", "Make more insulin"],
                ["B", "Stop all glucose from entering the blood"],
                ["C", "Turn glucose into oxygen"],
              ] as const
            ).map(([answer, label]) => (
              <AnswerChoice
                key={answer}
                onClick={() => void evaluate({ answer, stage: "resistance" }, "resistance", answer)}
                selected={selectedAnswers.resistance === answer}
              >
                <span>
                  <strong>{answer}.</strong> {label}
                </span>
              </AnswerChoice>
            ))}
            {evaluations.resistance ? <ConceptFeedback feedback={evaluations.resistance} /> : null}
          </div>
        );
      case 6: {
        const demandWidths = ["w-1/3", "w-2/3", "w-full"];
        const outputWidths = ["w-1/3", "w-2/3", "w-2/3"];
        return (
          <div className="space-y-8">
            <DayTwoHeading>The pancreas often tries to compensate</DayTwoHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              When cells become less responsive to insulin, the pancreas may make more insulin to
              help keep blood glucose in range.
            </p>
            <LessonMotionFigure variant="insulin-response" />
            <div className="grid border-y border-border md:grid-cols-2">
              <section className="space-y-3 py-6 md:pr-8">
                <p className="editorial-eyebrow text-success">For a time</p>
                <p className="leading-7 text-foreground/80">This can work for some time.</p>
              </section>
              <section className="space-y-3 border-t border-border py-6 md:border-l md:border-t-0 md:pl-8">
                <p className="editorial-eyebrow text-accent-warm">As demand keeps rising</p>
                <p className="leading-7 text-foreground/80">
                  But the amount of insulin the body needs may continue to rise, and the pancreas
                  may eventually be unable to make enough insulin to meet that need.
                </p>
                <p className="leading-7 text-foreground/80">
                  When insulin resistance and reduced insulin supply occur together, more glucose
                  remains in the blood.
                </p>
              </section>
            </div>
            <Card className="space-y-6 rounded-[1rem] bg-[#f3e7df] p-6 sm:p-8">
              <h2 className="font-semibold">How much insulin support the body needs</h2>
              <input
                aria-label="Increasing insulin resistance"
                aria-valuetext={
                  ["Usual demand", "Increased demand", "Demand exceeds current supply"][
                    resistanceLevel
                  ]
                }
                className="w-full accent-[#b96c55]"
                max="2"
                min="0"
                onChange={(event) => setResistanceLevel(Number(event.target.value))}
                step="1"
                type="range"
                value={resistanceLevel}
              />
              <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                <span>Usual demand</span>
                <span className="text-center">Increased demand</span>
                <span className="text-right">Demand exceeds supply</span>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span>Insulin needed</span>
                    <span>{resistanceLevel === 2 ? "Demand is higher" : "Demand is rising"}</span>
                  </div>
                  <div className="h-4 rounded-full bg-white/70">
                    <div
                      className={cn(
                        "h-full rounded-full bg-accent-warm transition-all",
                        demandWidths[resistanceLevel],
                      )}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span>Pancreas output</span>
                    <span>{resistanceLevel === 2 ? "Current supply" : "Output responds"}</span>
                  </div>
                  <div className="h-4 rounded-full bg-white/70">
                    <div
                      className={cn(
                        "h-full rounded-full bg-success transition-all",
                        outputWidths[resistanceLevel],
                      )}
                    />
                  </div>
                </div>
              </div>
              {resistanceLevel === 2 ? (
                <p className="animate-slide-up rounded-2xl bg-white/65 p-4 leading-7">
                  A gap is now visible between what the body needs and what the pancreas can
                  currently provide. More glucose remains in the blood.
                </p>
              ) : null}
            </Card>
            <p className="text-sm text-muted-foreground">
              Type 2 diabetes often develops when the body needs more insulin than the pancreas can
              provide. This is a conceptual picture, not a personal measurement.
            </p>
          </div>
        );
      }
      case 7:
        return (
          <div className="space-y-8">
            <DayTwoHeading>So yes, you may still make insulin</DayTwoHeading>
            <p className="text-lg leading-8 text-foreground/80">
              Type 2 diabetes usually does not mean that the body has stopped making insulin.
            </p>
            <div className="relative mx-auto flex min-h-56 max-w-2xl items-center justify-between rounded-[1rem] border border-success/20 bg-info p-6 sm:p-10">
              <div className="w-[42%] text-center">
                <p className="font-semibold">Glucose entering or being released into the blood</p>
              </div>
              <div
                className={cn(
                  "h-2 w-16 origin-center rounded-full bg-accent-warm transition-transform duration-500",
                  balanceFactors.size === 0
                    ? "rotate-0"
                    : balanceFactors.size === 1
                      ? "rotate-6"
                      : balanceFactors.size === 2
                        ? "rotate-12"
                        : "rotate-[18deg]",
                )}
              >
                <span className="absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-warm" />
              </div>
              <div className="w-[42%] text-center">
                <p className="font-semibold">The body’s ability to move and manage glucose</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {["Insulin resistance", "Reduced insulin supply", "Liver glucose release"].map(
                (factor) => (
                  <button
                    aria-pressed={balanceFactors.has(factor)}
                    className={cn(
                      "min-h-14 rounded-2xl border bg-card p-4 text-sm font-medium transition",
                      balanceFactors.has(factor) && "border-accent-warm/35 bg-accent-warm/8",
                    )}
                    key={factor}
                    onClick={() => setBalanceFactors((current) => new Set([...current, factor]))}
                    type="button"
                  >
                    {balanceFactors.has(factor) ? <Check className="mr-2 inline size-4" /> : null}
                    {factor}
                  </button>
                ),
              )}
            </div>
            {balanceFactors.size === 3 ? (
              <div className="animate-slide-up space-y-3 border-l-2 border-success bg-info p-6">
                <p>
                  A person can make insulin and still have high blood glucose because the body may
                  not respond effectively, the insulin supply may not meet the body’s needs, and the
                  liver may release more glucose than the body can manage.
                </p>
                <p className="font-serif-display text-xl font-semibold">
                  The question is not only, “Do I make insulin?” It is also, “Is there enough
                  insulin, and is my body responding to it effectively?”
                </p>
              </div>
            ) : null}
          </div>
        );
      case 8: {
        const active = organDetails.find(([id]) => id === selectedOrgan);
        return (
          <div className="space-y-8">
            <DayTwoHeading>Several parts of the body are involved</DayTwoHeading>
            <div className="grid gap-6 md:grid-cols-[0.85fr_1.15fr]">
              <div className="relative min-h-[430px] rounded-[1rem] border border-success/20 bg-info p-6">
                <div
                  aria-hidden="true"
                  className="absolute left-1/2 top-10 h-80 w-40 -translate-x-1/2 rounded-[45%_45%_35%_35%] border border-accent-warm/15 bg-card/70"
                />
                {organDetails.map(([id, label], index) => (
                  <button
                    aria-pressed={selectedOrgan === id}
                    className={cn(
                      "absolute left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border bg-card px-3 py-2 text-xs font-medium shadow-card transition",
                      selectedOrgan === id
                        ? "scale-110 border-accent-warm/60"
                        : selectedOrgan
                          ? "opacity-45"
                          : "",
                    )}
                    key={id}
                    onClick={() => selectOrgan(id)}
                    style={{
                      top: `${72 + index * 60}px`,
                      marginLeft: `${index % 2 === 0 ? -35 : 38}px`,
                    }}
                    type="button"
                  >
                    {iconForSystem(id)} {label}
                  </button>
                ))}
              </div>
              <div className="space-y-4">
                {active ? (
                  <Card className="animate-slide-up rounded-3xl p-6">
                    <div className="flex items-center gap-3 text-accent-warm">
                      {iconForSystem(active[0])}
                      <h2 className="font-serif-display text-2xl font-semibold text-foreground">
                        {active[1]}
                      </h2>
                    </div>
                    <h3 className="mt-5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      Role
                    </h3>
                    <p className="mt-1 leading-7">{active[2]}</p>
                    <h3 className="mt-5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      In Type 2 diabetes
                    </h3>
                    <p className="mt-1 leading-7">{active[3]}</p>
                    <Button
                      className="mt-5"
                      fullWidth={false}
                      onClick={() => setSelectedOrgan(null)}
                      variant="text"
                    >
                      Back to the full system
                    </Button>
                  </Card>
                ) : (
                  <p className="border-l-2 border-success bg-info p-5 leading-7">
                    Select each part of the body to see its role. All explanations are also listed
                    below.
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Viewed {viewedOrgans.size} of {organDetails.length} body-system roles.
                </p>
              </div>
            </div>
            <details className="rounded-2xl border bg-card p-5">
              <summary className="cursor-pointer font-semibold">
                Text list of all body-system roles
              </summary>
              <div className="mt-5 space-y-5">
                {organDetails.map(([id, label, role, change]) => (
                  <div key={id}>
                    <h2 className="font-semibold">{label}</h2>
                    <p className="mt-1 text-sm leading-6">
                      <strong>Role:</strong> {role}
                    </p>
                    <p className="mt-1 text-sm leading-6">
                      <strong>In Type 2 diabetes:</strong> {change}
                    </p>
                  </div>
                ))}
              </div>
            </details>
          </div>
        );
      }
      case 9:
        return (
          <div className="space-y-8">
            <DayTwoHeading>Can you put the process together?</DayTwoHeading>
            <p className="text-muted-foreground">
              Drag the cards or use the move buttons. You will have one unassisted attempt, one
              guided retry, and then the option to reveal the sequence.
            </p>
            <div className="space-y-3">
              {processOrder.map((key, index) => {
                const text = processCards.find(([cardKey]) => cardKey === key)![1];
                return (
                  <div
                    className="flex items-start gap-3 rounded-2xl border bg-card p-4 shadow-card"
                    draggable
                    key={key}
                    onDragOver={(event) => event.preventDefault()}
                    onDragStart={() => setDraggedProcess(key)}
                    onDrop={() => dropProcessCard(key)}
                  >
                    <GripVertical
                      aria-hidden="true"
                      className="mt-1 size-5 shrink-0 text-muted-foreground"
                    />
                    <p className="flex-1 leading-7">{text}</p>
                    <div className="flex gap-1">
                      <button
                        aria-label={`Move ${text} earlier`}
                        className="rounded-md p-2 hover:bg-muted"
                        disabled={index === 0}
                        onClick={() => moveProcessCard(index, -1)}
                        type="button"
                      >
                        <ArrowUp className="size-4" />
                      </button>
                      <button
                        aria-label={`Move ${text} later`}
                        className="rounded-md p-2 hover:bg-muted"
                        disabled={index === processOrder.length - 1}
                        onClick={() => moveProcessCard(index, 1)}
                        type="button"
                      >
                        <ArrowDown className="size-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {!processResolved ? (
              <Button onClick={() => void checkProcess()}>Check the connection</Button>
            ) : null}
            {evaluations.process ? <ConceptFeedback feedback={evaluations.process} /> : null}
            {!processResolved && processAttempts >= 2 ? (
              <Button
                fullWidth={false}
                onClick={() => {
                  setProcessOrder(["A", "B", "C", "D", "E"]);
                  setProcessResolved(true);
                }}
                variant="secondary"
              >
                Show the sequence
              </Button>
            ) : null}
            {processResolved ? (
              <div className="animate-slide-up space-y-2 border-l-2 border-success bg-info p-6">
                {processOrder.map((key, index) => (
                  <p className="flex gap-3 leading-7" key={key}>
                    <span className="font-semibold text-accent-warm">{index + 1}</span>
                    {processCards.find(([cardKey]) => cardKey === key)![1]}
                  </p>
                ))}
              </div>
            ) : null}
          </div>
        );
      case 10:
        return (
          <div className="space-y-8">
            <DayTwoHeading>This did not happen because of one meal</DayTwoHeading>
            <div className="space-y-3 leading-7 text-foreground/80">
              <p>Type 2 diabetes usually develops gradually.</p>
              <p>
                Many influences can affect how the body responds to insulin and how much insulin the
                pancreas can make. These may include inherited biology, age, health history,
                patterns of activity and eating, sleep, medications, body composition, and other
                factors.
              </p>
              <p>No single choice explains the entire condition.</p>
            </div>
            <Card className="rounded-3xl p-6 text-center sm:p-9">
              <p className="editorial-eyebrow">Too simple or more accurate?</p>
              <p className="mt-5 font-serif-display text-2xl font-semibold leading-9">
                “{causeStatements[causeIndex]}”
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button
                  fullWidth={false}
                  onClick={() => void evaluateCause("too_simple")}
                  variant="secondary"
                >
                  Too simple
                </Button>
                <Button
                  fullWidth={false}
                  onClick={() => void evaluateCause("more_accurate")}
                  variant="secondary"
                >
                  More accurate
                </Button>
              </div>
            </Card>
            {causeFeedback ? (
              <div className="space-y-4">
                <ConceptFeedback feedback={causeFeedback} />
                {causeIndex < causeStatements.length - 1 ? (
                  <Button onClick={nextCauseStatement}>Try the next statement</Button>
                ) : null}
              </div>
            ) : null}
            <p className="text-sm text-muted-foreground">
              Statement {causeIndex + 1} of {causeStatements.length}
            </p>
          </div>
        );
      case 11: {
        const clarityChoices = Object.keys(clarityReviews) as ClarityChoice[];
        return (
          <div className="space-y-8">
            <DayTwoHeading>How would you explain it?</DayTwoHeading>
            <p className="font-semibold leading-7">
              A friend asks, “If you still make insulin, why is your blood glucose high?” Which
              answer would you give?
            </p>
            {(
              [
                [
                  "A",
                  "My body may still make insulin, but it may not respond to it effectively, and my pancreas may not make enough to meet the increased demand.",
                ],
                ["B", "My body no longer uses glucose for energy."],
                ["C", "Eating sugar permanently turned off my insulin."],
              ] as const
            ).map(([answer, label]) => (
              <AnswerChoice
                key={answer}
                onClick={() => void evaluate({ answer, stage: "teach_back" }, "teachBack", answer)}
                selected={selectedAnswers.teachBack === answer}
              >
                <span>
                  <strong>{answer}.</strong> {label}
                </span>
              </AnswerChoice>
            ))}
            {evaluations.teachBack ? <ConceptFeedback feedback={evaluations.teachBack} /> : null}
            {evaluations.teachBack ? (
              <div className="animate-slide-up space-y-4">
                <p className="font-semibold">Which part feels clearest now?</p>
                <div className="flex flex-wrap gap-2">
                  {clarityChoices.map((choice) => (
                    <button
                      aria-pressed={clarity === choice}
                      className={cn(
                        "min-h-11 rounded-full border bg-card px-4 py-2 text-sm",
                        clarity === choice && "border-accent-warm bg-accent-warm/8",
                      )}
                      key={choice}
                      onClick={() => setClarity(choice)}
                      type="button"
                    >
                      {choice}
                    </button>
                  ))}
                </div>
                {clarity ? (
                  <p aria-live="polite" className="border-l-2 border-success bg-info p-5 leading-7">
                    {clarityReviews[clarity]}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      }
      case 12: {
        const effective = [
          "Carbohydrate-containing food",
          "Glucose enters the blood",
          "The pancreas releases insulin",
          "Muscle and fat respond to insulin",
          "Cells take in glucose",
          "The liver adjusts glucose release",
        ];
        const type2 = [
          "Cells respond less effectively",
          "The liver may release too much glucose",
          "The pancreas may not meet the increased insulin need",
          "More glucose remains in the blood",
        ];
        const activeSteps = systemMode === "effective" ? effective : type2;
        return (
          <div className="space-y-8">
            <DayTwoHeading>Put the system together</DayTwoHeading>
            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-muted/50 p-1">
              <button
                aria-pressed={systemMode === "effective"}
                className={cn(
                  "min-h-12 rounded-xl px-3 text-sm font-medium",
                  systemMode === "effective" && "bg-card shadow-card",
                )}
                onClick={() => setSystemMode("effective")}
                type="button"
              >
                When the system responds effectively
              </button>
              <button
                aria-pressed={systemMode === "type2"}
                className={cn(
                  "min-h-12 rounded-xl px-3 text-sm font-medium",
                  systemMode === "type2" && "bg-card shadow-card",
                )}
                onClick={() => setSystemMode("type2")}
                type="button"
              >
                With Type 2 diabetes
              </button>
            </div>
            <div className="rounded-[1rem] border border-success/20 bg-info p-6 sm:p-9">
              <div className="mx-auto max-w-xl space-y-3" key={systemMode}>
                {activeSteps.map((step, index) => (
                  <div
                    className="animate-slide-up rounded-2xl bg-white/75 p-4 text-center font-medium"
                    key={step}
                    style={{ animationDelay: `${index * 70}ms` }}
                  >
                    {step}
                    {index < activeSteps.length - 1 ? <ChevronDownIcon /> : null}
                  </div>
                ))}
              </div>
            </div>
            <p className="border-l-2 border-success bg-success/8 p-5 font-serif-display text-xl font-semibold leading-8">
              Type 2 diabetes is not one broken part. It is a change in how several parts of the
              glucose system work together.
            </p>
          </div>
        );
      }
      default:
        return (
          <div className="space-y-9 border-l-2 border-success py-3 pl-6 sm:pl-9">
            <DayTwoHeading label="Reflection">
              What changed in how you see the diagnosis?
            </DayTwoHeading>
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
            {reflection ? (
              <div
                aria-live="polite"
                className="animate-slide-up border-l-2 border-success bg-info p-6 leading-7"
              >
                {reflection === "I feel less like one choice caused this."
                  ? "That is an important shift. Daily choices can affect glucose, but one decision does not explain the entire condition."
                  : reflection === "I am still confused."
                    ? "This is one of the more scientific lessons in the opening curriculum. You do not need to remember every organ. Start with two ideas: insulin helps the body manage glucose, and Type 2 diabetes can involve both insulin resistance and too little insulin for the body’s needs."
                    : "You can return to any part of this experience whenever you want another look."}
              </div>
            ) : null}
            {reflection ? (
              <div className="animate-fade-in space-y-6">
                <div>
                  <p className="editorial-eyebrow">Today you learned</p>
                  <h2 className="mt-3 font-serif-display text-4xl font-normal">
                    What to carry with you
                  </h2>
                </div>
                <div className="divide-y divide-border border-y border-border">
                  {[
                    ["Glucose", "A source of energy carried in the blood."],
                    ["Insulin", "A hormone that helps the body manage glucose."],
                    [
                      "Insulin resistance",
                      "The body does not respond to insulin as effectively as it should.",
                    ],
                    [
                      "The pancreas",
                      "May make more insulin for a time, but may eventually be unable to meet the body’s needs.",
                    ],
                    ["The result", "More glucose remains in the blood."],
                  ].map(([heading, body]) => (
                    <div className="grid gap-2 py-5 sm:grid-cols-[12rem_1fr]" key={heading}>
                      <h3 className="font-serif-display text-xl font-normal">{heading}</h3>
                      <p className="leading-7 text-muted-foreground">{body}</p>
                    </div>
                  ))}
                </div>
                <div className="border-y border-accent-warm/30 bg-[#f3e7df] p-6 text-center leading-8">
                  <p>
                    Yesterday, the diagnosis may have felt like a label. Today, you saw the system
                    behind it.
                  </p>
                  <p className="mt-2">
                    Tomorrow, you will learn what your test results can and cannot tell you.
                  </p>
                </div>
                <Button disabled={isPending} onClick={finishExperience} size="lg">
                  {isPending
                    ? "Saving…"
                    : experience.accessMode === "review"
                      ? "Return to lesson library"
                      : "Complete Day 2"}
                </Button>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button fullWidth={false} onClick={() => goToStage(8)} variant="text">
                    Review the body map
                  </Button>
                  <Button fullWidth={false} onClick={() => goToStage(9)} variant="text">
                    Review the five-step process
                  </Button>
                  <Link
                    className={buttonVariants({ fullWidth: false, variant: "text" })}
                    href="/lessons/1"
                  >
                    Return to Day 1
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        );
    }
  }

  return (
    <section className="mx-auto flex min-h-[calc(100dvh-10rem)] max-w-[920px] flex-col py-1 sm:py-4">
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
            <p className="text-sm font-semibold text-accent-warm">Day 2</p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              What is happening inside my body?
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
            <span>Stage {stage + 1}</span>
            <span>{stageCount} stages</span>
          </div>
          <ProgressBar
            label={`Day 2 stage ${stage + 1} of ${stageCount}`}
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
      >
        {message ?? ""}
      </p>
      <Modal
        description="Your stage will be saved. Activity choices and reflections are not stored as health information."
        onOpenChange={setExitOpen}
        open={exitOpen}
        title="Leave Day 2 for now?"
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
        description="Plain-language definitions used in this experience."
        onOpenChange={setGlossaryOpen}
        open={glossaryOpen}
        title="Day 2 glossary"
      >
        <div className="max-h-[60dvh] space-y-5 overflow-y-auto pr-2">
          {dayTwoGlossary.map((entry) => (
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

function ChevronDownIcon() {
  return (
    <ChevronRight
      aria-hidden="true"
      className="mx-auto mt-2 size-4 rotate-90 text-muted-foreground"
    />
  );
}
