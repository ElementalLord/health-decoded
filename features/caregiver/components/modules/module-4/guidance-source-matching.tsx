"use client";

import { useRef, useState } from "react";
import { CaregiverFeedback } from "../../foundation/caregiver-feedback";
import { caregiverModule4 } from "../../../content/caregiver-module-4";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-4.module.css";

export function GuidanceSourceMatching() {
  const item = caregiverModule4.interactions.sources;
  const firstRef = useRef<HTMLSelectElement>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [assisted, setAssisted] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [count, setCount] = useState(0);
  const { markInteractionSubmitted } = useCaregiverSession();
  const complete = item.needs.every((need) => answers[need.id] !== undefined);
  return (
    <section
      id={item.id}
      className={styles.sourceMatch}
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
          item.needs.forEach((need) => {
            if (next[need.id] !== need.preferred) {
              const attempt = (nextAttempts[need.id] ?? 0) + 1;
              nextAttempts[need.id] = attempt;
              if (attempt >= 3) {
                next[need.id] = need.preferred;
                nextAssisted[need.id] = true;
              }
            }
          });
          setAnswers(next);
          setAttempts(nextAttempts);
          setAssisted(nextAssisted);
          setSubmitted(true);
          setCount((n) => n + 1);
          markInteractionSubmitted(item.id);
        }}
      >
        <div className={styles.sourceRows}>
          {item.needs.map((need, index) => (
            <label key={need.id}>
              <span>{need.copy}</span>
              <select
                ref={index === 0 ? firstRef : undefined}
                required
                value={answers[need.id] ?? ""}
                onChange={(event) => {
                  const value = Number(event.currentTarget.value);
                  setAnswers((current) => ({
                    ...current,
                    [need.id]: value,
                  }));
                  setSubmitted(false);
                }}
              >
                <option value="" disabled>
                  Choose a source
                </option>
                {item.layers.map((layer, layerIndex) => (
                  <option key={layer} value={layerIndex}>
                    {layer}
                  </option>
                ))}
              </select>
              {submitted ? (
                <small
                  className={
                    answers[need.id] === need.preferred ? styles.correct : styles.needsReview
                  }
                >
                  <strong>
                    {answers[need.id] === need.preferred
                      ? "Source confirmed. "
                      : "This source needs review. "}
                  </strong>
                  {item.feedback[need.kind]}
                  {assisted[need.id] ? " Answer filled in after three attempts." : ""}
                </small>
              ) : null}
            </label>
          ))}
        </div>
        <div className={styles.actions}>
          <button className={styles.primaryAction} type="submit" disabled={!complete}>
            Review the sources
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
        <CaregiverFeedback key={count} focusWhen heading="Sources reviewed">
          <p>{item.learningPoint}</p>
        </CaregiverFeedback>
      ) : null}
    </section>
  );
}
