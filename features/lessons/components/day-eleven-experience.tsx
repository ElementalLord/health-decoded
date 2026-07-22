"use client";

import {
  ArrowLeft,
  BookOpen,
  CalendarCheck,
  Check,
  Droplets,
  Eye,
  Footprints,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  evaluateDayElevenAction,
  type DayElevenEvaluationFeedback,
} from "@/features/lessons/actions/day-eleven.actions";
import { completeLessonAction } from "@/features/lessons/actions/lesson-completion.actions";
import { saveLessonPositionAction } from "@/features/lessons/actions/lesson-progress.actions";
import styles from "@/features/lessons/components/day-eleven-experience.module.css";
import { LessonStoryImage } from "@/features/lessons/components/lesson-story-image";
import type { LessonPlayerViewModel } from "@/features/lessons/types/lesson-player";
import { cn } from "@/lib/utils";

const stageCount = 9;

const openingFeelings = [
  ["uneasy", "A little uneasy about the word complications"],
  ["avoiding", "Tempted to avoid this topic for now"],
  ["protective", "Ready to learn what helps protect my future"],
  ["curious", "Curious about what screenings can actually do"],
] as const;

const bodySystems = [
  {
    detail:
      "Tiny blood vessels in the retina can change before your sight feels different. Diabetes eye screening looks for those early changes; it is more specific than a routine vision check for glasses.",
    id: "eyes",
    label: "Eyes",
    note: "Look before vision changes",
    screening: "Ask when diabetes eye screening is right for you.",
    Icon: Eye,
  },
  {
    detail:
      "The kidneys filter the blood. Early kidney changes often do not cause pain or obvious symptoms, which is why blood and urine tests can be useful before anything feels wrong.",
    id: "kidneys",
    label: "Kidneys",
    note: "Listen for quiet changes",
    screening: "Ask about the blood and urine tests your clinician recommends.",
    Icon: Droplets,
  },
  {
    detail:
      "Healthy feet depend on skin, feeling, and blood flow working together. A small blister or pebble can become more important if feeling is reduced, so early attention matters.",
    id: "feet",
    label: "Feet",
    note: "Catch small problems early",
    screening: "Ask what to notice at home and what your foot checks should include.",
    Icon: Footprints,
  },
  {
    detail:
      "Diabetes care also protects the heart and larger blood vessels. Glucose patterns, blood pressure, cholesterol, smoking, movement, nutrition, and prescribed medicines can all be part of the picture.",
    id: "heart",
    label: "Heart and vessels",
    note: "Protect the whole network",
    screening: "Ask how your blood pressure and cholesterol fit your personal care plan.",
    Icon: HeartPulse,
  },
] as const;
type BodySystemId = (typeof bodySystems)[number]["id"];

const abcCards = [
  {
    body: "A longer-view marker that helps you and your care team understand glucose patterns over time.",
    id: "a1c",
    letter: "A",
    title: "A1C",
  },
  {
    body: "The force of blood moving through vessels. It matters because vessel protection is part of diabetes care too.",
    id: "blood_pressure",
    letter: "B",
    title: "Blood pressure",
  },
  {
    body: "Blood fats that help your clinician understand heart and blood-vessel risk as part of the whole picture.",
    id: "cholesterol",
    letter: "C",
    title: "Cholesterol",
  },
] as const;
type AbcId = (typeof abcCards)[number]["id"];

const timelineChecks = [
  { id: "eye", label: "Diabetes eye screening" },
  { id: "kidney", label: "Kidney blood and urine tests" },
  { id: "foot", label: "Foot check" },
] as const;
type TimelineCheckId = (typeof timelineChecks)[number]["id"];

const timelinePurposes = [
  { id: "kidney", label: "Can reveal quiet filtering changes before you feel unwell" },
  { id: "foot", label: "Checks skin, feeling, and blood flow before a small issue grows" },
  { id: "eye", label: "Looks for retinal changes even when vision still feels clear" },
] as const;

const careChecklist = [
  ["a1c", "A1C review", "Understand the longer glucose pattern"],
  ["bp", "Blood pressure check", "Protect blood vessels and the heart"],
  ["cholesterol", "Cholesterol review", "See another part of heart and vessel risk"],
  ["kidney", "Kidney blood and urine tests", "Look for early filtering changes"],
  ["eye", "Diabetes eye screening", "Look beyond how vision feels today"],
  ["foot", "Foot check", "Notice skin, feeling, and blood-flow concerns early"],
  ["medicines", "Medication review", "Check what is working and what is getting in the way"],
  ["questions", "My questions", "Make the visit useful for real life"],
] as const;
type CareCheckId = (typeof careChecklist)[number][0];

const reflections = [
  "Eye screening surprised me because clear vision does not tell the whole story.",
  "Kidney tests surprised me because early changes can be quiet.",
  "Foot checks surprised me because a small issue can be easier to address early.",
  "The ABCs surprised me because glucose is only one part of protection.",
] as const;

