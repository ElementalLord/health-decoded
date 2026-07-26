"use client";

import {
  ArrowLeft,
  BookOpen,
  Footprints,
  HeartHandshake,
  MessageCircleHeart,
  NotebookPen,
  Sparkles,
  Stethoscope,
  Sun,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { completeLessonAction } from "@/features/lessons/actions/lesson-completion.actions";
import { saveLessonPositionAction } from "@/features/lessons/actions/lesson-progress.actions";
import { LessonStoryImage } from "@/features/lessons/components/lesson-story-image";
import type { LessonPlayerViewModel } from "@/features/lessons/types/lesson-player";
import { cn } from "@/lib/utils";

import styles from "./day-fourteen-experience.module.css";

const stageCount = 7;

const arrivalFeelings = [
  ["quieter", "The diagnosis feels a little less loud"],
  ["steadier", "I feel steadier, even with questions"],
  ["surprised", "I know more than I realized"],
  ["tender", "I am proud I kept coming back"],
] as const;

const carryTruths = [
  [
    "information",
    "A number is information, not a verdict.",
    "I can add timing, context, and questions before deciding what it means.",
  ],
  [
    "returning",
    "Returning counts more than perfection.",
    "One disrupted meal, walk, or routine does not erase the next useful choice.",
  ],
  [
    "shared",
    "I do not have to carry care alone.",
    "My knowledge, care team, and chosen people can each hold a different part.",
  ],
] as const;

const confidenceViews = [
  ["time", "I still need time, and I know where to begin"],
  ["words", "I can find words for questions I did not know how to ask"],
  ["next_move", "I trust myself to look for the next useful move"],
] as const;

const nextSteps = [
  ["food", "Make one familiar meal feel more balanced", Utensils],
  ["movement", "Choose one movement moment that feels good", Footprints],
  ["care", "Write one question for my next care visit", Stethoscope],
  ["support", "Ask one person for one specific kind of help", HeartHandshake],
  ["return", "Practice returning after one interrupted day", Sparkles],
] as const;

type MilestoneDraft = {
  arrivalFeeling: string | null;
  carryTruth: string | null;
  confidenceView: string | null;
  nextStep: string | null;
  promise: string;
};

const initialDraft: MilestoneDraft = {
  arrivalFeeling: null,
  carryTruth: null,
  confidenceView: null,
  nextStep: null,
  promise: "",
};

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
    <div className={cn(styles.headingGroup, centered && styles.headingCentered)}>
      {label ? <p className="editorial-eyebrow">{label}</p> : null}
      <h1 className={styles.lessonTitle}>{children}</h1>
    </div>
  );
}

function JournalChoice({
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
      className={cn(styles.journalChoice, selected && styles.journalChoiceSelected)}
      onClick={onClick}
      type="button"
    >
      <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <span>{children}</span>
      <small>{selected ? "This feels closest" : "Choose only if it helps"}</small>
    </button>
  );
}

function MiniPerson({
  className,
  tone = "sage",
}: {
  className?: string | undefined;
  tone?: "blue" | "sage" | "warm";
}) {
  return (
    <span aria-hidden="true" className={cn(styles.miniPerson, styles[`person_${tone}`], className)}>
      <i className={styles.personHead} />
      <i className={styles.personBody} />
      <i className={styles.personArm} />
      <i className={styles.personLegLeft} />
      <i className={styles.personLegRight} />
    </span>
  );
}

