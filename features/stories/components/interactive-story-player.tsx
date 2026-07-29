"use client";

import { ArrowLeft, ArrowRight, BookOpenText, Check, ChevronLeft, RotateCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { StoryInteraction } from "@/features/stories/components/story-interactions";
import {
  createInitialStoryProgress,
  getStoryPreviewStatus,
  getStoryStorageKey,
  parseStoryProgress,
} from "@/features/stories/lib/story-progress";
import type {
  InteractiveStory,
  StoryProgress,
  StoryScene,
} from "@/features/stories/types/interactive-story";

import styles from "./story-player.module.css";

const predictionChoices = [
  { id: "learn-everything", label: "Learning everything about diabetes immediately" },
  { id: "nothing-mattered", label: "Receiving reassurance that nothing mattered" },
  { id: "manageable-step", label: "Identifying one manageable next step" },
  { id: "avoid-conversation", label: "Avoiding every conversation about the diagnosis" },
] as const;

type Direction = "forward" | "backward";
type InteractionValue = string | number | string[];

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function statusActionLabel(progress: StoryProgress) {
  const status = getStoryPreviewStatus(progress);
  if (status === "completed") return "Read Again";
  if (status === "in-progress") return "Resume Story";
  return "Begin Story";
}

function StoryProgressRail({
  current,
  furthest,
  onSelect,
  scenes,
}: {
  current: number;
  furthest: number;
  onSelect: (sceneIndex: number) => void;
  scenes: StoryScene[];
}) {
  return (
    <div className={styles.progressBlock}>
      <div className={styles.progressText}>
        <span>
          Scene {current + 1} of {scenes.length}
        </span>
        <strong>{scenes[current]?.title}</strong>
      </div>
      <ol aria-label="Story scene progress" className={styles.progressRail}>
        {scenes.map((scene, index) => {
          const isCurrent = index === current;
          const isReached = index <= furthest;
          const isComplete = index < current || (furthest > current && index <= furthest);
          const stateText = isComplete
            ? ", completed"
            : isCurrent
              ? ", current"
              : ", not yet available";
          return (
            <li key={scene.id}>
              <button
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`Scene ${scene.number}: ${scene.title}${stateText}`}
                className={
                  isCurrent
                    ? styles.currentStep
                    : isComplete
                      ? styles.completedStep
                      : styles.futureStep
                }
                disabled={!isReached || isCurrent}
                onClick={() => onSelect(index)}
                type="button"
              >
                {isComplete ? <Check aria-hidden="true" size={15} /> : scene.number}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function StorySceneView({
  direction,
  interactionStates,
  isLeaving,
  meaningfulChoice,
  onBack,
  onContinue,
  onMeaningfulChoice,
  onStateChange,
  scene,
}: {
  direction: Direction;
  interactionStates: Record<string, InteractionValue>;
  isLeaving: boolean;
  meaningfulChoice: string | null;
  onBack: (() => void) | undefined;
  onContinue: () => void;
  onMeaningfulChoice: (choice: string) => void;
  onStateChange: (key: string, value: InteractionValue) => void;
  scene: StoryScene;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [scene.id]);

  return (
    <div
      className={`${styles.sceneSurface} ${styles[direction]} ${isLeaving ? styles.leaving : styles.entering}`}
      key={scene.id}
    >
      <section className={styles.narrative}>
        <p className={styles.sceneEyebrow}>Scene {scene.number}</p>
        <h2 ref={headingRef} tabIndex={-1}>
          {scene.title}
        </h2>
        <div className={styles.paragraphs}>
          {scene.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>
      <aside aria-label={`Interactive companion for ${scene.title}`} className={styles.interaction}>
        <StoryInteraction
          interactionStates={interactionStates}
          meaningfulChoice={meaningfulChoice}
          onMeaningfulChoice={onMeaningfulChoice}
          onStateChange={onStateChange}
          scene={scene}
        />
      </aside>
      <nav aria-label="Story scene navigation" className={styles.sceneNavigation}>
        {onBack ? (
          <button className={styles.backButton} onClick={onBack} type="button">
            <ChevronLeft aria-hidden="true" size={18} />
            Back
          </button>
        ) : (
          <span />
        )}
        <button className={styles.continueButton} onClick={onContinue} type="button">
          {scene.continueLabel}
          <ArrowRight aria-hidden="true" size={18} />
        </button>
      </nav>
    </div>
  );
}

export function InteractiveStoryPlayer({ story }: { story: InteractiveStory }) {
  const [progress, setProgress] = useState<StoryProgress>(createInitialStoryProgress);
  const [hydrated, setHydrated] = useState(false);
  const [direction, setDirection] = useState<Direction>("forward");
  const [isLeaving, setIsLeaving] = useState(false);
  const [quizSelection, setQuizSelection] = useState("");
  const [reflectionDraft, setReflectionDraft] = useState("");
  const playerRef = useRef<HTMLElement>(null);
  const stageHeadingRef = useRef<HTMLHeadingElement>(null);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const storageKey = getStoryStorageKey(story.slug);
  const storyPredictionChoices = story.predictionChoices ?? predictionChoices;
  const estimatedTimeLabel = story.estimatedTimeLabel ?? "5 to 7 minutes";
  const relatedLessonLabel = story.relatedLessonLabel ?? "Lesson 1";
  const relatedLessonTitle = story.relatedLessonTitle ?? "Lesson 1, The First Five Minutes";
  const relatedLessonHref = story.relatedLessonHref ?? "/lessons/1";
  const isFoodFamilyStory = story.id === "asha-rice-on-the-table";

  useEffect(() => {
    try {
      const saved = parseStoryProgress(window.localStorage.getItem(storageKey));
      setProgress(saved);
      setReflectionDraft(saved.privateReflection ?? "");
    } finally {
      setHydrated(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch {
      // The story remains fully usable when browser storage is unavailable.
    }
  }, [hydrated, progress, storageKey]);

  useEffect(
    () => () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    if (progress.stage === "story") return;
    stageHeadingRef.current?.focus({ preventScroll: true });
  }, [progress.stage, progress.currentQuizQuestion]);

  const updateProgress = useCallback((updater: (current: StoryProgress) => StoryProgress) => {
    setProgress((current) => updater(current));
  }, []);

  const keepPlayerInView = () => {
    playerRef.current?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  };

  const runSceneTransition = (nextScene: number, nextDirection: Direction) => {
    const reducedMotion = prefersReducedMotion();
    setDirection(nextDirection);
    setIsLeaving(true);
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = setTimeout(
      () => {
        updateProgress((current) => ({
          ...current,
          currentScene: nextScene,
          furthestSceneReached: Math.max(current.furthestSceneReached, nextScene),
          stage: "story",
        }));
        setIsLeaving(false);
        keepPlayerInView();
      },
      reducedMotion ? 0 : 150,
    );
  };

  const beginOrResume = () => {
    if (progress.storyCompleted) {
      updateProgress((current) => ({ ...current, currentScene: 0, stage: "story" }));
    } else if (progress.stage === "intro") {
      updateProgress((current) => ({ ...current, stage: "story" }));
    }
    requestAnimationFrame(keepPlayerInView);
  };

  const continueScene = () => {
    if (progress.currentScene < story.scenes.length - 1) {
      runSceneTransition(progress.currentScene + 1, "forward");
      return;
    }

    updateProgress((current) => ({
      ...current,
      completionDate: current.completionDate ?? new Date().toISOString(),
      storyCompleted: true,
      stage: "prediction",
      versionCompleted: current.versionCompleted ?? story.version,
    }));
    requestAnimationFrame(keepPlayerInView);
  };

  const interactionStates = progress.interactionStates as Record<string, InteractionValue>;
  const currentQuestion = story.quiz[progress.currentQuizQuestion];
  const selectedAnswer = currentQuestion
    ? (progress.quizAnswers[currentQuestion.id] ?? quizSelection)
    : "";
  const isQuestionSubmitted = currentQuestion
    ? progress.submittedQuizQuestions.includes(currentQuestion.id)
    : false;

  useEffect(() => {
    if (!currentQuestion) return;
    setQuizSelection(progress.quizAnswers[currentQuestion.id] ?? "");
  }, [currentQuestion, progress.quizAnswers]);

  const quizResult = useMemo(() => {
    if (!currentQuestion || !selectedAnswer) return null;
    return selectedAnswer === currentQuestion.correctChoiceId;
  }, [currentQuestion, selectedAnswer]);

  const submitQuizAnswer = () => {
    if (!currentQuestion || !quizSelection || isQuestionSubmitted) return;
    updateProgress((current) => {
      const alreadySubmitted = current.submittedQuizQuestions.includes(currentQuestion.id);
      const correct = quizSelection === currentQuestion.correctChoiceId;
      return {
        ...current,
        quizAnswers: { ...current.quizAnswers, [currentQuestion.id]: quizSelection },
        quizScore: current.quizScore + (alreadySubmitted || !correct ? 0 : 1),
        submittedQuizQuestions: alreadySubmitted
          ? current.submittedQuizQuestions
          : [...current.submittedQuizQuestions, currentQuestion.id],
      };
    });
  };

  const continueQuiz = () => {
    if (progress.currentQuizQuestion < story.quiz.length - 1) {
      updateProgress((current) => ({
        ...current,
        currentQuizQuestion: current.currentQuizQuestion + 1,
      }));
      setQuizSelection("");
      return;
    }

    updateProgress((current) => ({
      ...current,
      keyIdeaUnderstood: current.quizScore >= 2,
      stage: "results",
    }));
  };

  const reviewScene = (sceneId: string) => {
    const index = story.scenes.findIndex((scene) => scene.id === sceneId);
    if (index < 0) return;
    updateProgress((current) => ({ ...current, currentScene: index, stage: "story" }));
    requestAnimationFrame(keepPlayerInView);
  };

  const finishReflection = (save: boolean) => {
    const trimmed = reflectionDraft.trim();
    updateProgress((current) => ({
      ...current,
      privateReflection: save && trimmed ? trimmed : current.privateReflection,
      stage: "complete",
    }));
  };

  const reviewStory = () => {
    updateProgress((current) => ({ ...current, currentScene: 0, stage: "story" }));
    requestAnimationFrame(keepPlayerInView);
  };

  return (
    <main className={styles.page}>
      <Link className={styles.backToStories} href="/stories">
        <ArrowLeft aria-hidden="true" size={17} />
        Back to Stories
      </Link>

      <header className={styles.hero}>
        <div className={styles.cover}>
          <Image
            alt={story.imageAlt}
            height={900}
            priority
            sizes="(max-width: 76rem) 100vw, 1120px"
            src={story.imagePath}
            width={1600}
          />
        </div>
        <div className={styles.heroBody}>
          <div className={styles.storyLabels}>
            <span>Illustrative story</span>
            <span>{story.topic}</span>
          </div>
          <h1>{story.title}</h1>
          <div className={styles.heroMeta}>
            <span>{story.characterName}</span>
            <span>{estimatedTimeLabel}</span>
            <span>Related lesson: {relatedLessonLabel}</span>
          </div>
          <p className={styles.disclosure}>{story.disclosure}</p>
          {story.contentWarning ? (
            <p className={styles.contentWarning}>{story.contentWarning}</p>
          ) : null}
          {story.reviewStatus === "reviewed" &&
          story.reviewerName &&
          story.reviewerCredentials &&
          story.reviewedAt ? (
            <p className={styles.reviewAttribution}>
              Reviewed by {story.reviewerName}, {story.reviewerCredentials} · {story.reviewedAt}
            </p>
          ) : null}
          <button className={styles.heroAction} onClick={beginOrResume} type="button">
            {hydrated ? statusActionLabel(progress) : "Begin Story"}
            <ArrowRight aria-hidden="true" size={18} />
          </button>
        </div>
      </header>

      <section
        aria-label="Interactive story player"
        className={`${styles.player} ${isFoodFamilyStory ? styles.foodFamilyPlayer : ""}`}
        ref={playerRef}
      >
        {progress.stage === "intro" ? (
          <div className={styles.playerIntroduction}>
            <p>{story.introEyebrow ?? "First evening"}</p>
            <h2 ref={stageHeadingRef} tabIndex={-1}>
              {story.introHeading ?? "Begin where Marcus’s appointment ended."}
            </h2>
            <p>
              {story.introDescription ??
                "Six short scenes follow one evening from shock toward a manageable next step. The story moves only when you choose Continue, and the small interactions are optional."}
            </p>
            <button className={styles.continueButton} onClick={beginOrResume} type="button">
              Begin Scene 1
              <ArrowRight aria-hidden="true" size={18} />
            </button>
          </div>
        ) : null}

        {progress.stage === "story" ? (
          <>
            <StoryProgressRail
              current={progress.currentScene}
              furthest={progress.furthestSceneReached}
              onSelect={(index) =>
                runSceneTransition(index, index < progress.currentScene ? "backward" : "forward")
              }
              scenes={story.scenes}
            />
            <StorySceneView
              direction={direction}
              interactionStates={interactionStates}
              isLeaving={isLeaving}
              meaningfulChoice={progress.meaningfulChoice}
              onBack={
                progress.currentScene > 0
                  ? () => runSceneTransition(progress.currentScene - 1, "backward")
                  : undefined
              }
              onContinue={continueScene}
              onMeaningfulChoice={(choice) =>
                updateProgress((current) => ({ ...current, meaningfulChoice: choice }))
              }
              onStateChange={(key, value) =>
                updateProgress((current) => ({
                  ...current,
                  interactionStates: { ...current.interactionStates, [key]: value },
                }))
              }
              scene={story.scenes[progress.currentScene]!}
            />
          </>
        ) : null}

        {progress.stage === "prediction" ? (
          <section className={styles.retrievalStage}>
            <p className={styles.stageEyebrow}>Before you check your understanding</p>
            <h2 ref={stageHeadingRef} tabIndex={-1}>
              {story.predictionPrompt}
            </h2>
            <fieldset className={styles.answerChoices}>
              <legend className="sr-only">Choose one prediction</legend>
              {storyPredictionChoices.map((choice) => (
                <label key={choice.id}>
                  <input
                    checked={progress.prediction === choice.id}
                    name={`${story.slug}-prediction`}
                    onChange={() =>
                      updateProgress((current) => ({ ...current, prediction: choice.id }))
                    }
                    type="radio"
                  />
                  <span>{choice.label}</span>
                </label>
              ))}
            </fieldset>
            {progress.prediction ? (
              <p className={styles.holdAnswer}>
                Hold onto your answer. The next three questions will help you test the idea.
              </p>
            ) : null}
            <div className={styles.stageNavigation}>
              <button
                className={styles.backButton}
                onClick={() =>
                  updateProgress((current) => ({
                    ...current,
                    currentScene: story.scenes.length - 1,
                    stage: "story",
                  }))
                }
                type="button"
              >
                <ChevronLeft aria-hidden="true" size={18} />
                Back to Scene 6
              </button>
              <button
                className={styles.continueButton}
                disabled={!progress.prediction}
                onClick={() =>
                  updateProgress((current) => ({
                    ...current,
                    currentQuizQuestion: 0,
                    stage: "quiz",
                  }))
                }
                type="button"
              >
                Check What You Learned
                <ArrowRight aria-hidden="true" size={18} />
              </button>
            </div>
          </section>
        ) : null}

        {progress.stage === "quiz" && currentQuestion ? (
          <section className={styles.quizStage}>
            <p className={styles.stageEyebrow}>
              Knowledge check · Question {progress.currentQuizQuestion + 1} of {story.quiz.length}
            </p>
            <h2 ref={stageHeadingRef} tabIndex={-1}>
              {currentQuestion.prompt}
            </h2>
            <fieldset className={styles.answerChoices} disabled={isQuestionSubmitted}>
              <legend className="sr-only">Choose one answer</legend>
              {currentQuestion.choices.map((choice, index) => (
                <label key={choice.id}>
                  <input
                    checked={selectedAnswer === choice.id}
                    name={currentQuestion.id}
                    onChange={() => setQuizSelection(choice.id)}
                    type="radio"
                  />
                  <span>
                    <small>{String.fromCharCode(65 + index)}</small>
                    {choice.label}
                  </span>
                </label>
              ))}
            </fieldset>
            {!isQuestionSubmitted ? (
              <button
                className={styles.continueButton}
                disabled={!quizSelection}
                onClick={submitQuizAnswer}
                type="button"
              >
                Submit Answer
              </button>
            ) : (
              <div aria-live="polite" className={styles.quizFeedback}>
                <strong>
                  {quizResult ? "That’s it." : "Not quite. Here is the idea to carry forward."}
                </strong>
                <p>{currentQuestion.explanation}</p>
                <button className={styles.continueButton} onClick={continueQuiz} type="button">
                  {progress.currentQuizQuestion === story.quiz.length - 1
                    ? "See My Results"
                    : "Continue"}
                  <ArrowRight aria-hidden="true" size={18} />
                </button>
              </div>
            )}
          </section>
        ) : null}

        {progress.stage === "results" ? (
          <section className={styles.resultsStage}>
            <p className={styles.stageEyebrow}>Story completed</p>
            <h2 ref={stageHeadingRef} tabIndex={-1}>
              Knowledge check: {progress.quizScore} of 3
            </h2>
            <p>
              {progress.keyIdeaUnderstood
                ? (story.keyIdeaUnderstoodMessage ??
                  "You identified the central idea: a manageable next step can make room for action without minimizing the diagnosis.")
                : "A few ideas may be worth reviewing."}
            </p>
            {!progress.keyIdeaUnderstood ? (
              <div className={styles.reviewLinks}>
                {story.quiz
                  .filter(
                    (question) => progress.quizAnswers[question.id] !== question.correctChoiceId,
                  )
                  .map((question) => {
                    const scene = story.scenes.find(
                      (candidate) => candidate.id === question.relatedSceneId,
                    );
                    return (
                      <button
                        key={question.id}
                        onClick={() => reviewScene(question.relatedSceneId)}
                        type="button"
                      >
                        Review {scene?.title ?? "the related scene"}
                      </button>
                    );
                  })}
              </div>
            ) : null}
            <button
              className={styles.continueButton}
              onClick={() => updateProgress((current) => ({ ...current, stage: "lesson" }))}
              type="button"
            >
              Continue to the Takeaway
              <ArrowRight aria-hidden="true" size={18} />
            </button>
          </section>
        ) : null}

        {progress.stage === "lesson" ? (
          <section className={styles.lessonStage}>
            <p className={styles.stageEyebrow}>
              {story.lessonEyebrow ?? "What Marcus’s experience can teach us"}
            </p>
            <h2 ref={stageHeadingRef} tabIndex={-1}>
              {story.lessonHeading ?? "Progress can be quieter than feeling fully prepared."}
            </h2>
            <div>
              {story.interpretation.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <blockquote>
              <span>Carry this with you</span>
              {story.takeaway}
            </blockquote>
            <button
              className={styles.continueButton}
              onClick={() => updateProgress((current) => ({ ...current, stage: "reflection" }))}
              type="button"
            >
              Continue
              <ArrowRight aria-hidden="true" size={18} />
            </button>
          </section>
        ) : null}

        {progress.stage === "reflection" ? (
          <section className={styles.reflectionStage}>
            <p className={styles.stageEyebrow}>Optional private reflection</p>
            <h2 ref={stageHeadingRef} tabIndex={-1}>
              {story.privateReflectionPrompt}
            </h2>
            {story.privateReflectionSupportPrompt ? (
              <p className={styles.reflectionSupportPrompt}>
                {story.privateReflectionSupportPrompt}
              </p>
            ) : null}
            <label htmlFor="story-private-reflection">
              Your private note
              <textarea
                id="story-private-reflection"
                maxLength={500}
                onChange={(event) => setReflectionDraft(event.target.value)}
                placeholder="Write only what feels useful to remember."
                rows={6}
                value={reflectionDraft}
              />
            </label>
            <p>
              Saved only in this browser. It is not shared with caregivers, used for AI
              personalization, or treated as medical data.
            </p>
            <div className={styles.reflectionActions}>
              <button
                className={styles.continueButton}
                disabled={!reflectionDraft.trim()}
                onClick={() => finishReflection(true)}
                type="button"
              >
                Save Privately
              </button>
              <button
                className={styles.backButton}
                onClick={() => finishReflection(false)}
                type="button"
              >
                Skip for Now
              </button>
            </div>
          </section>
        ) : null}

        {progress.stage === "complete" ? (
          <section className={styles.completionStage}>
            <div className={styles.completionMark} aria-hidden="true">
              <BookOpenText size={30} strokeWidth={1.5} />
            </div>
            <p className={styles.stageEyebrow}>Story complete</p>
            <h2 ref={stageHeadingRef} tabIndex={-1}>
              {story.completionHeading ?? "One next step made room to move."}
            </h2>
            <p>
              {story.completionMessage ??
                "You followed Marcus through the first evening after his diagnosis and saw how one manageable next step made an overwhelming moment easier to face."}
            </p>
            <dl className={styles.completionFacts}>
              <div>
                <dt>Story</dt>
                <dd>Completed</dd>
              </div>
              <div>
                <dt>Knowledge check</dt>
                <dd>{progress.quizScore} of 3</dd>
              </div>
              <div>
                <dt>Related lesson</dt>
                <dd>{relatedLessonTitle}</dd>
              </div>
            </dl>
            <div className={styles.completionActions}>
              <Link className={styles.continueButton} href="/stories">
                Return to Stories
              </Link>
              <button className={styles.backButton} onClick={reviewStory} type="button">
                <RotateCcw aria-hidden="true" size={17} />
                Review This Story
              </button>
              <Link className={styles.lessonLink} href={relatedLessonHref}>
                Go to Related Lesson
                <ArrowRight aria-hidden="true" size={17} />
              </Link>
            </div>
          </section>
        ) : null}
      </section>

      <footer className={styles.governance}>
        <p>Editorial note</p>
        <span>{story.sourceThemeNote}</span>
        <dl>
          <div>
            <dt>Story version</dt>
            <dd>{story.version}</dd>
          </div>
          <div>
            <dt>Scenario type</dt>
            <dd>Original illustrative composite</dd>
          </div>
          <div>
            <dt>Medical risk level</dt>
            <dd>{story.medicalRiskLevel}</dd>
          </div>
        </dl>
      </footer>
    </main>
  );
}
