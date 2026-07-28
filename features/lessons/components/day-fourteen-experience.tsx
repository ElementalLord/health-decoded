"use client";

import { ArrowLeft, BookOpen, MessageCircleHeart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition, type ReactNode } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ProgressBar } from "@/components/ui/progress-bar";
import { completeLessonAction } from "@/features/lessons/actions/lesson-completion.actions";
import { saveLessonPositionAction } from "@/features/lessons/actions/lesson-progress.actions";
import { LessonStoryImage } from "@/features/lessons/components/lesson-story-image";
import { LessonMotionPerson } from "@/features/lessons/components/lesson-motion-person";
import {
  canNavigateToLessonStage,
  getLessonResumeStage,
  isLessonStageLocked,
  type LessonStageGateMap,
} from "@/features/lessons/lib/lesson-stage-gating";
import type { LessonPlayerViewModel } from "@/features/lessons/types/lesson-player";
import { cn } from "@/lib/utils";

import styles from "./day-fourteen-experience.module.css";

const stageCount = 11;
const dayFourteenStageGates: LessonStageGateMap = {
  0: "Tap at least one day on the climb above before you move on.",
  1: "Switch the story between then and now before you move on.",
  2: "Choose one ordinary moment before you move on.",
  3: "Walk the bite all the way to the cells above before you move on.",
  4: "Choose one reading context before you move on.",
  5: "Choose one everyday tool before you move on.",
  6: "Choose one area to protect before you move on.",
  7: "Choose one real-life return scenario before you move on.",
  8: "Choose the kind of support that would help today before you move on.",
  9: "Set at least two foundation pieces above before you move on.",
};

const arrivalFeelings = [
  ["quieter", "The diagnosis feels a little less loud"],
  ["steadier", "I feel steadier, even with questions"],
  ["surprised", "I know more than I realized"],
  ["tender", "I am proud I kept coming back"],
] as const;

const ordinaryMoments = [
  {
    id: "breakfast",
    label: "Breakfast",
    prompt: "At the table, balance can be an addition, not a punishment or a brand-new identity.",
  },
  {
    id: "friendship",
    label: "A walk with someone",
    prompt: "Movement can hold conversation, fresh air, adaptation, and company at the same time.",
  },
  {
    id: "care",
    label: "A care conversation",
    prompt: "A short question can turn a visit from information overload into a shared next step.",
  },
] as const;

type OrdinaryMomentId = (typeof ordinaryMoments)[number]["id"];

const nextSteps = [
  ["food", "Make one familiar meal feel more balanced"],
  ["movement", "Choose one movement moment that feels good"],
  ["care", "Write one question for my next care visit"],
  ["support", "Ask one person for one specific kind of help"],
  ["return", "Practice returning after one interrupted day"],
] as const;

const everydayTools = [
  {
    body: "Build around a familiar meal instead of replacing your life with a rulebook. Add balance where it helps, keep culture and enjoyment in the room, and let one plate remain one plate.",
    id: "food",
    invitation: "What could join a meal you already love?",
    label: "At the table",
    title: "Food can feel familiar and supportive.",
  },
  {
    body: "Let movement meet the body and day you actually have. A friend, a favorite song, a garden, or a chair can turn a health task into a human moment.",
    id: "movement",
    invitation: "Where could movement feel more like living?",
    label: "In motion",
    title: "Movement can carry company and joy.",
  },
  {
    body: "Knowing a medicine’s name, purpose, timing, and safety notes makes it a tool you can understand, not a symbol of failure or a mystery you must quietly manage.",
    id: "medicine",
    invitation: "Which medicine question would bring relief?",
    label: "With medicine",
    title: "Understanding can make medicine feel lighter.",
  },
  {
    body: "Use a reading to answer a real question. Timing, context, and patterns make the number useful; judgment only makes it louder.",
    id: "monitoring",
    invitation: "What would you want a reading to help you learn?",
    label: "With a reading",
    title: "A number can become information again.",
  },
] as const;

type EverydayToolId = (typeof everydayTools)[number]["id"];

const bodySystems = [
  {
    body: "The stomach mixes food, then the small intestine finishes much of the breakdown and absorbs simple sugars into the bloodstream. The animation follows that journey without pretending the stomach works alone.",
    id: "digestion",
    label: "Stomach + intestine",
    notice: "Food moves, mixes, and becomes nutrients the body can absorb.",
    title: "Digestion turns a meal into usable parts.",
  },
  {
    body: "The pancreas makes insulin. As glucose rises, insulin enters the bloodstream and signals cells. In type 2 diabetes, the body may not respond as effectively and the pancreas may not make enough insulin to keep up.",
    id: "pancreas",
    label: "Pancreas",
    notice: "The signal leaves the pancreas before cells can respond to it.",
    title: "The pancreas sends the insulin signal.",
  },
  {
    body: "The liver receives, processes, stores, and releases nutrients. Insulin helps regulate that traffic. With insulin resistance, liver cells may not respond well to the signal, contributing to more glucose remaining in the blood.",
    id: "liver",
    label: "Liver",
    notice: "The liver is an active traffic manager, not a passive container.",
    title: "The liver stores and releases fuel.",
  },
  {
    body: "Muscle cells use glucose for energy. When muscles work, they can take up glucose through more than one pathway, which is why comfortable, adapted movement can be one useful tool.",
    id: "muscle",
    label: "Muscle",
    notice: "Working muscle pulls fuel from the bloodstream.",
    title: "Muscle turns glucose into motion.",
  },
] as const;

type BodySystemId = (typeof bodySystems)[number]["id"];

const numberMoments = [
  {
    context: "This is one point in time after a night without food.",
    id: "fasting",
    label: "Before breakfast",
    question: "What pattern do my clinician and I see across mornings?",
    window: "One fasting moment",
  },
  {
    context: "Timing, the meal, movement, medicine, stress, and illness can all matter.",
    id: "meal",
    label: "After a meal",
    question: "What question was this check meant to answer?",
    window: "One timed moment",
  },
  {
    context: "A1C estimates average glucose exposure across roughly two to three months.",
    id: "a1c",
    label: "A1C result",
    question: "What personal goal and next step fit my care plan?",
    window: "A longer window",
  },
  {
    context: "A repeated pattern can be more useful than treating one result as a verdict.",
    id: "pattern",
    label: "Something unexpected",
    question: "What timing, symptoms, or changes should I bring to my care team?",
    window: "A pattern to investigate",
  },
] as const;

type NumberMomentId = (typeof numberMoments)[number]["id"];

const protectionAreas = [
  {
    body: "Eye care can notice changes before vision feels different. Ask which eye examination and timing belong in your personal care plan.",
    id: "eyes",
    label: "Eyes",
    prompt: "Bring: vision changes and the date of your last eye care visit.",
    title: "Protect sight by noticing early.",
  },
  {
    body: "Kidney changes can be quiet. Blood and urine testing, blood pressure care, and a clinician’s interpretation help show how the kidneys are doing.",
    id: "kidneys",
    label: "Kidneys",
    prompt: "Ask: which kidney checks are due for me?",
    title: "Quiet organs still deserve regular attention.",
  },
  {
    body: "Heart and blood-vessel care includes the whole pattern: blood pressure, cholesterol, smoking, movement, medicines, symptoms, and your individual risks.",
    id: "heart",
    label: "Heart",
    prompt: "Share urgent chest symptoms through the emergency plan for your location.",
    title: "Protection includes circulation, not glucose alone.",
  },
  {
    body: "Reduced feeling or circulation can make a small foot problem easier to miss. Notice skin changes, injuries, warmth, swelling, or wounds and follow your care plan for prompt help.",
    id: "feet",
    label: "Feet",
    prompt: "Notice: what is new, where it is, and when it began.",
    title: "A small observation can lead to earlier care.",
  },
] as const;

type ProtectionAreaId = (typeof protectionAreas)[number]["id"];

const returnScenarios = [
  {
    id: "restaurant",
    label: "An unfamiliar meal",
    next: "Use what you recognize, choose what fits, and let one uncertain meal remain one meal.",
    release: "You do not need perfect ingredient information to make a reasonable choice.",
  },
  {
    id: "reading",
    label: "A surprising reading",
    next: "Add timing and context, notice whether it repeats, and bring a useful question to care.",
    release: "Curiosity gives the number a smaller job than judgment does.",
  },
  {
    id: "routine",
    label: "A disrupted plan",
    next: "Repair the next available moment instead of trying to repair the entire day.",
    release: "A smaller Plan B protects continuity without pretending life went as expected.",
  },
] as const;

type ReturnScenarioId = (typeof returnScenarios)[number]["id"];

const supportOptions = [
  {
    id: "listen",
    label: "I need someone to listen",
    response: "I can stay with you for a minute. I will not rush to fix it.",
    title: "Listening can lower the weight without taking over.",
  },
  {
    id: "company",
    label: "I want company",
    response: "Would it help if I joined you and we talked about something else?",
    title: "Support can be ordinary companionship.",
  },
  {
    id: "practical",
    label: "One practical thing would help",
    response: "Tell me the one task that would make today easier. I can start there.",
    title: "Specific help is easier to give and receive.",
  },
  {
    id: "boundary",
    label: "I need a boundary respected",
    response: "Understood. I will not comment on your plate or turn this into a medical lecture.",
    title: "Respect is a form of support too.",
  },
] as const;

type SupportOptionId = (typeof supportOptions)[number]["id"];

type MilestoneDraft = {
  arrivalFeeling: string | null;
  nextStep: string | null;
  promise: string;
};

const initialDraft: MilestoneDraft = {
  arrivalFeeling: null,
  nextStep: null,
  promise: "",
};

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

function EditorialChoice({
  children,
  index,
  onClick,
  selected,
}: {
  children: ReactNode;
  index: number;
  onClick: () => void;
  selected: boolean;
}) {
  return (
    <button
      aria-pressed={selected}
      className={cn(styles.editorialChoice, selected && styles.editorialChoiceSelected)}
      onClick={onClick}
      type="button"
    >
      <span>{String(index + 1).padStart(2, "0")}</span>
      <strong>{children}</strong>
      <small>{selected ? "This feels closest" : "Optional"}</small>
    </button>
  );
}

function MotionFigure({
  children,
  cue,
  description,
  label,
  title,
}: {
  children: ReactNode;
  cue: string;
  description: string;
  label: string;
  title: string;
}) {
  return (
    <figure className={styles.motionFigure} data-motion-loop="continuous">
      <div className={styles.motionHeading}>
        <p className="editorial-eyebrow">{cue}</p>
        <h2>{title}</h2>
      </div>
      <div className={styles.motionViewport} role="img" aria-label={label}>
        <svg
          aria-hidden="true"
          className={styles.motionArt}
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 720 320"
        >
          {children}
        </svg>
      </div>
      <figcaption>
        <strong>What to notice:</strong> {description}
      </figcaption>
    </figure>
  );
}

