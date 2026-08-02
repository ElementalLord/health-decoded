"use client";

import { useState } from "react";
import { CaregiverFeedback } from "../../foundation/caregiver-feedback";
import { caregiverModule5 } from "../../../content/caregiver-module-5";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-5.module.css";

export function SustainabilityComparison() {
  const item = caregiverModule5.interactions.sustainability;
  const [selected, setSelected] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [assisted, setAssisted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { markInteractionSubmitted } = useCaregiverSession();
  const correct = item.choices.every((choice) => selected.includes(choice.id) === choice.preferred);
  return (
    <section
      className={styles.comparison}
      data-interaction-id={item.id}
      data-core-application="false"
      aria-labelledby={`${item.id}-heading`}
    >
      <h2 id={`${item.id}-heading`}>{item.title}</h2>
      <p>{item.prompt}</p>
      <div className={styles.planComparison}>
        <div>
          <h3>Plan A</h3>
          <p>{item.planA}</p>
        </div>
        <div>
          <h3>Plan B</h3>
          <p>{item.planB}</p>
        </div>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const nextAttempt = attempts + (correct ? 0 : 1);
          setAttempts(nextAttempt);
          if (!correct && nextAttempt >= 3) {
            setSelected(
              item.choices.filter((choice) => choice.preferred).map((choice) => choice.id),
            );
            setAssisted(true);
          }
          setSubmitted(true);
          markInteractionSubmitted(item.id);
        }}
      >
        <fieldset>
          <legend>Differences that reduce dependence on one person</legend>
          <div className={styles.inlineChoices}>
            {item.choices.map((choice) => (
              <label key={choice.id}>
                <input
                  type="checkbox"
                  checked={selected.includes(choice.id)}
                  onChange={() => {
                    setSelected((current) =>
                      current.includes(choice.id)
                        ? current.filter((id) => id !== choice.id)
                        : [...current, choice.id],
                    );
                    setSubmitted(false);
                  }}
                />
                <span>{choice.copy}</span>
                {submitted ? (
                  <small
                    className={
                      selected.includes(choice.id) === choice.preferred
                        ? styles.correct
                        : styles.needsReview
                    }
                  >
                    {selected.includes(choice.id) === choice.preferred
                      ? "This difference fits."
                      : "This difference needs review."}
                  </small>
                ) : null}
              </label>
            ))}
          </div>
        </fieldset>
        <div className={styles.actions}>
          <button className={styles.primaryAction} type="submit">
            Compare the plans
          </button>
        </div>
      </form>
      {submitted ? (
        <CaregiverFeedback
          focusWhen
          heading={correct ? "Comparison reviewed" : "Comparison needs review"}
          tone={correct ? "supportive" : "warning"}
        >
          <p>{selected.includes("control") ? item.feedback.control : item.feedback.preferred}</p>
          <p>{item.learningPoint}</p>
          {assisted ? <p>Answer filled in after three attempts.</p> : null}
        </CaregiverFeedback>
      ) : null}
    </section>
  );
}
