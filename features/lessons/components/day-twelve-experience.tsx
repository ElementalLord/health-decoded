"use client";

import {
  ArrowLeft,
  BookOpen,
  Check,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  Waypoints,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition, type ReactNode } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  evaluateDayTwelveAction,
  type DayTwelveEvaluationFeedback,
} from "@/features/lessons/actions/day-twelve.actions";
import { completeLessonAction } from "@/features/lessons/actions/lesson-completion.actions";
import { saveLessonPositionAction } from "@/features/lessons/actions/lesson-progress.actions";
import { LessonStoryImage } from "@/features/lessons/components/lesson-story-image";
import { LessonMotionPerson } from "@/features/lessons/components/lesson-motion-person";
import styles from "@/features/lessons/components/day-twelve-experience.module.css";
import {
  canNavigateToLessonStage,
  getLessonResumeStage,
  isLessonStageLocked,
  type LessonStageGateMap,
} from "@/features/lessons/lib/lesson-stage-gating";
import type { LessonPlayerViewModel } from "@/features/lessons/types/lesson-player";
import { cn } from "@/lib/utils";

const stageCount = 10;
const dayTwelveStageGates: LessonStageGateMap = {
  0: "Choose what feels most true when a careful plan changes before you move on.",
  1: "Open all four solver steps above before you move on.",
  2: "Choose a response to the moved-lunch scenario before you move on.",
  3: "Choose both a real-life interruption and one useful tool before you move on.",
  4: "Add all five pieces to the sick-day plan above before you move on.",
  5: "Choose what makes the care-team call useful before you move on.",
  6: "Choose the safest missed-dose response before you move on.",
  7: "Choose both sides of your Plan B above before you move on.",
  8: "Run the solver once in the final scenario before you move on.",
};

const openingFeelings = [
  ["tired", "I am tired of plans falling apart"],
  ["careful", "I want a calmer way to handle surprises"],
  ["curious", "I am curious what a backup plan could look like"],
  ["ready", "I am ready to practice with real-life situations"],
] as const;

const solverSteps = [
  {
    body: "Take one breath and interrupt the all-or-nothing story. The whole day does not need to be solved in the first second.",
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
    body: "Choose one useful option that is available now. It can be smaller or different from the original plan.",
    id: "choose",
    number: "03",
    title: "Choose",
  },
  {
    body: "Notice what happened and revise again if needed. Adjustment keeps the plan connected to real life.",
    id: "adjust",
    number: "04",
    title: "Adjust",
  },
] as const;
type SolverStepId = (typeof solverSteps)[number]["id"];

const lifeSituations = [
  {
    id: "late_meal",
    label: "Lunch moves two hours later",
    truth: "The timing changed. The next meal can still be a useful choice.",
  },
  {
    id: "restaurant",
    label: "The restaurant has different options",
    truth: "The available meal does not have to look like the imagined meal to count.",
  },
  {
    id: "long_shift",
    label: "A workday uses the energy you expected",
    truth: "Rest, a shorter action, or asking for help can protect the purpose of the plan.",
  },
  {
    id: "celebration",
    label: "A celebration changes the evening",
    truth:
      "Belonging is part of health. One event does not need punishment or a ceremonial restart.",
  },
] as const;
type LifeSituationId = (typeof lifeSituations)[number]["id"];

const lifeTools = [
  {
    id: "notice",
    label: "Name the change",
    note: "Respond to what happened, not to the fear that the whole day is ruined.",
  },
  {
    id: "available",
    label: "Use what is available",
    note: "A workable choice can be genuinely useful without being the original choice.",
  },
  {
    id: "small",
    label: "Protect one small anchor",
    note: "Water, rest, a short movement moment, a meal, or one phone call may be enough for now.",
  },
  {
    id: "return",
    label: "Let the next choice be new",
    note: "The next decision does not have to repay or punish the one before it.",
  },
] as const;
type LifeToolId = (typeof lifeTools)[number]["id"];

const sickDayPriorities = [
  {
    body: "Drink fluids as you are able. If you cannot keep liquids down or show signs of severe dehydration, seek medical help rather than trying to push through alone.",
    id: "fluids",
    title: "Protect hydration",
  },
  {
    body: "Illness and stress hormones can raise glucose even when you eat less. Follow your personal sick-day plan for when and how often to check.",
    id: "monitor",
    title: "Follow the monitoring plan",
  },
  {
    body: "Keep taking medicines as prescribed unless your clinician’s written sick-day plan tells you otherwise. If you are unsure, call your care team or pharmacist.",
    id: "medicine",
    title: "Use medicine-specific guidance",
  },
  {
    body: "Write down who to call and which symptoms mean urgent or emergency help. Asking early is a protective action, not an overreaction.",
    id: "help",
    title: "Know the help signals",
  },
] as const;
type SickPriorityId = (typeof sickDayPriorities)[number]["id"];

const callDetails = [
  {
    id: "change",
    label: "What changed",
    note: "Symptoms, when they began, ability to drink or eat, and whether anything is worsening.",
  },
  {
    id: "followed",
    label: "What you already followed",
    note: "The written plan, fluids, exact medicine names, and requested readings or ketones.",
  },
  {
    id: "question",
    label: "What needs an answer",
    note: "The specific instruction that is unclear and what change should prompt another call.",
  },
] as const;
type CallDetailId = (typeof callDetails)[number]["id"];

const planTriggers = [
  ["walk", "my planned walk does not happen"],
  ["dinner", "dinner is delayed or different"],
  ["work", "work uses the energy I expected to have"],
  ["restaurant", "a restaurant plan changes at the last minute"],
] as const;
type PlanTriggerId = (typeof planTriggers)[number][0];

