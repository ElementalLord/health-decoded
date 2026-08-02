"use client";

import { useRef, useState } from "react";
import { CaregiverFeedback } from "../../foundation/caregiver-feedback";
import { caregiverModule5 } from "../../../content/caregiver-module-5";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-5.module.css";

export function BoundaryRehearsal() {
  const item = caregiverModule5.interactions.boundaries;
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [assisted, setAssisted] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const firstRef = useRef<HTMLInputElement>(null);
  const { markInteractionSubmitted } = useCaregiverSession();
  const complete = item.statements.every((statement) => answers[statement.id] !== undefined);
  return (
    <section
      className={styles.boundaryPractice}
      data-interaction-id={item.id}
      data-core-application="false"
      aria-labelledby={`${item.id}-heading`}
    >
      <h2 id={`${item.id}-heading`}>{item.title}</h2>
      <p>{item.prompt}</p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!complete) return;
          const next = { ...answers };
          const nextAttempts = { ...attempts };
          const nextAssisted: Record<string, boolean> = {};
          item.statements.forEach((statement) => {
            if (next[statement.id] !== statement.preferred) {
              const attempt = (nextAttempts[statement.id] ?? 0) + 1;
              nextAttempts[statement.id] = attempt;
              if (attempt >= 3) {
                next[statement.id] = statement.preferred;
                nextAssisted[statement.id] = true;
              }
            }
          });
          setAnswers(next);
          setAttempts(nextAttempts);
          setAssisted(nextAssisted);
          setSubmitted(true);
          markInteractionSubmitted(item.id);
        }}
      >
        {item.statements.map((statement, si) => (
          <fieldset key={statement.id}>
            <legend>Original: “{statement.original}”</legend>
            {statement.choices.map((choice, ci) => (
              <label key={choice}>
                <input
                  ref={si === 0 && ci === 0 ? firstRef : undefined}
                  type="radio"
                  name={statement.id}
                  value={ci}
                  checked={answers[statement.id] === ci}
                  onChange={() => {
                    setAnswers((current) => ({ ...current, [statement.id]: ci }));
                    setSubmitted(false);
                  }}
                />
                <span>{choice}</span>
              </label>
            ))}
            {submitted ? (
              <p
                className={
                  answers[statement.id] === statement.preferred
                    ? styles.correct
                    : styles.needsReview
                }
              >
                {answers[statement.id] === statement.preferred
                  ? item.feedback.preferred
                  : statement.nonPreferredFeedback === "guilt"
                    ? item.feedback.guilt
                    : item.feedback.vague}
                {assisted[statement.id] ? " Answer filled in after three attempts." : ""}
              </p>
            ) : null}
          </fieldset>
        ))}
        <div className={styles.actions}>
          <button className={styles.primaryAction} type="submit" disabled={!complete}>
            Review the limits
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
        <CaregiverFeedback focusWhen heading="Limits reviewed">
          <p>{item.learningPoint}</p>
        </CaregiverFeedback>
      ) : null}
    </section>
  );
}
