"use client";

import { useRef, useState } from "react";
import { CaregiverFeedback } from "../../foundation/caregiver-feedback";
import { caregiverModule4 } from "../../../content/caregiver-module-4";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-4.module.css";

export function UnsafeImprovisationReview() {
  const item = caregiverModule4.interactions.improvisation;
  const firstRef = useRef<HTMLInputElement>(null);
  const [actionIndex, setActionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const [assisted, setAssisted] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const { markInteractionSubmitted } = useCaregiverSession();
  const action = item.actions[actionIndex]!;
  const selected = answers[action.id];
  const allReviewed = item.actions.every((entry) => reviewed[entry.id]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (selected === undefined) return;
    if (selected === action.unsafe) {
      const nextReviewed = { ...reviewed, [action.id]: true };
      setReviewed(nextReviewed);
      if (item.actions.every((entry) => nextReviewed[entry.id])) markInteractionSubmitted(item.id);
    } else {
      const attempt = (attempts[action.id] ?? 0) + 1;
      setAttempts((current) => ({ ...current, [action.id]: attempt }));
      if (attempt >= 3) {
        const nextReviewed = { ...reviewed, [action.id]: true };
        setAnswers((current) => ({ ...current, [action.id]: action.unsafe }));
        setAssisted((current) => ({ ...current, [action.id]: true }));
        setReviewed(nextReviewed);
        if (item.actions.every((entry) => nextReviewed[entry.id])) markInteractionSubmitted(item.id);
      }
    }
    setSubmitted(true);
  }

  function moveTo(index: number) {
    setActionIndex(index);
    setSubmitted(false);
    requestAnimationFrame(() => firstRef.current?.focus());
  }

  return (
    <section className={styles.improvisationReview} data-interaction-id={item.id} data-core-application="false" data-optional-practice="true" aria-labelledby={`${item.id}-heading`}>
      <div className={styles.interactionHeading}>
        <p className={styles.optionalLabel}>Optional practice</p>
        <h2 id={`${item.id}-heading`}>{item.title}</h2>
        <p>{item.prompt}</p>
      </div>
      <form className={styles.actionQuestion} onSubmit={submit}>
        <p className={styles.itemProgress}>Action {actionIndex + 1} of {item.actions.length}</p>
        <fieldset>
          <legend><span>Should Omar invent this action from this module?</span>{action.copy}</legend>
          <label><input ref={firstRef} type="radio" name={action.id} checked={selected === true} onChange={() => { setAnswers((current) => ({ ...current, [action.id]: true })); setReviewed((current) => ({ ...current, [action.id]: false })); setSubmitted(false); }} /><span>Do not invent this</span></label>
          <label><input type="radio" name={action.id} checked={selected === false} onChange={() => { setAnswers((current) => ({ ...current, [action.id]: false })); setReviewed((current) => ({ ...current, [action.id]: false })); setSubmitted(false); }} /><span>This uses an existing plan or human guidance</span></label>
        </fieldset>
        <button className={styles.primaryAction} type="submit" disabled={selected === undefined}>Review this action</button>
      </form>
      {submitted ? <CaregiverFeedback focusWhen heading={reviewed[action.id] ? "Source of authority confirmed" : "Look at where this action comes from"} tone={reviewed[action.id] ? "supportive" : "warning"}>
        <p>{action.feedback}</p>
        {assisted[action.id] ? <p>Answer filled in after three attempts.</p> : null}
      </CaregiverFeedback> : null}
      <div className={styles.itemNavigation}>
        <button type="button" disabled={actionIndex === 0} onClick={() => moveTo(actionIndex - 1)}>Previous action</button>
        <button type="button" disabled={!reviewed[action.id] || actionIndex === item.actions.length - 1} onClick={() => moveTo(actionIndex + 1)}>Next action</button>
      </div>
      {allReviewed ? <p className={styles.interactionComplete}>{item.learningPoint}</p> : null}
    </section>
  );
}
