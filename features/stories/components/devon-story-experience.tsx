"use client";

import { ArrowLeft, ArrowRight, Check, ChevronLeft, Clock3, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { recognizeMilestone } from "@/features/achievements/lib/recognize-milestone.client";
import { getStoryStorageKey, parseStoryProgress } from "@/features/stories/lib/story-progress";
import type { StoryProgress } from "@/features/stories/types/interactive-story";
import { readLocalStorage, safeSetLocalStorage } from "@/lib/storage/safe-local-storage";

import styles from "./devon-story-experience.module.css";

const STORY_SLUG = "devon-number-screen";
const STORAGE_KEY = getStoryStorageKey(STORY_SLUG);
const SCENE_COUNT = 8;

function shouldReduceMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function saveProgress(progress: StoryProgress) {
  safeSetLocalStorage(STORAGE_KEY, JSON.stringify(progress));
}

function StoryProgressHeader({ current }: { current: number }) {
  return (
    <header className={styles.readerHeader}>
      <div className={styles.readerIdentity}>
        <span>Devon&apos;s story</span>
        <span aria-label={`Part ${current + 1} of ${SCENE_COUNT}`}>
          {current + 1} / {SCENE_COUNT}
        </span>
      </div>
      <div
        aria-label={`Part ${current + 1} of ${SCENE_COUNT}`}
        aria-valuemax={SCENE_COUNT}
        aria-valuemin={1}
        aria-valuenow={current + 1}
        aria-valuetext={`Part ${current + 1} of ${SCENE_COUNT}`}
        className={styles.progress}
        role="progressbar"
      >
        {Array.from({ length: SCENE_COUNT }, (_, index) => (
          <span
            aria-hidden="true"
            className={index <= current ? styles.progressActive : undefined}
            key={index}
          />
        ))}
      </div>
    </header>
  );
}

function MeterReading() {
  const [view, setView] = useState<"reading" | "judgment">("reading");

  return (
    <section className={styles.meterMoment} aria-labelledby="meter-heading">
      <div
        className={styles.meter}
        aria-label="Glucose meter showing a result above Devon's personal range"
      >
        <span>Glucose</span>
        <strong>Above my range</strong>
        <small>Reading saved · 8:42 PM</small>
      </div>
      <div className={styles.meterContext}>
        <div
          className={styles.tabs}
          role="tablist"
          aria-label="Compare the reading with Devon's judgment"
        >
          <button
            aria-selected={view === "reading"}
            onClick={() => setView("reading")}
            role="tab"
            type="button"
          >
            The reading
          </button>
          <button
            aria-selected={view === "judgment"}
            onClick={() => setView("judgment")}
            role="tab"
            type="button"
          >
            Devon&apos;s reaction
          </button>
        </div>
        <div aria-live="polite" className={styles.meterPanel} role="tabpanel">
          <h3 id="meter-heading">
            {view === "reading" ? "One result at one moment" : "I messed up."}
          </h3>
          <p>
            {view === "reading"
              ? "The meter can report a result. It can't measure effort or explain exactly why the result happened."
              : "The result mattered, but the screen had not blamed Devon or graded the rest of his day."}
          </p>
        </div>
      </div>
    </section>
  );
}

const thoughtSteps = {
  observation: {
    label: "Observation",
    text: "The result is above the personal range Devon discussed with his care team.",
  },
  guess: {
    label: "Guess",
    text: "Dinner must have caused it.",
  },
  prediction: {
    label: "Prediction",
    text: "Every future reading will look like this.",
  },
} as const;

function ThoughtPath() {
  const [step, setStep] = useState<keyof typeof thoughtSteps>("observation");
  const detail = thoughtSteps[step];

  return (
    <section className={styles.thoughtPath} aria-labelledby="thought-heading">
      <div className={styles.pathButtons} role="tablist" aria-label="Follow Devon's thought path">
        {(Object.keys(thoughtSteps) as Array<keyof typeof thoughtSteps>).map((key, index) => (
          <button
            aria-selected={step === key}
            key={key}
            onClick={() => setStep(key)}
            role="tab"
            type="button"
          >
            <span>{index + 1}</span>
            {thoughtSteps[key].label}
          </button>
        ))}
      </div>
      <div aria-live="polite" className={styles.thoughtPanel} role="tabpanel">
        <span>{detail.label}</span>
        <h3 id="thought-heading">{detail.text}</h3>
        <p>
          {step === "observation"
            ? "This is the last point supported directly by the meter."
            : "This may feel convincing, but one reading doesn't establish it."}
        </p>
      </div>
    </section>
  );
}

type MeterStep = "hands" | "guide" | "record" | "repeat";

function MeasurementCheck() {
  const [selected, setSelected] = useState<MeterStep | null>(null);
  const steps: { id: MeterStep; label: string }[] = [
    { id: "hands", label: "Wash and dry his hands" },
    { id: "guide", label: "Follow the meter instructions" },
    { id: "record", label: "Record the result and useful context" },
    { id: "repeat", label: "Keep testing until a preferred number appears" },
  ];

  return (
    <section className={styles.measurement} aria-labelledby="measurement-heading">
      <div className={styles.deviceGuide}>
        <span>Device guide</span>
        <h3 id="measurement-heading">Check the technique, not for reassurance.</h3>
        <p>Devon uses the instructions for his own meter and the plan he received.</p>
      </div>
      <div className={styles.stepChoices} role="radiogroup" aria-label="Choose a measurement step">
        {steps.map((option) => (
          <button
            aria-checked={selected === option.id}
            className={selected === option.id ? styles.selectedStep : undefined}
            key={option.id}
            onClick={() => setSelected(option.id)}
            role="radio"
            type="button"
          >
            <span>{option.label}</span>
            {selected === option.id ? <Check aria-hidden="true" size={18} /> : null}
          </button>
        ))}
      </div>
      {selected ? (
        <div aria-live="polite" className={styles.feedback}>
          <strong>
            {selected === "repeat" ? "That chases reassurance." : "That adds useful context."}
          </strong>
          <p>
            {selected === "repeat"
              ? "Repeated testing should follow device instructions and Devon's care plan, not continue only until the number feels better."
              : "Careful technique can make the result more useful without promising a different number."}
          </p>
        </div>
      ) : null}
    </section>
  );
}

type PlanChoice = "plan" | "repeat" | "change";

function NextStepDecision() {
  const [choice, setChoice] = useState<PlanChoice | null>(null);
  const choices: { id: PlanChoice; label: string }[] = [
    { id: "plan", label: "Check how he feels and open his written care plan." },
    { id: "repeat", label: "Keep testing until the result feels less worrying." },
    { id: "change", label: "Change medication based on this result alone." },
  ];

  return (
    <section className={styles.nextDecision} aria-labelledby="next-step-heading">
      <h3 id="next-step-heading">What is the useful next move?</h3>
      <div className={styles.nextChoices} role="radiogroup" aria-label="Choose Devon's next move">
        {choices.map((option) => (
          <button
            aria-checked={choice === option.id}
            className={choice === option.id ? styles.nextChoiceSelected : undefined}
            key={option.id}
            onClick={() => setChoice(option.id)}
            role="radio"
            type="button"
          >
            <span>{option.label}</span>
            {choice === option.id ? <Check aria-hidden="true" size={18} /> : null}
          </button>
        ))}
      </div>
      {choice ? (
        <div aria-live="polite" className={styles.nextFeedback}>
          <strong>
            {choice === "plan" ? "That checks what the meter cannot show." : "That skips the plan."}
          </strong>
          <p>
            {choice === "plan"
              ? "Symptoms and Devon's own instructions help determine what happens next."
              : "Repeated testing or treatment changes should not be improvised to make one result feel better."}
          </p>
        </div>
      ) : null}
    </section>
  );
}

const safetyDetails = {
  symptoms: {
    title: "How Devon feels",
    copy: "Symptoms can change the urgency. Severe symptoms such as trouble breathing, confusion, fainting, or persistent vomiting need urgent help and should not wait for an app or repeated testing.",
  },
  plan: {
    title: "His written plan",
    copy: "Devon's own instructions tell him what steps to take and when to contact his care team. A general story cannot replace that plan.",
  },
  pattern: {
    title: "What has been happening",
    copy: "An isolated result and a repeating pattern provide different context. Monitoring frequency still comes from Devon's care plan.",
  },
} as const;

function SafetyContext() {
  const [context, setContext] = useState<keyof typeof safetyDetails>("symptoms");
  const detail = safetyDetails[context];

  return (
    <section className={styles.safety} aria-labelledby="safety-heading">
      <div className={styles.safetyTabs} role="tablist" aria-label="Review response context">
        <button
          aria-selected={context === "symptoms"}
          onClick={() => setContext("symptoms")}
          role="tab"
          type="button"
        >
          Symptoms
        </button>
        <button
          aria-selected={context === "plan"}
          onClick={() => setContext("plan")}
          role="tab"
          type="button"
        >
          Personal plan
        </button>
        <button
          aria-selected={context === "pattern"}
          onClick={() => setContext("pattern")}
          role="tab"
          type="button"
        >
          Pattern
        </button>
      </div>
      <div aria-live="polite" className={styles.safetyPanel} role="tabpanel">
        <span>{context === "symptoms" ? "Check first" : "Add context"}</span>
        <h3 id="safety-heading">{detail.title}</h3>
        <p>{detail.copy}</p>
      </div>
    </section>
  );
}

const messageDetails = [
  "The result and time",
  "When it was checked in relation to eating",
  "How he felt and any symptoms",
  "Relevant changes in sleep, stress, illness, or routine",
  "The meter and care-plan instructions he followed",
] as const;

function MessageNote() {
  const [included, setIncluded] = useState<number[]>([0, 2]);

  const toggle = (index: number) => {
    setIncluded((current) =>
      current.includes(index) ? current.filter((item) => item !== index) : [...current, index],
    );
  };

  return (
    <section className={styles.messageNote} aria-labelledby="message-heading">
      <div className={styles.noteTop}>
        <span>Note for the care team</span>
        <span>{included.length} details</span>
      </div>
      <h3 id="message-heading">Add context, not an apology.</h3>
      <div className={styles.detailChoices}>
        {messageDetails.map((detail, index) => (
          <button
            aria-pressed={included.includes(index)}
            className={included.includes(index) ? styles.detailIncluded : undefined}
            key={detail}
            onClick={() => toggle(index)}
            type="button"
          >
            <span>{detail}</span>
            <Check aria-hidden="true" size={17} />
          </button>
        ))}
      </div>
      <p>
        A qualified healthcare professional can use this context without Devon guessing at a cause
        or changing treatment on his own.
      </p>
    </section>
  );
}

const momentDetails = {
  evening: {
    label: "Tuesday evening",
    title: "Above Devon's range",
    copy: "The result was worth recording and responding to according to his personal plan.",
  },
  morning: {
    label: "Wednesday morning",
    title: "A different result",
    copy: "A different moment can produce different information. It does not erase the earlier result or prove what caused either one.",
  },
  together: {
    label: "Viewed together",
    title: "For the care team",
    copy: "Devon can ask whether the timing, symptoms, routine, and pattern change what his care team wants him to notice.",
  },
} as const;

function TwoMoments() {
  const [moment, setMoment] = useState<keyof typeof momentDetails>("evening");
  const detail = momentDetails[moment];

  return (
    <section className={styles.twoMoments} aria-labelledby="moments-heading">
      <div className={styles.momentTabs} role="tablist" aria-label="Compare two moments">
        {(Object.keys(momentDetails) as Array<keyof typeof momentDetails>).map((key) => (
          <button
            aria-selected={moment === key}
            key={key}
            onClick={() => setMoment(key)}
            role="tab"
            type="button"
          >
            {momentDetails[key].label}
          </button>
        ))}
      </div>
      <div aria-live="polite" className={styles.momentPanel} role="tabpanel">
        <span>{detail.label}</span>
        <h3 id="moments-heading">{detail.title}</h3>
        <p>{detail.copy}</p>
      </div>
    </section>
  );
}

function PatternView() {
  const [view, setView] = useState<"point" | "context">("point");

  return (
    <section className={styles.pattern} aria-labelledby="pattern-heading">
      <div
        className={styles.tabs}
        role="tablist"
        aria-label="Compare an isolated result with contextual notes"
      >
        <button
          aria-selected={view === "point"}
          onClick={() => setView("point")}
          role="tab"
          type="button"
        >
          One result
        </button>
        <button
          aria-selected={view === "context"}
          onClick={() => setView("context")}
          role="tab"
          type="button"
        >
          Results with context
        </button>
      </div>
      {view === "point" ? (
        <div className={styles.singlePoint} role="tabpanel">
          <div aria-hidden="true">
            <span />
          </div>
          <h3 id="pattern-heading">One result can matter.</h3>
          <p>By itself, it may not explain what happened or what will happen next.</p>
        </div>
      ) : (
        <div className={styles.contextLine} role="tabpanel">
          <div aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <h3 id="pattern-heading">The notes help at follow-up.</h3>
          <p>
            Timing, symptoms, routine, and the steps Devon followed make the conversation more
            useful. His care plan determines when monitoring is appropriate.
          </p>
        </div>
      )}
    </section>
  );
}

const scenes = [
  {
    id: "reading",
    title: "After dinner",
    moment: "Tuesday · 8:42 PM",
    body: (
      <>
        <p>
          Devon almost forgot to check his glucose. When he did, the result was above the personal
          range he and his healthcare team had discussed.
        </p>
        <p>He looked at the screen and immediately thought he had done something wrong.</p>
        <blockquote>“Great. I messed up.”</blockquote>
      </>
    ),
    visual: <MeterReading />,
    continueLabel: "A few minutes later",
  },
  {
    id: "thoughts",
    title: "On the sofa",
    moment: "8:49 PM",
    body: (
      <>
        <p>
          Devon tried to watch television, but he kept replaying dinner and the birthday cake
          someone had brought to work.
        </p>
        <p>
          One result turned into a guess about the meal, then a prediction about every reading that
          might come next.
        </p>
      </>
    ),
    visual: <ThoughtPath />,
    continueLabel: "Go back to the meter",
  },
  {
    id: "technique",
    title: "Checking the steps",
    moment: "8:57 PM",
    body: (
      <>
        <p>
          Devon noticed a piece of cut fruit beside the plate. He could not remember whether he had
          washed and dried his hands before testing.
        </p>
        <p>
          That did not prove the result was wrong. It gave him a reason to slow down and follow the
          instructions for his meter.
        </p>
      </>
    ),
    visual: <MeasurementCheck />,
    continueLabel: "Decide what happens next",
  },
  {
    id: "next-step",
    title: "The next move",
    moment: "9:02 PM",
    body: (
      <>
        <p>
          Devon had checked the testing steps. He still had the same result and the same urge to
          make it disappear.
        </p>
        <p>Before doing anything else, he needed information the meter could not provide.</p>
      </>
    ),
    visual: <NextStepDecision />,
    continueLabel: "Open Devon's care plan",
  },
  {
    id: "context",
    title: "What matters now",
    moment: "9:06 PM",
    body: (
      <>
        <p>
          The meter could show a result. It could not check Devon&apos;s symptoms, read his personal
          instructions, or tell whether this was isolated or repeating.
        </p>
        <p>
          Devon was alert and able to think clearly. He opened the written plan from his healthcare
          team.
        </p>
      </>
    ),
    visual: <SafetyContext />,
    continueLabel: "Write down the context",
  },
  {
    id: "note",
    title: "A useful note",
    moment: "9:14 PM",
    body: (
      <>
        <p>
          Devon put a notebook beside the meter. He wrote down the result and time, then added the
          details he would want his care team to know.
        </p>
        <p>
          He did not need to identify one cause or apologize for the number. He needed a clear
          question with enough context to discuss it.
        </p>
      </>
    ),
    visual: <MessageNote />,
    continueLabel: "Go to the next morning",
  },
  {
    id: "two-moments",
    title: "The next morning",
    moment: "Wednesday · 7:18 AM",
    body: (
      <>
        <p>
          Devon followed his usual morning routine and checked according to his plan. The result was
          different from the night before.
        </p>
        <p>
          He wrote it beneath the first entry. A different result did not make Tuesday irrelevant;
          it gave the care team another moment to consider.
        </p>
      </>
    ),
    visual: <TwoMoments />,
    continueLabel: "See the longer view",
  },
  {
    id: "longer-view",
    title: "The follow-up",
    moment: "Later that week",
    body: (
      <>
        <p>
          Devon&apos;s care team reviewed the result, its timing, how he felt, and the instructions
          he had followed.
        </p>
        <p>
          They discussed what information would be useful if something similar happened again. The
          result was considered alongside the rest of Devon&apos;s note.
        </p>
      </>
    ),
    visual: <PatternView />,
    continueLabel: "Finish story",
  },
] as const;

export function DevonStoryExperience() {
  const [hydrated, setHydrated] = useState(false);
  const [current, setCurrent] = useState(0);
  const [furthest, setFurthest] = useState(0);
  const [complete, setComplete] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    document.body.classList.add("story-reader-active");
    const saved = parseStoryProgress(readLocalStorage(STORAGE_KEY).value);
    const query = new URLSearchParams(window.location.search);
    const shouldBegin = query.get("begin") === "1";
    const savedScene = Math.min(saved.currentScene, SCENE_COUNT - 1);

    if (shouldBegin) {
      setCurrent(0);
      setFurthest(0);
    } else if (saved.storyCompleted) {
      setComplete(true);
    } else if (saved.stage !== "intro") {
      setCurrent(savedScene);
      setFurthest(Math.max(saved.furthestSceneReached, savedScene));
    }
    setHydrated(true);

    return () => document.body.classList.remove("story-reader-active");
  }, []);

  const persist = useCallback((scene: number, reached: number, storyCompleted = false) => {
    const stored = parseStoryProgress(readLocalStorage(STORAGE_KEY).value);
    saveProgress({
      ...stored,
      currentScene: scene,
      furthestSceneReached: reached,
      lastOpenedAt: Date.now(),
      completionDate: storyCompleted ? (stored.completionDate ?? new Date().toISOString()) : null,
      storyCompleted,
      versionCompleted: storyCompleted ? "2.1" : null,
      stage: storyCompleted ? "complete" : "story",
    });
  }, []);

  useEffect(() => {
    if (!hydrated || complete) return;
    persist(current, furthest);
  }, [complete, current, furthest, hydrated, persist]);

  const goTo = (next: number) => {
    if (next < 0 || next >= SCENE_COUNT) return;
    setCurrent(next);
    setFurthest((value) => Math.max(value, next));
    window.requestAnimationFrame(() => {
      articleRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
      headingRef.current?.focus({ preventScroll: true });
    });
  };

  const finish = () => {
    persist(SCENE_COUNT - 1, SCENE_COUNT - 1, true);
    setComplete(true);
    void recognizeMilestone({ event: "interactive_story_completed", storyId: STORY_SLUG });
    window.requestAnimationFrame(() => {
      articleRef.current?.scrollIntoView({
        behavior: shouldReduceMotion() ? "auto" : "smooth",
        block: "start",
      });
      headingRef.current?.focus({ preventScroll: true });
    });
  };

  const restart = () => {
    setCurrent(0);
    setFurthest(0);
    setComplete(false);
    persist(0, 0);
    window.requestAnimationFrame(() => {
      articleRef.current?.scrollIntoView({
        behavior: shouldReduceMotion() ? "auto" : "smooth",
        block: "start",
      });
      headingRef.current?.focus({ preventScroll: true });
    });
  };

  const scene = scenes[current]!;

  return (
    <main className={styles.page}>
      <Link className={styles.backLink} href="/stories">
        <ArrowLeft aria-hidden="true" size={17} /> Stories
      </Link>

      {!hydrated ? (
        <div aria-live="polite" className={styles.loading} role="status">
          <span aria-hidden="true" className={styles.loadingMark}>
            <span />
            <span />
            <span />
          </span>
          <span>Loading story</span>
        </div>
      ) : complete ? (
        <article className={styles.completion} ref={articleRef}>
          <p>Devon&apos;s story</p>
          <h1 ref={headingRef} tabIndex={-1}>
            Finished
          </h1>
          <p>
            Devon recorded the result, checked his instructions, and wrote down the timing,
            symptoms, and routine details for his care team.
          </p>
          <div className={styles.completionTakeaway}>
            <span>In short</span>
            <strong>
              A glucose result is information. Symptoms, context, and a personal care plan guide
              what happens next.
            </strong>
          </div>
          <div className={styles.completionActions}>
            <Link className={styles.primaryAction} href="/stories">
              Back to stories
            </Link>
            <button className={styles.secondaryAction} onClick={restart} type="button">
              <RotateCcw aria-hidden="true" size={16} /> Read again
            </button>
          </div>
          <p className={styles.disclosure}>Devon is a fictional character.</p>
        </article>
      ) : (
        <article className={styles.reader} ref={articleRef}>
          <StoryProgressHeader current={current} />
          <div className={styles.scene} key={scene.id}>
            <header className={styles.sceneHeading}>
              <p>
                <Clock3 aria-hidden="true" size={15} /> {scene.moment}
              </p>
              <h1 ref={headingRef} tabIndex={-1}>
                {scene.title}
              </h1>
            </header>
            <div className={styles.storyCopy}>{scene.body}</div>
            <div className={styles.sceneVisual}>{scene.visual}</div>
          </div>

          <nav aria-label="Story navigation" className={styles.navigation}>
            {current > 0 ? (
              <button className={styles.previous} onClick={() => goTo(current - 1)} type="button">
                <ChevronLeft aria-hidden="true" size={18} /> Back
              </button>
            ) : (
              <span />
            )}
            <button
              className={styles.next}
              onClick={() => (current === SCENE_COUNT - 1 ? finish() : goTo(current + 1))}
              type="button"
            >
              {scene.continueLabel} <ArrowRight aria-hidden="true" size={18} />
            </button>
          </nav>
        </article>
      )}
    </main>
  );
}