const planBackups = [
  ["minutes", "choose five useful minutes instead of abandoning the whole idea"],
  ["next", "let the next meal or decision be supportive without punishing this one"],
  ["ask", "ask for help, more time, or the information I need"],
  ["reset", "pause, check what is possible now, and choose one small anchor"],
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
      "Chemicals produced when the body breaks down fat for energy. Whether and when to check them depends on a person’s diabetes type, medicines, symptoms, and clinician’s sick-day plan.",
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
      <h1
        className={cn(
          "max-w-4xl font-serif-display text-[length:var(--text-page-title)] font-normal leading-[0.96] text-balance",
          centered && "mx-auto",
        )}
      >
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

function ChangedDayAnimation({ activeStep }: { activeStep: SolverStepId }) {
  const step = solverSteps.find((item) => item.id === activeStep) ?? solverSteps[0];

  return (
    <figure className={styles.motionFigure} data-motion-loop="continuous">
      <div className={styles.motionIntro}>
        <p className="editorial-eyebrow">One afternoon · a plan changes</p>
        <h2>The interruption changes the route, not the worth of the day.</h2>
        <p>Watch the person notice the delay, pause, eat what is available, and keep going.</p>
      </div>
      <svg
        aria-labelledby="changed-day-title changed-day-description"
        className={styles.motionCanvas}
        role="img"
        viewBox="0 0 900 420"
      >
        <title id="changed-day-title">A late meeting changes lunch without erasing the day</title>
        <desc id="changed-day-description">
          The selected problem-solving step changes the person’s visible action: breathing before
          reacting, checking what changed, eating an available meal, or revising the afternoon.
        </desc>
        <rect fill="#eef4f0" height="420" width="900" />
        <path d="M48 370 H852" stroke="#a9bdb1" strokeLinecap="round" strokeWidth="5" />
        <rect fill="#f8ead7" height="150" rx="7" stroke="#d3b79c" width="225" x="68" y="52" />
        <circle cx="181" cy="118" fill="#edca8c" r="39" />
        <path d="M91 184 Q181 125 270 183" fill="#b7c9bc" opacity=".75" />

        <circle cx="428" cy="108" fill="#fffaf2" r="57" stroke="#789185" strokeWidth="5" />
        {[0, 1, 2, 3].map((mark) => {
          const angle = (mark * Math.PI) / 2;
          const x1 = 428 + Math.cos(angle) * 42;
          const y1 = 108 + Math.sin(angle) * 42;
          const x2 = 428 + Math.cos(angle) * 49;
          const y2 = 108 + Math.sin(angle) * 49;
          return (
            <line
              key={mark}
              stroke="#789185"
              strokeLinecap="round"
              strokeWidth="3"
              x1={x1}
              x2={x2}
              y1={y1}
              y2={y2}
            />
          );
        })}
        <line
          stroke="#566f65"
          strokeLinecap="round"
          strokeWidth="6"
          x1="428"
          x2="428"
          y1="108"
          y2="75"
        >
          <animateTransform
            attributeName="transform"
            dur="8s"
            repeatCount="indefinite"
            type="rotate"
            values="0 428 108;30 428 108;0 428 108"
          />
        </line>
        <line
          stroke="#c7785f"
          strokeLinecap="round"
          strokeWidth="5"
          x1="428"
          x2="451"
          y1="108"
          y2="108"
        >
          <animateTransform
            attributeName="transform"
            dur="8s"
            repeatCount="indefinite"
            type="rotate"
            values="0 428 108;120 428 108;0 428 108"
          />
        </line>
        <circle cx="428" cy="108" fill="#566f65" r="5" />

        <path d="M545 310 H822" stroke="#876f5d" strokeLinecap="round" strokeWidth="14" />
        <path d="M579 313 L568 370 M785 313 L797 370" stroke="#876f5d" strokeWidth="11" />
        <LessonMotionPerson
          action={activeStep === "choose" ? "reach-right" : "rest"}
          motion={activeStep === "pause" ? "breathe" : "nod"}
          palette="warm"
          scale={0.98}
          seated
          x={625}
          y={356}
        />

        {activeStep === "understand" ? (
          <g key="understand">
            <rect
              fill="#fffaf2"
              height="84"
              rx="6"
              stroke="#c37a61"
              strokeWidth="4"
              width="104"
              x="310"
              y="231"
            />
            <path d="M310 255 H414 M334 218 V245 M390 218 V245" stroke="#c37a61" strokeWidth="5" />
            <circle cx="342" cy="278" fill="#e7b77b" r="8">
              <animate
                attributeName="opacity"
                dur="2.4s"
                repeatCount="indefinite"
                values=".3;1;.3"
              />
            </circle>
            <path d="M361 278 H393" stroke="#91aa9d" strokeLinecap="round" strokeWidth="6" />
          </g>
        ) : null}

        {activeStep === "choose" ? (
          <g key="choose">
            <ellipse
              cx="745"
              cy="307"
              fill="#fffaf2"
              rx="53"
              ry="13"
              stroke="#c7785f"
              strokeWidth="4"
            />
            <path d="M710 298 Q746 268 782 298" fill="#eac789" />
            <path d="M720 294 Q746 277 772 294" fill="#789b88" opacity=".85" />
            <path d="M703 265 V299" stroke="#789185" strokeLinecap="round" strokeWidth="5">
              <animateTransform
                attributeName="transform"
                dur="2.8s"
                repeatCount="indefinite"
                type="rotate"
                values="0 703 299;-8 703 299;0 703 299"
              />
            </path>
          </g>
        ) : null}

        {activeStep === "adjust" ? (
          <g key="adjust">
            <rect
              fill="#fffaf2"
              height="96"
              rx="6"
              stroke="#7b9b8b"
              strokeWidth="4"
              width="128"
              x="316"
              y="225"
            />
            <path
              d="M337 251 H419 M337 273 H394 M337 295 H412"
              stroke="#a1b5aa"
              strokeLinecap="round"
              strokeWidth="6"
            />
            <path
              d="M391 293 l10 10 22-27"
              fill="none"
              stroke="#c7785f"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="6"
            >
              <animate
                attributeName="stroke-dasharray"
                dur="3s"
                repeatCount="indefinite"
                values="0 55;55 0;55 0"
              />
            </path>
          </g>
        ) : null}
      </svg>
      <div aria-live="polite" className={styles.motionTranscript}>
        <span>
          {step.number} · {step.title}
        </span>
        <strong>{step.body}</strong>
      </div>
      <figcaption className={styles.figureCaption}>
        <strong>What to notice:</strong> the person responds to the changed condition. They do not
        punish the delay or declare the day ruined.
      </figcaption>
    </figure>
  );
}

function SickDayBodyAnimation({ priority }: { priority: SickPriorityId }) {
  const active = sickDayPriorities.find((item) => item.id === priority) ?? sickDayPriorities[0];

  return (
    <figure className={styles.motionFigure} data-motion-loop="continuous">
      <div className={styles.motionIntro}>
        <p className="editorial-eyebrow">Inside a sick day</p>
        <h2>Eating less does not always mean glucose will fall.</h2>
        <p>
          Illness can release stress hormones. The liver may release more glucose while fever,
          vomiting, or diarrhea can make hydration harder to protect.
        </p>
      </div>
      <svg
        aria-labelledby="sick-body-title sick-body-description"
        className={styles.motionCanvas}
        role="img"
        viewBox="0 0 900 450"
      >
        <title id="sick-body-title">Illness changes glucose and hydration inside the body</title>
        <desc id="sick-body-description">
          A coherent torso shows stress signals reaching the liver and glucose entering a blood
          vessel. The selected sick-day priority changes the practical action shown beside it.
        </desc>
        <rect fill="#edf3f0" height="450" width="900" />
        <circle cx="398" cy="74" fill="#ddb08d" r="42" stroke="#789185" strokeWidth="4" />
        <path
          d="M291 405 Q295 155 398 135 Q501 155 505 405 Z"
          fill="#f7ede1"
          stroke="#8da99a"
          strokeWidth="6"
        />
        <path d="M398 115 V278" stroke="#c98b76" strokeLinecap="round" strokeWidth="7" />
        <path
          d="M352 208 C362 184 402 174 442 184 C460 189 464 210 456 232 C444 254 400 260 368 253 C350 249 344 226 352 208 Z"
          fill="#d9a184"
          stroke="#a57d61"
          strokeWidth="4"
        />
        <path
          d="M398 276 C368 272 344 288 344 320 C344 350 366 372 400 370 C428 368 448 356 448 336 C447 320 434 316 424 310 C418 292 414 282 406 278 C403 277 400 276 398 276 Z"
          fill="#b87361"
          stroke="#955645"
          strokeWidth="4"
        >
          <animate attributeName="opacity" dur="3.8s" repeatCount="indefinite" values=".72;1;.72" />
        </path>

        <path
          d="M255 390 H625"
          fill="none"
          stroke="#8ba9aa"
          strokeLinecap="round"
          strokeWidth="24"
        />
        <path
          d="M255 390 H625"
          fill="none"
          stroke="#dceaea"
          strokeLinecap="round"
          strokeWidth="12"
        />
        {[0, 1, 2].map((index) => (
          <circle fill="#e5b56f" key={index} r="11" stroke="#fff7e7" strokeWidth="3">
            <animateMotion
              begin={`${index * -1.1}s`}
              dur="4.6s"
              path="M430 238 C465 295 495 355 550 388 C578 391 600 390 616 390"
              repeatCount="indefinite"
            />
            <animate attributeName="opacity" dur="4.6s" repeatCount="indefinite" values="0;1;1;0" />
          </circle>
        ))}

        <rect
          fill="#fffaf2"
          height="238"
          rx="8"
          stroke="#a8bbb0"
          strokeWidth="4"
          width="226"
          x="636"
          y="101"
        />
        {priority === "fluids" ? (
          <g key="fluids">
            <path
              d="M696 166 H803 L791 305 H708 Z"
              fill="#fffaf2"
              stroke="#6f9485"
              strokeWidth="5"
            />
            <path d="M705 242 H795 L791 305 H708 Z" fill="#8db8c1">
              <animate
                attributeName="d"
                dur="4s"
                repeatCount="indefinite"
                values="M705 269 H795 L791 305 H708 Z;M705 224 H795 L791 305 H708 Z;M705 269 H795 L791 305 H708 Z"
              />
            </path>
            <path d="M750 118 C731 143 732 157 750 166 C768 157 769 143 750 118 Z" fill="#78aeb9">
              <animateTransform
                attributeName="transform"
                dur="3.4s"
                repeatCount="indefinite"
                type="translate"
                values="0 -6;0 10;0 -6"
              />
            </path>
          </g>
        ) : null}
        {priority === "monitor" ? (
          <g key="monitor">
            <rect
              fill="#f9f4eb"
              height="122"
              rx="9"
              stroke="#5f8273"
              strokeWidth="5"
              width="88"
              x="705"
              y="146"
            />
            <rect fill="#b8d3c7" height="38" rx="4" width="58" x="720" y="165" />
            <path
              d="M722 236 C736 219 748 251 760 230 C770 216 779 225 789 211"
              fill="none"
              stroke="#c7785f"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="5"
            >
              <animate
                attributeName="stroke-dasharray"
                dur="3.2s"
                repeatCount="indefinite"
                values="0 100;100 0;100 0"
              />
            </path>
            <circle cx="749" cy="287" fill="#e6b675" r="10">
              <animate
                attributeName="opacity"
                dur="2.6s"
                repeatCount="indefinite"
                values=".35;1;.35"
              />
            </circle>
          </g>
        ) : null}
        {priority === "medicine" ? (
          <g key="medicine">
            <rect
              fill="#fffaf2"
              height="137"
              rx="7"
              stroke="#6f9485"
              strokeWidth="5"
              width="86"
              x="704"
              y="157"
            />
            <rect
              fill="#fffaf2"
              height="30"
              rx="4"
              stroke="#6f9485"
              strokeWidth="5"
              width="56"
              x="719"
              y="128"
            />
            <rect fill="#c8dacf" height="39" rx="4" width="64" x="715" y="204">
              <animate attributeName="opacity" dur="3s" repeatCount="indefinite" values=".5;1;.5" />
            </rect>
            <path d="M676 296 H816" stroke="#c99b73" strokeLinecap="round" strokeWidth="6" />
            <path d="M687 310 H775" stroke="#a5b8ae" strokeLinecap="round" strokeWidth="5" />
          </g>
        ) : null}
        {priority === "help" ? (
          <g key="help">
            <rect fill="#4c675d" height="130" rx="14" width="72" x="714" y="157" />
            <circle cx="750" cy="267" fill="#dce9e2" r="6" />
            <path
              d="M732 181 H768 M732 198 H760"
              stroke="#dce9e2"
              strokeLinecap="round"
              strokeWidth="5"
            />
            <path
              d="M698 145 Q750 98 802 145"
              fill="none"
              stroke="#c7785f"
              strokeLinecap="round"
              strokeWidth="5"
            >
              <animate attributeName="opacity" dur="2.5s" repeatCount="indefinite" values="0;1;0" />
            </path>
          </g>
        ) : null}
      </svg>
      <div aria-live="polite" className={styles.motionTranscript}>
        <span>{active.title}</span>
        <strong>{active.body}</strong>
      </div>
      <figcaption className={styles.figureCaption}>
        <strong>What to notice:</strong> the body’s illness response and fluid loss can change the
        plan at the same time. Personal instructions matter more than a universal rule.
      </figcaption>
    </figure>
  );
}

function CareCallAnimation({ focus }: { focus: CallDetailId }) {
  const active = callDetails.find((item) => item.id === focus) ?? callDetails[0];

  return (
    <figure className={styles.motionFigure} data-motion-loop="continuous">
      <div className={styles.motionIntro}>
        <p className="editorial-eyebrow">A useful handoff</p>
        <h2>A friend can help carry the details when thinking feels harder.</h2>
        <p>The written plan stays open. The call names what changed and asks one clear question.</p>
      </div>
      <svg
        aria-labelledby="care-call-title care-call-description"
        className={styles.motionCanvas}
        role="img"
        viewBox="0 0 900 420"
      >
        <title id="care-call-title">A friend helps make a care-team call during illness</title>
        <desc id="care-call-description">
          A phone shows an active care-team call beside the open written sick-day plan. The selected
          call detail changes what the friend gathers for the clinician.
        </desc>
        <rect fill="#f2eee6" height="420" width="900" />
        <path d="M42 381 H858" stroke="#b3bcae" strokeLinecap="round" strokeWidth="5" />

        <rect
          fill="#40544c"
          height="292"
          rx="28"
          stroke="#2f3f39"
          strokeWidth="5"
          width="188"
          x="286"
          y="70"
        />
        <rect fill="#f4f0e6" height="224" rx="8" width="150" x="305" y="100" />
        <circle cx="380" cy="156" fill="#cf7b61" r="28" />
        <rect fill="#cdd6cf" height="11" rx="5" width="98" x="331" y="200" />
        <rect fill="#e3ece6" height="9" rx="4" width="66" x="347" y="222" />
        <circle cx="380" cy="296" fill="#8db67f" r="20" />
        <path d="M372 289c-3 3 0 9 4 13c4 4 10 7 13 4l-5 -7 -6 1 -5 -5 1 -6z" fill="#f4f0e6" />

        <path
          d="M508 156 Q542 122 508 88 M530 172 Q580 120 530 68"
          fill="none"
          stroke="#c7785f"
          strokeLinecap="round"
          strokeWidth="5"
        >
          <animate attributeName="opacity" dur="2.4s" repeatCount="indefinite" values="0;1;0" />
        </path>

        <rect
          fill="#fffaf2"
          height="156"
          rx="7"
          stroke="#a79582"
          strokeWidth="4"
          width="126"
          x="600"
          y="150"
        />
        <path
          d="M622 182 H704 M622 205 H688 M622 228 H702 M622 251 H678"
          stroke="#9bad9f"
          strokeLinecap="round"
          strokeWidth="5"
        />

        {focus === "change" ? (
          <circle cx="380" cy="156" fill="none" r="40" stroke="#c7785f" strokeWidth="4">
            <animate attributeName="r" dur="2.6s" repeatCount="indefinite" values="32;42;32" />
            <animate attributeName="opacity" dur="2.6s" repeatCount="indefinite" values=".7;0;.7" />
          </circle>
        ) : null}
        {focus === "followed" ? (
          <path d="M622 182 H704" stroke="#c7785f" strokeLinecap="round" strokeWidth="6">
            <animate
              attributeName="stroke-dasharray"
              dur="3s"
              repeatCount="indefinite"
              values="0 84;84 0;84 0"
            />
          </path>
        ) : null}
        {focus === "question" ? (
          <g key="question">
            <circle cx="663" cy="112" fill="#fffaf2" r="24" stroke="#c7785f" strokeWidth="4" />
            <path
              d="M654 106 Q654 95 663 95 Q672 95 672 103 Q672 110 663 113 M663 121 V123"
              fill="none"
              stroke="#c7785f"
              strokeLinecap="round"
              strokeWidth="4"
            >
              <animate
                attributeName="opacity"
                dur="2.4s"
                repeatCount="indefinite"
                values=".4;1;.4"
              />
            </path>
          </g>
        ) : null}
      </svg>
      <div aria-live="polite" className={styles.motionTranscript}>
        <span>{active.label}</span>
        <strong>{active.note}</strong>
      </div>
      <figcaption className={styles.figureCaption}>
        <strong>What to notice:</strong> support does not invent an answer. It helps gather the
        exact information so the care team can answer the right question.
      </figcaption>
    </figure>
  );
}

function PlanBAnimation({
  planBackup,
  planTrigger,
}: {
  planBackup: PlanBackupId;
  planTrigger: PlanTriggerId;
}) {
  const trigger = planTriggers.find(([id]) => id === planTrigger)?.[1] ?? planTriggers[0][1];
  const backup = planBackups.find(([id]) => id === planBackup)?.[1] ?? planBackups[0][1];

  return (
    <figure className={styles.motionFigure} data-motion-loop="continuous">
      <div className={styles.motionIntro}>
        <p className="editorial-eyebrow">Plan B keeps the purpose</p>
        <h2>The activity changes. Connection and care can stay.</h2>
        <p>
          Rain closes the outdoor plan; two friends make room for movement and laughter indoors.
        </p>
      </div>
      <svg
        aria-labelledby="plan-b-title plan-b-description"
        className={styles.motionCanvas}
        role="img"
        viewBox="0 0 900 420"
      >
        <title id="plan-b-title">Friends turn a rainy outdoor plan into indoor movement</title>
        <desc id="plan-b-description">
          The left side shows the selected disruption. The right side visibly changes to the chosen
          backup: a short movement break, a supportive next meal, a call for help, or a quiet reset.
        </desc>
        <rect fill="#f4eee5" height="420" width="900" />
        <path d="M44 376 H856" stroke="#b3bcae" strokeLinecap="round" strokeWidth="5" />
        <rect
          fill="#dce9eb"
          height="235"
          rx="8"
          stroke="#8eaaa8"
          strokeWidth="5"
          width="245"
          x="64"
          y="55"
        />
        <path d="M64 294 H309" stroke="#8eaaa8" strokeWidth="8" />
        {planTrigger === "walk" ? (
          <g key="walk">
            <g>
              <ellipse cx="184" cy="111" fill="#8ba0a4" rx="59" ry="24" />
              <circle cx="151" cy="105" fill="#8ba0a4" r="28" />
              <circle cx="201" cy="92" fill="#8ba0a4" r="35" />
              <circle cx="227" cy="110" fill="#8ba0a4" r="26" />
              <animateTransform
                attributeName="transform"
                dur="6s"
                repeatCount="indefinite"
                type="translate"
                values="-5 0;5 0;-5 0"
              />
            </g>
            {[136, 173, 210, 247].map((x, index) => (
              <line
                key={x}
                stroke="#78a8b1"
                strokeLinecap="round"
                strokeWidth="7"
                x1={x}
                x2={x - 10}
                y1="150"
                y2="193"
              >
                <animateTransform
                  attributeName="transform"
                  begin={`${index * -0.22}s`}
                  dur="1.4s"
                  repeatCount="indefinite"
                  type="translate"
                  values="0 -5;0 18"
                />
                <animate
                  attributeName="opacity"
                  begin={`${index * -0.22}s`}
                  dur="1.4s"
                  repeatCount="indefinite"
                  values="0;1;0"
                />
              </line>
            ))}
            <path
              d="M96 251 Q184 218 277 251"
              fill="none"
              stroke="#9bb1a2"
              strokeLinecap="round"
              strokeWidth="8"
            />
          </g>
        ) : null}
        {planTrigger === "dinner" ? (
          <g key="dinner">
            <circle cx="184" cy="145" fill="#fffaf2" r="66" stroke="#789185" strokeWidth="5" />
            <path
              d="M184 145 V105 M184 145 L220 163"
              stroke="#c7785f"
              strokeLinecap="round"
              strokeWidth="7"
            >
              <animateTransform
                attributeName="transform"
                dur="6s"
                repeatCount="indefinite"
                type="rotate"
                values="0 184 145;35 184 145;0 184 145"
              />
            </path>
            <ellipse
              cx="184"
              cy="255"
              fill="#fffaf2"
              rx="59"
              ry="15"
              stroke="#c9896f"
              strokeWidth="4"
            />
          </g>
        ) : null}
        {planTrigger === "work" ? (
          <g key="work">
            <rect
              fill="#fffaf2"
              height="100"
              rx="7"
              stroke="#789185"
              strokeWidth="5"
              width="145"
              x="111"
              y="95"
            />
            <rect fill="#b8d1c2" height="45" rx="4" width="104" x="131" y="118" />
            <rect
              fill="#fffaf2"
              height="68"
              rx="8"
              stroke="#c7785f"
              strokeWidth="5"
              width="114"
              x="128"
              y="221"
            />
            <rect fill="#dca27a" height="34" rx="3" width="48" x="143" y="238">
              <animate attributeName="width" dur="4s" repeatCount="indefinite" values="48;15;48" />
            </rect>
            <path d="M242 241 H256 V269 H242" fill="none" stroke="#c7785f" strokeWidth="5" />
          </g>
        ) : null}
        {planTrigger === "restaurant" ? (
          <g key="restaurant">
            <path d="M110 274 V128 H259 V274" fill="#fffaf2" stroke="#789185" strokeWidth="6" />
            <path
              d="M127 128 L143 93 H226 L242 128"
              fill="#e2ae78"
              stroke="#a37250"
              strokeLinejoin="round"
              strokeWidth="5"
            />
            <path d="M148 274 V204 H221 V274" fill="#d6e3dd" stroke="#789185" strokeWidth="5" />
            <path d="M128 183 H240" stroke="#c7785f" strokeLinecap="round" strokeWidth="8">
              <animate
                attributeName="opacity"
                dur="2.8s"
                repeatCount="indefinite"
                values=".45;1;.45"
              />
            </path>
          </g>
        ) : null}

        <path d="M349 325 H835" stroke="#876f5d" strokeLinecap="round" strokeWidth="14" />
        <path
          d="M388 328 L380 376 M798 328 L807 376"
          stroke="#876f5d"
          strokeLinecap="round"
          strokeWidth="10"
        />

        {planBackup === "minutes" ? (
          <g key="minutes">
            <rect
              fill="#6f8f80"
              height="74"
              rx="7"
              stroke="#58756a"
              strokeWidth="4"
              width="84"
              x="722"
              y="236"
            />
            <circle cx="764" cy="273" fill="#f1ddbd" r="20">
              <animate attributeName="r" dur="2.2s" repeatCount="indefinite" values="18;23;18" />
            </circle>
            <LessonMotionPerson
              action="wave-right"
              motion="dance"
              palette="warm"
              scale={0.92}
              x={500}
              y={368}
            />
            <LessonMotionPerson
              action="celebrate"
              motion="dance"
              palette="sage"
              scale={0.92}
              x={625}
              y={368}
            />
          </g>
        ) : null}
        {planBackup === "next" ? (
          <g key="next">
            <ellipse
              cx="590"
              cy="316"
              fill="#fffaf2"
              rx="57"
              ry="13"
              stroke="#c9896f"
              strokeWidth="4"
            />
            <path d="M555 307 Q590 276 625 307" fill="#e7bb7c" />
            <LessonMotionPerson
              action="reach-right"
              motion="breathe"
              palette="warm"
              scale={0.87}
              seated
              x={478}
              y={367}
            />
            <LessonMotionPerson
              action="reach-left"
              motion="nod"
              palette="sage"
              scale={0.87}
              seated
              x={705}
              y={367}
            />
          </g>
        ) : null}
        {planBackup === "ask" ? (
          <g key="ask">
            <rect fill="#405750" height="83" rx="11" width="49" x="587" y="241" />
            <circle cx="611" cy="307" fill="#dce8e1" r="4" />
            <path
              d="M574 225 Q611 195 648 225 M582 235 Q611 212 640 235"
              fill="none"
              stroke="#c87860"
              strokeLinecap="round"
              strokeWidth="5"
            >
              <animate attributeName="opacity" dur="2.5s" repeatCount="indefinite" values="0;1;0" />
            </path>
            <LessonMotionPerson
              action="reach-right"
              motion="nod"
              palette="warm"
              scale={0.9}
              x={470}
              y={368}
            />
            <LessonMotionPerson
              action="wave-left"
              motion="breathe"
              palette="sage"
              scale={0.9}
              x={740}
              y={368}
            />
          </g>
        ) : null}
        {planBackup === "reset" ? (
          <g key="reset">
            <LessonMotionPerson
              action="rest"
              motion="breathe"
              palette="warm"
              scale={0.92}
              seated
              x={548}
              y={367}
            />
            <LessonMotionPerson
              action="listen"
              motion="nod"
              palette="sage"
              scale={0.92}
              seated
              x={680}
              y={367}
            />
            <path
              d="M600 225 C584 209 584 191 600 176 M624 225 C640 209 640 191 624 176"
              fill="none"
              stroke="#7ba08d"
              strokeLinecap="round"
              strokeWidth="5"
            >
              <animate
                attributeName="opacity"
                dur="3.4s"
                repeatCount="indefinite"
                values=".15;1;.15"
              />
              <animateTransform
                attributeName="transform"
                dur="3.4s"
                repeatCount="indefinite"
                type="translate"
                values="0 7;0 -7;0 7"
              />
            </path>
          </g>
        ) : null}
      </svg>
      <div aria-live="polite" className={styles.planTranscript}>
        <div>
          <span>When real life says</span>
          <strong>{trigger}</strong>
        </div>
        <div>
          <span>Plan B can</span>
          <strong>{backup}</strong>
        </div>
      </div>
      <figcaption className={styles.figureCaption}>
        <strong>What to notice:</strong> Plan B is not a lesser plan. It keeps the reason behind the
        routine while changing the action to fit the day that actually arrived.
      </figcaption>
    </figure>
  );
}

const dayDetours = [
  {
    id: "later",
    label: "Move it to a calmer hour",
    note: "You shifted it later. The day still reaches the evening, just by a different road.",
    path: "C324 60 396 60 420 130",
  },
  {
    id: "help",
    label: "Ask someone to help",
    note: "One ask changed the route. You did not have to carry the whole day alone.",
    path: "C330 96 390 96 420 130",
  },
  {
    id: "smaller",
    label: "Do a smaller version",
    note: "A shorter version still counts. The purpose of the plan is protected, not perfected.",
    path: "C324 180 396 180 420 130",
  },
] as const;

function RerouteTheDay() {
  const [chosen, setChosen] = useState<string | null>(null);
  const active = dayDetours.find((detour) => detour.id === chosen) ?? null;

  return (
    <div className={styles.reroute}>
      <div className={styles.rerouteHead}>
        <p className="editorial-eyebrow">The interruption changes the route, not the day</p>
        <p>
          The middle of the plan is blocked. Tap one of the ways around it and watch the day still
          reach the evening.
        </p>
      </div>
      <svg
        aria-label="A planned day drawn as a path from a morning sun to an evening marker, blocked in the middle. Three faint detours arc around the block; tap one to make it the route, and a dot travels the whole day to the evening."
        className={styles.rerouteSvg}
        role="group"
        viewBox="0 0 720 220"
      >
        <path d="M44 130 H300" fill="none" stroke="#9db3a8" strokeLinecap="round" strokeWidth="6" />
        <path
          d="M420 130 H676"
          fill="none"
          stroke="#9db3a8"
          strokeLinecap="round"
          strokeWidth="6"
        />
        <path
          d="M300 130 H420"
          fill="none"
          stroke="#d8c7b8"
          strokeDasharray="3 13"
          strokeLinecap="round"
          strokeWidth="6"
        />

        {dayDetours.map((detour) => {
          const isChosen = chosen === detour.id;
          return (
            <path
              aria-label={`Route around the block: ${detour.label}`}
              className={styles.rerouteOption}
              d={`M300 130 ${detour.path}`}
              fill="none"
              key={detour.id}
              onClick={() => setChosen(detour.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setChosen(detour.id);
                }
              }}
              role="button"
              stroke={isChosen ? "#b96c55" : "#c9b4a3"}
              strokeDasharray={isChosen ? undefined : "2 11"}
              strokeLinecap="round"
              strokeWidth="6"
              tabIndex={0}
            />
          );
        })}

        <g transform="translate(360 130)">
          <circle fill="#f0dfd0" r="15" stroke="#c98a6f" strokeWidth="3" />
          <path
            d="M-6 -6 L6 6 M6 -6 L-6 6"
            stroke="#c98a6f"
            strokeLinecap="round"
            strokeWidth="3"
          />
        </g>

        <circle cx="44" cy="130" fill="#e6b774" r="10" stroke="#c69551" strokeWidth="3" />
        <circle cx="676" cy="130" fill="#7b9ea8" r="10" stroke="#5f7d86" strokeWidth="3" />

        {active ? (
          <circle fill="#6f947a" key={active.id} r="9" stroke="#fffaf3" strokeWidth="3">
            <animateMotion
              dur="3.6s"
              path={`M44 130 H300 ${active.path} H676`}
              repeatCount="indefinite"
            />
          </circle>
        ) : null}
      </svg>
      <p aria-live="polite" className={styles.rerouteCaption}>
        {active
          ? active.note
          : "Morning sun on the left, evening on the right. The blocked middle is where the plan changed."}
      </p>
    </div>
  );
}