function OrdinaryLifeMotion({ onReady }: { onReady?: () => void }) {
  const [activeMoment, setActiveMoment] = useState<OrdinaryMomentId>("breakfast");
  const active = ordinaryMoments.find((moment) => moment.id === activeMoment) ?? ordinaryMoments[0];

  return (
    <section className={styles.ordinaryExplorer}>
      <MotionFigure
        cue="Knowledge in ordinary life"
        description="no moment asks for every skill at once. Breakfast, friendship, and a care conversation each call for one useful part of what you know."
        label="A continuously moving illustrated day: breakfast steams, two friends walk together, and a patient and clinician exchange a question"
        title="What you learned can travel through an ordinary day."
      >
        <rect className={styles.skyWash} height="320" width="720" />
        <path className={styles.groundLine} d="M24 273H696" />

        <g
          className={cn(
            styles.morningScene,
            activeMoment !== "breakfast" && styles.ordinaryMomentMuted,
          )}
        >
          <circle className={styles.sunShape} cx="58" cy="49" r="22" />
          <path className={styles.tableShape} d="M32 228H215M51 228V273M197 228V273" />
          <ellipse className={styles.plateShape} cx="146" cy="220" rx="29" ry="8" />
          <path className={styles.cupShape} d="M134 188h24v27h-24zM158 194c15 0 15 16 0 16" />
          <path className={styles.steamShape} d="M142 181c-8-10 9-15 0-27M154 181c-8-10 9-15 0-27">
            <animateTransform
              attributeName="transform"
              dur="3.2s"
              repeatCount="indefinite"
              type="translate"
              values="0 8;0 -8;0 8"
            />
            <animate attributeName="opacity" dur="3.2s" repeatCount="indefinite" values="0;0.9;0" />
          </path>
          <LessonMotionPerson
            action="rest"
            motion="breathe"
            palette="warm"
            scale={0.62}
            seated
            x={91}
            y={267}
          />
        </g>

        <g
          className={cn(
            styles.walkingScene,
            activeMoment !== "friendship" && styles.ordinaryMomentMuted,
          )}
        >
          <path className={styles.treeTrunk} d="M462 104v168" />
          <circle className={styles.treeLeaf} cx="462" cy="82" r="48">
            <animateTransform
              attributeName="transform"
              dur="5s"
              repeatCount="indefinite"
              type="rotate"
              values="-2 462 150;2 462 150;-2 462 150"
            />
          </circle>
          <g>
            <LessonMotionPerson
              action="wave-right"
              motion="walk"
              palette="sage"
              scale={0.64}
              x={318}
              y={269}
            />
            <LessonMotionPerson
              action="wave-left"
              motion="walk"
              palette="blue"
              scale={0.64}
              x={386}
              y={269}
            />
            <path className={styles.friendLine} d="M338 213 Q352 203 367 213" />
            <animateTransform
              attributeName="transform"
              dur="6.5s"
              repeatCount="indefinite"
              type="translate"
              values="-24 0;24 0;-24 0"
            />
          </g>
        </g>

        <g className={cn(styles.careScene, activeMoment !== "care" && styles.ordinaryMomentMuted)}>
          <path className={styles.deskShape} d="M512 228H696M532 228v45M676 228v45" />
          <LessonMotionPerson
            action="reach-right"
            motion="breathe"
            palette="sage"
            scale={0.62}
            seated
            x={552}
            y={268}
          />
          <LessonMotionPerson
            action="reach-left"
            motion="nod"
            palette="blue"
            scale={0.62}
            seated
            x={655}
            y={268}
          />
          <rect className={styles.storyNotebook} height="45" rx="3" width="57" x="575" y="174" />
          <path
            d="M586 187 H621 M586 201 H613"
            stroke="#9bad9f"
            strokeLinecap="round"
            strokeWidth="3"
          />
          <g className={styles.questionLines}>
            <path d="M581 150h54" />
            <path d="M591 136h34" />
            <animate
              attributeName="opacity"
              dur="4s"
              keyTimes="0;0.25;0.7;1"
              repeatCount="indefinite"
              values="0.15;1;1;0.15"
            />
            <animateTransform
              attributeName="transform"
              dur="4s"
              repeatCount="indefinite"
              type="translate"
              values="-5 0;5 0;-5 0"
            />
          </g>
        </g>
      </MotionFigure>

      <div aria-label="Choose an ordinary moment" className={styles.ordinaryChoices} role="group">
        {ordinaryMoments.map((moment, index) => (
          <button
            aria-pressed={activeMoment === moment.id}
            className={cn(activeMoment === moment.id && styles.ordinaryChoiceActive)}
            key={moment.id}
            onClick={() => {
              setActiveMoment(moment.id);
              onReady?.();
            }}
            type="button"
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {moment.label}
          </button>
        ))}
      </div>
      <p aria-live="polite" className={styles.ordinaryPrompt} key={activeMoment}>
        {active.prompt}
      </p>
    </section>
  );
}

function ReturnAfterRainMotion() {
  return (
    <MotionFigure
      cue="Confidence in real life"
      description="confidence is not controlling the weather. It is knowing that a changed moment does not have to become an abandoned plan."
      label="A continuously moving park scene where a rain cloud passes, two friends pause together, and then resume their walk"
      title="A pause can belong inside the plan."
    >
      <rect className={styles.rainWash} height="320" width="720" />
      <circle className={styles.sunShape} cx="630" cy="62" r="28">
        <animate
          attributeName="opacity"
          dur="9s"
          keyTimes="0;0.35;0.6;1"
          repeatCount="indefinite"
          values="1;0.25;1;1"
        />
      </circle>
      <path className={styles.parkPath} d="M18 258c164-26 307 18 450 0 86-11 154-3 234 9" />
      <path className={styles.treeTrunk} d="M595 126v137" />
      <circle className={styles.treeLeaf} cx="595" cy="103" r="55" />
      <path className={styles.benchShape} d="M326 217h135M338 232h112M348 232l-9 31M440 232l9 31" />

      <g className={styles.weatherSystem}>
        <g className={styles.rainCloud}>
          <ellipse cx="250" cy="75" rx="65" ry="27" />
          <circle cx="219" cy="65" r="28" />
          <circle cx="266" cy="55" r="36" />
          <circle cx="301" cy="70" r="24" />
        </g>
        <g className={styles.rainDrops}>
          {[0, 1, 2, 3, 4].map((drop) => (
            <path d={`M${202 + drop * 23} 112l-7 24`} key={drop}>
              <animateTransform
                attributeName="transform"
                begin={`${drop * -0.24}s`}
                dur="1.2s"
                repeatCount="indefinite"
                type="translate"
                values="0 -5;0 70"
              />
              <animate
                attributeName="opacity"
                begin={`${drop * -0.24}s`}
                dur="1.2s"
                repeatCount="indefinite"
                values="0;0.9;0"
              />
            </path>
          ))}
          <animate
            attributeName="opacity"
            dur="9s"
            keyTimes="0;0.22;0.63;0.76;1"
            repeatCount="indefinite"
            values="0;1;1;0;0"
          />
        </g>
        <animateTransform
          attributeName="transform"
          dur="9s"
          keyTimes="0;0.5;1"
          repeatCount="indefinite"
          type="translate"
          values="-180 0;150 0;510 0"
        />
        <animate
          attributeName="opacity"
          dur="9s"
          keyTimes="0;0.15;0.72;1"
          repeatCount="indefinite"
          values="0;0.9;0.9;0"
        />
      </g>

      <g className={styles.returningPair}>
        <g className={styles.personWarm}>
          <circle cx="220" cy="160" r="19" />
          <path d="M194 231v-42c0-22 11-33 26-33s26 11 26 33v42z" />
          <path className={styles.personLine} d="M205 228l-12 32M234 228l15 32" />
        </g>
        <g className={styles.personSage}>
          <circle cx="267" cy="157" r="20" />
          <path d="M240 231v-43c0-22 11-34 27-34s27 12 27 34v43z" />
          <path className={styles.personLine} d="M253 228l-10 32M281 228l17 32" />
        </g>
        <path className={styles.friendLine} d="M238 193c11-9 18-9 30 0" />
        <animateTransform
          attributeName="transform"
          dur="9s"
          keyTimes="0;0.28;0.62;0.74;1"
          repeatCount="indefinite"
          type="translate"
          values="-150 0;120 0;120 0;120 0;365 0"
        />
      </g>
    </MotionFigure>
  );
}

function FullLifePicnicMotion() {
  return (
    <MotionFigure
      cue="What the foundation is for"
      description="diabetes is present, but it is not the center of the afternoon. The purpose of the plan is a fuller ordinary life."
      label="A continuously moving picnic scene where friends share food, wave, and gently toss a ball"
      title="Care should make more room for life."
    >
      <rect className={styles.picnicWash} height="320" width="720" />
      <circle className={styles.sunShape} cx="620" cy="60" r="27">
        <animate attributeName="r" dur="4.5s" repeatCount="indefinite" values="25;30;25" />
      </circle>
      <path className={styles.groundLine} d="M20 266H700" />
      <path className={styles.treeTrunk} d="M105 105v162" />
      <g className={styles.picnicLeaves}>
        <circle cx="105" cy="86" r="53" />
        <circle cx="66" cy="103" r="32" />
        <circle cx="145" cy="105" r="35" />
        <animateTransform
          attributeName="transform"
          dur="5.4s"
          repeatCount="indefinite"
          type="rotate"
          values="-2 105 135;2 105 135;-2 105 135"
        />
      </g>
      <path className={styles.blanketShape} d="M240 222l204 0 50 46H193z" />
      <path className={styles.basketShape} d="M323 209h54l-5 38h-44zM334 209c0-19 32-19 32 0" />

      <g className={styles.personWarm}>
        <circle cx="238" cy="159" r="20" />
        <path d="M211 232v-43c0-22 11-34 27-34s27 12 27 34v43z" />
        <path className={styles.personLine} d="M252 187l34-35">
          <animateTransform
            attributeName="transform"
            dur="3.6s"
            repeatCount="indefinite"
            type="rotate"
            values="-8 252 187;10 252 187;-8 252 187"
          />
        </path>
      </g>
      <g className={styles.personSage}>
        <circle cx="430" cy="161" r="20" />
        <path d="M403 233v-43c0-22 11-34 27-34s27 12 27 34v43z" />
        <path className={styles.personLine} d="M415 189l-32-34">
          <animateTransform
            attributeName="transform"
            dur="3.6s"
            repeatCount="indefinite"
            type="rotate"
            values="8 415 189;-10 415 189;8 415 189"
          />
        </path>
      </g>
      <g className={styles.personBlue}>
        <circle cx="545" cy="177" r="18" />
        <path d="M521 238v-39c0-20 10-31 24-31s24 11 24 31v39z" />
        <animateTransform
          attributeName="transform"
          dur="4.4s"
          repeatCount="indefinite"
          type="translate"
          values="0 0;0 -5;0 0"
        />
      </g>
      <circle className={styles.picnicBall} cx="0" cy="0" r="12">
        <animateMotion
          calcMode="spline"
          dur="3.6s"
          keySplines="0.4 0 0.2 1;0.4 0 0.2 1"
          keyTimes="0;0.5;1"
          path="M277 150 Q337 72 397 150 Q337 72 277 150"
          repeatCount="indefinite"
        />
        <animateTransform
          attributeName="transform"
          dur="1.2s"
          repeatCount="indefinite"
          type="rotate"
          values="0;360"
        />
      </circle>
    </MotionFigure>
  );
}

