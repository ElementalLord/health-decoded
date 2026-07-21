"use client";

import { ArrowLeft, BookOpen, Check, Home, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  evaluateDayTenAction,
  type DayTenEvaluationFeedback,
} from "@/features/lessons/actions/day-ten.actions";
import { completeLessonAction } from "@/features/lessons/actions/lesson-completion.actions";
import { saveLessonPositionAction } from "@/features/lessons/actions/lesson-progress.actions";
import styles from "@/features/lessons/components/day-ten-experience.module.css";
import type { LessonPlayerViewModel } from "@/features/lessons/types/lesson-player";
import { cn } from "@/lib/utils";

const stageCount = 9;

const openingFeelings = [
  ["overwhelmed", "Overwhelmed, there is so much to remember every day"],
  ["tired", "Tired of deciding the same things over and over"],
  ["hopeful", "Hopeful that this can start to feel automatic"],
  ["curious", "Curious how small habits actually add up"],
] as const;

const dailyDecisions = [
  {
    body: "A fixed time and place answers this for you, so the doubt never gets to start.",
    id: "already",
    label: "“Wait, did I already do that today?”",
  },
  {
    body: "A step you decided on in advance doesn’t wait for a mood that may not arrive.",
    id: "feel",
    label: "“Do I feel like it right now?”",
  },
  {
    body: "By evening, willpower runs thin. A routine spends none of it.",
    id: "tired",
    label: "“Can I face one more choice today?”",
  },
  {
    body: "A thing with a home doesn’t need to be searched for every single morning.",
    id: "where",
    label: "“Now where did I put that?”",
  },
  {
    body: "Each open question is a tiny tax. A routine quietly closes the loop for you.",
    id: "worth",
    label: "“Is this really worth deciding again?”",
  },
  {
    body: "A planned pause is far easier to keep than a good intention made on the spot.",
    id: "later",
    label: "“Eh, maybe I’ll get to it later…”",
  },
] as const;
type DailyDecisionId = (typeof dailyDecisions)[number]["id"];

const habitAnchors = [
  "After I brush my teeth",
  "After breakfast",
  "After dinner",
  "Before I get into bed",
] as const;

const habitAdditions = [
  "I’ll take my medication, as prescribed",
  "I’ll stretch for two slow minutes",
  "I’ll jot down tomorrow’s one small step",
  "I’ll lay out what I need for the morning",
] as const;

const environmentSupports = [
  ["fruit", "A fruit bowl on the counter, treats in a cupboard"],
  ["shoes", "Walking shoes near the door"],
  ["water", "A water bottle filled and within reach"],
  ["mirror", "A gentle note on the bathroom mirror"],
  ["organizer", "A weekly pill organizer, if recommended"],
] as const;
type EnvironmentSupportId = (typeof environmentSupports)[number][0];

const starterRoutines = [
  ["walk", "A five-minute walk after dinner"],
  ["swap", "Swapping one sugary drink for water"],
  ["prep", "Packing lunch the night before"],
  ["winddown", "A steady wind-down time at night"],
] as const;

const visibleReminders = [
  ["phone", "A phone reminder"],
  ["fridge", "A note on the fridge"],
  ["calendar", "A calendar checkmark ritual"],
  ["placement", "Placing things where I’ll see them"],
] as const;

const reflections = [
  "Small habits, repeated kindly, quietly become who I am.",
  "A routine is a decision I only have to make once.",
  "Progress is measured in weeks, not perfect days.",
  "My routine should fit my life, not someone else’s.",
] as const;