function BreatheThrough() {
  const [breathing, setBreathing] = useState(false);
  const panic = [
    [58, 54],
    [244, 62],
    [66, 182],
    [236, 178],
    [150, 34],
    [150, 210],
    [40, 120],
    [262, 118],
  ];

  return (
    <div className={styles.breathe}>
      <div className={styles.rerouteHead}>
        <p className="editorial-eyebrow">Before you solve anything, one breath</p>
        <p>
          The all-or-nothing story loosens with a single slow breath. Start one and follow the ring
          as it grows and settles.
        </p>
      </div>
      <div className={styles.breatheStage}>
        <svg aria-hidden="true" className={styles.breatheSvg} viewBox="0 0 302 240">
          <g className={cn(styles.breathePanic, breathing && styles.breathePanicCalm)}>
            {panic.map(([x, y], index) => (
              <circle cx={x} cy={y} fill="#c08b7a" key={index} r="5" />
            ))}
          </g>
          <circle
            className={styles.breatheRing}
            cx="151"
            cy="120"
            fill="#efe1d0"
            r="40"
            stroke="#b96c55"
            strokeWidth="3"
          >
            {breathing ? (
              <>
                <animate
                  attributeName="r"
                  calcMode="spline"
                  dur="9s"
                  keySplines="0.4 0 0.4 1;0.4 0 0.4 1"
                  keyTimes="0;0.44;1"
                  repeatCount="indefinite"
                  values="34;66;34"
                />
                <animate
                  attributeName="opacity"
                  dur="9s"
                  keyTimes="0;0.44;1"
                  repeatCount="indefinite"
                  values="0.7;1;0.7"
                />
              </>
            ) : null}
          </circle>
        </svg>
      </div>
      <div className={styles.breatheControls}>
        <p aria-live="polite" className={styles.rerouteCaption}>
          {breathing
            ? "In as the ring grows, out as it settles. The day is still here when you return."
            : "One breath interrupts the story that the whole day is already ruined."}
        </p>
        <button
          className={styles.breatheButton}
          onClick={() => setBreathing((current) => !current)}
          type="button"
        >
          {breathing ? "Rest" : "Take one breath"}
        </button>
      </div>
    </div>
  );
}

