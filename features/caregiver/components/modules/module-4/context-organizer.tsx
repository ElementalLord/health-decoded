"use client";

import { useRef, useState } from "react";
import { CaregiverFeedback } from "../../foundation/caregiver-feedback";
import { caregiverModule4 } from "../../../content/caregiver-module-4";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-4.module.css";

export function ContextOrganizer() {
  const item = caregiverModule4.interactions.context;
  const firstRef = useRef<HTMLInputElement>(null);
  const [choiceIndex, setChoiceIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const [assisted, setAssisted] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const { markInteractionSubmitted } = useCaregiverSession();
  const choice = item.choices[choiceIndex]!;
  const selected = answers[choice.id];
  const allReviewed = item.choices.every((entry) => reviewed[entry.id]);
  const summary = item.choices.filter((entry) => entry.preferred && reviewed[entry.id] && answers[entry.id]).map((entry) => entry.copy);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (selected === undefined) return;
    const correct = selected === choice.preferred;
    if (correct) {
      const nextReviewed = { ...reviewed, [choice.id]: true };
      setReviewed(nextReviewed);
      if (item.choices.every((entry) => nextReviewed[entry.id])) markInteractionSubmitted(item.id);
    } else {
      const attempt = (attempts[choice.id] ?? 0) + 1;
      setAttempts((current) => ({ ...current, [choice.id]: attempt }));
      if (attempt >= 3) {
        const nextReviewed = { ...reviewed, [choice.id]: true };
        setAnswers((current) => ({ ...current, [choice.id]: choice.preferred }));
        setAssisted((current) => ({ ...current, [choice.id]: true }));
        setReviewed(nextReviewed);
        if (item.choices.every((entry) => nextReviewed[entry.id])) markInteractionSubmitted(item.id);
      }
    }
    setSubmitted(true);
    setFeedbackCount((count) => count + 1);
  }

  function moveTo(index: number) {
    setChoiceIndex(index);
    setSubmitted(false);
    requestAnimationFrame(() => firstRef.current?.focus());
  }

  const feedback = choice.id === "diagnosis" ? item.feedback.diagnosis : choice.id === "judgment" ? item.feedback.judgment : item.feedback.preferred;
  return (
    <section className={styles.contextOrganizer} data-interaction-id={item.id} data-core-application="false" data-optional-practice="true" aria-labelledby={`${item.id}-heading`}>
      <div className={styles.interactionHeading}>
        <p className={styles.optionalLabel}>Optional practice</p>
        <h2 id={`${item.id}-heading`}>{item.title}</h2>
        <p>{item.prompt}</p>
      </div>
      <div className={styles.contextLayout}>
        <form className={styles.statementCard} onSubmit={submit}>
          <p className={styles.itemProgress}>Statement {choiceIndex + 1} of {item.choices.length}</p>
          <blockquote>{choice.copy}</blockquote>
          <fieldset>
            <legend>Use in Omar’s factual summary?</legend>
            <label><input ref={firstRef} type="radio" name={choice.id} checked={selected === true} onChange={() => { setAnswers((current) => ({ ...current, [choice.id]: true })); setReviewed((current) => ({ ...current, [choice.id]: false })); setSubmitted(false); }} /><span>Include</span></label>
            <label><input type="radio" name={choice.id} checked={selected === false} onChange={() => { setAnswers((current) => ({ ...current, [choice.id]: false })); setReviewed((current) => ({ ...current, [choice.id]: false })); setSubmitted(false); }} /><span>Leave out</span></label>
          </fieldset>
          <button className={styles.primaryAction} type="submit" disabled={selected === undefined}>Review this statement</button>
        </form>
        <aside className={styles.liveSummary} aria-label="Omar's factual summary">
          <p>Factual summary</p>
          {summary.length ? <ul>{summary.map((line) => <li key={line}>{line}</li>)}</ul> : <p>Reviewed observations will appear here.</p>}
        </aside>
      </div>
      {submitted ? <CaregiverFeedback key={feedbackCount} focusWhen heading={reviewed[choice.id] ? "Statement reviewed" : "Look at the source of this claim"} tone={reviewed[choice.id] ? "supportive" : "warning"}>
        <p>{feedback}</p><p>{item.learningPoint}</p>
        {assisted[choice.id] ? <p>Answer filled in after three attempts.</p> : null}
      </CaregiverFeedback> : null}
      <div className={styles.itemNavigation}>
        <button type="button" disabled={choiceIndex === 0} onClick={() => moveTo(choiceIndex - 1)}>Previous statement</button>
        <button type="button" disabled={!reviewed[choice.id] || choiceIndex === item.choices.length - 1} onClick={() => moveTo(choiceIndex + 1)}>Next statement</button>
      </div>
      {allReviewed ? <p className={styles.interactionComplete}>{item.learningPoint}</p> : null}
    </section>
  );
}