function ThenNowStory({ onReady }: { onReady?: () => void }) {
  const [view, setView] = useState<"then" | "now">("then");
  const isNow = view === "now";

  return (
    <section className={styles.thenNowStory}>
      <div
        aria-label={
          isNow
            ? "Two people sit together at a table as a question becomes easier to share"
            : "One person sits with a new diagnosis while many unanswered thoughts gather nearby"
        }
        className={styles.thenNowVisual}
        data-motion-loop="continuous"
        role="img"
      >
        <svg
          aria-hidden="true"
          className={styles.motionArt}
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 720 330"
        >
          <rect className={isNow ? styles.nowWash : styles.thenWash} height="330" width="720" />
          <circle
            className={styles.storySun}
            cx="620"
            cy="66"
            opacity={isNow ? "0.85" : "0.18"}
            r="34"
          >
            <animate attributeName="r" dur="4.8s" repeatCount="indefinite" values="31;37;31" />
          </circle>
          <path className={styles.storyFloor} d="M36 268c198-8 444-8 648 0" />

          {isNow ? (
            <g className={styles.storyMoment} key="now">
              <path className={styles.storyTable} d="M205 232h318M238 232v44M490 232v44" />
              <LessonMotionPerson
                action="reach-right"
                motion="breathe"
                palette="warm"
                scale={0.76}
                seated
                x={288}
                y={272}
              />
              <LessonMotionPerson
                action="reach-left"
                motion="nod"
                palette="sage"
                scale={0.76}
                seated
                x={450}
                y={272}
              />
              <rect
                className={styles.storyNotebook}
                height="67"
                rx="4"
                width="88"
                x="326"
                y="157"
              />
              <path
                d="M344 177 H395 M344 194 H383 M344 211 H399"
                stroke="#9bad9f"
                strokeLinecap="round"
                strokeWidth="4"
              />
              <path d="M326 111 H412 M342 94 H396" className={styles.sharedQuestion}>
                <animate
                  attributeName="opacity"
                  dur="4s"
                  repeatCount="indefinite"
                  values=".25;1;.25"
                />
              </path>
            </g>
          ) : (
            <g className={styles.storyMoment} key="then">
              <path className={styles.storyTable} d="M213 232h294M244 232v44M478 232v44" />
              <LessonMotionPerson
                action="listen"
                motion="breathe"
                palette="blue"
                scale={0.8}
                seated
                x={360}
                y={273}
              />
              <g>
                <rect
                  fill="#fffaf2"
                  height="74"
                  rx="4"
                  stroke="#8fa2a5"
                  strokeWidth="3"
                  width="82"
                  x="224"
                  y="120"
                  transform="rotate(-8 265 157)"
                />
                <path
                  d="M240 144 H287 M240 159 H279 M240 174 H291"
                  stroke="#a6b5b6"
                  strokeLinecap="round"
                  strokeWidth="4"
                />
                <rect
                  fill="#fffaf2"
                  height="75"
                  rx="4"
                  stroke="#c47b61"
                  strokeWidth="3"
                  width="84"
                  x="414"
                  y="116"
                  transform="rotate(8 456 153)"
                />
                <path
                  d="M430 140 H478 M430 155 H470 M430 170 H482"
                  stroke="#cda28f"
                  strokeLinecap="round"
                  strokeWidth="4"
                />
                <rect
                  fill="#fffaf2"
                  height="79"
                  rx="4"
                  stroke="#7f9fa8"
                  strokeWidth="3"
                  width="88"
                  x="316"
                  y="86"
                />
                <path
                  d="M333 111 H386 M333 127 H377 M333 143 H389"
                  stroke="#a5b7bb"
                  strokeLinecap="round"
                  strokeWidth="4"
                />
                <animateTransform
                  attributeName="transform"
                  dur="4.6s"
                  repeatCount="indefinite"
                  type="translate"
                  values="0 2;0 -3;0 2"
                />
              </g>
            </g>
          )}
        </svg>
      </div>

      <div aria-label="Choose a point in the story" className={styles.storyChoices} role="group">
        <button
          aria-pressed={!isNow}
          className={cn(!isNow && styles.storyChoiceActive)}
          onClick={() => {
            setView("then");
            onReady?.();
          }}
          type="button"
        >
          <span>01</span>
          At the beginning
        </button>
        <button
          aria-pressed={isNow}
          className={cn(isNow && styles.storyChoiceActive)}
          onClick={() => {
            setView("now");
            onReady?.();
          }}
          type="button"
        >
          <span>02</span>
          Fourteen days later
        </button>
      </div>

      <div aria-live="polite" className={styles.storyCopy} key={view}>
        <p className="editorial-eyebrow">{isNow ? "Now" : "Then"}</p>
        <h2>
          {isNow
            ? "You have a way to make the moment smaller."
            : "The diagnosis may have sounded larger than your life."}
        </h2>
        <p>
          {isNow
            ? "You can name what is happening, add timing and context, choose one useful tool, and ask for help when the question belongs with someone else."
            : "New words, new numbers, and new decisions can arrive all at once. It can be hard to know which question belongs first, or whether one moment has already decided the future."}
        </p>
        <em>
          {isNow
            ? "The questions did not disappear. You became less alone inside them."
            : "Feeling overwhelmed was not a failure. It was a human response to carrying too much at once."}
        </em>
      </div>
    </section>
  );
}

function ToolPracticeStudio({ onReady }: { onReady?: () => void }) {
  const [activeTool, setActiveTool] = useState<EverydayToolId>("food");
  const active = everydayTools.find((tool) => tool.id === activeTool) ?? everydayTools[0];

  return (
    <section className={styles.toolPractice}>
      <div
        aria-label={`An animated ordinary-life scene for ${active.label.toLowerCase()}`}
        className={styles.toolVisual}
        data-motion-loop="continuous"
        role="img"
      >
        <svg
          aria-hidden="true"
          className={styles.motionArt}
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 720 320"
        >
          <rect className={styles.toolWash} height="320" width="720" />
          <circle className={styles.storySun} cx="650" cy="54" r="26" />
          <path className={styles.storyFloor} d="M28 264c220-8 448-8 664 0" />

          {activeTool === "food" ? (
            <g className={styles.toolMoment} key="food">
              <ellipse className={styles.plateShape} cx="360" cy="214" rx="134" ry="30" />
              <path d="M274 198 Q360 116 446 198 Z" fill="#e6b774" />
              <path d="M308 194 Q360 148 412 194 Z" fill="#789b88" opacity=".85" />
              <path
                className={styles.foodSteam}
                d="M334 150c-14-16 14-24 0-46M386 150c-14-16 14-24 0-46"
              >
                <animateTransform
                  attributeName="transform"
                  dur="3.4s"
                  repeatCount="indefinite"
                  type="translate"
                  values="0 8;0 -7;0 8"
                />
                <animate
                  attributeName="opacity"
                  dur="3.4s"
                  repeatCount="indefinite"
                  values="0.1;0.9;0.1"
                />
              </path>
            </g>
          ) : null}

          {activeTool === "movement" ? (
            <g className={styles.toolMoment} key="movement">
              <path className={styles.treeTrunk} d="M612 118v146" />
              <circle className={styles.treeLeaf} cx="612" cy="96" r="48">
                <animateTransform
                  attributeName="transform"
                  dur="5s"
                  repeatCount="indefinite"
                  type="rotate"
                  values="-2 612 150;2 612 150;-2 612 150"
                />
              </circle>
              <path
                d="M92 240 Q244 156 372 214 T596 182"
                fill="none"
                stroke="#b8cabf"
                strokeDasharray="2 30"
                strokeLinecap="round"
                strokeWidth="12"
              />
              <circle fill="#cf7b61" r="19" stroke="#fffaf2" strokeWidth="5">
                <animateMotion
                  dur="4.2s"
                  path="M92 240 Q244 156 372 214 T596 182"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          ) : null}

          {activeTool === "medicine" ? (
            <g className={styles.toolMoment} key="medicine">
              <rect
                className={styles.medicineBottle}
                height="152"
                rx="12"
                width="120"
                x="236"
                y="118"
              />
              <rect fill="#bd7a60" height="30" rx="6" width="82" x="255" y="92" />
              <rect fill="#fffaf2" height="70" opacity=".92" rx="5" width="92" x="250" y="158" />
              <path
                d="M276 186 H326 M276 202 H318 M276 218 H322"
                stroke="#c99a86"
                strokeLinecap="round"
                strokeWidth="4"
              />
              <g>
                <rect
                  fill="#e6b774"
                  height="34"
                  rx="17"
                  stroke="#c69551"
                  strokeWidth="3"
                  width="92"
                  x="418"
                  y="150"
                />
                <path d="M464 150 V184" stroke="#c69551" strokeWidth="3" />
                <animateTransform
                  attributeName="transform"
                  dur="3.6s"
                  repeatCount="indefinite"
                  type="rotate"
                  values="-7 464 167;9 464 167;-7 464 167"
                />
              </g>
            </g>
          ) : null}

          {activeTool === "monitoring" ? (
            <g className={styles.toolMoment} key="monitoring">
              <rect className={styles.meterShape} height="192" rx="16" width="152" x="284" y="90" />
              <rect className={styles.meterScreen} height="86" rx="5" width="112" x="304" y="114">
                <animate
                  attributeName="opacity"
                  dur="3s"
                  repeatCount="indefinite"
                  values=".55;1;.55"
                />
              </rect>
              <path d="M328 150 H390" stroke="#5f947b" strokeLinecap="round" strokeWidth="10">
                <animate
                  attributeName="opacity"
                  dur="2.6s"
                  repeatCount="indefinite"
                  values=".4;1;.4"
                />
              </path>
              <path d="M328 172 H368" stroke="#9bb7ab" strokeLinecap="round" strokeWidth="8" />
              <circle cx="360" cy="252" fill="none" r="18" stroke="#789083" strokeWidth="6" />
              <path
                d="M352 252 l7 8 14 -17"
                fill="none"
                stroke="#5f947b"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="6"
              >
                <animate
                  attributeName="stroke-dasharray"
                  dur="2.8s"
                  repeatCount="indefinite"
                  values="0 45;45 0;45 0"
                />
              </path>
            </g>
          ) : null}
        </svg>
      </div>

      <div aria-label="Choose a tool to explore" className={styles.toolChoices} role="group">
        {everydayTools.map((tool, index) => (
          <button
            aria-pressed={activeTool === tool.id}
            className={cn(activeTool === tool.id && styles.toolChoiceActive)}
            key={tool.id}
            onClick={() => {
              setActiveTool(tool.id);
              onReady?.();
            }}
            type="button"
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {tool.label}
          </button>
        ))}
      </div>

      <div aria-live="polite" className={styles.toolCopy} key={activeTool}>
        <p className="editorial-eyebrow">One tool, inside one real moment</p>
        <h2>{active.title}</h2>
        <p>{active.body}</p>
        <em>{active.invitation}</em>
      </div>
    </section>
  );
}