function SteadyStory() {
  const [value, setValue] = useState(0);
  const t = value / 100;
  const changedIndex = 3;

  return (
    <div className={styles.steady}>
      <div className={styles.rerouteHead}>
        <p className="editorial-eyebrow">The first move is the story you tell</p>
        <p>
          Slide from “the whole day is ruined” toward “one part changed,” and watch most of the day
          steady itself.
        </p>
      </div>
      <svg aria-hidden="true" className={styles.steadySvg} viewBox="0 0 720 190">
        <path d="M40 158 H680" stroke="#cbb9a8" strokeWidth="2" />
        {[0, 1, 2, 3, 4, 5].map((index) => {
          const isChanged = index === changedIndex;
          const tilt = isChanged ? 7 : 40 * (1 - t);
          const x = 96 + index * 100;
          const green = Math.round(150 + 22 * t);
          const red = Math.round(150 - 36 * t);
          const fill = isChanged ? "#c7785f" : `rgb(${red} ${green} 140)`;
          return (
            <g key={index} transform={`rotate(${tilt} ${x} 158)`}>
              <rect fill={fill} height="72" rx="8" width="26" x={x - 13} y="86" />
            </g>
          );
        })}
      </svg>
      <input
        aria-label="Slide from the whole day is ruined toward one part changed"
        className={styles.steadySlider}
        max={100}
        min={0}
        onChange={(event) => setValue(Number(event.target.value))}
        type="range"
        value={value}
      />
      <div aria-hidden="true" className={styles.steadyLabels}>
        <span>The whole day is ruined</span>
        <span>One part changed</span>
      </div>
      <p aria-live="polite" className={styles.rerouteCaption}>
        {t < 0.34
          ? "When one thing goes wrong, the mind can knock the whole day over."
          : t < 0.75
            ? "Look again. Most of the day is still standing."
            : "One part changed. The rest of the day is still yours to use."}
      </p>
    </div>
  );
}

