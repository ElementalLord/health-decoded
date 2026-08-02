"use client";

import { useRef, useState, type FormEvent } from "react";

import { CaregiverFeedback } from "../../foundation/caregiver-feedback";
import { caregiverModule2 } from "../../../content/caregiver-module-2";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-2.module.css";

const emptyParts = Object.fromEntries(
  caregiverModule2.interactions.permissionBuilder.groups.map((group) => [group.id, ""]),
) as Record<string, string>;

export function PermissionLanguageBuilder() {
  const interaction = caregiverModule2.interactions.permissionBuilder;
  const { markInteractionSubmitted } = useCaregiverSession();
  const [parts, setParts] = useState<Record<string, string>>(emptyParts);
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [assistedParts, setAssistedParts] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [readCount, setReadCount] = useState(0);
  const firstSelectRef = useRef<HTMLSelectElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const offerIsComplete = interaction.groups.every((group) => Boolean(parts[group.id]));
  const assembledOffer = offerIsComplete
    ? `${parts.opening} ${parts.action}? ${parts.decline}. ${parts.followup}.`
    : "";
  const mismatchedGroup = interaction.groups.find((group) => parts[group.id] !== group.options[0]);
  const feedback = mismatchedGroup
    ? interaction.feedback[mismatchedGroup.id as keyof typeof interaction.feedback]
    : interaction.feedback.preferred;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formRef.current?.reportValidity()) return;
    const nextParts = { ...parts };
    const nextAttempts = { ...attempts };
    const nextAssistedParts: Record<string, boolean> = {};
    interaction.groups.forEach((group) => {
      if (parts[group.id] !== group.options[0]) {
        const attempt = (nextAttempts[group.id] ?? 0) + 1;
        nextAttempts[group.id] = attempt;
        if (attempt >= 3) {
          nextParts[group.id] = group.options[0];
          nextAssistedParts[group.id] = true;
        }
      }
    });
    setParts(nextParts);
    setAttempts(nextAttempts);
    setAssistedParts(nextAssistedParts);
    setSubmitted(true);
    setSubmissionCount((count) => count + 1);
    markInteractionSubmitted(interaction.id);
  }

  function revise() {
    setSubmitted(false);
    firstSelectRef.current?.focus();
  }

  return (
    <section
      className={styles.permissionBuilder}
      aria-labelledby={`${interaction.id}-heading`}
      data-interaction-id={interaction.id}
      data-core-application="true"
      data-submitted={submitted ? "true" : "false"}
    >
      <div className={styles.builderHeading}>
        <p className={styles.sectionLabel}>Core application · permission builder</p>
        <h2 id={`${interaction.id}-heading`}>{interaction.title}</h2>
        <p>{interaction.prompt}</p>
      </div>
      <form ref={formRef} onSubmit={submit}>
        <div className={styles.builderSentence} aria-hidden="true">
          {interaction.groups.map((group, index) => (
            <span key={group.id} data-empty={parts[group.id] ? "false" : "true"}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {parts[group.id] || group.label}
            </span>
          ))}
        </div>
        <div className={styles.builderControls}>
          {interaction.groups.map((group, index) => (
            <label key={group.id}>
              <span>{group.label}</span>
              <select
                ref={index === 0 ? firstSelectRef : undefined}
                required
                value={parts[group.id]}
                onChange={(event) => {
                  const value = event.currentTarget.value;
                  setParts((current) => ({
                    ...current,
                    [group.id]: value,
                  }));
                  setSubmitted(false);
                }}
              >
                <option value="" disabled>
                  {group.label}
                </option>
                {group.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {assistedParts[group.id] ? (
                <span className={styles.answerAssist}>Answer filled in after three attempts.</span>
              ) : null}
            </label>
          ))}
        </div>
        <div className={styles.interactionActions}>
          <button className={styles.primaryAction} type="submit">
            {interaction.submit}
          </button>
          <button
            className={styles.textAction}
            type="button"
            disabled={!offerIsComplete}
            onClick={() => setReadCount((count) => count + 1)}
          >
            {interaction.read}
          </button>
          {submitted ? (
            <button className={styles.textAction} type="button" onClick={revise}>
              Revise
            </button>
          ) : null}
        </div>
      </form>
      <p key={readCount} className={styles.srOnly} aria-live="polite" aria-atomic="true">
        {readCount > 0 ? assembledOffer : ""}
      </p>
      {submitted ? (
        <CaregiverFeedback
          key={submissionCount}
          focusWhen
          heading={interaction.learningPoint}
          tone="supportive"
        >
          <p className={mismatchedGroup ? styles.answerNeedsReview : styles.answerConfirmed}>
            {mismatchedGroup
              ? "This response needs review."
              : "This response is ready to continue."}
          </p>
          <p>{feedback}</p>
          <p className={styles.offerReview}>{assembledOffer}</p>
        </CaregiverFeedback>
      ) : null}
    </section>
  );
}
