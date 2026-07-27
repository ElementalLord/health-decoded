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
import { LessonMotionPerson } from "@/features/lessons/components/lesson-motion-person";
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
        <circle cx="770" cy="79" fill="#edca8c" opacity=".72" r="40" />
        <path
          d="M35 367 Q245 349 455 366 T865 362"
          fill="none"
          stroke="#a9bcae"
          strokeLinecap="round"
          strokeWidth="5"
        />
        <path d="M95 366 Q135 309 175 366 M724 362 Q768 300 812 362" fill="#dce7df" />

        <LessonMotionPerson
          action="carry-left"
          motion="breathe"
          palette="warm"
          scale={1.03}
          x={328}
          y={355}
        />
        <LessonMotionPerson
          action="reach-left"
          motion="nod"
          palette="sage"
          scale={1.03}
          x={590}
          y={355}
        />

        <g>
          <rect
            fill="#e4b878"
            height="62"
            rx="7"
            stroke="#9d714a"
            strokeWidth="3"
            width="68"
            x="250"
            y="310"
          />
          <path d="M264 312 Q284 292 304 312" fill="none" stroke="#9d714a" strokeWidth="6" />
        </g>
        <g>
          <rect
            fill="#efd7b0"
            height="62"
            rx="7"
            stroke="#9d714a"
            strokeWidth="3"
            width="68"
            x="339"
            y="310"
          />
          <path d="M353 312 Q373 292 393 312" fill="none" stroke="#9d714a" strokeWidth="6" />
          <animateTransform
            attributeName="transform"
            dur="8s"
            keyTimes="0;0.23;0.5;0.78;1"
            repeatCount="indefinite"
            type="translate"
            values="0 0;0 0;145 -18;145 -18;0 0"
          />
        </g>
        <path
          d="M430 238 C456 217 481 217 507 238"
          fill="none"
          stroke="#8ea79b"
          strokeLinecap="round"
          strokeWidth="5"
        >
          <animate
            attributeName="stroke-dasharray"
            dur="8s"
            keyTimes="0;0.18;0.38;0.7;1"
            repeatCount="indefinite"
            values="0 100;100 0;100 0;0 100;0 100"
          />
        </path>
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
          The selected request changes the entire action: quiet listening, walking together, writing
          one question, or giving space while planning a later check-in.
        </desc>
        <rect fill="#f3eee5" height="390" width="900" />
        <path d="M40 352 H860" stroke="#b2bcaf" strokeLinecap="round" strokeWidth="5" />

        {mode === "listen" ? (
          <g key="listen">
            <rect
              fill="#dce9e3"
              height="111"
              rx="7"
              stroke="#9db4aa"
              strokeWidth="4"
              width="195"
              x="82"
              y="54"
            />
            <circle cx="179" cy="110" fill="#edca8c" r="30" />
            <path
              d="M322 289 H718 M365 291 L355 352 M679 291 L690 352"
              stroke="#826e5e"
              strokeLinecap="round"
              strokeWidth="12"
            />
            <ellipse cx="520" cy="282" fill="#f0ddbf" rx="50" ry="11" />
            <path
              d="M507 231 H539 V274 Q523 288 507 274 Z"
              fill="#f8f2e7"
              stroke="#8da89a"
              strokeWidth="4"
            />
            <path
              d="M515 228 C505 211 525 201 515 184 M530 228 C520 211 540 201 530 184"
              fill="none"
              stroke="#a8bcae"
              strokeLinecap="round"
              strokeWidth="4"
            >
              <animateTransform
                attributeName="transform"
                dur="3.2s"
                repeatCount="indefinite"
                type="translate"
                values="0 6;0 -6;0 6"
              />
              <animate
                attributeName="opacity"
                dur="3.2s"
                repeatCount="indefinite"
                values=".15;1;.15"
              />
            </path>
            <LessonMotionPerson
              action="reach-right"
              motion="breathe"
              palette="warm"
              seated
              x={387}
              y={345}
            />
            <LessonMotionPerson
              action="listen"
              motion="nod"
              palette="sage"
              seated
              x={650}
              y={345}
            />
          </g>
        ) : null}

        {mode === "company" ? (
          <g key="company">
            <path d="M690 138 V352" stroke="#61796f" strokeLinecap="round" strokeWidth="9" />
            <circle cx="690" cy="110" fill="#92aa95" r="67">
              <animateTransform
                attributeName="transform"
                dur="5s"
                repeatCount="indefinite"
                type="rotate"
                values="-2 690 180;2 690 180;-2 690 180"
              />
            </circle>
            <path
              d="M46 344 Q250 321 449 341 T854 337"
              fill="none"
              stroke="#a6b9ac"
              strokeLinecap="round"
              strokeWidth="7"
            />
            <g>
              <LessonMotionPerson
                action="wave-right"
                motion="walk"
                palette="warm"
                x={395}
                y={335}
              />
              <LessonMotionPerson action="wave-left" motion="walk" palette="sage" x={520} y={335} />
              <path
                d="M427 245 Q458 228 489 245"
                fill="none"
                stroke="#8c7569"
                strokeLinecap="round"
                strokeWidth="6"
              />
              <animateTransform
                attributeName="transform"
                dur="7s"
                repeatCount="indefinite"
                type="translate"
                values="-90 0;90 0;-90 0"
              />
            </g>
          </g>
        ) : null}

        {mode === "practical" ? (
          <g key="practical">
            <path
              d="M250 294 H747 M292 297 L282 352 M706 297 L716 352"
              stroke="#826e5e"
              strokeLinecap="round"
              strokeWidth="12"
            />
            <rect
              fill="#fffaf2"
              height="115"
              rx="6"
              stroke="#a6b6ad"
              strokeWidth="4"
              width="145"
              x="431"
              y="167"
            />
            <path
              d="M457 198 H550 M457 221 H535 M457 244 H546"
              stroke="#a6b6ad"
              strokeLinecap="round"
              strokeWidth="6"
            />
            <LessonMotionPerson
              action="reach-right"
              motion="breathe"
              palette="warm"
              seated
              x={346}
              y={345}
            />
            <LessonMotionPerson
              action="reach-left"
              motion="nod"
              palette="sage"
              seated
              x={661}
              y={345}
            />
          </g>
        ) : null}

        {mode === "space" ? (
          <g key="space">
            <rect
              fill="#dce9e3"
              height="118"
              rx="7"
              stroke="#9db4aa"
              strokeWidth="4"
              width="205"
              x="94"
              y="55"
            />
            <circle cx="196" cy="114" fill="#edca8c" r="31" />
            <path
              d="M534 296 H778 M571 298 L561 352 M741 298 L751 352"
              stroke="#826e5e"
              strokeLinecap="round"
              strokeWidth="12"
            />
            <LessonMotionPerson
              action="rest"
              motion="breathe"
              palette="warm"
              seated
              x={656}
              y={345}
            />
            <LessonMotionPerson action="wave-right" motion="walk" palette="sage" x={377} y={345} />
            <circle cx="485" cy="128" fill="#fffaf2" r="45" stroke="#799287" strokeWidth="5" />
            <path
              d="M485 128 V99 M485 128 L509 140"
              stroke="#c97961"
              strokeLinecap="round"
              strokeWidth="6"
            />
            <path
              d="M451 193 Q485 168 519 193"
              fill="none"
              stroke="#8ea79b"
              strokeLinecap="round"
              strokeWidth="5"
            >
              <animate
                attributeName="opacity"
                dur="3.4s"
                repeatCount="indefinite"
                values=".2;1;.2"
              />
            </path>
          </g>
        ) : null}
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
          The selected setting changes what stops after the boundary: a hand withdraws from a plate,
          a joke card closes at work, or a phone turns face down to protect a private number.
        </desc>
        <rect fill="#edf3f0" height="380" width="900" />
        <path d="M42 348 H858" stroke="#adbdaf" strokeLinecap="round" strokeWidth="5" />
        <path
          d="M211 285 H725 M257 288 L248 350 M681 288 L690 350"
          stroke="#826e5e"
          strokeLinecap="round"
          strokeWidth="13"
        />
        <LessonMotionPerson
          action={scenario.id === "meal" ? "reach-right" : "rest"}
          motion="breathe"
          palette="warm"
          seated
          x={318}
          y={341}
        />
        <LessonMotionPerson
          action={scenario.id === "friend" ? "hold-left" : "reach-left"}
          motion="nod"
          palette="sage"
          seated
          x={622}
          y={341}
        />

        {scenario.id === "meal" ? (
          <g key="meal">
            <ellipse
              cx="470"
              cy="279"
              fill="#fffaf2"
              rx="67"
              ry="14"
              stroke="#c9af96"
              strokeWidth="4"
            />
            <path d="M440 274 Q470 245 500 274" fill="#e7b879" />
          </g>
        ) : null}
        {scenario.id === "work" ? (
          <g key="work">
            <rect
              fill="#fffaf2"
              height="95"
              rx="7"
              stroke="#c9896f"
              strokeWidth="4"
              width="143"
              x="399"
              y="143"
            >
              <animate
                attributeName="height"
                dur="6s"
                keyTimes="0;0.36;0.65;1"
                repeatCount="indefinite"
                values="95;95;8;8"
              />
              <animate
                attributeName="y"
                dur="6s"
                keyTimes="0;0.36;0.65;1"
                repeatCount="indefinite"
                values="143;143;230;230"
              />
            </rect>
            <path
              d="M420 173 H520 M420 195 H500"
              stroke="#c9896f"
              strokeLinecap="round"
              strokeWidth="5"
            >
              <animate
                attributeName="opacity"
                dur="6s"
                keyTimes="0;0.35;0.55;1"
                repeatCount="indefinite"
                values="1;1;0;0"
              />
            </path>
          </g>
        ) : null}
        {scenario.id === "friend" ? (
          <g key="friend">
            <rect
              fill="#405750"
              height="89"
              rx="10"
              stroke="#55796a"
              strokeWidth="4"
              width="55"
              x="443"
              y="184"
            >
              <animateTransform
                attributeName="transform"
                dur="6s"
                keyTimes="0;0.35;0.65;1"
                repeatCount="indefinite"
                type="rotate"
                values="0 470 273;0 470 273;90 470 273;90 470 273"
              />
            </rect>
            <rect fill="#b8d1c2" height="25" rx="3" width="35" x="453" y="198" />
          </g>
        ) : null}
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
          The selected support changes the whole table: a friend shares tea, a clinician reviews one
          written question, or peers play a simple game together.
        </desc>
        <rect fill="#f2eee6" height="430" width="900" />
        <circle cx="787" cy="78" fill="#edca8c" opacity=".7" r="38" />
        <path
          d="M38 380 Q250 360 455 378 T862 374"
          fill="none"
          stroke="#adbdaf"
          strokeLinecap="round"
          strokeWidth="5"
        />
        <path
          d="M250 299 H651 M294 302 L284 380 M607 302 L617 380"
          stroke="#8a715e"
          strokeLinecap="round"
          strokeWidth="14"
        />

        {activeSeat === "chosen" ? (
          <g key="chosen">
            <LessonMotionPerson
              action="hold-right"
              motion="breathe"
              palette="warm"
              seated
              x={342}
              y={371}
            />
            <LessonMotionPerson
              action="reach-left"
              motion="nod"
              palette="sage"
              seated
              x={559}
              y={371}
            />
            <ellipse cx="451" cy="295" fill="#edd9bb" rx="61" ry="12" />
            <path
              d="M432 241 H465 V287 Q449 301 432 287 Z"
              fill="#fffaf2"
              stroke="#789487"
              strokeWidth="4"
            />
            <path
              d="M439 238 C429 221 449 211 439 194 M454 238 C444 221 464 211 454 194"
              fill="none"
              stroke="#9db3a8"
              strokeLinecap="round"
              strokeWidth="4"
            >
              <animateTransform
                attributeName="transform"
                dur="3.2s"
                repeatCount="indefinite"
                type="translate"
                values="0 5;0 -5;0 5"
              />
              <animate
                attributeName="opacity"
                dur="3.2s"
                repeatCount="indefinite"
                values=".2;1;.2"
              />
            </path>
          </g>
        ) : null}
        {activeSeat === "care" ? (
          <g key="care">
            <LessonMotionPerson
              action="reach-right"
              motion="breathe"
              palette="warm"
              seated
              x={330}
              y={371}
            />
            <LessonMotionPerson
              action="reach-left"
              motion="nod"
              palette="blue"
              seated
              x={574}
              y={371}
            />
            <rect
              fill="#fffaf2"
              height="90"
              rx="6"
              stroke="#7d9daa"
              strokeWidth="4"
              width="132"
              x="385"
              y="199"
            />
            <path
              d="M407 225 H493 M407 247 H478 M407 269 H501"
              stroke="#a4b8b4"
              strokeLinecap="round"
              strokeWidth="5"
            />
          </g>
        ) : null}
        {activeSeat === "community" ? (
          <g key="community">
            <LessonMotionPerson
              action="reach-right"
              motion="nod"
              palette="warm"
              seated
              x={294}
              y={371}
            />
            <LessonMotionPerson
              action="reach-left"
              motion="breathe"
              palette="sage"
              seated
              x={608}
              y={371}
            />
            <LessonMotionPerson
              action="celebrate"
              motion="dance"
              palette="blue"
              scale={0.88}
              x={451}
              y={231}
            />
            <rect
              fill="#f8f1e7"
              height="34"
              rx="5"
              stroke="#c9896f"
              strokeWidth="3"
              width="27"
              x="414"
              y="263"
            >
              <animateTransform
                attributeName="transform"
                dur="3s"
                repeatCount="indefinite"
                type="rotate"
                values="-4 428 280;4 428 280;-4 428 280"
              />
            </rect>
            <rect
              fill="#f8f1e7"
              height="34"
              rx="5"
              stroke="#6f9984"
              strokeWidth="3"
              width="27"
              x="463"
              y="263"
            >
              <animateTransform
                attributeName="transform"
                dur="3s"
                repeatCount="indefinite"
                type="rotate"
                values="4 477 280;-4 477 280;4 477 280"
              />
            </rect>
          </g>
        ) : null}
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
                    "Could you listen for ten minutes? I do not need an answer, just company."}
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
              Share what supports the need, not everything you know.
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
                You are allowed to protect a relationship by changing the conversation, and to
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
                    "Could you listen for ten minutes? I do not need an answer, just company."}
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
