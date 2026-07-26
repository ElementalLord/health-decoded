"use client";

import {
  ArrowLeft,
  BookOpen,
  Check,
  HeartHandshake,
  MessageCircleHeart,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  evaluateDayThirteenAction,
  type DayThirteenEvaluationFeedback,
} from "@/features/lessons/actions/day-thirteen.actions";
import { completeLessonAction } from "@/features/lessons/actions/lesson-completion.actions";
import { saveLessonPositionAction } from "@/features/lessons/actions/lesson-progress.actions";
import { LessonStoryImage } from "@/features/lessons/components/lesson-story-image";
import styles from "@/features/lessons/components/day-thirteen-experience.module.css";
import type { LessonPlayerViewModel } from "@/features/lessons/types/lesson-player";
import { cn } from "@/lib/utils";

const stageCount = 11;

const openingFeelings = [
  ["held", "I already have someone who listens"],
  ["careful", "I want support without being watched"],
  ["private", "I am deciding what I want to share"],
  ["alone", "I have been carrying more than people know"],
] as const;

const identityIdeas = [
  "a parent, partner, or caregiver",
  "a loyal friend",
  "a maker, artist, or problem solver",
  "someone who loves food and culture",
  "a person with plans for the future",
] as const;

const stigmaMoments = [
  {
    id: "blame",
    comment: "“You brought this on yourself.”",
    right: "Dignity",
    truth:
      "Type 2 diabetes is not a character verdict. Blame does not explain a complex condition, and shame does not make care easier.",
  },
  {
    id: "food",
    comment: "“Should you really eat that?”",
    right: "Choice",
    truth:
      "A diagnosis does not make someone’s plate public property. Concern still needs consent.",
  },
  {
    id: "privacy",
    comment: "“Tell me your number. I’m only trying to help.”",
    right: "Privacy",
    truth:
      "A person can ask for support without sharing every reading, appointment, or treatment detail.",
  },
  {
    id: "joke",
    comment: "“It was just a joke.”",
    right: "Impact",
    truth:
      "Intent and impact are different. The person affected may name what hurt and decide whether the conversation continues.",
  },
] as const;
type StigmaMomentId = (typeof stigmaMoments)[number]["id"];

const supportModes = [
  {
    action: "Stay beside me for ten quiet minutes.",
    id: "listen",
    label: "Listen",
    note: "Presence before advice",
  },
  {
    action: "Come with me while I take a short walk.",
    id: "company",
    label: "Keep me company",
    note: "Together without supervising",
  },
  {
    action: "Help me write one question for my next visit.",
    id: "practical",
    label: "Help with one task",
    note: "Specific and chosen",
  },
  {
    action: "Give me some quiet, then check in later.",
    id: "space",
    label: "Give me space",
    note: "A no can still be connection",
  },
] as const;
type SupportModeId = (typeof supportModes)[number]["id"];

const supportPeople = [
  ["friend", "a trusted friend"],
  ["partner", "my partner or spouse"],
  ["family", "a family member"],
  ["care_team", "someone on my healthcare team"],
] as const;
type SupportPersonId = (typeof supportPeople)[number][0];

const requestActions = [
  "listen for ten minutes without giving advice",
  "join me for one comfortable walk this week",
  "help me write one question before my next visit",
  "learn one thing with me instead of guessing",
] as const;

const boundaryScenarios = [
  {
    boundary: "“I know you care about me. Please don’t monitor my plate. I’ll ask if I want help.”",
    comment: "“Should you really eat that?”",
    id: "meal",
    setting: "At a family meal",
  },
  {
    boundary:
      "“Diabetes is more complex than that joke. I don’t want my health used as a punchline.”",
    comment: "“Guess you had too much sugar.”",
    id: "work",
    setting: "With a coworker",
  },
  {
    boundary: "“I’m keeping my readings private. You can ask how I’m feeling instead.”",
    comment: "“What was your number?”",
    id: "friend",
    setting: "With a friend",
  },
] as const;
type BoundaryScenarioId = (typeof boundaryScenarios)[number]["id"];

const supportSeats = [
  {
    id: "chosen",
    label: "A person I choose",
    note: "Someone who can listen, share an ordinary moment, or help with one practical task.",
  },
  {
    id: "care",
    label: "My care team",
    note: "A clinician, pharmacist, or diabetes educator who can help with medical questions.",
  },
  {
    id: "community",
    label: "A community",
    note: "Peers, neighbors, faith communities, or trusted groups that can make experience feel shared.",
  },
] as const;
type SupportSeatId = (typeof supportSeats)[number]["id"];

const repairSteps = [
  {
    id: "impact",
    label: "Name the impact",
    script: "“I know you meant to help, but that made me feel watched.”",
  },
  {
    id: "need",
    label: "Restate the need",
    script: "“What I need right now is listening, not advice.”",
  },
  {
    id: "pause",
    label: "Take a pause",
    script: "“I want to stop here. We can try this conversation another time.”",
  },
] as const;
type RepairStepId = (typeof repairSteps)[number]["id"];

const wellbeingOptions = [
  "A quiet check-in from someone I trust",
  "Company for an ordinary activity",
  "Time alone without having to explain",
  "A conversation with my care team",
] as const;

