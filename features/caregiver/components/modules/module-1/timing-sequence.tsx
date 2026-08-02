"use client";

import { useRef, useState } from "react";
import { CaregiverFeedback } from "../../foundation/caregiver-feedback";
import { caregiverModule1 } from "../../../content/caregiver-module-1";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-1.module.css";

export function TimingSequence() {
  const interaction = caregiverModule1.interactions.timing;
  const firstChoiceRef = useRef<HTMLInputElement>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);
  const { markInteractionSubmitted } = useCaregiverSession();
  const complete = interaction.moments.every((moment) => answers[moment.id]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!complete) return;
    setSubmitted(true);
    setSubmissionCount((count) => count + 1);
    markInteractionSubmitted(interaction.id);
  }

  return (
    <section
      className={styles.timeline}
      data-interaction-id={interaction.id}
      data-optional-practice="true"
      aria-labelledby={`${interaction.id}-heading`}
    >
      <h2 id={`${interaction.id}-heading`}>{interaction.title}</h2>
      <p>{interaction.prompt}</p>
      <form onSubmit={submit}>
        <ol className={styles.timelineStops}>
          {interaction.moments.map((moment, momentIndex) => (
            <li key={moment.id}>
              <fieldset>
                <legend>{moment.label}</legend>
                {moment.choices.map((choice, choiceIndex) => (
                  <label key={choice.id}>
                    <input
                      ref={momentIndex === 0 && choiceIndex === 0 ? firstChoiceRef : undefined}
                      type="radio"
                      name={`${interaction.id}-${moment.id}`}
                      value={choice.id}
                      checked={answers[moment.id] === choice.id}
                      onChange={(event) => {
                        const value = event.currentTarget.value;
                        setAnswers((current) => ({ ...current, [moment.id]: value }));
                        setSubmitted(false);
                      }}
                    />
                    <span>{choice.copy}</span>
                  </label>
                ))}
                {submitted ? (
                  <p className={styles.inlineFeedback}>
                    {moment.choices.find((choice) => choice.id === answers[moment.id])?.feedback}
                  </p>
                ) : null}
              </fieldset>
            </li>
          ))}
        </ol>
        <div className={styles.interactionActions}>
          <button className={styles.primaryAction} type="submit" disabled={!complete}>
            {interaction.submit}
          </button>
          {submitted ? (
            <button
              className={styles.textAction}
              type="button"
              onClick={() => {
                setSubmitted(false);
                firstChoiceRef.current?.focus();
              }}
            >
              Revise
            </button>
          ) : null}
        </div>
      </form>
      {submitted ? (
        <CaregiverFeedback key={submissionCount} focusWhen heading="Timing reviewed">
          <p>{interaction.learningPoint}</p>
        </CaregiverFeedback>
      ) : null}
    </section>
  );
}
