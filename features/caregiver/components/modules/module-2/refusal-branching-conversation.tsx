"use client";

import { useRef, useState } from "react";

import { CaregiverFeedback } from "../../foundation/caregiver-feedback";
import { caregiverModule2 } from "../../../content/caregiver-module-2";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-2.module.css";

export function RefusalBranchingConversation() {
  const interaction = caregiverModule2.interactions.refusal;
  const { markInteractionSubmitted } = useCaregiverSession();
  const [firstChoice, setFirstChoice] = useState("");
  const [firstSubmitted, setFirstSubmitted] = useState(false);
  const [firstSubmissionCount, setFirstSubmissionCount] = useState(0);
  const [secondOpen, setSecondOpen] = useState(false);
  const [secondChoice, setSecondChoice] = useState("");
  const [closed, setClosed] = useState(false);
  const firstFeedback = interaction.firstChoices.find(({ id }) => id === firstChoice);
  const secondChoiceIsPreferred = secondChoice === interaction.secondChoices[0];
  const secondHeadingRef = useRef<HTMLHeadingElement>(null);

  function reviewFirst() {
    if (!firstChoice) return;
    setFirstSubmitted(true);
    setFirstSubmissionCount((count) => count + 1);
    setSecondOpen(false);
    setClosed(false);
  }

  function continueBranch() {
    if (firstChoice !== "accept") return;
    setSecondOpen(true);
    requestAnimationFrame(() => secondHeadingRef.current?.focus());
  }

  function closeBranch() {
    if (!secondChoice) return;
    setClosed(true);
    markInteractionSubmitted(interaction.id);
  }

  return (
    <section
      className={styles.branchingConversation}
      aria-labelledby={`${interaction.id}-heading`}
      data-interaction-id={interaction.id}
      data-submitted={closed ? "true" : "false"}
    >
      <div className={styles.interactionHeading}>
        <p className={styles.eyebrow}>Practice · what happens after no</p>
        <h2 id={`${interaction.id}-heading`} tabIndex={-1}>
          No should not cost the relationship.
        </h2>
        <p>
          Permission becomes visible after an answer is given. Argument, guilt, fear, or withdrawal
          can make a no expensive even when the original offer sounded caring.
        </p>
      </div>

      <div className={styles.conversationStage}>
        <p className={styles.conversationLabel}>{interaction.title}</p>
        <blockquote className={styles.andreLine}>{interaction.prompt}</blockquote>
        <fieldset>
          <legend>Choose Leah&apos;s next response.</legend>
          {interaction.firstChoices.map((choice) => (
            <label key={choice.id}>
              <input
                type="radio"
                name="module-2-refusal-first"
                value={choice.id}
                checked={firstChoice === choice.id}
                onChange={() => {
                  setFirstChoice(choice.id);
                  setFirstSubmitted(false);
                  setSecondOpen(false);
                  setSecondChoice("");
                  setClosed(false);
                }}
              />
              <span>{choice.label}</span>
            </label>
          ))}
        </fieldset>
        <button
          className={styles.primaryAction}
          type="button"
          disabled={!firstChoice}
          onClick={reviewFirst}
        >
          {interaction.continue}
        </button>
      </div>

      {firstSubmitted && firstFeedback ? (
        <CaregiverFeedback
          key={firstSubmissionCount}
          focusWhen
          heading={firstFeedback.label}
          tone="neutral"
        >
          <p>{firstFeedback.feedback}</p>
          {firstChoice === "accept" ? (
            <button className={styles.textAction} type="button" onClick={continueBranch}>
              {interaction.continue}
            </button>
          ) : null}
        </CaregiverFeedback>
      ) : null}

      {secondOpen ? (
        <div className={styles.secondBranch}>
          <h3 ref={secondHeadingRef} tabIndex={-1}>
            {interaction.secondPrompt}
          </h3>
          <fieldset>
            <legend>{interaction.secondPrompt}</legend>
            {interaction.secondChoices.map((choice) => (
              <label key={choice}>
                <input
                  type="radio"
                  name="module-2-refusal-second"
                  value={choice}
                  checked={secondChoice === choice}
                  onChange={() => {
                    setSecondChoice(choice);
                    setClosed(false);
                  }}
                />
                <span>{choice}</span>
              </label>
            ))}
          </fieldset>
          <button
            className={styles.primaryAction}
            type="button"
            disabled={!secondChoice}
            onClick={closeBranch}
          >
            {interaction.continue}
          </button>
        </div>
      ) : null}

      {closed ? (
        <div className={styles.branchClose}>
          <CaregiverFeedback focusWhen heading={interaction.learningPoint} tone="neutral">
            <p>{interaction.consequence}</p>
            {!secondChoiceIsPreferred ? <p>{interaction.secondChoiceFallback}</p> : null}
          </CaregiverFeedback>
        </div>
      ) : null}
    </section>
  );
}