const sickPlanPieces = [
  { id: "fluids", label: "How I will keep fluids up" },
  { id: "monitor", label: "When I will check glucose" },
  { id: "medicine", label: "My medicine sick-day notes" },
  { id: "signs", label: "Warning signs that mean call now" },
  { id: "contacts", label: "Who to call, and their number" },
] as const;
type SickPlanId = (typeof sickPlanPieces)[number]["id"];

function PackSickDayPlan({ onReady }: { onReady?: () => void }) {
  const [added, setAdded] = useState<Set<SickPlanId>>(() => new Set());
  const total = sickPlanPieces.length;

  useEffect(() => {
    if (added.size === total) onReady?.();
  }, [added.size, onReady, total]);

  return (
    <div className={styles.planKit}>
      <div className={styles.rerouteHead}>
        <p className="editorial-eyebrow">Write the plan before you are unwell</p>
        <p>
          Tap each piece to write it into your sick-day plan. A plan made while well is easier to
          follow than a decision made while ill.
        </p>
      </div>
      <div className={styles.planKitBody}>
        <div aria-label="Sick-day plan pieces" className={styles.planPieces} role="group">
          {sickPlanPieces.map((piece) => {
            const isAdded = added.has(piece.id);
            return (
              <button
                aria-pressed={isAdded}
                className={cn(styles.planPiece, isAdded && styles.planPieceAdded)}
                key={piece.id}
                onClick={() =>
                  setAdded((current) => {
                    const next = new Set(current);
                    if (next.has(piece.id)) {
                      next.delete(piece.id);
                    } else {
                      next.add(piece.id);
                    }
                    return next;
                  })
                }
                type="button"
              >
                {piece.label}
              </button>
            );
          })}
        </div>
        <div className={styles.planCard}>
          <p className={styles.planCardTitle}>My sick-day plan</p>
          {added.size === 0 ? (
            <p className={styles.planCardEmpty}>Tap the pieces and they appear here, in order.</p>
          ) : (
            <ul className={styles.planCardList}>
              {sickPlanPieces
                .filter((piece) => added.has(piece.id))
                .map((piece) => (
                  <li key={piece.id}>{piece.label}</li>
                ))}
            </ul>
          )}
        </div>
      </div>
      <p aria-live="polite" className={styles.rerouteCaption}>
        {added.size === total
          ? "Your plan is written. Future-you, tired and unwell, will be glad it already exists."
          : `${added.size} of ${total} written. Keep it somewhere you can find it fast.`}
      </p>
    </div>
  );
}

