"use client";

import { useState, type FormEvent } from "react";

import { CaregiverFeedback } from "../../foundation/caregiver-feedback";
import { caregiverModule3 } from "../../../content/caregiver-module-3";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-3.module.css";

export function RoutineComparison() {
  const interaction = caregiverModule3.interactions.routines;
  const { markInteractionSubmitted } = useCaregiverSession();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const complete = interaction.pairs.every((pair) => Boolean(answers[pair.id]));
  const allPreferred = interaction.pairs.every((pair) => answers[pair.id] === pair.preferredOption);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!complete) return;
    setSubmitted(true);
    markInteractionSubmitted(interaction.id);
  }

  return (
    <section
      className={styles.routines}
      data-interaction-id={interaction.id}
      data-optional-practice="true"
      data-submitted={submitted ? "true" : "false"}
      aria-labelledby={`${interaction.id}-heading`}
    >
      <h2 id={`${interaction.id}-heading`}>{interaction.title}</h2>
      <p>{interaction.prompt}</p>
      <form onSubmit={submit}>
        <ol className={styles.routinePairs}>
          {interaction.pairs.map((pair) => {
            const needsReview = submitted && answers[pair.id] !== pair.preferredOption;
            return (
              <li key={pair.id} className={styles.routinePair}>
                <h3>{pair.topic}</h3>
                <div className={styles.routineVersions}>
                  <p>
                    <strong>A</strong> {pair.a}
                  </p>
                  <p>
                    <strong>B</strong> {pair.b}
                  </p>
                </div>
                <fieldset className={styles.routineOptions}>
                  <legend>What changes organization into monitoring?</legend>
                  {interaction.options.map((option) => (
                    <label key={option}>
                      <input
                        type="radio"
                        name={pair.id}
                        value={option}
                        checked={answers[pair.id] === option}
                        onChange={(event) => {
                          const value = event.currentTarget.value;
                          setAnswers((current) => ({
                            ...current,
                            [pair.id]: value,
                          }));
                          setSubmitted(false);
                        }}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </fieldset>
                {needsReview ? (
                  <p className={styles.answerNeedsReview}>
                    This comparison needs review. Focus on {pair.preferredOption} in this pair.
                  </p>
                ) : null}
              </li>
            );
          })}
        </ol>
        <div className={styles.interactionActions}>
          <button className={styles.primaryAction} type="submit" disabled={!complete}>
            {interaction.submit}
          </button>
          {submitted ? (
            <button className={styles.textAction} type="button" onClick={() => setSubmitted(false)}>
              Revise answers
            </button>
          ) : null}
        </div>
      </form>
      {submitted ? (
        <CaregiverFeedback focusWhen heading={interaction.learningPoint} tone="neutral">
          <p>{allPreferred ? interaction.feedback.preferred : interaction.feedback.incorrect}</p>
        </CaregiverFeedback>
      ) : null}
      <p>{interaction.learningPoint}</p>
    </section>
  );
}
