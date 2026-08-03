"use client";

import { useRef, useState } from "react";
import { caregiverModule5 } from "../../../content/caregiver-module-5";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-5.module.css";

export function Module5KnowledgeCheck() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [assisted, setAssisted] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const firstRef = useRef<HTMLInputElement>(null);
  const { setKeyIdeaUnderstood } = useCaregiverSession();
  const complete = caregiverModule5.questions.every((q) => answers[q.id] !== undefined);
  return (
    <section className={styles.knowledge} aria-labelledby="m5-check-heading">
      <p className={styles.sectionLabel}>Knowledge check</p>
      <h2 id="m5-check-heading">Knowledge Check</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!complete) return;
          const next = { ...answers };
          const nextAttempts = { ...attempts };
          const nextAssisted: Record<string, boolean> = {};
          caregiverModule5.questions.forEach((q) => {
            if (next[q.id] !== q.preferredIndex) {
              const attempt = (nextAttempts[q.id] ?? 0) + 1;
              nextAttempts[q.id] = attempt;
              if (attempt >= 3) {
                next[q.id] = q.preferredIndex;
                nextAssisted[q.id] = true;
              }
            }
          });
          setAnswers(next);
          setAttempts(nextAttempts);
          setAssisted(nextAssisted);
          setSubmitted(true);
          setKeyIdeaUnderstood(
            caregiverModule5.questions.every((q) => next[q.id] === q.preferredIndex),
          );
        }}
      >
        {caregiverModule5.questions.map((q, qi) => (
          <fieldset key={q.id} id={q.id}>
            <legend>{q.question}</legend>
            {q.choices.map((choice, ci) => (
              <label
                key={choice}
                data-needs-review={
                  submitted && answers[q.id] === ci && ci !== q.preferredIndex ? "true" : undefined
                }
              >
                <input
                  ref={qi === 0 && ci === 0 ? firstRef : undefined}
                  type="radio"
                  name={q.id}
                  value={ci}
                  checked={answers[q.id] === ci}
                  onChange={() => {
                    setAnswers((current) => ({ ...current, [q.id]: ci }));
                    setSubmitted(false);
                  }}
                />
                <span>
                  <span aria-hidden="true">{String.fromCharCode(65 + ci)}.</span> {choice}
                </span>
              </label>
            ))}
            {submitted ? (
              <div
                className={answers[q.id] === q.preferredIndex ? styles.correct : styles.needsReview}
              >
                <strong>
                  {answers[q.id] === q.preferredIndex
                    ? "This response is ready to continue."
                    : "This response needs review."}
                </strong>
                <p>{q.explanation}</p>
                {assisted[q.id] ? <p>Answer filled in after three attempts.</p> : null}
                {answers[q.id] !== q.preferredIndex ? (
                  <a href={`#${q.relatedSection}`}>{q.reviewLabel}</a>
                ) : null}
              </div>
            ) : null}
          </fieldset>
        ))}
        <div className={styles.actions}>
          <button className={styles.primaryAction} type="submit" disabled={!complete}>
            Review complete
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
    </section>
  );
}
