"use client";

import { useRef, useState } from "react";
import { CaregiverFeedback } from "../../foundation/caregiver-feedback";
import { caregiverModule4 } from "../../../content/caregiver-module-4";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-4.module.css";

export function ContextOrganizer() {
  const item = caregiverModule4.interactions.context;
  const firstRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [assisted, setAssisted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [count, setCount] = useState(0);
  const { markInteractionSubmitted } = useCaregiverSession();
  const preferred = item.choices.filter((choice) => choice.preferred).map((choice) => choice.id);
  const correct =
    selected.length === preferred.length && preferred.every((id) => selected.includes(id));
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
          const nextAttempt = attempts + (correct ? 0 : 1);
          setAttempts(nextAttempt);
          if (!correct && nextAttempt >= 3) {
            setSelected(preferred);
            setAssisted(true);
          }
          setSubmitted(true);
          setCount((n) => n + 1);
          markInteractionSubmitted(item.id);
        }}
      >
        <fieldset>
          <legend>Details for the initial summary</legend>
          <div className={styles.choiceGrid}>
            {item.choices.map((choice, index) => (
              <label key={choice.id}>
                <input
                  ref={index === 0 ? firstRef : undefined}
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
                      ? "This choice fits."
                      : "This choice needs review."}
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
          {submitted ? (
            <button
              className={styles.textAction}
              type="button"
              onClick={() => {
                setSubmitted(false);
                firstRef.current?.focus();
              }}
            >
              Revise
            </button>
          ) : null}
        </div>
      </form>
      {submitted ? (
        <CaregiverFeedback
          key={count}
          focusWhen
          heading={correct ? "Summary reviewed" : "Summary needs review"}
          tone={correct ? "supportive" : "warning"}
        >
          <p>
            {selected.includes("diagnosis")
              ? item.feedback.diagnosis
              : selected.includes("judgment")
                ? item.feedback.judgment
                : item.feedback.preferred}
          </p>
          <p>{item.learningPoint}</p>
          {assisted ? <p>Answer filled in after three attempts.</p> : null}
        </CaregiverFeedback>
      ) : null}
    </section>
  );
}