const glossary = [
  {
    definition:
      "A health problem that can develop over time. With diabetes, complications are risks, not guarantees, and prevention and early detection can make a meaningful difference.",
    term: "Complication",
  },
  {
    definition:
      "A check designed to look for early changes, sometimes before there are symptoms. Screening creates information and an opportunity to respond.",
    term: "Screening",
  },
  {
    definition:
      "Changes in the light-sensitive tissue at the back of the eye. Diabetes eye screening is designed to look for these changes early.",
    term: "Retinopathy",
  },
  {
    definition:
      "Organs that filter the blood and help remove waste and extra fluid. Blood and urine tests can help your clinician understand how they are working.",
    term: "Kidneys",
  },
  {
    definition:
      "A protein that can be measured in urine. Your care team may use this test as one part of checking kidney health.",
    term: "Albumin",
  },
  {
    definition:
      "A simple check of the skin, circulation, shape, and feeling in the feet. Your clinician can explain which parts are appropriate for you.",
    term: "Foot exam",
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

function Feedback({ feedback }: { feedback: DayElevenEvaluationFeedback }) {
  return (
    <div
      aria-live="polite"
      className={cn(
        styles.feedback,
        feedback.accurate ? styles.feedbackAccurate : styles.feedbackTry,
      )}
      role="status"
    >
      <ShieldCheck aria-hidden="true" />
      <div>
        <p className="font-serif-display text-2xl italic">{feedback.heading}</p>
        <p className="mt-2 leading-7 text-foreground/85">{feedback.body}</p>
      </div>
    </div>
  );
}

function FutureGardenAnimation() {
  return (
    <figure className={styles.motionFigure}>
      <svg
        aria-labelledby="future-garden-title future-garden-desc"
        className={styles.motionCanvas}
        role="img"
        viewBox="0 0 820 430"
      >
        <title id="future-garden-title">A garden growing under a canopy of preventive care</title>
        <desc id="future-garden-desc">
          Gentle roots, leaves, and protective rings move continuously to show that care builds over
          time.
        </desc>
        <defs>
          <linearGradient id="day-eleven-sky" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#173f45" />
            <stop offset="1" stopColor="#2f6c68" />
          </linearGradient>
          <filter id="day-eleven-glow">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>
        <rect fill="url(#day-eleven-sky)" height="430" rx="28" width="820" />
        <circle
          cx="410"
          cy="206"
          fill="#e7c78c"
          filter="url(#day-eleven-glow)"
          opacity="0.2"
          r="104"
        >
          <animate attributeName="r" dur="6s" repeatCount="indefinite" values="92;118;92" />
          <animate
            attributeName="opacity"
            dur="6s"
            repeatCount="indefinite"
            values="0.12;0.28;0.12"
          />
        </circle>
        <path
          d="M95 310 Q250 265 410 310 T725 310"
          fill="none"
          opacity="0.32"
          stroke="#b9d7c5"
          strokeWidth="2"
        >
          <animate
            attributeName="d"
            dur="8s"
            repeatCount="indefinite"
            values="M95 310 Q250 265 410 310 T725 310;M95 310 Q250 280 410 300 T725 310;M95 310 Q250 265 410 310 T725 310"
          />
        </path>
        <g fill="none" stroke="#d8e8d8" strokeLinecap="round">
          <path d="M410 326 C405 270 410 220 410 160" strokeWidth="7" />
          <path d="M410 246 C365 227 336 199 319 165" strokeWidth="5" />
          <path d="M411 224 C457 209 490 178 504 139" strokeWidth="5" />
          <path d="M410 287 C367 284 329 268 302 240" strokeWidth="4" />
          <path d="M411 270 C458 265 499 245 522 217" strokeWidth="4" />
        </g>
        {[
          { begin: "0s", cx: 319, cy: 164, rx: 33, rotate: -38 },
          { begin: "1.2s", cx: 505, cy: 137, rx: 35, rotate: 40 },
          { begin: "2.4s", cx: 299, cy: 239, rx: 29, rotate: -22 },
          { begin: "3.6s", cx: 525, cy: 216, rx: 31, rotate: 27 },
          { begin: "4.8s", cx: 410, cy: 153, rx: 32, rotate: 0 },
        ].map((leaf) => (
          <ellipse
            cx={leaf.cx}
            cy={leaf.cy}
            fill="#a9cfb8"
            key={`${leaf.cx}-${leaf.cy}`}
            opacity="0.72"
            rx={leaf.rx}
            ry="16"
            transform={`rotate(${leaf.rotate} ${leaf.cx} ${leaf.cy})`}
          >
            <animate
              attributeName="opacity"
              begin={leaf.begin}
              dur="6s"
              repeatCount="indefinite"
              values="0.45;0.95;0.45"
            />
          </ellipse>
        ))}
        <g fill="#f7e9c6">
          <circle cx="174" cy="101" r="4">
            <animate attributeName="cy" dur="7s" repeatCount="indefinite" values="101;88;101" />
          </circle>
          <circle cx="653" cy="119" r="5">
            <animate
              attributeName="cy"
              begin="1s"
              dur="8s"
              repeatCount="indefinite"
              values="119;103;119"
            />
          </circle>
          <circle cx="710" cy="208" r="3">
            <animate attributeName="opacity" dur="4s" repeatCount="indefinite" values="0.2;1;0.2" />
          </circle>
        </g>
        <text className={styles.motionEyebrow} textAnchor="middle" x="410" y="376">
          CARE BUILDS PROTECTION OVER TIME
        </text>
      </svg>
      <figcaption className={styles.figureCaption}>
        <strong>Your future is not already written.</strong> Preventive care works like tending a
        living garden: small actions, repeated over time, protect what is growing.
      </figcaption>
    </figure>
  );
}

function ConnectedBodyAnimation() {
  const nodes = [
    { begin: "0s", label: "EYES", x: 410, y: 76 },
    { begin: "1.5s", label: "HEART", x: 562, y: 190 },
    { begin: "3s", label: "KIDNEYS", x: 410, y: 305 },
    { begin: "4.5s", label: "FEET", x: 258, y: 190 },
  ] as const;
  return (
    <figure className={styles.motionFigure}>
      <svg
        aria-labelledby="connected-body-title connected-body-desc"
        className={styles.motionCanvas}
        role="img"
        viewBox="0 0 820 430"
      >
        <title id="connected-body-title">Four body systems connected by flowing vessels</title>
        <desc id="connected-body-desc">
          Soft pulses travel from a central protective heart to the eyes, kidneys, feet, and blood
          vessels.
        </desc>
        <rect fill="#f1f6f2" height="430" rx="28" width="820" />
        <g fill="none" stroke="#8eb2a1" strokeWidth="3">
          <path d="M410 190 C410 145 410 120 410 76" />
          <path d="M410 190 C465 190 510 190 562 190" />
          <path d="M410 190 C410 240 410 267 410 305" />
          <path d="M410 190 C355 190 310 190 258 190" />
        </g>
        <circle cx="410" cy="190" fill="#fffaf2" r="57" stroke="#c98569" strokeWidth="3">
          <animate attributeName="r" dur="3.5s" repeatCount="indefinite" values="52;60;52" />
        </circle>
        <path d="M410 211 C380 190 389 162 410 180 C431 162 440 190 410 211" fill="#c98569">
          <animate
            attributeName="opacity"
            dur="3.5s"
            repeatCount="indefinite"
            values="0.65;1;0.65"
          />
        </path>
        {nodes.map((node) => (
          <g key={node.label}>
            <circle
              cx={node.x}
              cy={node.y}
              fill="#ffffff"
              r="35"
              stroke="#6d9482"
              strokeWidth="2"
            />
            <circle
              cx={node.x}
              cy={node.y}
              fill="none"
              opacity="0"
              r="36"
              stroke="#d6a36d"
              strokeWidth="3"
            >
              <animate
                attributeName="opacity"
                begin={node.begin}
                dur="6s"
                repeatCount="indefinite"
                values="0;0.8;0"
              />
              <animate
                attributeName="r"
                begin={node.begin}
                dur="6s"
                repeatCount="indefinite"
                values="36;49;36"
              />
            </circle>
            <text className={styles.nodeLabel} textAnchor="middle" x={node.x} y={node.y + 5}>
              {node.label}
            </text>
          </g>
        ))}
        <circle fill="#d6a36d" r="6">
          <animateMotion
            dur="6s"
            path="M410 190 C410 145 410 120 410 76 C410 120 410 145 410 190 C465 190 510 190 562 190 C510 190 465 190 410 190 C410 240 410 267 410 305 C410 267 410 240 410 190 C355 190 310 190 258 190 C310 190 355 190 410 190"
            repeatCount="indefinite"
          />
        </circle>
        <text className={styles.motionEyebrowDark} textAnchor="middle" x="410" y="385">
          ONE BODY · MANY OPENINGS TO PROTECT IT
        </text>
      </svg>
      <figcaption className={styles.figureCaption}>
        <strong>The body is a connected network.</strong> Longer-term glucose patterns can affect
        small and large blood vessels, while screenings give each part of the network its own early
        check-in.
      </figcaption>
    </figure>
  );
}

function QuietSignalScannerAnimation() {
  return (
    <figure className={styles.motionFigure}>
      <svg
        aria-labelledby="quiet-signal-title quiet-signal-desc"
        className={styles.motionCanvas}
        role="img"
        viewBox="0 0 820 430"
      >
        <title id="quiet-signal-title">A scanner finding small changes in quiet patterns</title>
        <desc id="quiet-signal-desc">
          A transparent scanning window moves continuously across three calm lines and softly
          highlights small changes before they become obvious.
        </desc>
        <defs>
          <linearGradient id="scanner-surface" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#edf5f0" />
            <stop offset="1" stopColor="#f9f1e5" />
          </linearGradient>
          <linearGradient id="scanner-window" x1="0" x2="1">
            <stop offset="0" stopColor="#fffdf7" stopOpacity="0.18" />
            <stop offset="0.5" stopColor="#fffdf7" stopOpacity="0.86" />
            <stop offset="1" stopColor="#fffdf7" stopOpacity="0.18" />
          </linearGradient>
          <filter id="scanner-glow">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>
        <rect fill="url(#scanner-surface)" height="430" rx="28" width="820" />
        <g fill="none" stroke="#789c8a" strokeLinecap="round" strokeWidth="4">
          <path d="M78 114 H270 C292 114 294 88 316 88 C338 88 340 114 362 114 H742" />
          <path d="M78 210 H408 C430 210 432 238 454 238 C476 238 478 210 500 210 H742" />
          <path d="M78 306 H548 C570 306 572 278 594 278 C616 278 618 306 640 306 H742" />
        </g>
        {[
          { begin: "0s", cx: 316, cy: 88 },
          { begin: "1.7s", cx: 454, cy: 238 },
          { begin: "3.4s", cx: 594, cy: 278 },
        ].map((signal) => (
          <g key={`${signal.cx}-${signal.cy}`}>
            <circle
              cx={signal.cx}
              cy={signal.cy}
              fill="#d0966f"
              filter="url(#scanner-glow)"
              opacity="0.16"
              r="22"
            >
              <animate
                attributeName="opacity"
                begin={signal.begin}
                dur="5.1s"
                repeatCount="indefinite"
                values="0.08;0.34;0.08"
              />
            </circle>
            <circle cx={signal.cx} cy={signal.cy} fill="#c78364" opacity="0.55" r="7">
              <animate
                attributeName="r"
                begin={signal.begin}
                dur="5.1s"
                repeatCount="indefinite"
                values="5;10;5"
              />
              <animate
                attributeName="opacity"
                begin={signal.begin}
                dur="5.1s"
                repeatCount="indefinite"
                values="0.34;1;0.34"
              />
            </circle>
          </g>
        ))}
        <g>
          <rect
            fill="url(#scanner-window)"
            height="286"
            rx="28"
            stroke="#d3a173"
            strokeWidth="2"
            width="112"
            x="74"
            y="54"
          />
          <path
            d="M130 70 V324"
            opacity="0.8"
            stroke="#d3a173"
            strokeDasharray="5 8"
            strokeWidth="2"
          />
          <circle cx="130" cy="360" fill="#315f62" r="10" />
          <animateTransform
            attributeName="transform"
            dur="9s"
            repeatCount="indefinite"
            type="translate"
            values="0 0;560 0;0 0"
          />
        </g>
        <g fill="#789c8a" opacity="0.68">
          <circle cx="370" cy="380" r="5">
            <animate
              attributeName="opacity"
              dur="3s"
              repeatCount="indefinite"
              values="0.35;1;0.35"
            />
          </circle>
          <circle cx="410" cy="380" r="5">
            <animate
              attributeName="opacity"
              begin="1s"
              dur="3s"
              repeatCount="indefinite"
              values="0.35;1;0.35"
            />
          </circle>
          <circle cx="450" cy="380" r="5">
            <animate
              attributeName="opacity"
              begin="2s"
              dur="3s"
              repeatCount="indefinite"
              values="0.35;1;0.35"
            />
          </circle>
        </g>
      </svg>
      <figcaption className={styles.figureCaption}>
        <strong>Screening is a quiet pattern scan, not a warning siren.</strong> It creates a chance
        to notice small changes while there is more time and more room to respond.
      </figcaption>
    </figure>
  );
}

function AbcOrbitAnimation() {
  return (
    <figure className={styles.motionFigure}>
      <svg
        aria-labelledby="abc-orbit-title abc-orbit-desc"
        className={styles.motionCanvas}
        role="img"
        viewBox="0 0 820 430"
      >
        <title id="abc-orbit-title">
          A1C, blood pressure, and cholesterol orbit a protective shield
        </title>
        <desc id="abc-orbit-desc">
          Three labeled lights move continuously around a central shield, showing that protection is
          broader than glucose alone.
        </desc>
        <rect fill="#fbf4e9" height="430" rx="28" width="820" />
        <ellipse
          cx="410"
          cy="190"
          fill="none"
          rx="250"
          ry="116"
          stroke="#d7c8b6"
          strokeDasharray="7 10"
          strokeWidth="2"
        />
        <path
          d="M410 117 L478 143 V206 C478 250 451 284 410 306 C369 284 342 250 342 206 V143 Z"
          fill="#315f62"
        />
        <path
          d="M381 205 L402 226 L445 179"
          fill="none"
          stroke="#f4d89b"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="10"
        />
        <circle cx="410" cy="210" fill="none" opacity="0.2" r="88" stroke="#c98569" strokeWidth="3">
          <animate attributeName="r" dur="5s" repeatCount="indefinite" values="82;101;82" />
          <animate
            attributeName="opacity"
            dur="5s"
            repeatCount="indefinite"
            values="0.12;0.42;0.12"
          />
        </circle>
        {[
          {
            begin: "0s",
            letter: "A",
            path: "M160 190 C160 58 660 58 660 190 C660 322 160 322 160 190",
          },
          {
            begin: "-3.3s",
            letter: "B",
            path: "M160 190 C160 322 660 322 660 190 C660 58 160 58 160 190",
          },
          {
            begin: "-6.6s",
            letter: "C",
            path: "M410 74 C548 74 660 126 660 190 C660 254 548 306 410 306 C272 306 160 254 160 190 C160 126 272 74 410 74",
          },
        ].map((orb) => (
          <g key={orb.letter}>
            <circle fill="#c98569" r="29">
              <animateMotion begin={orb.begin} dur="10s" path={orb.path} repeatCount="indefinite" />
            </circle>
            <text className={styles.orbitLetter} textAnchor="middle" x="0" y="6">
              {orb.letter}
              <animateMotion begin={orb.begin} dur="10s" path={orb.path} repeatCount="indefinite" />
            </text>
          </g>
        ))}
        <text className={styles.motionEyebrowDark} textAnchor="middle" x="410" y="382">
          GLUCOSE IS ONE PART OF A CONNECTED PLAN
        </text>
      </svg>
      <figcaption className={styles.figureCaption}>
        <strong>The ABCs are a protection map, not a report card.</strong> They help you and your
        clinician look at glucose, blood pressure, and cholesterol together, with personal goals
        shaped for you.
      </figcaption>
    </figure>
  );
}

export function DayElevenExperience({ lesson: experience }: { lesson: LessonPlayerViewModel }) {
  const router = useRouter();
  const [stage, setStage] = useState(0);
  const [openingFeeling, setOpeningFeeling] = useState<string | null>(null);
  const [openedSystems, setOpenedSystems] = useState<Set<BodySystemId>>(() => new Set());
  const [activeSystem, setActiveSystem] = useState<BodySystemId | null>(null);
  const [openedAbcs, setOpenedAbcs] = useState<Set<AbcId>>(() => new Set());
  const [activeAbc, setActiveAbc] = useState<AbcId | null>(null);
  const [pendingTimelineCheck, setPendingTimelineCheck] = useState<TimelineCheckId | null>(null);
  const [timelineMatches, setTimelineMatches] = useState<Set<TimelineCheckId>>(() => new Set());
  const [timelineMessage, setTimelineMessage] = useState<string | null>(null);
  const [careChoices, setCareChoices] = useState<Set<CareCheckId>>(() => new Set());
  const [reflection, setReflection] = useState<(typeof reflections)[number] | null>(null);
  const [evaluations, setEvaluations] = useState<
    Partial<Record<"risk" | "silent" | "teachBack", DayElevenEvaluationFeedback>>
  >({});
  const [selectedAnswers, setSelectedAnswers] = useState<
    Partial<Record<"risk" | "silent" | "teachBack", string>>
  >({});
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const stageRef = useRef<HTMLDivElement>(null);
  const storageKey = `health-decoded:day-eleven:${experience.lessonProgressId}`;

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

  async function evaluate(input: unknown, key: "risk" | "silent" | "teachBack", answer: string) {
    setSelectedAnswers((current) => ({ ...current, [key]: answer }));
    const result = await evaluateDayElevenAction(input);
    if (result.ok) setEvaluations((current) => ({ ...current, [key]: result.data }));
    else setMessage(result.message);
  }

  function matchTimelinePurpose(id: TimelineCheckId) {
    if (!pendingTimelineCheck) {
      setTimelineMessage("Choose a preventive check first, then connect it to its purpose.");
      return;
    }
    if (pendingTimelineCheck !== id) {
      setTimelineMessage(
        "Almost. Try the purpose that most directly explains this particular check.",
      );
      return;
    }
    setTimelineMatches((current) => new Set(current).add(id));
    setPendingTimelineCheck(null);
    setTimelineMessage(
      id === "eye"
        ? "Connected: diabetes eye screening can look beyond how vision feels."
        : id === "kidney"
          ? "Connected: blood and urine tests can reveal quiet kidney changes."
          : "Connected: a foot check can catch a small concern while it is still small.",
    );
  }

  function canContinue() {
    if (stage === 0) return openingFeeling !== null;
    if (stage === 1) return Boolean(evaluations.risk);
    if (stage === 2) return openedSystems.size === bodySystems.length;
    if (stage === 3) return Boolean(evaluations.silent);
    if (stage === 4) return openedAbcs.size === abcCards.length;
    if (stage === 5) return timelineMatches.size === timelineChecks.length;
    if (stage === 6) return careChoices.size >= 4;
    if (stage === 7) return reflection !== null && Boolean(evaluations.teachBack);
    return true;
  }

  function stageRequirement() {
    return [
      "Choose how this topic feels as you begin.",
      "Choose what a diabetes diagnosis says about the future.",
      "Open all four parts of the protection map.",
      "Choose why screening can matter without symptoms.",
      "Open A, B, and C to complete the protection orbit.",
      "Match each preventive check with the reason it matters.",
      "Add at least four items to your next-visit checklist.",
      "Choose a reflection and complete the eye-screening rationale.",
    ][stage];
  }

  function continueLabel() {
    return (
      [
        "Begin with possibility, not fear",
        "Explore the connected body",
        "Learn why quiet changes matter",
        "Meet the diabetes ABCs",
        "Match checks to their purpose",
        "Build a care checklist",
        "Make the lesson your own",
        "See your protection map",
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
              <LessonHeading label="Day 11 · Preventing complications without fear">
                Your future deserves a plan, not a fear story.
              </LessonHeading>
              <div className={styles.dayNote}>
                <p className="editorial-number text-accent-warm">11</p>
                <p>
                  Today is not a tour of everything that could go wrong. It is a map of the many
                  places where care can go right.
                </p>
              </div>
            </div>
            <FutureGardenAnimation />
            <div>
              <p className="mb-4 font-serif-display text-2xl">
                How does this topic feel right now?
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
                  Whatever you brought into this lesson is welcome. Complications are risks, not
                  guarantees. Today you will collect practical ways to protect your eyes, kidneys,
                  feet, heart, and peace of mind.
                </p>
              </div>
            ) : null}
          </div>
        );
      case 1:
        return (
          <div className="space-y-9">
            <LessonHeading label="Possibility is not prophecy">
              A risk is something to work with, not a future already decided.
            </LessonHeading>
            <div className={styles.riskEditorial}>
              <div>
                <p className="editorial-eyebrow text-accent-warm">The fear story</p>
                <p>“I have diabetes, so complications are inevitable.”</p>
              </div>
              <div>
                <p className="editorial-eyebrow text-success">The useful truth</p>
                <p>
                  Longer-term patterns shape risk, and steady care can prevent, delay, or reduce
                  harm. There are many points where you and your care team can act.
                </p>
              </div>
            </div>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Think of a bicycle left in the rain. Rust does not appear because of one drop; it
              develops through repeated exposure. Covering it, maintaining it, and checking it early
              all change what happens next. Your body is far more complex, but the useful idea is
              similar: patterns matter, and protection can be layered.
            </p>
            <div className="border-y border-border py-8">
              <p className="font-serif-display text-3xl">
                What does a Type 2 diabetes diagnosis say about the future?
              </p>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {(
                  [
                    [
                      "risk_not_destiny",
                      "It names risks I can understand and work on with support.",
                    ],
                    ["inevitable", "It means complications will eventually happen no matter what."],
                    [
                      "single_high",
                      "One high glucose reading can predict exactly what will happen.",
                    ],
                  ] as const
                ).map(([answer, label]) => (
                  <AnswerChoice
                    key={answer}
                    onClick={() => evaluate({ answer, stage: "risk" }, "risk", answer)}
                    selected={selectedAnswers.risk === answer}
                  >
                    {label}
                  </AnswerChoice>
                ))}
              </div>
            </div>
            {evaluations.risk ? <Feedback feedback={evaluations.risk} /> : null}
          </div>
        );
      case 2:
        return (
          <div className="space-y-9">
            <LessonHeading label="The protection constellation">
              One connected body gives you many openings to protect it.
            </LessonHeading>
            <ConnectedBodyAnimation />
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Open each point on the map. You will see what may change quietly and the preventive
              question that turns knowledge into care.
            </p>
            <div className={styles.systemGrid}>
              {bodySystems.map(({ Icon, detail, id, label, note, screening }) => {
                const opened = openedSystems.has(id);
                const active = activeSystem === id;
                return (
                  <button
                    aria-expanded={active}
                    className={cn(
                      styles.systemCard,
                      opened && styles.systemCardOpened,
                      active && styles.systemCardActive,
                    )}
                    key={id}
                    onClick={() => {
                      setOpenedSystems((current) => new Set(current).add(id));
                      setActiveSystem((current) => (current === id ? null : id));
                    }}
                    type="button"
                  >
                    <span className={styles.systemIcon}>
                      <Icon aria-hidden="true" />
                    </span>
                    <span>
                      <span className="editorial-eyebrow">{note}</span>
                      <strong>{label}</strong>
                    </span>
                    {opened ? (
                      <Check aria-hidden="true" className="ml-auto size-5 text-success" />
                    ) : null}
                    {active ? (
                      <span className={styles.systemDetail}>
                        <span>{detail}</span>
                        <em>{screening}</em>
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-9">
            <LessonHeading label="Quiet does not mean invisible">
              Screening works best before symptoms need to get your attention.
            </LessonHeading>
            <LessonStoryImage
              alt="A patient sits comfortably at a retinal camera while an eye-care clinician explains the exam and a partner offers support"
              caption="A routine eye exam can find small changes before vision feels different, creating more time for protection and follow-up."
              emphasis="Screening looks ahead with care."
              src="/lessons/day-11/eye-care.jpg"
            />
            <QuietSignalScannerAnimation />
            <div className={styles.silentNote}>
              <p className="editorial-eyebrow">Symptoms or no symptoms?</p>
              <p>
                Early eye changes may not blur vision. Early kidney changes may not cause pain. High
                blood pressure often cannot be felt. Feeling well is good, and screening can help
                you stay ahead while you do.
              </p>
            </div>
            <div className="border-y border-border py-8">
              <p className="font-serif-display text-3xl">
                You feel well and your vision seems normal. Why keep preventive screening on the
                care plan?
              </p>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {(
                  [
                    [
                      "screen_before_symptoms",
                      "Some early changes can be found before I notice symptoms.",
                    ],
                    [
                      "wait_for_symptoms",
                      "Screening is only useful after I can feel or see a problem.",
                    ],
                    [
                      "screen_only_if_worse",
                      "Screening matters only when my daily choices have gone badly.",
                    ],
                  ] as const
                ).map(([answer, label]) => (
                  <AnswerChoice
                    key={answer}
                    onClick={() =>
                      evaluate({ answer, stage: "silent_screening" }, "silent", answer)
                    }
                    selected={selectedAnswers.silent === answer}
                  >
                    {label}
                  </AnswerChoice>
                ))}
              </div>
            </div>
            {evaluations.silent ? <Feedback feedback={evaluations.silent} /> : null}
          </div>
        );
      case 4:
        return (
          <div className="space-y-9">
            <LessonHeading label="A wider protection map">
              Glucose matters, and it is not the only number in the room.
            </LessonHeading>
            <AbcOrbitAnimation />
            <div className={styles.abcGrid}>
              {abcCards.map((item) => {
                const active = activeAbc === item.id;
                const opened = openedAbcs.has(item.id);
                return (
                  <button
                    aria-expanded={active}
                    className={cn(styles.abcCard, opened && styles.abcCardOpened)}
                    key={item.id}
                    onClick={() => {
                      setOpenedAbcs((current) => new Set(current).add(item.id));
                      setActiveAbc((current) => (current === item.id ? null : item.id));
                    }}
                    type="button"
                  >
                    <span className={styles.abcLetter}>{item.letter}</span>
                    <span>
                      <strong>{item.title}</strong>
                      {active ? <span className={styles.abcBody}>{item.body}</span> : null}
                    </span>
                    {opened ? (
                      <Check aria-hidden="true" className="ml-auto size-5 text-success" />
                    ) : null}
                  </button>
                );
              })}
            </div>
            <p className={styles.personalNote}>
              <Stethoscope aria-hidden="true" />
              <span>
                The ABCs are not grades, and this lesson does not set personal targets. Your
                clinician can explain what each result means for you and how often it should be
                reviewed.
              </span>
            </p>
          </div>
        );
      case 5:
        return (
          <div className="space-y-9">
            <LessonHeading label="Build the early-warning timeline">
              Connect each check to the quiet change it is designed to notice.
            </LessonHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Choose a preventive check on the left, then choose its purpose on the right. This is
              about why the checks matter; your clinician will personalize when each one is due.
            </p>
            <div className={styles.timelineBoard}>
              <div className="space-y-3">
                <p className="editorial-eyebrow">1 · Choose a check</p>
                {timelineChecks.map((item) => {
                  const matched = timelineMatches.has(item.id);
                  return (
                    <button
                      aria-pressed={pendingTimelineCheck === item.id}
                      className={cn(
                        styles.timelineChoice,
                        pendingTimelineCheck === item.id && styles.timelineChoicePending,
                        matched && styles.timelineChoiceMatched,
                      )}
                      disabled={matched}
                      key={item.id}
                      onClick={() => {
                        setPendingTimelineCheck(item.id);
                        setTimelineMessage(`Now connect “${item.label}” to its purpose.`);
                      }}
                      type="button"
                    >
                      {matched ? (
                        <Check aria-hidden="true" />
                      ) : (
                        <CalendarCheck aria-hidden="true" />
                      )}
                      {item.label}
                    </button>
                  );
                })}
              </div>
              <div className="space-y-3">
                <p className="editorial-eyebrow">2 · Connect its purpose</p>
                {timelinePurposes.map((item) => {
                  const matched = timelineMatches.has(item.id);
                  return (
                    <button
                      className={cn(
                        styles.timelinePurpose,
                        matched && styles.timelinePurposeMatched,
                      )}
                      disabled={matched}
                      key={item.id}
                      onClick={() => matchTimelinePurpose(item.id)}
                      type="button"
                    >
                      <span>{item.label}</span>
                      {matched ? <Check aria-hidden="true" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>
            <p aria-live="polite" className={styles.timelineMessage} role="status">
              {timelineMessage ?? "Three quiet changes. Three chances to notice early."}
            </p>
          </div>
        );
      case 6:
        return (
          <div className="space-y-9">
            <LessonHeading label="Pack your care compass">
              A preventive visit is easier when your questions arrive with you.
            </LessonHeading>
            <LessonStoryImage
              alt="A clinician gently checks a woman's foot during a routine visit while her partner sits close and holds her hand"
              caption="Foot, eye, kidney, blood-pressure, and lab checks create chances to notice change early and respond before it becomes harder."
              emphasis="Regular checks are acts of protection."
              src="/lessons/day-11/preventive-visit.jpg"
            />
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Build a sample checklist for a future care conversation. Choose at least four topics
              you would want to remember. This stays in your browser and is not saved as health
              information.
            </p>
            <div className={styles.checklistGrid}>
              {careChecklist.map(([id, label, purpose]) => {
                const selected = careChoices.has(id);
                return (
                  <button
                    aria-pressed={selected}
                    className={cn(styles.checklistItem, selected && styles.checklistItemSelected)}
                    key={id}
                    onClick={() =>
                      setCareChoices((current) => {
                        const next = new Set(current);
                        if (next.has(id)) next.delete(id);
                        else next.add(id);
                        return next;
                      })
                    }
                    type="button"
                  >
                    <span className={styles.checkBox}>
                      {selected ? <Check aria-hidden="true" /> : null}
                    </span>
                    <span>
                      <strong>{label}</strong>
                      <small>{purpose}</small>
                    </span>
                  </button>
                );
              })}
            </div>
            {careChoices.size >= 4 ? (
              <div className={styles.compassTicket}>
                <ShieldCheck aria-hidden="true" />
                <div>
                  <p className="editorial-eyebrow text-success">Your care conversation</p>
                  <p>
                    “Could we review {careChoices.size} parts of my prevention plan and when each is
                    right for me?”
                  </p>
                  <small>
                    Screening schedules vary by health history, results, medicines, and clinician
                    guidance. Bringing the question is the useful next step.
                  </small>
                </div>
              </div>
            ) : null}
          </div>
        );
      case 7:
        return (
          <div className="space-y-9">
            <LessonHeading label="Turn information into confidence">
              If you can explain the why, you can ask for the care.
            </LessonHeading>
            <div>
              <p className="mb-4 font-serif-display text-2xl">
                Which preventive check surprised you most?
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {reflections.map((item) => (
                  <AnswerChoice
                    key={item}
                    onClick={() => setReflection(item)}
                    selected={reflection === item}
                  >
                    {item}
                  </AnswerChoice>
                ))}
              </div>
            </div>
            <div className={styles.teachBack}>
              <p className="editorial-eyebrow">Eye-screening rationale</p>
              <h2>
                A friend says, “My vision is fine, so why would I need diabetes eye screening?”
              </h2>
              <div className="mt-6 grid gap-3">
                {(
                  [
                    [
                      "find_early_changes",
                      "Because it can find early retinal changes before vision feels different.",
                    ],
                    [
                      "prove_nothing_is_wrong",
                      "Because it can guarantee that nothing is wrong now or in the future.",
                    ],
                    [
                      "replace_daily_care",
                      "Because one screening can replace medicines and everyday care.",
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
            <p className="editorial-eyebrow">Day 11 complete</p>
            <LessonHeading centered>Protection grows wherever care keeps showing up.</LessonHeading>
            <div className={styles.completionShield}>
              <ShieldCheck aria-hidden="true" />
              <p>Risk is not destiny.</p>
              <span>Screen early · Know your ABCs · Bring your questions</span>
            </div>
            <div className="mx-auto max-w-3xl border-y border-border py-9 text-left">
              <p className="editorial-eyebrow text-success">Prevention calendar</p>
              <ol className="mt-6 space-y-6">
                {[
                  "Complications are risks, not guarantees. Steady care can prevent, delay, or reduce harm.",
                  "Feeling well is not a reason to skip screening. Some early changes are quiet, and that makes early checks more useful.",
                  "A1C, blood pressure, cholesterol, eye care, kidney tests, and foot checks are parts of one personalized protection plan.",
                ].map((item, index) => (
                  <li className="grid grid-cols-[3rem_1fr] gap-4 text-lg leading-8" key={item}>
                    <span className="font-serif-display text-4xl text-accent-warm">
                      0{index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="mx-auto grid max-w-3xl gap-6 text-left md:grid-cols-2">
              <div>
                <p className="editorial-eyebrow">Tomorrow</p>
                <h2 className="mt-3 font-serif-display text-3xl">Problem solving for real life</h2>
                <p className="mt-2 leading-7 text-muted-foreground">
                  Use a four-step solver to respond when a real-life situation changes.
                </p>
              </div>
              <div>
                <p className="editorial-eyebrow text-success">What surprised you</p>
                <p className="mt-3 font-serif-display text-2xl">
                  {reflection ?? "You can choose a reflection whenever you are ready."}
                </p>
              </div>
            </div>
            <Button disabled={isPending} fullWidth={false} onClick={finishExperience}>
              {isPending
                ? "Saving your progress…"
                : experience.accessMode === "review"
                  ? "Return to journey"
                  : "Complete Day 11"}
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
            <p className="text-sm font-semibold text-accent-warm">Day 11</p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Preventing Complications Without Fear
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
            label={`Day 11 chapter ${stage + 1} of ${stageCount}`}
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
        title="Leave Day 11 for now?"
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
        title="Day 11 glossary"
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