function BodySystemLab() {
  const [activeSystem, setActiveSystem] = useState<BodySystemId>("digestion");
  const active = bodySystems.find((system) => system.id === activeSystem) ?? bodySystems[0];

  return (
    <section className={styles.bodyLab}>
      <div
        aria-label={`Animated body system showing ${active.label.toLowerCase()}`}
        className={styles.organVisual}
        data-motion-loop="continuous"
        role="img"
      >
        <svg
          aria-hidden="true"
          className={styles.motionArt}
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 720 430"
        >
          <rect className={styles.organWash} height="430" width="720" />
          <circle className={styles.organHalo} cx="250" cy="214" r="178" />

          {activeSystem === "digestion" ? (
            <g className={styles.digestionMotion} key="digestion">
              <path className={styles.esophagusShape} d="M245 47 V135" />
              <path
                className={cn(styles.stomachShape, styles.organShapeActive)}
                d="M250 118 C202 116 176 158 182 202 C187 244 222 272 268 266 C304 261 316 228 308 196 C301 166 300 140 286 130 C276 122 262 118 250 118 Z"
              />
              <path
                className={cn(styles.intestineShape, styles.organShapeActive)}
                d="M232 252 C214 276 214 300 240 312 C270 326 300 330 306 348 C312 366 290 376 268 370 C252 366 248 374 245 374"
              />
              {[0, 1, 2].map((dot) => (
                <circle key={dot} r="10" fill="#d8955c" stroke="#fff9ef" strokeWidth="3">
                  <animateMotion
                    begin={`${dot * -1.35}s`}
                    dur="5.4s"
                    path="M245 42 L245 126 C296 141 298 181 265 215 C230 250 214 292 266 317 C308 337 293 369 245 374"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    begin={`${dot * -1.35}s`}
                    dur="5.4s"
                    repeatCount="indefinite"
                    values="0;1;1;0"
                  />
                </circle>
              ))}
              <path d="M500 168 H650" stroke="#8ca9aa" strokeLinecap="round" strokeWidth="24" />
              <path d="M500 168 H650" stroke="#dceaea" strokeLinecap="round" strokeWidth="12" />
              {[0, 1, 2].map((dot) => (
                <circle key={`absorbed-${dot}`} r="7" fill="#d8955c">
                  <animateMotion
                    begin={`${dot * -1.1}s`}
                    dur="4s"
                    path="M321 350 C412 350 437 168 645 168"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    begin={`${dot * -1.1}s`}
                    dur="4s"
                    repeatCount="indefinite"
                    values="0;1;1;0"
                  />
                </circle>
              ))}
            </g>
          ) : null}

          {activeSystem === "pancreas" ? (
            <g className={styles.insulinMotion} key="pancreas">
              <path
                className={cn(styles.pancreasShape, styles.organShapeActive)}
                d="M122 230 C168 221 232 224 296 236 C332 243 362 250 358 270 C353 290 320 291 288 284 C232 273 168 258 122 230 Z"
              />
              <path d="M439 214 H662" stroke="#8ca9aa" strokeLinecap="round" strokeWidth="28" />
              <path d="M439 214 H662" stroke="#dceaea" strokeLinecap="round" strokeWidth="14" />
              <rect
                fill="#fffaf2"
                height="112"
                rx="35"
                stroke="#789083"
                strokeWidth="5"
                width="93"
                x="523"
                y="270"
              />
              <path
                d="M550 270 V245 H589 V270"
                fill="none"
                stroke="#5f947b"
                strokeLinejoin="round"
                strokeWidth="7"
              />
              {[0, 1, 2, 3].map((signal) => (
                <circle key={signal} r="7" fill="#5f947b" stroke="#f5faf6" strokeWidth="3">
                  <animateMotion
                    begin={`${signal * -0.9}s`}
                    dur="4.1s"
                    path="M316 249 C395 240 436 215 520 214 C565 214 570 241 570 270"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    begin={`${signal * -0.9}s`}
                    dur="4.1s"
                    repeatCount="indefinite"
                    values="0;1;1;0"
                  />
                </circle>
              ))}
            </g>
          ) : null}

          {activeSystem === "liver" ? (
            <g className={styles.liverMotion} key="liver">
              <path
                className={cn(styles.liverShape, styles.organShapeActive)}
                d="M110 178 C158 146 264 134 352 148 C384 153 394 182 380 212 C362 250 262 262 176 250 C132 244 100 208 110 178 Z"
              />
              <path d="M455 197 H665" stroke="#8ca9aa" strokeLinecap="round" strokeWidth="28" />
              <path d="M455 197 H665" stroke="#dceaea" strokeLinecap="round" strokeWidth="14" />
              <g fill="none" stroke="#e4b878" strokeWidth="5">
                <path d="M180 180 l18-11 18 11v22l-18 11-18-11z" />
                <path d="M218 180 l18-11 18 11v22l-18 11-18-11z" />
                <path d="M199 213 l18-11 18 11v22l-18 11-18-11z" />
              </g>
              {[0, 1, 2].map((fuel) => (
                <circle key={fuel} r="8" fill="#d5a356" stroke="#fff7e7" strokeWidth="3">
                  <animateMotion
                    begin={`${fuel * -1.05}s`}
                    dur="4.5s"
                    path="M652 197 C508 197 426 201 346 211 C293 218 253 205 215 190"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    begin={`${fuel * -1.05}s`}
                    dur="4.5s"
                    repeatCount="indefinite"
                    values="0;1;1;0"
                  />
                </circle>
              ))}
              <circle r="8" fill="#c87860" stroke="#fff7e7" strokeWidth="3">
                <animateMotion
                  dur="5.2s"
                  path="M217 228 C315 271 372 229 456 197 C520 172 584 182 652 197"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  dur="5.2s"
                  repeatCount="indefinite"
                  values="0;0;1;1;0"
                />
              </circle>
            </g>
          ) : null}

          {activeSystem === "muscle" ? (
            <g className={styles.muscleMotion} key="muscle">
              <path d="M75 116 H645" stroke="#8ca9aa" strokeLinecap="round" strokeWidth="28" />
              <path d="M75 116 H645" stroke="#dceaea" strokeLinecap="round" strokeWidth="14" />
              {[0, 1, 2].map((fiber) => (
                <g key={fiber}>
                  <path
                    className={cn(styles.muscleShape, styles.organShapeActive)}
                    d={`M176 ${221 + fiber * 72} C236 ${189 + fiber * 72} 484 ${189 + fiber * 72} 544 ${221 + fiber * 72} C484 ${253 + fiber * 72} 236 ${253 + fiber * 72} 176 ${221 + fiber * 72} Z`}
                  />
                  <path
                    d={`M218 ${221 + fiber * 72} H502`}
                    fill="none"
                    stroke="#d9e8df"
                    strokeLinecap="round"
                    strokeWidth="8"
                  >
                    <animate
                      attributeName="stroke-width"
                      begin={`${fiber * -0.5}s`}
                      dur="2.4s"
                      repeatCount="indefinite"
                      values="7;11;7"
                    />
                  </path>
                </g>
              ))}
              {[0, 1, 2, 3].map((fuel) => (
                <circle key={fuel} r="8" fill="#d5a356" stroke="#fff7e7" strokeWidth="3">
                  <animateMotion
                    begin={`${fuel * -0.8}s`}
                    dur="3.8s"
                    path={`M${115 + fuel * 115} 116 C${150 + fuel * 85} 148 ${220 + fuel * 65} ${206 + (fuel % 3) * 72} ${265 + fuel * 55} ${221 + (fuel % 3) * 72}`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    begin={`${fuel * -0.8}s`}
                    dur="3.8s"
                    repeatCount="indefinite"
                    values="0;1;1;0"
                  />
                </circle>
              ))}
            </g>
          ) : null}
        </svg>
      </div>

      <div aria-label="Choose a body system" className={styles.organChoices} role="group">
        {bodySystems.map((system, index) => (
          <button
            aria-pressed={activeSystem === system.id}
            className={cn(activeSystem === system.id && styles.organChoiceActive)}
            key={system.id}
            onClick={() => setActiveSystem(system.id)}
            type="button"
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {system.label}
          </button>
        ))}
      </div>

      <div aria-live="polite" className={styles.organCopy} key={activeSystem}>
        <p className="editorial-eyebrow">Follow this part of the system</p>
        <h2>{active.title}</h2>
        <p>{active.body}</p>
        <em>Watch for: {active.notice}</em>
      </div>
    </section>
  );
}

function NumberContextExplorer({ onReady }: { onReady?: () => void }) {
  const [activeMoment, setActiveMoment] = useState<NumberMomentId>("fasting");
  const active = numberMoments.find((moment) => moment.id === activeMoment) ?? numberMoments[0];

  return (
    <section className={styles.numberExplorer}>
      <div aria-label="Choose a reading context" className={styles.numberChoices} role="group">
        {numberMoments.map((moment, index) => (
          <button
            aria-pressed={activeMoment === moment.id}
            className={cn(activeMoment === moment.id && styles.numberChoiceActive)}
            key={moment.id}
            onClick={() => {
              setActiveMoment(moment.id);
              onReady?.();
            }}
            type="button"
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {moment.label}
          </button>
        ))}
      </div>

      <div aria-live="polite" className={styles.numberReading} key={activeMoment}>
        <div className={styles.numberWindow}>
          <span>Time window</span>
          <strong>{active.window}</strong>
        </div>
        <div>
          <p className="editorial-eyebrow">Add context</p>
          <h2>{active.context}</h2>
        </div>
        <div>
          <p className="editorial-eyebrow">Ask a useful question</p>
          <p>{active.question}</p>
        </div>
      </div>
    </section>
  );
}

function ProtectionExplorer({ onReady }: { onReady?: () => void }) {
  const [activeArea, setActiveArea] = useState<ProtectionAreaId>("eyes");
  const active = protectionAreas.find((area) => area.id === activeArea) ?? protectionAreas[0];

  return (
    <section className={styles.protectionExplorer}>
      <div
        aria-label={`Animated body map highlighting the ${active.label.toLowerCase()}`}
        className={styles.protectionVisual}
        data-motion-loop="continuous"
        role="img"
      >
        <svg
          aria-hidden="true"
          className={styles.motionArt}
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 720 430"
        >
          <rect className={styles.protectionWash} height="430" width="720" />
          <circle className={styles.organHalo} cx="360" cy="215" r="185" />

          {activeArea === "eyes" ? (
            <g key="eyes">
              <path
                d="M116 216 Q222 104 328 216 Q222 328 116 216 Z"
                fill="#fffaf2"
                stroke="#789083"
                strokeWidth="6"
              />
              <circle cx="222" cy="216" fill="#7f9fa8" r="63" stroke="#58737b" strokeWidth="5" />
              <circle cx="222" cy="216" fill="#405750" r="24" />
              <circle cx="203" cy="193" fill="#fffaf2" opacity=".85" r="10" />
              <path
                d="M399 103 Q525 113 599 216 Q525 319 399 329"
                fill="#fffaf2"
                stroke="#789083"
                strokeWidth="6"
              />
              <path d="M399 103 Q481 121 503 216 Q481 311 399 329" fill="#c97866" opacity=".45" />
              <path d="M587 154 L587 278" stroke="#7b9ea8" strokeLinecap="round" strokeWidth="12">
                <animateTransform
                  attributeName="transform"
                  dur="3.8s"
                  repeatCount="indefinite"
                  type="translate"
                  values="-30 0;30 0;-30 0"
                />
                <animate
                  attributeName="opacity"
                  dur="3.8s"
                  repeatCount="indefinite"
                  values=".25;1;.25"
                />
              </path>
            </g>
          ) : null}

          {activeArea === "kidneys" ? (
            <g key="kidneys">
              <path
                d="M218 104 C146 97 115 171 131 244 C149 327 221 351 276 302 C315 268 302 165 260 123 C248 111 234 105 218 104 Z"
                fill="#a87868"
                stroke="#80594f"
                strokeWidth="6"
              />
              <path
                d="M502 104 C574 97 605 171 589 244 C571 327 499 351 444 302 C405 268 418 165 460 123 C472 111 486 105 502 104 Z"
                fill="#a87868"
                stroke="#80594f"
                strokeWidth="6"
              />
              <path
                d="M272 191 C321 177 399 177 448 191 M276 222 C324 208 396 208 444 222"
                fill="none"
                stroke="#c77866"
                strokeLinecap="round"
                strokeWidth="12"
              />
              <path
                d="M273 244 C323 258 397 258 447 244"
                fill="none"
                stroke="#7b9ea8"
                strokeLinecap="round"
                strokeWidth="12"
              />
              <path
                d="M258 290 C287 320 316 344 329 395 M462 290 C433 320 404 344 391 395"
                fill="none"
                stroke="#d5a879"
                strokeLinecap="round"
                strokeWidth="7"
              />
              {[0, 1, 2].map((cell) => (
                <circle key={cell} r="8" fill="#d5a356" stroke="#fff7e7" strokeWidth="3">
                  <animateMotion
                    begin={`${cell * -1}s`}
                    dur="4.2s"
                    path={
                      cell % 2 === 0
                        ? "M282 190 C225 207 211 261 258 290 C294 312 315 346 329 395"
                        : "M438 190 C495 207 509 261 462 290 C426 312 405 346 391 395"
                    }
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    begin={`${cell * -1}s`}
                    dur="4.2s"
                    repeatCount="indefinite"
                    values="0;1;1;0"
                  />
                </circle>
              ))}
            </g>
          ) : null}

          {activeArea === "heart" ? (
            <g key="heart">
              <path
                d="M350 103 C314 52 240 79 239 147 C238 205 304 239 354 302 C409 238 481 207 480 145 C479 78 405 53 369 104 C362 114 358 123 354 135 C351 123 356 113 350 103 Z"
                fill="#c97866"
                stroke="#9f5b50"
                strokeWidth="7"
              >
                <animate
                  attributeName="stroke-width"
                  dur="1.6s"
                  repeatCount="indefinite"
                  values="7;11;7"
                />
              </path>
              <path
                d="M353 137 C313 158 310 205 354 249 C397 206 397 159 353 137 Z"
                fill="#e7a28e"
                opacity=".75"
              />
              <path
                d="M104 347 C198 304 254 315 319 348 C381 379 460 380 616 325"
                fill="none"
                stroke="#8ca9aa"
                strokeLinecap="round"
                strokeWidth="24"
              />
              <path
                d="M104 347 C198 304 254 315 319 348 C381 379 460 380 616 325"
                fill="none"
                stroke="#dceaea"
                strokeLinecap="round"
                strokeWidth="12"
              />
              {[0, 1, 2, 3].map((cell) => (
                <circle
                  key={cell}
                  r="8"
                  fill={cell % 2 === 0 ? "#c97866" : "#7b9ea8"}
                  stroke="#fffaf2"
                  strokeWidth="3"
                >
                  <animateMotion
                    begin={`${cell * -0.75}s`}
                    dur="3.7s"
                    path="M104 347 C198 304 254 315 319 348 C381 379 460 380 616 325"
                    repeatCount="indefinite"
                  />
                </circle>
              ))}
            </g>
          ) : null}

          {activeArea === "feet" ? (
            <g key="feet">
              <path
                d="M292 268 C296 236 286 196 256 190 C226 184 196 200 176 176 C160 157 150 168 150 190 C150 214 158 236 150 258 C144 276 160 286 186 286 C224 286 262 288 292 268 Z"
                fill="#d8aa89"
                stroke="#8d6c5e"
                strokeLinejoin="round"
                strokeWidth="6"
              />
              {[0, 1, 2, 3, 4].map((toe) => (
                <circle
                  key={`ltoe-${toe}`}
                  cx={168 + toe * 5}
                  cy={150 + toe * 20}
                  fill="#d8aa89"
                  r={11 - toe}
                  stroke="#8d6c5e"
                  strokeWidth="4"
                />
              ))}
              <path
                d="M428 268 C424 236 434 196 464 190 C494 184 524 200 544 176 C560 157 570 168 570 190 C570 214 562 236 570 258 C576 276 560 286 534 286 C496 286 458 288 428 268 Z"
                fill="#d8aa89"
                stroke="#8d6c5e"
                strokeLinejoin="round"
                strokeWidth="6"
              />
              {[0, 1, 2, 3, 4].map((toe) => (
                <circle
                  key={`rtoe-${toe}`}
                  cx={552 - toe * 5}
                  cy={150 + toe * 20}
                  fill="#d8aa89"
                  r={11 - toe}
                  stroke="#8d6c5e"
                  strokeWidth="4"
                />
              ))}
              <path d="M130 335 H590" stroke="#789083" strokeLinecap="round" strokeWidth="7" />
              <g>
                <circle
                  cx="185"
                  cy="235"
                  fill="#fffaf2"
                  opacity=".7"
                  r="29"
                  stroke="#c77962"
                  strokeWidth="5"
                />
                <path
                  d="M185 207 V263 M157 235 H213"
                  stroke="#c77962"
                  strokeLinecap="round"
                  strokeWidth="4"
                />
                <animateMotion
                  dur="5.2s"
                  path="M0 0 C75 -100 230 -110 348 0 C230 -110 75 -100 0 0"
                  repeatCount="indefinite"
                />
              </g>
            </g>
          ) : null}
        </svg>
      </div>

      <div aria-label="Choose an area to protect" className={styles.protectionChoices} role="group">
        {protectionAreas.map((area, index) => (
          <button
            aria-pressed={activeArea === area.id}
            className={cn(activeArea === area.id && styles.protectionChoiceActive)}
            key={area.id}
            onClick={() => {
              setActiveArea(area.id);
              onReady?.();
            }}
            type="button"
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {area.label}
          </button>
        ))}
      </div>

      <div aria-live="polite" className={styles.protectionCopy} key={activeArea}>
        <p className="editorial-eyebrow">Protect without predicting the worst</p>
        <h2>{active.title}</h2>
        <p>{active.body}</p>
        <em>{active.prompt}</em>
      </div>
    </section>
  );
}

function ReturnScenarioExplorer({ onReady }: { onReady?: () => void }) {
  const [activeScenario, setActiveScenario] = useState<ReturnScenarioId>("restaurant");
  const active =
    returnScenarios.find((scenario) => scenario.id === activeScenario) ?? returnScenarios[0];

  return (
    <section className={styles.returnExplorer}>
      <div
        aria-label={`Animated next step for ${active.label.toLowerCase()}`}
        className={styles.returnVisual}
        data-motion-loop="continuous"
        role="img"
      >
        <svg
          aria-hidden="true"
          className={styles.motionArt}
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 720 320"
        >
          <rect className={styles.returnWash} height="320" width="720" />
          <path className={styles.storyFloor} d="M38 268 H682" />

          {activeScenario === "restaurant" ? (
            <g key="restaurant">
              <rect
                fill="#fffaf2"
                height="176"
                rx="8"
                stroke="#c9896f"
                strokeWidth="4"
                width="160"
                x="280"
                y="80"
              />
              <path
                d="M330 100 V120 M340 100 V120 M350 100 V120 M340 120 V158"
                fill="none"
                stroke="#c9896f"
                strokeLinecap="round"
                strokeWidth="4"
              />
              <path
                d="M392 100 C404 104 404 128 392 132 M392 100 V158"
                fill="none"
                stroke="#c9896f"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
              />
              <rect fill="#e7b879" height="13" rx="6" opacity=".5" width="82" x="300" y="176">
                <animate
                  attributeName="opacity"
                  dur="2.8s"
                  repeatCount="indefinite"
                  values=".2;.75;.2"
                />
              </rect>
              <path
                d="M300 202 H416 M300 224 H430"
                stroke="#c3a894"
                strokeLinecap="round"
                strokeWidth="6"
              />
            </g>
          ) : null}

          {activeScenario === "reading" ? (
            <g key="reading">
              <rect
                fill="#fffaf2"
                height="150"
                rx="8"
                stroke="#7b9ea8"
                strokeWidth="4"
                width="212"
                x="254"
                y="82"
              />
              <path d="M282 112 H360" stroke="#a6b6b7" strokeLinecap="round" strokeWidth="6" />
              <path
                d="M282 202 L322 176 L352 186 L392 132 L432 166 L468 152"
                fill="none"
                stroke="#c47b61"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="5"
              />
              <circle cx="392" cy="132" fill="#c47b61" r="9" stroke="#fffaf2" strokeWidth="3">
                <animate attributeName="r" dur="2s" repeatCount="indefinite" values="7;11;7" />
              </circle>
            </g>
          ) : null}

          {activeScenario === "routine" ? (
            <g key="routine">
              <rect
                fill="#fffaf2"
                height="158"
                rx="8"
                stroke="#7b9ea8"
                strokeWidth="4"
                width="176"
                x="272"
                y="80"
              />
              <path
                d="M272 120 H448 M312 66 V98 M408 66 V98"
                stroke="#7b9ea8"
                strokeLinecap="round"
                strokeWidth="6"
              />
              <rect fill="#eef2f0" height="24" rx="3" width="44" x="292" y="136" />
              <rect fill="#eef2f0" height="24" rx="3" width="44" x="344" y="136" />
              <rect fill="#eef2f0" height="24" rx="3" width="44" x="292" y="172" />
              <rect fill="#eef2f0" height="24" rx="3" width="44" x="344" y="172" />
              <rect
                fill="#e7b879"
                height="24"
                rx="4"
                stroke="#c69551"
                strokeWidth="2"
                width="44"
                x="396"
                y="136"
              >
                <animateTransform
                  attributeName="transform"
                  dur="3.4s"
                  keyTimes="0;0.4;0.6;1"
                  repeatCount="indefinite"
                  type="translate"
                  values="0 0;0 36;0 36;0 0"
                />
              </rect>
            </g>
          ) : null}
        </svg>
      </div>
      <div aria-label="Choose a changed moment" className={styles.returnChoices} role="group">
        {returnScenarios.map((scenario, index) => (
          <button
            aria-pressed={activeScenario === scenario.id}
            className={cn(activeScenario === scenario.id && styles.returnChoiceActive)}
            key={scenario.id}
            onClick={() => {
              setActiveScenario(scenario.id);
              onReady?.();
            }}
            type="button"
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {scenario.label}
          </button>
        ))}
      </div>
      <div aria-live="polite" className={styles.returnCopy} key={activeScenario}>
        <p className="editorial-eyebrow">The next useful move</p>
        <h2>{active.next}</h2>
        <p>{active.release}</p>
      </div>
    </section>
  );
}

function SupportPractice({ onReady }: { onReady?: () => void }) {
  const [activeSupport, setActiveSupport] = useState<SupportOptionId>("listen");
  const active = supportOptions.find((option) => option.id === activeSupport) ?? supportOptions[0];
  const isBoundary = activeSupport === "boundary";

  return (
    <section className={styles.supportPractice}>
      <div
        aria-label={
          isBoundary
            ? "A shield marks a respected boundary"
            : "A single symbol for the chosen kind of support"
        }
        className={styles.supportVisual}
        data-motion-loop="continuous"
        role="img"
      >
        <svg
          aria-hidden="true"
          className={styles.motionArt}
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 720 320"
        >
          <rect className={styles.supportWash} height="320" width="720" />
          <path className={styles.storyFloor} d="M42 264c205-8 432-8 636 0" />

          {activeSupport === "listen" ? (
            <g key="listen">
              <animateTransform
                attributeName="transform"
                dur="3.6s"
                repeatCount="indefinite"
                type="translate"
                values="0 0;0 -6;0 0"
              />
              <path
                d="M262 92 H458 Q482 92 482 116 V184 Q482 208 458 208 H352 L318 240 L322 208 H286 Q262 208 262 184 V116 Q262 92 286 92 Z"
                fill="#fffaf2"
                stroke="#7b9ea8"
                strokeWidth="4"
              />
              <path
                d="M292 132 H452 M292 156 H420 M292 180 H438"
                stroke="#a6b6b7"
                strokeLinecap="round"
                strokeWidth="7"
              >
                <animate
                  attributeName="opacity"
                  dur="3.4s"
                  repeatCount="indefinite"
                  values=".4;1;.4"
                />
              </path>
              <path
                d="M500 126 Q524 150 500 174 M520 112 Q556 150 520 188"
                fill="none"
                stroke="#8ca79a"
                strokeLinecap="round"
                strokeWidth="4"
              >
                <animate
                  attributeName="opacity"
                  dur="2.2s"
                  repeatCount="indefinite"
                  values="0;1;0"
                />
              </path>
            </g>
          ) : null}

          {activeSupport === "company" ? (
            <g key="company">
              <path
                d="M360 244 C300 194 268 162 268 130 C268 106 286 90 308 90 C328 90 346 104 360 126 C374 104 392 90 412 90 C434 90 452 106 452 130 C452 162 420 194 360 244 Z"
                fill="#cf7b61"
                stroke="#a7614e"
                strokeWidth="5"
              >
                <animate
                  attributeName="stroke-width"
                  dur="1.4s"
                  repeatCount="indefinite"
                  values="5;10;5"
                />
              </path>
              {[0, 1, 2].map((i) => (
                <path
                  d="M0 10 C-8 4 -12 0 -12 -5 C-12 -9 -8 -10 -4 -7 C-1 -5 0 -3 0 -1 C0 -3 1 -5 4 -7 C8 -10 12 -9 12 -5 C12 0 8 4 0 10 Z"
                  fill="#cf7b61"
                  key={i}
                  opacity="0"
                >
                  <animateTransform
                    attributeName="transform"
                    begin={`${i * -1.6}s`}
                    dur="4.8s"
                    repeatCount="indefinite"
                    type="translate"
                    values="360 118;384 34"
                  />
                  <animate
                    attributeName="opacity"
                    begin={`${i * -1.6}s`}
                    dur="4.8s"
                    repeatCount="indefinite"
                    values="0;0.8;0"
                  />
                </path>
              ))}
            </g>
          ) : null}

          {activeSupport === "practical" ? (
            <g key="practical">
              <rect
                fill="#fffaf2"
                height="152"
                rx="8"
                stroke="#7b9ea8"
                strokeWidth="4"
                width="182"
                x="269"
                y="84"
              />
              <circle cx="300" cy="120" fill="none" r="13" stroke="#5f947b" strokeWidth="4" />
              <path
                d="M293 120 l6 7 11 -13"
                fill="none"
                stroke="#5f947b"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
              >
                <animate
                  attributeName="stroke-dasharray"
                  dur="2.6s"
                  repeatCount="indefinite"
                  values="0 32;32 0;32 0"
                />
              </path>
              <path d="M326 120 H432" stroke="#8ca79a" strokeLinecap="round" strokeWidth="7" />
              <path d="M300 158 H432" stroke="#cdd6cf" strokeLinecap="round" strokeWidth="7">
                <animate
                  attributeName="opacity"
                  dur="3.2s"
                  keyTimes="0;0.3;0.7;1"
                  repeatCount="indefinite"
                  values=".25;1;1;.25"
                />
              </path>
              <path d="M300 190 H408" stroke="#cdd6cf" strokeLinecap="round" strokeWidth="7">
                <animate
                  attributeName="opacity"
                  begin="-1.6s"
                  dur="3.2s"
                  keyTimes="0;0.3;0.7;1"
                  repeatCount="indefinite"
                  values=".25;1;1;.25"
                />
              </path>
            </g>
          ) : null}

          {isBoundary ? (
            <g key="boundary">
              <ellipse
                cx="360"
                cy="176"
                fill="none"
                rx="52"
                ry="58"
                stroke="#8aa596"
                strokeWidth="3"
              >
                <animate attributeName="rx" dur="3s" repeatCount="indefinite" values="46;60;46" />
                <animate attributeName="ry" dur="3s" repeatCount="indefinite" values="52;66;52" />
                <animate
                  attributeName="opacity"
                  dur="3s"
                  repeatCount="indefinite"
                  values=".55;0;.55"
                />
              </ellipse>
              <path
                d="M360 86 L442 116 V182 C442 226 404 252 360 266 C316 252 278 226 278 182 V116 Z"
                fill="#dfe8e2"
                stroke="#58756a"
                strokeWidth="5"
              />
              <path
                d="M336 176 l15 17 32 -40"
                fill="none"
                stroke="#58756a"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="6"
              >
                <animate
                  attributeName="stroke-dasharray"
                  dur="2.8s"
                  repeatCount="indefinite"
                  values="0 80;80 0;80 0"
                />
              </path>
            </g>
          ) : null}
        </svg>
      </div>

      <div
        aria-label="Choose what support means today"
        className={styles.supportChoices}
        role="group"
      >
        {supportOptions.map((option, index) => (
          <button
            aria-pressed={activeSupport === option.id}
            className={cn(activeSupport === option.id && styles.supportChoiceActive)}
            key={option.id}
            onClick={() => {
              setActiveSupport(option.id);
              onReady?.();
            }}
            type="button"
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {option.label}
          </button>
        ))}
      </div>

      <div aria-live="polite" className={styles.supportCopy} key={activeSupport}>
        <p className="editorial-eyebrow">A response that respects the request</p>
        <h2>{active.title}</h2>
        <blockquote>“{active.response}”</blockquote>
      </div>
    </section>
  );
}

const journeyMilestones = [
  { day: 1, learned: "Day 1 asked you to understand, not to be perfect.", x: 56, y: 172 },
  {
    day: 3,
    learned: "A lab number became a question with context, not a verdict.",
    x: 178,
    y: 150,
  },
  {
    day: 6,
    learned: "Movement became something your body could use, in your own way.",
    x: 312,
    y: 126,
  },
  { day: 9, learned: "Highs and lows became signals you can notice and answer.", x: 452, y: 100 },
  { day: 12, learned: "A disrupted day became something to reroute, not abandon.", x: 584, y: 78 },
  { day: 14, learned: "You know more than you did fourteen days ago.", x: 684, y: 58 },
] as const;

function FourteenDayTrace({ onReady }: { onReady?: () => void }) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const active = journeyMilestones.find((milestone) => milestone.day === selectedDay) ?? null;

  return (
    <div className={styles.journeyTrace}>
      <div className={styles.journeyTraceHead}>
        <p className="editorial-eyebrow">Fourteen days, one quiet climb</p>
        <p>Tap a marked day to remember what became a little clearer.</p>
      </div>
      <svg
        aria-label="A gently rising line across fourteen days. Tap a marked day to recall what became clearer. This is a felt sense of understanding, not a measurement."
        className={styles.journeyTraceSvg}
        role="group"
        viewBox="0 0 720 200"
      >
        <path d="M40 178 H700" stroke="#e0cdbb" strokeWidth="2" />
        <path
          className={styles.journeyLine}
          d="M56 172 C120 163 150 156 178 150 C240 138 262 132 312 126 C382 116 402 110 452 100 C520 88 546 84 584 78 C632 70 656 64 684 58"
          fill="none"
          pathLength="1"
          stroke="#b96c55"
          strokeLinecap="round"
          strokeWidth="6"
        />
        {journeyMilestones.map((milestone) => {
          const isActive = selectedDay === milestone.day;
          return (
            <circle
              aria-label={`Day ${milestone.day}: ${milestone.learned}`}
              className={cn(styles.journeyDot, isActive && styles.journeyDotActive)}
              cx={milestone.x}
              cy={milestone.y}
              fill={isActive ? "#6f947a" : "#fffaf3"}
              key={milestone.day}
              onClick={() => {
                setSelectedDay(milestone.day);
                onReady?.();
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedDay(milestone.day);
                  onReady?.();
                }
              }}
              r={isActive ? 11 : 7}
              role="button"
              stroke={isActive ? "#476a53" : "#b96c55"}
              strokeWidth="3"
              tabIndex={0}
            />
          );
        })}
      </svg>
      <p aria-live="polite" className={styles.journeyCaption}>
        {active
          ? `Day ${active.day} · ${active.learned}`
          : "A foundation is something steady to stand on when uncertainty returns. Tap a day to see one step of the climb."}
      </p>
    </div>
  );
}

