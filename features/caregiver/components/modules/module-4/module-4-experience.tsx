"use client";

import { ArrowLeft, ArrowRight, ChevronLeft, Clock3, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { caregiverModule4 } from "../../../content/caregiver-module-4";
import { caregiverModuleRegistry } from "../../../content/caregiver-module-registry";
import { orderCaregiverChoices } from "../../../lib/caregiver-choice-order";
import { isCaregiverModuleComplete } from "../../../lib/caregiver-completion";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-1-story.module.css";

const SCENE_COUNT = 18;

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
        <span>Caregiver module 4</span>
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
  const lines = caregiverModule4.sections.scenario.paragraphs.slice(start, end);
  const [index, setIndex] = useState(0);
  return (
    <section className={styles.phraseBrowser} aria-label="The unfinished errand">
      <div className={styles.phraseCard}>
        <span>
          Moment {index + 1} of {lines.length}
        </span>
        <h3>{index === 0 ? caregiverModule4.sections.scenario.title : "What happens next"}</h3>
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

const observationViews = [
  {
    label: "Report",
    title: "Describe the change",
    points: ["What changed", "When it began", "What the person can say", "What they asked for"],
  },
  {
    label: "Do not name",
    title: "Leave the cause open",
    points: ["No diagnosis", "No reading interpretation", "No judgment", "No guessed treatment"],
  },
] as const;

function ObservationLens() {
  const [index, setIndex] = useState(0);
  const view = observationViews[index]!;
  return (
    <section className={styles.knownUnknown}>
      <div className={styles.switchTabs} role="tablist" aria-label="Observation and diagnosis">
        {observationViews.map((item, itemIndex) => (
          <button
            aria-selected={index === itemIndex}
            key={item.label}
            onClick={() => setIndex(itemIndex)}
            role="tab"
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className={styles.knownPanel} role="tabpanel">
        <h3>{view.title}</h3>
        <ul>
          {view.points.map((point, pointIndex) => (
            <li key={point}>
              <span>{pointIndex + 1}</span>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

type ContextChoice = (typeof caregiverModule4.interactions.context.choices)[number];

function ContextOrganizer() {
  const interaction = caregiverModule4.interactions.context;
  const { markInteractionSubmitted } = useCaregiverSession();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const choice: ContextChoice = interaction.choices[index]!;
  const answer = answers[choice.id];
  const currentReviewed = Boolean(reviewed[choice.id]);
  const correct = answer === choice.preferred;
  const assisted = (attempts[choice.id] ?? 0) >= 3 && !correct;
  const orderedAnswers = orderCaregiverChoices(
    [
      { label: "Include", value: true },
      { label: "Leave out", value: false },
    ] as const,
    "module-4-context",
    index,
    choice.preferred ? 0 : 1,
  );
  const summary = interaction.choices
    .filter((item) => item.preferred && reviewed[item.id] && answers[item.id])
    .map((item) => item.copy);

  function review() {
    if (answer === undefined) return;
    const nextReviewed = { ...reviewed, [choice.id]: true };
    setReviewed(nextReviewed);
    setAttempts((current) => ({ ...current, [choice.id]: (current[choice.id] ?? 0) + 1 }));
    if (interaction.choices.every((item) => nextReviewed[item.id]))
      markInteractionSubmitted(interaction.id);
  }

  const feedback =
    choice.id === "diagnosis" || choice.id === "sat-cause"
      ? interaction.feedback.diagnosis
      : choice.id === "judgment"
        ? interaction.feedback.judgment
        : interaction.feedback.preferred;

  return (
    <section
      className={styles.sorter}
      data-core-application="false"
      data-interaction-id={interaction.id}
      data-optional-practice="true"
    >
      <div className={styles.sorterTop}>
        <span>
          Statement {index + 1} of {interaction.choices.length}
        </span>
        <StepNavigator
          completed={(step) => Boolean(reviewed[interaction.choices[step]!.id])}
          count={interaction.choices.length}
          current={index}
          label="Statement"
          onSelect={setIndex}
        />
      </div>
      <h3>{choice.copy}</h3>
      <div
        className={styles.compactChoices}
        role="radiogroup"
        aria-label="Use in the factual summary"
      >
        {orderedAnswers.map(({ value: option }) => (
          <button
            aria-checked={answer === option.value}
            data-result={
              currentReviewed && answer === option.value
                ? correct
                  ? "correct"
                  : "incorrect"
                : undefined
            }
            key={option.label}
            onClick={() => {
              setAnswers((current) => ({ ...current, [choice.id]: option.value }));
              setReviewed((current) => ({ ...current, [choice.id]: false }));
            }}
            role="radio"
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
      {currentReviewed ? (
        <p
          className={styles.inlineFeedback}
          data-result={correct ? "correct" : "incorrect"}
          role="status"
        >
          <strong>{correct ? "Correct." : "Incorrect."}</strong>
          {feedback}
          {assisted
            ? ` Suggested choice: ${choice.preferred ? "Include" : "Leave out"}. Your choice has been kept.`
            : ""}
        </p>
      ) : null}
      {summary.length ? (
        <div className={styles.builtReply}>
          <span>Factual summary</span>
          <p>{summary.join(". ")}.</p>
        </div>
      ) : null}
      <button
        className={`${styles.primaryAction} ${styles.activityAction}`}
        disabled={currentReviewed ? index === interaction.choices.length - 1 : answer === undefined}
        onClick={() => (currentReviewed ? setIndex(index + 1) : review())}
        type="button"
      >
        {currentReviewed
          ? index === interaction.choices.length - 1
            ? "Summary reviewed"
            : "Next statement"
          : "Review statement"}
      </button>
      <div className={styles.miniNavigation}>
        <button disabled={index === 0} onClick={() => setIndex(index - 1)} type="button">
          Previous
        </button>
        <span>
          {index + 1} of {interaction.choices.length}
        </span>
      </div>
    </section>
  );
}

const layerDetails = [
  {
    title: "General education",
    copy: "Explains the framework. It does not decide what an individual should do.",
  },
  {
    title: "Their clinician-created plan",
    copy: "Contains individualized instructions and the supporter role they agreed to.",
  },
  {
    title: "Professional or emergency help",
    copy: "Brings qualified human judgment when the situation is concerning, unclear, or urgent.",
  },
] as const;

function GuidanceLayers() {
  const [index, setIndex] = useState(0);
  const layer = layerDetails[index]!;
  return (
    <section className={styles.modePicker}>
      <div className={styles.modeButtons} role="tablist" aria-label="Three guidance layers">
        {layerDetails.map((item, itemIndex) => (
          <button
            aria-selected={index === itemIndex}
            key={item.title}
            onClick={() => setIndex(itemIndex)}
            role="tab"
            type="button"
          >
            {itemIndex + 1}. {item.title}
          </button>
        ))}
      </div>
      <div className={styles.modePanel} role="tabpanel">
        <h3>{layer.title}</h3>
        <p>{layer.copy}</p>
      </div>
    </section>
  );
}

const planDetails = [
  { label: "Known signs", copy: "What the person and clinician already identified." },
  { label: "Supporter role", copy: "What the person wants a supporter to do." },
  { label: "Instructions", copy: "Where current individualized guidance is kept." },
  { label: "Contact", copy: "Whom the plan says to contact and when." },
] as const;

function PlanDetails() {
  const [index, setIndex] = useState(0);
  const item = planDetails[index]!;
  return (
    <section className={styles.thoughtPath}>
      <div className={styles.pathButtons} role="tablist" aria-label="What a plan may contain">
        {planDetails.map((entry, itemIndex) => (
          <button
            aria-selected={index === itemIndex}
            key={entry.label}
            onClick={() => setIndex(itemIndex)}
            role="tab"
            type="button"
          >
            <span>{itemIndex + 1}</span>
            {entry.label}
          </button>
        ))}
      </div>
      <div className={styles.thoughtPanel} role="tabpanel">
        <span>Individualized layer</span>
        <h3>{item.label}</h3>
        <p>{item.copy}</p>
      </div>
    </section>
  );
}

type SourceNeed = (typeof caregiverModule4.interactions.sources.needs)[number];

function SourceMatching({ onComplete }: { readonly onComplete: () => void }) {
  const interaction = caregiverModule4.interactions.sources;
  const { markInteractionSubmitted } = useCaregiverSession();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const need: SourceNeed = interaction.needs[index]!;
  const answer = answers[need.id];
  const currentReviewed = Boolean(reviewed[need.id]);
  const correct = answer === need.preferred;
  const assisted = (attempts[need.id] ?? 0) >= 3 && !correct;
  const orderedLayers = orderCaregiverChoices(
    interaction.layers,
    "module-4-source-matching",
    index,
    need.preferred,
  );

  function review() {
    if (answer === undefined) return;
    const nextReviewed = { ...reviewed, [need.id]: true };
    setReviewed(nextReviewed);
    setAttempts((current) => ({ ...current, [need.id]: (current[need.id] ?? 0) + 1 }));
    if (interaction.needs.every((item) => nextReviewed[item.id])) {
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
          Need {index + 1} of {interaction.needs.length}
        </span>
        <StepNavigator
          completed={(step) => Boolean(reviewed[interaction.needs[step]!.id])}
          count={interaction.needs.length}
          current={index}
          label="Need"
          onSelect={setIndex}
        />
      </div>
      <h3>{need.copy}</h3>
      <div className={styles.compactChoices} role="radiogroup" aria-label="Guidance source">
        {orderedLayers.map(({ originalIndex: layerIndex, value: layer }) => (
          <button
            aria-checked={answer === layerIndex}
            data-result={
              currentReviewed && answer === layerIndex
                ? correct
                  ? "correct"
                  : "incorrect"
                : undefined
            }
            key={layer}
            onClick={() => {
              setAnswers((current) => ({ ...current, [need.id]: layerIndex }));
              setReviewed((current) => ({ ...current, [need.id]: false }));
            }}
            role="radio"
            type="button"
          >
            <span>Source {layerIndex + 1}</span>
            {layer}
          </button>
        ))}
      </div>
      {currentReviewed ? (
        <p
          className={styles.inlineFeedback}
          data-result={correct ? "correct" : "incorrect"}
          role="status"
        >
          <strong>{correct ? "Correct." : "Incorrect."}</strong>
          {interaction.feedback[need.kind]}
          {assisted
            ? ` Suggested source: ${interaction.layers[need.preferred]}. Your choice has been kept.`
            : ""}
        </p>
      ) : null}
      <button
        className={`${styles.primaryAction} ${styles.activityAction}`}
        disabled={currentReviewed ? index === interaction.needs.length - 1 : answer === undefined}
        onClick={() => (currentReviewed ? setIndex(index + 1) : review())}
        type="button"
      >
        {currentReviewed
          ? index === interaction.needs.length - 1
            ? "Sources reviewed"
            : "Next need"
          : "Review source"}
      </button>
      <div className={styles.miniNavigation}>
        <button disabled={index === 0} onClick={() => setIndex(index - 1)} type="button">
          Previous
        </button>
        <span>
          {index + 1} of {interaction.needs.length}
        </span>
      </div>
    </section>
  );
}

function UrgentDirection() {
  const steps = [
    {
      label: "Notice direction",
      copy: "If urgent or emergency help is needed, follow that direction.",
    },
    {
      label: "Get human help",
      copy: "Contact the appropriate emergency service without waiting on this module.",
    },
    {
      label: "Do not delay",
      copy: "Do not wait for another reading, a search, or complete details.",
    },
  ] as const;
  return (
    <ol
      className={styles.takeawayDiagram}
      data-interaction-id={caregiverModule4.interactions.urgent.id}
      aria-label="Urgent direction"
    >
      {steps.map((step, index) => (
        <li key={step.label}>
          <span>{index + 1}</span>
          <div>
            <strong>{step.label}</strong>
            <small>{step.copy}</small>
          </div>
        </li>
      ))}
    </ol>
  );
}

const readingViews = [
  {
    label: "This app cannot",
    title: "Interpret a personal reading",
    copy: "One number does not provide enough individual context to determine safety or treatment.",
  },
  {
    label: "Use instead",
    title: "The plan or qualified human help",
    copy: "Use the person's current plan, current device instructions, or appropriate professional help.",
  },
] as const;

function ReadingBoundary() {
  const [index, setIndex] = useState(0);
  const view = readingViews[index]!;
  return (
    <section className={styles.knownUnknown}>
      <div className={styles.switchTabs} role="tablist" aria-label="Reading boundary">
        {readingViews.map((item, itemIndex) => (
          <button
            aria-selected={index === itemIndex}
            key={item.label}
            onClick={() => setIndex(itemIndex)}
            role="tab"
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className={styles.knownPanel} role="tabpanel">
        <h3>{view.title}</h3>
        <p>{view.copy}</p>
      </div>
    </section>
  );
}

function HandoffBrowser() {
  const items = caregiverModule4.sections.handoff.items;
  const [index, setIndex] = useState(0);
  return (
    <section className={styles.phraseBrowser} aria-label="Professional handoff details">
      <div className={styles.phraseCard}>
        <span>Detail {index + 1}</span>
        <h3>{items[index]}</h3>
      </div>
      <div className={styles.phraseControls}>
        <button disabled={index === 0} onClick={() => setIndex(index - 1)} type="button">
          Previous
        </button>
        <span>
          {index + 1} of {items.length}
        </span>
        <button
          disabled={index === items.length - 1}
          onClick={() => setIndex(index + 1)}
          type="button"
        >
          Next
        </button>
      </div>
    </section>
  );
}

type HandoffItem = (typeof caregiverModule4.interactions.handoff.items)[number];

function HandoffPractice() {
  const interaction = caregiverModule4.interactions.handoff;
  const { markInteractionSubmitted } = useCaregiverSession();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const item: HandoffItem = interaction.items[index]!;
  const answer = answers[item.id];
  const currentReviewed = Boolean(reviewed[item.id]);
  const correct = answer === item.include;
  const assisted = (attempts[item.id] ?? 0) >= 3 && !correct;
  const orderedAnswers = orderCaregiverChoices(
    [
      { label: "Include in opening", value: true },
      { label: "Leave out", value: false },
    ] as const,
    "module-4-handoff",
    index,
    item.include ? 0 : 1,
  );
  const opening = interaction.items
    .filter((entry) => entry.include && reviewed[entry.id] && answers[entry.id])
    .map((entry) => entry.copy);

  function review() {
    if (answer === undefined) return;
    const nextReviewed = { ...reviewed, [item.id]: true };
    setReviewed(nextReviewed);
    setAttempts((current) => ({ ...current, [item.id]: (current[item.id] ?? 0) + 1 }));
    if (interaction.items.every((entry) => nextReviewed[entry.id]))
      markInteractionSubmitted(interaction.id);
  }

  const feedback =
    item.id === "history"
      ? interaction.feedback.history
      : item.id === "cause"
        ? interaction.feedback.cause
        : item.id === "search"
          ? interaction.feedback.search
          : interaction.feedback.preferred;
  return (
    <section
      className={styles.sorter}
      data-core-application="false"
      data-interaction-id={interaction.id}
      data-optional-practice="true"
    >
      <div className={styles.sorterTop}>
        <span>
          Line {index + 1} of {interaction.items.length}
        </span>
        <StepNavigator
          completed={(step) => Boolean(reviewed[interaction.items[step]!.id])}
          count={interaction.items.length}
          current={index}
          label="Call line"
          onSelect={setIndex}
        />
      </div>
      <h3>{item.copy}</h3>
      <div className={styles.compactChoices} role="radiogroup" aria-label="Use in the opening">
        {orderedAnswers.map(({ value: option }) => (
          <button
            aria-checked={answer === option.value}
            data-result={
              currentReviewed && answer === option.value
                ? correct
                  ? "correct"
                  : "incorrect"
                : undefined
            }
            key={option.label}
            onClick={() => {
              setAnswers((current) => ({ ...current, [item.id]: option.value }));
              setReviewed((current) => ({ ...current, [item.id]: false }));
            }}
            role="radio"
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
      {currentReviewed ? (
        <p
          className={styles.inlineFeedback}
          data-result={correct ? "correct" : "incorrect"}
          role="status"
        >
          <strong>{correct ? "Correct." : "Incorrect."}</strong>
          {feedback}
          {assisted
            ? ` Suggested choice: ${item.include ? "Include in opening" : "Leave out"}. Your choice has been kept.`
            : ""}
        </p>
      ) : null}
      {opening.length ? (
        <div className={styles.builtReply}>
          <span>Call starts</span>
          <p>{opening.join(". ")}.</p>
        </div>
      ) : null}
      <button
        className={`${styles.primaryAction} ${styles.activityAction}`}
        disabled={currentReviewed ? index === interaction.items.length - 1 : answer === undefined}
        onClick={() => (currentReviewed ? setIndex(index + 1) : review())}
        type="button"
      >
        {currentReviewed
          ? index === interaction.items.length - 1
            ? "Handoff reviewed"
            : "Next line"
          : "Review line"}
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

const authorityViews = [
  {
    label: "Do not invent",
    title: "A supporter does not create treatment",
    copy: "Do not change medication, guess with food or drink, use exercise to correct a reading, or operate an unfamiliar device.",
  },
  {
    label: "Use the next layer",
    title: "Follow existing, current guidance",
    copy: "Use the person's reviewed plan, current product instructions, trained response, and appropriate professional or emergency help.",
  },
] as const;

function AuthorityBoundary() {
  const [index, setIndex] = useState(0);
  const view = authorityViews[index]!;
  return (
    <section className={styles.modePicker}>
      <div className={styles.switchTabs} role="tablist" aria-label="Treatment authority">
        {authorityViews.map((item, itemIndex) => (
          <button
            aria-selected={index === itemIndex}
            key={item.label}
            onClick={() => setIndex(itemIndex)}
            role="tab"
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className={styles.modePanel} role="tabpanel">
        <h3>{view.title}</h3>
        <p>{view.copy}</p>
      </div>
    </section>
  );
}

type ImprovisationAction = (typeof caregiverModule4.interactions.improvisation.actions)[number];

function ImprovisationPractice() {
  const interaction = caregiverModule4.interactions.improvisation;
  const { markInteractionSubmitted } = useCaregiverSession();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const action: ImprovisationAction = interaction.actions[index]!;
  const answer = answers[action.id];
  const currentReviewed = Boolean(reviewed[action.id]);
  const correct = answer === action.unsafe;
  const assisted = (attempts[action.id] ?? 0) >= 3 && !correct;
  const orderedAnswers = orderCaregiverChoices(
    [
      { label: "Do not invent this", value: true },
      { label: "Appropriate next layer", value: false },
    ] as const,
    "module-4-improvisation",
    index,
    action.unsafe ? 0 : 1,
  );

  function review() {
    if (answer === undefined) return;
    const nextReviewed = { ...reviewed, [action.id]: true };
    setReviewed(nextReviewed);
    setAttempts((current) => ({ ...current, [action.id]: (current[action.id] ?? 0) + 1 }));
    if (interaction.actions.every((item) => nextReviewed[item.id]))
      markInteractionSubmitted(interaction.id);
  }

  return (
    <section
      className={styles.sorter}
      data-core-application="false"
      data-interaction-id={interaction.id}
      data-optional-practice="true"
    >
      <div className={styles.sorterTop}>
        <span>
          Action {index + 1} of {interaction.actions.length}
        </span>
        <StepNavigator
          completed={(step) => Boolean(reviewed[interaction.actions[step]!.id])}
          count={interaction.actions.length}
          current={index}
          label="Action"
          onSelect={setIndex}
        />
      </div>
      <h3>{action.copy}</h3>
      <div className={styles.compactChoices} role="radiogroup" aria-label="Classify the action">
        {orderedAnswers.map(({ value: option }) => (
          <button
            aria-checked={answer === option.value}
            data-result={
              currentReviewed && answer === option.value
                ? correct
                  ? "correct"
                  : "incorrect"
                : undefined
            }
            key={option.label}
            onClick={() => {
              setAnswers((current) => ({ ...current, [action.id]: option.value }));
              setReviewed((current) => ({ ...current, [action.id]: false }));
            }}
            role="radio"
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
      {currentReviewed ? (
        <p
          className={styles.inlineFeedback}
          data-result={correct ? "correct" : "incorrect"}
          role="status"
        >
          <strong>{correct ? "Correct." : "Incorrect."}</strong>
          {action.feedback}
          {assisted
            ? ` Suggested choice: ${action.unsafe ? "Do not invent this" : "Appropriate next layer"}. Your choice has been kept.`
            : ""}
        </p>
      ) : null}
      <button
        className={`${styles.primaryAction} ${styles.activityAction}`}
        disabled={currentReviewed ? index === interaction.actions.length - 1 : answer === undefined}
        onClick={() => (currentReviewed ? setIndex(index + 1) : review())}
        type="button"
      >
        {currentReviewed
          ? index === interaction.actions.length - 1
            ? "Actions reviewed"
            : "Next action"
          : "Review action"}
      </button>
      <div className={styles.miniNavigation}>
        <button disabled={index === 0} onClick={() => setIndex(index - 1)} type="button">
          Previous
        </button>
        <span>
          {index + 1} of {interaction.actions.length}
        </span>
      </div>
    </section>
  );
}

const delaySteps = [
  { label: "One more reading", copy: "A new number still needs individual context." },
  { label: "One more search", copy: "General information still cannot decide what is safe." },
  { label: "One more check", copy: "Repeated checking can preserve uncertainty and delay help." },
] as const;

function DelayDiagram() {
  const [index, setIndex] = useState(0);
  const step = delaySteps[index]!;
  return (
    <section className={styles.timing}>
      <div
        className={styles.timelineTabs}
        role="tablist"
        aria-label="How checking can become delay"
      >
        {delaySteps.map((item, itemIndex) => (
          <button
            aria-selected={index === itemIndex}
            key={item.label}
            onClick={() => setIndex(itemIndex)}
            role="tab"
            type="button"
          >
            <span>{itemIndex + 1}</span>
            {item.label}
          </button>
        ))}
      </div>
      <div className={styles.timingPanel} role="tabpanel">
        <h3>{step.label}</h3>
        <p>{step.copy}</p>
      </div>
    </section>
  );
}

function PhraseBrowser() {
  const scripts = caregiverModule4.scripts;
  const [index, setIndex] = useState(0);
  const phrase = scripts[index]!;
  return (
    <section className={styles.phraseBrowser} aria-label="Useful phrases">
      <div className={styles.phraseCard}>
        <span>{phrase[0]}</span>
        <h3>{phrase[1]}</h3>
      </div>
      <div className={styles.phraseControls}>
        <button disabled={index === 0} onClick={() => setIndex(index - 1)} type="button">
          Previous
        </button>
        <span>
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
  const questions = caregiverModule4.questions;
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
  const orderedChoices = orderCaregiverChoices(
    question.choices,
    "module-4-quick-check",
    index,
    question.preferredIndex,
  );

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
        {orderedChoices.map(({ originalIndex: choiceIndex, value: choice }) => (
          <button
            aria-checked={answer === choiceIndex}
            data-result={
              currentReviewed && answer === choiceIndex
                ? correct
                  ? "correct"
                  : "incorrect"
                : undefined
            }
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
        <p
          className={styles.inlineFeedback}
          data-result={correct ? "correct" : "incorrect"}
          role="status"
        >
          <strong>{correct ? "Correct." : "Incorrect."}</strong>
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
    <section
      className={styles.reflectionCard}
      data-reflection-id={caregiverModule4.reflection.id}
      data-storage="session-only"
    >
      <label htmlFor="module-4-reflection">{caregiverModule4.reflection.prompt}</label>
      <textarea
        id="module-4-reflection"
        onChange={(event) => {
          const value = event.currentTarget.value;
          setReflection(value);
        }}
        placeholder="For example: ask where the existing plan is kept."
        rows={4}
        value={reflection}
      />
      <p>{caregiverModule4.reflection.privacy}</p>
      <div className={styles.reflectionActions}>
        <button disabled={!reflection} onClick={clearReflection} type="button">
          {caregiverModule4.reflection.clear}
        </button>
        {!reflectionSkipped ? (
          <button onClick={skipReflection} type="button">
            {caregiverModule4.reflection.skip}
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
    { label: "Notice", copy: "Report the concrete change and timing." },
    { label: "Use the plan", copy: "Follow the individualized layer already created." },
    {
      label: "Reach human help",
      copy: "Do not diagnose, improvise treatment, or delay urgent help.",
    },
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

export function Module4Experience() {
  const { progress, markCentralIdeaReached, markTakeawayViewed } = useCaregiverSession();
  const [current, setCurrent] = useState(0);
  const [finished, setFinished] = useState(false);
  const [coreComplete, setCoreComplete] = useState(progress.coreApplicationCompleted);
  const articleRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const completed = isCaregiverModuleComplete(progress);

  useEffect(() => {
    if (current === 2) markCentralIdeaReached();
    if (current === SCENE_COUNT - 1) markTakeawayViewed();
  }, [current, markCentralIdeaReached, markTakeawayViewed]);

  const scenes: readonly Scene[] = [
    {
      id: "stairs",
      moment: "The unfinished errand",
      title: "Something changes on the stairs.",
      body: <p>Omar notices the change before he knows what it means.</p>,
      visual: <ScenarioSequence end={3} start={0} />,
      continueLabel: "See what Omar does next",
    },
    {
      id: "uncertainty",
      moment: "The urge to solve it",
      title: "Uncertainty is not permission to guess.",
      body: <p>The module does not diagnose Celeste or decide that the situation is safe.</p>,
      visual: <ScenarioSequence end={5} start={3} />,
      continueLabel: "Separate observation from diagnosis",
    },
    {
      id: "notice",
      moment: "Facts before conclusions",
      title: "Report what changed, not what caused it.",
      body: <p>Concrete observations help without pretending to know the diagnosis.</p>,
      visual: <ObservationLens />,
      continueLabel: "Practice a factual summary",
    },
    {
      id: "context",
      moment: "Seven statements",
      title: "Build the summary one fact at a time.",
      body: <p>Include observable change, timing, and Celeste’s own words.</p>,
      visual: <ContextOrganizer />,
      continueLabel: "Find the right guidance layer",
    },
    {
      id: "layers",
      moment: "Three different sources",
      title: "Authority changes with the question.",
      body: <p>Education, an individualized plan, and human help do different jobs.</p>,
      visual: <GuidanceLayers />,
      continueLabel: "Look inside the person's plan",
    },
    {
      id: "plan",
      moment: "Individual guidance already exists",
      title: "The person's plan is the individualized layer.",
      body: (
        <p>
          It is not the same as an article, another person’s plan, or a supporter-created checklist.
        </p>
      ),
      visual: <PlanDetails />,
      continueLabel: "Match each need to its source",
    },
    {
      id: "source-match",
      moment: "Core practice",
      title: "Use the source with the right authority.",
      body: <p>Choose where each answer belongs without collecting extra information.</p>,
      visual: <SourceMatching onComplete={() => setCoreComplete(true)} />,
      continueLabel: coreComplete
        ? "See when learning must stop"
        : "Continue, then return if needed",
    },
    {
      id: "urgent",
      moment: "Urgent direction",
      title: "Emergency help interrupts education.",
      body: <p>Do not delay urgent or emergency help to finish a screen or gather every detail.</p>,
      visual: <UrgentDirection />,
      continueLabel: "Keep readings in their proper place",
    },
    {
      id: "reading",
      moment: "One number is not a verdict",
      title: "This app does not interpret personal readings.",
      body: <p>Personal readings require individual context and the right source of guidance.</p>,
      visual: <ReadingBoundary />,
      continueLabel: "Prepare a concise handoff",
    },
    {
      id: "handoff-details",
      moment: "Enough to begin",
      title: "A useful handoff can be short.",
      body: (
        <p>
          Organize what is available, then contact the appropriate professional without waiting for
          perfection.
        </p>
      ),
      visual: <HandoffBrowser />,
      continueLabel: "Build the first 20 seconds",
    },
    {
      id: "handoff-practice",
      moment: "Six possible lines",
      title: "Open with facts, not theories.",
      body: <p>Choose what belongs at the beginning of Omar’s call.</p>,
      visual: <HandoffPractice />,
      continueLabel: "Keep treatment authority clear",
    },
    {
      id: "authority",
      moment: "Authority matters",
      title: "Not improvising is an active safety choice.",
      body: (
        <p>
          A supporter can act without inventing medication, food, exercise, or device instructions.
        </p>
      ),
      visual: <AuthorityBoundary />,
      continueLabel: "Practice the boundary",
    },
    {
      id: "improvisation",
      moment: "Six actions",
      title: "Do not create treatment from this module.",
      body: (
        <p>Classify each action by whether it belongs to a supporter or the next guidance layer.</p>
      ),
      visual: <ImprovisationPractice />,
      continueLabel: "Notice when checking becomes delay",
    },
    {
      id: "delay",
      moment: "One more check",
      title: "More information can still leave you uncertain.",
      body: <p>Repeated checking does not turn this application into a triage tool.</p>,
      visual: <DelayDiagram />,
      continueLabel: "Borrow useful language",
    },
    {
      id: "phrases",
      moment: "Seven sentences",
      title: "Use language that moves to the next layer.",
      body: <p>Report the change, locate the plan, or name the need for qualified human help.</p>,
      visual: <PhraseBrowser />,
      continueLabel: "Check your understanding",
    },
    {
      id: "check",
      moment: "Three short situations",
      title: "Choose the next safe layer.",
      body: <p>This review teaches the boundary and does not determine completion.</p>,
      visual: <QuickCheck />,
      continueLabel: "Make one optional preparation note",
    },
    {
      id: "reflection",
      moment: "Optional reflection",
      title: "Prepare later without recording medical details.",
      body: (
        <p>
          Keep symptoms, readings, medicines, names, and emergency information out of this field.
        </p>
      ),
      visual: <SessionReflection />,
      continueLabel: "See the takeaway",
    },
    {
      id: "takeaway",
      moment: "Know the next layer",
      title: "Notice. Use the plan. Reach human help.",
      body: <p>Health Decoded cannot determine whether an individual situation is safe.</p>,
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
      className={`${styles.page} ${styles.moduleFour}`}
      data-caregiver-module={caregiverModule4.id}
      data-rendering-mode="deterministic"
    >
      <Link className={styles.backLink} href="/caregiver">
        <ArrowLeft aria-hidden="true" size={17} /> Caregiver modules
      </Link>
      {finished ? (
        <article className={styles.completion} ref={articleRef}>
          <p>Caregiver module 4</p>
          <h1 ref={headingRef} tabIndex={-1}>
            {completed ? "Finished" : "One step remains"}
          </h1>
          <p>
            Safe support uses the right layer instead of asking a supporter or an app to diagnose.
          </p>
          <div className={styles.completionTakeaway}>
            <span>In short</span>
            <strong>
              Notice the change, use the person’s plan, and reach appropriate human help.
            </strong>
          </div>
          {!completed ? (
            <div className={styles.incompleteNote} role="status">
              <strong>One practice is still open.</strong>
              <p>Review all five source matches to complete this module.</p>
              <button onClick={reviewPractice} type="button">
                Review source matching
              </button>
            </div>
          ) : null}
          <div className={styles.completionActions}>
            <Link
              className={completed ? styles.primaryAction : styles.secondaryAction}
              href={caregiverModuleRegistry["the-caregiver-matters-too"].route}
            >
              Continue to module 5
            </Link>
            <button className={styles.secondaryAction} onClick={restart} type="button">
              <RotateCcw aria-hidden="true" size={16} /> Review again
            </button>
            <Link className={styles.secondaryAction} href="/caregiver">
              Back to caregiver modules
            </Link>
          </div>
          <p className={styles.disclosure}>
            Omar and Celeste are illustrative characters. This module cannot diagnose symptoms,
            interpret a personal reading, choose a service for an individual situation, or replace a
            clinician-created plan or qualified human help.
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
