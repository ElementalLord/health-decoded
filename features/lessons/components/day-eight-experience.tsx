"use client";

import { ArrowLeft, BookOpen, Check, MessageCircleHeart, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  evaluateDayEightAction,
  type DayEightEvaluationFeedback,
} from "@/features/lessons/actions/day-eight.actions";
import { completeLessonAction } from "@/features/lessons/actions/lesson-completion.actions";
import { saveLessonPositionAction } from "@/features/lessons/actions/lesson-progress.actions";
import styles from "@/features/lessons/components/day-eight-experience.module.css";
import type { LessonPlayerViewModel } from "@/features/lessons/types/lesson-player";
import { cn } from "@/lib/utils";

const stageCount = 9;

const openingFeelings = [
  ["curious", "Curious about what the numbers can teach me"],
  ["nervous", "Nervous that a reading might feel like a grade"],
  ["overloaded", "Overloaded by devices, graphs, and advice"],
  ["unsure", "Unsure whether I need to check at home"],
] as const;

const monitoringTools = [
  {
    body: "A longer view that estimates average glucose across roughly two to three months. It is not today’s reading.",
    id: "a1c",
    label: "A1C",
    question: "What has the longer pattern looked like?",
  },
  {
    body: "A measurement at one specific moment. Timing and context belong beside the number.",
    id: "finger",
    label: "Finger-stick meter",
    question: "What is happening at this moment?",
  },
  {
    body: "Many readings across day and night that can make movement and repeated patterns easier to see.",
    id: "cgm",
    label: "Continuous glucose monitor",
    question: "How is glucose changing across many moments?",
  },
] as const;
type MonitoringToolId = (typeof monitoringTools)[number]["id"];

const contextClues = [
  ["meal", "Food and timing"],
  ["movement", "Movement"],
  ["sleep", "Sleep"],
  ["stress", "Stress"],
  ["illness", "Illness"],
  ["medicine", "Medicine and routine"],
] as const;
type ContextClueId = (typeof contextClues)[number][0];

const clinicianQuestions = [
  "What question would this monitoring plan help us answer?",
  "Which patterns should I bring to our next conversation?",
  "What should I do if a reading surprises me?",
  "How often is this information actually useful for my plan?",
] as const;

const reflections = [
  "A reading can be information without becoming a judgment.",
  "One number is a moment; a pattern has more context.",
  "Different monitoring tools answer different questions.",
  "I can stay curious and bring questions to my care team.",
] as const;

const glossary = [
  {
    definition: "A blood test that estimates average glucose across roughly two to three months.",
    term: "A1C",
  },
  {
    definition: "A small meter that measures a drop of blood at one specific moment.",
    term: "Finger-stick meter",
  },
  {
    definition: "A sensor system that gathers glucose information across many moments.",
    term: "Continuous glucose monitor (CGM)",
  },
  {
    definition:
      "Details around a reading—such as timing, food, movement, sleep, stress, illness, and medicine.",
    term: "Context",
  },
] as const;