const biteStations = [
  {
    caption: "It starts as an ordinary meal. Carbohydrate foods carry most of the glucose.",
    label: "On the plate",
  },
  {
    caption: "Digestion breaks the food down into glucose, a simple sugar the body can use.",
    label: "In the stomach",
  },
  {
    caption: "Glucose enters the bloodstream, so blood glucose gently rises after eating.",
    label: "Into the blood",
  },
  {
    caption:
      "Insulin is the key that lets glucose into cells for energy. In type 2, the key works less well, so glucose can linger in the blood.",
    label: "Into the cells",
  },
] as const;

function FollowOneBite({ onReady }: { onReady?: () => void }) {
  const [step, setStep] = useState(0);
  const stationX = [96, 272, 448, 624];
  const total = biteStations.length;
  const atLast = step === total - 1;
  const active = biteStations[step] ?? biteStations[0];

  return (
    <div className={styles.bite}>
      <div className={styles.journeyTraceHead}>
        <p className="editorial-eyebrow">Follow one bite</p>
        <p>Walk a single piece of food through the body, one step at a time.</p>
      </div>
      <svg
        aria-label={`Step ${step + 1} of ${total}, ${active.label}. ${active.caption}`}
        className={styles.biteSvg}
        role="img"
        viewBox="0 0 720 150"
      >
        <path
          d="M96 96 H624"
          fill="none"
          stroke="#d8c7b8"
          strokeDasharray="2 12"
          strokeLinecap="round"
          strokeWidth="4"
        />
        {biteStations.map((station, index) => (
          <circle
            cx={stationX[index]}
            cy="96"
            fill={index <= step ? "#f0e2d0" : "#f5efe6"}
            key={station.label}
            r="24"
            stroke={index <= step ? "#b96c55" : "#dccbbb"}
            strokeWidth="3"
          />
        ))}
        <circle
          className={styles.biteParticle}
          cx="0"
          cy="96"
          fill="#e0a24f"
          r="12"
          stroke="#fff7e7"
          strokeWidth="3"
          style={{ transform: `translateX(${stationX[step]}px)` }}
        />
      </svg>
      <div className={styles.biteControls}>
        <div>
          <p className={styles.biteStationLabel}>{active.label}</p>
          <p aria-live="polite" className={styles.biteStationCaption}>
            {active.caption}
          </p>
        </div>
        <button
          className={styles.biteButton}
          onClick={() => {
            const next = atLast ? 0 : step + 1;
            setStep(next);
            if (next === total - 1) {
              onReady?.();
            }
          }}
          type="button"
        >
          {atLast ? "Start over" : "Next step"}
        </button>
      </div>
    </div>
  );
}

