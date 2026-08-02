"use client";

import { useRef, useState } from "react";
import { CaregiverFeedback } from "../../foundation/caregiver-feedback";
import { caregiverModule5 } from "../../../content/caregiver-module-5";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-5.module.css";

export function ResponsibilityMap() {
  const item = caregiverModule5.interactions.responsibility;
  const firstRef = useRef<HTMLSelectElement>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [assisted, setAssisted] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const { markInteractionSubmitted } = useCaregiverSession();
  const complete = item.items.every((entry) => answers[entry.id] !== undefined);
  return (
    <section
      id={item.id}
      className={styles.responsibilityMap}
      data-interaction-id={item.id}
      data-core-application="true"
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
          item.items.forEach((entry) => {
            if (next[entry.id] !== entry.preferred) {
              const attempt = (nextAttempts[entry.id] ?? 0) + 1;
              nextAttempts[entry.id] = attempt;
              if (attempt >= 3) {
                next[entry.id] = entry.preferred;
                nextAssisted[entry.id] = true;
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
        <div className={styles.mapRows}>
          {item.items.map((entry, index) => (
            <label key={entry.id}>
              <span>{entry.copy}</span>
              <select
                ref={index === 0 ? firstRef : undefined}
                required
                value={answers[entry.id] ?? ""}
                onChange={(event) => {
                  const value = Number(event.currentTarget.value);
                  setAnswers((current) => ({
                    ...current,
                    [entry.id]: value,
                  }));
                  setSubmitted(false);
                }}
              >
                <option value="" disabled>
                  Choose an owner
                </option>
                {item.zones.map((zone, zoneIndex) => (
                  <option key={zone} value={zoneIndex}>
                    {zone}
                  </option>
                ))}
              </select>
              {submitted ? (
                <small
                  className={
                    answers[entry.id] === entry.preferred ? styles.correct : styles.needsReview
                  }
                >
                  <strong>
                    {answers[entry.id] === entry.preferred
                      ? "Owner confirmed. "
                      : "This item needs review. "}
                  </strong>
                  {entry.preferred === 3
                    ? item.feedback.medical
                    : entry.preferred === 1
                      ? item.feedback.availability
                      : entry.preferred === 2
                        ? item.feedback.shared
                        : item.feedback.preferred}
                  {assisted[entry.id] ? " Answer filled in after three attempts." : ""}
                </small>
              ) : null}
            </label>
          ))}
        </div>
        <div className={styles.actions}>
          <button className={styles.primaryAction} type="submit" disabled={!complete}>
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
        <CaregiverFeedback focusWhen heading="Responsibility reviewed">
          <p>{item.learningPoint}</p>
        </CaregiverFeedback>
      ) : null}
    </section>
  );
}
