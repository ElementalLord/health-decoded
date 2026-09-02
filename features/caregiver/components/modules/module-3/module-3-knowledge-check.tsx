"use client";

import { useRef, useState } from "react";
import { CaregiverFeedback } from "../../foundation/caregiver-feedback";
import { caregiverModule3 } from "../../../content/caregiver-module-3";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-3.module.css";

export function Module3KnowledgeCheck({ onReviewSection }: { onReviewSection: (sectionId: string) => void }) {
  const firstRef = useRef<HTMLInputElement>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [assistedAnswers, setAssistedAnswers] = useState<Record<string, boolean>>({});
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);
  const { setKeyIdeaUnderstood } = useCaregiverSession();
  const question = caregiverModule3.questions[questionIndex]!;
  const selected = answers[question.id];
  const isPreferred = selected === question.preferredIndex;
  const allReviewed = caregiverModule3.questions.every((item) => reviewed[item.id]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (selected === undefined) return;
    let nextAnswers = answers;
    let correct = isPreferred;
    if (!isPreferred) {
      const attempt = (attempts[question.id] ?? 0) + 1;
      setAttempts((current) => ({ ...current, [question.id]: attempt }));
      if (attempt >= 3) {
        nextAnswers = { ...answers, [question.id]: question.preferredIndex };
        setAnswers(nextAnswers);
        setAssistedAnswers((current) => ({ ...current, [question.id]: true }));
        correct = true;
      }
    }
    const nextReviewed = correct ? { ...reviewed, [question.id]: true } : reviewed;
    if (correct) setReviewed(nextReviewed);
    setKeyIdeaUnderstood(caregiverModule3.questions.every((item) => nextAnswers[item.id] === item.preferredIndex));
    setSubmitted(true);
    setSubmissionCount((count) => count + 1);
  }

  function moveTo(nextIndex: number) {
    setQuestionIndex(nextIndex);
    setSubmitted(false);
    requestAnimationFrame(() => firstRef.current?.focus());
  }

  return (
    <section className={styles.knowledgeCheck} aria-labelledby="module-3-check-heading">
      <p className={styles.sectionLabel}>Knowledge check</p>
      <h2 id="module-3-check-heading" tabIndex={-1}>Check your understanding</h2>
      <p>One short situation at a time. You can review the related lesson whenever you need it.</p>
      <div className={styles.questionProgress}>{caregiverModule3.questions.map((item, index) => <span key={item.id} data-current={index === questionIndex ? "true" : undefined} data-complete={reviewed[item.id] ? "true" : undefined}>{reviewed[item.id] ? "✓" : index + 1}</span>)}</div>
      <form onSubmit={submit}>
        <fieldset id={question.id} className={styles.question}>
          <legend><span>Situation {questionIndex + 1} of {caregiverModule3.questions.length}</span>{question.question}</legend>
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
        <div className={styles.interactionActions}>
          <button className={styles.primaryAction} type="submit" disabled={selected === undefined}>Review this response</button>
          {submitted && !isPreferred && !assistedAnswers[question.id] ? <button className={styles.textAction} type="button" onClick={() => onReviewSection(question.relatedSection)}>{question.reviewLabel}</button> : null}
        </div>
      </form>
      {submitted ? <CaregiverFeedback key={submissionCount} focusWhen heading={reviewed[question.id] ? "Key idea" : "Look once more"}>
        <p>{question.explanation}</p>
        {assistedAnswers[question.id] ? <p className={styles.answerAssist}>The answer was filled in after three attempts so you can continue.</p> : null}
      </CaregiverFeedback> : null}
      <div className={styles.itemNavigation}>
        <button type="button" disabled={questionIndex === 0} onClick={() => moveTo(questionIndex - 1)}>Previous situation</button>
        <button type="button" disabled={!reviewed[question.id] || questionIndex === caregiverModule3.questions.length - 1} onClick={() => moveTo(questionIndex + 1)}>Next situation</button>
      </div>
      {allReviewed ? <p className={styles.coreComplete}>{caregiverModule3.completion.keyIdea}</p> : null}
    </section>
  );
}