function OrdinaryDayAnimation() {
  return (
    <figure
      aria-label="A continuously looping illustrated day showing a person using diabetes knowledge at breakfast, on a walk with a friend, and in conversation with a healthcare professional"
      className={styles.motionFigure}
      data-motion-loop="continuous"
      role="img"
    >
      <div className={styles.motionIntro}>
        <p className="editorial-eyebrow">Knowledge in ordinary life</p>
        <h2>What you learned belongs beside breakfast, friendship, and real questions.</h2>
        <p>The foundation moves with you. It does not need a perfect setting to be useful.</p>
      </div>

      <div className={styles.ordinaryDayScene}>
        <section className={cn(styles.dayMoment, styles.kitchenMoment)}>
          <div className={styles.momentLabel}>
            <span>Morning</span>
            <strong>Make one choice</strong>
          </div>
          <span aria-hidden="true" className={styles.kitchenWindow}>
            <Sun />
          </span>
          <MiniPerson className={styles.kitchenPerson} tone="warm" />
          <span aria-hidden="true" className={styles.kitchenTable}>
            <i className={styles.plate} />
            <i className={styles.cup} />
            <i className={styles.steamOne} />
            <i className={styles.steamTwo} />
          </span>
        </section>

        <section className={cn(styles.dayMoment, styles.walkMoment)}>
          <div className={styles.momentLabel}>
            <span>Afternoon</span>
            <strong>Let support join you</strong>
          </div>
          <span aria-hidden="true" className={styles.walkTree}>
            <i />
            <i />
            <i />
          </span>
          <span aria-hidden="true" className={styles.walkPair}>
            <MiniPerson tone="sage" />
            <MiniPerson tone="blue" />
          </span>
          <span aria-hidden="true" className={styles.walkGround} />
        </section>

        <section className={cn(styles.dayMoment, styles.careMoment)}>
          <div className={styles.momentLabel}>
            <span>When care is needed</span>
            <strong>Bring a useful question</strong>
          </div>
          <MiniPerson className={styles.careLearner} tone="sage" />
          <MiniPerson className={styles.careProfessional} tone="blue" />
          <span aria-hidden="true" className={styles.careDesk}>
            <NotebookPen />
          </span>
          <span aria-hidden="true" className={styles.careWords}>
            <i />
            <i />
            <i />
          </span>
        </section>
      </div>

      <figcaption>
        <strong>What to notice:</strong> no scene asks for every skill at once. One useful tool
        enters when the moment calls for it.
      </figcaption>
    </figure>
  );
}

function ReturnAfterRainAnimation() {
  return (
    <figure
      aria-label="A continuously looping park scene where two friends pause together during a brief rain shower and continue their walk when it passes"
      className={styles.motionFigure}
      data-motion-loop="continuous"
      role="img"
    >
      <div className={styles.motionIntro}>
        <p className="editorial-eyebrow">Confidence in real life</p>
        <h2>A pause can belong inside the plan.</h2>
        <p>The weather changes. The friends wait together. The walk can continue afterward.</p>
      </div>

      <div className={styles.rainScene}>
        <span aria-hidden="true" className={styles.rainSun}>
          <Sun />
        </span>
        <span aria-hidden="true" className={styles.rainCloud}>
          <i />
          <i />
          <i />
          <b />
          <b />
          <b />
        </span>
        <span aria-hidden="true" className={styles.parkTree}>
          <i />
          <i />
          <i />
          <i />
        </span>
        <span aria-hidden="true" className={styles.parkBench}>
          <i />
          <i />
          <i />
        </span>
        <span aria-hidden="true" className={styles.returningPair}>
          <MiniPerson tone="warm" />
          <MiniPerson tone="sage" />
        </span>
        <span aria-hidden="true" className={styles.parkPath} />
        <p className={styles.rainMessage}>Pause · stay kind · return when it fits</p>
      </div>

      <figcaption>
        <strong>What to notice:</strong> confidence is not controlling the weather. It is knowing
        that a changed moment does not have to become an abandoned plan.
      </figcaption>
    </figure>
  );
}

