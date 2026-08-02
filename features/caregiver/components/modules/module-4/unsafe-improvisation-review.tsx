"use client";

import { useState } from "react";
import { CaregiverFeedback } from "../../foundation/caregiver-feedback";
import { caregiverModule4 } from "../../../content/caregiver-module-4";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-4.module.css";

export function UnsafeImprovisationReview() {
  const item = caregiverModule4.interactions.improvisation;
  const [selected, setSelected] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [assisted, setAssisted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { markInteractionSubmitted } = useCaregiverSession();
  return (
    <section
      className={styles.interaction}
      data-interaction-id={item.id}
      data-core-application="false"
      aria-labelledby={`${item.id}-heading`}
    >
      <h2 id={`${item.id}-heading`}>{item.title}</h2>
      <p>{item.prompt}</p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const correct = item.actions.every(
            (action) => selected.includes(action.id) === action.unsafe,
          );
          const nextAttempt = attempts + (correct ? 0 : 1);
          setAttempts(nextAttempt);
          if (!correct && nextAttempt >= 3) {
            setSelected(item.actions.filter((action) => action.unsafe).map((action) => action.id));
            setAssisted(true);
          }
          setSubmitted(true);
          markInteractionSubmitted(item.id);
        }}
      >
        <fieldset>
          <legend>Actions to review</legend>
          <div className={styles.actionRows}>
            {item.actions.map((action) => (
              <label key={action.id}>
                <input
                  type="checkbox"
                  checked={selected.includes(action.id)}
                  onChange={() => {
                    setSelected((current) =>
                      current.includes(action.id)
                        ? current.filter((id) => id !== action.id)
                        : [...current, action.id],
                    );
                    setSubmitted(false);
                  }}
                />
                <span>{action.copy}</span>
                {submitted ? (
                  <small
                    className={
                      selected.includes(action.id) === action.unsafe
                        ? styles.correct
                        : styles.needsReview
                    }
                  >
                    {action.feedback}
                  </small>
                ) : null}
              </label>
            ))}
          </div>
        </fieldset>
        <div className={styles.actions}>
          <button className={styles.primaryAction} type="submit">
            {item.submit}
          </button>
        </div>
      </form>
      {submitted ? (
        <CaregiverFeedback focusWhen heading="Actions reviewed">
          <p>{item.learningPoint}</p>
          {assisted ? <p>Answer filled in after three attempts.</p> : null}
        </CaregiverFeedback>
      ) : null}
    </section>
  );
}
