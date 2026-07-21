"use client";

import { ArrowLeft, BookOpen, Check, CircleHelp, Heart, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  evaluateDayNineAction,
  type DayNineEvaluationFeedback,
} from "@/features/lessons/actions/day-nine.actions";
import { completeLessonAction } from "@/features/lessons/actions/lesson-completion.actions";
import { saveLessonPositionAction } from "@/features/lessons/actions/lesson-progress.actions";
import styles from "@/features/lessons/components/day-nine-experience.module.css";
import type { LessonPlayerViewModel } from "@/features/lessons/types/lesson-player";
import { cn } from "@/lib/utils";

const stageCount = 9;

const openingFeelings = [
  ["worried", "Worried—those words sound frightening"],
  ["curious", "Curious about what the signals actually mean"],
  ["prepared", "Ready to feel prepared instead of afraid"],
  ["unsure", "Unsure whether this even applies to me"],
] as const;

const highCauses = [
  {
    body: "A meal with more carbohydrate than usual can leave more glucose in the bloodstream for a while.",
    id: "meal",
    label: "A larger meal than usual",
  },
  {
    body: "Medication routines matter. A missed dose can let glucose drift higher than expected.",
    id: "dose",
    label: "A missed medication dose",
  },
  {
    body: "Illness puts the body under stress, and stress hormones can raise blood glucose.",
    id: "illness",
    label: "Being sick",
  },
  {
    body: "Significant stress releases hormones that can nudge glucose upward—even without food changes.",
    id: "stress",
    label: "A stressful stretch",
  },
  {
    body: "Bodies are not machines. Some days glucose simply responds differently than usual.",
    id: "different",
    label: "The body responding differently",
  },
  {
    body: "Sometimes there is no obvious explanation—and that does not mean you did something wrong.",
    id: "unknown",
    label: "No clear reason at all",
  },
] as const;
type HighCauseId = (typeof highCauses)[number]["id"];

const lowRiskChoices = [
  ["medications", "It depends largely on which medications someone takes"],
  ["everyone", "Everyone with Type 2 diabetes has frequent lows"],
  ["impossible", "Lows cannot happen unless someone uses insulin"],
] as const;

const symptomCards = [
  { id: "thirst", label: "Feeling very thirsty", side: "high" },
  { id: "shaky", label: "Feeling shaky", side: "low" },
  { id: "urination", label: "Needing to urinate more often", side: "high" },
  { id: "sweating", label: "Sweating suddenly", side: "low" },
  { id: "blurry", label: "Blurry vision", side: "high" },
  { id: "heartbeat", label: "A fast heartbeat", side: "low" },
] as const;
type SymptomId = (typeof symptomCards)[number]["id"];

const lowClues = [
  ["delay", "A delayed or lighter meal"],
  ["activity", "More activity than usual"],
  ["mismatch", "Medication taken, then part of a meal missed"],
  ["none", "Sometimes no clear reason"],
] as const;

const urgentSignals = [
  ["vomiting", "Vomiting that will not stop"],
  ["awake", "Difficulty staying awake"],
  ["breathing", "Trouble breathing"],
  ["confusion", "Confusion that keeps growing"],
  ["dehydration", "Signs of severe dehydration"],
  ["weakness", "Severe weakness that does not improve"],
] as const;
type UrgentSignalId = (typeof urgentSignals)[number][0];

const planItems = [
  ["call", "I know who I would call with questions"],
  ["medications", "I know where my medications are kept"],
  ["instructions", "I know what my care team told me to do for highs and lows"],
  ["people", "Someone close to me knows I have diabetes"],
] as const;
type PlanItemId = (typeof planItems)[number][0];

const supportPeople = [
  ["partner", "A spouse or partner"],
  ["family", "A family member"],
  ["friend", "A close friend"],
  ["daily", "A roommate or coworker"],
] as const;

const reflections = [
  "Most blood sugar changes are manageable—not emergencies.",
  "High and low have different signals, and I can learn mine.",
  "A symptom is a signal to pay attention, not a reason to panic.",
  "Asking for help early is part of taking good care of myself.",
] as const;