function FullLifePicnicAnimation() {
  return (
    <figure
      aria-label="A continuously looping park picnic where family and friends share food, talk, and gently toss a ball while the day continues around them"
      className={styles.motionFigure}
      data-motion-loop="continuous"
      role="img"
    >
      <div className={styles.motionIntro}>
        <p className="editorial-eyebrow">What the foundation is for</p>
        <h2>Care should make more room for life.</h2>
        <p>
          Health knowledge can sit quietly in the background while people eat, play, and belong.
        </p>
      </div>

      <div className={styles.picnicScene}>
        <span aria-hidden="true" className={styles.picnicSun}>
          <Sun />
        </span>
        <span aria-hidden="true" className={styles.picnicTree}>
          <i />
          <i />
          <i />
          <i />
        </span>
        <span aria-hidden="true" className={styles.picnicBlanket}>
          <i />
          <i />
          <i />
        </span>
        <MiniPerson className={styles.picnicPersonOne} tone="warm" />
        <MiniPerson className={styles.picnicPersonTwo} tone="sage" />
        <MiniPerson className={styles.picnicPersonThree} tone="blue" />
        <span aria-hidden="true" className={styles.picnicBasket}>
          <i />
        </span>
        <span aria-hidden="true" className={styles.picnicBall} />
        <span aria-hidden="true" className={styles.picnicGrass}>
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>
      </div>

      <figcaption>
        <strong>What to notice:</strong> diabetes is present, but it is not the center of the
        afternoon. The purpose of the plan is a fuller ordinary life.
      </figcaption>
    </figure>
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
  const positionKey = "health-decoded:day-fourteen-position:" + experience.lessonProgressId;
  const draftKey = "health-decoded:day-fourteen-foundation:" + experience.lessonProgressId;

  useEffect(() => {
    try {
      const savedDraft = window.localStorage.getItem(draftKey);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft) as Partial<MilestoneDraft>;
        setDraft({
          arrivalFeeling: typeof parsed.arrivalFeeling === "string" ? parsed.arrivalFeeling : null,
          carryTruth: typeof parsed.carryTruth === "string" ? parsed.carryTruth : null,
          confidenceView: typeof parsed.confidenceView === "string" ? parsed.confidenceView : null,
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
        "See what the lessons built",
        "Name the foundation",
        "Notice confidence differently",
        "Look toward the next phase",
        "Choose one gentle next step",
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

  const selectedTruth = carryTruths.find(([id]) => id === draft.carryTruth);
  const selectedStep = nextSteps.find(([id]) => id === draft.nextStep);

  function renderStage() {
    switch (stage) {
      case 0:
        return (
          <div className={styles.chapter}>
            <div className={styles.openingGrid}>
              <LessonHeading label="Day 14 · Your foundation is built">
                You know more than you did fourteen days ago.
              </LessonHeading>
              <div className={styles.dayNote}>
                <p className="editorial-number">14</p>
                <p>
                  Nothing new needs to be mastered today. This is a quiet look at what you can
                  already carry.
                </p>
              </div>
            </div>

            <LessonStoryImage
              alt="Two sisters sit at a warm dining table, quietly looking back through a learning notebook and weekly calendar"
              caption="Recognition does not have to look dramatic. It may be a question that now has words, a number that feels less frightening, or one decision that no longer feels impossible."
              emphasis="Some kinds of confidence arrive quietly."
              height={941}
              priority
              src="/lessons/day-14/quiet-recognition.jpg"
              width={1672}
            />

            <blockquote className={styles.openingQuote}>
              “A foundation is not proof that you will never feel uncertain. It is something steady
              to stand on when uncertainty returns.”
            </blockquote>

            <section className={styles.optionalReflection}>
              <div>
                <p className="editorial-eyebrow">Optional reflection</p>
                <h2>What feels closest as you arrive?</h2>
                <p>You can choose one, or simply keep reading.</p>
              </div>
              <div className={styles.journalChoices}>
                {arrivalFeelings.map(([id, label], index) => (
                  <JournalChoice
                    index={index}
                    key={id}
                    onClick={() => updateDraft({ arrivalFeeling: id })}
                    selected={draft.arrivalFeeling === id}
                  >
                    {label}
                  </JournalChoice>
                ))}
              </div>
            </section>
          </div>
        );

      case 1:
        return (
          <div className={styles.chapter}>
            <LessonHeading label="Fourteen days, one life">
              The lessons were never meant to stay in separate boxes.
            </LessonHeading>

            <OrdinaryDayAnimation />

            <div className={styles.editorialColumns}>
              <p>
                <span>Y</span>ou learned what insulin resistance means so the diagnosis could become
                understandable instead of mysterious. You learned to read food, movement,
                medication, and monitoring as tools—not tests of character.
              </p>
              <p>
                Then the circle widened: safety, prevention, problem solving, support, and the
                people around you. The point was never to memorize fourteen lessons. It was to make
                the next real moment easier to meet.
              </p>
            </div>

            <p className={styles.handwrittenLine}>
              The knowledge is doing its job when it helps inside an ordinary Tuesday.
            </p>
          </div>
        );

      case 2:
        return (
          <div className={styles.chapter}>
            <LessonHeading label="Three steady parts">
              Your foundation is not a checklist. It is a way of meeting what comes next.
            </LessonHeading>

            <div className={styles.foundationPages}>
              <article>
                <span>01</span>
                <div>
                  <p className="editorial-eyebrow">Understand your body</p>
                  <h2>Replace blame with an explanation.</h2>
                  <p>
                    Read A1C and glucose as different views. Add context. Let the body be something
                    you can learn about rather than something you have to fight.
                  </p>
                </div>
              </article>
              <article>
                <span>02</span>
                <div>
                  <p className="editorial-eyebrow">Make everyday decisions</p>
                  <h2>Use the tool that fits this moment.</h2>
                  <p>
                    Food, movement, medication, monitoring, and routines can work together without
                    every one of them being perfect on the same day.
                  </p>
                </div>
              </article>
              <article>
                <span>03</span>
                <div>
                  <p className="editorial-eyebrow">Protect your future</p>
                  <h2>Notice early, ask clearly, and share the load.</h2>
                  <p>
                    Prevention, a safety plan, healthcare partnership, and chosen support can make
                    care feel calmer and more possible.
                  </p>
                </div>
              </article>
            </div>

            <section className={styles.carrySection}>
              <div>
                <p className="editorial-eyebrow">If one truth came with you</p>
                <h2>Which sentence would you want nearby on a difficult day?</h2>
                <p>This is optional. One sentence is enough.</p>
              </div>
              <div className={styles.carryTruths}>
                {carryTruths.map(([id, title, note], index) => (
                  <button
                    aria-pressed={draft.carryTruth === id}
                    className={cn(
                      styles.carryTruth,
                      draft.carryTruth === id && styles.carryTruthSelected,
                    )}
                    key={id}
                    onClick={() => updateDraft({ carryTruth: id })}
                    type="button"
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{title}</strong>
                    <p>{note}</p>
                  </button>
                ))}
              </div>
            </section>
          </div>
        );

      case 3:
        return (
          <div className={styles.chapter}>
            <LessonHeading label="A kinder definition of confidence">
              Confidence is not knowing every answer. It is knowing how to find a next move.
            </LessonHeading>

            <ReturnAfterRainAnimation />

            <div className={styles.confidenceStories}>
              <article>
                <span>At a restaurant</span>
                <p>
                  You may not know every ingredient. You can still use what you recognize, choose
                  what fits, and let one meal remain one meal.
                </p>
              </article>
              <article>
                <span>After a surprising reading</span>
                <p>
                  You may not know why immediately. You can add timing and context, look for a
                  pattern, and bring a useful question to your care team.
                </p>
              </article>
              <article>
                <span>When a plan falls apart</span>
                <p>
                  You do not have to repair the whole day. The next meal, movement moment, medicine
                  instruction, or conversation can still be approached with care.
                </p>
              </article>
            </div>

            <section className={styles.confidenceReflection}>
              <div>
                <p className="editorial-eyebrow">Optional check-in</p>
                <h2>Which kind of confidence feels honest today?</h2>
              </div>
              <div className={styles.journalChoices}>
                {confidenceViews.map(([id, label], index) => (
                  <JournalChoice
                    index={index}
                    key={id}
                    onClick={() => updateDraft({ confidenceView: id })}
                    selected={draft.confidenceView === id}
                  >
                    {label}
                  </JournalChoice>
                ))}
              </div>
            </section>
          </div>
        );

      case 4:
        return (
          <div className={styles.chapter}>
            <LessonHeading label="The next 76 days">
              The next phase is where knowledge becomes familiar.
            </LessonHeading>

            <LessonStoryImage
              alt="A grandfather and his teenage granddaughter laugh together while planting herbs in a neighborhood garden"
              caption="Health knowledge matters because it supports a life with people, plans, ordinary pleasures, and new seasons—not because health must become the center of every day."
              emphasis="The goal is more life, not more diabetes."
              height={941}
              src="/lessons/day-14/life-keeps-growing.jpg"
              width={1672}
            />

            <FullLifePicnicAnimation />

            <div className={styles.nextPhaseWriting}>
              <p className="editorial-eyebrow">What changes now</p>
              <p>
                The first fourteen days built language and structure. The next seventy-six are for
                trying, noticing, repeating, asking, and adjusting. Some weeks will feel smooth.
                Others will be crowded or uncertain. Both belong in the learning.
              </p>
              <blockquote>
                Practice is not the part after learning. Practice is how learning becomes yours.
              </blockquote>
            </div>
          </div>
        );

      case 5:
        return (
          <div className={styles.chapter}>
            <LessonHeading label="One thing is enough">
              Choose one small thing to carry into the next month.
            </LessonHeading>

            <div className={styles.oneStepStudio}>
              <div className={styles.stepIntroduction}>
                <p>
                  This is not a five-part plan and it is not a promise to be perfect. Choose one
                  place where making life slightly easier would matter.
                </p>
                <span>Choosing is optional. You can leave this page with the idea still open.</span>
              </div>

              <div className={styles.nextStepList}>
                {nextSteps.map(([id, label, Icon], index) => (
                  <button
                    aria-pressed={draft.nextStep === id}
                    className={cn(
                      styles.nextStep,
                      draft.nextStep === id && styles.nextStepSelected,
                    )}
                    key={id}
                    onClick={() => updateDraft({ nextStep: id })}
                    type="button"
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <Icon aria-hidden="true" />
                    <strong>{label}</strong>
                    <small>
                      {draft.nextStep === id ? "I’ll carry this one" : "A possible next step"}
                    </small>
                  </button>
                ))}
              </div>
            </div>

            <label className={styles.promiseField}>
              <span>A few words to your future self, if you want to leave them</span>
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

            {selectedStep || draft.promise.trim() ? (
              <div className={styles.futureNote}>
                <p className="editorial-eyebrow">A note for next month</p>
                {selectedStep ? <h2>{selectedStep[1]}</h2> : null}
                {draft.promise.trim() ? <blockquote>“{draft.promise.trim()}”</blockquote> : null}
              </div>
            ) : null}
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
              <LessonHeading centered>Your foundation is built.</LessonHeading>
              <p>
                You can understand more of what is happening, make an informed next choice, notice
                when something needs attention, and ask for useful help. That is a real beginning.
              </p>
            </div>

            <div className={styles.milestoneSpread}>
              <section>
                <span>What stays behind</span>
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

            {selectedTruth || selectedStep || draft.promise.trim() ? (
              <div className={styles.whatYouCarry}>
                <p className="editorial-eyebrow">What you chose to carry</p>
                {selectedTruth ? <p>{selectedTruth[1]}</p> : null}
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

  const progressValue = ((stage + 1) / stageCount) * 100;

  return (
    <section
      className={cn(
        styles.experience,
        "mx-auto flex min-h-[calc(100dvh-10rem)] max-w-[1020px] flex-col py-1 sm:py-4",
      )}
    >
      <header className={styles.lessonHeader}>
        <div className={styles.headerRow}>
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
          <div className={styles.headerTitle}>
            <p className={styles.dayLabel}>Day 14 · Foundation milestone</p>
            <p>Your Foundation Is Built</p>
          </div>
          <div className={styles.headerActions}>
            <Button
              aria-label="Open lesson map"
              fullWidth={false}
              onClick={() => setMapOpen(true)}
              variant="text"
            >
              <BookOpen className="size-4" />
              <span>Map</span>
            </Button>
            <Button fullWidth={false} onClick={() => setExitOpen(true)} variant="text">
              Save &amp; exit
            </Button>
          </div>
        </div>
        <div className={styles.chapterProgress}>
          <div>
            <span>Chapter {stage + 1}</span>
            <span>{stageCount} chapters</span>
          </div>
          <div
            aria-label={"Day 14 chapter " + String(stage + 1) + " of " + String(stageCount)}
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={progressValue}
            className={styles.progressTrack}
            role="progressbar"
          >
            <span className={styles.progressFill} style={{ width: String(progressValue) + "%" }} />
          </div>
        </div>
      </header>

      <div className={styles.chapterFrame} ref={stageRef} tabIndex={-1}>
        <div className="animate-fade-in" key={stage}>
          {renderStage()}
        </div>
      </div>

      {stage < stageCount - 1 ? (
        <footer className={styles.lessonFooter}>
          <p>Reflections on this lesson are optional.</p>
          <div>
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
        className={cn(styles.statusMessage, !message && styles.statusMessageHidden)}
        role={message ? "alert" : undefined}
      >
        {message ?? ""}
      </p>

      <Modal
        description="Your chapter is saved to your learning record. Any optional choices or writing stay privately in this browser."
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
        description="A short emotional path through recognition, confidence, and the next phase."
        onOpenChange={setMapOpen}
        open={mapOpen}
        title="Day 14 lesson map"
      >
        <ol className={styles.lessonMap}>
          {[
            "Quiet recognition",
            "Knowledge in ordinary life",
            "Three steady foundations",
            "A kinder confidence",
            "The next 76 days",
            "One gentle next step",
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
