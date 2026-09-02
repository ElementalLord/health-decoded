"use client";

import { useRef, useState } from "react";
import { CaregiverFeedback } from "../../foundation/caregiver-feedback";
import { caregiverModule4 } from "../../../content/caregiver-module-4";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-4.module.css";

export function Module4KnowledgeCheck({ onReviewSection }: { onReviewSection: (sectionId: string) => void }) {
  const firstRef = useRef<HTMLInputElement>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [assisted, setAssisted] = useState<Record<string, boolean>>({});
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [count, setCount] = useState(0);
  const { setKeyIdeaUnderstood } = useCaregiverSession();
  const question = caregiverModule4.questions[questionIndex]!;
  const selected = answers[question.id];
  const allReviewed = caregiverModule4.questions.every((entry) => reviewed[entry.id]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (selected === undefined) return;
    let nextAnswers = answers;
    let correct = selected === question.preferredIndex;
    if (!correct) {
      const attempt = (attempts[question.id] ?? 0) + 1;
      setAttempts((current) => ({ ...current, [question.id]: attempt }));
      if (attempt >= 3) {
        nextAnswers = { ...answers, [question.id]: question.preferredIndex };
        setAnswers(nextAnswers);
        setAssisted((current) => ({ ...current, [question.id]: true }));
        correct = true;
      }
    }
    if (correct) setReviewed((current) => ({ ...current, [question.id]: true }));
    setKeyIdeaUnderstood(caregiverModule4.questions.every((entry) => nextAnswers[entry.id] === entry.preferredIndex));
    setSubmitted(true);
    setCount((value) => value + 1);
  }

  function moveTo(index: number) {
    setQuestionIndex(index);
    setSubmitted(false);
    requestAnimationFrame(() => firstRef.current?.focus());
  }

  return (
    <section className={styles.knowledge} aria-labelledby="m4-knowledge-heading">
      <p className={styles.sectionLabel}>Knowledge check</p>
      <h2 id="m4-knowledge-heading" tabIndex={-1}>Check your understanding</h2>
      <p>One situation at a time. This review does not determine module completion.</p>
      <div className={styles.questionProgress}>{caregiverModule4.questions.map((entry, index) => <span key={entry.id} data-current={index === questionIndex ? "true" : undefined} data-complete={reviewed[entry.id] ? "true" : undefined}>{reviewed[entry.id] ? "✓" : index + 1}</span>)}</div>
      <form onSubmit={submit}>
        <fieldset id={question.id} className={styles.question}>
          <legend><span>Situation {questionIndex + 1} of {caregiverModule4.questions.length}</span>{question.question}</legend>
          {question.choices.map((choice, choiceIndex) => <label key={choice} data-needs-review={submitted && selected === choiceIndex && choiceIndex !== question.preferredIndex ? "true" : undefined}>
            <input ref={choiceIndex === 0 ? firstRef : undefined} type="radio" name={question.id} value={choiceIndex} checked={selected === choiceIndex} onChange={(event) => {
              const value = Number(event.currentTarget.value);
              setAnswers((current) => ({ ...current, [question.id]: value }));
              setReviewed((current) => ({ ...current, [question.id]: false }));
              setSubmitted(false);
            }} />
            <span><span aria-hidden="true">{String.fromCharCode(65 + choiceIndex)}.</span> {choice}</span>
          </label>)}
        </fieldset>
        <div className={styles.actions}>
          <button className={styles.primaryAction} type="submit" disabled={selected === undefined}>Review this response</button>
          {submitted && !reviewed[question.id] ? <button className={styles.textAction} type="button" onClick={() => onReviewSection(question.relatedSection)}>{question.reviewLabel}</button> : null}
        </div>
      </form>
      {submitted ? <CaregiverFeedback key={count} focusWhen heading={reviewed[question.id] ? "Key idea" : "This response needs review"} tone={reviewed[question.id] ? "supportive" : "warning"}>
        <p>{question.explanation}</p>{assisted[question.id] ? <p>Answer filled in after three attempts.</p> : null}
      </CaregiverFeedback> : null}
      <div className={styles.itemNavigation}>
        <button type="button" disabled={questionIndex === 0} onClick={() => moveTo(questionIndex - 1)}>Previous situation</button>
        <button type="button" disabled={!reviewed[question.id] || questionIndex === caregiverModule4.questions.length - 1} onClick={() => moveTo(questionIndex + 1)}>Next situation</button>
      </div>
      {allReviewed ? <p className={styles.interactionComplete}>{caregiverModule4.completion.keyIdea}</p> : null}
    </section>
  );
}