const glossary = [
  {
    definition:
      "A small set of repeated actions that happen at roughly the same time or place each day, so healthy choices need less thought and less willpower.",
    term: "Routine",
  },
  {
    definition:
      "The mental tiredness that builds as the day’s decisions pile up. Routines protect against it by answering common questions once, in advance.",
    term: "Decision fatigue",
  },
  {
    definition:
      "Attaching a new habit to something you already do every day (“after I brush my teeth, I take my medication”) so the old habit reminds you of the new one.",
    term: "Habit stacking",
  },
  {
    definition:
      "Placing helpful things where you will see them (fruit on the counter, shoes by the door, a note on the fridge) so the healthy choice becomes the easy choice.",
    term: "Visible reminder",
  },
  {
    definition:
      "Returning to your habits again and again over weeks, including after interruptions. It matters far more than any single perfect day.",
    term: "Consistency",
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

function Feedback({ feedback }: { feedback: DayTenEvaluationFeedback }) {
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

function DayRhythmAnimation() {
  const anchors = [
    { begin: "1s", label: "MORNING", x: 140 },
    { begin: "5.5s", label: "MIDDAY", x: 352 },
    { begin: "10s", label: "EVENING", x: 564 },
  ] as const;

  return (
    <figure className={styles.motionFigure}>
      <svg
        aria-labelledby="day-rhythm-title day-rhythm-desc"
        className={styles.motionCanvas}
        role="img"
        viewBox="0 0 820 452"
      >
        <title id="day-rhythm-title">A gentle sun crosses a day held by three anchors</title>
        <desc id="day-rhythm-desc">
          A soft sun drifts along a day arc while three routine anchors, morning, midday, and
          evening, glow in turn beneath it.
        </desc>
        <rect className={styles.canvasWarm} height="452" rx="54" width="820" />
        <text className={styles.sceneHeading} textAnchor="middle" x="410" y="46">
          A DAY WITH GENTLE ANCHORS
        </text>
        <g transform="translate(58 82)">
          <rect className={styles.scenePanel} height="286" rx="28" width="704" />
          <ellipse className={styles.softCloud} cx="196" cy="104" rx="30" ry="12">
            <animateTransform
              attributeName="transform"
              additive="sum"
              dur="13s"
              keyTimes="0;0.5;1"
              repeatCount="indefinite"
              type="translate"
              values="-22 0;22 0;-22 0"
            />
          </ellipse>
          <ellipse className={styles.softCloud} cx="540" cy="74" rx="38" ry="15">
            <animateTransform
              attributeName="transform"
              additive="sum"
              dur="9s"
              keyTimes="0;0.5;1"
              repeatCount="indefinite"
              type="translate"
              values="-16 0;16 0;-16 0"
            />
          </ellipse>
          <path className={styles.skyArc} d="M60 178Q352 34 644 178" />
          <g opacity="0">
            <circle className={styles.sunHalo} r="24">
              <animate
                attributeName="r"
                dur="4.5s"
                keyTimes="0;0.5;1"
                repeatCount="indefinite"
                values="22;28;22"
              />
            </circle>
            <circle className={styles.sunOrb} r="15" />
            <animateMotion dur="14s" path="M60 178Q352 34 644 178" repeatCount="indefinite" />
            <animate
              attributeName="opacity"
              dur="14s"
              keyTimes="0;0.05;0.95;1"
              repeatCount="indefinite"
              values="0;1;1;0"
            />
          </g>
          {anchors.map(({ begin, label, x }) => (
            <g key={label} transform={`translate(${x} 214)`}>
              <circle className={styles.anchorHalo} opacity="0" r="26">
                <animate
                  attributeName="opacity"
                  begin={begin}
                  dur="14s"
                  keyTimes="0;0.06;0.18;1"
                  repeatCount="indefinite"
                  values="0;0.7;0;0"
                />
                <animate
                  attributeName="r"
                  begin={begin}
                  dur="14s"
                  keyTimes="0;0.08;0.2;1"
                  repeatCount="indefinite"
                  values="22;34;38;22"
                />
              </circle>
              <circle className={styles.anchorNode} r="19" />
              <text className={styles.anchorLabel} textAnchor="middle" y="44">
                {label}
              </text>
            </g>
          ))}
        </g>
        <text className={styles.motionCaption} textAnchor="middle" x="410" y="420">
          ROUTINES CARRY THE DAY SO MEMORY DOESN’T HAVE TO
        </text>
      </svg>
      <figcaption className={styles.figureCaption}>
        <strong>You don’t have to hold it all in your head.</strong> A few gentle anchors, morning,
        midday, evening, quietly carry the remembering for you, the way brushing your teeth needs no
        debate.
      </figcaption>
    </figure>
  );
}

function DecisionLanternAnimation() {
  return (
    <figure className={styles.motionFigure}>
      <svg
        aria-labelledby="decision-lantern-title decision-lantern-desc"
        className={styles.motionCanvas}
        role="img"
        viewBox="0 0 880 470"
      >
        <title id="decision-lantern-title">Routines keep the day’s lantern burning steady</title>
        <desc id="decision-lantern-desc">
          On one side, question bubbles drift up all day and a lantern flame dims; on the other,
          routines answer once and the flame stays steady.
        </desc>
        <rect className={styles.canvasPaper} height="470" rx="54" width="880" />
        <text className={styles.sceneHeading} textAnchor="middle" x="440" y="48">
          FEWER DECISIONS · MORE CALM
        </text>
        <g transform="translate(60 96)">
          <rect className={styles.scenePanel} height="300" rx="28" width="360" />
          <text className={styles.panelTitle} textAnchor="middle" x="180" y="40">
            A DAY OF OPEN QUESTIONS
          </text>
          {[100, 180, 260].map((x, index) => (
            <g key={x} opacity="0" transform={`translate(${x} 226)`}>
              <circle className={styles.questionBubble} r="16" />
              <text className={styles.questionMark} textAnchor="middle" y="5">
                ?
              </text>
              <animateTransform
                attributeName="transform"
                additive="sum"
                begin={`${index * 1.4}s`}
                dur="4.2s"
                repeatCount="indefinite"
                type="translate"
                values="0 0;0 -132"
              />
              <animate
                attributeName="opacity"
                begin={`${index * 1.4}s`}
                dur="4.2s"
                keyTimes="0;0.15;0.75;1"
                repeatCount="indefinite"
                values="0;0.9;0.5;0"
              />
            </g>
          ))}
          <rect className={styles.lanternBody} height="72" rx="14" width="58" x="151" y="198" />
          <circle className={styles.lanternFlame} cx="180" cy="232" r="10">
            <animate
              attributeName="opacity"
              dur="4.5s"
              keyTimes="0;0.45;0.7;1"
              repeatCount="indefinite"
              values="1;0.35;0.75;1"
            />
          </circle>
          <text className={styles.panelAction} textAnchor="middle" x="180" y="288">
            MANY OPEN LOOPS · ENERGY FADES
          </text>
        </g>
        <g transform="translate(460 96)">
          <rect className={styles.scenePanel} height="300" rx="28" width="360" />
          <text className={styles.panelTitle} textAnchor="middle" x="180" y="40">
            WITH ROUTINES IN PLACE
          </text>
          <g opacity="0" transform="translate(180 210)">
            <circle className={styles.questionBubble} r="13" />
            <text className={styles.questionMark} textAnchor="middle" y="4">
              ?
            </text>
            <animateTransform
              attributeName="transform"
              additive="sum"
              begin="2s"
              dur="7s"
              repeatCount="indefinite"
              type="translate"
              values="0 0;0 -110"
            />
            <animate
              attributeName="opacity"
              begin="2s"
              dur="7s"
              keyTimes="0;0.12;0.6;1"
              repeatCount="indefinite"
              values="0;0.45;0.25;0"
            />
          </g>
          <rect className={styles.lanternBody} height="72" rx="14" width="58" x="151" y="198" />
          <circle className={styles.lanternHalo} cx="180" cy="232" opacity="0" r="20">
            <animate
              attributeName="opacity"
              dur="5.2s"
              keyTimes="0;0.5;1"
              repeatCount="indefinite"
              values="0.5;0.15;0.5"
            />
            <animate
              attributeName="r"
              dur="5.2s"
              keyTimes="0;0.5;1"
              repeatCount="indefinite"
              values="18;26;18"
            />
          </circle>
          <circle className={styles.lanternFlame} cx="180" cy="232" r="10">
            <animate
              attributeName="r"
              dur="5.2s"
              keyTimes="0;0.5;1"
              repeatCount="indefinite"
              values="9;11;9"
            />
          </circle>
          <text className={styles.panelAction} textAnchor="middle" x="180" y="288">
            DECIDED ONCE · ENERGY LASTS
          </text>
        </g>
        <text className={styles.motionCaption} textAnchor="middle" x="440" y="444">
          A ROUTINE IS A DECISION YOU ONLY MAKE ONCE
        </text>
      </svg>
      <figcaption className={styles.figureCaption}>
        <strong>Decision fatigue is real.</strong> Every open question costs a little light. A
        routine answers the question once, in advance, so by evening there is still something left
        in the lantern.
      </figcaption>
    </figure>
  );
}

function HabitLoopAnimation() {
  const loopNodes = [
    { label: "ANCHOR", x: 410, y: 128 },
    { label: "NEW HABIT", x: 507, y: 296 },
    { label: "REPEAT", x: 313, y: 296 },
  ] as const;

  return (
    <figure className={styles.motionFigure}>
      <svg
        aria-labelledby="habit-loop-title habit-loop-desc"
        className={styles.motionCanvas}
        role="img"
        viewBox="0 0 820 470"
      >
        <title id="habit-loop-title">A habit loop cycles from anchor to new habit to repeat</title>
        <desc id="habit-loop-desc">
          A token travels an endless circle connecting an existing anchor, the new habit attached to
          it, and the gentle repetition that makes it automatic.
        </desc>
        <rect className={styles.canvasSage} height="470" rx="54" width="820" />
        <text className={styles.sceneHeading} textAnchor="middle" x="410" y="48">
          THE LOOP THAT MAKES HABITS AUTOMATIC
        </text>
        <text className={styles.loopDetail} textAnchor="middle" x="410" y="76">
          SOMETHING YOU ALREADY DO
        </text>
        <circle className={styles.loopRing} cx="410" cy="240" pathLength="1" r="112">
          <animate
            attributeName="stroke-dashoffset"
            dur="9s"
            from="1"
            repeatCount="indefinite"
            to="-1"
          />
        </circle>
        <g className={styles.loopToken} opacity="0">
          <circle r="13" />
          <animateMotion dur="8s" path="M410 128a112 112 0 1 1 -0.2 0" repeatCount="indefinite" />
          <animate
            attributeName="opacity"
            dur="8s"
            keyTimes="0;0.04;0.96;1"
            repeatCount="indefinite"
            values="0;1;1;0"
          />
        </g>
        {loopNodes.map(({ label, x, y }, index) => (
          <g key={label} transform={`translate(${x} ${y})`}>
            <circle className={styles.loopNodeHalo} opacity="0" r="50">
              <animate
                attributeName="opacity"
                begin={`${index * 2.66}s`}
                dur="8s"
                keyTimes="0;0.08;0.24;1"
                repeatCount="indefinite"
                values="0;0.6;0;0"
              />
              <animate
                attributeName="r"
                begin={`${index * 2.66}s`}
                dur="8s"
                keyTimes="0;0.1;0.26;1"
                repeatCount="indefinite"
                values="46;58;62;46"
              />
            </circle>
            <circle className={styles.loopNode} r="44" />
            <text className={styles.loopNodeLabel} textAnchor="middle" y="5">
              {label}
            </text>
          </g>
        ))}
        <text className={styles.loopDetail} textAnchor="middle" x="313" y="372">
          UNTIL IT FEELS AUTOMATIC
        </text>
        <text className={styles.loopDetail} textAnchor="middle" x="507" y="372">
          ATTACHED RIGHT AFTER
        </text>
        <text className={styles.motionCaption} textAnchor="middle" x="410" y="446">
          AFTER THE ANCHOR · DO THE HABIT · LET IT REPEAT
        </text>
      </svg>
      <figcaption className={styles.figureCaption}>
        <strong>Here is the use:</strong> your brain already remembers the anchor. Attach the new
        habit right after it, and the old routine does the reminding, no willpower contest required.
      </figcaption>
    </figure>
  );
}

function NextStepStaircaseAnimation() {
  const steps = [0, 1, 2, 3, 4] as const;

  return (
    <figure className={styles.motionFigure}>
      <svg
        aria-labelledby="next-step-title next-step-desc"
        className={styles.motionCanvas}
        role="img"
        viewBox="0 0 880 470"
      >
        <title id="next-step-title">A walker pauses at a soft step, then simply continues</title>
        <desc id="next-step-desc">
          A gentle figure climbs a staircase, pauses beside one softly marked step, and then takes
          the next step upward instead of starting over.
        </desc>
        <rect className={styles.canvasPaper} height="470" rx="54" width="880" />
        <text className={styles.sceneHeading} textAnchor="middle" x="440" y="48">
          A MISSED STEP IS NOT A RESTART
        </text>
        {steps.map((index) => (
          <rect
            className={cn(styles.stepBlock, index === 3 && styles.stepSoft)}
            height={408 - (358 - index * 48)}
            key={index}
            rx="14"
            width="110"
            x={120 + index * 110}
            y={358 - index * 48}
          />
        ))}
        <g className={styles.stepHeart} transform="translate(505 262)">
          <path d="M0 4C-6 -4 -14 0 -14 6C-14 12 -6 16 0 22C6 16 14 12 14 6C14 0 6 -4 0 4Z" />
          <animate
            attributeName="opacity"
            dur="4s"
            keyTimes="0;0.5;1"
            repeatCount="indefinite"
            values="0.5;0.9;0.5"
          />
        </g>
        <g opacity="0">
          <circle className={styles.walkerHalo} cy="-34" r="30">
            <animate
              attributeName="r"
              dur="3.2s"
              keyTimes="0;0.5;1"
              repeatCount="indefinite"
              values="28;34;28"
            />
          </circle>
          <circle className={styles.walkerHead} cy="-52" r="13" />
          <path className={styles.walkerBody} d="M-16 0V-26C-16 -38 16 -38 16 -26V0" />
          <animateMotion
            calcMode="linear"
            dur="11s"
            keyPoints="0;0.55;0.55;1"
            keyTimes="0;0.5;0.62;1"
            path="M175 358L240 358L240 310L350 310L350 262L460 262L460 214L570 214L570 166L680 166"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            dur="11s"
            keyTimes="0;0.06;0.9;1"
            repeatCount="indefinite"
            values="0;1;1;0"
          />
        </g>
        <text className={styles.stepNote} textAnchor="middle" x="505" y="390">
          A PAUSED DAY
        </text>
        <text className={styles.motionCaption} textAnchor="middle" x="440" y="446">
          DON’T START OVER, JUST TAKE THE NEXT STEP
        </text>
      </svg>
      <figcaption className={styles.figureCaption}>
        <strong>Missing a step on a staircase</strong> never sends you back to the bottom. You
        steady yourself and take the next one. An interrupted routine works exactly the same way,
        tomorrow is simply the next step.
      </figcaption>
    </figure>
  );
}

function GrowthOverWeeksAnimation() {
  const dots = [
    { begin: "0.2s", cx: 60, cy: 208 },
    { begin: "1.4s", cx: 190, cy: 176 },
    { begin: "2.6s", cx: 320, cy: 154 },
    { begin: "3.8s", cx: 450, cy: 134 },
    { begin: "5s", cx: 578, cy: 108 },
    { begin: "6.2s", cx: 688, cy: 76 },
  ] as const;
  const weeks = [
    { label: "WEEK 1", x: 118 },
    { label: "WEEK 2", x: 288 },
    { label: "WEEK 3", x: 456 },
    { label: "WEEK 4", x: 626 },
  ] as const;
  const curve = "M60 208C170 196 250 168 320 154S470 128 578 108 660 90 688 76";

  return (
    <figure className={styles.motionFigure}>
      <svg
        aria-labelledby="growth-weeks-title growth-weeks-desc"
        className={styles.motionCanvas}
        role="img"
        viewBox="0 0 820 448"
      >
        <title id="growth-weeks-title">Small weekly steps rise into gradual, gentle progress</title>
        <desc id="growth-weeks-desc">
          A soft curve climbs across four weeks while gentle points settle onto it one after
          another, showing progress building slowly over time rather than in a single day.
        </desc>
        <rect className={styles.canvasWarm} height="448" rx="54" width="820" />
        <text className={styles.sceneHeading} textAnchor="middle" x="410" y="46">
          PROGRESS GROWS OVER WEEKS, NOT DAYS
        </text>
        <g transform="translate(58 80)">
          <rect className={styles.scenePanel} height="292" rx="28" width="704" />
          <path className={styles.growthBaseline} d="M40 244H664" />
          <path
            className={styles.growthArea}
            d="M60 208C170 196 250 168 320 154S470 128 578 108 660 90 688 76L688 244L60 244Z"
          >
            <animate
              attributeName="opacity"
              dur="6s"
              keyTimes="0;0.5;1"
              repeatCount="indefinite"
              values="0.3;0.5;0.3"
            />
          </path>
          <path className={styles.growthLine} d={curve} pathLength="1">
            <animate
              attributeName="stroke-dashoffset"
              dur="7s"
              from="1"
              repeatCount="indefinite"
              to="-1"
            />
          </path>
          {dots.map(({ begin, cx, cy }) => (
            <circle className={styles.growthDot} cx={cx} cy={cy} key={begin} opacity="0" r="9">
              <animate
                attributeName="opacity"
                begin={begin}
                dur="8s"
                keyTimes="0;0.06;0.9;1"
                repeatCount="indefinite"
                values="0;1;1;0"
              />
              <animate
                attributeName="r"
                begin={begin}
                dur="8s"
                keyTimes="0;0.08;0.9;1"
                repeatCount="indefinite"
                values="4;9;9;4"
              />
            </circle>
          ))}
          <g className={styles.growthSprout} transform="translate(688 76)">
            <path d="M0 6C-6 -2 -14 2 -14 8C-14 14 -6 18 0 24C6 18 14 14 14 8C14 2 6 -2 0 6Z" />
            <animate
              attributeName="opacity"
              dur="4s"
              keyTimes="0;0.5;1"
              repeatCount="indefinite"
              values="0.55;0.95;0.55"
            />
          </g>
          {weeks.map(({ label, x }) => (
            <text className={styles.weekAxisLabel} key={label} textAnchor="middle" x={x} y="272">
              {label}
            </text>
          ))}
        </g>
        <text className={styles.motionCaption} textAnchor="middle" x="410" y="424">
          SMALL, REPEATED WEEKS QUIETLY ADD UP
        </text>
      </svg>
      <figcaption className={styles.figureCaption}>
        <strong>Improvement is gradual.</strong> Managing diabetes is more like learning an
        instrument than cramming for an exam, some weeks feel easier than others, and the quiet,
        repeated ones are what add up.
      </figcaption>
    </figure>
  );
}

export function DayTenExperience({ lesson: experience }: { lesson: LessonPlayerViewModel }) {
  const router = useRouter();
  const [stage, setStage] = useState(0);
  const [openingFeeling, setOpeningFeeling] = useState<string | null>(null);
  const [decisionsOpened, setDecisionsOpened] = useState<Set<DailyDecisionId>>(() => new Set());
  const [activeDecision, setActiveDecision] = useState<DailyDecisionId | null>(null);
  const [pendingAnchor, setPendingAnchor] = useState<string | null>(null);
  const [stacks, setStacks] = useState<readonly { anchor: string; habit: string }[]>([]);
  const [supportsPlaced, setSupportsPlaced] = useState<Set<EnvironmentSupportId>>(() => new Set());
  const [starterRoutine, setStarterRoutine] = useState<string | null>(null);
  const [reminder, setReminder] = useState<string | null>(null);
  const [reflection, setReflection] = useState<(typeof reflections)[number] | null>(null);
  const [evaluations, setEvaluations] = useState<
    Partial<Record<"firstHabit" | "setback" | "teachBack", DayTenEvaluationFeedback>>
  >({});
  const [selectedAnswers, setSelectedAnswers] = useState<
    Partial<Record<"firstHabit" | "setback" | "teachBack", string>>
  >({});
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const stageRef = useRef<HTMLDivElement>(null);
  const storageKey = `health-decoded:day-ten:${experience.lessonProgressId}`;

  const usedAnchors = new Set(stacks.map((stack) => stack.anchor));
  const usedHabits = new Set(stacks.map((stack) => stack.habit));

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
    key: "firstHabit" | "setback" | "teachBack",
    answer: string,
  ) {
    setSelectedAnswers((current) => ({ ...current, [key]: answer }));
    const result = await evaluateDayTenAction(input);
    if (result.ok) setEvaluations((current) => ({ ...current, [key]: result.data }));
    else setMessage(result.message);
  }

  function canContinue() {
    if (stage === 0) return openingFeeling !== null;
    if (stage === 1) return decisionsOpened.size >= 4;
    if (stage === 2) return Boolean(evaluations.firstHabit);
    if (stage === 3) return stacks.length >= 2;
    if (stage === 4) return supportsPlaced.size >= 3;
    if (stage === 5) return Boolean(evaluations.setback);
    if (stage === 6) return starterRoutine !== null && reminder !== null;
    if (stage === 7) return reflection !== null && Boolean(evaluations.teachBack);
    return true;
  }

  function stageRequirement() {
    return [
      "Choose how routines feel right now.",
      "Open at least four everyday decisions a routine can quiet.",
      "Choose which neighbor’s start is more likely to last.",
      "Build at least two habit stacks from an anchor and a new habit.",
      "Set up at least three easy-choice supports.",
      "Choose the kind response to an interrupted routine.",
      "Choose one starter routine and one visible reminder.",
      "Choose one reflection and complete the teach-back.",
    ][stage];
  }

  function continueLabel() {
    return (
      [
        "See where the energy goes",
        "Start smaller than you think",
        "Stack a habit onto an anchor",
        "Make the easy choice the near one",
        "Practice an interrupted week",
        "Choose your one small start",
        "Keep showing up gently",
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
      router.push(`/journey?completed=${experience.dayNumber}`);
    });
  }

  function renderStage() {
    switch (stage) {
      case 0:
        return (
          <div className="space-y-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_17rem] lg:items-end">
              <LessonHeading label="Day 10 · Building routines that make diabetes easier">
                Let the routine remember, so you don’t have to.
              </LessonHeading>
              <div className="border-l-2 border-accent-warm pl-6">
                <p className="editorial-number text-accent-warm">10</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Nine days of learning is a lot to carry. Today is about setting some of it down
                  into habits that carry themselves.
                </p>
              </div>
            </div>
            <DayRhythmAnimation />
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
                However today feels, here is the gentle promise of this lesson: managing diabetes is
                not hundreds of perfect decisions a day. It is a few small routines, repeated
                kindly.
              </p>
            ) : null}
          </div>
        );
      case 1:
        return (
          <div className="space-y-9">
            <LessonHeading label="Decision fatigue is real">
              Every open question costs a little energy. Routines answer them once.
            </LessonHeading>
            <DecisionLanternAnimation />
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Open the everyday questions that quietly drain the day. Notice how each one can be
              answered in advance by a small routine, so it stops being a question at all.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {dailyDecisions.map((decision) => {
                const opened = decisionsOpened.has(decision.id);
                return (
                  <button
                    aria-pressed={opened}
                    className={cn(styles.decisionCard, opened && styles.decisionCardOpen)}
                    key={decision.id}
                    onClick={() => {
                      setDecisionsOpened((current) => new Set([...current, decision.id]));
                      setActiveDecision(decision.id);
                    }}
                    type="button"
                  >
                    <span>{opened ? "ANSWERED BY ROUTINE" : "TAP TO QUIET IT"}</span>
                    <strong>{decision.label}</strong>
                    <p>{opened ? decision.body : "How could a routine answer this once?"}</p>
                  </button>
                );
              })}
            </div>
            {activeDecision ? (
              <p className="animate-slide-up border-l-2 border-success bg-info p-5 leading-7">
                {dailyDecisions.find((decision) => decision.id === activeDecision)?.body} That is
                one less decision waiting for you at the tired end of the day.
              </p>
            ) : null}
          </div>
        );
      case 2:
        return (
          <div className="space-y-9">
            <LessonHeading label="Small habits beat big changes">
              The exciting overhaul usually loses to the boring, repeatable step.
            </LessonHeading>
            <div className={styles.compareBoard}>
              <div>
                <p>EVERYTHING AT ONCE</p>
                <ul>
                  <li>Empty the kitchen overnight</li>
                  <li>Promise a workout every single day</li>
                  <li>Redesign the whole schedule</li>
                  <li>Exhausting by week two</li>
                </ul>
              </div>
              <div>
                <p>ONE SMALL HABIT</p>
                <ul>
                  <li>A short walk after dinner</li>
                  <li>Medication at the same time, as prescribed</li>
                  <li>Water within easy reach</li>
                  <li>Still going months later</li>
                </ul>
              </div>
            </div>
            <div className="border-y border-border py-8">
              <p className="font-serif-display text-3xl">
                Two neighbors get the same diagnosis. Who is more likely to still be going strong in
                six months?
              </p>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {(
                  [
                    [
                      "one_small_habit",
                      "The one who starts with one small habit, like a short walk after dinner.",
                    ],
                    [
                      "everything_at_once",
                      "The one who empties the kitchen and overhauls everything overnight.",
                    ],
                    [
                      "wait_for_motivation",
                      "The one who waits until motivation finally feels strong enough.",
                    ],
                  ] as const
                ).map(([answer, label]) => (
                  <AnswerChoice
                    key={answer}
                    onClick={() => evaluate({ answer, stage: "first_habit" }, "firstHabit", answer)}
                    selected={selectedAnswers.firstHabit === answer}
                  >
                    {label}
                  </AnswerChoice>
                ))}
              </div>
            </div>
            {evaluations.firstHabit ? <Feedback feedback={evaluations.firstHabit} /> : null}
          </div>
        );
      case 3:
        return (
          <div className="space-y-9">
            <LessonHeading label="Habit stacking">
              Attach the new habit to something you already do, and let the old habit remind you.
            </LessonHeading>
            <HabitLoopAnimation />
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Build a stack: choose an anchor you already do every day, then choose the small habit
              to attach right after it. Build at least two.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <p className="editorial-eyebrow">1 · Choose an anchor</p>
                {habitAnchors.map((anchor) => {
                  const used = usedAnchors.has(anchor);
                  return (
                    <button
                      aria-pressed={pendingAnchor === anchor}
                      className={cn(
                        styles.stackChip,
                        pendingAnchor === anchor && styles.stackChipSelected,
                        used && styles.stackChipUsed,
                      )}
                      disabled={used}
                      key={anchor}
                      onClick={() => setPendingAnchor(anchor)}
                      type="button"
                    >
                      {anchor}
                    </button>
                  );
                })}
              </div>
              <div className="space-y-3">
                <p className="editorial-eyebrow">2 · Attach a new habit</p>
                {habitAdditions.map((habit) => {
                  const used = usedHabits.has(habit);
                  return (
                    <button
                      className={cn(styles.stackChip, used && styles.stackChipUsed)}
                      disabled={used || pendingAnchor === null}
                      key={habit}
                      onClick={() => {
                        if (!pendingAnchor) return;
                        setStacks((current) => [...current, { anchor: pendingAnchor, habit }]);
                        setPendingAnchor(null);
                      }}
                      type="button"
                    >
                      {habit}
                    </button>
                  );
                })}
              </div>
            </div>
            {pendingAnchor ? (
              <p aria-live="polite" className="text-sm text-muted-foreground" role="status">
                Anchor chosen: “{pendingAnchor}.” Now pick the habit to attach right after it.
              </p>
            ) : null}
            {stacks.length > 0 ? (
              <div className="animate-slide-up space-y-3">
                <p className="editorial-eyebrow text-success">Your stacks (tap one to unstack)</p>
                {stacks.map((stack) => (
                  <button
                    className={styles.stackRow}
                    key={`${stack.anchor}-${stack.habit}`}
                    onClick={() =>
                      setStacks((current) => current.filter((entry) => entry !== stack))
                    }
                    type="button"
                  >
                    <Sparkles aria-hidden="true" className="size-4" />
                    <span>
                      {stack.anchor}, <strong>{stack.habit}</strong>.
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        );
      case 4:
        return (
          <div className="space-y-9">
            <LessonHeading label="Make the healthy choice the easy choice">
              Your environment votes on your habits all day long.
            </LessonHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              A fruit bowl you can see beats a promise you have to remember. Instead of relying only
              on willpower, set up your space so the healthy choice is the near one. Choose the
              supports you would like to place this week.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {environmentSupports.map(([id, label]) => {
                const placed = supportsPlaced.has(id);
                return (
                  <button
                    aria-pressed={placed}
                    className={cn(styles.supportChip, placed && styles.supportChipOn)}
                    key={id}
                    onClick={() =>
                      setSupportsPlaced((current) => {
                        const next = new Set(current);
                        if (next.has(id)) next.delete(id);
                        else next.add(id);
                        return next;
                      })
                    }
                    type="button"
                  >
                    <Home aria-hidden="true" className="size-4" />
                    <span>{label}</span>
                    {placed ? <Check aria-hidden="true" className="size-4" /> : null}
                  </button>
                );
              })}
            </div>
            {supportsPlaced.size >= 3 ? (
              <p className="animate-slide-up border-l-2 border-success bg-info p-5 leading-7">
                Lovely. None of these require willpower at the moment of choice, that is exactly the
                point. Tiny changes to your environment quietly support you every day.
              </p>
            ) : null}
          </div>
        );
      case 5:
        return (
          <div className="space-y-9">
            <LessonHeading label="When life interrupts">
              A birthday, a busy week, a tired evening, your routine can bend without breaking.
            </LessonHeading>
            <NextStepStaircaseAnimation />
            <div className="border-y border-border py-8">
              <p className="font-serif-display text-3xl">
                You missed your evening walk and had dessert at a celebration. What is the kind,
                effective next move?
              </p>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {(
                  [
                    [
                      "next_decision",
                      "Ask “what is the healthiest thing I can do next?” and simply take that step.",
                    ],
                    ["week_ruined", "Call the week ruined and start fresh next Monday."],
                    ["make_up_for_it", "Skip meals tomorrow to make up for tonight."],
                  ] as const
                ).map(([answer, label]) => (
                  <AnswerChoice
                    key={answer}
                    onClick={() => evaluate({ answer, stage: "setback" }, "setback", answer)}
                    selected={selectedAnswers.setback === answer}
                  >
                    {label}
                  </AnswerChoice>
                ))}
              </div>
            </div>
            {evaluations.setback ? <Feedback feedback={evaluations.setback} /> : null}
          </div>
        );
      case 6:
        return (
          <div className="space-y-9">
            <LessonHeading label="Choose one small start">
              Lasting change usually begins with a single habit, practiced gently.
            </LessonHeading>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-3">
                <p className="editorial-eyebrow">This week’s starter routine</p>
                {starterRoutines.map(([id, label]) => (
                  <AnswerChoice
                    key={id}
                    onClick={() => setStarterRoutine(id)}
                    selected={starterRoutine === id}
                  >
                    {label}
                  </AnswerChoice>
                ))}
              </div>
              <div className="space-y-3">
                <p className="editorial-eyebrow">Remembered by</p>
                {visibleReminders.map(([id, label]) => (
                  <AnswerChoice key={id} onClick={() => setReminder(id)} selected={reminder === id}>
                    {label}
                  </AnswerChoice>
                ))}
              </div>
            </div>
            {starterRoutine && reminder ? (
              <div className={cn("animate-slide-up", styles.experimentTicket)}>
                <Sparkles aria-hidden="true" />
                <div>
                  <p className="editorial-eyebrow text-success">This week’s gentle experiment</p>
                  <p>
                    {starterRoutines.find(([id]) => id === starterRoutine)?.[1]}, remembered by{" "}
                    {visibleReminders.find(([id]) => id === reminder)?.[1].toLowerCase()}. Visible
                    reminders are tools, not signs of forgetfulness.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        );
      case 7:
        return (
          <div className="space-y-9">
            <LessonHeading label="Progress grows over weeks">
              Improvement is gradual, more like tending a plant than passing a test.
            </LessonHeading>
            <GrowthOverWeeksAnimation />
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
                A friend asks: “What’s the secret to managing diabetes every day?” Which reply
                carries today’s lesson?
              </p>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {(
                  [
                    [
                      "consistency_routines",
                      "Simple routines that make healthy choices easier, and returning to them whenever life interrupts.",
                    ],
                    ["perfect_choices", "Making perfect choices at every meal, every single day."],
                    [
                      "motivation_daily",
                      "Waking up with enough motivation and willpower each morning.",
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
            <p className="editorial-eyebrow">Day 10 complete</p>
            <LessonHeading>Consistency is more powerful than perfection.</LessonHeading>
            <div className="mx-auto max-w-3xl border-y border-border py-9 text-left">
              <p className="editorial-eyebrow text-success">Three ideas worth carrying</p>
              <ol className="mt-6 space-y-6">
                {[
                  "A routine is a decision you make once, then simply repeat, so the day costs less energy.",
                  "Small habits stacked onto things you already do beat dramatic overnight overhauls.",
                  "When life interrupts, you don’t start over. You take the next step, without guilt.",
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
                  Preventing complications without fear
                </h2>
                <p className="mt-2 leading-7 text-muted-foreground">
                  How steady routines help protect your eyes, kidneys, heart, and nerves, through
                  small consistent choices, not fear.
                </p>
              </div>
              <div>
                <p className="editorial-eyebrow text-success">Your reflection</p>
                <p className="mt-3 font-serif-display text-2xl">
                  {reflection ?? "You can choose one whenever you are ready."}
                </p>
              </div>
            </div>
            <Button disabled={isPending} fullWidth={false} onClick={finishExperience}>
              {isPending
                ? "Saving your progress…"
                : experience.accessMode === "review"
                  ? "Return to journey"
                  : "Complete Day 10"}
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
            <p className="text-sm font-semibold text-accent-warm">Day 10</p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Building Routines That Make Diabetes Easier
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
            label={`Day 10 chapter ${stage + 1} of ${stageCount}`}
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
        title="Leave Day 10 for now?"
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
        title="Day 10 glossary"
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
