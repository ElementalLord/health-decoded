"use client";

import { ArrowLeft, ArrowRight, ChevronLeft, Clock3, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { caregiverModule3 } from "../../../content/caregiver-module-3";
import { caregiverModuleRegistry } from "../../../content/caregiver-module-registry";
import { isCaregiverModuleComplete } from "../../../lib/caregiver-completion";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-1-story.module.css";

const SCENE_COUNT = 16;

function shouldReduceMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function StepNavigator({
  completed,
  count,
  current,
  label,
  onSelect,
}: {
  readonly completed: (index: number) => boolean;
  readonly count: number;
  readonly current: number;
  readonly label: string;
  readonly onSelect: (index: number) => void;
}) {
  return (
    <div aria-label={`${label} navigation`} className={styles.stepNavigator} role="navigation">
      {Array.from({ length: count }, (_, index) => (
        <button
          aria-current={current === index ? "step" : undefined}
          aria-label={`${label} ${index + 1}${completed(index) ? ", reviewed" : ""}`}
          data-complete={completed(index) ? "true" : undefined}
          key={index}
          onClick={() => onSelect(index)}
          type="button"
        >
          <span aria-hidden="true">{index + 1}</span>
        </button>
      ))}
    </div>
  );
}

function ModuleProgressHeader({ current }: { readonly current: number }) {
  return (
    <header className={styles.readerHeader}>
      <div className={styles.readerIdentity}>
        <span>Caregiver module 3</span>
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

function ScenarioSequence({ end, start }: { readonly end: number; readonly start: number }) {
  const lines = caregiverModule3.sections.scenario.paragraphs.slice(start, end);
  const [index, setIndex] = useState(0);

  return (
    <section className={styles.phraseBrowser} aria-label="Dinner at seven">
      <div className={styles.phraseCard}>
        <span>
          Moment {index + 1} of {lines.length}
        </span>
        <h3>{index === 0 ? caregiverModule3.sections.scenario.title : "What happens next"}</h3>
        <p>{lines[index]}</p>
      </div>
      <div className={styles.phraseControls}>
        <button disabled={index === 0} onClick={() => setIndex(index - 1)} type="button">
          Previous
        </button>
        <span aria-live="polite">
          {index + 1} of {lines.length}
        </span>
        <button
          disabled={index === lines.length - 1}
          onClick={() => setIndex(index + 1)}
          type="button"
        >
          Next
        </button>
      </div>
    </section>
  );
}

const mealDetails = [
  { label: "Timing", copy: "Move the schedule instead of making assumptions about the plate." },
  { label: "Budget", copy: "Name the cost limit before choosing what to buy." },
  { label: "Shared ingredients", copy: "Ask what can work for the meal everyone is sharing." },
  { label: "Cleanup", copy: "Remove one household task without changing the food." },
  { label: "Transportation", copy: "A ride may solve the burden that was actually named." },
  { label: "No change", copy: "Keeping the familiar routine can also be the useful answer." },
] as const;

function MealEaseDiagram() {
  const [selected, setSelected] = useState(0);
  const detail = mealDetails[selected]!;
  return (
    <section className={styles.reasonMap} aria-label="What could make dinner easier">
      <div className={styles.reasonCloud} role="tablist" aria-label="Practical possibilities">
        {mealDetails.map((item, index) => (
          <button
            aria-controls="meal-detail"
            aria-selected={index === selected}
            key={item.label}
            onClick={() => setSelected(index)}
            role="tab"
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className={styles.reasonPanel} id="meal-detail" role="tabpanel">
        <span>One possible answer</span>
        <h3>{detail.label}</h3>
        <p>{detail.copy}</p>
      </div>
    </section>
  );
}

type PlanItem = (typeof caregiverModule3.interactions.planning.items)[number];
type PlanChoice =
  (typeof caregiverModule3.interactions.planning.zones)[number] | "Leave off the plan";
const planChoices: readonly PlanChoice[] = [
  ...caregiverModule3.interactions.planning.zones,
  "Leave off the plan",
];

function preferredPlanChoice(item: PlanItem): PlanChoice {
  return item.preferredZones[0] ?? "Leave off the plan";
}

function PlanningPractice() {
  const interaction = caregiverModule3.interactions.planning;
  const { markInteractionSubmitted } = useCaregiverSession();
  const [index, setIndex] = useState(0);
  const [choices, setChoices] = useState<Record<string, PlanChoice>>({});
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const item = interaction.items[index]!;
  const choice = choices[item.id];
  const isReviewed = Boolean(reviewed[item.id]);
  const isPreferred = choice
    ? item.preferredZones.length === 0
      ? choice === "Leave off the plan"
      : (item.preferredZones as readonly string[]).includes(choice)
    : false;
  const assisted = (attempts[item.id] ?? 0) >= 3 && !isPreferred;

  function review() {
    if (!choice) return;
    const nextReviewed = { ...reviewed, [item.id]: true };
    setAttempts((current) => ({ ...current, [item.id]: (current[item.id] ?? 0) + 1 }));
    setReviewed(nextReviewed);
    if (interaction.items.every((entry) => nextReviewed[entry.id]))
      markInteractionSubmitted(interaction.id);
  }

  function feedbackFor(current: PlanItem) {
    if (current.id === "portion") return interaction.feedback.portion;
    if (current.id === "separate") return interaction.feedback.separate;
    if (current.id === "shelf") return interaction.feedback.shelf;
    return isPreferred ? interaction.feedback.preferred : interaction.learningPoint;
  }

  return (
    <section
      className={styles.sorter}
      data-feedback-status="available"
      data-interaction-id={interaction.id}
      data-optional-practice="true"
    >
      <div className={styles.sorterTop}>
        <span>
          Detail {index + 1} of {interaction.items.length}
        </span>
        <StepNavigator
          completed={(step) => Boolean(reviewed[interaction.items[step]!.id])}
          count={interaction.items.length}
          current={index}
          label="Planning detail"
          onSelect={setIndex}
        />
      </div>
      <h3>{item.copy}</h3>
      <div className={styles.sortChoices} role="radiogroup" aria-label="Place this detail">
        {planChoices.map((option) => (
          <button
            aria-checked={choice === option}
            className={choice === option ? styles.choiceSelected : undefined}
            key={option}
            onClick={() => {
              setChoices((current) => ({ ...current, [item.id]: option }));
              setReviewed((current) => ({ ...current, [item.id]: false }));
            }}
            role="radio"
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
      {isReviewed ? (
        <p className={styles.sortFeedback} role="status">
          <strong>
            {isPreferred ? "This keeps the plan useful. " : "Look at the named burden. "}
          </strong>
          {feedbackFor(item)}
          {assisted
            ? ` Suggested placement: ${preferredPlanChoice(item)}. Your choice has been kept.`
            : ""}
        </p>
      ) : null}
      <button
        className={`${styles.primaryAction} ${styles.activityAction}`}
        disabled={isReviewed ? index === interaction.items.length - 1 : !choice}
        onClick={() => (isReviewed ? setIndex(index + 1) : review())}
        type="button"
      >
        {isReviewed
          ? index === interaction.items.length - 1
            ? "Plan reviewed"
            : "Next detail"
          : "Review this detail"}
      </button>
      <div className={styles.miniNavigation}>
        <button disabled={index === 0} onClick={() => setIndex(index - 1)} type="button">
          Previous
        </button>
        <span>
          {index + 1} of {interaction.items.length}
        </span>
      </div>
    </section>
  );
}

function OfferComparison() {
  const section = caregiverModule3.sections.specific;
  const [selected, setSelected] = useState<"broad" | "specific">("broad");
  const isSpecific = selected === "specific";
  return (
    <section className={styles.modePicker}>
      <div className={styles.switchTabs} role="tablist" aria-label="Compare two offers">
        <button
          aria-selected={!isSpecific}
          onClick={() => setSelected("broad")}
          role="tab"
          type="button"
        >
          Broad offer
        </button>
        <button
          aria-selected={isSpecific}
          onClick={() => setSelected("specific")}
          role="tab"
          type="button"
        >
          Specific offer
        </button>
      </div>
      <div className={styles.modePanel} role="tabpanel">
        <h3>{isSpecific ? "One action with clear edges" : "A kind thought with hidden work"}</h3>
        <blockquote>{isSpecific ? section.specific : section.broad}</blockquote>
        <p>
          {isSpecific
            ? "The action, timing, and choice are visible. The person can answer without inventing a task."
            : "The person still has to identify a need, decide what is safe to ask, and define the task."}
        </p>
      </div>
    </section>
  );
}

const specificHelp = [
  { label: "Ride", copy: "Name the day and time you can drive." },
  { label: "Phone call", copy: "Offer one call, not ongoing management." },
  { label: "Shared prep", copy: "Work on the household task that was requested." },
  { label: "Errand", copy: "Move or complete one clearly named errand." },
  { label: "Supply space", copy: "Organize only the nonmedical space you agreed on." },
  { label: "Notes", copy: "Take notes only when invited and follow their purpose." },
  { label: "Walk company", copy: "Offer companionship, not treatment for a reading or symptom." },
] as const;

function SpecificHelpBrowser() {
  const [index, setIndex] = useState(0);
  const item = specificHelp[index]!;
  return (
    <section className={styles.thoughtPath}>
      <div className={styles.pathButtons} role="tablist" aria-label="Specific help examples">
        {specificHelp.map((entry, itemIndex) => (
          <button
            aria-selected={index === itemIndex}
            key={entry.label}
            onClick={() => setIndex(itemIndex)}
            role="tab"
            type="button"
          >
            <span>{itemIndex + 1}</span> {entry.label}
          </button>
        ))}
      </div>
      <div className={styles.thoughtPanel} role="tabpanel">
        <span>Concrete help</span>
        <h3>{item.label}</h3>
        <p>{item.copy}</p>
      </div>
    </section>
  );
}

type MatchPair = (typeof caregiverModule3.interactions.matching.pairs)[number];

function RequestMatching({ onComplete }: { readonly onComplete: () => void }) {
  const interaction = caregiverModule3.interactions.matching;
  const { markInteractionSubmitted } = useCaregiverSession();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const pair: MatchPair = interaction.pairs[index]!;
  const answer = answers[pair.id];
  const currentReviewed = Boolean(reviewed[pair.id]);
  const correct = answer === pair.id;
  const assisted = (attempts[pair.id] ?? 0) >= 3 && !correct;

  function review() {
    if (!answer) return;
    const nextReviewed = { ...reviewed, [pair.id]: true };
    setAttempts((current) => ({ ...current, [pair.id]: (current[pair.id] ?? 0) + 1 }));
    setReviewed(nextReviewed);
    if (interaction.pairs.every((entry) => nextReviewed[entry.id])) {
      markInteractionSubmitted(interaction.id);
      onComplete();
    }
  }

  return (
    <section
      className={styles.sorter}
      data-core-application="true"
      data-interaction-id={interaction.id}
      data-required="true"
    >
      <div className={styles.sorterTop}>
        <span>
          Request {index + 1} of {interaction.pairs.length}
        </span>
        <StepNavigator
          completed={(step) => Boolean(reviewed[interaction.pairs[step]!.id])}
          count={interaction.pairs.length}
          current={index}
          label="Request"
          onSelect={setIndex}
        />
      </div>
      <h3>{pair.request}</h3>
      <div className={styles.compactChoices} role="radiogroup" aria-label="Offers">
        {interaction.pairs.map((option) => (
          <button
            aria-checked={answer === option.id}
            key={option.id}
            onClick={() => {
              setAnswers((current) => ({ ...current, [pair.id]: option.id }));
              setReviewed((current) => ({ ...current, [pair.id]: false }));
            }}
            role="radio"
            type="button"
          >
            {option.offer}
          </button>
        ))}
      </div>
      {currentReviewed ? (
        <p className={styles.inlineFeedback} role="status">
          <strong>
            {correct ? "The offer stays inside the request. " : "This adds a different role. "}
          </strong>
          {correct ? interaction.feedback.preferred : interaction.feedback.adjacent}
          {assisted ? ` Suggested offer: ${pair.offer}. Your choice has been kept.` : ""}
        </p>
      ) : null}
      <button
        className={`${styles.primaryAction} ${styles.activityAction}`}
        disabled={currentReviewed ? index === interaction.pairs.length - 1 : !answer}
        onClick={() => (currentReviewed ? setIndex(index + 1) : review())}
        type="button"
      >
        {currentReviewed
          ? index === interaction.pairs.length - 1
            ? "Requests reviewed"
            : "Next request"
          : "Review this match"}
      </button>
      <div className={styles.miniNavigation}>
        <button disabled={index === 0} onClick={() => setIndex(index - 1)} type="button">
          Previous
        </button>
        <span>
          {index + 1} of {interaction.pairs.length}
        </span>
      </div>
    </section>
  );
}

const changingSupport = [
  { label: "Offer", copy: "Name one action and let the person decide." },
  { label: "Current answer", copy: "Follow what is useful now, including a pause or no." },
  { label: "Check again", copy: "Ask whether the help still reduces work instead of inspecting." },
] as const;

function SupportChangesDiagram() {
  const [index, setIndex] = useState(0);
  const item = changingSupport[index]!;
  return (
    <section className={styles.timing}>
      <div className={styles.timelineTabs} role="tablist" aria-label="How support changes">
        {changingSupport.map((entry, itemIndex) => (
          <button
            aria-selected={index === itemIndex}
            key={entry.label}
            onClick={() => setIndex(itemIndex)}
            role="tab"
            type="button"
          >
            <span>{itemIndex + 1}</span> {entry.label}
          </button>
        ))}
      </div>
      <div className={styles.timingPanel} role="tabpanel">
        <h3>{item.label}</h3>
        <p>{item.copy}</p>
      </div>
    </section>
  );
}

type MenuOffer = (typeof caregiverModule3.interactions.menu.offers)[number];

function SupportMenu() {
  const interaction = caregiverModule3.interactions.menu;
  const { markInteractionSubmitted } = useCaregiverSession();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const offer: MenuOffer = interaction.offers[index]!;
  const answer = answers[offer.id];
  const currentReviewed = Boolean(reviewed[offer.id]);
  const correct = answer === offer.preferredCategory;

  function review() {
    if (!answer) return;
    const nextReviewed = { ...reviewed, [offer.id]: true };
    setReviewed(nextReviewed);
    if (interaction.offers.every((entry) => nextReviewed[entry.id]))
      markInteractionSubmitted(interaction.id);
  }

  return (
    <section className={styles.sorter} data-interaction-id={interaction.id}>
      <div className={styles.sorterTop}>
        <span>
          Offer {index + 1} of {interaction.offers.length}
        </span>
        <StepNavigator
          completed={(step) => Boolean(reviewed[interaction.offers[step]!.id])}
          count={interaction.offers.length}
          current={index}
          label="Offer"
          onSelect={setIndex}
        />
      </div>
      <h3>{offer.label}</h3>
      <p className={styles.friendMessage}>{offer.preference}</p>
      <div className={styles.compactChoices} role="radiogroup" aria-label="Current preference">
        {interaction.categories.map((category) => (
          <button
            aria-checked={answer === category}
            key={category}
            onClick={() => {
              setAnswers((current) => ({ ...current, [offer.id]: category }));
              setReviewed((current) => ({ ...current, [offer.id]: false }));
            }}
            role="radio"
            type="button"
          >
            {category}
          </button>
        ))}
      </div>
      {currentReviewed ? (
        <p className={styles.inlineFeedback} role="status">
          <strong>
            {correct ? "This follows the stated preference. " : "Use the answer given. "}
          </strong>
          {correct ? interaction.feedback.preferred : interaction.feedback.mismatch}
          {!correct
            ? ` Suggested category: ${offer.preferredCategory}. Your choice has been kept.`
            : ""}
        </p>
      ) : null}
      <button
        className={`${styles.primaryAction} ${styles.activityAction}`}
        disabled={currentReviewed ? index === interaction.offers.length - 1 : !answer}
        onClick={() => (currentReviewed ? setIndex(index + 1) : review())}
        type="button"
      >
        {currentReviewed
          ? index === interaction.offers.length - 1
            ? "Menu reviewed"
            : "Next offer"
          : "Review this offer"}
      </button>
      <div className={styles.miniNavigation}>
        <button disabled={index === 0} onClick={() => setIndex(index - 1)} type="button">
          Previous
        </button>
        <span>
          {index + 1} of {interaction.offers.length}
        </span>
      </div>
    </section>
  );
}

type RoutinePair = (typeof caregiverModule3.interactions.routines.pairs)[number];

function RoutineComparison() {
  const interaction = caregiverModule3.interactions.routines;
  const { markInteractionSubmitted } = useCaregiverSession();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const pair: RoutinePair = interaction.pairs[index]!;
  const answer = answers[pair.id];
  const currentReviewed = Boolean(reviewed[pair.id]);
  const correct = answer === pair.preferredOption;

  function review() {
    if (!answer) return;
    const nextReviewed = { ...reviewed, [pair.id]: true };
    setReviewed(nextReviewed);
    if (interaction.pairs.every((entry) => nextReviewed[entry.id]))
      markInteractionSubmitted(interaction.id);
  }

  return (
    <section className={styles.sorter} data-interaction-id={interaction.id}>
      <div className={styles.sorterTop}>
        <span>
          Routine {index + 1} of {interaction.pairs.length}
        </span>
        <StepNavigator
          completed={(step) => Boolean(reviewed[interaction.pairs[step]!.id])}
          count={interaction.pairs.length}
          current={index}
          label="Routine"
          onSelect={setIndex}
        />
      </div>
      <h3>{pair.topic}</h3>
      <div className={styles.readinessPair} aria-label="Compare the two actions">
        <div>
          <span>A</span>
          <strong>{pair.a}</strong>
        </div>
        <div>
          <span>B</span>
          <strong>{pair.b}</strong>
        </div>
      </div>
      <div
        className={styles.compactChoices}
        role="radiogroup"
        aria-label="What changes the routine"
      >
        {interaction.options.map((option) => (
          <button
            aria-checked={answer === option}
            key={option}
            onClick={() => {
              setAnswers((current) => ({ ...current, [pair.id]: option }));
              setReviewed((current) => ({ ...current, [pair.id]: false }));
            }}
            role="radio"
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
      {currentReviewed ? (
        <p className={styles.inlineFeedback} role="status">
          <strong>
            {correct ? "You found the deciding detail. " : "Look first at access and agreement. "}
          </strong>
          {correct ? interaction.feedback.preferred : interaction.feedback.incorrect}
          {!correct ? ` Suggested detail: ${pair.preferredOption}. Your choice has been kept.` : ""}
        </p>
      ) : null}
      <button
        className={`${styles.primaryAction} ${styles.activityAction}`}
        disabled={currentReviewed ? index === interaction.pairs.length - 1 : !answer}
        onClick={() => (currentReviewed ? setIndex(index + 1) : review())}
        type="button"
      >
        {currentReviewed
          ? index === interaction.pairs.length - 1
            ? "Routines reviewed"
            : "Next routine"
          : "Review this routine"}
      </button>
      <div className={styles.miniNavigation}>
        <button disabled={index === 0} onClick={() => setIndex(index - 1)} type="button">
          Previous
        </button>
        <span>
          {index + 1} of {interaction.pairs.length}
        </span>
      </div>
    </section>
  );
}

const ordinaryLife = [
  {
    label: "Invite",
    copy: "Keep offering ordinary time together without turning it into supervision.",
  },
  { label: "Let them disclose", copy: "The person decides what guests or relatives know." },
  {
    label: "Leave health out",
    copy: "A meal, text, or outing does not always need a diabetes explanation.",
  },
] as const;

function OrdinaryLifeDiagram() {
  const [index, setIndex] = useState(0);
  const item = ordinaryLife[index]!;
  return (
    <section className={styles.modePicker}>
      <div
        className={styles.modeButtons}
        role="tablist"
        aria-label="Ways to preserve ordinary life"
      >
        {ordinaryLife.map((entry, itemIndex) => (
          <button
            aria-selected={index === itemIndex}
            key={entry.label}
            onClick={() => setIndex(itemIndex)}
            role="tab"
            type="button"
          >
            {entry.label}
          </button>
        ))}
      </div>
      <div className={styles.modePanel} role="tabpanel">
        <h3>{item.label}</h3>
        <p>{item.copy}</p>
      </div>
    </section>
  );
}

function SharedChangeComparison() {
  const section = caregiverModule3.sections.misunderstanding;
  const [selected, setSelected] = useState<"assumption" | "shared">("assumption");
  const shared = selected === "shared";
  return (
    <section className={styles.knownUnknown}>
      <div className={styles.switchTabs} role="tablist" aria-label="Compare household changes">
        <button
          aria-selected={!shared}
          onClick={() => setSelected("assumption")}
          role="tab"
          type="button"
        >
          Unilateral change
        </button>
        <button
          aria-selected={shared}
          onClick={() => setSelected("shared")}
          role="tab"
          type="button"
        >
          Shared decision
        </button>
      </div>
      <div className={styles.knownPanel} role="tabpanel">
        <h3>
          {shared
            ? "Ask before changing the routine"
            : "A household change can still remove choice"}
        </h3>
        <p>{shared ? section.correction : section.misunderstanding}</p>
      </div>
    </section>
  );
}

function PhraseBrowser() {
  const scripts = caregiverModule3.scripts;
  const [index, setIndex] = useState(0);
  const phrase = scripts[index]!;
  return (
    <section className={styles.phraseBrowser} aria-label="Useful phrases">
      <div className={styles.phraseCard}>
        <span>{phrase.label}</span>
        <h3>{phrase.copy}</h3>
      </div>
      <div className={styles.phraseControls}>
        <button disabled={index === 0} onClick={() => setIndex(index - 1)} type="button">
          Previous
        </button>
        <span aria-live="polite">
          {index + 1} of {scripts.length}
        </span>
        <button
          disabled={index === scripts.length - 1}
          onClick={() => setIndex(index + 1)}
          type="button"
        >
          Next
        </button>
      </div>
    </section>
  );
}

function QuickCheck() {
  const questions = caregiverModule3.questions;
  const { setKeyIdeaUnderstood } = useCaregiverSession();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const question = questions[index]!;
  const answer = answers[question.id];
  const currentReviewed = Boolean(reviewed[question.id]);
  const correct = answer === question.preferredIndex;
  const assisted = (attempts[question.id] ?? 0) >= 3 && !correct;

  function review() {
    if (answer === undefined) return;
    const nextReviewed = { ...reviewed, [question.id]: true };
    setReviewed(nextReviewed);
    setAttempts((current) => ({ ...current, [question.id]: (current[question.id] ?? 0) + 1 }));
    if (questions.every((item) => nextReviewed[item.id])) {
      setKeyIdeaUnderstood(questions.every((item) => answers[item.id] === item.preferredIndex));
    }
  }

  return (
    <section className={styles.quickCheck}>
      <div className={styles.checkCount}>
        <span>
          Question {index + 1} of {questions.length}
        </span>
        <StepNavigator
          completed={(step) => Boolean(reviewed[questions[step]!.id])}
          count={questions.length}
          current={index}
          label="Question"
          onSelect={setIndex}
        />
      </div>
      <h3>{question.question}</h3>
      <div className={styles.checkChoices} role="radiogroup" aria-label="Answer choices">
        {question.choices.map((choice, choiceIndex) => (
          <button
            aria-checked={answer === choiceIndex}
            key={choice}
            onClick={() => {
              setAnswers((current) => ({ ...current, [question.id]: choiceIndex }));
              setReviewed((current) => ({ ...current, [question.id]: false }));
            }}
            role="radio"
            type="button"
          >
            {choice}
          </button>
        ))}
      </div>
      {currentReviewed ? (
        <p className={styles.inlineFeedback} role="status">
          <strong>
            {correct
              ? "That keeps the offer inside the request. "
              : "Review the scope of the agreement. "}
          </strong>
          {question.explanation}
          {assisted
            ? ` Suggested answer: ${question.choices[question.preferredIndex]}. Your choice has been kept.`
            : ""}
        </p>
      ) : null}
      <button
        className={`${styles.primaryAction} ${styles.activityAction}`}
        disabled={currentReviewed ? index === questions.length - 1 : answer === undefined}
        onClick={() => (currentReviewed ? setIndex(index + 1) : review())}
        type="button"
      >
        {currentReviewed
          ? index === questions.length - 1
            ? "Answers reviewed"
            : "Next question"
          : "Review answer"}
      </button>
      <div className={styles.miniNavigation}>
        <button disabled={index === 0} onClick={() => setIndex(index - 1)} type="button">
          Previous
        </button>
        <span>
          {index + 1} of {questions.length}
        </span>
      </div>
    </section>
  );
}

function SessionReflection() {
  const { reflection, reflectionSkipped, setReflection, skipReflection, clearReflection } =
    useCaregiverSession();
  return (
    <section className={styles.reflectionCard} data-storage="session-only">
      <label htmlFor="module-3-reflection">{caregiverModule3.reflection.prompt}</label>
      <textarea
        id="module-3-reflection"
        onChange={(event) => {
          const value = event.currentTarget.value;
          setReflection(value);
        }}
        placeholder="For example: I can pick up groceries at six. Would that help?"
        rows={4}
        value={reflection}
      />
      <p>{caregiverModule3.reflection.privacy}</p>
      <div className={styles.reflectionActions}>
        <button disabled={!reflection} onClick={clearReflection} type="button">
          {caregiverModule3.reflection.clear}
        </button>
        {!reflectionSkipped ? (
          <button onClick={skipReflection} type="button">
            {caregiverModule3.reflection.skip}
          </button>
        ) : null}
      </div>
      {reflectionSkipped ? (
        <p role="status">Reflection skipped for this session. You can return and write later.</p>
      ) : null}
    </section>
  );
}

function TakeawayDiagram() {
  const items = [
    { label: "Ask", copy: "Start with the burden they named." },
    { label: "Offer", copy: "Name one action with a clear edge." },
    { label: "Check again", copy: "Let the answer and the arrangement change." },
  ] as const;
  return (
    <ol className={styles.takeawayDiagram} aria-label="Three steps to remember">
      {items.map((item, index) => (
        <li key={item.label}>
          <span>{index + 1}</span>
          <div>
            <strong>{item.label}</strong>
            <small>{item.copy}</small>
          </div>
        </li>
      ))}
    </ol>
  );
}

interface Scene {
  readonly body: ReactNode;
  readonly continueLabel: string;
  readonly id: string;
  readonly moment: string;
  readonly title: string;
  readonly visual: ReactNode;
}

export function Module3Experience() {
  const { progress, markCentralIdeaReached, markTakeawayViewed } = useCaregiverSession();
  const [current, setCurrent] = useState(0);
  const [finished, setFinished] = useState(false);
  const [coreComplete, setCoreComplete] = useState(progress.coreApplicationCompleted);
  const articleRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const completed = isCaregiverModuleComplete(progress);

  useEffect(() => {
    if (current === 4) markCentralIdeaReached();
    if (current === SCENE_COUNT - 1) markTakeawayViewed();
  }, [current, markCentralIdeaReached, markTakeawayViewed]);

  const scenes: readonly Scene[] = [
    {
      id: "dinner-start",
      moment: "Dinner at seven",
      title: "The help changes more than Cam asked for.",
      body: <p>Nia wants to help. Cam is still carrying the practical problem he named.</p>,
      visual: <ScenarioSequence end={3} start={0} />,
      continueLabel: "See what Cam needed",
    },
    {
      id: "named-burden",
      moment: "The request underneath",
      title: "The pharmacy closes before dinner.",
      body: <p>The disagreement is not about who cares more. The offer missed the request.</p>,
      visual: <ScenarioSequence end={6} start={3} />,
      continueLabel: "Keep the meal shared",
    },
    {
      id: "shared-meal",
      moment: "One practical question",
      title: "Ask what would make dinner easier.",
      body: <p>The answer might involve timing, budget, cleanup, transportation, or no change.</p>,
      visual: <MealEaseDiagram />,
      continueLabel: "Plan around the burden",
    },
    {
      id: "plan",
      moment: "Six details",
      title: "Plan the conversation, not the plate.",
      body: <p>Place each detail without choosing food or portions for Cam.</p>,
      visual: <PlanningPractice />,
      continueLabel: "Make the offer specific",
    },
    {
      id: "specific",
      moment: "Less decision work",
      title: "Smaller offers are easier to use.",
      body: <p>A useful offer names an action and leaves the answer open.</p>,
      visual: <OfferComparison />,
      continueLabel: "Browse concrete examples",
    },
    {
      id: "examples",
      moment: "Seven ordinary actions",
      title: "Specific help can stay ordinary.",
      body: <p>It can remove one task without creating a new care role.</p>,
      visual: <SpecificHelpBrowser />,
      continueLabel: "Match offers to requests",
    },
    {
      id: "matching",
      moment: "Core practice",
      title: "The request sets the edge.",
      body: <p>Choose the offer that answers each request without adding access or authority.</p>,
      visual: <RequestMatching onComplete={() => setCoreComplete(true)} />,
      continueLabel: coreComplete ? "Let support change" : "Continue, then return if needed",
    },
    {
      id: "changes",
      moment: "Preferences move",
      title: "Useful now is not useful forever.",
      body: <p>Checking whether help still fits is different from checking up on someone.</p>,
      visual: <SupportChangesDiagram />,
      continueLabel: "Build a current support menu",
    },
    {
      id: "menu",
      moment: "Six current answers",
      title: "Let the stated preference lead.",
      body: <p>The most medical-looking action is not automatically the most useful one.</p>,
      visual: <SupportMenu />,
      continueLabel: "Notice when routine becomes checking",
    },
    {
      id: "routine",
      moment: "Same object, different action",
      title: "Organization can become monitoring.",
      body: <p>Permission, private information, and purpose change the meaning.</p>,
      visual: <RoutineComparison />,
      continueLabel: "Preserve ordinary life",
    },
    {
      id: "ordinary-life",
      moment: "Health is not every moment",
      title: "Keep some time ordinary.",
      body: <p>Continue invitations that are not built around health.</p>,
      visual: <OrdinaryLifeDiagram />,
      continueLabel: "Make household changes shared",
    },
    {
      id: "shared-change",
      moment: "A common misunderstanding",
      title: "A shared space still needs shared decisions.",
      body: <p>A well-meant household change can remove choice when nobody asks first.</p>,
      visual: <SharedChangeComparison />,
      continueLabel: "Borrow useful language",
    },
    {
      id: "phrases",
      moment: "Eight sentences",
      title: "Use the sentence that fits.",
      body: <p>You do not need to memorize the wording. Keep the action and the choice clear.</p>,
      visual: <PhraseBrowser />,
      continueLabel: "Check your understanding",
    },
    {
      id: "check",
      moment: "Three short situations",
      title: "Keep the offer inside the request.",
      body: <p>Choose the response that protects privacy and current preference.</p>,
      visual: <QuickCheck />,
      continueLabel: "Write one optional offer",
    },
    {
      id: "reflection",
      moment: "Optional reflection",
      title: "Make one ordinary offer specific.",
      body: <p>This stays in the current session and is not required to finish.</p>,
      visual: <SessionReflection />,
      continueLabel: "See the takeaway",
    },
    {
      id: "takeaway",
      moment: "Make help smaller",
      title: "Ask. Offer. Let it change.",
      body: <p>Practical support works best when it answers a real request.</p>,
      visual: <TakeawayDiagram />,
      continueLabel: "Finish module",
    },
  ];

  const scene = scenes[current]!;

  function goTo(next: number) {
    if (next < 0 || next >= SCENE_COUNT) return;
    setCurrent(next);
    window.requestAnimationFrame(() => {
      articleRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
      headingRef.current?.focus({ preventScroll: true });
    });
  }

  function finish() {
    markTakeawayViewed();
    setFinished(true);
    window.requestAnimationFrame(() => {
      articleRef.current?.scrollIntoView({
        behavior: shouldReduceMotion() ? "auto" : "smooth",
        block: "start",
      });
      headingRef.current?.focus({ preventScroll: true });
    });
  }

  function restart() {
    setCurrent(0);
    setFinished(false);
    window.requestAnimationFrame(() => {
      articleRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
      headingRef.current?.focus({ preventScroll: true });
    });
  }

  function reviewPractice() {
    setCurrent(6);
    setFinished(false);
    window.requestAnimationFrame(() => {
      articleRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
      headingRef.current?.focus({ preventScroll: true });
    });
  }

  return (
    <main
      className={`${styles.page} ${styles.moduleThree}`}
      data-caregiver-module={caregiverModule3.id}
      data-rendering-mode="deterministic"
    >
      <Link className={styles.backLink} href="/caregiver">
        <ArrowLeft aria-hidden="true" size={17} /> Caregiver modules
      </Link>
      {finished ? (
        <article className={styles.completion} ref={articleRef}>
          <p>Caregiver module 3</p>
          <h1 ref={headingRef} tabIndex={-1}>
            {completed ? "Finished" : "One step remains"}
          </h1>
          <p>Useful help answers a real request and leaves ordinary life visible.</p>
          <div className={styles.completionTakeaway}>
            <span>In short</span>
            <strong>
              Ask what would reduce work, offer one action, and let the answer change.
            </strong>
          </div>
          {!completed ? (
            <div className={styles.incompleteNote} role="status">
              <strong>One practice is still open.</strong>
              <p>Review all four request matches to complete this module.</p>
              <button onClick={reviewPractice} type="button">
                Review request matching
              </button>
            </div>
          ) : null}
          <div className={styles.completionActions}>
            <Link
              className={completed ? styles.primaryAction : styles.secondaryAction}
              href={caregiverModuleRegistry["when-something-feels-wrong"].route}
            >
              Continue to module 4
            </Link>
            <button className={styles.secondaryAction} onClick={restart} type="button">
              <RotateCcw aria-hidden="true" size={16} /> Review again
            </button>
            <Link className={styles.secondaryAction} href="/caregiver">
              Back to caregiver modules
            </Link>
          </div>
          <p className={styles.disclosure}>
            Nia and Cam are illustrative characters. This module supports everyday communication and
            practical support; it does not replace individualized medical guidance.
          </p>
        </article>
      ) : (
        <article className={styles.reader} ref={articleRef}>
          <ModuleProgressHeader current={current} />
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
          <nav aria-label="Module navigation" className={styles.navigation}>
            {current > 0 ? (
              <button className={styles.previous} onClick={() => goTo(current - 1)} type="button">
                <ChevronLeft aria-hidden="true" size={18} /> Back
              </button>
            ) : (
              <span />
            )}
            {current === SCENE_COUNT - 1 ? (
              <button className={styles.next} onClick={finish} type="button">
                {scene.continueLabel} <ArrowRight aria-hidden="true" size={18} />
              </button>
            ) : (
              <button className={styles.next} onClick={() => goTo(current + 1)} type="button">
                {scene.continueLabel} <ArrowRight aria-hidden="true" size={18} />
              </button>
            )}
          </nav>
        </article>
      )}
    </main>
  );
}
