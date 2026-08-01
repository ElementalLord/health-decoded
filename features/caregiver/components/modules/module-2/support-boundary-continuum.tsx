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
  const [submitted, setSubmitted] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formRef.current?.reportValidity()) return;
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
            <fieldset key={behavior.id} className={styles.behaviorRow}>
              <legend>{behavior.copy}</legend>
              <label>
                <span>Closest category</span>
                <select
                  required
                  value={placements[behavior.id] ?? ""}
                  onChange={(event) => {
                    setPlacements((current) => ({
                      ...current,
                      [behavior.id]: event.currentTarget.value,
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
                <p className={styles.itemFeedback} role="status">
                  <strong>{behavior.preferredCategory}.</strong> {behavior.feedback}
                </p>
              ) : null}
            </fieldset>
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
        </CaregiverFeedback>
      ) : null}
    </section>
  );
}