function PracticeLoop() {
  const [running, setRunning] = useState(false);
  const loopPath = "M250 42 A88 88 0 1 1 250 218 A88 88 0 1 1 250 42";
  const stations = [
    { label: "Notice", labelY: 26, x: 250, y: 42 },
    { label: "Try", labelY: 205, x: 326, y: 174 },
    { label: "Adjust", labelY: 205, x: 174, y: 174 },
  ];

  return (
    <div className={styles.loop}>
      <div className={styles.journeyTraceHead}>
        <p className="editorial-eyebrow">Practice is a loop, not a finish line</p>
        <p>Start the loop and watch it turn: notice, try, adjust, and around again.</p>
      </div>
      <svg
        aria-label="A circular loop marked notice, try, and adjust. Starting it sends a dot travelling around the loop again and again."
        className={styles.loopSvg}
        role="img"
        viewBox="0 0 500 250"
      >
        <path d={loopPath} fill="none" stroke="#e0cdbb" strokeWidth="6" />
        {stations.map((station) => (
          <g key={station.label}>
            <circle
              cx={station.x}
              cy={station.y}
              fill="#f0e2d0"
              r="10"
              stroke="#b96c55"
              strokeWidth="3"
            />
            <text fill="#7a6a5f" fontSize="15" textAnchor="middle" x={station.x} y={station.labelY}>
              {station.label}
            </text>
          </g>
        ))}
        {running ? (
          <circle fill="#6f947a" r="10" stroke="#fffaf3" strokeWidth="3">
            <animateMotion dur="6s" path={loopPath} repeatCount="indefinite" />
          </circle>
        ) : null}
      </svg>
      <div className={styles.loopControls}>
        <p aria-live="polite" className={styles.journeyCaption}>
          {running
            ? "It keeps turning. Each pass is a little more yours. There is no lap that fails."
            : "The loop does not end at day fourteen. It just keeps gently turning."}
        </p>
        <button
          className={styles.loopButton}
          onClick={() => setRunning((current) => !current)}
          type="button"
        >
          {running ? "Pause the loop" : "Start the loop"}
        </button>
      </div>
    </div>
  );
}

