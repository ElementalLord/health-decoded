"use client";

import { useRef, useState, type FormEvent } from "react";

import { CaregiverFeedback } from "../../foundation/caregiver-feedback";
import { caregiverModule2 } from "../../../content/caregiver-module-2";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-2.module.css";

const preferredParts = Object.fromEntries(
  caregiverModule2.interactions.permissionBuilder.groups.map((group) => [
    group.id,
    group.options[0],
  ]),
) as Record<string, string>;

export function PermissionLanguageBuilder() {
  const interaction = caregiverModule2.interactions.permissionBuilder;
  const { markInteractionSubmitted } = useCaregiverSession();
  const [parts, setParts] = useState<Record<string, string>>(preferredParts);
  const [submitted, setSubmitted] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [readCount, setReadCount] = useState(0);
  const firstSelectRef = useRef<HTMLSelectElement>(null);

  const assembledOffer = `${parts.opening} ${parts.action}? ${parts.decline}. ${parts.followup}.`;
  const mismatchedGroup = interaction.groups.find((group) => parts[group.id] !== group.options[0]);
  const feedback = mismatchedGroup
    ? interaction.feedback[mismatchedGroup.id as keyof typeof interaction.feedback]
    : interaction.feedback.preferred;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
      <form onSubmit={submit}>
        <div className={styles.builderSentence} aria-hidden="true">
          {interaction.groups.map((group, index) => (
            <span key={group.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {parts[group.id]}
            </span>
          ))}
        </div>
        <div className={styles.builderControls}>
          {interaction.groups.map((group, index) => (
            <label key={group.id}>
              <span>{group.label}</span>
              <select
                ref={index === 0 ? firstSelectRef : undefined}
                value={parts[group.id]}
                onChange={(event) => {
                  setParts((current) => ({
                    ...current,
                    [group.id]: event.currentTarget.value,
                  }));
                  setSubmitted(false);
                }}
              >
                {group.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
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
          <p>{feedback}</p>
          <p className={styles.offerReview}>{assembledOffer}</p>
        </CaregiverFeedback>
      ) : null}
    </section>
  );
}