const glossary = [
  {
    definition:
      "Negative assumptions or judgments attached to a condition. Stigma can come from other people or become a story someone turns against themselves.",
    term: "Stigma",
  },
  {
    definition:
      "The emotional strain of managing diabetes over time. It is common, real, and worth discussing with a healthcare professional.",
    term: "Diabetes distress",
  },
  {
    definition:
      "The people, professionals, and communities a person chooses to involve in ways that make care more manageable.",
    term: "Support system",
  },
  {
    definition:
      "A clear limit that protects privacy, choice, emotional safety, or the kind of help a person is willing to receive.",
    term: "Boundary",
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

function Feedback({ feedback }: { feedback: DayThirteenEvaluationFeedback }) {
  return (
    <div
      aria-live="polite"
      className={cn(
        styles.feedback,
        feedback.accurate ? styles.feedbackAccurate : styles.feedbackTry,
      )}
      role="status"
    >
      <MessageCircleHeart aria-hidden="true" />
      <div>
        <p className="font-serif-display text-2xl italic">{feedback.heading}</p>
        <p className="mt-2 leading-7">{feedback.body}</p>
      </div>
    </div>
  );
}

function SharedLoadAnimation() {
  return (
    <figure className={styles.motionFigure} data-motion-loop="continuous">
      <svg
        aria-labelledby="shared-load-title shared-load-description"
        className={styles.motionCanvas}
        role="img"
        viewBox="0 0 900 430"
      >
        <title id="shared-load-title">One chosen task becomes shared</title>
        <desc id="shared-load-description">
          Two friends pause on a walk. One asks before taking one grocery bag. The other person
          keeps their second bag and their direction.
        </desc>
        <rect fill="#eef4f0" height="430" width="900" />
        <circle cx="770" cy="78" fill="#edca8c" opacity=".72" r="42">
          <animate attributeName="opacity" dur="5s" repeatCount="indefinite" values=".54;.82;.54" />
        </circle>
        <path d="M0 335 Q210 310 430 334 T900 327" fill="none" stroke="#a9bcae" strokeWidth="5" />
        <path d="M92 336 Q133 273 174 336" fill="#dce7df" />
        <path d="M715 330 Q767 252 819 330" fill="#dce7df" />

        <g>
          <animateTransform
            attributeName="transform"
            dur="4.8s"
            repeatCount="indefinite"
            type="translate"
            values="0 0;0 -3;0 0"
          />
          <circle cx="330" cy="170" fill="#e5aa88" r="31" />
          <path d="M294 173 Q327 119 361 173" fill="#4c665e" />
          <path d="M286 307 Q293 202 330 202 Q367 202 374 307" fill="#c8785f" />
          <path d="M303 304 L282 365" stroke="#805f51" strokeLinecap="round" strokeWidth="13" />
          <path d="M354 304 L377 365" stroke="#805f51" strokeLinecap="round" strokeWidth="13" />
          <path
            d="M295 231 Q256 248 240 277"
            fill="none"
            stroke="#c8785f"
            strokeLinecap="round"
            strokeWidth="13"
          />
        </g>

        <g>
          <animateTransform
            attributeName="transform"
            dur="4.8s"
            repeatCount="indefinite"
            type="translate"
            values="0 0;0 -3;0 0"
          />
          <circle cx="585" cy="170" fill="#d6a179" r="31" />
          <path d="M548 170 Q583 113 620 170" fill="#7c553f" />
          <path d="M541 307 Q548 202 585 202 Q622 202 629 307" fill="#6c9681" />
          <path d="M557 304 L539 365" stroke="#4d6a5d" strokeLinecap="round" strokeWidth="13" />
          <path d="M611 304 L635 365" stroke="#4d6a5d" strokeLinecap="round" strokeWidth="13" />
          <g transform="rotate(0 550 235)">
            <animateTransform
              attributeName="transform"
              dur="9s"
              keyTimes="0;0.18;0.4;0.74;1"
              repeatCount="indefinite"
              type="rotate"
              values="0 550 235;-18 550 235;-18 550 235;0 550 235;0 550 235"
            />
            <path
              d="M550 225 Q520 250 500 271"
              fill="none"
              stroke="#6c9681"
              strokeLinecap="round"
              strokeWidth="13"
            />
          </g>
        </g>

        <g>
          <rect fill="#e4b878" height="68" rx="7" width="70" x="245" y="273" />
          <path d="M258 279 Q280 249 302 279" fill="none" stroke="#9d714a" strokeWidth="6" />
        </g>
        <g>
          <animateTransform
            attributeName="transform"
            dur="9s"
            keyTimes="0;0.18;0.44;0.78;1"
            repeatCount="indefinite"
            type="translate"
            values="0 0;0 0;230 -6;230 -6;0 0"
          />
          <rect fill="#efd7b0" height="68" rx="7" width="70" x="322" y="273" />
          <path d="M335 279 Q357 249 379 279" fill="none" stroke="#9d714a" strokeWidth="6" />
        </g>

        <g>
          <animate
            attributeName="opacity"
            dur="9s"
            keyTimes="0;0.1;0.31;0.4;1"
            repeatCount="indefinite"
            values="0;1;1;0;0"
          />
          <rect fill="#fffaf2" height="55" rx="8" stroke="#b8c8bd" width="196" x="472" y="73" />
          <text
            fill="#405750"
            fontFamily="sans-serif"
            fontSize="16"
            fontWeight="700"
            x="494"
            y="106"
          >
            Would one thing help?
          </text>
        </g>
        <g>
          <animate
            attributeName="opacity"
            dur="9s"
            keyTimes="0;0.28;0.38;0.63;0.72;1"
            repeatCount="indefinite"
            values="0;0;1;1;0;0"
          />
          <rect fill="#fffaf2" height="55" rx="8" stroke="#d6b291" width="154" x="252" y="79" />
          <text
            fill="#6f5144"
            fontFamily="sans-serif"
            fontSize="16"
            fontWeight="700"
            x="277"
            y="112"
          >
            Yes, this one.
          </text>
        </g>
      </svg>
      <figcaption className={styles.figureCaption}>
        <strong>What to notice:</strong> permission comes first. One chosen task changes hands; the
        person keeps ownership of the plan.
      </figcaption>
    </figure>
  );
}

function ConsentConversationAnimation({ mode }: { mode: SupportModeId }) {
  const selected = supportModes.find((item) => item.id === mode) ?? supportModes[0];

  return (
    <figure className={styles.motionFigure} data-motion-loop="continuous">
      <div className={styles.motionIntro}>
        <p className="editorial-eyebrow">A conversation you can reuse</p>
        <h2>Ask. Listen. Offer. Check.</h2>
        <p>Useful support changes with the person and the day. The helper does not guess.</p>
      </div>
      <svg
        aria-labelledby="consent-title consent-description"
        className={styles.motionCanvas}
        role="img"
        viewBox="0 0 900 390"
      >
        <title id="consent-title">A permission-first conversation at a kitchen table</title>
        <desc id="consent-description">
          Two people sit together. One asks, waits while the other speaks, and then offers the
          selected kind of support.
        </desc>
        <rect fill="#f3eee5" height="390" width="900" />
        <rect fill="#dce9e3" height="98" rx="8" stroke="#9db4aa" width="172" x="90" y="55" />
        <circle cx="177" cy="104" fill="#edca8c" r="25">
          <animate attributeName="r" dur="5s" repeatCount="indefinite" values="23;27;23" />
        </circle>
        <path d="M450 265 H790" stroke="#826e5e" strokeLinecap="round" strokeWidth="14" />
        <path
          d="M503 266 L482 355 M739 266 L758 355"
          stroke="#826e5e"
          strokeLinecap="round"
          strokeWidth="11"
        />
        <ellipse cx="622" cy="252" fill="#f0ddbf" rx="54" ry="11" />
        <path
          d="M612 203 H648 V244 Q630 259 612 244 Z"
          fill="#f8f2e7"
          stroke="#8da89a"
          strokeWidth="4"
        />
        <path
          d="M620 199 Q609 181 622 167"
          fill="none"
          stroke="#a8bcae"
          strokeLinecap="round"
          strokeWidth="4"
        >
          <animate
            attributeName="d"
            dur="3.4s"
            repeatCount="indefinite"
            values="M620 199 Q609 181 622 167;M620 199 Q635 181 622 163;M620 199 Q609 181 622 167"
          />
        </path>
        <path
          d="M635 199 Q650 181 638 165"
          fill="none"
          stroke="#a8bcae"
          strokeLinecap="round"
          strokeWidth="4"
        >
          <animate attributeName="opacity" dur="3.4s" repeatCount="indefinite" values=".35;1;.35" />
        </path>

        <g>
          <circle cx="354" cy="150" fill="#e4a682" r="31" />
          <path d="M318 151 Q352 98 390 153" fill="#52675f" />
          <path d="M311 279 Q316 184 354 184 Q392 184 398 279" fill="#c97760" />
          <path
            d="M332 274 L317 352 M380 274 L397 352"
            stroke="#805e4f"
            strokeLinecap="round"
            strokeWidth="12"
          />
          <path
            d="M388 212 Q434 214 458 238"
            fill="none"
            stroke="#c97760"
            strokeLinecap="round"
            strokeWidth="12"
          />
        </g>

        <g>
          <animateTransform
            attributeName="transform"
            dur="8s"
            keyTimes="0;0.32;0.5;0.68;1"
            repeatCount="indefinite"
            type="rotate"
            values="0 575 150;0 575 150;4 575 150;-3 575 150;0 575 150"
          />
          <circle cx="575" cy="150" fill="#d7a27a" r="31" />
          <path d="M537 150 Q573 91 613 151" fill="#7b543f" />
          <path d="M532 279 Q537 184 575 184 Q613 184 618 279" fill="#709582" />
          <path
            d="M551 274 L535 352 M598 274 L618 352"
            stroke="#4e6a5e"
            strokeLinecap="round"
            strokeWidth="12"
          />
        </g>

        <g>
          <animate
            attributeName="opacity"
            dur="8s"
            keyTimes="0;0.08;0.27;0.36;1"
            repeatCount="indefinite"
            values="0;1;1;0;0"
          />
          <rect fill="#fffaf2" height="56" rx="8" stroke="#b7c7bd" width="202" x="245" y="47" />
          <text
            fill="#405750"
            fontFamily="sans-serif"
            fontSize="17"
            fontWeight="700"
            x="273"
            y="81"
          >
            What would help?
          </text>
        </g>
        <g>
          <animate
            attributeName="opacity"
            dur="8s"
            keyTimes="0;0.29;0.38;0.62;0.72;1"
            repeatCount="indefinite"
            values="0;0;1;1;0;0"
          />
          <rect fill="#fffaf2" height="56" rx="8" stroke="#d2ad8f" width="205" x="515" y="56" />
          <text
            fill="#6f5144"
            fontFamily="sans-serif"
            fontSize="16"
            fontWeight="700"
            x="540"
            y="90"
          >
            {selected.label}, please.
          </text>
        </g>
        <circle cx="470" cy="174" fill="#c97961" r="7">
          <animate attributeName="opacity" dur="2.4s" repeatCount="indefinite" values=".2;1;.2" />
        </circle>
      </svg>
      <div aria-live="polite" className={styles.motionTranscript}>
        <span>What was chosen</span>
        <strong>{selected.action}</strong>
      </div>
      <figcaption className={styles.figureCaption}>
        <strong>What to notice:</strong> the pause is part of the help. Listening gives the other
        person room to name what fits.
      </figcaption>
    </figure>
  );
}

function BoundaryConversationAnimation({
  scenario,
}: {
  scenario: (typeof boundaryScenarios)[number];
}) {
  return (
    <figure className={styles.motionFigure} data-motion-loop="continuous">
      <div className={styles.motionIntro}>
        <p className="editorial-eyebrow">A boundary in motion</p>
        <h2>A clear limit makes room for a better way to care.</h2>
        <p>The boundary is brief. It does not become a debate or a medical lecture.</p>
      </div>
      <svg
        aria-labelledby="boundary-title boundary-description"
        className={styles.motionCanvas}
        role="img"
        viewBox="0 0 900 380"
      >
        <title id="boundary-title">A family meal changes after a clear boundary</title>
        <desc id="boundary-description">
          One person points toward a plate. The other raises a calm hand. The pointing hand lowers,
          and both people return to sharing the meal respectfully.
        </desc>
        <rect fill="#edf3f0" height="380" width="900" />
        <rect fill="#f8ead8" height="102" rx="8" stroke="#d5b99c" width="155" x="92" y="48" />
        <path d="M142 125 Q170 75 198 125" fill="#8aa694" />
        <circle cx="170" cy="90" fill="#e8c682" r="19" />
        <path
          d="M178 71 Q166 54 178 37"
          fill="none"
          stroke="#728f7e"
          strokeLinecap="round"
          strokeWidth="5"
        >
          <animateTransform
            attributeName="transform"
            dur="5s"
            repeatCount="indefinite"
            type="rotate"
            values="-4 178 71;5 178 71;-4 178 71"
          />
        </path>
        <path
          d="M201 71 Q190 52 201 34"
          fill="none"
          stroke="#728f7e"
          strokeLinecap="round"
          strokeWidth="5"
        >
          <animateTransform
            attributeName="transform"
            dur="5.6s"
            repeatCount="indefinite"
            type="rotate"
            values="4 201 71;-5 201 71;4 201 71"
          />
        </path>

        <path d="M210 275 H724" stroke="#826e5e" strokeLinecap="round" strokeWidth="15" />
        <path
          d="M266 275 L247 360 M666 275 L686 360"
          stroke="#826e5e"
          strokeLinecap="round"
          strokeWidth="12"
        />
        <ellipse
          cx="451"
          cy="257"
          fill="#f8f1e5"
          rx="74"
          ry="15"
          stroke="#c9af96"
          strokeWidth="3"
        />
        <circle cx="451" cy="255" fill="#83a18f" r="18" />
        <ellipse
          cx="594"
          cy="257"
          fill="#f8f1e5"
          rx="61"
          ry="13"
          stroke="#c9af96"
          strokeWidth="3"
        />

        <g>
          <circle cx="331" cy="145" fill="#e2a681" r="31" />
          <path d="M294 147 Q329 91 368 148" fill="#50675f" />
          <path d="M288 278 Q293 179 331 179 Q369 179 375 278" fill="#c87860" />
          <path
            d="M311 276 L296 356 M354 276 L371 356"
            stroke="#805e4f"
            strokeLinecap="round"
            strokeWidth="12"
          />
          <g>
            <animateTransform
              attributeName="transform"
              dur="8.5s"
              keyTimes="0;0.23;0.44;0.78;1"
              repeatCount="indefinite"
              type="rotate"
              values="0 369 205;-31 369 205;-31 369 205;0 369 205;0 369 205"
            />
            <path
              d="M367 207 Q397 191 417 169"
              fill="none"
              stroke="#c87860"
              strokeLinecap="round"
              strokeWidth="12"
            />
            <path d="M416 169 V145" stroke="#805e4f" strokeLinecap="round" strokeWidth="7" />
          </g>
        </g>

        <g>
          <circle cx="618" cy="145" fill="#d5a078" r="31" />
          <path d="M581 146 Q616 91 655 147" fill="#79513e" />
          <path d="M575 278 Q580 179 618 179 Q656 179 662 278" fill="#6d9480" />
          <path
            d="M597 276 L582 356 M642 276 L658 356"
            stroke="#4d695d"
            strokeLinecap="round"
            strokeWidth="12"
          />
          <g>
            <animateTransform
              attributeName="transform"
              dur="8.5s"
              keyTimes="0;0.2;0.34;0.66;0.78;1"
              repeatCount="indefinite"
              type="rotate"
              values="0 579 207;0 579 207;34 579 207;34 579 207;0 579 207;0 579 207"
            />
            <path
              d="M580 208 Q548 195 531 174"
              fill="none"
              stroke="#6d9480"
              strokeLinecap="round"
              strokeWidth="12"
            />
            <path d="M531 174 V145" stroke="#4d695d" strokeLinecap="round" strokeWidth="7" />
          </g>
        </g>
        <circle cx="474" cy="191" fill="#e7b375" r="8">
          <animate attributeName="opacity" dur="2.8s" repeatCount="indefinite" values=".25;1;.25" />
        </circle>
      </svg>
      <div className={styles.boundaryTranscript}>
        <div>
          <span>What landed</span>
          <p>{scenario.comment}</p>
        </div>
        <div>
          <span>The calm limit</span>
          <p>{scenario.boundary}</p>
        </div>
      </div>
      <figcaption className={styles.figureCaption}>
        <strong>What to notice:</strong> the learner does not prove, apologize, or explain every
        detail. The unwanted behavior stops; the relationship can choose a better next move.
      </figcaption>
    </figure>
  );
}

function SupportTableAnimation({ activeSeat }: { activeSeat: SupportSeatId }) {
  const active = supportSeats.find((item) => item.id === activeSeat) ?? supportSeats[0];
  const activeIndex = supportSeats.findIndex((item) => item.id === activeSeat);

  return (
    <figure className={styles.motionFigure} data-motion-loop="continuous">
      <svg
        aria-labelledby="support-table-title support-table-description"
        className={styles.motionCanvas}
        role="img"
        viewBox="0 0 900 430"
      >
        <title id="support-table-title">A support table with different invited people</title>
        <desc id="support-table-description">
          The learner sits at a table. A chosen person, a care professional, and a community peer
          each approach a different seat. The selected kind of support is highlighted.
        </desc>
        <rect fill="#f2eee6" height="430" width="900" />
        <circle cx="790" cy="76" fill="#edca8c" opacity=".7" r="38">
          <animate attributeName="opacity" dur="5s" repeatCount="indefinite" values=".5;.82;.5" />
        </circle>
        <path d="M0 355 Q225 331 450 354 T900 350" fill="none" stroke="#adbdaf" strokeWidth="5" />
        <ellipse
          cx="450"
          cy="270"
          fill="#dfc29f"
          rx="175"
          ry="61"
          stroke="#9b765a"
          strokeWidth="5"
        />
        <path d="M450 318 V390" stroke="#9b765a" strokeLinecap="round" strokeWidth="18" />

        <g>
          <circle cx="450" cy="115" fill="#dea27c" r="30" />
          <path d="M414 116 Q448 62 487 117" fill="#4f665e" />
          <path d="M407 242 Q414 148 450 148 Q486 148 493 242" fill="#c97961" />
          <path
            d="M425 204 Q451 225 478 204"
            fill="none"
            stroke="#f0c3a4"
            strokeLinecap="round"
            strokeWidth="9"
          >
            <animate
              attributeName="d"
              dur="4s"
              repeatCount="indefinite"
              values="M425 204 Q451 225 478 204;M425 202 Q451 230 478 202;M425 204 Q451 225 478 204"
            />
          </path>
        </g>

        {[
          { color: "#719681", hair: "#76513f", index: 0, x: 188, y: 222 },
          { color: "#7d9daa", hair: "#4f5f62", index: 1, x: 713, y: 222 },
          { color: "#d49372", hair: "#6b5146", index: 2, x: 450, y: 356 },
        ].map((person) => {
          const selected = person.index === activeIndex;
          return (
            <g key={person.index} opacity={selected ? 1 : 0.5}>
              <animateTransform
                attributeName="transform"
                dur={String(4.8 + person.index * 0.5) + "s"}
                repeatCount="indefinite"
                type="translate"
                values="0 4;0 -3;0 4"
              />
              <circle
                cx={person.x}
                cy={person.y - 48}
                fill={selected ? "#edca8c" : "#dce7df"}
                opacity=".5"
                r={selected ? 62 : 48}
              >
                <animate
                  attributeName="r"
                  dur="4s"
                  repeatCount="indefinite"
                  values={selected ? "58;65;58" : "46;50;46"}
                />
              </circle>
              <circle cx={person.x} cy={person.y - 48} fill="#d8a078" r="27" />
              <path
                d={`M${person.x - 32} ${person.y - 47} Q${person.x} ${person.y - 96} ${person.x + 34} ${person.y - 46}`}
                fill={person.hair}
              />
              <path
                d={`M${person.x - 40} ${person.y + 42} Q${person.x - 35} ${person.y - 16} ${person.x} ${person.y - 16} Q${person.x + 35} ${person.y - 16} ${person.x + 40} ${person.y + 42}`}
                fill={person.color}
              />
            </g>
          );
        })}

        <g>
          <rect fill="#fffaf2" height="47" rx="7" stroke="#b3c4b9" width="176" x="362" y="16" />
          <text
            fill="#405750"
            fontFamily="sans-serif"
            fontSize="15"
            fontWeight="800"
            textAnchor="middle"
            x="450"
            y="46"
          >
            YOU CHOOSE THE TABLE
          </text>
          <animate attributeName="opacity" dur="4.2s" repeatCount="indefinite" values=".72;1;.72" />
        </g>
      </svg>
      <div aria-live="polite" className={styles.motionTranscript}>
        <span>{active.label}</span>
        <strong>{active.note}</strong>
      </div>
      <figcaption className={styles.figureCaption}>
        <strong>What to notice:</strong> support is invited by role, not ranked by closeness. No one
        seat has to carry every kind of need.
      </figcaption>
    </figure>
  );
}

export function DayThirteenExperience({ lesson: experience }: { lesson: LessonPlayerViewModel }) {
  const router = useRouter();
  const [stage, setStage] = useState(0);
  const [openingFeeling, setOpeningFeeling] = useState<string | null>(null);
  const [identityIdea, setIdentityIdea] = useState<string | null>(null);
  const [stigmaMoment, setStigmaMoment] = useState<StigmaMomentId>("food");
  const [supportMode, setSupportMode] = useState<SupportModeId>("listen");
  const [supportPerson, setSupportPerson] = useState<SupportPersonId | null>(null);
  const [supportAction, setSupportAction] = useState<string | null>(null);
  const [boundaryScenario, setBoundaryScenario] = useState<BoundaryScenarioId>("meal");
  const [supportSeat, setSupportSeat] = useState<SupportSeatId>("chosen");
  const [repairStep, setRepairStep] = useState<RepairStepId>("impact");
  const [wellbeingChoice, setWellbeingChoice] = useState<string | null>(null);
  const [reflection, setReflection] = useState("");
  const [evaluations, setEvaluations] = useState<
    Partial<
      Record<
        "myth" | "support" | "boundary" | "workplace" | "teachBack",
        DayThirteenEvaluationFeedback
      >
    >
  >({});
  const [selectedAnswers, setSelectedAnswers] = useState<
    Partial<Record<"myth" | "support" | "boundary" | "workplace" | "teachBack", string>>
  >({});
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const stageRef = useRef<HTMLDivElement>(null);
  const storageKey = "health-decoded:day-thirteen:" + experience.lessonProgressId;

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
    key: "myth" | "support" | "boundary" | "workplace" | "teachBack",
    answer: string,
  ) {
    setSelectedAnswers((current) => ({ ...current, [key]: answer }));
    const result = await evaluateDayThirteenAction(input);
    if (result.ok) setEvaluations((current) => ({ ...current, [key]: result.data }));
    else setMessage(result.message);
  }

  const selectedPerson = supportPeople.find(([id]) => id === supportPerson)?.[1];
  const supportRequest =
    selectedPerson && supportAction
      ? "Could you " + supportAction + "? That would feel supportive without taking over."
      : null;
  const activeStigma = stigmaMoments.find((item) => item.id === stigmaMoment) ?? stigmaMoments[0];
  const activeBoundary =
    boundaryScenarios.find((item) => item.id === boundaryScenario) ?? boundaryScenarios[0];
  const activeRepair = repairSteps.find((item) => item.id === repairStep) ?? repairSteps[0];

  function continueLabel() {
    return (
      [
        "Meet the whole person",
        "Name what stigma takes",
        "Practice permission-first support",
        "Make one useful request",
        "Try a calm boundary",
        "Choose what stays private",
        "Invite the right support",
        "Repair a missed moment",
        "Make room for emotional health",
        "Review what you can carry",
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
              <LessonHeading label="Day 13 · Support, stigma, and the people around you">
                The right support makes more room for you.
              </LessonHeading>
              <div className={styles.dayNote}>
                <p className="editorial-number text-accent-warm">13</p>
                <p>
                  Today is about the human side of care: being heard, asking clearly, protecting
                  privacy, and staying yourself around the people who want to help.
                </p>
              </div>
            </div>
            <LessonStoryImage
              alt="A woman speaks openly at her kitchen table while a close friend listens beside her with a gentle hand on her forearm"
              caption="Sometimes the most useful first response is presence: no lecture, no fixing, and no demand to make the moment easier for anyone else."
              emphasis="Listening can make the load feel lighter."
              priority
              src="/lessons/day-13/listening-without-fixing.jpg"
            />
            <div>
              <p className={styles.promptTitle}>How do you want this lesson to meet you?</p>
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
                  ? "You do not need a perfect support system to begin. One safer conversation can change how heavy care feels."
                  : "You can choose an answer, or simply keep going. Nothing personal in this lesson has to be shared."}
              </p>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-9">
            <LessonHeading label="A diagnosis is one chapter">
              Diabetes can belong inside your life without becoming the name of it.
            </LessonHeading>
            <SharedLoadAnimation />
            <div className={styles.editorialPrompt}>
              <div>
                <p className="editorial-eyebrow">Keep the whole person visible</p>
                <h2>I am still…</h2>
                <p>
                  Choose one truth you want the people around you to remember. This is reflection,
                  not a test.
                </p>
              </div>
              <div className={styles.identityList}>
                {identityIdeas.map((idea) => (
                  <AnswerChoice
                    key={idea}
                    onClick={() => setIdentityIdea(idea)}
                    selected={identityIdea === idea}
                  >
                    {idea}
                  </AnswerChoice>
                ))}
              </div>
            </div>
            {identityIdea ? (
              <blockquote className={styles.identityStatement}>
                “I am still {identityIdea}. Diabetes is part of my story, not the whole book.”
              </blockquote>
            ) : null}
          </div>
        );
      case 2:
        return (
          <div className="space-y-9">
            <LessonHeading label="Stigma writes social rules">
              Bring the hidden assumption into the light.
            </LessonHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Stigma can sound like blame, a joke, forced disclosure, or constant monitoring. The
              useful question is not “How do I prove myself?” It is “What right is this comment
              trying to take?”
            </p>
            <div className={styles.stigmaReader}>
              <nav aria-label="Choose a stigmatizing comment to unpack">
                {stigmaMoments.map((item) => (
                  <button
                    aria-pressed={stigmaMoment === item.id}
                    className={cn(styles.textTab, stigmaMoment === item.id && styles.textTabActive)}
                    key={item.id}
                    onClick={() => setStigmaMoment(item.id)}
                    type="button"
                  >
                    {item.comment}
                  </button>
                ))}
              </nav>
              <article aria-live="polite">
                <p className="editorial-eyebrow text-accent-warm">The right that stays yours</p>
                <h2>{activeStigma.right}</h2>
                <p>{activeStigma.truth}</p>
              </article>
            </div>
            <div className={styles.teachBack}>
              <p className="editorial-eyebrow">Try the first response</p>
              <h2>What can someone do when a stigmatizing comment lands?</h2>
              <div className="mt-5 grid gap-3">
                {(
                  [
                    [
                      "name_impact",
                      "Name the impact, set a limit, and choose whether to keep talking.",
                    ],
                    [
                      "prove_worth",
                      "Explain every health decision until the other person approves.",
                    ],
                    ["stay_silent", "Stay silent because good intentions cancel the impact."],
                  ] as const
                ).map(([answer, label]) => (
                  <AnswerChoice
                    key={answer}
                    onClick={() => void evaluate({ answer, stage: "stigma_myth" }, "myth", answer)}
                    selected={selectedAnswers.myth === answer}
                  >
                    {label}
                  </AnswerChoice>
                ))}
              </div>
            </div>
            {evaluations.myth ? <Feedback feedback={evaluations.myth} /> : null}
          </div>
        );
      case 3:
        return (
          <div className="space-y-9">
            <LessonHeading label="Encouragement is not surveillance">
              Support offers a hand. Control grabs the steering wheel.
            </LessonHeading>
            <ConsentConversationAnimation mode={supportMode} />
            <div>
              <p className={styles.promptTitle}>What kind of support would fit this moment?</p>
              <div className={styles.supportModeList}>
                {supportModes.map((item) => (
                  <button
                    aria-pressed={supportMode === item.id}
                    className={cn(
                      styles.supportMode,
                      supportMode === item.id && styles.supportModeActive,
                    )}
                    key={item.id}
                    onClick={() => setSupportMode(item.id)}
                    type="button"
                  >
                    <span>{item.label}</span>
                    <small>{item.note}</small>
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.teachBack}>
              <h2>A family member wants to help with meals. What is the strongest first move?</h2>
              <div className="mt-5 grid gap-3">
                {(
                  [
                    ["ask_first", "Ask what kind of help would feel useful, then listen."],
                    ["monitor_choices", "Comment on every choice so nothing gets missed."],
                    ["take_over", "Make the decisions before the person can choose."],
                  ] as const
                ).map(([answer, label]) => (
                  <AnswerChoice
                    key={answer}
                    onClick={() =>
                      void evaluate({ answer, stage: "support_or_control" }, "support", answer)
                    }
                    selected={selectedAnswers.support === answer}
                  >
                    {label}
                  </AnswerChoice>
                ))}
              </div>
            </div>
            {evaluations.support ? <Feedback feedback={evaluations.support} /> : null}
          </div>
        );
      case 4:
        return (
          <div className="space-y-9">
            <LessonHeading label="Make the help specific">
              A clear request gives care somewhere useful to land.
            </LessonHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              “Help me with diabetes” is enormous. One person and one action are easier to
              understand, easier to answer, and easier to adjust later.
            </p>
            <div className={styles.requestStudio}>
              <section>
                <p className="editorial-eyebrow">Choose one person</p>
                <div className="mt-4 grid gap-3">
                  {supportPeople.map(([id, label]) => (
                    <AnswerChoice
                      key={id}
                      onClick={() => setSupportPerson(id)}
                      selected={supportPerson === id}
                    >
                      {label}
                    </AnswerChoice>
                  ))}
                </div>
              </section>
              <section>
                <p className="editorial-eyebrow">Choose one useful action</p>
                <div className="mt-4 grid gap-3">
                  {requestActions.map((action) => (
                    <AnswerChoice
                      key={action}
                      onClick={() => setSupportAction(action)}
                      selected={supportAction === action}
                    >
                      {action}
                    </AnswerChoice>
                  ))}
                </div>
              </section>
            </div>
            <div className={styles.requestDraft}>
              <HeartHandshake aria-hidden="true" />
              <div>
                <p className="editorial-eyebrow">Your words</p>
                <blockquote>
                  “
                  {supportRequest ??
                    "Could you listen for ten minutes? I do not need an answer—just company."}
                  ”
                </blockquote>
                <p>
                  A request is an invitation, not a contract. Both people can answer honestly and
                  find another shape if needed.
                </p>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-9">
            <LessonHeading label="A boundary is not a punishment">
              Warm and firm can live in the same sentence.
            </LessonHeading>
            <div className={styles.scenarioPicker}>
              {boundaryScenarios.map((scenario) => (
                <button
                  aria-pressed={boundaryScenario === scenario.id}
                  className={cn(
                    styles.textTab,
                    boundaryScenario === scenario.id && styles.textTabActive,
                  )}
                  key={scenario.id}
                  onClick={() => setBoundaryScenario(scenario.id)}
                  type="button"
                >
                  {scenario.setting}
                </button>
              ))}
            </div>
            <BoundaryConversationAnimation scenario={activeBoundary} />
            <div className={styles.teachBack}>
              <p className="editorial-eyebrow">Choose the response that protects your peace</p>
              <div className="mt-5 grid gap-3">
                {(
                  [
                    [
                      "clear_boundary",
                      "Acknowledge the relationship, name the limit, and stop there.",
                    ],
                    ["full_defense", "Explain every medical detail until everyone agrees."],
                    ["accept_commentary", "Keep accepting the comments because they mean well."],
                  ] as const
                ).map(([answer, label]) => (
                  <AnswerChoice
                    key={answer}
                    onClick={() => void evaluate({ answer, stage: "boundary" }, "boundary", answer)}
                    selected={selectedAnswers.boundary === answer}
                  >
                    {label}
                  </AnswerChoice>
                ))}
              </div>
            </div>
            {evaluations.boundary ? <Feedback feedback={evaluations.boundary} /> : null}
          </div>
        );
      case 6:
        return (
          <div className="space-y-9">
            <LessonHeading label="Disclosure belongs to you">
              Share what supports the need—not everything you know.
            </LessonHeading>
            <div className={styles.privacyStory}>
              <div>
                <p className="editorial-eyebrow">The situation</p>
                <h2>A manager schedules a meeting through your usual lunch break.</h2>
                <p>
                  You want to protect timing that supports your routine. You do not want to give a
                  detailed medical history.
                </p>
              </div>
              <div>
                <p className="editorial-eyebrow text-success">The smallest useful disclosure</p>
                <blockquote>
                  “Eating near my usual time supports a health need. Could we meet before lunch or
                  afterward?”
                </blockquote>
              </div>
            </div>
            <div className={styles.teachBack}>
              <h2>Which response protects both the need and the person’s privacy?</h2>
              <div className="mt-5 grid gap-3">
                {(
                  [
                    ["simple_request", "Name the timing need and offer a workable alternative."],
                    ["skip_silently", "Skip lunch and say nothing, even if the timing matters."],
                    ["share_everything", "Share every diagnosis and treatment detail as proof."],
                  ] as const
                ).map(([answer, label]) => (
                  <AnswerChoice
                    key={answer}
                    onClick={() =>
                      void evaluate({ answer, stage: "workplace_request" }, "workplace", answer)
                    }
                    selected={selectedAnswers.workplace === answer}
                  >
                    {label}
                  </AnswerChoice>
                ))}
              </div>
            </div>
            {evaluations.workplace ? <Feedback feedback={evaluations.workplace} /> : null}
            <div className={styles.reassurance}>
              <ShieldCheck aria-hidden="true" />
              <p>
                A short request, a fuller conversation, or no disclosure can each be valid. The
                amount you share depends on the setting, the need, and what you want.
              </p>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-9">
            <LessonHeading label="Build a support system that fits">
              Different people can hold different parts of the day.
            </LessonHeading>
            <LessonStoryImage
              alt="Adults across generations relax together in a garden courtyard, with two women hugging, friends sharing tea, and another pair beginning a walk"
              caption="Peer support can bring practical ideas, relief, laughter, and the recognition that many difficult moments are shared."
              emphasis="Community can turn isolation into belonging."
              src="/lessons/day-13/community-belonging.jpg"
            />
            <SupportTableAnimation activeSeat={supportSeat} />
            <div className={styles.seatChooser}>
              {supportSeats.map((seat) => (
                <button
                  aria-pressed={supportSeat === seat.id}
                  className={cn(
                    styles.seatChoice,
                    supportSeat === seat.id && styles.seatChoiceActive,
                  )}
                  key={seat.id}
                  onClick={() => setSupportSeat(seat.id)}
                  type="button"
                >
                  <strong>{seat.label}</strong>
                  <span>{seat.note}</span>
                </button>
              ))}
            </div>
            <p className={styles.quietNote}>
              Choosing someone here does not create an obligation to share. A support system is
              built by invitation, and it can change over time.
            </p>
          </div>
        );
      case 8:
        return (
          <div className="space-y-9">
            <LessonHeading label="When help misses">
              A caring relationship can repair without pretending nothing happened.
            </LessonHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Sometimes a person means well and still leaves you feeling judged, watched, or
              crowded. You can name that. You can ask for a different approach. You can also pause.
            </p>
            <div className={styles.repairStudio}>
              <nav aria-label="Choose a repair move">
                {repairSteps.map((item, index) => (
                  <button
                    aria-pressed={repairStep === item.id}
                    className={cn(
                      styles.repairChoice,
                      repairStep === item.id && styles.repairChoiceActive,
                    )}
                    key={item.id}
                    onClick={() => setRepairStep(item.id)}
                    type="button"
                  >
                    <span>0{index + 1}</span>
                    <strong>{item.label}</strong>
                  </button>
                ))}
              </nav>
              <div aria-live="polite" className={styles.repairScene}>
                <div className={styles.repairPeople} aria-hidden="true">
                  <span />
                  <i />
                  <span />
                  <i />
                </div>
                <p className="editorial-eyebrow">Words you can borrow</p>
                <blockquote>{activeRepair.script}</blockquote>
                <p>
                  Repair is possible when the impact matters as much as the intention. If the
                  pattern continues, distance can be a healthy limit.
                </p>
              </div>
            </div>
            <div className={styles.reassurance}>
              <HeartHandshake aria-hidden="true" />
              <p>
                You are allowed to protect a relationship by changing the conversation—and to
                protect yourself when the relationship will not change.
              </p>
            </div>
          </div>
        );
      case 9:
        return (
          <div className="space-y-9">
            <LessonHeading label="Emotional health is health">
              You do not have to perform “fine” to deserve company.
            </LessonHeading>
            <div className={styles.emotionalCheckIn}>
              <div>
                <MessageCircleHeart aria-hidden="true" />
                <p className="editorial-eyebrow">A gentle check-in</p>
                <h2>What could make today feel a little less lonely or overloaded?</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {wellbeingOptions.map((option) => (
                  <AnswerChoice
                    key={option}
                    onClick={() => setWellbeingChoice(option)}
                    selected={wellbeingChoice === option}
                  >
                    {option}
                  </AnswerChoice>
                ))}
              </div>
            </div>
            {wellbeingChoice ? (
              <p className={styles.identityStatement}>
                “{wellbeingChoice}” is a valid form of care. Tomorrow can need something different.
              </p>
            ) : null}
            <label className={styles.writingField}>
              <span>Optional: put one supportive sentence into your own words.</span>
              <textarea
                maxLength={240}
                onChange={(event) => setReflection(event.target.value)}
                placeholder="What I need today is…"
                rows={3}
                value={reflection}
              />
              <small>
                This reflection stays on this page and is not saved as health information.
              </small>
            </label>
            <div className={styles.teachBack}>
              <p className="editorial-eyebrow">Define support without control</p>
              <h2>What makes support helpful?</h2>
              <div className="mt-5 grid gap-3">
                {(
                  [
                    [
                      "respects_choice",
                      "It asks, listens, respects choice, and offers specific help without blame.",
                    ],
                    ["controls_choices", "It takes control so the person cannot make a mistake."],
                    [
                      "avoids_topic",
                      "It never acknowledges diabetes, even when help is requested.",
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
            <div className={styles.careNote}>
              <p>
                If sadness, anxiety, hopelessness, or diabetes distress persists or begins
                interfering with daily life, tell a healthcare professional. Emotional support is
                part of diabetes care.
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-12 text-center">
            <p className="editorial-eyebrow">Day 13 complete</p>
            <LessonHeading centered>Care can be shared without giving yourself away.</LessonHeading>
            <div className={styles.completionMark}>
              <UsersRound aria-hidden="true" />
              <p>You are still the author of your care.</p>
              <span>Ask · Listen · Offer · Check</span>
            </div>
            <div className="mx-auto max-w-3xl border-y border-border py-9 text-left">
              <p className="editorial-eyebrow text-success">Relationship agreements</p>
              <ol className={styles.takeawayList}>
                {[
                  "Diabetes is a condition you manage, not a definition of your character or the whole of your identity.",
                  "Helpful support asks permission, respects choice, and reduces burden. Concern does not excuse control.",
                  "A clear request, chosen privacy, and a calm boundary can protect both health and relationships.",
                ].map((item, index) => (
                  <li key={item}>
                    <span>0{index + 1}</span>
                    <p>{item}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="mx-auto grid max-w-3xl gap-8 text-left md:grid-cols-2">
              <div>
                <p className="editorial-eyebrow">Try one small, specific ask</p>
                <p className="mt-3 font-serif-display text-2xl leading-snug">
                  {supportRequest ??
                    "Could you listen for ten minutes? I do not need an answer—just company."}
                </p>
              </div>
              <div>
                <p className="editorial-eyebrow">The skill you built</p>
                <p className="mt-3 font-serif-display text-2xl leading-snug">
                  Asking for help without surrendering choice, privacy, or self-respect.
                </p>
              </div>
            </div>
            <Button disabled={isPending} fullWidth={false} onClick={finishExperience}>
              {isPending
                ? "Saving your progress…"
                : experience.accessMode === "review"
                  ? "Return to journey"
                  : "Complete Day 13"}
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
            <p className="text-sm font-semibold text-accent-warm">Day 13</p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Support, Stigma, and the People Around You
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
            label={`Day 13 chapter ${stage + 1} of ${stageCount}`}
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
        title="Leave Day 13 for now?"
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
        title="Day 13 glossary"
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
