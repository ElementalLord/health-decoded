"use client";

import {
  ArrowLeft,
  BookOpen,
  Check,
  CloudRain,
  Droplets,
  HeartHandshake,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  Waypoints,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  evaluateDayTwelveAction,
  type DayTwelveEvaluationFeedback,
} from "@/features/lessons/actions/day-twelve.actions";
import { completeLessonAction } from "@/features/lessons/actions/lesson-completion.actions";
import { saveLessonPositionAction } from "@/features/lessons/actions/lesson-progress.actions";
import { LessonStoryImage } from "@/features/lessons/components/lesson-story-image";
import styles from "@/features/lessons/components/day-twelve-experience.module.css";
import type { LessonPlayerViewModel } from "@/features/lessons/types/lesson-player";
import { cn } from "@/lib/utils";

const stageCount = 10;

const openingFeelings = [
  ["tired", "I am tired of plans falling apart"],
  ["careful", "I want a calmer way to handle surprises"],
  ["curious", "I am curious what a backup plan could look like"],
  ["ready", "I am ready to practice with real-life situations"],
] as const;

const solverSteps = [
  {
    body: "Take one breath and interrupt the all-or-nothing story. Nothing has to be solved in the first second.",
    id: "pause",
    number: "01",
    title: "Pause",
  },
  {
    body: "Name what actually changed: time, food, energy, symptoms, supplies, support, or something else.",
    id: "understand",
    number: "02",
    title: "Understand",
  },
  {
    body: "Pick one useful option that is available now. It can be smaller or different from the original plan.",
    id: "choose",
    number: "03",
    title: "Choose",
  },
  {
    body: "Notice what happened and revise again if needed. Adjusting is part of the skill, not evidence the first choice failed.",
    id: "adjust",
    number: "04",
    title: "Adjust",
  },
] as const;
type SolverStepId = (typeof solverSteps)[number]["id"];

const lifeSituations = [
  ["late_meal", "Lunch moves two hours later than expected"],
  ["restaurant", "The restaurant has nothing you planned for"],
  ["long_shift", "A workday stretches longer than usual"],
  ["celebration", "A celebration changes the whole evening"],
] as const;
type LifeSituationId = (typeof lifeSituations)[number][0];

const lifeTools = [
  ["notice", "Notice what changed before judging the day"],
  ["available", "Choose the most supportive option that is actually available"],
  ["small", "Protect one small routine: water, a pause, movement, or rest"],
  ["support", "Ask someone for practical help or more time"],
  ["return", "Let the next decision be a fresh decision"],
] as const;
type LifeToolId = (typeof lifeTools)[number][0];

const sickDayPriorities = [
  {
    body: "Drink fluids as you are able. If you cannot keep liquids down or show signs of severe dehydration, seek medical help rather than trying to push through alone.",
    id: "fluids",
    title: "Protect hydration",
    Icon: Droplets,
  },
  {
    body: "Illness and stress hormones can raise glucose even when you eat less. Follow your personal sick-day plan for when and how often to check.",
    id: "monitor",
    title: "Follow the monitoring plan",
    Icon: CloudRain,
  },
  {
    body: "Keep taking medicines as prescribed unless your clinician's written sick-day plan tells you otherwise. If you are unsure, call your care team or pharmacist.",
    id: "medicine",
    title: "Use medicine-specific guidance",
    Icon: Stethoscope,
  },
  {
    body: "Write down who to call and which symptoms mean urgent or emergency help. Asking early is a protective action, not an overreaction.",
    id: "help",
    title: "Know the help signals",
    Icon: HeartHandshake,
  },
] as const;
type SickPriorityId = (typeof sickDayPriorities)[number]["id"];

const planTriggers = [
  ["walk", "My planned walk does not happen"],
  ["dinner", "Dinner is delayed or different"],
  ["work", "Work uses all the energy I expected to have"],
  ["restaurant", "A restaurant plan changes at the last minute"],
] as const;
type PlanTriggerId = (typeof planTriggers)[number][0];

const planBackups = [
  ["minutes", "I will choose five useful minutes instead of abandoning the whole idea"],
  ["next", "I will make the next meal or decision supportive without punishing this one"],
  ["ask", "I will ask for help, more time, or the information I need"],
  ["reset", "I will pause, check what is possible now, and choose one small anchor"],
] as const;
type PlanBackupId = (typeof planBackups)[number][0];