function LessonHeading({ children, label }: { children: ReactNode; label?: string }) {
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
        "motion-tactile flex min-h-16 w-full items-start gap-4 rounded-[10px] border bg-card px-5 py-4 text-left leading-7 shadow-card",
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

function Feedback({ feedback }: { feedback: DayEightEvaluationFeedback }) {
  return (
    <div
      aria-live="polite"
      className={cn(
        "animate-slide-up rounded-2xl border p-5 sm:p-7",
        feedback.accurate ? "border-success/30 bg-info" : "border-warning/35 bg-warning/10",
      )}
      role="status"
    >
      <p className={cn("font-serif-display text-2xl italic", feedback.accurate && "text-success")}>
        {feedback.heading}
      </p>
      <p className="mt-2 leading-7 text-foreground/85">{feedback.body}</p>
    </div>
  );
}

function DashboardAnimation() {
  const steps = [
    { detail: "NOTICE", label: "ONE READING", x: 160 },
    { detail: "LOOK BESIDE IT", label: "ADD CONTEXT", x: 410 },
    { detail: "TAKE IT FORWARD", label: "ASK A QUESTION", x: 660 },
  ] as const;

  return (
    <figure className={styles.motionFigure}>
      <svg
        aria-labelledby="dashboard-title dashboard-desc"
        className={styles.motionCanvas}
        role="img"
        viewBox="0 0 820 430"
      >
        <title id="dashboard-title">One reading moves through three useful steps</title>
        <desc id="dashboard-desc">
          A reading token follows a clear rail from noticing one number, to adding context, to
          asking a useful question.
        </desc>
        <rect className={styles.canvasWarm} height="430" rx="54" width="820" />
        <text className={styles.journeyHeading} textAnchor="middle" x="410" y="48">
          FROM NUMBER TO USEFUL CONVERSATION
        </text>
        <path className={styles.dataRail} d="M90 306H730" />
        {steps.map(({ detail, label, x }, index) => (
          <g className={styles.dataStation} key={label} transform={`translate(${x} 145)`}>
            <rect height="142" rx="24" width="202" x="-101" y="-70" />
            <circle cy="-24" r="25" />
            <text className={styles.stationNumber} textAnchor="middle" y="-17">
              {index + 1}
            </text>
            <text className={styles.stationLabel} textAnchor="middle" y="25">
              {label}
            </text>
            <text className={styles.stationDetail} textAnchor="middle" y="50">
              {detail}
            </text>
            <circle className={styles.stationPulse} cy="161" r="18">
              <animate
                attributeName="opacity"
                begin={`${index * 2.2}s`}
                dur="6.6s"
                keyTimes="0;0.12;0.28;1"
                repeatCount="indefinite"
                values="0;0.7;0;0"
              />
              <animate
                attributeName="r"
                begin={`${index * 2.2}s`}
                dur="6.6s"
                keyTimes="0;0.15;0.3;1"
                repeatCount="indefinite"
                values="14;27;34;14"
              />
            </circle>
          </g>
        ))}
        <g className={styles.readingToken}>
          <circle r="23" />
          <text textAnchor="middle" y="6">
            1
          </text>
          <animateMotion dur="6.6s" path="M90 306H730" repeatCount="indefinite" />
        </g>
        <text className={styles.motionCaption} textAnchor="middle" x="410" y="404">
          NOTICE · ADD CONTEXT · ASK WHAT THE PATTERN CAN TEACH
        </text>
      </svg>
      <figcaption className={styles.figureCaption}>
        <strong>A reading is a dashboard glance—not a grade.</strong> It can help answer a question
        about the body without measuring effort, courage, or worth.
      </figcaption>
    </figure>
  );
}

function ToolStudioAnimation() {
  return (
    <figure className={styles.motionFigure}>
      <svg
        aria-labelledby="tool-studio-title tool-studio-desc"
        className={styles.motionCanvas}
        role="img"
        viewBox="0 0 920 500"
      >
        <title id="tool-studio-title">Three monitoring tools create three kinds of view</title>
        <desc id="tool-studio-desc">
          A woven A1C ribbon, a finger-stick camera, and a moving CGM filmstrip loop side by side.
        </desc>
        <rect className={styles.canvasPaper} height="500" rx="54" width="920" />
        <g transform="translate(35 70)">
          <rect className={styles.toolPanel} height="350" rx="28" width="265" />
          <text className={styles.toolTitle} x="28" y="43">
            A1C · LONGER VIEW
          </text>
          {[0, 1, 2].map((row) => (
            <path
              className={styles.loomThread}
              d={`M35 ${116 + row * 47}C90 ${88 + row * 48} 145 ${145 + row * 42} 225 ${106 + row * 49}`}
              key={row}
              pathLength="1"
            >
              <animate
                attributeName="stroke-dashoffset"
                dur={`${4.8 + row * 0.7}s`}
                from="1"
                repeatCount="indefinite"
                to="-1"
              />
            </path>
          ))}
          <g className={styles.a1cSpool} transform="translate(132 272)">
            <circle r="36" />
            <path d="M-20 0H20M0-20V20" />
            <animateTransform
              attributeName="transform"
              additive="sum"
              dur="5s"
              from="0"
              repeatCount="indefinite"
              to="360"
              type="rotate"
            />
          </g>
          <text className={styles.toolAction} textAnchor="middle" x="132" y="330">
            WEAVES MANY WEEKS
          </text>
        </g>
        <g transform="translate(327 70)">
          <rect className={styles.toolPanel} height="350" rx="28" width="265" />
          <text className={styles.toolTitle} x="28" y="43">
            FINGER-STICK · SNAPSHOT
          </text>
          <g transform="translate(55 92)">
            <rect className={styles.cameraBody} height="112" rx="20" width="154" />
            <circle className={styles.cameraLens} cx="77" cy="56" r="34" />
            <g transform="translate(77 56)">
              {[0, 60, 120].map((angle) => (
                <path
                  className={styles.cameraBlade}
                  d="M0 0L8-26A28 28 0 0 1 22-14Z"
                  key={angle}
                  transform={`rotate(${angle})`}
                />
              ))}
              <animateTransform
                attributeName="transform"
                additive="sum"
                dur="4.5s"
                keyTimes="0;0.35;0.5;0.65;1"
                repeatCount="indefinite"
                type="rotate"
                values="0;0;52;0;0"
              />
            </g>
          </g>
          <g className={styles.snapshotCard} transform="translate(66 230)">
            <rect height="72" rx="10" width="132" />
            <path d="M22 48C50 15 77 61 110 28" />
            <animateTransform
              attributeName="transform"
              additive="sum"
              dur="4.5s"
              keyTimes="0;0.45;0.68;0.9;1"
              repeatCount="indefinite"
              type="translate"
              values="0 -38;0 -38;0 0;0 0;0 -38"
            />
            <animate
              attributeName="opacity"
              dur="4.5s"
              keyTimes="0;0.42;0.6;0.9;1"
              repeatCount="indefinite"
              values="0;0;1;1;0"
            />
          </g>
          <text className={styles.toolAction} textAnchor="middle" x="132" y="330">
            CAPTURES ONE MOMENT
          </text>
        </g>
        <g transform="translate(620 70)">
          <rect className={styles.toolPanel} height="350" rx="28" width="265" />
          <text className={styles.toolTitle} x="28" y="43">
            CGM · MOVING VIEW
          </text>
          <clipPath id="day-eight-film-window">
            <rect height="202" rx="18" width="207" x="29" y="78" />
          </clipPath>
          <g clipPath="url(#day-eight-film-window)">
            <g className={styles.filmstrip} transform="translate(36 92)">
              {[0, 1, 2, 3, 4].map((frame) => (
                <g key={frame} transform={`translate(${frame * 72} 0)`}>
                  <rect height="156" rx="8" width="62" />
                  <path
                    d={`M8 ${106 - frame * 8}C23 ${74 + frame * 4} 38 ${126 - frame * 5} 54 ${64 + frame * 6}`}
                  />
                </g>
              ))}
              <animateTransform
                attributeName="transform"
                additive="sum"
                dur="8s"
                from="0 0"
                repeatCount="indefinite"
                to="-144 0"
                type="translate"
              />
            </g>
          </g>
          <text className={styles.toolAction} textAnchor="middle" x="132" y="330">
            SHOWS CHANGE OVER TIME
          </text>
        </g>
        <text className={styles.motionCaption} textAnchor="middle" x="460" y="465">
          THREE TOOLS · THREE DIFFERENT QUESTIONS
        </text>
      </svg>
      <figcaption className={styles.figureCaption}>
        <strong>No tool is a moral ranking.</strong> A clinician chooses the kind of information
        that is useful for an individual treatment plan; not everyone needs home monitoring or a
        CGM.
      </figcaption>
    </figure>
  );
}

function ContextConstellationAnimation({ activeCount }: { activeCount: number }) {
  const contextNodes = [
    { label: "FOOD", x: 132, y: 95 },
    { label: "MOVE", x: 656, y: 95 },
    { label: "SLEEP", x: 94, y: 310 },
    { label: "STRESS", x: 694, y: 310 },
    { label: "ILLNESS", x: 245, y: 380 },
    { label: "MEDICINE", x: 540, y: 380 },
  ] as const;
  const contextPaths = [
    "M174 112C230 126 252 164 292 188",
    "M614 112C568 128 546 164 508 188",
    "M136 294C204 282 245 255 292 246",
    "M652 294C590 282 552 255 508 246",
    "M274 346C310 321 328 302 352 296",
    "M512 346C486 320 468 302 448 296",
  ] as const;
  return (
    <figure className={styles.motionFigure}>
      <svg
        aria-labelledby="context-title context-desc"
        className={styles.motionCanvas}
        role="img"
        viewBox="0 0 800 470"
      >
        <title id="context-title">Context clues gather around one glucose reading</title>
        <desc id="context-desc">
          Six labeled clues send moving threads toward a central reading card, showing that a number
          has context.
        </desc>
        <rect className={styles.canvasSage} height="470" rx="54" width="800" />
        <g className={styles.contextPaths}>
          {contextPaths.map((path, index) => (
            <path
              className={cn(index < activeCount && styles.contextPathActive)}
              d={path}
              key={path}
              pathLength="1"
            >
              <animate
                attributeName="stroke-dashoffset"
                begin={`${index * 0.45}s`}
                dur="5.8s"
                from="1"
                repeatCount="indefinite"
                to="-1"
              />
            </path>
          ))}
        </g>
        {contextNodes.map(({ label, x, y }, index) => (
          <g
            className={cn(styles.contextNode, index < activeCount && styles.contextNodeActive)}
            key={label}
            transform={`translate(${x} ${y})`}
          >
            <circle r="44" />
            <text textAnchor="middle" y="5">
              {label}
            </text>
          </g>
        ))}
        <g className={styles.readingCard} transform="translate(292 154)">
          <rect height="142" rx="26" width="216" />
          <text textAnchor="middle" x="108" y="60">
            ONE READING
          </text>
          <text textAnchor="middle" x="108" y="96">
            + CONTEXT
          </text>
          <animateTransform
            attributeName="transform"
            additive="sum"
            dur="5s"
            keyTimes="0;0.5;1"
            repeatCount="indefinite"
            type="translate"
            values="0 2;0 -4;0 2"
          />
        </g>
        <text className={styles.motionCaption} textAnchor="middle" x="400" y="445">
          A NUMBER BECOMES MORE USEFUL BESIDE ITS CONTEXT
        </text>
      </svg>
      <figcaption className={styles.figureCaption}>
        <strong>Surprises can have many influences.</strong> Context does not explain every reading,
        but it can help you and your care team ask a better question.
      </figcaption>
    </figure>
  );
}

function CareConversationAnimation() {
  return (
    <figure className={styles.careConversation}>
      <svg
        aria-labelledby="care-conversation-title care-conversation-desc"
        className={styles.motionCanvas}
        role="img"
        viewBox="0 0 560 390"
      >
        <title id="care-conversation-title">
          A learner brings a short pattern to a care partner
        </title>
        <desc id="care-conversation-desc">
          A small context note travels from the learner to a shared table. The care partner receives
          it, and a next-step speech bubble appears.
        </desc>
        <rect className={styles.careCanvas} height="390" rx="42" width="560" />
        <path className={styles.sharedTable} d="M86 275H474" />
        <g className={styles.carePerson} transform="translate(108 151)">
          <circle cy="-56" r="37" />
          <path d="M-44 56V0C-44 -24 44 -24 44 0V56" />
          <path className={styles.careArm} d="M28 4C54 18 68 35 84 48">
            <animate
              attributeName="d"
              dur="7s"
              keyTimes="0;0.28;0.5;0.72;1"
              repeatCount="indefinite"
              values="M28 4C54 18 68 35 84 48;M28 4C54 18 68 35 84 48;M28 4C65 4 84 15 103 25;M28 4C54 18 68 35 84 48;M28 4C54 18 68 35 84 48"
            />
          </path>
        </g>
        <g className={styles.carePersonPartner} transform="translate(452 151)">
          <circle cy="-56" r="37" />
          <path d="M-44 56V0C-44 -24 44 -24 44 0V56" />
          <path className={styles.careArm} d="M-28 4C-54 18 -68 35 -84 48">
            <animate
              attributeName="d"
              begin="0.9s"
              dur="7s"
              keyTimes="0;0.28;0.5;0.72;1"
              repeatCount="indefinite"
              values="M-28 4C-54 18 -68 35 -84 48;M-28 4C-54 18 -68 35 -84 48;M-28 4C-65 4 -84 15 -103 25;M-28 4C-54 18 -68 35 -84 48;M-28 4C-54 18 -68 35 -84 48"
            />
          </path>
        </g>
        <g className={styles.contextNote} transform="translate(154 216)">
          <rect height="88" rx="12" width="122" x="-61" y="-44" />
          <path d="M-39 -20H38M-39 0H28M-39 20H42" />
          <circle cx="-46" cy="-20" r="5" />
          <circle cx="-46" cy="0" r="5" />
          <circle cx="-46" cy="20" r="5" />
          <animateTransform
            attributeName="transform"
            additive="sum"
            dur="7s"
            keyTimes="0;0.25;0.55;0.76;1"
            repeatCount="indefinite"
            type="translate"
            values="0 0;0 0;126 -8;126 -8;0 0"
          />
        </g>
        <g className={styles.nextStepBubble} transform="translate(383 70)">
          <path d="M-92 -38H72C88 -38 98 -28 98 -12V22C98 38 88 48 72 48H10L-8 66L-2 48H-92C-108 48 -118 38 -118 22V-12C-118 -28 -108 -38 -92 -38Z" />
          <text textAnchor="middle" x="-10" y="0">
            WHAT CHANGED?
          </text>
          <text textAnchor="middle" x="-10" y="23">
            WHAT NEXT?
          </text>
          <animate
            attributeName="opacity"
            dur="7s"
            keyTimes="0;0.42;0.58;0.84;1"
            repeatCount="indefinite"
            values="0;0;1;1;0"
          />
          <animateTransform
            attributeName="transform"
            additive="sum"
            dur="7s"
            keyTimes="0;0.42;0.58;0.84;1"
            repeatCount="indefinite"
            type="translate"
            values="0 8;0 8;0 0;0 0;0 8"
          />
        </g>
        <text className={styles.careRole} textAnchor="middle" x="108" y="330">
          YOU
        </text>
        <text className={styles.careRole} textAnchor="middle" x="452" y="330">
          CARE PARTNER
        </text>
        <text className={styles.careCaption} textAnchor="middle" x="280" y="365">
          A SHORT PATTERN MAKES THE NEXT CONVERSATION MORE CONCRETE
        </text>
      </svg>
      <figcaption>
        <strong>Here is the use:</strong> a few repeated moments plus context give you and your care
        team something specific to discuss—without turning the data into a grade.
      </figcaption>
    </figure>
  );
}

function PatternLoomAnimation() {
  const paths = [
    "M70 110C180 48 280 160 390 98S610 72 750 120",
    "M70 205C190 150 280 255 400 194S620 160 750 215",
    "M70 300C185 238 305 355 415 292S620 265 750 315",
  ];
  return (
    <figure className={styles.motionFigure}>
      <svg
        aria-labelledby="pattern-title pattern-desc"
        className={styles.motionCanvas}
        role="img"
        viewBox="0 0 820 440"
      >
        <title id="pattern-title">Reading beads weave into a longer pattern</title>
        <desc id="pattern-desc">
          Individual beads travel along three threads and reveal a woven ribbon, showing that
          patterns carry more context than one dot.
        </desc>
        <rect className={styles.canvasPaper} height="440" rx="54" width="820" />
        <g className={styles.loomFrame}>
          <path d="M48 55V352M772 55V352" />
          {[94, 190, 286].map((y) => (
            <path d={`M48 ${y}H772`} key={y} />
          ))}
        </g>
        {paths.map((path, row) => (
          <g key={path}>
            <path className={styles.patternThread} d={path} pathLength="1">
              <animate
                attributeName="stroke-dashoffset"
                dur={`${7 + row}s`}
                from="1"
                repeatCount="indefinite"
                to="-1"
              />
            </path>
            {[0, 1, 2].map((bead) => (
              <circle className={styles.patternBead} key={bead} r="11">
                <animateMotion
                  begin={`${bead * 1.8 + row * 0.55}s`}
                  calcMode="linear"
                  dur="7s"
                  path={path}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  begin={`${bead * 1.8 + row * 0.55}s`}
                  dur="7s"
                  keyTimes="0;0.08;0.9;1"
                  repeatCount="indefinite"
                  values="0;1;1;0"
                />
              </circle>
            ))}
          </g>
        ))}
        <g className={styles.singleBead} transform="translate(410 388)">
          <circle r="12" />
          <text x="28" y="6">
            ONE MOMENT
          </text>
          <animateTransform
            attributeName="transform"
            additive="sum"
            dur="4s"
            keyTimes="0;0.5;1"
            repeatCount="indefinite"
            type="translate"
            values="-8 0;8 0;-8 0"
          />
        </g>
        <text className={styles.motionCaption} textAnchor="middle" x="410" y="420">
          MOMENTS REPEAT · A PATTERN EMERGES · A QUESTION GETS CLEARER
        </text>
      </svg>
      <figcaption className={styles.figureCaption}>
        <strong>A pattern is not perfection.</strong> Repeated context can help reveal a useful
        story; one unusual day remains one thread in a much larger fabric.
      </figcaption>
    </figure>
  );
}

export function DayEightExperience({ lesson: experience }: { lesson: LessonPlayerViewModel }) {
  const router = useRouter();
  const [stage, setStage] = useState(0);
  const [openingFeeling, setOpeningFeeling] = useState<string | null>(null);
  const [toolsOpened, setToolsOpened] = useState<Set<MonitoringToolId>>(() => new Set());
  const [activeTool, setActiveTool] = useState<MonitoringToolId | null>(null);
  const [snapshotMeaning, setSnapshotMeaning] = useState<string | null>(null);
  const [contextsOpened, setContextsOpened] = useState<Set<ContextClueId>>(() => new Set());
  const [patternMoments, setPatternMoments] = useState<Set<string>>(() => new Set());
  const [question, setQuestion] = useState<(typeof clinicianQuestions)[number] | null>(null);
  const [reflection, setReflection] = useState<(typeof reflections)[number] | null>(null);
  const [evaluations, setEvaluations] = useState<
    Partial<Record<"pattern" | "surprise" | "teachBack", DayEightEvaluationFeedback>>
  >({});
  const [selectedAnswers, setSelectedAnswers] = useState<
    Partial<Record<"pattern" | "surprise" | "teachBack", string>>
  >({});
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const stageRef = useRef<HTMLDivElement>(null);
  const storageKey = `health-decoded:day-eight:${experience.lessonProgressId}`;

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
    key: "pattern" | "surprise" | "teachBack",
    answer: string,
  ) {
    setSelectedAnswers((current) => ({ ...current, [key]: answer }));
    const result = await evaluateDayEightAction(input);
    if (result.ok) setEvaluations((current) => ({ ...current, [key]: result.data }));
    else setMessage(result.message);
  }

  function canContinue() {
    if (stage === 0) return openingFeeling !== null;
    if (stage === 1) return toolsOpened.size === monitoringTools.length;
    if (stage === 2) return snapshotMeaning !== null;
    if (stage === 3) return contextsOpened.size >= 4;
    if (stage === 4) return patternMoments.size >= 3 && Boolean(evaluations.pattern);
    if (stage === 5) return Boolean(evaluations.surprise);
    if (stage === 6) return question !== null;
    if (stage === 7) return reflection !== null && Boolean(evaluations.teachBack);
    return true;
  }

  function stageRequirement() {
    return [
      "Choose how monitoring feels to you today.",
      "Open A1C, finger-stick, and CGM.",
      "Choose what a snapshot can—and cannot—tell you.",
      "Open at least four context clues.",
      "Add three moments to the pattern and answer the pattern check.",
      "Choose the curious response to a surprising reading.",
      "Choose one question to carry to your care team.",
      "Choose one reflection and complete the teach-back.",
    ][stage];
  }

  function continueLabel() {
    return (
      [
        "Meet the three tools",
        "Turn a number into a moment",
        "Place context beside it",
        "Look for a pattern",
        "Respond without judgment",
        "Make monitoring a conversation",
        "Carry the perspective forward",
        "See today’s takeaway",
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
      router.push(result.data.nextRoute ?? "/journey");
    });
  }

  function renderStage() {
    switch (stage) {
      case 0:
        return (
          <div className="space-y-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_17rem] lg:items-end">
              <LessonHeading label="Day 08 · Understanding your blood sugar data">
                A number can inform you without defining you.
              </LessonHeading>
              <div className="border-l-2 border-accent-warm pl-6">
                <p className="editorial-number text-accent-warm">08</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Today is not about memorizing targets. It is about learning what different views
                  can—and cannot—tell you.
                </p>
              </div>
            </div>
            <DashboardAnimation />
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
              <p className="animate-slide-up border-l-2 border-success bg-info p-5 text-lg leading-8">
                You do not need to earn a “good” number here. We will practice reading information
                with context, curiosity, and support.
              </p>
            ) : null}
          </div>
        );
      case 1:
        return (
          <div className="space-y-9">
            <LessonHeading label="Three windows, not one ranking">
              Each monitoring tool answers a different question.
            </LessonHeading>
            <ToolStudioAnimation />
            <div className="grid gap-4 md:grid-cols-3">
              {monitoringTools.map((tool) => {
                const opened = toolsOpened.has(tool.id);
                return (
                  <button
                    aria-pressed={opened}
                    className={cn(styles.toolCard, opened && styles.toolCardOpen)}
                    key={tool.id}
                    onClick={() => {
                      setToolsOpened((current) => new Set([...current, tool.id]));
                      setActiveTool(tool.id);
                    }}
                    type="button"
                  >
                    <span>{opened ? "EXPLORED" : "OPEN THE WINDOW"}</span>
                    <h2>{tool.label}</h2>
                    <strong>{tool.question}</strong>
                    <p>{opened ? tool.body : "Tap to see what this tool can show."}</p>
                  </button>
                );
              })}
            </div>
            {activeTool ? (
              <p className="border-l-2 border-success bg-info p-5 leading-7">
                {monitoringTools.find((tool) => tool.id === activeTool)?.body}
              </p>
            ) : null}
          </div>
        );
      case 2:
        return (
          <div className="space-y-9">
            <LessonHeading label="A photograph is honest—and incomplete">
              One reading belongs to one moment.
            </LessonHeading>
            <div className={styles.snapshotStage}>
              <div className={styles.snapshotFrame}>
                <span>THIS MOMENT</span>
                <i />
                <b />
              </div>
              <div>
                <p className="font-serif-display text-3xl">A snapshot can tell you…</p>
                <p className="mt-3 text-lg leading-8 text-muted-foreground">
                  what the device measured at that time. It cannot replay yesterday, predict
                  tomorrow, or assign a grade to the person holding it.
                </p>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {(
                [
                  ["moment", "It describes one measured moment."],
                  ["month", "It explains the whole month."],
                  ["worth", "It measures how hard someone tried."],
                ] as const
              ).map(([id, label]) => (
                <AnswerChoice
                  key={id}
                  onClick={() => setSnapshotMeaning(id)}
                  selected={snapshotMeaning === id}
                >
                  {label}
                </AnswerChoice>
              ))}
            </div>
            {snapshotMeaning ? (
              <p
                className={cn(
                  "border-l-2 p-5 leading-7",
                  snapshotMeaning === "moment"
                    ? "border-success bg-info"
                    : "border-warning bg-warning/10",
                )}
              >
                {snapshotMeaning === "moment"
                  ? "Exactly. Keep the moment, then place timing and context beside it."
                  : "A single reading cannot explain a month or measure effort. Let it remain one useful, limited moment."}
              </p>
            ) : null}
          </div>
        );
      case 3:
        return (
          <div className="space-y-9">
            <LessonHeading label="Build the context constellation">
              A number becomes more useful beside its clues.
            </LessonHeading>
            <ContextConstellationAnimation activeCount={contextsOpened.size} />
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Tap the influences that can belong in a monitoring conversation. You are gathering
              context—not trying to prove the cause of one reading.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {contextClues.map(([id, label]) => {
                const opened = contextsOpened.has(id);
                return (
                  <button
                    aria-pressed={opened}
                    className={cn(styles.contextButton, opened && styles.contextButtonOpen)}
                    key={id}
                    onClick={() => setContextsOpened((current) => new Set([...current, id]))}
                    type="button"
                  >
                    <Search aria-hidden="true" className="size-5" />
                    <span>{label}</span>
                    {opened ? <Check aria-hidden="true" className="size-4" /> : null}
                  </button>
                );
              })}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-9">
            <LessonHeading label="Pattern detective">
              One dot is a clue. Repetition gives it company.
            </LessonHeading>
            <PatternLoomAnimation />
            <div className="grid gap-3 sm:grid-cols-3">
              {(
                [
                  ["morning", "A morning moment"],
                  ["meal", "A meal-time moment"],
                  ["movement", "A movement moment"],
                  ["sleep", "A sleep context"],
                  ["stress", "A stressful day"],
                  ["ordinary", "An ordinary day"],
                ] as const
              ).map(([id, label]) => {
                const selected = patternMoments.has(id);
                return (
                  <button
                    aria-pressed={selected}
                    className={cn(styles.patternChip, selected && styles.patternChipSelected)}
                    key={id}
                    onClick={() => {
                      setPatternMoments((current) => {
                        const next = new Set(current);
                        if (next.has(id)) next.delete(id);
                        else next.add(id);
                        return next;
                      });
                    }}
                    type="button"
                  >
                    <Sparkles aria-hidden="true" className="size-4" /> {label}
                  </button>
                );
              })}
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {(
                [
                  ["pattern", "Repeated context across several moments"],
                  ["single_reading", "One isolated reading"],
                  ["perfect_number", "A perfectly flat line"],
                ] as const
              ).map(([answer, label]) => (
                <AnswerChoice
                  key={answer}
                  onClick={() => evaluate({ answer, stage: "pattern" }, "pattern", answer)}
                  selected={selectedAnswers.pattern === answer}
                >
                  {label}
                </AnswerChoice>
              ))}
            </div>
            {evaluations.pattern ? <Feedback feedback={evaluations.pattern} /> : null}
          </div>
        );
      case 5:
        return (
          <div className="space-y-9">
            <LessonHeading label="When a number surprises you">
              Replace “What did I do wrong?” with a better question.
            </LessonHeading>
            <div className={styles.reframeScene}>
              <div className={styles.reframePair} aria-hidden="true">
                <div className={styles.reframePerson}>
                  <span />
                  <i />
                  <b />
                </div>
                <div className={styles.reframeNumber}>
                  <span>?</span>
                  <i />
                </div>
              </div>
              <div className={styles.reframeRibbon}>
                <strong>LOOK BESIDE THE NUMBER</strong>
                <span>food · movement · sleep · stress · illness · medicine</span>
              </div>
            </div>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Food is only one influence. Movement, sleep, stress, illness, medicine, timing, and
              routine can all belong in the story. General education cannot tell you to change a
              personal treatment plan.
            </p>
            <div className="grid gap-3 md:grid-cols-3">
              {(
                [
                  ["curiosity", "Record the context and become curious."],
                  ["self_blame", "Treat the reading as proof of failure."],
                  ["change_treatment", "Change medicine or dosing on your own."],
                ] as const
              ).map(([answer, label]) => (
                <AnswerChoice
                  key={answer}
                  onClick={() => evaluate({ answer, stage: "surprise" }, "surprise", answer)}
                  selected={selectedAnswers.surprise === answer}
                >
                  {label}
                </AnswerChoice>
              ))}
            </div>
            {evaluations.surprise ? <Feedback feedback={evaluations.surprise} /> : null}
          </div>
        );
      case 6:
        return (
          <div className="space-y-9">
            <LessonHeading label="Monitoring is a conversation">
              Data becomes useful when it can support a question.
            </LessonHeading>
            <div className="grid gap-7 lg:grid-cols-[0.82fr_1.18fr] lg:items-stretch">
              <CareConversationAnimation />
              <div className="grid gap-3">
                {clinicianQuestions.map((item) => (
                  <AnswerChoice
                    key={item}
                    onClick={() => setQuestion(item)}
                    selected={question === item}
                  >
                    {item}
                  </AnswerChoice>
                ))}
              </div>
            </div>
            {question ? (
              <div className={styles.questionTicket}>
                <MessageCircleHeart aria-hidden="true" />
                <div>
                  <p className="editorial-eyebrow text-success">One question to carry</p>
                  <p>{question}</p>
                </div>
              </div>
            ) : null}
          </div>
        );
      case 7:
        return (
          <div className="space-y-9">
            <LessonHeading label="Teach it back gently">
              The tools describe glucose. They do not describe you.
            </LessonHeading>
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
            <div className="border-y border-border py-8">
              <p className="font-serif-display text-3xl">
                Which explanation keeps all three tools in focus?
              </p>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {(
                  [
                    [
                      "different_questions",
                      "A1C, a finger-stick, and a CGM answer different kinds of questions.",
                    ],
                    ["cgm_for_everyone", "Everyone with Type 2 diabetes needs a CGM."],
                    ["a1c_right_now", "A1C tells you what is happening right now."],
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
            <p className="editorial-eyebrow">Day 8 complete</p>
            <LessonHeading>A reading is information—not a verdict.</LessonHeading>
            <div className="mx-auto max-w-3xl border-y border-border py-9 text-left">
              <p className="editorial-eyebrow text-success">Three ideas worth carrying</p>
              <ol className="mt-6 space-y-6">
                {[
                  "A1C offers a longer view, a finger-stick captures one moment, and a CGM can show change across many moments.",
                  "One reading is a clue. Repeated context can reveal a more useful pattern.",
                  "Numbers measure glucose—not effort, courage, or worth. Surprises belong with curiosity and the care team’s plan.",
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
                <h2 className="mt-3 font-serif-display text-3xl">
                  Recognizing high and low glucose
                </h2>
                <p className="mt-2 leading-7 text-muted-foreground">
                  Learn the safety signals and when to use the action plan your care team gives you.
                </p>
              </div>
              <div>
                <p className="editorial-eyebrow text-success">Your question</p>
                <p className="mt-3 font-serif-display text-2xl">
                  {question ?? "You can choose one whenever you are ready."}
                </p>
              </div>
            </div>
            <Button disabled={isPending} fullWidth={false} onClick={finishExperience}>
              {experience.accessMode === "review" ? "Return to journey" : "Complete Day 8"}
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
            <p className="text-sm font-semibold text-accent-warm">Day 8</p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Understanding Your Blood Sugar Data
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
            label={`Day 8 chapter ${stage + 1} of ${stageCount}`}
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
        title="Leave Day 8 for now?"
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
        title="Day 8 glossary"
      >
        <div className="max-h-[60dvh] space-y-5 overflow-y-auto pr-2">
          {glossary.map((entry) => (
            <section key={entry.term}>
              <h2 className="font-serif-display text-xl font-semibold">{entry.term}</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{entry.definition}</p>
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
