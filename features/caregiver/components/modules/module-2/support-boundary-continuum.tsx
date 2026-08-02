"use client";

import { useRef, useState, type FormEvent } from "react";

import { CaregiverFeedback } from "../../foundation/caregiver-feedback";
import { caregiverModule2 } from "../../../content/caregiver-module-2";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-2.module.css";

export function SupportBoundaryContinuum() {
  const interaction = caregiverModule2.interactions.continuum;
  const { markInteractionSubmitted } = useCaregiverSession();
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [assistedPlacements, setAssistedPlacements] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formRef.current?.reportValidity()) return;
    const nextPlacements = { ...placements };
    const nextAttempts = { ...attempts };
    const nextAssistedPlacements: Record<string, boolean> = {};
    interaction.behaviors.forEach((behavior) => {
      if (placements[behavior.id] !== behavior.preferredCategory) {
        const attempt = (nextAttempts[behavior.id] ?? 0) + 1;
        nextAttempts[behavior.id] = attempt;
        if (attempt >= 3) {
          nextPlacements[behavior.id] = behavior.preferredCategory;
          nextAssistedPlacements[behavior.id] = true;
        }
      }
    });
    setPlacements(nextPlacements);
    setAttempts(nextAttempts);
    setAssistedPlacements(nextAssistedPlacements);
    setSubmitted(true);
    setSubmissionCount((count) => count + 1);
    markInteractionSubmitted(interaction.id);
  }

  function revise() {
    setSubmitted(false);
    formRef.current?.querySelector<HTMLSelectElement>("select")?.focus();
  }

  return (
    <section
      className={styles.continuum}
      aria-labelledby={`${interaction.id}-heading`}
      data-interaction-id={interaction.id}
      data-submitted={submitted ? "true" : "false"}
    >
      <div className={styles.interactionHeading}>
        <p className={styles.sectionLabel}>Optional practice · relational continuum</p>
        <h2 id={`${interaction.id}-heading`}>{interaction.title}</h2>
        <p>{interaction.prompt}</p>
      </div>
      <ol className={styles.continuumLegend} aria-label="Continuum categories">
        {interaction.categories.map((category, index) => (
          <li key={category}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {category}
          </li>
        ))}
      </ol>
      <form ref={formRef} onSubmit={submit}>
        <div className={styles.behaviorList}>
          {interaction.behaviors.map((behavior) => (
            <div
              key={behavior.id}
              className={styles.behaviorRow}
              role="group"
              aria-labelledby={`${behavior.id}-prompt`}
            >
              <p id={`${behavior.id}-prompt`} className={styles.behaviorPrompt}>
                {behavior.copy}
              </p>
              <label>
                <span>Closest category</span>
                <select
                  required
                  aria-describedby={submitted ? `${behavior.id}-feedback` : undefined}
                  value={placements[behavior.id] ?? ""}
                  onChange={(event) => {
                    const value = event.currentTarget.value;
                    setPlacements((current) => ({
                      ...current,
                      [behavior.id]: value,
                    }));
                    setSubmitted(false);
                  }}
                >
                  <option value="">Choose a category</option>
                  {interaction.categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              {submitted ? (
                <p id={`${behavior.id}-feedback`} className={styles.itemFeedback}>
                  <strong>
                    {placements[behavior.id] === behavior.preferredCategory
                      ? "This response is ready to continue. "
                      : "This response needs review. "}
                  </strong>
                  <strong>{behavior.preferredCategory}.</strong> {behavior.feedback}
                </p>
              ) : null}
              {assistedPlacements[behavior.id] ? (
                <p className={styles.answerAssist}>Answer filled in after three attempts.</p>
              ) : null}
            </div>
          ))}
        </div>
        <div className={styles.interactionActions}>
          <button className={styles.primaryAction} type="submit">
            {interaction.submit}
          </button>
          {submitted ? (
            <button className={styles.textAction} type="button" onClick={revise}>
              {interaction.revise}
            </button>
          ) : null}
        </div>
      </form>
      {submitted ? (
        <CaregiverFeedback key={submissionCount} focusWhen heading="Review complete" tone="neutral">
          <p>{interaction.learningPoint}</p>
          <ul className={styles.srOnly}>
            {interaction.behaviors.map((behavior) => (
              <li key={behavior.id}>
                {behavior.copy}: {behavior.preferredCategory}. {behavior.feedback}
              </li>
            ))}
          </ul>
        </CaregiverFeedback>
      ) : null}
    </section>
  );
}