const glossary = [
  {
    definition:
      "A day when illness changes eating, drinking, glucose patterns, or the way a diabetes care plan needs to be followed.",
    term: "Sick day",
  },
  {
    definition:
      "Chemicals produced when the body breaks down fat for energy. Whether and when to check them depends on a person's diabetes type, medicines, symptoms, and clinician's sick-day plan.",
    term: "Ketones",
  },
  {
    definition:
      "Not having enough fluid in the body. Repeated vomiting, diarrhea, fever, or trouble drinking can make dehydration more likely.",
    term: "Dehydration",
  },
  {
    definition:
      "A prepared alternative that keeps care moving when the original routine no longer fits the moment.",
    term: "Backup plan",
  },
] as const;

function LessonHeading({
  centered = false,
  children,
  label,
}: {
  centered?: boolean;
  children: ReactNode;
  label?: string;
}) {
  return (
    <div className={cn("space-y-3", centered && "mx-auto max-w-4xl text-center")}>
      {label ? <p className="editorial-eyebrow">{label}</p> : null}
      <h1 className={cn(styles.lessonTitle, centered && "mx-auto")}>{children}</h1>
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
      className={cn(styles.answerChoice, selected && styles.answerChoiceSelected)}
      onClick={onClick}
      type="button"
    >
      <span aria-hidden="true" className={styles.answerMarker}>
        {selected ? <Check className="size-3.5" /> : null}
      </span>
      <span>{children}</span>
    </button>
  );
}

function Feedback({ feedback }: { feedback: DayTwelveEvaluationFeedback }) {
  return (
    <div
      aria-live="polite"
      className={cn(
        styles.feedback,
        feedback.accurate ? styles.feedbackAccurate : styles.feedbackTry,
      )}
      role="status"
    >
      <Waypoints aria-hidden="true" />
      <div>
        <p className="font-serif-display text-2xl italic">{feedback.heading}</p>
        <p className="mt-2 leading-7">{feedback.body}</p>
      </div>
    </div>
  );
}

function AdaptiveDayTimeline() {
  const originalPlan = [
    ["Morning", "Usual start"],
    ["12:00", "Planned lunch"],
    ["After work", "Planned walk"],
    ["Evening", "Dinner at home"],
  ] as const;
  const changedDay = [
    ["Morning", "Usual start"],
    ["12:00", "Meeting runs long"],
    ["2:00", "Best available lunch"],
    ["Evening", "Return to the next routine"],
  ] as const;

  return (
    <figure className={styles.teachingFigure}>
      <div className={styles.visualIntro}>
        <p className="editorial-eyebrow">One day · two valid routes</p>
        <h2>The plan changed. Care did not disappear.</h2>
        <p>Follow the lower timeline: the interruption changes two steps, not the whole day.</p>
      </div>
      <div className={styles.timelineComparison}>
        <section className={styles.timelineLane}>
          <div className={styles.timelineLaneLabel}>
            <span>Plan A</span>
            <strong>What I expected</strong>
          </div>
          <ol className={styles.timelineSteps} data-route="original">
            {originalPlan.map(([time, event]) => (
              <li key={`${time}-${event}`}>
                <span>{time}</span>
                <strong>{event}</strong>
              </li>
            ))}
          </ol>
        </section>
        <section className={styles.timelineLane}>
          <div className={styles.timelineLaneLabel}>
            <span>Real life</span>
            <strong>What actually happened</strong>
          </div>
          <ol className={styles.timelineSteps} data-route="adapted">
            {changedDay.map(([time, event], index) => (
              <li
                data-kind={index === 1 ? "change" : index > 1 ? "response" : "steady"}
                key={`${time}-${event}`}
              >
                <span>{time}</span>
                <strong>{event}</strong>
              </li>
            ))}
          </ol>
        </section>
      </div>
      <figcaption className={styles.figureCaption}>
        <strong>The interruption is one part of the day, not a verdict on the day.</strong> The
        animation highlights the exact sequence: notice what changed, make the next workable choice,
        then reconnect with the routine that is still available.
      </figcaption>
    </figure>
  );
}

