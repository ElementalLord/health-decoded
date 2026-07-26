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
          A person works at a desk while a clock moves past lunch. They pause, bring the available
          meal to the desk, eat, and return calmly to the rest of the afternoon.
        </desc>
        <rect fill="#eef4f0" height="420" width="900" />
        <rect fill="#f8ead7" height="134" rx="8" stroke="#d3b79c" width="205" x="82" y="48" />
        <circle cx="177" cy="111" fill="#edca8c" r="35">
          <animate attributeName="opacity" dur="5s" repeatCount="indefinite" values=".55;.86;.55" />
        </circle>
        <path d="M102 162 Q178 111 267 159" fill="#b7c9bc" opacity=".7" />

        <circle cx="420" cy="102" fill="#fffaf2" r="54" stroke="#789185" strokeWidth="5" />
        <line
          stroke="#566f65"
          strokeLinecap="round"
          strokeWidth="6"
          x1="420"
          x2="420"
          y1="102"
          y2="70"
        >
          <animateTransform
            attributeName="transform"
            dur="9s"
            keyTimes="0;0.25;0.62;1"
            repeatCount="indefinite"
            type="rotate"
            values="0 420 102;0 420 102;60 420 102;60 420 102"
          />
        </line>
        <line
          stroke="#c7785f"
          strokeLinecap="round"
          strokeWidth="5"
          x1="420"
          x2="442"
          y1="102"
          y2="102"
        >
          <animateTransform
            attributeName="transform"
            dur="9s"
            keyTimes="0;0.25;0.62;1"
            repeatCount="indefinite"
            type="rotate"
            values="0 420 102;0 420 102;120 420 102;120 420 102"
          />
        </line>
        <circle cx="420" cy="102" fill="#566f65" r="5" />

        <path d="M505 287 H800" stroke="#876f5d" strokeLinecap="round" strokeWidth="15" />
        <path
          d="M548 290 L530 382 M758 290 L776 382"
          stroke="#876f5d"
          strokeLinecap="round"
          strokeWidth="12"
        />
        <rect fill="#f9f4eb" height="70" rx="7" stroke="#91aa9d" width="108" x="665" y="203" />
        <path
          d="M688 231 H749 M688 247 H735"
          stroke="#a8b7ae"
          strokeLinecap="round"
          strokeWidth="5"
        />

        <g>
          <animateTransform
            attributeName="transform"
            dur="4.6s"
            repeatCount="indefinite"
            type="translate"
            values="0 0;0 -3;0 0"
          />
          <circle cx="590" cy="181" fill="#dba27b" r="31" />
          <path d="M552 181 Q587 123 629 182" fill="#50675f" />
          <path d="M548 304 Q553 216 590 216 Q627 216 633 304" fill="#c97961" />
          <path
            d="M562 298 L546 382 M614 298 L633 382"
            stroke="#7a5b4d"
            strokeLinecap="round"
            strokeWidth="12"
          />
          <g>
            <animateTransform
              attributeName="transform"
              dur="9s"
              keyTimes="0;0.32;0.48;0.7;1"
              repeatCount="indefinite"
              type="rotate"
              values="0 623 239;0 623 239;-16 623 239;-16 623 239;0 623 239"
            />
            <path
              d="M624 239 Q655 254 674 269"
              fill="none"
              stroke="#c97961"
              strokeLinecap="round"
              strokeWidth="12"
            />
          </g>
        </g>

        <g>
          <animateTransform
            attributeName="transform"
            dur="9s"
            keyTimes="0;0.34;0.55;0.8;1"
            repeatCount="indefinite"
            type="translate"
            values="0 0;0 0;230 -57;230 -57;0 0"
          />
          <rect fill="#e7b77b" height="67" rx="7" stroke="#9b714e" width="78" x="235" y="282" />
          <path d="M250 289 Q274 255 298 289" fill="none" stroke="#9b714e" strokeWidth="6" />
        </g>

        <g>
          <animate
            attributeName="opacity"
            dur="9s"
            keyTimes="0;0.14;0.32;0.43;1"
            repeatCount="indefinite"
            values="0;1;1;0;0"
          />
          <rect fill="#fffaf2" height="55" rx="8" stroke="#d0af93" width="218" x="485" y="76" />
          <text
            fill="#6f5144"
            fontFamily="sans-serif"
            fontSize="16"
            fontWeight="700"
            x="514"
            y="109"
          >
            The meeting ran long.
          </text>
        </g>
        <g>
          <animate
            attributeName="opacity"
            dur="9s"
            keyTimes="0;0.45;0.56;0.82;0.92;1"
            repeatCount="indefinite"
            values="0;0;1;1;0;0"
          />
          <rect fill="#fffaf2" height="55" rx="8" stroke="#9eb5a8" width="235" x="521" y="76" />
          <text
            fill="#405750"
            fontFamily="sans-serif"
            fontSize="16"
            fontWeight="700"
            x="547"
            y="109"
          >
            The next choice still counts.
          </text>
        </g>
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
          A simplified body shows illness signals reaching the liver. The liver releases glucose
          into a blood vessel while a nearby glass and droplet represent hydration.
        </desc>
        <rect fill="#edf3f0" height="450" width="900" />
        <circle cx="435" cy="91" fill="#ddb08d" r="47" />
        <path
          d="M312 393 Q314 172 435 151 Q556 172 558 393 Z"
          fill="#f7ede1"
          stroke="#8da99a"
          strokeWidth="6"
        />
        <path
          d="M377 221 Q429 187 488 219 Q486 282 423 289 Q378 273 377 221 Z"
          fill="#c7785f"
          stroke="#955645"
          strokeWidth="4"
        >
          <animate attributeName="opacity" dur="3.8s" repeatCount="indefinite" values=".72;1;.72" />
        </path>
        <text fill="#fffaf2" fontFamily="sans-serif" fontSize="13" fontWeight="800" x="420" y="244">
          LIVER
        </text>
        <path
          d="M459 299 Q513 269 511 322 Q507 367 463 351 Q433 339 459 299 Z"
          fill="#e3bd99"
          stroke="#a57d61"
          strokeWidth="4"
        />
        <text fill="#77594a" fontFamily="sans-serif" fontSize="11" fontWeight="800" x="461" y="327">
          STOMACH
        </text>

        <path
          d="M256 382 H703"
          fill="none"
          stroke="#8ba9aa"
          strokeLinecap="round"
          strokeWidth="25"
        />
        <path
          d="M256 382 H703"
          fill="none"
          stroke="#dceaea"
          strokeLinecap="round"
          strokeWidth="13"
        />
        {[0, 1, 2, 3].map((index) => (
          <circle fill="#e5b56f" key={index} r="8">
            <animateMotion
              begin={String(index * 0.7) + "s"}
              dur="4.6s"
              path="M423 272 C455 310 505 375 690 382"
              repeatCount="indefinite"
            />
            <animate attributeName="opacity" dur="4.6s" repeatCount="indefinite" values="0;1;1;0" />
          </circle>
        ))}

        {[0, 1, 2].map((index) => (
          <g key={index}>
            <circle cx={177 + index * 30} cy={142 + index * 22} fill="#c97b67" r="10">
              <animate attributeName="r" dur="2.8s" repeatCount="indefinite" values="8;12;8" />
            </circle>
            <path
              d={`M${170 + index * 30} ${132 + index * 22} l-8 -10 M${185 + index * 30} ${132 + index * 22} l8 -10`}
              stroke="#9f5c51"
              strokeLinecap="round"
              strokeWidth="4"
            />
          </g>
        ))}
        <circle fill="#d57e63" r="7">
          <animateMotion
            dur="5.5s"
            path="M229 180 C280 170 335 190 394 224"
            repeatCount="indefinite"
          />
          <animate attributeName="opacity" dur="5.5s" repeatCount="indefinite" values="0;1;1;0" />
        </circle>
        <circle fill="#d57e63" r="6">
          <animateMotion
            begin="1.1s"
            dur="5.5s"
            path="M229 180 C280 170 335 190 394 224"
            repeatCount="indefinite"
          />
          <animate attributeName="opacity" dur="5.5s" repeatCount="indefinite" values="0;1;1;0" />
        </circle>

        <path d="M700 151 H793 L778 303 H715 Z" fill="#fffaf2" stroke="#6f9485" strokeWidth="5" />
        <path d="M710 234 H783 L778 303 H715 Z" fill="#8db8c1" opacity=".85">
          <animate
            attributeName="d"
            dur="4s"
            repeatCount="indefinite"
            values="M710 252 H783 L778 303 H715 Z;M710 224 H783 L778 303 H715 Z;M710 252 H783 L778 303 H715 Z"
          />
        </path>
        <path d="M747 95 C727 121 728 136 747 146 C766 136 767 121 747 95 Z" fill="#78aeb9">
          <animateTransform
            attributeName="transform"
            dur="3.6s"
            repeatCount="indefinite"
            type="translate"
            values="0 -8;0 12;0 -8"
          />
        </path>
        <text fill="#52766d" fontFamily="sans-serif" fontSize="13" fontWeight="800" x="715" y="333">
          HYDRATION
        </text>
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
          One person rests on a sofa while a friend offers water, reads the written sick-day plan,
          and calls a clinician with the relevant details.
        </desc>
        <rect fill="#f2eee6" height="420" width="900" />
        <rect fill="#d9e7e1" height="135" rx="8" stroke="#9fb5a9" width="185" x="67" y="48" />
        <circle cx="159" cy="105" fill="#edca8c" r="30">
          <animate attributeName="opacity" dur="5s" repeatCount="indefinite" values=".55;.85;.55" />
        </circle>
        <rect fill="#83a18f" height="86" rx="10" width="345" x="118" y="273" />
        <rect fill="#a8c0b3" height="68" rx="9" width="102" x="86" y="248" />
        <path
          d="M130 358 V395 M430 358 V395"
          stroke="#607b6c"
          strokeLinecap="round"
          strokeWidth="12"
        />

        <g>
          <circle cx="285" cy="211" fill="#dca27a" r="30" />
          <path d="M249 210 Q284 154 322 211" fill="#50675f" />
          <path d="M250 299 Q257 242 288 242 Q327 243 361 292" fill="#c87961" />
          <path
            d="M336 277 Q371 289 398 272"
            fill="none"
            stroke="#c87961"
            strokeLinecap="round"
            strokeWidth="12"
          />
          <animateTransform
            attributeName="transform"
            dur="4.8s"
            repeatCount="indefinite"
            type="translate"
            values="0 2;0 -2;0 2"
          />
        </g>

        <g>
          <circle cx="530" cy="203" fill="#d5a079" r="30" />
          <path d="M493 204 Q528 145 569 205" fill="#76513f" />
          <path d="M488 319 Q494 237 530 237 Q566 237 573 319" fill="#719681" />
          <path
            d="M499 273 Q462 276 432 288"
            fill="none"
            stroke="#719681"
            strokeLinecap="round"
            strokeWidth="12"
          >
            <animate
              attributeName="d"
              dur="5s"
              repeatCount="indefinite"
              values="M499 273 Q462 276 432 288;M499 269 Q463 264 432 278;M499 273 Q462 276 432 288"
            />
          </path>
        </g>

        <g>
          <rect fill="#fffaf2" height="116" rx="7" stroke="#b7a58f" width="102" x="562" y="249" />
          <path
            d="M582 278 H644 M582 296 H638 M582 314 H645 M582 332 H624"
            stroke="#9bad9f"
            strokeLinecap="round"
            strokeWidth="5"
          />
          <animate attributeName="opacity" dur="4s" repeatCount="indefinite" values=".68;1;.68" />
        </g>

        <g>
          <rect fill="#405750" height="75" rx="12" width="42" x="714" y="217" />
          <circle cx="735" cy="279" fill="#dce8e1" r="4" />
          <animateTransform
            attributeName="transform"
            dur="4.2s"
            repeatCount="indefinite"
            type="rotate"
            values="-2 735 254;3 735 254;-2 735 254"
          />
        </g>
        <circle cx="735" cy="178" fill="none" r="17" stroke="#c87860" strokeWidth="4">
          <animate attributeName="r" dur="2.6s" repeatCount="indefinite" values="12;28;12" />
          <animate attributeName="opacity" dur="2.6s" repeatCount="indefinite" values="1;0;1" />
        </circle>
        <circle cx="735" cy="178" fill="#ddb08a" r="23" />
        <path d="M707 211 Q735 177 763 211" fill="#7d9da4" />
        <path
          d="M724 177 Q735 187 746 177"
          fill="none"
          stroke="#7c5b4c"
          strokeLinecap="round"
          strokeWidth="3"
        >
          <animate
            attributeName="d"
            dur="3.8s"
            repeatCount="indefinite"
            values="M724 177 Q735 187 746 177;M724 179 Q735 190 746 179;M724 177 Q735 187 746 177"
          />
        </path>
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
          Rain falls directly beneath a cloud outside a window. Indoors, two friends put music on,
          dance, and share a hug. The purpose of connection continues in a different form.
        </desc>
        <rect fill="#f4eee5" height="420" width="900" />
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
        <g>
          <ellipse cx="187" cy="111" fill="#8ba0a4" rx="60" ry="25" />
          <circle cx="152" cy="106" fill="#8ba0a4" r="29" />
          <circle cx="202" cy="93" fill="#8ba0a4" r="36" />
          <circle cx="229" cy="111" fill="#8ba0a4" r="27" />
          <animateTransform
            attributeName="transform"
            dur="6s"
            repeatCount="indefinite"
            type="translate"
            values="-7 0;7 0;-7 0"
          />
        </g>
        {[130, 166, 202, 238].map((x, index) => (
          <line
            key={x}
            stroke="#78a8b1"
            strokeLinecap="round"
            strokeWidth="7"
            x1={x}
            x2={x - 10}
            y1="151"
            y2="192"
          >
            <animate
              attributeName="opacity"
              begin={String(index * 0.3) + "s"}
              dur="2.2s"
              repeatCount="indefinite"
              values=".2;1;.2"
            />
            <animateTransform
              attributeName="transform"
              begin={String(index * 0.3) + "s"}
              dur="2.2s"
              repeatCount="indefinite"
              type="translate"
              values="0 -7;0 14;0 -7"
            />
          </line>
        ))}
        <path d="M89 259 Q185 217 285 258" fill="#afc5b6" />

        <rect fill="#6f8f80" height="86" rx="8" width="94" x="681" y="260" />
        <circle cx="728" cy="302" fill="#f1ddbd" r="24">
          <animate attributeName="r" dur="2.3s" repeatCount="indefinite" values="21;27;21" />
        </circle>
        <path
          d="M703 250 Q728 226 753 250"
          fill="none"
          stroke="#c87860"
          strokeLinecap="round"
          strokeWidth="6"
        >
          <animate
            attributeName="d"
            dur="3.5s"
            repeatCount="indefinite"
            values="M703 250 Q728 226 753 250;M697 246 Q728 214 759 246;M703 250 Q728 226 753 250"
          />
        </path>

        <g>
          <animateTransform
            attributeName="transform"
            dur="3.8s"
            repeatCount="indefinite"
            type="rotate"
            values="-3 471 207;5 471 207;-3 471 207"
          />
          <circle cx="471" cy="164" fill="#dda27a" r="30" />
          <path d="M435 164 Q469 109 508 166" fill="#4f675e" />
          <path d="M427 313 Q434 197 471 197 Q508 197 515 313" fill="#c87961" />
          <path
            d="M445 307 L426 389 M496 307 L520 389"
            stroke="#7d5c4d"
            strokeLinecap="round"
            strokeWidth="12"
          />
          <path
            d="M435 228 Q397 211 378 183"
            fill="none"
            stroke="#c87961"
            strokeLinecap="round"
            strokeWidth="12"
          />
          <path
            d="M507 228 Q545 211 564 184"
            fill="none"
            stroke="#c87961"
            strokeLinecap="round"
            strokeWidth="12"
          />
        </g>
        <g>
          <animateTransform
            attributeName="transform"
            dur="3.8s"
            repeatCount="indefinite"
            type="rotate"
            values="4 592 207;-5 592 207;4 592 207"
          />
          <circle cx="592" cy="164" fill="#d3a078" r="30" />
          <path d="M555 164 Q590 107 630 166" fill="#76513f" />
          <path d="M548 313 Q554 197 592 197 Q630 197 636 313" fill="#709582" />
          <path
            d="M567 307 L549 389 M617 307 L640 389"
            stroke="#4e6a5d"
            strokeLinecap="round"
            strokeWidth="12"
          />
          <path
            d="M556 228 Q536 221 519 213"
            fill="none"
            stroke="#709582"
            strokeLinecap="round"
            strokeWidth="12"
          />
          <path
            d="M628 228 Q653 202 664 174"
            fill="none"
            stroke="#709582"
            strokeLinecap="round"
            strokeWidth="12"
          />
        </g>
        <path
          d="M513 224 Q531 239 549 224"
          fill="none"
          stroke="#e9b48f"
          strokeLinecap="round"
          strokeWidth="8"
        >
          <animate
            attributeName="d"
            dur="3.2s"
            repeatCount="indefinite"
            values="M513 224 Q531 239 549 224;M509 220 Q531 247 553 220;M513 224 Q531 239 549 224"
          />
        </path>
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