const foundationStones = [
  "Understanding, not perfection",
  "Numbers read with context",
  "Food and movement that fit you",
  "Medicine as a tool, not a verdict",
  "Care that can be shared",
] as const;

function BuildFoundation({ onReady }: { onReady?: () => void }) {
  const [placed, setPlaced] = useState<Set<number>>(() => new Set());
  const blocks = [
    { x: 160, y: 150 },
    { x: 258, y: 150 },
    { x: 356, y: 150 },
    { x: 209, y: 110 },
    { x: 307, y: 110 },
  ];
  const total = foundationStones.length;
  const complete = placed.size === total;

  return (
    <div className={styles.foundation}>
      <div className={styles.journeyTraceHead}>
        <p className="editorial-eyebrow">Set your foundation in place</p>
        <p>Tap at least two ideas you now carry and watch them become a steady place to stand.</p>
      </div>
      <svg aria-hidden="true" className={styles.foundationSvg} viewBox="0 0 516 200">
        <path d="M96 186 H420" fill="none" stroke="#cbb9a8" strokeLinecap="round" strokeWidth="3" />
        {blocks.map((block, index) => {
          const isPlaced = placed.has(index);
          return (
            <rect
              className={styles.foundationBlock}
              fill={isPlaced ? "#c98a6f" : "#efe7db"}
              height="34"
              key={index}
              rx="6"
              stroke={isPlaced ? "#a2634c" : "#ddd0c1"}
              strokeWidth="2"
              style={{
                opacity: isPlaced ? 1 : 0.35,
                transform: isPlaced ? "translateY(0)" : "translateY(-9px)",
              }}
              width="92"
              x={block.x - 46}
              y={block.y}
            />
          );
        })}
      </svg>
      <div aria-label="Ideas you now carry" className={styles.foundationChips} role="group">
        {foundationStones.map((stone, index) => (
          <button
            aria-pressed={placed.has(index)}
            className={cn(styles.foundationChip, placed.has(index) && styles.foundationChipActive)}
            key={stone}
            onClick={() => {
              const willHave = placed.has(index) ? placed.size - 1 : placed.size + 1;
              setPlaced((current) => {
                const next = new Set(current);
                if (next.has(index)) {
                  next.delete(index);
                } else {
                  next.add(index);
                }
                return next;
              });
              if (willHave >= 2) {
                onReady?.();
              }
            }}
            type="button"
          >
            {stone}
          </button>
        ))}
      </div>
      <p aria-live="polite" className={styles.journeyCaption}>
        {complete
          ? "Your foundation is built. It holds because you set each piece yourself."
          : placed.size === 0
            ? "Tap an idea to set the first piece."
            : `${placed.size} of ${total} in place.`}
      </p>
    </div>
  );
}

