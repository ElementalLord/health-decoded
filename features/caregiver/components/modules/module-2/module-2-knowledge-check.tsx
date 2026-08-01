"use client";

import { useRef, useState, type FormEvent } from "react";

import { CaregiverFeedback } from "../../foundation/caregiver-feedback";
import { caregiverModule2 } from "../../../content/caregiver-module-2";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-2.module.css";

export function Module2KnowledgeCheck() {
  const { setKeyIdeaUnderstood } = useCaregiverSession();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);
  const firstChoiceRef = useRef<HTMLInputElement>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (Object.keys(answers).length !== caregiverModule2.questions.length) return;
    const understood = caregiverModule2.questions.every(
      (question) => answers[question.id] === question.preferredIndex,
    );
    setKeyIdeaUnderstood(understood);
    setSubmitted(true);
    setSubmissionCount((count) => count + 1);
  }

  function revise() {
    setSubmitted(false);
    firstChoiceRef.current?.focus();
  }

  return (
    <section className={styles.knowledgeCheck} aria-labelledby="module-2-check-heading">
      <p className={styles.sectionLabel}>Knowledge check</p>
      <h2 id="module-2-check-heading">Knowledge Check</h2>
      <form onSubmit={submit}>
        {caregiverModule2.questions.map((question, questionIndex) => (
          <fieldset
            key={question.id}
            id={question.id}
            className={styles.question}
            data-question-id={question.id}
          >
            <legend>{question.question}</legend>
            {question.choices.map((choice, choiceIndex) => (
              <label key={choice}>
                <input
                  ref={questionIndex === 0 && choiceIndex === 0 ? firstChoiceRef : undefined}
                  type="radio"
                  name={question.id}
                  value={choiceIndex}
                  checked={answers[question.id] === choiceIndex}
                  onChange={() => {
                    setAnswers((current) => ({ ...current, [question.id]: choiceIndex }));
                    setSubmitted(false);
                  }}
                />
                <span>
                  <span aria-hidden="true">{String.fromCharCode(65 + choiceIndex)}</span> {choice}
                </span>
              </label>
            ))}
            {submitted ? (
              <div className={styles.questionExplanation}>
                <p>{question.explanation}</p>
                {answers[question.id] !== question.preferredIndex ? (
                  <a href={`#${question.relatedSection}`}>{question.reviewLabel}</a>
                ) : null}
              </div>
            ) : null}
          </fieldset>
        ))}
        <div className={styles.interactionActions}>
          <button
            className={styles.primaryAction}
            type="submit"
            disabled={Object.keys(answers).length !== caregiverModule2.questions.length}
          >
            Review complete
          </button>
          {submitted ? (
            <button className={styles.textAction} type="button" onClick={revise}>
              Revise
            </button>
          ) : null}
        </div>
      </form>
      {submitted ? (
        <CaregiverFeedback key={submissionCount} focusWhen heading="Review complete" tone="neutral">
          <p>
            {caregiverModule2.questions.every(
              (question) => answers[question.id] === question.preferredIndex,
            )
              ? caregiverModule2.completion.understood
              : caregiverModule2.completion.revisit}
          </p>
        </CaregiverFeedback>
      ) : null}
    </section>
  );
}