function SickDayCauseAndResponse() {
  return (
    <figure className={styles.teachingFigure}>
      <div className={styles.visualIntro}>
        <p className="editorial-eyebrow">What illness changes</p>
        <h2>New conditions need a different response.</h2>
        <p>The highlight moves from cause to body changes to the actions that protect you.</p>
      </div>
      <div className={styles.causeFlow}>
        <section className={styles.flowPanel}>
          <CloudRain aria-hidden="true" />
          <p className="editorial-eyebrow">1 · Illness begins</p>
          <h3>The body releases stress hormones.</h3>
          <p>This response helps fight illness, but it can also change diabetes management.</p>
        </section>
        <span aria-hidden="true" className={styles.flowConnector} />
        <section className={styles.flowPanel}>
          <Waypoints aria-hidden="true" />
          <p className="editorial-eyebrow">2 · What may change</p>
          <h3>Glucose may rise even when you eat less.</h3>
          <p>Vomiting, diarrhea, or fever can also increase fluid loss and dehydration risk.</p>
        </section>
        <span aria-hidden="true" className={styles.flowConnector} />
        <section className={styles.flowPanel}>
          <Droplets aria-hidden="true" />
          <p className="editorial-eyebrow">3 · What protects</p>
          <h3>Use the written sick-day plan.</h3>
          <p>
            Follow personal monitoring and medicine guidance, drink as able, and call early for
            warning signs.
          </p>
        </section>
      </div>
      <figcaption className={styles.figureCaption}>
        <strong>Eating less does not guarantee that glucose will fall during illness.</strong> The
        useful response is preparation: personal instructions, hydration when possible, and clear
        thresholds for getting help.
      </figcaption>
    </figure>
  );
}

function BackupPlanSequence({
  planBackup,
  planTrigger,
}: {
  planBackup: PlanBackupId | null;
  planTrigger: PlanTriggerId | null;
}) {
  const change =
    planTriggers.find(([id]) => id === planTrigger)?.[1] ??
    "A long workday uses the time I planned";
  const response =
    planBackups.find(([id]) => id === planBackup)?.[1] ??
    "I will choose five useful minutes instead of abandoning the whole idea";

  return (
    <figure className={styles.teachingFigure}>
      <div className={styles.visualIntro}>
        <p className="editorial-eyebrow">Plan B keeps the purpose</p>
        <h2>The action changes. The care still counts.</h2>
        <p>This sequence updates as you make your choices below.</p>
      </div>
      <ol className={styles.planSequence}>
        <li>
          <span>1 · Plan A</span>
          <strong>Protect one supportive routine today</strong>
        </li>
        <li data-kind="change">
          <span>2 · Life changes</span>
          <strong>{change}</strong>
        </li>
        <li data-kind="response">
          <span>3 · Plan B</span>
          <strong>{response}</strong>
        </li>
        <li data-kind="continue">
          <span>4 · What remains true</span>
          <strong>I am still practicing care</strong>
        </li>
      </ol>
      <figcaption className={styles.figureCaption}>
        <strong>Plan B is a prepared response, not a lesser plan.</strong> It keeps the reason
        behind the routine while changing the action to fit the day you actually have.
      </figcaption>
    </figure>
  );
}

