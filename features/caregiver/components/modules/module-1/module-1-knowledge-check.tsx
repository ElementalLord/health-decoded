"use client";

import { useRef, useState } from "react";
import { CaregiverFeedback } from "../../foundation/caregiver-feedback";
import { caregiverModule1 } from "../../../content/caregiver-module-1";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-1.module.css";

export function Module1KnowledgeCheck() {
  const firstRef = useRef<HTMLInputElement>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [assistedAnswers, setAssistedAnswers] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);
  const { setKeyIdeaUnderstood } = useCaregiverSession();
  const complete = caregiverModule1.questions.every(
    (question) => answers[question.id] !== undefined,
  );

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!complete) return;
    const nextAnswers = { ...answers };
    const nextAttempts = { ...attempts };
    const nextAssistedAnswers: Record<string, boolean> = {};
    caregiverModule1.questions.forEach((question) => {
      if (answers[question.id] !== question.preferredIndex) {
        const attempt = (nextAttempts[question.id] ?? 0) + 1;
        nextAttempts[question.id] = attempt;
        if (attempt >= 3) {
          nextAnswers[question.id] = question.preferredIndex;
          nextAssistedAnswers[question.id] = true;
        }
      }
    });
    setAnswers(nextAnswers);
    setAttempts(nextAttempts);
    setAssistedAnswers(nextAssistedAnswers);
    const understood = caregiverModule1.questions.every(
      (question) => nextAnswers[question.id] === question.preferredIndex,
    );
    setKeyIdeaUnderstood(understood);
    setSubmitted(true);
    setSubmissionCount((count) => count + 1);
  }

  return (
    <section className={styles.knowledgeCheck} aria-labelledby="module-1-check-heading">
      <p className={styles.sectionLabel}>Knowledge check</p>
      <h2 id="module-1-check-heading">Knowledge Check</h2>
      <form onSubmit={submit}>
        {caregiverModule1.questions.map((question, questionIndex) => (
          <fieldset key={question.id} id={question.id} className={styles.question}>
            <legend>{question.question}</legend>
            {question.choices.map((choice, choiceIndex) => (
              <label key={choice}>
                <input
                  ref={questionIndex === 0 && choiceIndex === 0 ? firstRef : undefined}
                  type="radio"
                  name={question.id}
                  value={choiceIndex}
                  checked={answers[question.id] === choiceIndex}
                  onChange={(event) => {
                    const value = Number(event.currentTarget.value);
                    setAnswers((current) => ({ ...current, [question.id]: value }));
                    setSubmitted(false);
                  }}
                />
                <span>{choice}</span>
              </label>
            ))}
            {submitted ? (
              <div className={styles.questionFeedback}>
                <p
                  className={
                    answers[question.id] === question.preferredIndex
                      ? styles.answerConfirmed
                      : styles.answerNeedsReview
                  }
                >
                  {answers[question.id] === question.preferredIndex
                    ? "This response is ready to continue."
                    : "This response needs review."}
                </p>
                <p>{question.explanation}</p>
                {assistedAnswers[question.id] ? (
                  <p className={styles.answerAssist}>
                    The answer was filled in after three attempts so you can continue.
                  </p>
                ) : null}
                {answers[question.id] !== question.preferredIndex ? (
                  <a href={`#${question.relatedSection}`}>{question.reviewLabel}</a>
                ) : null}
              </div>
            ) : null}
          </fieldset>
        ))}
        <div className={styles.interactionActions}>
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
      {submitted ? (
        <CaregiverFeedback key={submissionCount} focusWhen heading="Review complete">
          <p>
            {caregiverModule1.questions.every(
              (question) => answers[question.id] === question.preferredIndex,
            )
              ? caregiverModule1.completion.understood
              : caregiverModule1.completion.revisit}
          </p>
        </CaregiverFeedback>
      ) : null}
    </section>
  );
}
