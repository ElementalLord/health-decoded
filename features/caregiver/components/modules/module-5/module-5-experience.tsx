"use client";

import { ArrowLeft, ArrowRight, ChevronLeft, Clock3, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { caregiverModule5 } from "../../../content/caregiver-module-5";
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
        <span>Caregiver module 5</span>
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
  const lines = caregiverModule5.sections.scenario.paragraphs.slice(start, end);
  const [index, setIndex] = useState(0);
  return (
    <section className={styles.phraseBrowser} aria-label="The 6:10 call">
      <div className={styles.phraseCard}>
        <span>
          Moment {index + 1} of {lines.length}
        </span>
        <h3>{index === 0 ? caregiverModule5.sections.scenario.title : "What happens next"}</h3>
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

function ResponsibilityLanes() {
  const groups = caregiverModule5.sections.responsibility.groups;
  const [index, setIndex] = useState(0);
  const group = groups[index]!;
  return (
    <section className={styles.thoughtPath}>
      <div className={styles.pathButtons} role="tablist" aria-label="Responsibility groups">
        {groups.map((item, itemIndex) => (
          <button
            aria-selected={index === itemIndex}
            key={item[0]}
            onClick={() => setIndex(itemIndex)}
            role="tab"
            type="button"
          >
            <span>{itemIndex + 1}</span>
            {item[0]}
          </button>
        ))}
      </div>
      <div className={styles.thoughtPanel} role="tabpanel">
        <span>Clear ownership</span>
        <h3>{group[0]}</h3>
        <p>{group[1]}</p>
      </div>
    </section>
  );
}

type ResponsibilityItem = (typeof caregiverModule5.interactions.responsibility.items)[number];

function ResponsibilityMap({ onComplete }: { readonly onComplete: () => void }) {
  const interaction = caregiverModule5.interactions.responsibility;
  const { markInteractionSubmitted } = useCaregiverSession();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const item: ResponsibilityItem = interaction.items[index]!;
  const answer = answers[item.id];
  const currentReviewed = Boolean(reviewed[item.id]);
  const correct = answer === item.preferred;
  const assisted = (attempts[item.id] ?? 0) >= 3 && !correct;
  const orderedZones = orderCaregiverChoices(
    interaction.zones,
    "module-5-responsibility",
    index,
    item.preferred,
  );

  function review() {
    if (answer === undefined) return;
    const nextReviewed = { ...reviewed, [item.id]: true };
    setReviewed(nextReviewed);
    setAttempts((current) => ({ ...current, [item.id]: (current[item.id] ?? 0) + 1 }));
    if (interaction.items.every((entry) => nextReviewed[entry.id])) {
      markInteractionSubmitted(interaction.id);
      onComplete();
    }
  }

  const feedback =
    item.preferred === 3
      ? interaction.feedback.medical
      : item.preferred === 1
        ? interaction.feedback.availability
        : item.preferred === 2
          ? interaction.feedback.shared
          : interaction.feedback.preferred;

  return (
    <section
      className={styles.sorter}
      data-core-application="true"
      data-interaction-id={interaction.id}
      data-required="true"
    >
      <div className={styles.sorterTop}>
        <span>
          Item {index + 1} of {interaction.items.length}
        </span>
        <StepNavigator
          completed={(step) => Boolean(reviewed[interaction.items[step]!.id])}
          count={interaction.items.length}
          current={index}
          label="Responsibility item"
          onSelect={setIndex}
        />
      </div>
      <h3>{item.copy}</h3>
      <div className={styles.sortChoices} role="radiogroup" aria-label="Responsibility owner">
        {orderedZones.map(({ originalIndex: zoneIndex, value: zone }) => (
          <button
            aria-checked={answer === zoneIndex}
            data-result={
              currentReviewed && answer === zoneIndex
                ? correct
                  ? "correct"
                  : "incorrect"
                : undefined
            }
            key={zone}
            onClick={() => {
              setAnswers((current) => ({ ...current, [item.id]: zoneIndex }));
              setReviewed((current) => ({ ...current, [item.id]: false }));
            }}
            role="radio"
            type="button"
          >
            {zone}
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
            ? ` Suggested owner: ${interaction.zones[item.preferred]}. Your choice has been kept.`
            : ""}
        </p>
      ) : null}
      <button
        className={`${styles.primaryAction} ${styles.activityAction}`}
        disabled={currentReviewed ? index === interaction.items.length - 1 : answer === undefined}
        onClick={() => (currentReviewed ? setIndex(index + 1) : review())}
        type="button"
      >
        {currentReviewed
          ? index === interaction.items.length - 1
            ? "Map reviewed"
            : "Next item"
          : "Review owner"}
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

const strainSignals = [
  { label: "Sleep", copy: "The phone stays on through the night." },
  { label: "Work", copy: "Support repeatedly interrupts paid work." },
  { label: "Emotion", copy: "Dread or resentment appears before a request." },
  { label: "Isolation", copy: "There is no one else to call or share a task with." },
] as const;

function StrainSignals() {
  const [index, setIndex] = useState(0);
  const signal = strainSignals[index]!;
  return (
    <section className={styles.reasonMap}>
      <div className={styles.reasonCloud} role="tablist" aria-label="Signs of strain">
        {strainSignals.map((item, itemIndex) => (
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
      <div className={styles.reasonPanel} role="tabpanel">
        <span>What to notice</span>
        <h3>{signal.label}</h3>
        <p>{signal.copy}</p>
      </div>
    </section>
  );
}

function PlanComparison() {
  const interaction = caregiverModule5.interactions.sustainability;
  const [index, setIndex] = useState(0);
  const plans = [
    { label: "Plan A", copy: interaction.planA },
    { label: "Plan B", copy: interaction.planB },
  ] as const;
  return (
    <section className={styles.knownUnknown}>
      <div className={styles.switchTabs} role="tablist" aria-label="Support plans">
        {plans.map((plan, planIndex) => (
          <button
            aria-selected={index === planIndex}
            key={plan.label}
            onClick={() => setIndex(planIndex)}
            role="tab"
            type="button"
          >
            {plan.label}
          </button>
        ))}
      </div>
      <div className={styles.knownPanel} role="tabpanel">
        <h3>{plans[index]!.label}</h3>
        <p>{plans[index]!.copy}</p>
      </div>
    </section>
  );
}

type SustainabilityChoice = (typeof caregiverModule5.interactions.sustainability.choices)[number];

function SustainabilityPractice() {
  const interaction = caregiverModule5.interactions.sustainability;
  const { markInteractionSubmitted } = useCaregiverSession();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const choice: SustainabilityChoice = interaction.choices[index]!;
  const answer = answers[choice.id];
  const currentReviewed = Boolean(reviewed[choice.id]);
  const correct = answer === choice.preferred;
  const assisted = (attempts[choice.id] ?? 0) >= 3 && !correct;
  const orderedAnswers = orderCaregiverChoices(
    [
      { label: "Reduces dependence on one person", value: true },
      { label: "Does not reduce that dependence", value: false },
    ] as const,
    "module-5-sustainability",
    index,
    choice.preferred ? 0 : 1,
  );

  function review() {
    if (answer === undefined) return;
    const nextReviewed = { ...reviewed, [choice.id]: true };
    setReviewed(nextReviewed);
    setAttempts((current) => ({ ...current, [choice.id]: (current[choice.id] ?? 0) + 1 }));
    if (interaction.choices.every((item) => nextReviewed[item.id]))
      markInteractionSubmitted(interaction.id);
  }

  return (
    <section
      className={styles.sorter}
      data-interaction-id={interaction.id}
      data-optional-practice="true"
    >
      <div className={styles.sorterTop}>
        <span>
          Difference {index + 1} of {interaction.choices.length}
        </span>
        <StepNavigator
          completed={(step) => Boolean(reviewed[interaction.choices[step]!.id])}
          count={interaction.choices.length}
          current={index}
          label="Plan difference"
          onSelect={setIndex}
        />
      </div>
      <h3>{choice.copy}</h3>
      <div
        className={styles.compactChoices}
        role="radiogroup"
        aria-label="Effect on sustainability"
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
          {choice.preferred
            ? interaction.feedback.preferred
            : choice.id === "control"
              ? interaction.feedback.control
              : interaction.feedback.notPresent}
          {assisted
            ? ` Suggested choice: ${choice.preferred ? "Reduces dependence on one person" : "Does not reduce that dependence"}. Your choice has been kept.`
            : ""}
        </p>
      ) : null}
      <button
        className={`${styles.primaryAction} ${styles.activityAction}`}
        disabled={currentReviewed ? index === interaction.choices.length - 1 : answer === undefined}
        onClick={() => (currentReviewed ? setIndex(index + 1) : review())}
        type="button"
      >
        {currentReviewed
          ? index === interaction.choices.length - 1
            ? "Plans reviewed"
            : "Next difference"
          : "Review difference"}
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

function BoundaryExamples() {
  const examples = caregiverModule5.sections.boundary.examples;
  const [index, setIndex] = useState(0);
  const example = examples[index]!;
  return (
    <section className={styles.phraseBrowser} aria-label="Boundary examples">
      <div className={styles.phraseCard}>
        <span>{example[0]}</span>
        <h3>{example[1]}</h3>
      </div>
      <div className={styles.phraseControls}>
        <button disabled={index === 0} onClick={() => setIndex(index - 1)} type="button">
          Previous
        </button>
        <span>
          {index + 1} of {examples.length}
        </span>
        <button
          disabled={index === examples.length - 1}
          onClick={() => setIndex(index + 1)}
          type="button"
        >
          Next
        </button>
      </div>
    </section>
  );
}

type BoundaryStatement = (typeof caregiverModule5.interactions.boundaries.statements)[number];

function BoundaryPractice() {
  const interaction = caregiverModule5.interactions.boundaries;
  const { markInteractionSubmitted } = useCaregiverSession();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const statement: BoundaryStatement = interaction.statements[index]!;
  const answer = answers[statement.id];
  const currentReviewed = Boolean(reviewed[statement.id]);
  const correct = answer === statement.preferred;
  const assisted = (attempts[statement.id] ?? 0) >= 3 && !correct;
  const orderedChoices = orderCaregiverChoices(
    statement.choices,
    "module-5-boundaries",
    index,
    statement.preferred,
  );

  function review() {
    if (answer === undefined) return;
    const nextReviewed = { ...reviewed, [statement.id]: true };
    setReviewed(nextReviewed);
    setAttempts((current) => ({ ...current, [statement.id]: (current[statement.id] ?? 0) + 1 }));
    if (interaction.statements.every((item) => nextReviewed[item.id]))
      markInteractionSubmitted(interaction.id);
  }

  return (
    <section
      className={styles.sorter}
      data-interaction-id={interaction.id}
      data-optional-practice="true"
    >
      <div className={styles.sorterTop}>
        <span>
          Revision {index + 1} of {interaction.statements.length}
        </span>
        <StepNavigator
          completed={(step) => Boolean(reviewed[interaction.statements[step]!.id])}
          count={interaction.statements.length}
          current={index}
          label="Boundary revision"
          onSelect={setIndex}
        />
      </div>
      <h3>“{statement.original}”</h3>
      <div
        className={styles.compactChoices}
        role="radiogroup"
        aria-label="Boundary revision choices"
      >
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
              setAnswers((current) => ({ ...current, [statement.id]: choiceIndex }));
              setReviewed((current) => ({ ...current, [statement.id]: false }));
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
          {correct
            ? interaction.feedback.preferred
            : statement.nonPreferredFeedback === "guilt"
              ? interaction.feedback.guilt
              : interaction.feedback.vague}
          {assisted
            ? ` Suggested revision: ${statement.choices[statement.preferred]}. Your choice has been kept.`
            : ""}
        </p>
      ) : null}
      <button
        className={`${styles.primaryAction} ${styles.activityAction}`}
        disabled={
          currentReviewed ? index === interaction.statements.length - 1 : answer === undefined
        }
        onClick={() => (currentReviewed ? setIndex(index + 1) : review())}
        type="button"
      >
        {currentReviewed
          ? index === interaction.statements.length - 1
            ? "Limits reviewed"
            : "Next revision"
          : "Review revision"}
      </button>
      <div className={styles.miniNavigation}>
        <button disabled={index === 0} onClick={() => setIndex(index - 1)} type="button">
          Previous
        </button>
        <span>
          {index + 1} of {interaction.statements.length}
        </span>
      </div>
    </section>
  );
}

const backupViews = [
  {
    label: "People",
    title: "Share a specific task",
    copy: "Ask an approved relative or friend to take one defined responsibility.",
  },
  {
    label: "Services",
    title: "Use a practical service",
    copy: "Transportation, delivery, community, respite, or caregiver services may reduce the load.",
  },
  {
    label: "Care team",
    title: "Keep professional work professional",
    copy: "Use the clinic, pharmacist, or diabetes care and education specialist for their proper role.",
  },
  {
    label: "Change",
    title: "Redesign the task",
    copy: "A task can become smaller, less frequent, or unnecessary instead of moving to another person.",
  },
] as const;

function BackupStructure() {
  const [index, setIndex] = useState(0);
  const view = backupViews[index]!;
  return (
    <section className={styles.modePicker}>
      <div
        className={`${styles.modeButtons} ${styles.fourSignalButtons}`}
        role="tablist"
        aria-label="Backup options"
      >
        {backupViews.map((item, itemIndex) => (
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

type NetworkTask = (typeof caregiverModule5.interactions.network.tasks)[number];

function NetworkPractice() {
  const interaction = caregiverModule5.interactions.network;
  const { markInteractionSubmitted } = useCaregiverSession();
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState(0);
  const [backups, setBackups] = useState<Record<string, number>>({});
  const [information, setInformation] = useState<Record<string, number>>({});
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const task: NetworkTask = interaction.tasks[index]!;
  const backup = backups[task.id];
  const info = information[task.id];
  const currentReviewed = Boolean(reviewed[task.id]);
  const correct =
    (task.preferredBackups as readonly number[]).includes(backup ?? -1) &&
    info === task.preferredInfo;
  const assisted = (attempts[task.id] ?? 0) >= 3 && !correct;
  const orderedBackups = orderCaregiverChoices(
    interaction.backups,
    "module-5-network-backups",
    index,
    task.preferredBackups[0],
  );
  const orderedInformation = orderCaregiverChoices(
    interaction.information,
    "module-5-network-information",
    index,
    task.preferredInfo,
  );

  function review() {
    if (backup === undefined || info === undefined) return;
    const nextReviewed = { ...reviewed, [task.id]: true };
    setReviewed(nextReviewed);
    setAttempts((current) => ({ ...current, [task.id]: (current[task.id] ?? 0) + 1 }));
    if (interaction.tasks.every((item) => nextReviewed[item.id]))
      markInteractionSubmitted(interaction.id);
  }

  return (
    <section
      className={styles.sorter}
      data-interaction-id={interaction.id}
      data-optional-practice="true"
    >
      <div className={styles.sorterTop}>
        <span>
          Task {index + 1} of {interaction.tasks.length}
        </span>
        <StepNavigator
          completed={(step) => Boolean(reviewed[interaction.tasks[step]!.id])}
          count={interaction.tasks.length}
          current={index}
          label="Backup task"
          onSelect={(step) => {
            setIndex(step);
            setPhase(0);
          }}
        />
      </div>
      <h3>{task.copy}</h3>
      <div className={styles.checkCount}>
        <span>Part {phase + 1} of 2</span>
      </div>
      <div
        className={styles.compactChoices}
        role="radiogroup"
        aria-label={phase === 0 ? "Choose a backup" : "Share only what is needed"}
      >
        {phase === 0
          ? orderedBackups.map(({ originalIndex: choiceIndex, value: choice }) => (
              <button
                aria-checked={backup === choiceIndex}
                key={choice}
                onClick={() => {
                  setBackups((current) => ({ ...current, [task.id]: choiceIndex }));
                  setReviewed((current) => ({ ...current, [task.id]: false }));
                }}
                role="radio"
                type="button"
              >
                {choice}
              </button>
            ))
          : orderedInformation.map(({ originalIndex: choiceIndex, value: choice }) => (
              <button
                aria-checked={info === choiceIndex}
                data-result={
                  currentReviewed && info === choiceIndex
                    ? correct
                      ? "correct"
                      : "incorrect"
                    : undefined
                }
                key={choice}
                onClick={() => {
                  setInformation((current) => ({ ...current, [task.id]: choiceIndex }));
                  setReviewed((current) => ({ ...current, [task.id]: false }));
                }}
                role="radio"
                type="button"
              >
                {choice}
              </button>
            ))}
      </div>
      {phase === 1 && currentReviewed ? (
        <p
          className={styles.inlineFeedback}
          data-result={correct ? "correct" : "incorrect"}
          role="status"
        >
          <strong>{correct ? "Correct." : "Incorrect."}</strong>
          {info === 2 || info === 3 ? interaction.feedback.private : interaction.feedback.preferred}
          {assisted
            ? ` Suggested match: ${interaction.backups[task.preferredBackups[0]!]} with ${interaction.information[task.preferredInfo]}. Your choices have been kept.`
            : ""}
        </p>
      ) : null}
      <button
        className={`${styles.primaryAction} ${styles.activityAction}`}
        disabled={
          phase === 0
            ? backup === undefined
            : currentReviewed
              ? index === interaction.tasks.length - 1
              : info === undefined
        }
        onClick={() => {
          if (phase === 0) {
            setPhase(1);
          } else if (currentReviewed) {
            setIndex(index + 1);
            setPhase(0);
          } else {
            review();
          }
        }}
        type="button"
      >
        {phase === 0
          ? "Choose minimum information"
          : currentReviewed
            ? index === interaction.tasks.length - 1
              ? "Network reviewed"
              : "Next task"
            : "Review this task"}
      </button>
      <div className={styles.miniNavigation}>
        <button
          disabled={index === 0 && phase === 0}
          onClick={() => {
            if (phase === 1) setPhase(0);
            else {
              setIndex(index - 1);
              setPhase(0);
            }
          }}
          type="button"
        >
          {phase === 1 ? "Back to backup" : "Previous task"}
        </button>
        <span>
          {index + 1} of {interaction.tasks.length}
        </span>
      </div>
    </section>
  );
}

type LoadPattern = (typeof caregiverModule5.interactions.load.patterns)[number];

function LoadPractice() {
  const interaction = caregiverModule5.interactions.load;
  const { markInteractionSubmitted } = useCaregiverSession();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const [discussion, setDiscussion] = useState("");
  const [discussionReviewed, setDiscussionReviewed] = useState(false);
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const onDiscussion = index === interaction.patterns.length;
  const pattern: LoadPattern | undefined = interaction.patterns[index];
  const answer = pattern ? answers[pattern.id] : undefined;
  const currentReviewed = pattern ? Boolean(reviewed[pattern.id]) : discussionReviewed;
  const correct = pattern
    ? answer === pattern.preferred
    : interaction.discussions.some((item) => item.id === discussion && item.preferred);
  const attemptKey = pattern?.id ?? "discussion";
  const assisted = (attempts[attemptKey] ?? 0) >= 3 && !correct;
  const orderedPatternAnswers = pattern
    ? orderCaregiverChoices(
        [
          { label: "Appears difficult to sustain", value: true },
          { label: "Not enough by itself", value: false },
        ] as const,
        "module-5-load-patterns",
        index,
        pattern.preferred ? 0 : 1,
      )
    : [];
  const orderedDiscussions = orderCaregiverChoices(
    interaction.discussions,
    "module-5-load-discussions",
    index,
    interaction.discussions.findIndex((item) => item.preferred),
  );

  function review() {
    if (onDiscussion) {
      if (!discussion) return;
      setDiscussionReviewed(true);
      setAttempts((current) => ({ ...current, discussion: (current.discussion ?? 0) + 1 }));
      markInteractionSubmitted(interaction.id);
      return;
    }
    if (!pattern || answer === undefined) return;
    setReviewed((current) => ({ ...current, [pattern.id]: true }));
    setAttempts((current) => ({ ...current, [pattern.id]: (current[pattern.id] ?? 0) + 1 }));
  }

  const feedback = onDiscussion
    ? discussion === "burnout"
      ? interaction.feedback.burnout
      : discussion === "medical"
        ? interaction.feedback.medical
        : interaction.feedback.preferred
    : pattern?.preferred
      ? interaction.feedback.preferred
      : interaction.feedback.insufficient;

  return (
    <section
      className={styles.sorter}
      data-interaction-id={interaction.id}
      data-optional-practice="true"
    >
      <div className={styles.sorterTop}>
        <span>
          {onDiscussion
            ? "Choose a conversation"
            : `Pattern ${index + 1} of ${interaction.patterns.length}`}
        </span>
        <StepNavigator
          completed={(step) =>
            step === interaction.patterns.length
              ? discussionReviewed
              : Boolean(reviewed[interaction.patterns[step]!.id])
          }
          count={interaction.patterns.length + 1}
          current={index}
          label="Load review"
          onSelect={setIndex}
        />
      </div>
      <h3>{onDiscussion ? "What arrangement should Elena discuss first?" : pattern!.copy}</h3>
      <div
        className={styles.compactChoices}
        role="radiogroup"
        aria-label={onDiscussion ? "Arrangement to discuss" : "Pattern classification"}
      >
        {onDiscussion
          ? orderedDiscussions.map(({ value: choice }) => (
              <button
                aria-checked={discussion === choice.id}
                data-result={
                  currentReviewed && discussion === choice.id
                    ? correct
                      ? "correct"
                      : "incorrect"
                    : undefined
                }
                key={choice.id}
                onClick={() => {
                  setDiscussion(choice.id);
                  setDiscussionReviewed(false);
                }}
                role="radio"
                type="button"
              >
                {choice.copy}
              </button>
            ))
          : orderedPatternAnswers.map(({ value: option }) => (
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
                  setAnswers((current) => ({ ...current, [pattern!.id]: option.value }));
                  setReviewed((current) => ({ ...current, [pattern!.id]: false }));
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
            ? ` Suggested choice: ${onDiscussion ? "overnight availability or ride schedule" : pattern!.preferred ? "Appears difficult to sustain" : "Not enough by itself"}. Your choice has been kept.`
            : ""}
        </p>
      ) : null}
      <button
        className={`${styles.primaryAction} ${styles.activityAction}`}
        disabled={
          currentReviewed
            ? index === interaction.patterns.length
            : onDiscussion
              ? !discussion
              : answer === undefined
        }
        onClick={() => (currentReviewed ? setIndex(index + 1) : review())}
        type="button"
      >
        {currentReviewed
          ? index === interaction.patterns.length
            ? "Load reviewed"
            : "Next pattern"
          : onDiscussion
            ? "Review conversation"
            : "Review pattern"}
      </button>
      <div className={styles.miniNavigation}>
        <button disabled={index === 0} onClick={() => setIndex(index - 1)} type="button">
          Previous
        </button>
        <span>
          {index + 1} of {interaction.patterns.length + 1}
        </span>
      </div>
    </section>
  );
}

const relationshipViews = [
  {
    label: "Ordinary connection",
    title: "Let some time be about something else",
    copy: caregiverModule5.sections.relationship.paragraphs[0],
  },
  {
    label: "Name the strain",
    title: "Change the arrangement before blame takes over",
    copy: caregiverModule5.sections.relationship.correction,
  },
] as const;

function RelationshipLens() {
  const [index, setIndex] = useState(0);
  const view = relationshipViews[index]!;
  return (
    <section className={styles.knownUnknown}>
      <div className={styles.switchTabs} role="tablist" aria-label="Protecting the relationship">
        {relationshipViews.map((item, itemIndex) => (
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

function PhraseBrowser() {
  const scripts = caregiverModule5.scripts;
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
  const questions = caregiverModule5.questions;
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
    "module-5-quick-check",
    index,
    question.preferredIndex,
  );

  function review() {
    if (answer === undefined) return;
    const nextReviewed = { ...reviewed, [question.id]: true };
    setReviewed(nextReviewed);
    setAttempts((current) => ({ ...current, [question.id]: (current[question.id] ?? 0) + 1 }));
    if (questions.every((item) => nextReviewed[item.id]))
      setKeyIdeaUnderstood(questions.every((item) => answers[item.id] === item.preferredIndex));
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
  const item = caregiverModule5.reflection;
  const { reflectionSkipped, setReflection, skipReflection, clearReflection } =
    useCaregiverSession();
  const [index, setIndex] = useState(0);
  const [values, setValues] = useState(["", "", ""]);
  const [saved, setSaved] = useState(false);
  const hasValue = values.some((value) => value.trim());

  function save() {
    if (!hasValue) return;
    setReflection(
      values.map((value, valueIndex) => `${item.fields[valueIndex]}: ${value}`).join("\n"),
    );
    setSaved(true);
  }

  return (
    <section
      className={styles.reflectionCard}
      data-reflection-id={item.id}
      data-storage="session-only"
    >
      <StepNavigator
        completed={(step) => Boolean(values[step]?.trim())}
        count={item.fields.length}
        current={index}
        label="Reflection prompt"
        onSelect={setIndex}
      />
      <label htmlFor={`module-5-reflection-${index}`}>{item.fields[index]}</label>
      <textarea
        id={`module-5-reflection-${index}`}
        onChange={(event) => {
          const next = [...values];
          next[index] = event.currentTarget.value;
          setValues(next);
          setSaved(false);
        }}
        placeholder="Keep another person's health details out of this note."
        rows={4}
        value={values[index]}
      />
      <p>{item.privacy}</p>
      <div className={styles.reflectionActions}>
        <button disabled={!hasValue} onClick={save} type="button">
          Save for this session
        </button>
        {!reflectionSkipped ? (
          <button onClick={skipReflection} type="button">
            {item.skip}
          </button>
        ) : null}
        <button
          disabled={!hasValue}
          onClick={() => {
            setValues(["", "", ""]);
            clearReflection();
            setSaved(false);
          }}
          type="button"
        >
          {item.clear}
        </button>
      </div>
      <div className={styles.miniNavigation}>
        <button disabled={index === 0} onClick={() => setIndex(index - 1)} type="button">
          Previous prompt
        </button>
        <span>
          {index + 1} of {item.fields.length}
        </span>
        <button
          disabled={index === item.fields.length - 1}
          onClick={() => setIndex(index + 1)}
          type="button"
        >
          Next prompt
        </button>
      </div>
      {saved ? <p role="status">Reflection saved for this session.</p> : null}
      {reflectionSkipped ? (
        <p role="status">Reflection skipped for this session. You can return and write later.</p>
      ) : null}
    </section>
  );
}

function TakeawayDiagram() {
  const items = [
    { label: "Name one task", copy: "Be specific about what you can keep doing." },
    { label: "State one limit", copy: "Describe your action without controlling another adult." },
    {
      label: "Add one backup",
      copy: "Reduce dependence on one person and share only what is needed.",
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

export function Module5Experience() {
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
      id: "morning-call",
      moment: "The 6:10 call",
      title: "A small request lands on a full day.",
      body: <p>Elena has been carrying more than either person has clearly named.</p>,
      visual: <ScenarioSequence end={3} start={0} />,
      continueLabel: "See the arrangement underneath",
    },
    {
      id: "invisible-load",
      moment: "What was never agreed",
      title: "Care can expand without a conversation.",
      body: <p>Tomas accepted some help. Elena quietly added the rest.</p>,
      visual: <ScenarioSequence end={6} start={3} />,
      continueLabel: "Separate the responsibilities",
    },
    {
      id: "ownership",
      moment: "Four clear lanes",
      title: "Shared support still needs clear ownership.",
      body: <p>Start with decisions, availability, agreements, and professional work.</p>,
      visual: <ResponsibilityLanes />,
      continueLabel: "Map who owns what",
    },
    {
      id: "responsibility-map",
      moment: "Core practice",
      title: "Sort one responsibility at a time.",
      body: <p>The goal is clarity, not perfect control.</p>,
      visual: <ResponsibilityMap onComplete={() => setCoreComplete(true)} />,
      continueLabel: coreComplete ? "Notice signs of strain" : "Continue, then return if needed",
    },
    {
      id: "strain",
      moment: "Strain is information",
      title: "Notice what the arrangement is costing.",
      body: <p>These signs can prompt a practical change. They do not create a diagnosis.</p>,
      visual: <StrainSignals />,
      continueLabel: "Compare two support plans",
    },
    {
      id: "plans",
      moment: "Same relationship, different structure",
      title: "A plan can reduce dependence on one person.",
      body: <p>Compare what each arrangement asks Elena to carry.</p>,
      visual: <PlanComparison />,
      continueLabel: "Find what makes a plan sustainable",
    },
    {
      id: "sustainability",
      moment: "Six plan differences",
      title: "Sustainability lives in the details.",
      body: <p>Look for scope, time limits, backup, and a chance to review the plan.</p>,
      visual: <SustainabilityPractice />,
      continueLabel: "Separate boundaries from control",
    },
    {
      id: "boundary-examples",
      moment: "The action belongs to the speaker",
      title: "A boundary says what I will do.",
      body: <p>It does not punish someone or force a medical decision or disclosure.</p>,
      visual: <BoundaryExamples />,
      continueLabel: "Practice saying the limit",
    },
    {
      id: "boundary-practice",
      moment: "Three revisions",
      title: "Make the limit specific and usable.",
      body: <p>Name the support you can offer without making it conditional on obedience.</p>,
      visual: <BoundaryPractice />,
      continueLabel: "Build backup into the structure",
    },
    {
      id: "backup",
      moment: "More than another person",
      title: "Backup can mean people, services, or a smaller task.",
      body: <p>The goal is to stop one person from being the entire system.</p>,
      visual: <BackupStructure />,
      continueLabel: "Match each task to backup",
    },
    {
      id: "network",
      moment: "Task-level support",
      title: "Share the task, not the whole health story.",
      body: <p>Choose a fitting backup and only the information that role needs.</p>,
      visual: <NetworkPractice />,
      continueLabel: "Review what is taking up room",
    },
    {
      id: "load",
      moment: "Elena’s week",
      title: "Describe the pattern before naming a condition.",
      body: <p>Choose one arrangement to change instead of assigning a diagnosis.</p>,
      visual: <LoadPractice />,
      continueLabel: "Protect the relationship too",
    },
    {
      id: "relationship",
      moment: "More than support tasks",
      title: "The relationship is larger than diabetes.",
      body: <p>Ordinary connection and an honest limits conversation can exist together.</p>,
      visual: <RelationshipLens />,
      continueLabel: "See what that can sound like",
    },
    {
      id: "misunderstanding",
      moment: "Resentment without blame",
      title: "Do not hide strain until it becomes punishment.",
      body: <p>Name the schedule or task that needs to change.</p>,
      visual: (
        <section className={styles.readiness}>
          <div className={styles.readinessPair}>
            <div>
              <span>Unhelpful rule</span>
              <strong>{caregiverModule5.sections.relationship.misunderstanding}</strong>
            </div>
            <div>
              <span>More useful move</span>
              <strong>Describe the arrangement and the change you can make.</strong>
            </div>
          </div>
        </section>
      ),
      continueLabel: "Borrow useful language",
    },
    {
      id: "phrases",
      moment: "Seven sentences",
      title: "Say what can change without making a threat.",
      body: <p>Use these as starting points, not scripts someone must follow word for word.</p>,
      visual: <PhraseBrowser />,
      continueLabel: "Check your understanding",
    },
    {
      id: "check",
      moment: "Three short situations",
      title: "Choose the change that keeps support sustainable.",
      body: <p>This review does not determine module completion.</p>,
      visual: <QuickCheck />,
      continueLabel: "Make an optional private plan",
    },
    {
      id: "reflection",
      moment: "Optional reflection",
      title: "Name one task, one limit, and one backup.",
      body: <p>Keep another person’s health details out of this session-only note.</p>,
      visual: <SessionReflection />,
      continueLabel: "See the final takeaway",
    },
    {
      id: "takeaway",
      moment: "Support that can last",
      title: "Care deeply without carrying every decision.",
      body: <p>Clear scope, review, and backup protect both people.</p>,
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
    setCurrent(3);
    setFinished(false);
    window.requestAnimationFrame(() => {
      articleRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
      headingRef.current?.focus({ preventScroll: true });
    });
  }

  return (
    <main
      className={`${styles.page} ${styles.moduleFive}`}
      data-caregiver-module={caregiverModule5.id}
      data-rendering-mode="deterministic"
    >
      <Link className={styles.backLink} href="/caregiver">
        <ArrowLeft aria-hidden="true" size={17} /> Caregiver modules
      </Link>
      {finished ? (
        <article className={styles.completion} data-module-completed={completed} ref={articleRef}>
          <p>Caregiver module 5</p>
          <h1 ref={headingRef} tabIndex={-1}>
            {completed ? "Finished" : "One step remains"}
          </h1>
          <p>
            Sustainable support makes room for care, limits, shared responsibility, and ordinary
            connection.
          </p>
          <div className={styles.completionTakeaway}>
            <span>In short</span>
            <strong>Name one task, one limit, and one backup.</strong>
          </div>
          {!completed ? (
            <div className={styles.incompleteNote} role="status">
              <strong>One practice is still open.</strong>
              <p>Review all eight responsibility items to complete this module.</p>
              <button onClick={reviewPractice} type="button">
                Review responsibility map
              </button>
            </div>
          ) : null}
          <div className={styles.completionActions}>
            <Link
              className={completed ? styles.primaryAction : styles.secondaryAction}
              href="/caregiver"
            >
              Choose my next step
            </Link>
            <button className={styles.secondaryAction} onClick={restart} type="button">
              <RotateCcw aria-hidden="true" size={16} /> Review again
            </button>
          </div>
          <p className={styles.disclosure}>
            Elena and Tomas are illustrative characters. This module does not diagnose caregiver
            burnout or transfer medical decision-making to a supporter.
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