export function DayTwelveExperience({ lesson: experience }: { lesson: LessonPlayerViewModel }) {
  const router = useRouter();
  const [stage, setStage] = useState(0);
  const [openingFeeling, setOpeningFeeling] = useState<string | null>(null);
  const [openedSolverSteps, setOpenedSolverSteps] = useState<Set<SolverStepId>>(() => new Set());
  const [activeSolverStep, setActiveSolverStep] = useState<SolverStepId | null>(null);
  const [lifeSituation, setLifeSituation] = useState<LifeSituationId | null>(null);
  const [lifeToolChoices, setLifeToolChoices] = useState<Set<LifeToolId>>(() => new Set());
  const [sickPriorities, setSickPriorities] = useState<Set<SickPriorityId>>(() => new Set());
  const [activeSickPriority, setActiveSickPriority] = useState<SickPriorityId | null>(null);
  const [planTrigger, setPlanTrigger] = useState<PlanTriggerId | null>(null);
  const [planBackup, setPlanBackup] = useState<PlanBackupId | null>(null);
  const [scriptSituation, setScriptSituation] = useState("");
  const [scriptAction, setScriptAction] = useState("");
  const [scriptWarning, setScriptWarning] = useState("");
  const [scriptCall, setScriptCall] = useState("");
  const [evaluations, setEvaluations] = useState<
    Partial<
      Record<
        "lateLunch" | "sickDay" | "missedMedication" | "teachBack",
        DayTwelveEvaluationFeedback
      >
    >
  >({});
  const [selectedAnswers, setSelectedAnswers] = useState<
    Partial<Record<"lateLunch" | "sickDay" | "missedMedication" | "teachBack", string>>
  >({});
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const stageRef = useRef<HTMLDivElement>(null);
  const storageKey = `health-decoded:day-twelve:${experience.lessonProgressId}`;

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

  async function evaluate(
    input: unknown,
    key: "lateLunch" | "sickDay" | "missedMedication" | "teachBack",
    answer: string,
  ) {
    setSelectedAnswers((current) => ({ ...current, [key]: answer }));
    const result = await evaluateDayTwelveAction(input);
    if (result.ok) setEvaluations((current) => ({ ...current, [key]: result.data }));
    else setMessage(result.message);
  }

  function toggleLifeTool(id: LifeToolId) {
    setLifeToolChoices((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function canContinue() {
    if (stage === 0) return openingFeeling !== null;
    if (stage === 1) return openedSolverSteps.size === solverSteps.length;
    if (stage === 2) return Boolean(evaluations.lateLunch);
    if (stage === 3) return lifeSituation !== null && lifeToolChoices.size >= 2;
    if (stage === 4) return sickPriorities.size === sickDayPriorities.length;
    if (stage === 5) return Boolean(evaluations.sickDay);
    if (stage === 6) return Boolean(evaluations.missedMedication);
    if (stage === 7) return planTrigger !== null && planBackup !== null;
    if (stage === 8) {
      return (
        scriptSituation.trim().length >= 4 &&
        scriptAction.trim().length >= 4 &&
        scriptWarning.trim().length >= 4 &&
        scriptCall.trim().length >= 4 &&
        Boolean(evaluations.teachBack)
      );
    }
    return true;
  }

  function stageRequirement() {
    return [
      "Choose how real-life disruptions feel as you begin.",
      "Open all four parts of the problem-solving cycle.",
      "Choose the most useful response to the late-lunch scenario.",
      "Choose one interruption and at least two tools that could help.",
      "Open all four sick-day priorities.",
      "Choose the safe response to Jordan's symptoms.",
      "Choose the safe response to a missed medication dose.",
      "Choose a Plan A disruption and a Plan B response.",
      "Complete the three-part script and run the solver once more.",
    ][stage];
  }

  function continueLabel() {
    return (
      [
        "Meet the four-step solver",
        "Practice a changed meal",
        "Build a flexible day",
        "Prepare for sick days",
        "Learn when to get help",
        "Handle a missed dose safely",
        "Build Plan B",
        "Write your real-life script",
        "Review the problem-solving sequence",
      ][stage] ?? "Continue"
    );
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

  function renderStage() {
    switch (stage) {
      case 0:
        return (
          <div className="space-y-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_18rem] lg:items-end">
              <LessonHeading label="Day 12 · Problem solving for real life">
                A changed plan can still carry you forward.
              </LessonHeading>
              <div className={styles.dayNote}>
                <p className="editorial-number">12</p>
                <p>
                  Today is a practice space for late meals, long days, illness, missed routines, and
                  the next useful choice.
                </p>
              </div>
            </div>
            <LessonStoryImage
              alt="Friends laughing around a picnic table while others play catch and share a hug in a sunny park"
              caption="Friendship, food, movement, laughter, and changed schedules are the life the plan is meant to support."
              emphasis="Care belongs inside a full life."
              priority
              src="/lessons/day-12/community-in-real-life.jpg"
            />
            <div>
              <p className={styles.promptTitle}>
                When a careful plan changes, what feels most true?
              </p>
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
            </div>
            {openingFeeling ? (
              <div className={styles.reassurance}>
                <Sparkles aria-hidden="true" />
                <p>
                  Real life is allowed in this room. Diabetes care is not an exam, and one meal,
                  missed routine, or difficult day does not decide your health. Today you will
                  practice staying connected to care when the original plan no longer fits.
                </p>
              </div>
            ) : null}
          </div>
        );
      case 1:
        return (
          <div className="space-y-9">
            <LessonHeading label="A reusable way through">
              Four small moves can make a difficult moment feel workable.
            </LessonHeading>
            <AdaptiveDayTimeline />
            <p className={styles.lede}>
              Open each move. They happen in order, but the cycle stays flexible: new information
              may send you back around.
            </p>
            <div className={styles.solverGrid}>
              {solverSteps.map((item) => {
                const active = activeSolverStep === item.id;
                const opened = openedSolverSteps.has(item.id);
                return (
                  <button
                    aria-expanded={active}
                    className={cn(
                      styles.solverCard,
                      opened && styles.solverCardOpened,
                      active && styles.solverCardActive,
                    )}
                    key={item.id}
                    onClick={() => {
                      setOpenedSolverSteps((current) => new Set(current).add(item.id));
                      setActiveSolverStep((current) => (current === item.id ? null : item.id));
                    }}
                    type="button"
                  >
                    <span className={styles.stepNumber}>{item.number}</span>
                    <span>
                      <strong>{item.title}</strong>
                      {active ? <span className={styles.stepBody}>{item.body}</span> : null}
                    </span>
                    {opened ? <Check aria-hidden="true" className="size-5" /> : null}
                  </button>
                );
              })}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-9">
            <LessonHeading label="Practice: lunch moved">
              The best available choice is not a consolation prize.
            </LessonHeading>
            <div className={styles.scenarioPanel}>
              <p className="editorial-eyebrow">The interruption</p>
              <h2>A meeting runs long. Lunch is late.</h2>
              <p>
                The nearby option is a sandwich, chips, and a cookie. It is not what you planned,
                and you still need to decide what happens next.
              </p>
            </div>
            <div className={styles.solverLine} aria-label="Four-step real-life solver">
              {solverSteps.map((item) => (
                <div key={item.id}>
                  <span>{item.number}</span>
                  <strong>{item.title}</strong>
                </div>
              ))}
            </div>
            <div className="border-y border-border py-8">
              <p className={styles.promptTitle}>Which response uses the four-step solver?</p>
              <div className="mt-6 grid gap-3">
                {(
                  [
                    [
                      "best_available",
                      "Choose the best available meal, notice what is in it, and return to the usual pattern at the next opportunity.",
                    ],
                    [
                      "skip_to_compensate",
                      "Skip food now to make up for the options not being ideal.",
                    ],
                    ["day_is_ruined", "Treat the whole day as ruined and stop paying attention."],
                  ] as const
                ).map(([answer, label]) => (
                  <AnswerChoice
                    key={answer}
                    onClick={() => evaluate({ answer, stage: "late_lunch" }, "lateLunch", answer)}
                    selected={selectedAnswers.lateLunch === answer}
                  >
                    {label}
                  </AnswerChoice>
                ))}
              </div>
            </div>
            {evaluations.lateLunch ? <Feedback feedback={evaluations.lateLunch} /> : null}
            <p className={styles.careNote}>
              If delayed meals affect your medicines or cause symptoms, follow your personal plan
              and contact your care team when needed. This practice does not replace those
              instructions.
            </p>
          </div>
        );
      case 3:
        return (
          <div className="space-y-9">
            <LessonHeading label="Design for the day you actually have">
              Protect one helpful action instead of demanding the whole plan.
            </LessonHeading>
            <div className={styles.builderBoard}>
              <div>
                <p className="editorial-eyebrow">1 · Choose an interruption</p>
                <div className="mt-4 space-y-3">
                  {lifeSituations.map(([id, label]) => (
                    <AnswerChoice
                      key={id}
                      onClick={() => setLifeSituation(id)}
                      selected={lifeSituation === id}
                    >
                      {label}
                    </AnswerChoice>
                  ))}
                </div>
              </div>
              <div>
                <p className="editorial-eyebrow">2 · Choose at least two useful tools</p>
                <div className="mt-4 space-y-3">
                  {lifeTools.map(([id, label]) => (
                    <AnswerChoice
                      key={id}
                      onClick={() => toggleLifeTool(id)}
                      selected={lifeToolChoices.has(id)}
                    >
                      {label}
                    </AnswerChoice>
                  ))}
                </div>
              </div>
            </div>
            {lifeSituation && lifeToolChoices.size >= 2 ? (
              <div className={styles.fieldNote}>
                <RotateCcw aria-hidden="true" />
                <div>
                  <p className="editorial-eyebrow">Your flexible-day note</p>
                  <p>
                    When {lifeSituations.find(([id]) => id === lifeSituation)?.[1].toLowerCase()}, I
                    can use {lifeToolChoices.size} tools instead of calling the day a failure.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        );
      case 4:
        return (
          <div className="space-y-9">
            <LessonHeading label="When illness changes the conditions">
              A sick day needs a plan of its own.
            </LessonHeading>
            <LessonStoryImage
              alt="A trusted friend sitting close to someone resting on a sofa, offering water beside a phone and written care plan"
              caption="A trusted person can help with fluids, read the written plan, notice when symptoms are worsening, and make a call when thinking feels harder."
              emphasis="A sick-day plan can include people."
              src="/lessons/day-12/sick-day-support.jpg"
            />
            <SickDayCauseAndResponse />
            <div>
              <p className={styles.promptTitle}>
                Open the four anchors of a personal sick-day plan.
              </p>
              <div className={styles.priorityGrid}>
                {sickDayPriorities.map(({ body, id, title, Icon }) => {
                  const active = activeSickPriority === id;
                  const opened = sickPriorities.has(id);
                  return (
                    <button
                      aria-expanded={active}
                      className={cn(styles.priorityCard, opened && styles.priorityCardOpened)}
                      key={id}
                      onClick={() => {
                        setSickPriorities((current) => new Set(current).add(id));
                        setActiveSickPriority((current) => (current === id ? null : id));
                      }}
                      type="button"
                    >
                      <Icon aria-hidden="true" />
                      <span>
                        <strong>{title}</strong>
                        {active ? <span>{body}</span> : null}
                      </span>
                      {opened ? <Check aria-hidden="true" className="size-5" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>
            <p className={styles.careNote}>
              Medicine, insulin, glucose-checking, and ketone instructions vary by regimen and
              health history. Build those details with your diabetes care team before you are sick.
            </p>
          </div>
        );
      case 5:
        return (
          <div className="space-y-9">
            <LessonHeading label="Make the call usable">
              A clear handoff helps the care team answer the real question.
            </LessonHeading>
            <div className={styles.signalBoard}>
              <div>
                <span className={styles.signalMark} data-tone="steady" />
                <p className="editorial-eyebrow">What changed</p>
                <p>
                  Symptoms, when they began, ability to drink or eat, and whether anything is
                  worsening.
                </p>
              </div>
              <div>
                <span className={styles.signalMark} data-tone="call" />
                <p className="editorial-eyebrow">What you already followed</p>
                <p>
                  The written sick-day instructions, fluids, exact medicine names, and readings or
                  ketones only when the personal plan asks for them.
                </p>
              </div>
              <div>
                <span className={styles.signalMark} data-tone="urgent" />
                <p className="editorial-eyebrow">What you need answered</p>
                <p>
                  What to do next, which written instruction applies, and what change should prompt
                  another call or urgent help.
                </p>
              </div>
            </div>
            <div className={styles.scenarioPanel}>
              <p className="editorial-eyebrow">Jordan&apos;s sick day</p>
              <h2>Jordan has a fever, can drink, and is thinking clearly, but is eating less.</h2>
              <p>Jordan has the written plan nearby but is unsure how one instruction applies.</p>
            </div>
            <div className="border-y border-border py-8">
              <p className={styles.promptTitle}>What makes the care-team call most useful?</p>
              <div className="mt-6 grid gap-3">
                {(
                  [
                    [
                      "call_with_details",
                      "Share what changed, what the written plan says, the exact medicines involved, and the specific question that remains.",
                    ],
                    [
                      "guess_medicine",
                      "Guess which medicine rule applies and call only if it fails.",
                    ],
                    [
                      "wait_without_plan",
                      "Wait without using the written plan because the symptoms are not dramatic.",
                    ],
                  ] as const
                ).map(([answer, label]) => (
                  <AnswerChoice
                    key={answer}
                    onClick={() => evaluate({ answer, stage: "sick_day" }, "sickDay", answer)}
                    selected={selectedAnswers.sickDay === answer}
                  >
                    {label}
                  </AnswerChoice>
                ))}
              </div>
            </div>
            {evaluations.sickDay ? <Feedback feedback={evaluations.sickDay} /> : null}
            <div className={styles.urgentNote}>
              <ShieldAlert aria-hidden="true" />
              <p>
                Day 9 owns emergency-signal practice. Keep that action plan available: severe
                trouble breathing, new confusion, difficulty waking, or another immediate danger
                needs emergency help rather than a routine message.
              </p>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-9">
            <LessonHeading label="Medication details are specific">
              A missed dose needs the right instruction, not a guessed correction.
            </LessonHeading>
            <div className={styles.medicineEditorial}>
              <div>
                <p className="editorial-eyebrow">What stays true</p>
                <h2>Pause before trying to “make up” a dose.</h2>
                <p>
                  Different medicines stay in the body for different lengths of time and have
                  different missed-dose instructions.
                </p>
              </div>
              <div>
                <p className="editorial-eyebrow">Where to look</p>
                <ul>
                  <li>The instructions that came with the exact medicine</li>
                  <li>Your written plan from the prescriber</li>
                  <li>A pharmacist or diabetes care team</li>
                </ul>
              </div>
            </div>
            <div className="border-y border-border py-8">
              <p className={styles.promptTitle}>
                You remember a missed diabetes-medicine dose later in the day. What is the safest
                general response?
              </p>
              <div className="mt-6 grid gap-3">
                {(
                  [
                    [
                      "follow_instructions",
                      "Check the exact medicine instructions and contact a pharmacist or care team if I am unsure.",
                    ],
                    ["double_next_dose", "Automatically double the next dose to catch up."],
                    ["stop_everything", "Stop every diabetes medicine until the next appointment."],
                  ] as const
                ).map(([answer, label]) => (
                  <AnswerChoice
                    key={answer}
                    onClick={() =>
                      evaluate({ answer, stage: "missed_medication" }, "missedMedication", answer)
                    }
                    selected={selectedAnswers.missedMedication === answer}
                  >
                    {label}
                  </AnswerChoice>
                ))}
              </div>
            </div>
            {evaluations.missedMedication ? (
              <Feedback feedback={evaluations.missedMedication} />
            ) : null}
            <p className={styles.careNote}>
              Do not double a dose unless the medicine instructions or a qualified clinician
              specifically tell you to do so.
            </p>
          </div>
        );
      case 7:
        return (
          <div className="space-y-9">
            <LessonHeading label="Prepare the backup before you need it">
              Plan A gives direction. Plan B keeps care usable.
            </LessonHeading>
            <LessonStoryImage
              alt="Friends laughing and dancing together indoors while rain falls outside and two people share a joyful hug"
              caption="The outdoor plan changed, but connection, laughter, and movement did not vanish. The purpose continued in a new form."
              emphasis="A changed plan can still be a good time."
              src="/lessons/day-12/plan-b-together.jpg"
            />
            <BackupPlanSequence planBackup={planBackup} planTrigger={planTrigger} />
            <div className={styles.builderBoard}>
              <div>
                <p className="editorial-eyebrow">Plan A changes when…</p>
                <div className="mt-4 space-y-3">
                  {planTriggers.map(([id, label]) => (
                    <AnswerChoice
                      key={id}
                      onClick={() => setPlanTrigger(id)}
                      selected={planTrigger === id}
                    >
                      {label}
                    </AnswerChoice>
                  ))}
                </div>
              </div>
              <div>
                <p className="editorial-eyebrow">My Plan B is…</p>
                <div className="mt-4 space-y-3">
                  {planBackups.map(([id, label]) => (
                    <AnswerChoice
                      key={id}
                      onClick={() => setPlanBackup(id)}
                      selected={planBackup === id}
                    >
                      {label}
                    </AnswerChoice>
                  ))}
                </div>
              </div>
            </div>
            {planTrigger && planBackup ? (
              <div className={styles.planTicket}>
                <p className="editorial-eyebrow">Your Plan B</p>
                <p>
                  If {planTriggers.find(([id]) => id === planTrigger)?.[1].toLowerCase()},{" "}
                  {planBackups.find(([id]) => id === planBackup)?.[1].toLowerCase()}.
                </p>
              </div>
            ) : null}
          </div>
        );
      case 8:
        return (
          <div className="space-y-9">
            <LessonHeading label="Make the skill yours">
              Write one script you can use when real life gets loud.
            </LessonHeading>
            <p className={styles.lede}>
              Use everyday language. Your entries stay on this page and are not saved as health
              information.
            </p>
            <div className={styles.scriptBuilder}>
              <label>
                <span>If this happens…</span>
                <input
                  maxLength={120}
                  onChange={(event) => setScriptSituation(event.target.value)}
                  placeholder="Example: my workday runs late"
                  value={scriptSituation}
                />
              </label>
              <label>
                <span>I will…</span>
                <input
                  maxLength={160}
                  onChange={(event) => setScriptAction(event.target.value)}
                  placeholder="Example: pause and choose the smallest useful next step"
                  value={scriptAction}
                />
              </label>
              <label>
                <span>If this warning appears…</span>
                <input
                  maxLength={180}
                  onChange={(event) => setScriptWarning(event.target.value)}
                  placeholder="Example: I cannot keep fluids down"
                  value={scriptWarning}
                />
              </label>
              <label>
                <span>I will call…</span>
                <input
                  maxLength={120}
                  onChange={(event) => setScriptCall(event.target.value)}
                  placeholder="Example: my care team, pharmacist, or emergency services"
                  value={scriptCall}
                />
              </label>
            </div>
            {scriptSituation.trim() &&
            scriptAction.trim() &&
            scriptWarning.trim() &&
            scriptCall.trim() ? (
              <blockquote className={styles.scriptPreview}>
                “If {scriptSituation.trim()}, I will {scriptAction.trim()}. If{" "}
                {scriptWarning.trim()}, I will call {scriptCall.trim()}.”
              </blockquote>
            ) : null}
            <div className={styles.teachBack}>
              <p className="editorial-eyebrow">Run the solver</p>
              <h2>
                A friend says, “Yesterday went badly, so I have to wait until Monday and start over
                perfectly.” What would you say?
              </h2>
              <div className="mt-6 grid gap-3">
                {(
                  [
                    [
                      "adapt_next",
                      "You do not need a perfect restart. Pause, see what changed, and choose the next useful thing available now.",
                    ],
                    [
                      "restart_monday",
                      "Yes. A fresh week is the only time a routine can count again.",
                    ],
                    [
                      "make_up_for_it",
                      "The best response is to punish the mistake with stricter rules today.",
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
            </div>
            {evaluations.teachBack ? <Feedback feedback={evaluations.teachBack} /> : null}
          </div>
        );
      default:
        return (
          <div className="space-y-12 text-center">
            <p className="editorial-eyebrow">Day 12 complete</p>
            <LessonHeading centered>Flexible care can bend without breaking.</LessonHeading>
            <div className={styles.completionMark}>
              <Waypoints aria-hidden="true" />
              <p>The next useful decision is still available.</p>
              <span>Pause · Understand · Choose · Adjust</span>
            </div>
            <div className="mx-auto max-w-3xl border-y border-border py-9 text-left">
              <p className="editorial-eyebrow">Problem-solving sequence</p>
              <ol className={styles.takeawayList}>
                {[
                  "One meal, missed routine, or difficult day does not decide your health. Adaptability is a diabetes skill.",
                  "Illness changes the conditions. Hydration, personal sick-day instructions, and knowing when to call make the plan safer.",
                  "Medication rules are specific. Check the exact instructions and ask a pharmacist or care team rather than guessing or doubling.",
                ].map((item, index) => (
                  <li key={item}>
                    <span>0{index + 1}</span>
                    <p>{item}</p>
                  </li>
                ))}
              </ol>
            </div>
            {scriptSituation.trim() && scriptAction.trim() ? (
              <div className={styles.finalScript}>
                <p className="editorial-eyebrow">Your real-life script</p>
                <p>
                  If {scriptSituation.trim()}, I will {scriptAction.trim()}.
                </p>
              </div>
            ) : null}
            <div className="mx-auto grid max-w-3xl gap-6 text-left md:grid-cols-2">
              <div>
                <p className="editorial-eyebrow">Tomorrow</p>
                <h2 className="mt-3 font-serif-display text-3xl">
                  Support, stigma, and speaking up
                </h2>
                <p className="mt-2 leading-7">
                  Practice asking for useful support, handling unhelpful comments, and making your
                  needs easier to understand.
                </p>
              </div>
              <div>
                <p className="editorial-eyebrow">The skill you built</p>
                <p className="mt-3 font-serif-display text-2xl">
                  A backup plan that keeps care moving without demanding perfection.
                </p>
              </div>
            </div>
            <Button disabled={isPending} fullWidth={false} onClick={finishExperience}>
              {isPending
                ? "Saving your progress…"
                : experience.accessMode === "review"
                  ? "Return to journey"
                  : "Complete Day 12"}
            </Button>
          </div>
        );
    }
  }

  const progressValue = ((stage + 1) / stageCount) * 100;

  return (
    <section
      className={cn(
        styles.experience,
        "mx-auto flex min-h-[calc(100dvh-10rem)] max-w-[1020px] flex-col py-1 sm:py-4",
      )}
    >
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
            <p className={styles.dayLabel}>Day 12</p>
            <p className="hidden text-xs sm:block">Problem Solving for Real Life</p>
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
          <div className="flex justify-between text-xs">
            <span>Chapter {stage + 1}</span>
            <span>{stageCount} chapters</span>
          </div>
          <div
            aria-label={`Day 12 chapter ${stage + 1} of ${stageCount}`}
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={progressValue}
            className={styles.progressTrack}
            role="progressbar"
          >
            <span className={styles.progressFill} style={{ width: `${progressValue}%` }} />
          </div>
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
            <p aria-live="polite" className="mt-3 text-sm" role="status">
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
        description="Your chapter will be saved. Practice choices and written reflections stay on this page and are not saved as health information."
        onOpenChange={setExitOpen}
        open={exitOpen}
        title="Leave Day 12 for now?"
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
        title="Day 12 glossary"
      >
        <dl className="max-h-[56dvh] space-y-5 overflow-y-auto pr-2">
          {glossary.map((item) => (
            <div className="border-b border-border pb-4 last:border-0" key={item.term}>
              <dt className="font-serif-display text-xl">{item.term}</dt>
              <dd className="mt-1 leading-7">{item.definition}</dd>
            </div>
          ))}
        </dl>
      </Modal>
    </section>
  );
}
