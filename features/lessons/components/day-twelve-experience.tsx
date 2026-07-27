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
import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";

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
    note: "Respond to what happened—not to the fear that the whole day is ruined.",
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
        <rect fill="#fffaf2" height="61" rx="6" stroke="#91aa9d" width="103" x="695" y="239" />
        <rect fill="#c8dad2" height="10" rx="3" width="65" x="714" y="257" />
        <rect fill="#e5d4bd" height="8" rx="3" width="49" x="714" y="275" />
        <LessonMotionPerson
          action={activeStep === "choose" ? "reach-right" : "rest"}
          motion={activeStep === "pause" ? "breathe" : "nod"}
          palette="warm"
          scale={0.98}
          seated
          x={625}
          y={356}
        />

        {activeStep === "pause" ? (
          <g key="pause">
            <path
              d="M622 215 C606 201 605 186 620 174"
              fill="none"
              stroke="#7ba08d"
              strokeWidth="5"
            >
              <animate
                attributeName="opacity"
                dur="3.6s"
                repeatCount="indefinite"
                values=".15;1;.15"
              />
              <animateTransform
                attributeName="transform"
                dur="3.6s"
                repeatCount="indefinite"
                type="translate"
                values="0 7;0 -7;0 7"
              />
            </path>
            <path
              d="M644 215 C660 201 661 186 646 174"
              fill="none"
              stroke="#7ba08d"
              strokeWidth="5"
            >
              <animate
                attributeName="opacity"
                dur="3.6s"
                repeatCount="indefinite"
                values=".15;1;.15"
              />
              <animateTransform
                attributeName="transform"
                dur="3.6s"
                repeatCount="indefinite"
                type="translate"
                values="0 7;0 -7;0 7"
              />
            </path>
          </g>
        ) : null}

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
              cx="705"
              cy="307"
              fill="#fffaf2"
              rx="53"
              ry="13"
              stroke="#c7785f"
              strokeWidth="4"
            />
            <path d="M670 298 Q706 268 742 298" fill="#eac789" />
            <path d="M680 294 Q706 277 732 294" fill="#789b88" opacity=".85" />
            <path d="M663 265 V299" stroke="#789185" strokeLinecap="round" strokeWidth="5">
              <animateTransform
                attributeName="transform"
                dur="2.8s"
                repeatCount="indefinite"
                type="rotate"
                values="0 663 299;-8 663 299;0 663 299"
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
        <path d="M398 115 V180" stroke="#c98b76" strokeLinecap="round" strokeWidth="7" />
        <path
          d="M321 192 Q364 155 425 179 Q454 190 456 217 Q457 249 423 266 Q376 280 336 258 Q309 242 321 192 Z"
          fill="#b87361"
          stroke="#955645"
          strokeWidth="4"
        >
          <animate attributeName="opacity" dur="3.8s" repeatCount="indefinite" values=".72;1;.72" />
        </path>
        <path
          d="M420 222 Q470 200 481 244 Q488 273 463 300 Q449 315 455 341 Q420 335 404 309 Q391 287 409 264 Q423 247 420 222 Z"
          fill="#d9a184"
          stroke="#a57d61"
          strokeWidth="4"
        />
        <path
          d="M337 311 Q367 288 399 310 Q427 328 401 347 Q374 365 343 348 Q318 334 337 311 Z"
          fill="none"
          stroke="#c9826d"
          strokeLinecap="round"
          strokeWidth="11"
        />

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
          <circle fill="#e5b56f" key={index} r="8">
            <animateMotion
              begin={`${index * -1.1}s`}
              dur="4.6s"
              path="M382 243 C410 288 447 362 615 390"
              repeatCount="indefinite"
            />
            <animate attributeName="opacity" dur="4.6s" repeatCount="indefinite" values="0;1;1;0" />
          </circle>
        ))}

        <g>
          <circle cx="176" cy="185" fill="#c97b67" r="13" />
          <path
            d="M166 173 l-14 -16 M187 173 l15 -16"
            stroke="#9f5c51"
            strokeLinecap="round"
            strokeWidth="5"
          />
          <path
            d="M186 191 C228 185 277 190 323 208"
            fill="none"
            stroke="#c97b67"
            strokeLinecap="round"
            strokeWidth="3"
            opacity=".45"
          />
          <circle fill="#d57e63" r="7">
            <animateMotion
              dur="4.6s"
              path="M187 191 C228 185 277 190 323 208"
              repeatCount="indefinite"
            />
            <animate attributeName="opacity" dur="4.6s" repeatCount="indefinite" values="0;1;1;0" />
          </circle>
        </g>

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
          One person rests on a sofa while a friend keeps water and the written sick-day plan within
          reach. The selected call detail changes what the friend gathers for the clinician.
        </desc>
        <rect fill="#f2eee6" height="420" width="900" />
        <path d="M42 381 H858" stroke="#b3bcae" strokeLinecap="round" strokeWidth="5" />
        <rect
          fill="#d9e7e1"
          height="145"
          rx="7"
          stroke="#9fb5a9"
          strokeWidth="4"
          width="205"
          x="64"
          y="47"
        />
        <circle cx="166" cy="110" fill="#edca8c" r="34" />
        <path d="M89 178 Q166 132 244 178" fill="#abc0b3" />

        <path
          d="M90 304 H389 Q407 304 407 323 V353 H90 Z"
          fill="#83a18f"
          stroke="#607b6c"
          strokeWidth="4"
        />
        <rect fill="#a8c0b3" height="76" rx="8" width="104" x="78" y="275" />
        <path
          d="M119 353 V381 M376 353 V381"
          stroke="#607b6c"
          strokeLinecap="round"
          strokeWidth="10"
        />
        <LessonMotionPerson
          action="rest"
          motion="breathe"
          palette="warm"
          scale={0.9}
          seated
          x={268}
          y={344}
        />

        <path
          d="M442 311 H657 M466 313 L456 381 M632 313 L642 381"
          stroke="#866f5e"
          strokeLinecap="round"
          strokeWidth="12"
        />
        <ellipse
          cx="526"
          cy="304"
          fill="#fffaf2"
          rx="39"
          ry="10"
          stroke="#c58a70"
          strokeWidth="4"
        />
        <path d="M494 252 H522 L520 296 H496 Z" fill="#fffaf2" stroke="#6f9485" strokeWidth="4" />
        <path d="M497 278 H520 L520 296 H496 Z" fill="#8db8c1" />
        <LessonMotionPerson
          action={focus === "followed" ? "reach-left" : "listen"}
          motion="nod"
          palette="sage"
          scale={0.9}
          seated
          x={600}
          y={344}
        />

        <rect
          fill="#fffaf2"
          height="142"
          rx="7"
          stroke="#a79582"
          strokeWidth="4"
          width="112"
          x="658"
          y="203"
        />
        <path
          d="M679 234 H749 M679 255 H735 M679 276 H748 M679 297 H726"
          stroke="#9bad9f"
          strokeLinecap="round"
          strokeWidth="5"
        />

        {focus === "change" ? (
          <g key="change">
            <circle cx="218" cy="222" fill="#fffaf2" r="34" stroke="#c7785f" strokeWidth="4" />
            <path
              d="M218 222 V200 M218 222 L235 229"
              stroke="#6b8177"
              strokeLinecap="round"
              strokeWidth="5"
            />
            <path d="M458 248 V292" stroke="#c7785f" strokeLinecap="round" strokeWidth="7" />
            <circle cx="458" cy="303" fill="#c7785f" r="12">
              <animate
                attributeName="opacity"
                dur="2.8s"
                repeatCount="indefinite"
                values=".5;1;.5"
              />
            </circle>
          </g>
        ) : null}
        {focus === "followed" ? (
          <g key="followed">
            <path d="M674 231 H748" stroke="#c7785f" strokeLinecap="round" strokeWidth="6">
              <animate
                attributeName="stroke-dasharray"
                dur="3s"
                repeatCount="indefinite"
                values="0 80;80 0;80 0"
              />
            </path>
            <path d="M486 272 Q505 254 523 272" fill="none" stroke="#79a7b1" strokeWidth="4">
              <animateTransform
                attributeName="transform"
                dur="3.6s"
                repeatCount="indefinite"
                type="translate"
                values="0 5;0 -4;0 5"
              />
            </path>
          </g>
        ) : null}
        {focus === "question" ? (
          <g key="question">
            <rect fill="#405750" height="82" rx="10" width="48" x="791" y="224" />
            <circle cx="815" cy="290" fill="#dce8e1" r="4" />
            <path
              d="M780 207 Q815 179 850 207 M788 216 Q815 195 842 216"
              fill="none"
              stroke="#c87860"
              strokeLinecap="round"
              strokeWidth="4"
            >
              <animate attributeName="opacity" dur="2.4s" repeatCount="indefinite" values="0;1;0" />
            </path>
            <circle cx="815" cy="160" fill="#ddb08a" r="25" stroke="#5b7e89" strokeWidth="4" />
            <path d="M782 199 Q815 164 848 199" fill="#7d9da4" />
            <path
              d="M805 162 Q815 170 825 162"
              fill="none"
              stroke="#7c5b4c"
              strokeLinecap="round"
              strokeWidth="3"
            />
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

export function DayTwelveExperience({ lesson: experience }: { lesson: LessonPlayerViewModel }) {
  const router = useRouter();
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

  const activeSituation =
    lifeSituations.find((item) => item.id === lifeSituation) ?? lifeSituations[0];
  const activeTool = lifeTools.find((item) => item.id === lifeTool) ?? lifeTools[0];
  const selectedTrigger =
    planTriggers.find(([id]) => id === planTrigger)?.[1] ?? planTriggers[0][1];
  const selectedBackup = planBackups.find(([id]) => id === planBackup)?.[1] ?? planBackups[0][1];
  const personalSituation = scriptSituation.trim() || selectedTrigger;
  const personalAction = scriptAction.trim() || selectedBackup;

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
                    onClick={() => setOpeningFeeling(id)}
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
                  : "Choose an answer if it helps, or keep going. This lesson is practice—not another plan you have to perform perfectly."}
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
                    onClick={() => setActiveSolverStep(item.id)}
                    type="button"
                  >
                    <span>{item.number}</span>
                    <strong>{item.title}</strong>
                  </button>
                ))}
              </div>
            </div>
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
                  The useful response is based on the meal and timing that actually exist—not on
                  making the interruption disappear.
                </p>
              </div>
            </div>
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
                    onClick={() => setLifeSituation(item.id)}
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
                  Choose one tool below. You are not building a perfect rescue plan—just making the
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
                  onClick={() => setLifeTool(item.id)}
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
              A missed dose needs the right instruction—not a guessed correction.
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
                      onClick={() => setPlanTrigger(id)}
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
                      onClick={() => setPlanBackup(id)}
                      selected={planBackup === id}
                    >
                      {label}
                    </AnswerChoice>
                  ))}
                </div>
              </section>
            </div>
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
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button
              disabled={stage === 0 || isPending}
              onClick={() => goToStage(stage - 1)}
              variant="secondary"
            >
              Previous
            </Button>
            <Button disabled={isPending} onClick={() => goToStage(stage + 1)}>
              {continueLabel()}
            </Button>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            The interactions are invitations, not gates. Continue whenever you are ready.
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