export function DayTwelveExperience({ lesson: experience }: { lesson: LessonPlayerViewModel }) {
  const router = useRouter();
  const storageKey = `health-decoded:day-twelve:${experience.lessonProgressId}`;
  const gateStorageKey = `${storageKey}:ready`;
  const [stage, setStage] = useState(0);
  const [openingFeeling, setOpeningFeeling] = useState<string | null>(null);
  const [activeSolverStep, setActiveSolverStep] = useState<SolverStepId>("pause");
  const [lifeSituation, setLifeSituation] = useState<LifeSituationId>("late_meal");
  const [lifeTool, setLifeTool] = useState<LifeToolId>("notice");
  const [sickPriority, setSickPriority] = useState<SickPriorityId>("fluids");
  const [callFocus, setCallFocus] = useState<CallDetailId>("change");
  const [planTrigger, setPlanTrigger] = useState<PlanTriggerId>("walk");
  const [planBackup, setPlanBackup] = useState<PlanBackupId>("minutes");
  const [scriptSituation, setScriptSituation] = useState("");
  const [scriptAction, setScriptAction] = useState("");
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
  const [readyStages, setReadyStages] = useState<Set<number>>(() => new Set());
  const [solverStepsSeen, setSolverStepsSeen] = useState<Set<SolverStepId>>(
    () => new Set(["pause"]),
  );
  const [planChoicesMade, setPlanChoicesMade] = useState<Set<"trigger" | "backup">>(
    () => new Set(),
  );
  const [dayChoicesMade, setDayChoicesMade] = useState<Set<"situation" | "tool">>(() => new Set());
  const markReady = useCallback(
    (target: number) => {
      setReadyStages((current) => {
        if (current.has(target)) return current;
        const next = new Set(current).add(target);
        if (experience.accessMode === "active") {
          window.localStorage.setItem(gateStorageKey, JSON.stringify([...next]));
        }
        return next;
      });
    },
    [experience.accessMode, gateStorageKey],
  );
  const markSickDayPlanReady = useCallback(() => markReady(4), [markReady]);
  const stageRef = useRef<HTMLDivElement>(null);
  const stageLocked = isLessonStageLocked({
    accessMode: experience.accessMode,
    gates: dayTwelveStageGates,
    readyStages,
    stage,
  });
  const stageGateMessage = dayTwelveStageGates[stage];

  useEffect(() => {
    if (experience.accessMode === "review") return;
    let restoredReady = new Set<number>();
    try {
      const parsed = JSON.parse(window.localStorage.getItem(gateStorageKey) ?? "[]") as unknown;
      if (Array.isArray(parsed)) {
        restoredReady = new Set(
          parsed.filter((value): value is number => Number.isInteger(value) && value >= 0),
        );
      }
    } catch {
      restoredReady = new Set();
    }
    setReadyStages(restoredReady);
    const stored = Number(window.localStorage.getItem(storageKey));
    if (Number.isInteger(stored) && stored >= 0 && stored < stageCount) {
      setStage(
        getLessonResumeStage({
          gates: dayTwelveStageGates,
          readyStages: restoredReady,
          storedStage: stored,
        }),
      );
    }
  }, [experience.accessMode, gateStorageKey, storageKey]);

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
    if (
      !canNavigateToLessonStage({
        accessMode: experience.accessMode,
        currentStage: stage,
        gates: dayTwelveStageGates,
        nextStage,
        readyStages,
      })
    ) {
      return;
    }

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
    const evaluationStage = { lateLunch: 2, sickDay: 5, missedMedication: 6, teachBack: 8 };
    markReady(evaluationStage[key]);
    const result = await evaluateDayTwelveAction(input);
    if (result.ok) setEvaluations((current) => ({ ...current, [key]: result.data }));
    else setMessage(result.message);
  }

  const activeSituation =
    lifeSituations.find((item) => item.id === lifeSituation) ?? lifeSituations[0];
  const activeTool = lifeTools.find((item) => item.id === lifeTool) ?? lifeTools[0];
  const selectedTrigger =
    planTriggers.find(([id]) => id === planTrigger)?.[1] ?? planTriggers[0][1];
  const selectedBackup = planBackups.find(([id]) => id === planBackup)?.[1] ?? planBackups[0][1];
  const personalSituation = scriptSituation.trim() || selectedTrigger;
  const personalAction = scriptAction.trim() || selectedBackup;

  function selectSolverStep(id: SolverStepId) {
    setActiveSolverStep(id);
    const next = new Set(solverStepsSeen).add(id);
    setSolverStepsSeen(next);
    if (next.size === solverSteps.length) markReady(1);
  }

  function selectPlanTrigger(id: PlanTriggerId) {
    setPlanTrigger(id);
    const next = new Set(planChoicesMade).add("trigger" as const);
    setPlanChoicesMade(next);
    if (next.has("backup")) markReady(7);
  }

  function selectPlanBackup(id: PlanBackupId) {
    setPlanBackup(id);
    const next = new Set(planChoicesMade).add("backup" as const);
    setPlanChoicesMade(next);
    if (next.has("trigger")) markReady(7);
  }

  function selectLifeSituation(id: LifeSituationId) {
    setLifeSituation(id);
    const next = new Set(dayChoicesMade).add("situation" as const);
    setDayChoicesMade(next);
    if (next.has("tool")) markReady(3);
  }

  function selectLifeTool(id: LifeToolId) {
    setLifeTool(id);
    const next = new Set(dayChoicesMade).add("tool" as const);
    setDayChoicesMade(next);
    if (next.has("situation")) markReady(3);
  }

  function continueLabel() {
    return (
      [
        "Meet the four-step solver",
        "Practice a changed meal",
        "Design for a real day",
        "Prepare for sick days",
        "Make the call usable",
        "Handle a missed dose safely",
        "Build a kinder Plan B",
        "Write one sentence to carry",
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
      const result = await completeLessonAction({
        lessonProgressId: experience.lessonProgressId,
        reflection: `When ${personalSituation}, I can ${personalAction}.`,
      });
      if (!result.ok) {
        setMessage(result.message);
        return;
      }
      window.localStorage.removeItem(storageKey);
      window.localStorage.removeItem(gateStorageKey);
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
                <p className="editorial-number text-accent-warm">12</p>
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
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {openingFeelings.map(([id, label]) => (
                  <AnswerChoice
                    key={id}
                    onClick={() => {
                      setOpeningFeeling(id);
                      markReady(0);
                    }}
                    selected={openingFeeling === id}
                  >
                    {label}
                  </AnswerChoice>
                ))}
              </div>
            </div>
            <div className={styles.reassurance}>
              <Sparkles aria-hidden="true" />
              <p>
                {openingFeeling
                  ? "Real life is allowed in this room. One changed meal, missed routine, or difficult day does not decide your health."
                  : "Choose the closest answer to continue. This lesson is practice, not another plan you have to perform perfectly."}
              </p>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-9">
            <LessonHeading label="A reusable way through">
              Four small moves can make a changed moment feel workable.
            </LessonHeading>
            <ChangedDayAnimation activeStep={activeSolverStep} />
            <div>
              <p className={styles.promptTitle}>Move through the moment at your own pace.</p>
              <div className={styles.solverTabs}>
                {solverSteps.map((item) => (
                  <button
                    aria-pressed={activeSolverStep === item.id}
                    className={cn(
                      styles.solverTab,
                      activeSolverStep === item.id && styles.solverTabActive,
                    )}
                    key={item.id}
                    onClick={() => selectSolverStep(item.id)}
                    type="button"
                  >
                    <span>{item.number}</span>
                    <strong>{item.title}</strong>
                  </button>
                ))}
              </div>
              <p aria-live="polite" className={styles.rerouteCaption}>
                {solverStepsSeen.size === solverSteps.length
                  ? "All four moves are open. You can carry the full sequence into the next chapter."
                  : `${solverStepsSeen.size} of ${solverSteps.length} moves opened. Visit each move once.`}
              </p>
            </div>
            <BreatheThrough />
            <RerouteTheDay />
            <p className={styles.quietNote}>
              Pause · Understand · Choose · Adjust is a cycle, not a score. New information can send
              you back around without erasing what you already learned.
            </p>
          </div>
        );
      case 2:
        return (
          <div className="space-y-9">
            <LessonHeading label="Practice: lunch moved">
              The best available choice is not a consolation prize.
            </LessonHeading>
            <div className={styles.scenarioStory}>
              <div>
                <p className="editorial-eyebrow">What changed</p>
                <h2>A meeting runs long. Lunch is late.</h2>
                <p>
                  The nearby option is a sandwich, chips, and a cookie. It is not what you planned,
                  and you still need to decide what happens next.
                </p>
              </div>
              <div>
                <p className="editorial-eyebrow text-success">What remains available</p>
                <h2>The day still has another decision in it.</h2>
                <p>
                  The useful response is based on the meal and timing that actually exist, not on
                  making the interruption disappear.
                </p>
              </div>
            </div>
            <SteadyStory />
            <div className={styles.teachBack}>
              <p className={styles.promptTitle}>Which response uses the four-step solver?</p>
              <div className="mt-6 grid gap-3">
                {(
                  [
                    [
                      "best_available",
                      "Choose the best available meal, notice what is in it, and return to the usual pattern at the next opportunity.",
                    ],
                    ["skip_to_compensate", "Skip food now to make up for options not being ideal."],
                    ["day_is_ruined", "Treat the whole day as ruined and stop paying attention."],
                  ] as const
                ).map(([answer, label]) => (
                  <AnswerChoice
                    key={answer}
                    onClick={() =>
                      void evaluate({ answer, stage: "late_lunch" }, "lateLunch", answer)
                    }
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
            <div className={styles.adaptationReader}>
              <nav aria-label="Choose a real-life interruption">
                {lifeSituations.map((item) => (
                  <button
                    aria-pressed={lifeSituation === item.id}
                    className={cn(
                      styles.textTab,
                      lifeSituation === item.id && styles.textTabActive,
                    )}
                    key={item.id}
                    onClick={() => selectLifeSituation(item.id)}
                    type="button"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
              <article aria-live="polite">
                <p className="editorial-eyebrow text-accent-warm">What remains true</p>
                <h2>{activeSituation.truth}</h2>
                <p>
                  Choose one tool below. You are not building a perfect rescue plan, just making the
                  next moment more usable.
                </p>
              </article>
            </div>
            <div className={styles.toolList}>
              {lifeTools.map((item) => (
                <button
                  aria-pressed={lifeTool === item.id}
                  className={cn(styles.toolChoice, lifeTool === item.id && styles.toolChoiceActive)}
                  key={item.id}
                  onClick={() => selectLifeTool(item.id)}
                  type="button"
                >
                  <strong>{item.label}</strong>
                  <span>{item.note}</span>
                </button>
              ))}
            </div>
            <div className={styles.fieldNote}>
              <RotateCcw aria-hidden="true" />
              <div>
                <p className="editorial-eyebrow">Your flexible-day note</p>
                <p>
                  When {activeSituation.label.toLowerCase()}, I can {activeTool.label.toLowerCase()}
                  .{` ${activeTool.note}`}
                </p>
              </div>
            </div>
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
            <SickDayBodyAnimation priority={sickPriority} />
            <PackSickDayPlan onReady={markSickDayPlanReady} />
            <div>
              <p className={styles.promptTitle}>Explore the anchors of a personal sick-day plan.</p>
              <div className={styles.priorityList}>
                {sickDayPriorities.map((item, index) => (
                  <button
                    aria-pressed={sickPriority === item.id}
                    className={cn(
                      styles.priorityChoice,
                      sickPriority === item.id && styles.priorityChoiceActive,
                    )}
                    key={item.id}
                    onClick={() => setSickPriority(item.id)}
                    type="button"
                  >
                    <span>0{index + 1}</span>
                    <strong>{item.title}</strong>
                  </button>
                ))}
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
            <CareCallAnimation focus={callFocus} />
            <div className={styles.callFocusList}>
              {callDetails.map((item) => (
                <button
                  aria-pressed={callFocus === item.id}
                  className={cn(styles.callFocus, callFocus === item.id && styles.callFocusActive)}
                  key={item.id}
                  onClick={() => setCallFocus(item.id)}
                  type="button"
                >
                  <strong>{item.label}</strong>
                  <span>{item.note}</span>
                </button>
              ))}
            </div>
            <div className={styles.scenarioPrompt}>
              <p className="editorial-eyebrow">Jordan’s sick day</p>
              <h2>Jordan has a fever, can drink, and is thinking clearly, but is eating less.</h2>
              <p>Jordan has the written plan nearby but is unsure how one instruction applies.</p>
            </div>
            <div className={styles.teachBack}>
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
                    onClick={() => void evaluate({ answer, stage: "sick_day" }, "sickDay", answer)}
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
                Keep the Day 9 action plan available: severe trouble breathing, new confusion,
                difficulty waking, or another immediate danger needs emergency help rather than a
                routine message.
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
                <p className="editorial-eyebrow">Pause before acting</p>
                <h2>Different medicines have different missed-dose instructions.</h2>
                <p>
                  Timing, dose, and how long a medicine stays in the body can change what the safe
                  next step is.
                </p>
              </div>
              <div>
                <p className="editorial-eyebrow text-success">Where the answer lives</p>
                <h2>Use the instructions for the exact medicine.</h2>
                <p>
                  Check the medicine information or written prescriber plan. If the answer is
                  unclear, ask a pharmacist or diabetes care team.
                </p>
              </div>
            </div>
            <div className={styles.teachBack}>
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
                      void evaluate(
                        { answer, stage: "missed_medication" },
                        "missedMedication",
                        answer,
                      )
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
            <div className={styles.reassurance}>
              <Stethoscope aria-hidden="true" />
              <p>
                Do not double a dose unless the medicine instructions or a qualified clinician
                specifically tell you to do so.
              </p>
            </div>
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
            <PlanBAnimation planBackup={planBackup} planTrigger={planTrigger} />
            <div className={styles.planBuilder}>
              <section>
                <p className="editorial-eyebrow">When this changes…</p>
                <div className="mt-4 grid gap-3">
                  {planTriggers.map(([id, label]) => (
                    <AnswerChoice
                      key={id}
                      onClick={() => selectPlanTrigger(id)}
                      selected={planTrigger === id}
                    >
                      {label}
                    </AnswerChoice>
                  ))}
                </div>
              </section>
              <section>
                <p className="editorial-eyebrow">I can…</p>
                <div className="mt-4 grid gap-3">
                  {planBackups.map(([id, label]) => (
                    <AnswerChoice
                      key={id}
                      onClick={() => selectPlanBackup(id)}
                      selected={planBackup === id}
                    >
                      {label}
                    </AnswerChoice>
                  ))}
                </div>
              </section>
            </div>
            <p aria-live="polite" className={styles.quietNote}>
              {planChoicesMade.size === 2
                ? "Both sides are chosen. Your backup plan is ready to carry forward."
                : `${planChoicesMade.size} of 2 sides chosen. Pick one changed moment and one useful response.`}
            </p>
            <div className={styles.planTicket}>
              <p className="editorial-eyebrow">Your Plan B</p>
              <p>
                If {selectedTrigger}, I will {selectedBackup}.
              </p>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="space-y-9">
            <LessonHeading label="Make the skill yours">
              One sentence can be enough to find the next step.
            </LessonHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Your Plan B already works as a script. If you want, replace either half with words
              that sound more like your life. Both fields are optional.
            </p>
            <div className={styles.scriptStudio}>
              <div>
                <p className="editorial-eyebrow">The sentence you already built</p>
                <blockquote>
                  “If {selectedTrigger}, I will {selectedBackup}.”
                </blockquote>
              </div>
              <div className={styles.writingFields}>
                <label>
                  <span>If this happens…</span>
                  <input
                    maxLength={120}
                    onChange={(event) => setScriptSituation(event.target.value)}
                    placeholder={selectedTrigger}
                    value={scriptSituation}
                  />
                </label>
                <label>
                  <span>I will…</span>
                  <input
                    maxLength={160}
                    onChange={(event) => setScriptAction(event.target.value)}
                    placeholder={selectedBackup}
                    value={scriptAction}
                  />
                </label>
                <small>Your words stay on this page and are not saved as health information.</small>
              </div>
            </div>
            <blockquote className={styles.scriptPreview}>
              “If {personalSituation}, I will {personalAction}.”
            </blockquote>
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
                    ["restart_monday", "A fresh week is the only time a routine can count again."],
                    [
                      "make_up_for_it",
                      "The best response is to punish the mistake with stricter rules today.",
                    ],
                  ] as const
                ).map(([answer, label]) => (
                  <AnswerChoice
                    key={answer}
                    onClick={() =>
                      void evaluate({ answer, stage: "teach_back" }, "teachBack", answer)
                    }
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
              <p className="editorial-eyebrow text-success">Problem-solving sequence</p>
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
            <div className={styles.finalScript}>
              <p className="editorial-eyebrow">One sentence to carry</p>
              <p>
                If {personalSituation}, I will {personalAction}.
              </p>
            </div>
            <div className="mx-auto grid max-w-3xl gap-8 text-left md:grid-cols-2">
              <div>
                <p className="editorial-eyebrow">Tomorrow</p>
                <h2 className="mt-3 font-serif-display text-3xl">
                  Support, stigma, and speaking up
                </h2>
                <p className="mt-2 leading-7 text-muted-foreground">
                  Tomorrow turns toward the people around you: asking for help that actually helps,
                  protecting privacy, and setting a calm boundary.
                </p>
              </div>
              <div>
                <p className="editorial-eyebrow">The skill you built</p>
                <p className="mt-3 font-serif-display text-2xl">
                  A backup plan that keeps care moving when the day changes.
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

  return (
    <section className="mx-auto flex min-h-[calc(100dvh-10rem)] max-w-[1020px] flex-col py-1 sm:py-4">
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
            <p className="text-sm font-semibold text-accent-warm">Day 12</p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Problem Solving for Real Life
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
            label={`Day 12 chapter ${stage + 1} of ${stageCount}`}
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
          {stageLocked && stageGateMessage ? (
            <p className="mb-4 rounded-[8px] border border-[#9db3a8] bg-[#eef2ec] px-3 py-2 text-sm font-medium text-[#3f6053]">
              One small step first: {stageGateMessage}
            </p>
          ) : null}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button
              disabled={stage === 0 || isPending}
              onClick={() => goToStage(stage - 1)}
              variant="secondary"
            >
              Previous
            </Button>
            <Button disabled={isPending || stageLocked} onClick={() => goToStage(stage + 1)}>
              {continueLabel()}
            </Button>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Each practice chapter asks for one meaningful interaction before continuing. Personal
            reflections and writing remain optional.
          </p>
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
              <dd className="mt-1 leading-7 text-muted-foreground">{item.definition}</dd>
            </div>
          ))}
        </dl>
      </Modal>
    </section>
  );
}
