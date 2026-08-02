"use client";

import { useRef, useState } from "react";
import { caregiverModule4 } from "../../../content/caregiver-module-4";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-4.module.css";

export function Module4KnowledgeCheck() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [assisted, setAssisted] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const firstRef = useRef<HTMLInputElement>(null);
  const { setKeyIdeaUnderstood } = useCaregiverSession();
  const complete = caregiverModule4.questions.every((q) => answers[q.id] !== undefined);
  return (
    <section className={styles.knowledge} aria-labelledby="m4-knowledge-heading">
      <p className={styles.sectionLabel}>Knowledge check</p>
      <h2 id="m4-knowledge-heading">Knowledge Check</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!complete) return;
          const next = { ...answers };
          const nextAttempts = { ...attempts };
          const nextAssisted: Record<string, boolean> = {};
          caregiverModule4.questions.forEach((q) => {
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
            caregiverModule4.questions.every((q) => next[q.id] === q.preferredIndex),
          );
        }}
      >
        <div className={styles.questionGrid}>
          {caregiverModule4.questions.map((q, qi) => (
            <fieldset key={q.id} id={q.id}>
              <legend>{q.question}</legend>
              {q.choices.map((choice, ci) => (
                <label key={choice}>
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
                  <span>{choice}</span>
                </label>
              ))}
              {submitted ? (
                <div
                  className={
                    answers[q.id] === q.preferredIndex ? styles.correct : styles.needsReview
                  }
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
        </div>
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
