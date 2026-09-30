"use client";

import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  Clock3,
  LockKeyhole,
  RotateCcw,
  Volume2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { caregiverModule2 } from "../../../content/caregiver-module-2";
import { caregiverModuleRegistry } from "../../../content/caregiver-module-registry";
import { orderCaregiverChoices } from "../../../lib/caregiver-choice-order";
import { isCaregiverModuleComplete } from "../../../lib/caregiver-completion";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-1-story.module.css";

const SCENE_COUNT = 16;

function shouldReduceMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function StepNavigator({
  completed,
  completionLabel = "reviewed",
  count,
  current,
  label,
  onSelect,
}: {
  readonly completed: (index: number) => boolean;
  readonly completionLabel?: string;
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
          aria-label={`${label} ${index + 1}${completed(index) ? `, ${completionLabel}` : ""}`}
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
        <span>Caregiver module 2</span>
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
  const lines = caregiverModule2.sections.scenario.paragraphs.slice(start, end);
  const [index, setIndex] = useState(0);

  return (
    <section className={styles.phraseBrowser} aria-label="The phone on the counter">
      <div className={styles.phraseCard}>
        <span>
          Moment {index + 1} of {lines.length}
        </span>
        <h3>{index === 0 ? caregiverModule2.sections.scenario.title : "What happens next"}</h3>
        <p>{lines[index]}</p>
      </div>
      <div className={styles.phraseControls}>
        <button disabled={index === 0} onClick={() => setIndex((value) => value - 1)} type="button">
          Previous
        </button>
        <span aria-live="polite">
          {index + 1} of {lines.length}
        </span>
        <button
          disabled={index === lines.length - 1}
          onClick={() => setIndex((value) => value + 1)}
          type="button"
        >
          Next
        </button>
      </div>
    </section>
  );
}

type ImpactAction = (typeof caregiverModule2.interactions.intentionImpact.actions)[number];

function IntentionImpactMap() {
  const interaction = caregiverModule2.interactions.intentionImpact;
  const { markInteractionSubmitted } = useCaregiverSession();
  const [actionIndex, setActionIndex] = useState(0);
  const [intentions, setIntentions] = useState<Record<string, string>>({});
  const [impacts, setImpacts] = useState<Record<string, string>>({});
  const [unknowns, setUnknowns] = useState<Record<string, boolean>>({});
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const action: ImpactAction = interaction.actions[actionIndex]!;
  const intention = intentions[action.id] ?? "";
  const impact = impacts[action.id] ?? "";
  const keepsOpen = Boolean(unknowns[action.id]);
  const currentReviewed = Boolean(reviewed[action.id]);
  const reviewReady = Boolean(intention && impact && keepsOpen);
  const correct = impact === action.preferredImpact && keepsOpen;
  const reviewHintId = `impact-review-${action.id}`;
  const orderedIntentions = orderCaregiverChoices(
    interaction.intentions,
    "module-2-intentions",
    actionIndex,
  );
  const orderedImpacts = orderCaregiverChoices(
    interaction.impacts,
    "module-2-impacts",
    actionIndex,
    interaction.impacts.indexOf(action.preferredImpact),
  );

  function review() {
    if (!intention || !impact || !keepsOpen) return;
    const nextReviewed = { ...reviewed, [action.id]: true };
    setReviewed(nextReviewed);
    if (Object.values(nextReviewed).filter(Boolean).length === interaction.actions.length) {
      markInteractionSubmitted(interaction.id);
    }
  }

  const feedback = !keepsOpen
    ? interaction.feedback.unknown
    : impact === "support"
      ? interaction.feedback.support
      : impact === action.preferredImpact
        ? interaction.feedback.preferred
        : interaction.feedback.fallback;

  return (
    <section className={styles.sorter} data-interaction-id={interaction.id}>
      <div className={styles.sorterTop}>
        <span>
          Action {actionIndex + 1} of {interaction.actions.length}
        </span>
        <StepNavigator
          completed={(index) => Boolean(reviewed[interaction.actions[index]!.id])}
          count={interaction.actions.length}
          current={actionIndex}
          label="Action"
          onSelect={setActionIndex}
        />
      </div>
      <h3>{action.label}</h3>
      <div className={styles.replyControls}>
        <fieldset>
          <legend>Likely intention</legend>
          {orderedIntentions.map(({ value: option }) => (
            <button
              aria-pressed={intention === option}
              key={option}
              onClick={() => {
                setIntentions((current) => ({ ...current, [action.id]: option }));
                setReviewed((current) => ({ ...current, [action.id]: false }));
              }}
              type="button"
            >
              {option}
            </button>
          ))}
        </fieldset>
        <fieldset>
          <legend>Possible impact</legend>
          {orderedImpacts.map(({ value: option }) => (
            <button
              aria-pressed={impact === option}
              data-result={
                currentReviewed && impact === option
                  ? option === action.preferredImpact
                    ? "correct"
                    : "incorrect"
                  : undefined
              }
              key={option}
              onClick={() => {
                setImpacts((current) => ({ ...current, [action.id]: option }));
                setReviewed((current) => ({ ...current, [action.id]: false }));
              }}
              type="button"
            >
              {option}
            </button>
          ))}
        </fieldset>
      </div>
      <div className={styles.compactChoices} role="group" aria-label="Keep perspective open">
        <button
          aria-checked={keepsOpen}
          data-result={currentReviewed && keepsOpen ? "correct" : undefined}
          onClick={() => {
            setUnknowns((current) => ({ ...current, [action.id]: !keepsOpen }));
            setReviewed((current) => ({ ...current, [action.id]: false }));
          }}
          role="checkbox"
          type="button"
        >
          Andre’s exact experience remains unknown
        </button>
      </div>
      {currentReviewed ? (
        <div
          className={styles.sortFeedback}
          data-result={correct ? "correct" : "incorrect"}
          role="status"
        >
          <strong>{correct ? "Correct." : "Incorrect."}</strong>
          <p>{feedback}</p>
        </div>
      ) : null}
      <div
        className={styles.requiredAction}
        data-ready={reviewReady || currentReviewed ? "true" : "false"}
      >
        <p id={reviewHintId}>
          <strong>Required to continue</strong>
          <span>
            {currentReviewed
              ? actionIndex === interaction.actions.length - 1
                ? "All three actions have been reviewed."
                : "This action is reviewed. Continue to the next one."
              : reviewReady
                ? "Review your choices to finish this action."
                : "Choose an intention, an impact, and confirm that Andre’s experience remains unknown."}
          </span>
        </p>
        <button
          aria-describedby={reviewHintId}
          className={`${styles.primaryAction} ${styles.activityAction}`}
          disabled={currentReviewed ? actionIndex === interaction.actions.length - 1 : !reviewReady}
          onClick={() => {
            if (currentReviewed) {
              setActionIndex(actionIndex + 1);
              return;
            }
            review();
          }}
          type="button"
        >
          {currentReviewed
            ? actionIndex === interaction.actions.length - 1
              ? "Action reviewed"
              : "Next action"
            : reviewReady
              ? "Review to continue"
              : "Choose the three items above"}
        </button>
      </div>
      <div className={styles.miniNavigation}>
        <button
          disabled={actionIndex === 0}
          onClick={() => setActionIndex(actionIndex - 1)}
          type="button"
        >
          Previous
        </button>
        <span>
          {actionIndex + 1} of {interaction.actions.length}
        </span>
      </div>
    </section>
  );
}

const boundarySignals = [
  { label: "Permission", copy: "Was this action invited or clearly offered?" },
  { label: "Privacy", copy: "Does it involve information that is not yours to open or share?" },
  { label: "Repetition", copy: "Did one offer become repeated asking?" },
  { label: "Easy no", copy: "Can the person decline without guilt or a consequence?" },
] as const;

function BoundarySignals() {
  const [selected, setSelected] = useState(0);
  const signal = boundarySignals[selected]!;
  return (
    <section className={styles.modePicker} aria-label="Four signals of support">
      <div className={`${styles.modeButtons} ${styles.fourSignalButtons}`} role="tablist">
        {boundarySignals.map((item, index) => (
          <button
            aria-selected={selected === index}
            key={item.label}
            onClick={() => setSelected(index)}
            role="tab"
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className={styles.modePanel} role="tabpanel">
        <h3>{signal.label}</h3>
        <p>{signal.copy}</p>
      </div>
    </section>
  );
}

function SupportContinuum() {
  const interaction = caregiverModule2.interactions.continuum;
  const { markInteractionSubmitted } = useCaregiverSession();
  const [index, setIndex] = useState(0);
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState("");
  const behavior = interaction.behaviors[index]!;
  const placement = placements[behavior.id] ?? "";
  const correct = placement === behavior.preferredCategory;
  const orderedCategories = orderCaregiverChoices(
    interaction.categories,
    "module-2-continuum",
    index,
    interaction.categories.indexOf(behavior.preferredCategory),
  );

  function review() {
    if (!placement) return;
    const attempt = (attempts[behavior.id] ?? 0) + 1;
    const assisted = !correct && attempt >= 3;
    setAttempts((current) => ({ ...current, [behavior.id]: attempt }));
    setReviewed((current) => ({ ...current, [behavior.id]: true }));
    setFeedback(
      `${behavior.feedback}${assisted ? ` Suggested classification: ${behavior.preferredCategory}. Your choice has been kept.` : ""}`,
    );
    if (index === interaction.behaviors.length - 1) markInteractionSubmitted(interaction.id);
  }

  return (
    <section className={styles.quickCheck} data-interaction-id={interaction.id}>
      <div className={styles.checkCount}>
        <span>
          Situation {index + 1} of {interaction.behaviors.length}
        </span>
        <StepNavigator
          completed={(itemIndex) => Boolean(reviewed[interaction.behaviors[itemIndex]!.id])}
          count={interaction.behaviors.length}
          current={index}
          label="Situation"
          onSelect={(itemIndex) => {
            setIndex(itemIndex);
            setFeedback("");
          }}
        />
      </div>
      <h3>{behavior.copy}</h3>
      <div className={styles.checkChoices} role="radiogroup" aria-label="Choose a category">
        {orderedCategories.map(({ value: category }) => (
          <button
            aria-checked={placement === category}
            data-result={
              reviewed[behavior.id] && placement === category
                ? correct
                  ? "correct"
                  : "incorrect"
                : undefined
            }
            key={category}
            onClick={() => {
              setPlacements((current) => ({ ...current, [behavior.id]: category }));
              setReviewed((current) => ({ ...current, [behavior.id]: false }));
              setFeedback("");
            }}
            role="radio"
            type="button"
          >
            {category}
          </button>
        ))}
      </div>
      {feedback ? (
        <p
          className={styles.inlineFeedback}
          data-result={correct ? "correct" : "incorrect"}
          role="status"
        >
          <strong>{correct ? "Correct." : "Incorrect."}</strong>
          {feedback}
        </p>
      ) : null}
      <button
        className={`${styles.primaryAction} ${styles.activityAction}`}
        disabled={reviewed[behavior.id] ? index === interaction.behaviors.length - 1 : !placement}
        onClick={() => {
          if (reviewed[behavior.id]) {
            setIndex(index + 1);
            setFeedback("");
            return;
          }
          review();
        }}
        type="button"
      >
        {reviewed[behavior.id]
          ? index === interaction.behaviors.length - 1
            ? "Situation reviewed"
            : "Next situation"
          : "Review this situation"}
      </button>
      <div className={styles.miniNavigation}>
        <button disabled={index === 0} onClick={() => setIndex(index - 1)} type="button">
          Previous
        </button>
        <span>
          {index + 1} of {interaction.behaviors.length}
        </span>
      </div>
    </section>
  );
}

function PermissionQuestions() {
  const questions = caregiverModule2.sections.permission.questions;
  const [index, setIndex] = useState(0);
  return (
    <section className={styles.returnPath} aria-label="Five permission questions">
      <div className={styles.returnSteps} role="tablist" aria-label="Permission questions">
        {questions.map((_, questionIndex) => (
          <button
            aria-selected={index === questionIndex}
            key={questionIndex}
            onClick={() => setIndex(questionIndex)}
            role="tab"
            type="button"
          >
            <span>{questionIndex + 1}</span> Question {questionIndex + 1}
          </button>
        ))}
      </div>
      <div className={styles.returnPanel} role="tabpanel">
        <span>Ask before acting</span>
        <h3>{questions[index]}</h3>
        <p>
          {index === 4 ? "A usable agreement makes refusal ordinary." : "Keep the answer specific."}
        </p>
      </div>
    </section>
  );
}

type PermissionPartId =
  (typeof caregiverModule2.interactions.permissionBuilder.groups)[number]["id"];

function PermissionBuilder({ onComplete }: { readonly onComplete: () => void }) {
  const interaction = caregiverModule2.interactions.permissionBuilder;
  const { markInteractionSubmitted } = useCaregiverSession();
  const [index, setIndex] = useState(0);
  const [parts, setParts] = useState<Partial<Record<PermissionPartId, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [speechAvailable, setSpeechAvailable] = useState(false);
  const group = interaction.groups[index]!;
  const chosen = parts[group.id];
  const complete = interaction.groups.every((item) => parts[item.id]);
  const preferred = interaction.groups.every((item) => parts[item.id] === item.options[0]);
  const assembledOffer = `${parts.opening ?? "[Opening]"} ${parts.action ?? "[action]"}? ${parts.decline ?? "[Decline clause]"}. ${parts.followup ?? "[Role follow-up]"}.`;

  useEffect(() => {
    const available = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
    setSpeechAvailable(available);

    return () => {
      if (available) window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(
    () => () => {
      if (speechAvailable) window.speechSynthesis.cancel();
    },
    [assembledOffer, speechAvailable],
  );

  function reviewOffer() {
    if (!complete) return;
    setSubmitted(true);
    markInteractionSubmitted(interaction.id);
    onComplete();
  }

  function readOffer() {
    if (!complete || !speechAvailable) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(assembledOffer));
  }

  const mismatch = interaction.groups.find((item) => parts[item.id] !== item.options[0]);
  const feedback = preferred
    ? interaction.feedback.preferred
    : mismatch
      ? interaction.feedback[mismatch.id]
      : "";
  const orderedOptions = orderCaregiverChoices(
    group.options,
    "module-2-permission-builder",
    index,
    0,
  );

  return (
    <section
      className={styles.sorter}
      data-core-application="true"
      data-interaction-id={interaction.id}
      data-submitted={submitted ? "true" : "false"}
    >
      <div className={styles.sorterTop}>
        <span>
          Part {index + 1} of {interaction.groups.length}
        </span>
        <StepNavigator
          completed={(partIndex) => Boolean(parts[interaction.groups[partIndex]!.id])}
          completionLabel="selected"
          count={interaction.groups.length}
          current={index}
          label="Offer part"
          onSelect={setIndex}
        />
      </div>
      <h3>{group.label}</h3>
      <div className={styles.sortChoices} role="radiogroup" aria-label={group.label}>
        {orderedOptions.map(({ value: option }) => (
          <button
            aria-checked={chosen === option}
            className={chosen === option ? styles.choiceSelected : undefined}
            data-result={
              submitted && chosen === option
                ? option === group.options[0]
                  ? "correct"
                  : "incorrect"
                : undefined
            }
            key={option}
            onClick={() => {
              setParts((current) => ({ ...current, [group.id]: option }));
              setSubmitted(false);
            }}
            role="radio"
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
      <div className={styles.builtReply} aria-live="polite">
        <span>Your offer</span>
        <h3>{assembledOffer}</h3>
      </div>
      <div className={`${styles.miniNavigation} ${styles.builderNavigation}`}>
        <button disabled={index === 0} onClick={() => setIndex(index - 1)} type="button">
          Previous
        </button>
        {index < interaction.groups.length - 1 ? (
          <button disabled={!chosen} onClick={() => setIndex(index + 1)} type="button">
            Next part
          </button>
        ) : (
          <button disabled={!complete} onClick={reviewOffer} type="button">
            Review offer
          </button>
        )}
      </div>
      {complete && speechAvailable ? (
        <button className={styles.secondaryAction} onClick={readOffer} type="button">
          <Volume2 aria-hidden="true" size={16} /> Read offer
        </button>
      ) : null}
      {submitted ? (
        <div
          className={styles.sortFeedback}
          data-result={preferred ? "correct" : "incorrect"}
          role="status"
        >
          <strong>{preferred ? "Correct." : "Incorrect."}</strong>
          <p>{feedback}</p>
        </div>
      ) : null}
    </section>
  );
}

const appointmentRoles = [
  { label: "Listen", copy: "Stay quiet unless Andre asks for something else." },
  { label: "Take notes", copy: "Write down only what Andre wants recorded." },
  { label: "Ask one question", copy: "Use a question Andre chose before the visit." },
  { label: "Wait outside", copy: "A ride does not automatically include the appointment." },
] as const;

function AppointmentRoles() {
  const [selected, setSelected] = useState(0);
  const role = appointmentRoles[selected]!;
  return (
    <section className={styles.reasonMap} aria-label="Possible appointment roles">
      <div className={styles.reasonCloud} role="tablist">
        {appointmentRoles.map((item, index) => (
          <button
            aria-selected={selected === index}
            key={item.label}
            onClick={() => setSelected(index)}
            role="tab"
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className={styles.reasonPanel} role="tabpanel">
        <span>One possible role</span>
        <h3>{role.label}</h3>
        <p>{role.copy}</p>
      </div>
    </section>
  );
}

const sharingQuestions = [
  { label: "What", copy: "What information can be shared?" },
  { label: "Who", copy: "Who can receive it?" },
  { label: "Why", copy: "What is the specific purpose?" },
] as const;

function SharingScope() {
  const [index, setIndex] = useState(0);
  return (
    <section className={styles.thoughtPath} aria-label="Three questions before sharing">
      <div className={styles.pathButtons} role="tablist">
        {sharingQuestions.map((item, itemIndex) => (
          <button
            aria-selected={index === itemIndex}
            key={item.label}
            onClick={() => setIndex(itemIndex)}
            role="tab"
            type="button"
          >
            <span>{itemIndex + 1}</span> {item.label}
          </button>
        ))}
      </div>
      <div className={styles.thoughtPanel} role="tabpanel">
        <span>Before sharing</span>
        <h3>{sharingQuestions[index]!.copy}</h3>
        <p>Access to information is a separate agreement.</p>
      </div>
    </section>
  );
}

function RefusalPath() {
  const interaction = caregiverModule2.interactions.refusal;
  const { markInteractionSubmitted } = useCaregiverSession();
  const [first, setFirst] = useState("");
  const [firstReviewed, setFirstReviewed] = useState(false);
  const [second, setSecond] = useState("");
  const [closed, setClosed] = useState(false);
  const firstChoice = interaction.firstChoices.find((choice) => choice.id === first);
  const secondOpen = firstReviewed && first === "accept";
  const firstCorrect = first === "accept";
  const secondCorrect = second === interaction.secondChoices[0];
  const orderedFirstChoices = orderCaregiverChoices(
    interaction.firstChoices,
    "module-2-refusal-first",
    0,
    interaction.firstChoices.findIndex((choice) => choice.id === "accept"),
  );
  const orderedSecondChoices = orderCaregiverChoices(
    interaction.secondChoices,
    "module-2-refusal-second",
    1,
    0,
  );

  function close() {
    if (!second) return;
    setClosed(true);
    markInteractionSubmitted(interaction.id);
  }

  return (
    <section className={styles.quickCheck} data-interaction-id={interaction.id}>
      <div className={styles.checkCount}>
        <span>{secondOpen ? "Two weeks later" : "Right after no"}</span>
      </div>
      {!secondOpen ? (
        <>
          <h3>{interaction.prompt}</h3>
          <div
            className={styles.checkChoices}
            role="radiogroup"
            aria-label="Choose Leah's response"
          >
            {orderedFirstChoices.map(({ value: choice }) => (
              <button
                aria-checked={first === choice.id}
                data-result={
                  firstReviewed && first === choice.id
                    ? firstCorrect
                      ? "correct"
                      : "incorrect"
                    : undefined
                }
                key={choice.id}
                onClick={() => {
                  setFirst(choice.id);
                  setFirstReviewed(false);
                  setClosed(false);
                }}
                role="radio"
                type="button"
              >
                {choice.label}
              </button>
            ))}
          </div>
          <button
            className={`${styles.primaryAction} ${styles.activityAction}`}
            disabled={!first}
            onClick={() => setFirstReviewed(true)}
            type="button"
          >
            Review response
          </button>
          {firstReviewed && firstChoice ? (
            <p
              className={styles.inlineFeedback}
              data-result={firstCorrect ? "correct" : "incorrect"}
              role="status"
            >
              <strong>{firstCorrect ? "Correct." : "Incorrect."}</strong>
              {firstChoice.feedback}
            </p>
          ) : null}
        </>
      ) : (
        <>
          <h3>{interaction.secondPrompt}</h3>
          <div
            className={styles.checkChoices}
            role="radiogroup"
            aria-label="Choose a later question"
          >
            {orderedSecondChoices.map(({ value: choice }) => (
              <button
                aria-checked={second === choice}
                data-result={
                  closed && second === choice
                    ? secondCorrect
                      ? "correct"
                      : "incorrect"
                    : undefined
                }
                key={choice}
                onClick={() => {
                  setSecond(choice);
                  setClosed(false);
                }}
                role="radio"
                type="button"
              >
                {choice}
              </button>
            ))}
          </div>
          <button
            className={`${styles.primaryAction} ${styles.activityAction}`}
            disabled={!second}
            onClick={close}
            type="button"
          >
            Continue
          </button>
          {closed ? (
            <div
              className={styles.sortFeedback}
              data-result={secondCorrect ? "correct" : "incorrect"}
              role="status"
            >
              <strong>{secondCorrect ? "Correct." : "Incorrect."}</strong>
              <p>{interaction.consequence}</p>
              {second !== interaction.secondChoices[0] ? (
                <p>{interaction.secondChoiceFallback}</p>
              ) : null}
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}

type RepairLineId = (typeof caregiverModule2.interactions.repair.lines)[number]["id"];

function RepairBuilder() {
  const interaction = caregiverModule2.interactions.repair;
  const { markInteractionSubmitted } = useCaregiverSession();
  const [sequence, setSequence] = useState<readonly RepairLineId[]>([]);
  const [feedback, setFeedback] = useState("");
  const [feedbackCorrect, setFeedbackCorrect] = useState(false);
  const complete = sequence.length === interaction.preferredOrder.length;
  const expected = interaction.preferredOrder[sequence.length];
  const remainingLines = interaction.lines.filter((line) => !sequence.includes(line.id));
  const orderedLines = orderCaregiverChoices(
    remainingLines,
    "module-2-repair-builder",
    sequence.length,
    expected ? remainingLines.findIndex((line) => line.id === expected) : undefined,
  );

  function choose(id: RepairLineId) {
    if (complete || sequence.includes(id)) return;
    if (id === "defense") {
      setFeedback(interaction.feedback.defense);
      setFeedbackCorrect(false);
      return;
    }
    if (id !== expected) {
      setFeedback(interaction.feedback.fallback);
      setFeedbackCorrect(false);
      return;
    }
    const next = [...sequence, id];
    setSequence(next);
    setFeedback("That is the correct next line.");
    setFeedbackCorrect(true);
    if (next.length === interaction.preferredOrder.length) {
      markInteractionSubmitted(interaction.id);
      setFeedback(interaction.feedback.preferred);
    }
  }

  return (
    <section className={styles.sorter} data-interaction-id={interaction.id}>
      <div className={styles.sorterTop}>
        <span>
          Step {Math.min(sequence.length + 1, interaction.preferredOrder.length)} of{" "}
          {interaction.preferredOrder.length}
        </span>
        <div aria-label={`${sequence.length} repair steps assembled`}>
          {interaction.preferredOrder.map((id) => (
            <i data-complete={sequence.includes(id) ? "true" : undefined} key={id} />
          ))}
        </div>
      </div>
      <h3>
        {complete
          ? "Repair assembled"
          : caregiverModule2.sections.repair.steps[sequence.length]?.label}
      </h3>
      <div className={styles.sortChoices} role="group" aria-label="Repair lines">
        {orderedLines.map(({ value: line }) => (
          <button key={line.id} onClick={() => choose(line.id)} type="button">
            {line.copy}
          </button>
        ))}
      </div>
      {feedback ? (
        <p
          className={styles.inlineFeedback}
          data-result={feedbackCorrect ? "correct" : "incorrect"}
          role="status"
        >
          <strong>{feedbackCorrect ? "Correct." : "Incorrect."}</strong>
          {feedback}
        </p>
      ) : null}
      {sequence.length ? (
        <div className={styles.builtReply}>
          <span>Your repair</span>
          <h3>
            {sequence
              .map((id) => interaction.lines.find((line) => line.id === id)?.copy)
              .join(". ")}
            .
          </h3>
        </div>
      ) : null}
      <button
        className={styles.secondaryAction}
        disabled={!sequence.length}
        onClick={() => {
          setSequence([]);
          setFeedback("");
          setFeedbackCorrect(false);
        }}
        type="button"
      >
        <RotateCcw aria-hidden="true" size={16} /> Start over
      </button>
    </section>
  );
}

function BoundaryCompare() {
  const section = caregiverModule2.sections.boundaries;
  const [selected, setSelected] = useState<"usable" | "punitive">("usable");
  return (
    <section className={styles.knownUnknown} aria-label="Compare two supporter boundaries">
      <div className={styles.switchTabs} role="tablist">
        <button
          aria-selected={selected === "usable"}
          onClick={() => setSelected("usable")}
          role="tab"
          type="button"
        >
          Names capacity
        </button>
        <button
          aria-selected={selected === "punitive"}
          onClick={() => setSelected("punitive")}
          role="tab"
          type="button"
        >
          Uses help to pressure
        </button>
      </div>
      <div className={styles.knownPanel} role="tabpanel">
        <h3>{selected === "usable" ? "A usable boundary" : "A punitive boundary"}</h3>
        <p>{selected === "usable" ? section.usableBoundary : section.punitiveBoundary}</p>
        <p>{section.explanation}</p>
      </div>
    </section>
  );
}

const agreementParts = [
  { label: "Specific", copy: "Name one action instead of a broad role." },
  { label: "Declinable", copy: "No should not trigger guilt, argument, or repeated asking." },
  { label: "Revisable", copy: "A past yes can be changed or withdrawn." },
] as const;

function ReliableSupportDiagram() {
  const [selected, setSelected] = useState(0);
  return (
    <section className={styles.timing} aria-label="Three parts of a reliable agreement">
      <div className={styles.timelineTabs} role="tablist">
        {agreementParts.map((item, index) => (
          <button
            aria-selected={selected === index}
            key={item.label}
            onClick={() => setSelected(index)}
            role="tab"
            type="button"
          >
            <span>{index + 1}</span> {item.label}
          </button>
        ))}
      </div>
      <div className={styles.timingPanel} role="tabpanel">
        <h3>{agreementParts[selected]!.label}</h3>
        <p>{agreementParts[selected]!.copy}</p>
      </div>
    </section>
  );
}

function QuickCheck() {
  const questions = caregiverModule2.questions;
  const { setKeyIdeaUnderstood } = useCaregiverSession();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const question = questions[index]!;
  const answer = answers[question.id];

  function review() {
    if (answer === undefined) return;
    const attempt = (attempts[question.id] ?? 0) + 1;
    const nextReviewed = { ...reviewed, [question.id]: true };
    setAttempts((current) => ({ ...current, [question.id]: attempt }));
    setReviewed(nextReviewed);
    if (Object.values(nextReviewed).filter(Boolean).length === questions.length) {
      setKeyIdeaUnderstood(questions.every((item) => answers[item.id] === item.preferredIndex));
    }
  }

  const currentAnswer = answers[question.id];
  const currentReviewed = Boolean(reviewed[question.id]);
  const correct = currentAnswer === question.preferredIndex;
  const assisted = (attempts[question.id] ?? 0) >= 3 && currentAnswer !== question.preferredIndex;
  const orderedChoices = orderCaregiverChoices(
    question.choices,
    "module-2-quick-check",
    index,
    question.preferredIndex,
  );

  return (
    <section className={styles.quickCheck} aria-labelledby="module-2-check-heading">
      <div className={styles.checkCount}>
        <span>
          Question {index + 1} of {questions.length}
        </span>
        <StepNavigator
          completed={(questionIndex) => Boolean(reviewed[questions[questionIndex]!.id])}
          count={questions.length}
          current={index}
          label="Question"
          onSelect={setIndex}
        />
      </div>
      <h3 id="module-2-check-heading">{question.question}</h3>
      <div className={styles.checkChoices} role="radiogroup" aria-label="Choose an answer">
        {orderedChoices.map(({ originalIndex: choiceIndex, value: choice }) => (
          <button
            aria-checked={currentAnswer === choiceIndex}
            data-result={
              currentReviewed && currentAnswer === choiceIndex
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
        disabled={currentReviewed ? index === questions.length - 1 : currentAnswer === undefined}
        onClick={() => {
          if (currentReviewed) {
            setIndex(index + 1);
            return;
          }
          review();
        }}
        type="button"
      >
        {currentReviewed
          ? index === questions.length - 1
            ? "Answer reviewed"
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

function PhraseBrowser() {
  const scripts = caregiverModule2.scripts;
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

function TakeawayDiagram() {
  const steps = [
    { label: "Offer", copy: "Name one action." },
    { label: "Leave room", copy: "Make no easy." },
    { label: "Check again", copy: "Let the agreement change." },
  ] as const;
  return (
    <ol className={styles.takeawayDiagram} aria-label="Three steps to remember">
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

interface Scene {
  readonly id: string;
  readonly title: string;
  readonly moment: string;
  readonly body: ReactNode;
  readonly visual: ReactNode;
  readonly continueLabel: string;
}

export function Module2Experience() {
  const { progress, markCentralIdeaReached, markTakeawayViewed } = useCaregiverSession();
  const [current, setCurrent] = useState(0);
  const [complete, setComplete] = useState(false);
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
      id: "kitchen",
      moment: "Saturday morning",
      title: "Help starts to feel like checking.",
      body: <p>Leah is worried. Andre wants the questions to stop.</p>,
      visual: <ScenarioSequence end={5} start={0} />,
      continueLabel: "See what Leah does next",
    },
    {
      id: "phone",
      moment: "Later that day",
      title: "Concern does not create access.",
      body: <p>A known passcode is not permission to open health information.</p>,
      visual: <ScenarioSequence end={10} start={5} />,
      continueLabel: "Separate intention from impact",
    },
    {
      id: "intention-impact",
      moment: "Both can be real",
      title: "Good intention does not settle impact.",
      body: <p>Map what Leah may mean and what the action may create.</p>,
      visual: <IntentionImpactMap />,
      continueLabel: "Find the boundary signals",
    },
    {
      id: "signals",
      moment: "Four useful checks",
      title: "The details decide whether help fits.",
      body: <p>The topic alone does not make an action supportive.</p>,
      visual: <BoundarySignals />,
      continueLabel: "Practice the distinction",
    },
    {
      id: "continuum",
      moment: "Six short situations",
      title: "Support can shift into control.",
      body: <p>Classify each action using permission, privacy, repetition, and choice.</p>,
      visual: <SupportContinuum />,
      continueLabel: "Build a clear agreement",
    },
    {
      id: "permission-questions",
      moment: "Before saying yes",
      title: "Permission should answer five questions.",
      body: <p>Tap through the details that keep an offer clear.</p>,
      visual: <PermissionQuestions />,
      continueLabel: "Practice a specific offer",
    },
    {
      id: "permission-builder",
      moment: "A ride to an appointment",
      title: "Make the offer easy to decline.",
      body: <p>Choose one opening, action, decline clause, and follow-up.</p>,
      visual: <PermissionBuilder onComplete={() => setCoreComplete(true)} />,
      continueLabel: coreComplete ? "Clarify the appointment role" : "Review your offer",
    },
    {
      id: "appointment-role",
      moment: "If the answer is yes",
      title: "Attendance and role are separate choices.",
      body: <p>An invitation does not decide what happens in the room.</p>,
      visual: <AppointmentRoles />,
      continueLabel: "Protect private information",
    },
    {
      id: "sharing",
      moment: "Before telling someone else",
      title: "Sharing needs its own agreement.",
      body: <p>Ask what, who, and why before disclosing information.</p>,
      visual: <SharingScope />,
      continueLabel: "Practice hearing no",
    },
    {
      id: "refusal",
      moment: "Andre declines reminders",
      title: "No should not start a negotiation.",
      body: <p>Accept the answer before considering any later conversation.</p>,
      visual: <RefusalPath />,
      continueLabel: "Repair an overstep",
    },
    {
      id: "repair",
      moment: "After opening the app",
      title: "Repair names the action first.",
      body: <p>Build the apology in a usable order and leave out the defense.</p>,
      visual: <RepairBuilder />,
      continueLabel: "Set a supporter boundary",
    },
    {
      id: "supporter-boundary",
      moment: "Support has limits too",
      title: "Capacity is not punishment.",
      body: <p>A boundary states what you can do without controlling the other person.</p>,
      visual: <BoundaryCompare />,
      continueLabel: "Make support reliable",
    },
    {
      id: "reliable-support",
      moment: "A clear agreement",
      title: "Reliable help leaves room.",
      body: <p>Dependability and autonomy can exist together.</p>,
      visual: <ReliableSupportDiagram />,
      continueLabel: "Check your understanding",
    },
    {
      id: "quick-check",
      moment: "Three short situations",
      title: "Keep each yes inside its scope.",
      body: <p>Choose the response that preserves permission and privacy.</p>,
      visual: <QuickCheck />,
      continueLabel: "Browse useful phrases",
    },
    {
      id: "phrases",
      moment: "Language to borrow",
      title: "Use the sentence that fits.",
      body: <p>You do not need to memorize the wording.</p>,
      visual: <PhraseBrowser />,
      continueLabel: "See the takeaway",
    },
    {
      id: "takeaway",
      moment: "Keep help inside the agreement",
      title: "Offer. Leave room. Check again.",
      body: <p>Caring intention does not create access or authority.</p>,
      visual: <TakeawayDiagram />,
      continueLabel: "Finish module",
    },
  ];

  const scene = scenes[current]!;
  const nextDisabled = current === 6 && !coreComplete;

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
    setComplete(true);
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
    setComplete(false);
    window.requestAnimationFrame(() => {
      articleRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
      headingRef.current?.focus({ preventScroll: true });
    });
  }

  function reviewPractice() {
    setCurrent(6);
    setComplete(false);
    window.requestAnimationFrame(() => {
      articleRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
      headingRef.current?.focus({ preventScroll: true });
    });
  }

  return (
    <main
      className={`${styles.page} ${styles.moduleTwo}`}
      data-caregiver-module={caregiverModule2.id}
    >
      <Link className={styles.backLink} href="/caregiver">
        <ArrowLeft aria-hidden="true" size={17} /> Caregiver modules
      </Link>
      {complete ? (
        <article className={styles.completion} ref={articleRef}>
          <p>Caregiver module 2</p>
          <h1 ref={headingRef} tabIndex={-1}>
            Finished
          </h1>
          <p>A specific offer protects both the help and the relationship.</p>
          <div className={styles.completionTakeaway}>
            <span>In short</span>
            <strong>Offer one action, make no easy, and let the agreement change.</strong>
          </div>
          {!completed ? (
            <div className={styles.incompleteNote} role="status">
              <strong>One practice is still open.</strong>
              <p>Review the four-part permission offer to finish the module.</p>
              <button onClick={reviewPractice} type="button">
                Review the offer
              </button>
            </div>
          ) : null}
          <div className={styles.completionActions}>
            <Link
              className={styles.primaryAction}
              href={caregiverModuleRegistry["everyday-support-that-actually-helps"].route}
            >
              Continue to module 3
            </Link>
            <button className={styles.secondaryAction} onClick={restart} type="button">
              <RotateCcw aria-hidden="true" size={16} /> Review again
            </button>
            <Link className={styles.secondaryAction} href="/caregiver">
              Back to caregiver modules
            </Link>
          </div>
          <p className={styles.disclosure}>
            Leah and Andre are illustrative characters. This module supports communication and
            boundary skills; it does not replace medical, legal, or emergency guidance.
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
          {nextDisabled ? (
            <p className={styles.gateNote} id="module-2-next-requirement" role="status">
              Build and review all four parts of the offer to continue.
            </p>
          ) : null}
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
              <button
                aria-describedby={nextDisabled ? "module-2-next-requirement" : undefined}
                className={styles.next}
                disabled={nextDisabled}
                onClick={() => goTo(current + 1)}
                type="button"
              >
                {scene.continueLabel}{" "}
                {nextDisabled ? (
                  <LockKeyhole aria-hidden="true" size={17} />
                ) : (
                  <ArrowRight aria-hidden="true" size={18} />
                )}
              </button>
            )}
          </nav>
        </article>
      )}
    </main>
  );
}