const glossary = [
  {
    definition:
      "Blood glucose higher than the body can comfortably use at that moment. Signals such as thirst, extra restroom trips, tiredness, or blurry vision often build gradually.",
    term: "Hyperglycemia (high blood sugar)",
  },
  {
    definition:
      "Blood glucose lower than the body needs. Signals such as shakiness, sweating, hunger, or a fast heartbeat often arrive quickly. Risk depends largely on which medications someone takes.",
    term: "Hypoglycemia (low blood sugar)",
  },
  {
    definition:
      "A quickly absorbed source of carbohydrate that many care teams include in a personal plan for treating a mild low. The exact steps belong to your individual care plan.",
    term: "Fast-acting carbohydrate",
  },
  {
    definition:
      "Uncommon symptoms—such as persistent vomiting, trouble breathing, difficulty staying awake, or growing confusion—that deserve prompt medical care.",
    term: "Urgent signals",
  },
  {
    definition:
      "The individual instructions your healthcare team gives you for responding to highs and lows. General education explains ideas; your plan directs your actions.",
    term: "Care plan",
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

function sorterConfirmation(side: "high" | "low") {
  return side === "high"
    ? "Yes—often a gradual high-side signal."
    : "Yes—often a quick low-side signal.";
}

function sorterCorrection(side: "high" | "low") {
  return side === "high"
    ? "Gently: this one more often travels with high blood sugar."
    : "Gently: this one more often travels with low blood sugar.";
}

function Feedback({ feedback }: { feedback: DayNineEvaluationFeedback }) {
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

function SteadyBalanceAnimation() {
  return (
    <figure className={styles.motionFigure}>
      <svg
        aria-labelledby="steady-balance-title steady-balance-desc"
        className={styles.motionCanvas}
        role="img"
        viewBox="0 0 820 430"
      >
        <title id="steady-balance-title">The body keeps glucose inside a comfortable band</title>
        <desc id="steady-balance-desc">
          A gentle gauge needle sways inside a marked band while a glucose wave drifts steadily
          between two soft boundary lines.
        </desc>
        <rect className={styles.canvasWarm} height="430" rx="54" width="820" />
        <text className={styles.sceneHeading} textAnchor="middle" x="410" y="48">
          YOUR BODY LIKES BALANCE
        </text>
        <g transform="translate(58 84)">
          <rect className={styles.scenePanel} height="252" rx="28" width="244" />
          <text className={styles.panelTitle} textAnchor="middle" x="122" y="40">
            STEADY FUEL &amp; FLOW
          </text>
          <circle className={styles.gaugeDial} cx="122" cy="150" r="62" />
          <path className={styles.gaugeArc} d="M78 190A60 60 0 1 1 166 190" />
          <g className={styles.gaugeNeedle} transform="translate(122 150)">
            <path d="M0 8L0 -44" />
            <circle r="8" />
            <animateTransform
              attributeName="transform"
              additive="sum"
              dur="9s"
              keyTimes="0;0.3;0.55;0.8;1"
              repeatCount="indefinite"
              type="rotate"
              values="-24;18;-6;24;-24"
            />
          </g>
          <text className={styles.panelAction} textAnchor="middle" x="122" y="236">
            NOT TOO HIGH · NOT TOO LOW
          </text>
        </g>
        <g transform="translate(330 84)">
          <rect className={styles.scenePanel} height="252" rx="28" width="432" />
          <text className={styles.panelTitle} textAnchor="middle" x="216" y="40">
            GLUCOSE DRIFTS INSIDE A BAND
          </text>
          <path className={styles.waveBand} d="M28 84H404" />
          <path className={styles.waveBand} d="M28 196H404" />
          <path
            className={styles.wavePath}
            d="M28 142C82 104 122 178 178 138S284 100 330 156S388 128 404 136"
            pathLength="1"
          >
            <animate
              attributeName="stroke-dashoffset"
              dur="6.5s"
              from="1"
              repeatCount="indefinite"
              to="-1"
            />
          </path>
          {[0, 1].map((dot) => (
            <circle className={styles.waveDot} key={dot} r="11">
              <animateMotion
                begin={`${dot * 3.6}s`}
                dur="7.2s"
                path="M28 142C82 104 122 178 178 138S284 100 330 156S388 128 404 136"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                begin={`${dot * 3.6}s`}
                dur="7.2s"
                keyTimes="0;0.08;0.9;1"
                repeatCount="indefinite"
                values="0;1;1;0"
              />
            </circle>
          ))}
          <text className={styles.panelAction} textAnchor="middle" x="216" y="236">
            SMALL RISES AND DIPS ARE PART OF EVERY DAY
          </text>
        </g>
        <text className={styles.motionCaption} textAnchor="middle" x="410" y="404">
          MOST CHANGES ARE SMALL DRIFTS — NOT EMERGENCIES
        </text>
      </svg>
      <figcaption className={styles.figureCaption}>
        <strong>Balance is a range, not a single point.</strong> Blood glucose rises and settles all
        day. Today is about recognizing when a drift is asking for attention—without treating every
        movement as an alarm.
      </figcaption>
    </figure>
  );
}

function SlowTideAnimation() {
  const lamps = [
    { label: "FEELING VERY THIRSTY", y: 36 },
    { label: "MORE RESTROOM TRIPS", y: 104 },
    { label: "TIRED OR LOW ON ENERGY", y: 172 },
    { label: "BLURRY VISION", y: 240 },
  ] as const;

  return (
    <figure className={styles.motionFigure}>
      <svg
        aria-labelledby="slow-tide-title slow-tide-desc"
        className={styles.motionCanvas}
        role="img"
        viewBox="0 0 880 470"
      >
        <title id="slow-tide-title">High blood sugar often builds slowly like a rising tide</title>
        <desc id="slow-tide-desc">
          A vessel fills gradually with a glucose tide while four signal lamps light up one after
          another to show gradual symptoms.
        </desc>
        <rect className={styles.canvasPaper} height="470" rx="54" width="880" />
        <text className={styles.sceneHeading} textAnchor="middle" x="440" y="48">
          HIGH OFTEN BUILDS SLOWLY
        </text>
        <g transform="translate(76 96)">
          <rect className={styles.vesselShell} height="300" rx="30" width="220" />
          <clipPath id="day-nine-vessel-window">
            <rect height="288" rx="24" width="208" x="6" y="6" />
          </clipPath>
          <g clipPath="url(#day-nine-vessel-window)">
            <rect className={styles.vesselTide} height="300" width="208" x="6" y="216">
              <animate
                attributeName="y"
                dur="12s"
                keyTimes="0;0.45;0.62;1"
                repeatCount="indefinite"
                values="216;96;118;216"
              />
            </rect>
            {[
              { begin: "0s", cx: 62, cy: 250 },
              { begin: "1.7s", cx: 128, cy: 268 },
              { begin: "3.1s", cx: 168, cy: 238 },
            ].map(({ begin, cx, cy }) => (
              <circle className={styles.tideDot} cx={cx} cy={cy} key={begin} r="10">
                <animateTransform
                  attributeName="transform"
                  additive="sum"
                  begin={begin}
                  dur="5.4s"
                  keyTimes="0;0.5;1"
                  repeatCount="indefinite"
                  type="translate"
                  values="0 0;0 -110;0 0"
                />
              </circle>
            ))}
          </g>
          <text className={styles.panelAction} textAnchor="middle" x="110" y="336">
            EXTRA GLUCOSE GATHERS GRADUALLY
          </text>
        </g>
        <g transform="translate(356 96)">
          <rect className={styles.scenePanel} height="300" rx="28" width="448" />
          {lamps.map(({ label, y }, index) => (
            <g key={label} transform={`translate(30 ${y})`}>
              <circle className={styles.signalLamp} cx="22" cy="22" r="14">
                <animate
                  attributeName="r"
                  begin={`${index * 2.1}s`}
                  dur="12s"
                  keyTimes="0;0.1;0.3;1"
                  repeatCount="indefinite"
                  values="11;18;11;11"
                />
              </circle>
              <circle className={styles.signalHalo} cx="22" cy="22" r="20">
                <animate
                  attributeName="opacity"
                  begin={`${index * 2.1}s`}
                  dur="12s"
                  keyTimes="0;0.1;0.32;1"
                  repeatCount="indefinite"
                  values="0;0.75;0;0"
                />
                <animate
                  attributeName="r"
                  begin={`${index * 2.1}s`}
                  dur="12s"
                  keyTimes="0;0.12;0.34;1"
                  repeatCount="indefinite"
                  values="16;30;36;16"
                />
              </circle>
              <text className={styles.signalLabel} x="58" y="28">
                {label}
              </text>
            </g>
          ))}
        </g>
        <text className={styles.motionCaption} textAnchor="middle" x="440" y="444">
          SIGNALS OFTEN APPEAR GRADUALLY — SOMETIMES ONLY ONE OR TWO
        </text>
      </svg>
      <figcaption className={styles.figureCaption}>
        <strong>A rising tide, not a sudden wave.</strong> When glucose stays higher than the body
        can comfortably use, the body pulls extra water to flush some out—which is why thirst and
        restroom trips are often the first gentle signals.
      </figcaption>
    </figure>
  );
}

function QuickBellAnimation() {
  const quickChips = [
    { label: "SHAKY", y: 66 },
    { label: "SWEATY", y: 134 },
    { label: "SUDDENLY HUNGRY", y: 202 },
    { label: "DIZZY", y: 270 },
  ] as const;

  return (
    <figure className={styles.motionFigure}>
      <svg
        aria-labelledby="quick-bell-title quick-bell-desc"
        className={styles.motionCanvas}
        role="img"
        viewBox="0 0 880 470"
      >
        <title id="quick-bell-title">Low blood sugar rings the body’s early warning bell</title>
        <desc id="quick-bell-desc">
          A brain lamp flickers as its fuel line thins while a warning bell sends out quick rings
          and four fast signals flash in sequence.
        </desc>
        <rect className={styles.canvasSage} height="470" rx="54" width="880" />
        <text className={styles.sceneHeading} textAnchor="middle" x="440" y="48">
          LOWS OFTEN ANNOUNCE THEMSELVES QUICKLY
        </text>
        <g transform="translate(80 110)">
          <rect className={styles.scenePanel} height="286" rx="28" width="250" />
          <text className={styles.panelTitle} textAnchor="middle" x="125" y="40">
            THE BRAIN RUNS ON GLUCOSE
          </text>
          <circle className={styles.brainBulb} cx="125" cy="130" r="44">
            <animate
              attributeName="opacity"
              dur="3.2s"
              keyTimes="0;0.4;0.62;1"
              repeatCount="indefinite"
              values="1;0.45;0.85;1"
            />
          </circle>
          <path
            className={styles.brainCurl}
            d="M100 122C108 108 122 108 126 118C132 106 148 110 148 124C148 138 132 144 124 138C116 146 102 140 100 128"
          />
          <path className={styles.fuelLine} d="M125 216V174" pathLength="1">
            <animate
              attributeName="stroke-dashoffset"
              dur="2.4s"
              from="1"
              repeatCount="indefinite"
              to="-1"
            />
          </path>
          <rect className={styles.fuelCell} height="34" rx="10" width="66" x="92" y="216" />
          <text className={styles.panelAction} textAnchor="middle" x="125" y="272">
            LESS FUEL · QUICK SIGNALS
          </text>
        </g>
        <g transform="translate(372 110)">
          <rect className={styles.scenePanel} height="286" rx="28" width="220" />
          <text className={styles.panelTitle} textAnchor="middle" x="110" y="40">
            AN EARLY WARNING BELL
          </text>
          {[0, 1].map((ring) => (
            <circle className={styles.bellRing} cx="110" cy="150" key={ring} r="30">
              <animate
                attributeName="r"
                begin={`${ring * 1.1}s`}
                dur="2.2s"
                repeatCount="indefinite"
                values="26;62"
              />
              <animate
                attributeName="opacity"
                begin={`${ring * 1.1}s`}
                dur="2.2s"
                repeatCount="indefinite"
                values="0.8;0"
              />
            </circle>
          ))}
          <g transform="translate(110 150)">
            <path
              className={styles.bellBody}
              d="M-26 18C-26 -6 -18 -26 0 -26S26 -6 26 18C30 20 32 24 32 26H-32C-32 24 -30 20 -26 18Z"
            />
            <circle className={styles.bellClapper} cy="32" r="7" />
            <animateTransform
              attributeName="transform"
              additive="sum"
              dur="1.8s"
              keyTimes="0;0.25;0.5;0.75;1"
              repeatCount="indefinite"
              type="rotate"
              values="-7;7;-7;7;-7"
            />
          </g>
          <text className={styles.panelAction} textAnchor="middle" x="110" y="272">
            DESIGNED TO GET ATTENTION
          </text>
        </g>
        <g transform="translate(636 110)">
          {quickChips.map(({ label, y }, index) => (
            <g key={label} transform={`translate(0 ${y - 66})`}>
              <rect className={styles.quickChip} height="46" rx="23" width="168" y="0">
                <animate
                  attributeName="opacity"
                  begin={`${index * 0.65}s`}
                  dur="2.6s"
                  keyTimes="0;0.2;0.5;1"
                  repeatCount="indefinite"
                  values="0.4;1;0.4;0.4"
                />
              </rect>
              <text className={styles.quickChipLabel} textAnchor="middle" x="84" y="29">
                {label}
              </text>
            </g>
          ))}
          <text className={styles.panelAction} textAnchor="middle" x="84" y="278">
            FAST · NOTICEABLE · USEFUL
          </text>
        </g>
        <text className={styles.motionCaption} textAnchor="middle" x="440" y="444">
          QUICK SIGNALS ARE THE BODY ASKING FOR FUEL
        </text>
      </svg>
      <figcaption className={styles.figureCaption}>
        <strong>These symptoms are protective.</strong> The body creates fast, noticeable signals on
        purpose—so you can respond early. Whether lows are likely for you depends largely on your
        medications, which is why your care team explains your personal risk.
      </figcaption>
    </figure>
  );
}

function ActionPathAnimation() {
  const stations = [
    { detail: "BREATHE FIRST", label: "PAUSE & NOTICE", x: 170 },
    { detail: "THE ONE YOUR TEAM GAVE YOU", label: "FOLLOW YOUR PLAN", x: 440 },
    { detail: "REACH OUT EARLY", label: "STILL OFF? CONTACT YOUR TEAM", x: 710 },
  ] as const;

  return (
    <figure className={styles.motionFigure}>
      <svg
        aria-labelledby="action-path-title action-path-desc"
        className={styles.motionCanvas}
        role="img"
        viewBox="0 0 880 470"
      >
        <title id="action-path-title">
          A calm response path with a fast lane for urgent signals
        </title>
        <desc id="action-path-desc">
          A token travels a calm three-step rail from pausing to following a care plan to contacting
          the care team, while a second token takes a faster urgent-care lane below.
        </desc>
        <rect className={styles.canvasPaper} height="470" rx="54" width="880" />
        <text className={styles.sceneHeading} textAnchor="middle" x="440" y="48">
          A CALM PATH BEATS A PANICKED GUESS
        </text>
        <path className={styles.pathRail} d="M80 240H800" />
        {stations.map(({ detail, label, x }, index) => (
          <g className={styles.pathStation} key={label} transform={`translate(${x} 132)`}>
            <rect height="118" rx="22" width="238" x="-119" y="-58" />
            <circle cy="-16" r="22" />
            <text className={styles.stationNumber} textAnchor="middle" y="-9">
              {index + 1}
            </text>
            <text className={styles.stationLabel} textAnchor="middle" y="26">
              {label}
            </text>
            <text className={styles.stationDetail} textAnchor="middle" y="48">
              {detail}
            </text>
            <circle className={styles.stationPulse} cy="108" r="16">
              <animate
                attributeName="opacity"
                begin={`${index * 2.5}s`}
                dur="7.5s"
                keyTimes="0;0.12;0.28;1"
                repeatCount="indefinite"
                values="0;0.7;0;0"
              />
              <animate
                attributeName="r"
                begin={`${index * 2.5}s`}
                dur="7.5s"
                keyTimes="0;0.15;0.3;1"
                repeatCount="indefinite"
                values="12;24;30;12"
              />
            </circle>
          </g>
        ))}
        <g className={styles.pathToken}>
          <circle r="20" />
          <path d="M-7 0L-1 7L9 -6" />
          <animateMotion dur="7.5s" path="M80 240H800" repeatCount="indefinite" />
        </g>
        <g transform="translate(0 0)">
          <path className={styles.urgentRail} d="M80 386H800" pathLength="1">
            <animate
              attributeName="stroke-dashoffset"
              dur="3.4s"
              from="1"
              repeatCount="indefinite"
              to="-1"
            />
          </path>
          <rect className={styles.urgentBanner} height="52" rx="16" width="452" x="214" y="300" />
          <text className={styles.urgentBannerLabel} textAnchor="middle" x="440" y="332">
            URGENT SIGNALS TAKE THE FAST LANE → PROMPT MEDICAL CARE
          </text>
          <g className={styles.urgentToken}>
            <circle r="15" />
            <path d="M0 -6V2M0 7V8" />
            <animateMotion dur="4.2s" path="M80 386H800" repeatCount="indefinite" />
          </g>
        </g>
        <text className={styles.motionCaption} textAnchor="middle" x="440" y="446">
          MOST MOMENTS USE THE CALM PATH · A FEW USE THE FAST LANE
        </text>
      </svg>
      <figcaption className={styles.figureCaption}>
        <strong>Here is the use:</strong> most highs and lows travel the calm path—pause, follow the
        plan your care team gave you, and reach out early if things stay off. Urgent signals are
        uncommon, and they skip straight to prompt medical care.
      </figcaption>
    </figure>
  );
}

function SteadyHandAnimation() {
  return (
    <figure className={styles.motionFigure}>
      <svg
        aria-labelledby="steady-hand-title steady-hand-desc"
        className={styles.motionCanvas}
        role="img"
        viewBox="0 0 820 440"
      >
        <title id="steady-hand-title">
          A smoke detector gets attention while a person breathes
        </title>
        <desc id="steady-hand-desc">
          Steam rises from a pan under a chirping smoke detector while a calm figure takes a slow
          breath beside a three-step reminder card.
        </desc>
        <rect className={styles.canvasWarm} height="440" rx="54" width="820" />
        <text className={styles.sceneHeading} textAnchor="middle" x="410" y="48">
          A SIGNAL ASKS FOR ATTENTION — NOT PANIC
        </text>
        <g transform="translate(70 96)">
          <rect className={styles.scenePanel} height="288" rx="28" width="300" />
          <g transform="translate(150 52)">
            <rect className={styles.detectorBody} height="26" rx="13" width="92" x="-46" y="-13" />
            <circle className={styles.detectorEye} cy="0" r="6" />
            {[0, 1].map((ring) => (
              <circle className={styles.detectorRing} key={ring} r="20">
                <animate
                  attributeName="r"
                  begin={`${ring * 1.4}s`}
                  dur="2.8s"
                  repeatCount="indefinite"
                  values="18;56"
                />
                <animate
                  attributeName="opacity"
                  begin={`${ring * 1.4}s`}
                  dur="2.8s"
                  repeatCount="indefinite"
                  values="0.75;0"
                />
              </circle>
            ))}
          </g>
          {["M108 216C100 196 116 186 108 166", "M138 220C130 198 146 190 138 168"].map((wisp) => (
            <path className={styles.steamPath} d={wisp} key={wisp} pathLength="1">
              <animate
                attributeName="stroke-dashoffset"
                dur="3.6s"
                from="1"
                repeatCount="indefinite"
                to="-1"
              />
            </path>
          ))}
          <path className={styles.panShape} d="M84 226H166L158 250H92Z" />
          <path className={styles.panHandle} d="M166 232H198" />
          <text className={styles.panelAction} textAnchor="middle" x="150" y="276">
            THE ALARM NOTICES · IT DOES NOT DECIDE
          </text>
        </g>
        <g transform="translate(420 96)">
          <rect className={styles.scenePanel} height="288" rx="28" width="330" />
          <g transform="translate(96 132)">
            <circle className={styles.breathHalo} r="52">
              <animate
                attributeName="r"
                dur="5.6s"
                keyTimes="0;0.5;1"
                repeatCount="indefinite"
                values="48;66;48"
              />
              <animate
                attributeName="opacity"
                dur="5.6s"
                keyTimes="0;0.5;1"
                repeatCount="indefinite"
                values="0.55;0.15;0.55"
              />
            </circle>
            <circle className={styles.calmHead} cy="-26" r="24" />
            <path className={styles.calmBody} d="M-30 62V14C-30 -6 30 -6 30 14V62" />
            <circle className={styles.calmBreath} cy="30" r="10">
              <animate
                attributeName="r"
                dur="5.6s"
                keyTimes="0;0.5;1"
                repeatCount="indefinite"
                values="8;13;8"
              />
            </circle>
          </g>
          <g className={styles.calmSteps} transform="translate(190 76)">
            <rect height="150" rx="18" width="118" x="-14" y="-18" />
            {["PAUSE", "BREATHE", "FOLLOW PLAN"].map((step, index) => (
              <g key={step} transform={`translate(0 ${index * 44})`}>
                <circle className={styles.calmStepDot} cx="6" cy="12" r="6">
                  <animate
                    attributeName="r"
                    begin={`${index * 1.85}s`}
                    dur="5.6s"
                    keyTimes="0;0.15;0.35;1"
                    repeatCount="indefinite"
                    values="5;9;5;5"
                  />
                </circle>
                <text className={styles.calmStepLabel} x="22" y="17">
                  {step}
                </text>
              </g>
            ))}
          </g>
          <text className={styles.panelAction} textAnchor="middle" x="165" y="276">
            A SLOW BREATH MAKES THE NEXT STEP CLEARER
          </text>
        </g>
        <text className={styles.motionCaption} textAnchor="middle" x="410" y="416">
          PAUSE · BREATHE · FOLLOW YOUR PLAN
        </text>
      </svg>
      <figcaption className={styles.figureCaption}>
        <strong>The smoke detector idea:</strong> an alarm while cooking gets your attention—it does
        not mean the house is burning down. Blood sugar signals work the same way: they say “pay
        attention,” and your plan says what to do next.
      </figcaption>
    </figure>
  );
}

export function DayNineExperience({ lesson: experience }: { lesson: LessonPlayerViewModel }) {
  const router = useRouter();
  const [stage, setStage] = useState(0);
  const [openingFeeling, setOpeningFeeling] = useState<string | null>(null);
  const [causesOpened, setCausesOpened] = useState<Set<HighCauseId>>(() => new Set());
  const [activeCause, setActiveCause] = useState<HighCauseId | null>(null);
  const [lowRiskChoice, setLowRiskChoice] = useState<string | null>(null);
  const [sorterPlacements, setSorterPlacements] = useState<
    Partial<Record<SymptomId, "high" | "low">>
  >({});
  const [urgentOpened, setUrgentOpened] = useState<Set<UrgentSignalId>>(() => new Set());
  const [planChecked, setPlanChecked] = useState<Set<PlanItemId>>(() => new Set());
  const [supportPerson, setSupportPerson] = useState<string | null>(null);
  const [reflection, setReflection] = useState<(typeof reflections)[number] | null>(null);
  const [evaluations, setEvaluations] = useState<
    Partial<Record<"highUrgent" | "lowResponse" | "teachBack", DayNineEvaluationFeedback>>
  >({});
  const [selectedAnswers, setSelectedAnswers] = useState<
    Partial<Record<"highUrgent" | "lowResponse" | "teachBack", string>>
  >({});
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const stageRef = useRef<HTMLDivElement>(null);
  const storageKey = `health-decoded:day-nine:${experience.lessonProgressId}`;

  const sortedCount = Object.keys(sorterPlacements).length;
  const allSorted = sortedCount === symptomCards.length;

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
    key: "highUrgent" | "lowResponse" | "teachBack",
    answer: string,
  ) {
    setSelectedAnswers((current) => ({ ...current, [key]: answer }));
    const result = await evaluateDayNineAction(input);
    if (result.ok) setEvaluations((current) => ({ ...current, [key]: result.data }));
    else setMessage(result.message);
  }

  function canContinue() {
    if (stage === 0) return openingFeeling !== null;
    if (stage === 1) return causesOpened.size >= 4;
    if (stage === 2) return lowRiskChoice !== null;
    if (stage === 3) return allSorted;
    if (stage === 4) return Boolean(evaluations.lowResponse);
    if (stage === 5) return urgentOpened.size >= 4 && Boolean(evaluations.highUrgent);
    if (stage === 6) return planChecked.size >= 3;
    if (stage === 7) return reflection !== null && Boolean(evaluations.teachBack);
    return true;
  }

  function stageRequirement() {
    return [
      "Choose how today’s topic feels right now.",
      "Open at least four everyday reasons glucose can run high.",
      "Choose the statement about who experiences lows.",
      "Place all six signals on the high or low side.",
      "Choose the safest first response to a possible low.",
      "Open at least four urgent signals and choose the response.",
      "Check off at least three parts of your simple plan.",
      "Choose one reflection and complete the teach-back.",
    ][stage];
  }

  function continueLabel() {
    return (
      [
        "Meet high blood sugar",
        "Meet low blood sugar",
        "Sort the signals",
        "Practice responding to a low",
        "Know when high needs more",
        "Build your simple plan",
        "Practice staying calm",
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
              <LessonHeading label="Day 09 · Highs, lows, and knowing when to act">
                Preparedness is quieter than panic—and far more useful.
              </LessonHeading>
              <div className="border-l-2 border-accent-warm pl-6">
                <p className="editorial-number text-accent-warm">09</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Most changes in blood sugar are not emergencies. Today is about recognizing
                  signals early and knowing your next step.
                </p>
              </div>
            </div>
            <SteadyBalanceAnimation />
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
                Whatever you chose is a reasonable place to start. Knowledge replaces fear—by the
                end of today you will know what to watch for and when to ask for help.
              </p>
            ) : null}
          </div>
        );
      case 1:
        return (
          <div className="space-y-9">
            <LessonHeading label="Hyperglycemia, in plain language">
              High blood sugar means more glucose than the body can comfortably use.
            </LessonHeading>
            <SlowTideAnimation />
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              One high reading rarely means something is seriously wrong—care teams pay far more
              attention to repeated patterns. Open the everyday reasons glucose can drift higher.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {highCauses.map((cause) => {
                const opened = causesOpened.has(cause.id);
                return (
                  <button
                    aria-pressed={opened}
                    className={cn(styles.causeCard, opened && styles.causeCardOpen)}
                    key={cause.id}
                    onClick={() => {
                      setCausesOpened((current) => new Set([...current, cause.id]));
                      setActiveCause(cause.id);
                    }}
                    type="button"
                  >
                    <span>{opened ? "OPENED" : "TAP TO OPEN"}</span>
                    <strong>{cause.label}</strong>
                    <p>{opened ? cause.body : "What might this mean for glucose?"}</p>
                  </button>
                );
              })}
            </div>
            {activeCause ? (
              <p className="animate-slide-up border-l-2 border-success bg-info p-5 leading-7">
                {highCauses.find((cause) => cause.id === activeCause)?.body} None of these reasons
                are moral verdicts—they are context for a conversation with your care team.
              </p>
            ) : null}
          </div>
        );
      case 2:
        return (
          <div className="space-y-9">
            <LessonHeading label="Hypoglycemia, in plain language">
              Low blood sugar is the body running short on fuel it needs right now.
            </LessonHeading>
            <QuickBellAnimation />
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              For many people with Type 2 diabetes, lows are much less common than highs. Who is
              more likely to experience them?
            </p>
            <div className="grid gap-3 md:grid-cols-3">
              {lowRiskChoices.map(([id, label]) => (
                <AnswerChoice
                  key={id}
                  onClick={() => setLowRiskChoice(id)}
                  selected={lowRiskChoice === id}
                >
                  {label}
                </AnswerChoice>
              ))}
            </div>
            {lowRiskChoice ? (
              <p
                className={cn(
                  "animate-slide-up border-l-2 p-5 leading-7",
                  lowRiskChoice === "medications"
                    ? "border-success bg-info"
                    : "border-warning bg-warning/10",
                )}
              >
                {lowRiskChoice === "medications"
                  ? "Exactly. Some diabetes medications can increase the chance of a low; others rarely cause lows on their own. Your healthcare provider explains your personal level of risk."
                  : "Not quite—risk is not the same for everyone, and lows are not limited to one medication. It depends largely on which medications someone takes, which is why your care team explains your personal risk."}
              </p>
            ) : null}
          </div>
        );
      case 3:
        return (
          <div className="space-y-9">
            <LessonHeading label="Signal sorter">
              High and low blood sugar feel different. Practice telling them apart.
            </LessonHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              For each signal, choose whether it more often belongs with high or low blood sugar.
              Bodies differ—this is common-pattern practice, not a diagnosis.
            </p>
            <div className="space-y-3">
              {symptomCards.map((card) => {
                const placement = sorterPlacements[card.id];
                const placed = placement !== undefined;
                const correct = placement === card.side;
                return (
                  <div
                    className={cn(
                      styles.sorterRow,
                      placed && (correct ? styles.sorterRowCorrect : styles.sorterRowGentle),
                    )}
                    key={card.id}
                  >
                    <p>{card.label}</p>
                    <div>
                      {(["high", "low"] as const).map((side) => (
                        <button
                          aria-pressed={placement === side}
                          className={cn(
                            styles.sorterButton,
                            placement === side &&
                              (side === "high" ? styles.sorterButtonHigh : styles.sorterButtonLow),
                          )}
                          key={side}
                          onClick={() =>
                            setSorterPlacements((current) => ({ ...current, [card.id]: side }))
                          }
                          type="button"
                        >
                          {side === "high" ? "Often high" : "Often low"}
                        </button>
                      ))}
                    </div>
                    <p aria-live="polite" className={styles.sorterVerdict}>
                      {placed
                        ? correct
                          ? sorterConfirmation(card.side)
                          : sorterCorrection(card.side)
                        : "Choose a side."}
                    </p>
                  </div>
                );
              })}
            </div>
            {allSorted ? (
              <div className={cn("animate-slide-up", styles.symptomChart)}>
                <div>
                  <p>OFTEN WITH HIGH · USUALLY GRADUAL</p>
                  <ul>
                    <li>Feeling very thirsty</li>
                    <li>Needing to urinate more often</li>
                    <li>Dry mouth · tiredness · headaches</li>
                    <li>Blurry vision</li>
                  </ul>
                </div>
                <div>
                  <p>OFTEN WITH LOW · USUALLY QUICK</p>
                  <ul>
                    <li>Feeling shaky or sweaty</li>
                    <li>Hunger · dizziness · anxiety</li>
                    <li>A fast heartbeat</li>
                    <li>Difficulty concentrating or confusion</li>
                  </ul>
                </div>
              </div>
            ) : null}
          </div>
        );
      case 4:
        return (
          <div className="space-y-9">
            <LessonHeading label="Practice a calm response">
              You feel shaky and sweaty between meals. What comes first?
            </LessonHeading>
            <div className="grid gap-3 md:grid-cols-3">
              {(
                [
                  [
                    "follow_plan",
                    "Follow the plan your care team gave you—and check your blood sugar if they asked you to.",
                  ],
                  ["wait_it_out", "Ignore it and wait for the feeling to pass on its own."],
                  ["exercise_through", "Head out for a brisk walk to burn through it."],
                ] as const
              ).map(([answer, label]) => (
                <AnswerChoice
                  key={answer}
                  onClick={() => evaluate({ answer, stage: "low_response" }, "lowResponse", answer)}
                  selected={selectedAnswers.lowResponse === answer}
                >
                  {label}
                </AnswerChoice>
              ))}
            </div>
            {evaluations.lowResponse ? <Feedback feedback={evaluations.lowResponse} /> : null}
            {evaluations.lowResponse?.accurate ? (
              <div className="animate-slide-up border-y border-border py-8">
                <p className="font-serif-display text-3xl">
                  Afterwards, become a gentle detective.
                </p>
                <p className="mt-3 max-w-3xl leading-8 text-muted-foreground">
                  Many care plans include a fast-acting carbohydrate for mild lows—the exact steps
                  belong to your personal plan. Once things feel steady, look back with curiosity,
                  not blame:
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {lowClues.map(([id, label]) => (
                    <span className={styles.clueChip} key={id}>
                      <CircleHelp aria-hidden="true" className="size-4" /> {label}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        );
      case 5:
        return (
          <div className="space-y-9">
            <LessonHeading label="When high needs more attention">
              A few uncommon signals skip the wait-and-see step.
            </LessonHeading>
            <ActionPathAnimation />
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Most high readings are managed by following your care team’s recommendations. Open the
              signals that deserve prompt medical care instead of waiting.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {urgentSignals.map(([id, label]) => {
                const opened = urgentOpened.has(id);
                return (
                  <button
                    aria-pressed={opened}
                    className={cn(styles.urgentChip, opened && styles.urgentChipOpen)}
                    key={id}
                    onClick={() => setUrgentOpened((current) => new Set([...current, id]))}
                    type="button"
                  >
                    <ShieldCheck aria-hidden="true" className="size-5" />
                    <span>{label}</span>
                    {opened ? <Check aria-hidden="true" className="size-4" /> : null}
                  </button>
                );
              })}
            </div>
            <div className="border-y border-border py-8">
              <p className="font-serif-display text-3xl">
                Your blood sugar has stayed high, and now you cannot keep liquids down.
              </p>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {(
                  [
                    [
                      "prompt_care",
                      "Seek medical care promptly—this is what urgent signals are for.",
                    ],
                    ["wait_days", "Wait a few days to see whether it settles."],
                    ["online_forums", "Compare your symptoms with strangers online first."],
                  ] as const
                ).map(([answer, label]) => (
                  <AnswerChoice
                    key={answer}
                    onClick={() => evaluate({ answer, stage: "high_urgent" }, "highUrgent", answer)}
                    selected={selectedAnswers.highUrgent === answer}
                  >
                    {label}
                  </AnswerChoice>
                ))}
              </div>
            </div>
            {evaluations.highUrgent ? <Feedback feedback={evaluations.highUrgent} /> : null}
          </div>
        );
      case 6:
        return (
          <div className="space-y-9">
            <LessonHeading label="A simple plan beats a complicated binder">
              Preparedness is mostly knowing four small things.
            </LessonHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Check off what is already true—or what you would like to set up this week. This stays
              in your browser; it is a thinking tool, not a medical record.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {planItems.map(([id, label]) => {
                const checked = planChecked.has(id);
                return (
                  <button
                    aria-pressed={checked}
                    className={cn(styles.planChip, checked && styles.planChipChecked)}
                    key={id}
                    onClick={() =>
                      setPlanChecked((current) => {
                        const next = new Set(current);
                        if (next.has(id)) next.delete(id);
                        else next.add(id);
                        return next;
                      })
                    }
                    type="button"
                  >
                    <span aria-hidden="true">{checked ? <Check className="size-4" /> : null}</span>
                    {label}
                  </button>
                );
              })}
            </div>
            <div className="border-y border-border py-8">
              <p className="font-serif-display text-3xl">Let one person in.</p>
              <p className="mt-3 max-w-3xl leading-8 text-muted-foreground">
                The people around you do not need to become diabetes experts. It simply helps if
                someone close to you knows the signals and when to encourage you to seek help.
                Support is not lost independence.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                {supportPeople.map(([id, label]) => (
                  <button
                    aria-pressed={supportPerson === id}
                    className={cn(
                      styles.supportChip,
                      supportPerson === id && styles.supportChipSelected,
                    )}
                    key={id}
                    onClick={() => setSupportPerson(id)}
                    type="button"
                  >
                    <Heart aria-hidden="true" className="size-4" />
                    {label}
                  </button>
                ))}
              </div>
              {supportPerson ? (
                <p className="mt-4 animate-slide-up border-l-2 border-success bg-info p-4 leading-7">
                  A lovely choice. Sharing what you learned today—even five minutes of it—turns a
                  private worry into a shared plan.
                </p>
              ) : null}
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-9">
            <LessonHeading label="Stay calm first">
              The alarm gets your attention. It does not decide what happens next.
            </LessonHeading>
            <SteadyHandAnimation />
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
                A friend says: “If my blood sugar changes, I’ll have no idea what to do.” Which
                reply carries today’s lesson?
              </p>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {(
                  [
                    [
                      "prepared_not_panicked",
                      "Most changes are manageable—learn your signals, follow your care team’s plan, and get help when symptoms are severe or don’t improve.",
                    ],
                    [
                      "every_change_emergency",
                      "Treat every change as an emergency, just to be safe.",
                    ],
                    ["handle_alone", "You’ll be fine as long as you handle everything yourself."],
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
            <p className="editorial-eyebrow">Day 9 complete</p>
            <LessonHeading>
              Knowing what to do is more powerful than being afraid of what might happen.
            </LessonHeading>
            <div className="mx-auto max-w-3xl border-y border-border py-9 text-left">
              <p className="editorial-eyebrow text-success">Three ideas worth carrying</p>
              <ol className="mt-6 space-y-6">
                {[
                  "High and low blood sugar feel different: highs often build slowly with thirst and tiredness, while lows tend to announce themselves quickly.",
                  "Most changes are not emergencies. Pause, follow the plan your care team gave you, and reach out early when something stays off.",
                  "Urgent signals are uncommon—and recognizing them is preparedness, not fear. Prompt medical care exists exactly for those moments.",
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
                  Routines that make diabetes easier
                </h2>
                <p className="mt-2 leading-7 text-muted-foreground">
                  Small, consistent habits reduce decision fatigue and help diabetes fit into your
                  life—rather than take it over.
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
              {experience.accessMode === "review" ? "Return to journey" : "Complete Day 9"}
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
            <p className="text-sm font-semibold text-accent-warm">Day 9</p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Highs, Lows, and Knowing When to Act
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
            label={`Day 9 chapter ${stage + 1} of ${stageCount}`}
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
        title="Leave Day 9 for now?"
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
        title="Day 9 glossary"
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
