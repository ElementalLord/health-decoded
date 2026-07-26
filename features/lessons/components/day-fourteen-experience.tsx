"use client";

import { ArrowLeft, BookOpen, MessageCircleHeart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ProgressBar } from "@/components/ui/progress-bar";
import { completeLessonAction } from "@/features/lessons/actions/lesson-completion.actions";
import { saveLessonPositionAction } from "@/features/lessons/actions/lesson-progress.actions";
import { LessonStoryImage } from "@/features/lessons/components/lesson-story-image";
import type { LessonPlayerViewModel } from "@/features/lessons/types/lesson-player";
import { cn } from "@/lib/utils";

import styles from "./day-fourteen-experience.module.css";

const stageCount = 11;

const arrivalFeelings = [
  ["quieter", "The diagnosis feels a little less loud"],
  ["steadier", "I feel steadier, even with questions"],
  ["surprised", "I know more than I realized"],
  ["tender", "I am proud I kept coming back"],
] as const;

const nextSteps = [
  ["food", "Make one familiar meal feel more balanced"],
  ["movement", "Choose one movement moment that feels good"],
  ["care", "Write one question for my next care visit"],
  ["support", "Ask one person for one specific kind of help"],
  ["return", "Practice returning after one interrupted day"],
] as const;

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

function OrdinaryLifeMotion() {
  return (
    <MotionFigure
      cue="Knowledge in ordinary life"
      description="no moment asks for every skill at once. Breakfast, friendship, and a care conversation each call for one useful part of what you know."
      label="A continuously moving illustrated day: breakfast steams, two friends walk together, and a patient and clinician exchange a question"
      title="What you learned can travel through an ordinary day."
    >
      <rect className={styles.skyWash} height="320" width="720" />
      <path className={styles.groundLine} d="M28 260H692" />

      <g className={styles.morningScene}>
        <circle className={styles.sunShape} cx="78" cy="62" r="24">
          <animate attributeName="r" dur="4s" repeatCount="indefinite" values="22;27;22" />
          <animate attributeName="opacity" dur="4s" repeatCount="indefinite" values="0.62;1;0.62" />
        </circle>
        <path className={styles.tableShape} d="M44 210H215M62 210V263M196 210V263" />
        <ellipse className={styles.plateShape} cx="130" cy="204" rx="31" ry="8" />
        <path className={styles.cupShape} d="M162 174h24v27h-24zM186 180c16 0 16 17 0 17" />
        <path className={styles.steamShape} d="M170 166c-8-10 9-15 0-27">
          <animateTransform
            attributeName="transform"
            dur="3.2s"
            repeatCount="indefinite"
            type="translate"
            values="0 8;0 -8;0 8"
          />
          <animate attributeName="opacity" dur="3.2s" repeatCount="indefinite" values="0;0.9;0" />
        </path>
        <g className={styles.personWarm}>
          <circle cx="102" cy="122" r="20" />
          <path d="M75 198v-43c0-22 11-34 27-34s27 12 27 34v43z" />
          <path className={styles.personLine} d="M122 153c18 6 29 17 40 30" />
          <animateTransform
            attributeName="transform"
            dur="4.8s"
            repeatCount="indefinite"
            type="rotate"
            values="0 102 198;-2 102 198;0 102 198"
          />
        </g>
      </g>

      <g className={styles.walkingScene}>
        <path className={styles.treeTrunk} d="M350 110v150" />
        <circle className={styles.treeLeaf} cx="350" cy="91" r="49">
          <animateTransform
            attributeName="transform"
            dur="5s"
            repeatCount="indefinite"
            type="rotate"
            values="-2 350 140;2 350 140;-2 350 140"
          />
        </circle>
        <g className={styles.walkingPair}>
          <g className={styles.personSage}>
            <circle cx="270" cy="169" r="17" />
            <path d="M247 238v-39c0-20 10-31 23-31s23 11 23 31v39z" />
            <path className={styles.personLine} d="M255 235l-13 28M282 235l17 28" />
          </g>
          <g className={styles.personBlue}>
            <circle cx="315" cy="164" r="18" />
            <path d="M291 238v-42c0-21 10-33 24-33s24 12 24 33v42z" />
            <path className={styles.personLine} d="M300 235l-10 28M327 235l16 28" />
          </g>
          <path className={styles.friendLine} d="M287 201c9-8 16-8 25 0" />
          <animateTransform
            attributeName="transform"
            dur="7s"
            keyTimes="0;0.42;0.65;1"
            repeatCount="indefinite"
            type="translate"
            values="-42 0;28 0;28 0;-42 0"
          />
        </g>
      </g>

      <g className={styles.careScene}>
        <path className={styles.deskShape} d="M495 215H680M520 215v48M657 215v48" />
        <g className={styles.personSage}>
          <circle cx="536" cy="140" r="20" />
          <path d="M509 211v-42c0-22 11-33 27-33s27 11 27 33v42z" />
        </g>
        <g className={styles.personBlue}>
          <circle cx="636" cy="139" r="20" />
          <path d="M609 211v-43c0-22 11-33 27-33s27 11 27 33v43z" />
        </g>
        <g className={styles.questionLines}>
          <path d="M556 102h66" />
          <path d="M566 86h46" />
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
            values="-8 0;6 0;-8 0"
          />
        </g>
      </g>
    </MotionFigure>
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

      <g className={styles.rainCloud}>
        <ellipse cx="250" cy="75" rx="65" ry="27" />
        <circle cx="219" cy="65" r="28" />
        <circle cx="266" cy="55" r="36" />
        <circle cx="301" cy="70" r="24" />
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
      <g className={styles.rainDrops}>
        {[0, 1, 2, 3, 4].map((drop) => (
          <path d={`M${172 + drop * 31} 108l-8 25`} key={drop}>
            <animateTransform
              attributeName="transform"
              begin={`${drop * -0.28}s`}
              dur="1.4s"
              repeatCount="indefinite"
              type="translate"
              values="0 -10;70 86"
            />
            <animate
              attributeName="opacity"
              begin={`${drop * -0.28}s`}
              dur="1.4s"
              repeatCount="indefinite"
              values="0;0.85;0"
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

export function DayFourteenExperience({ lesson: experience }: { lesson: LessonPlayerViewModel }) {
  const router = useRouter();
  const [stage, setStage] = useState(0);
  const [draft, setDraft] = useState<MilestoneDraft>(initialDraft);
  const [hydrated, setHydrated] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const stageRef = useRef<HTMLDivElement>(null);
  const positionKey = `health-decoded:day-fourteen-position:${experience.lessonProgressId}`;
  const draftKey = `health-decoded:day-fourteen-foundation:${experience.lessonProgressId}`;

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
        const storedStage = Number(window.localStorage.getItem(positionKey));
        if (Number.isInteger(storedStage) && storedStage >= 0 && storedStage < stageCount) {
          setStage(storedStage);
        }
      }
    } catch {
      setMessage("Your private milestone note could not be restored in this browser.");
    } finally {
      setHydrated(true);
    }
  }, [draftKey, experience.accessMode, positionKey]);

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
              become clearer—and what you can now carry into real life.
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
            <div className={styles.beforeAfter}>
              <section>
                <p className="editorial-eyebrow">Then</p>
                <h2>The diagnosis may have sounded larger than your life.</h2>
                <p>
                  New words, new numbers, and new decisions can arrive all at once. It can be hard
                  to know which question belongs first or whether a single meal, reading, or missed
                  routine has already decided the future.
                </p>
              </section>
              <section>
                <p className="editorial-eyebrow">Now</p>
                <h2>You have a way to make the moment smaller.</h2>
                <p>
                  Name what is happening. Add timing and context. Choose one useful tool. Ask for
                  help when the question belongs with someone else. That sequence is knowledge you
                  can use.
                </p>
              </section>
            </div>
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
            <OrdinaryLifeMotion />
            <div className={styles.editorialColumns}>
              <p>
                <span>Y</span>ou learned what insulin resistance means so the diagnosis could become
                understandable instead of mysterious. You learned to see food, movement, medication,
                and monitoring as tools—not tests of character.
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
            <div className={styles.numberedEssay}>
              <section>
                <span>01</span>
                <div>
                  <h2>Insulin is a signal.</h2>
                  <p>
                    It helps glucose move from the bloodstream into cells that can use it for
                    energy. In insulin resistance, cells do not respond to that signal as
                    effectively, so the body may need to send more.
                  </p>
                </div>
              </section>
              <section>
                <span>02</span>
                <div>
                  <h2>Type 2 diabetes develops over time.</h2>
                  <p>
                    It is shaped by biology, genetics, environment, age, stress, sleep, access to
                    care, and many other influences. It is not a moral verdict and it is not proof
                    that you failed.
                  </p>
                </div>
              </section>
              <section>
                <span>03</span>
                <div>
                  <h2>Understanding creates choices.</h2>
                  <p>
                    Food, movement, medicines, sleep, monitoring, and support can influence
                    different parts of the system. No single tool has to carry the whole plan.
                  </p>
                </div>
              </section>
            </div>
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
            <div className={styles.contextSequence}>
              <section>
                <span>First</span>
                <h2>Name the measure.</h2>
                <p>
                  Is it a glucose reading from one moment, or an A1C view across several months?
                </p>
              </section>
              <section>
                <span>Then</span>
                <h2>Add the conditions.</h2>
                <p>
                  Timing, food, movement, medicines, stress, sleep, and illness can help explain
                  what the number can—and cannot—say.
                </p>
              </section>
              <section>
                <span>Next</span>
                <h2>Look for a pattern.</h2>
                <p>
                  One unexpected result can be worth noticing without becoming a verdict. Repeated
                  patterns and symptoms give the care team more useful information.
                </p>
              </section>
              <section>
                <span>When needed</span>
                <h2>Bring the question to care.</h2>
                <p>
                  Ask what range applies to you, what might be influencing a pattern, and what next
                  step is safe. Personal targets belong in a personal care plan.
                </p>
              </section>
            </div>
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
            <div className={styles.toolLines}>
              <section>
                <h2>Food can be balanced, familiar, and meaningful.</h2>
                <p>
                  Carbohydrate is not forbidden. Fiber, protein, fat, portions, preferences,
                  culture, access, and the rest of the meal all add context. One plate does not
                  define your health.
                </p>
              </section>
              <section>
                <h2>Movement can be ordinary and adapted.</h2>
                <p>
                  Working muscles can use glucose. Walking, chores, dancing, gardening, water
                  movement, strength work, and seated options can all count when they fit your body
                  and safety needs.
                </p>
              </section>
              <section>
                <h2>Medicine is a tool, not a failure.</h2>
                <p>
                  A medication can support what the body needs. Knowing its name, purpose, timing,
                  possible side effects, and what to do when a dose is missed makes the tool safer
                  and easier to use.
                </p>
              </section>
              <section>
                <h2>Monitoring can answer a question.</h2>
                <p>
                  A reading is most useful when you know why you are checking and what you plan to
                  do with the result. More checking is not automatically better checking.
                </p>
              </section>
            </div>
          </div>
        );

      case 6:
        return (
          <div className={styles.chapter}>
            <LessonHeading label="Protection without fear">
              Prevention is care showing up before a problem becomes loud.
            </LessonHeading>
            <div className={styles.protectionSpread}>
              <div>
                <p>
                  Eyes, kidneys, nerves, feet, heart, and blood vessels deserve attention without
                  becoming a catalogue of things to fear. Screening and regular care are ways to
                  notice change early, when there may be more options.
                </p>
                <p>
                  Bring your questions. Know which checks are due. Share new symptoms, wounds,
                  vision changes, chest symptoms, or unusual lows and highs with the right member of
                  your care team.
                </p>
              </div>
              <blockquote>
                Risk is not destiny. Early attention is not pessimism; it is protection.
              </blockquote>
            </div>
            <div className={styles.safetyNotes}>
              <section>
                <span>For an urgent moment</span>
                <p>
                  Follow the safety plan you made with your clinician. Know who to call, when to
                  seek urgent help, and where fast-acting glucose or other supplies belong if they
                  are part of your plan.
                </p>
              </section>
              <section>
                <span>For a routine visit</span>
                <p>
                  A short note with the pattern, timing, symptoms, medicines, and your question can
                  make a conversation more useful than trying to remember everything in the room.
                </p>
              </section>
            </div>
          </div>
        );

      case 7:
        return (
          <div className={styles.chapter}>
            <LessonHeading label="Problem solving for real life">
              Confidence is knowing how to return, not knowing every answer.
            </LessonHeading>
            <ReturnAfterRainMotion />
            <div className={styles.returnStories}>
              <section>
                <span>At a restaurant</span>
                <p>
                  Use what you recognize, choose what fits, and let one uncertain meal remain one
                  meal. You do not need perfect information to make a reasonable choice.
                </p>
              </section>
              <section>
                <span>After a surprising reading</span>
                <p>
                  Add timing and context, look for a pattern, and bring a useful question to your
                  care team. Curiosity gives the number a smaller job.
                </p>
              </section>
              <section>
                <span>When the plan changes</span>
                <p>
                  Repair the next available moment instead of the whole day. A smaller Plan B can
                  protect continuity without pretending life went as expected.
                </p>
              </section>
            </div>
          </div>
        );

      case 8:
        return (
          <div className={styles.chapter}>
            <LessonHeading label="Care can be shared">
              Support works best when people know what helpful means.
            </LessonHeading>
            <div className={styles.conversationEssay}>
              <p>
                Support is not supervision. A useful person may listen without fixing, join a walk,
                learn what a low blood glucose plan looks like, help make an appointment, or simply
                keep diabetes from becoming the only subject in the room.
              </p>
              <div className={styles.conversationLines}>
                <p>
                  <span>Ask</span> “What would help today?”
                </p>
                <p>
                  <span>Listen</span> “I can stay with this before offering ideas.”
                </p>
                <p>
                  <span>Offer</span> “I can do that. Would company or practical help fit better?”
                </p>
                <p>
                  <span>Check</span> “Does this still feel helpful?”
                </p>
              </div>
              <p>
                You can also set a calm boundary: “I am following my care plan. Please do not
                comment on my plate.” Clear limits protect dignity and make room for the kinds of
                support you actually choose.
              </p>
            </div>
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
              caption="Health knowledge matters because it supports a life with people, plans, ordinary pleasures, and new seasons—not because health must become the center of every day."
              emphasis="The goal is more life, not more diabetes."
              height={941}
              src="/lessons/day-14/life-keeps-growing.jpg"
              width={1672}
            />
            <FullLifePicnicMotion />
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
                The foundation has done its job when it helps you recognize the next useful step—and
                trust yourself enough to take it.
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