export function DayFourteenExperience({ lesson: experience }: { lesson: LessonPlayerViewModel }) {
  const router = useRouter();
  const positionKey = `health-decoded:day-fourteen-position:${experience.lessonProgressId}`;
  const gateStorageKey = `${positionKey}:ready`;
  const draftKey = `health-decoded:day-fourteen-foundation:${experience.lessonProgressId}`;
  const [stage, setStage] = useState(0);
  const [draft, setDraft] = useState<MilestoneDraft>(initialDraft);
  const [hydrated, setHydrated] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [readyStages, setReadyStages] = useState<Set<number>>(() => new Set());
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
  const markTraceReady = useCallback(() => markReady(0), [markReady]);
  const markStoryReady = useCallback(() => markReady(1), [markReady]);
  const markOrdinaryMomentReady = useCallback(() => markReady(2), [markReady]);
  const markBiteReady = useCallback(() => markReady(3), [markReady]);
  const markNumberReady = useCallback(() => markReady(4), [markReady]);
  const markToolReady = useCallback(() => markReady(5), [markReady]);
  const markProtectionReady = useCallback(() => markReady(6), [markReady]);
  const markReturnReady = useCallback(() => markReady(7), [markReady]);
  const markSupportReady = useCallback(() => markReady(8), [markReady]);
  const markFoundationReady = useCallback(() => markReady(9), [markReady]);
  const stageLocked = isLessonStageLocked({
    accessMode: experience.accessMode,
    gates: dayFourteenStageGates,
    readyStages,
    stage,
  });
  const stageGateMessage = dayFourteenStageGates[stage];
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const savedDraft = window.localStorage.getItem(draftKey);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft) as Partial<MilestoneDraft>;
        setDraft({
          arrivalFeeling: typeof parsed.arrivalFeeling === "string" ? parsed.arrivalFeeling : null,
          nextStep: typeof parsed.nextStep === "string" ? parsed.nextStep : null,
          promise: typeof parsed.promise === "string" ? parsed.promise : "",
        });
      }

      if (experience.accessMode !== "review") {
        let restoredReady = new Set<number>();
        const parsedReady = JSON.parse(
          window.localStorage.getItem(gateStorageKey) ?? "[]",
        ) as unknown;
        if (Array.isArray(parsedReady)) {
          restoredReady = new Set(
            parsedReady.filter((value): value is number => Number.isInteger(value) && value >= 0),
          );
        }
        setReadyStages(restoredReady);
        const storedStage = Number(window.localStorage.getItem(positionKey));
        if (Number.isInteger(storedStage) && storedStage >= 0 && storedStage < stageCount) {
          setStage(
            getLessonResumeStage({
              gates: dayFourteenStageGates,
              readyStages: restoredReady,
              storedStage,
            }),
          );
        }
      }
    } catch {
      setMessage("Your private milestone note could not be restored in this browser.");
    } finally {
      setHydrated(true);
    }
  }, [draftKey, experience.accessMode, gateStorageKey, positionKey]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(draftKey, JSON.stringify(draft));
    } catch {
      setMessage("Your private milestone note could not be saved in this browser.");
    }
  }, [draft, draftKey, hydrated]);

  useEffect(() => {
    if (stage > 0) stageRef.current?.focus();
  }, [stage]);

  function updateDraft(patch: Partial<MilestoneDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
  }

  function saveStage(nextStage: number) {
    if (experience.accessMode === "review") return;
    window.localStorage.setItem(positionKey, String(nextStage));
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
        gates: dayFourteenStageGates,
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

  function continueLabel() {
    return (
      [
        "Look back at the beginning",
        "See what changed",
        "Revisit the body story",
        "Read numbers with context",
        "Bring the tools together",
        "Protect without fear",
        "Practice the return",
        "Let support in",
        "Look toward the next phase",
        "See the milestone",
      ][stage] ?? "Continue"
    );
  }

  function finishExperience() {
    if (experience.accessMode === "review") {
      router.push("/progress");
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
      window.localStorage.removeItem(positionKey);
      window.localStorage.removeItem(gateStorageKey);
      router.push(`/journey?completed=${experience.dayNumber}`);
    });
  }

  function clearPrivateDraft() {
    window.localStorage.removeItem(draftKey);
    setDraft(initialDraft);
    setMessage("Your private Day 14 note was cleared from this browser.");
  }

  const selectedStep = nextSteps.find(([id]) => id === draft.nextStep);

  function renderStage() {
    switch (stage) {
      case 0:
        return (
          <div className={styles.chapter}>
            <LessonHeading label="Day 14 · Your foundation is built">
              You know more than you did fourteen days ago.
            </LessonHeading>
            <p className={styles.lede}>
              Today is not an exam and it is not a finale. It is a quiet place to notice what has
              become clearer, and what you can now carry into real life.
            </p>

            <LessonStoryImage
              alt="Two sisters sit at a warm dining table, quietly looking back through a learning notebook and weekly calendar"
              caption="Recognition does not have to look dramatic. It may be a question that now has words, a number that feels less frightening, or one decision that no longer feels impossible."
              emphasis="Some kinds of confidence arrive quietly."
              height={941}
              priority
              src="/lessons/day-14/quiet-recognition.jpg"
              width={1672}
            />

            <blockquote className={styles.pullQuote}>
              A foundation is not proof that you will never feel uncertain. It is something steady
              to stand on when uncertainty returns.
            </blockquote>

            <FourteenDayTrace onReady={markTraceReady} />

            <section className={styles.optionalReflection}>
              <div>
                <p className="editorial-eyebrow">Optional reflection</p>
                <h2>What feels closest as you arrive?</h2>
                <p>You can choose one, or simply keep reading.</p>
              </div>
              <div>
                {arrivalFeelings.map(([id, label], index) => (
                  <EditorialChoice
                    index={index}
                    key={id}
                    onClick={() => updateDraft({ arrivalFeeling: id })}
                    selected={draft.arrivalFeeling === id}
                  >
                    {label}
                  </EditorialChoice>
                ))}
              </div>
            </section>
          </div>
        );

      case 1:
        return (
          <div className={styles.chapter}>
            <LessonHeading label="Where you began">
              The first day asked you to understand, not to become perfect.
            </LessonHeading>
            <ThenNowStory onReady={markStoryReady} />
            <p className={styles.handwrittenLine}>
              The first change may be simple: the question in front of you no longer feels
              impossible to enter.
            </p>
          </div>
        );

      case 2:
        return (
          <div className={styles.chapter}>
            <LessonHeading label="Knowledge that travels">
              The lessons were never meant to stay in separate boxes.
            </LessonHeading>
            <OrdinaryLifeMotion onReady={markOrdinaryMomentReady} />
            <div className={styles.editorialColumns}>
              <p>
                <span>Y</span>ou learned what insulin resistance means so the diagnosis could become
                understandable instead of mysterious. You learned to see food, movement, medication,
                and monitoring as tools, not tests of character.
              </p>
              <p>
                Then the circle widened: safety, prevention, problem solving, support, and the
                people around you. The point was never to memorize fourteen lessons. It was to make
                the next real moment easier to meet.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className={styles.chapter}>
            <LessonHeading label="Your body makes more sense">
              An explanation can take the place of blame.
            </LessonHeading>
            <p className={styles.lede}>
              Choose a body system and follow what it does. Each organ stays visible so the
              animation feels like one connected body, not four unrelated diagrams.
            </p>
            <BodySystemLab />
            <FollowOneBite onReady={markBiteReady} />
            <blockquote className={styles.pullQuote}>
              Your body is not an enemy to defeat. It is a living system you can learn to support.
            </blockquote>
          </div>
        );

      case 4:
        return (
          <div className={styles.chapter}>
            <LessonHeading label="Numbers without judgment">
              A reading is a clue. Context helps it speak.
            </LessonHeading>
            <p className={styles.lede}>
              Pick a moment. Watch how the meaning changes when the time window and a useful
              question travel beside the result.
            </p>
            <NumberContextExplorer onReady={markNumberReady} />
            <p className={styles.closingSentence}>
              The skill is not forcing every number to behave. The skill is knowing how to respond
              without turning information into shame.
            </p>
          </div>
        );

      case 5:
        return (
          <div className={styles.chapter}>
            <LessonHeading label="Tools that can work together">
              A plan can be flexible without becoming careless.
            </LessonHeading>
            <p className={styles.lede}>
              Choose a moment below. The same person is not asked to use every tool at once; the
              scene changes to show how one tool can support one ordinary part of life.
            </p>
            <ToolPracticeStudio onReady={markToolReady} />
          </div>
        );

      case 6:
        return (
          <div className={styles.chapter}>
            <LessonHeading label="Protection without fear">
              Prevention is care showing up before a problem becomes loud.
            </LessonHeading>
            <p className={styles.lede}>
              Explore an area of the body. The point is not to predict a complication; it is to see
              how early attention can make care calmer and more useful.
            </p>
            <ProtectionExplorer onReady={markProtectionReady} />
            <blockquote className={styles.pullQuote}>
              Risk is not destiny. Early attention is not pessimism; it is protection.
            </blockquote>
          </div>
        );

      case 7:
        return (
          <div className={styles.chapter}>
            <LessonHeading label="Problem solving for real life">
              Confidence is knowing how to return, not knowing every answer.
            </LessonHeading>
            <ReturnAfterRainMotion />
            <ReturnScenarioExplorer onReady={markReturnReady} />
          </div>
        );

      case 8:
        return (
          <div className={styles.chapter}>
            <LessonHeading label="Care can be shared">
              Support works best when people know what helpful means.
            </LessonHeading>
            <p className={styles.lede}>
              Choose what would actually help today. The scene and response change because support
              should follow the person’s request, not the helper’s guess.
            </p>
            <SupportPractice onReady={markSupportReady} />
            <blockquote className={styles.pullQuote}>
              Needing support does not make the foundation weaker. It gives the foundation more
              places to stand.
            </blockquote>
          </div>
        );

      case 9:
        return (
          <div className={styles.chapter}>
            <LessonHeading label="The next 76 days">
              Knowledge becomes yours through practice, not pressure.
            </LessonHeading>
            <LessonStoryImage
              alt="A grandfather and his teenage granddaughter laugh together while planting herbs in a neighborhood garden"
              caption="Health knowledge matters because it supports a life with people, plans, ordinary pleasures, and new seasons, not because health must become the center of every day."
              emphasis="The goal is more life, not more diabetes."
              height={941}
              src="/lessons/day-14/life-keeps-growing.jpg"
              width={1672}
            />
            <FullLifePicnicMotion />
            <BuildFoundation onReady={markFoundationReady} />
            <div className={styles.nextPhase}>
              <p>
                The first fourteen days built language and structure. The next seventy-six are for
                trying, noticing, repeating, asking, and adjusting. Some weeks will feel smooth.
                Others will be crowded or uncertain. Both belong in the learning.
              </p>
              <blockquote>
                Practice is not the part after learning. Practice is how learning becomes yours.
              </blockquote>
            </div>

            <PracticeLoop />

            <section className={styles.nextStepSection}>
              <div>
                <p className="editorial-eyebrow">One gentle next step</p>
                <h2>Choose one thing to carry into the next month.</h2>
                <p>Choosing is optional. This is not a five-part plan.</p>
              </div>
              <div className={styles.nextStepChoices}>
                {nextSteps.map(([id, label], index) => (
                  <EditorialChoice
                    index={index}
                    key={id}
                    onClick={() => updateDraft({ nextStep: id })}
                    selected={draft.nextStep === id}
                  >
                    {label}
                  </EditorialChoice>
                ))}
              </div>
            </section>

            <label className={styles.promiseField}>
              <span>A few private words to your future self, if you want to leave them</span>
              <textarea
                maxLength={280}
                onChange={(event) => updateDraft({ promise: event.target.value })}
                placeholder="When things feel difficult, I hope I remember…"
                rows={4}
                value={draft.promise}
              />
              <small>
                This note is saved only in this browser. It is not sent to Health Decoded as health
                information.
              </small>
            </label>
          </div>
        );

      default:
        return (
          <div className={styles.chapter}>
            <div className={styles.milestoneOpening}>
              <p className="editorial-eyebrow">Foundation complete · Days 1–14</p>
              <p aria-hidden="true" className={styles.milestoneNumber}>
                14
              </p>
              <LessonHeading>Your foundation is built.</LessonHeading>
              <p>
                You can understand more of what is happening, make an informed next choice, notice
                when something needs attention, and ask for useful help. That is a real beginning.
              </p>
            </div>

            <div className={styles.milestoneSpread}>
              <section>
                <span>What can stay behind</span>
                <p>
                  The idea that success means perfect numbers, perfect meals, perfect routines, or
                  never needing support.
                </p>
              </section>
              <section>
                <span>What moves forward</span>
                <p>
                  Understanding, choosing, adjusting, asking, returning, and treating yourself like
                  someone worth caring for.
                </p>
              </section>
            </div>

            {selectedStep || draft.promise.trim() ? (
              <div className={styles.whatYouCarry}>
                <p className="editorial-eyebrow">A note for the road ahead</p>
                {selectedStep ? <p>{selectedStep[1]}</p> : null}
                {draft.promise.trim() ? <blockquote>“{draft.promise.trim()}”</blockquote> : null}
              </div>
            ) : null}

            <div className={styles.closingWords}>
              <MessageCircleHeart aria-hidden="true" />
              <p>
                You do not need to know everything today. You do not need to be perfect tomorrow.
                The foundation has done its job when it helps you recognize the next useful step,
                and trust yourself enough to take it.
              </p>
              <span>Day 15 begins with understanding behind you and practice in front of you.</span>
            </div>

            <div className={styles.completionActions}>
              <Button disabled={isPending} fullWidth={false} onClick={finishExperience}>
                {isPending
                  ? "Saving your progress…"
                  : experience.accessMode === "review"
                    ? "Return to learning record"
                    : "Complete the Foundation Phase"}
              </Button>
              <button className={styles.clearDraft} onClick={clearPrivateDraft} type="button">
                Clear my private Day 14 note from this browser
              </button>
            </div>
          </div>
        );
    }
  }

  return (
    <section className="mx-auto flex min-h-[calc(100dvh-10rem)] max-w-[980px] flex-col py-1 sm:py-4">
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
            <p className="text-sm font-semibold text-accent-warm">Day 14</p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Your Foundation Is Built
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              aria-label="Open lesson map"
              fullWidth={false}
              onClick={() => setMapOpen(true)}
              variant="text"
            >
              <BookOpen className="size-4" />
              <span className="hidden sm:inline">Map</span>
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
            label={`Day 14 chapter ${stage + 1} of ${stageCount}`}
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
          <p className="mb-4 text-sm text-muted-foreground">
            Reflections on this lesson are optional.
          </p>
          {stageLocked && stageGateMessage ? (
            <p className="mb-4 rounded-[8px] border border-[#d9a88f] bg-[#f6e9e1] px-3 py-2 text-sm font-medium text-[#a2593f]">
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
        description="Your chapter is saved to your learning record. Optional choices and writing stay privately in this browser."
        onOpenChange={setExitOpen}
        open={exitOpen}
        title="Leave Day 14 for now?"
      >
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button fullWidth={false} onClick={() => setExitOpen(false)} variant="secondary">
            Keep reading
          </Button>
          <Link className={buttonVariants({ fullWidth: false })} href="/journey">
            Save and exit
          </Link>
        </div>
      </Modal>

      <Modal
        description="Eleven short chapters through recognition, practical knowledge, confidence, and the next phase."
        onOpenChange={setMapOpen}
        open={mapOpen}
        title="Day 14 lesson map"
      >
        <ol className={styles.lessonMap}>
          {[
            "Quiet recognition",
            "Where you began",
            "Knowledge that travels",
            "Your body makes more sense",
            "Numbers without judgment",
            "Tools working together",
            "Protection without fear",
            "Problem solving and returning",
            "Care can be shared",
            "The next 76 days",
            "Foundation milestone",
          ].map((item, index) => (
            <li key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{item}</p>
            </li>
          ))}
        </ol>
      </Modal>
    </section>
  );
}
