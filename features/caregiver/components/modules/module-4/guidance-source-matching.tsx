"use client";

import { useRef, useState } from "react";
import { CaregiverFeedback } from "../../foundation/caregiver-feedback";
import { caregiverModule4 } from "../../../content/caregiver-module-4";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-4.module.css";

export function GuidanceSourceMatching() {
  const item = caregiverModule4.interactions.sources;
  const firstRef = useRef<HTMLInputElement>(null);
  const [needIndex, setNeedIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const [assisted, setAssisted] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [count, setCount] = useState(0);
  const { markInteractionSubmitted } = useCaregiverSession();
  const need = item.needs[needIndex]!;
  const selected = answers[need.id];
  const allReviewed = item.needs.every((entry) => reviewed[entry.id]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (selected === undefined) return;
    if (selected === need.preferred) {
      const nextReviewed = { ...reviewed, [need.id]: true };
      setReviewed(nextReviewed);
      if (item.needs.every((entry) => nextReviewed[entry.id])) markInteractionSubmitted(item.id);
    } else {
      const attempt = (attempts[need.id] ?? 0) + 1;
      setAttempts((current) => ({ ...current, [need.id]: attempt }));
      if (attempt >= 3) {
        const nextReviewed = { ...reviewed, [need.id]: true };
        setAnswers((current) => ({ ...current, [need.id]: need.preferred }));
        setAssisted((current) => ({ ...current, [need.id]: true }));
        setReviewed(nextReviewed);
        if (item.needs.every((entry) => nextReviewed[entry.id])) markInteractionSubmitted(item.id);
      }
    }
    setSubmitted(true);
    setCount((value) => value + 1);
  }

  function moveTo(index: number) {
    setNeedIndex(index);
    setSubmitted(false);
    requestAnimationFrame(() => firstRef.current?.focus());
  }

  return (
    <section id={item.id} className={styles.sourceMatch} data-interaction-id={item.id} data-core-application="true" aria-labelledby={`${item.id}-heading`}>
      <div className={styles.interactionHeading}>
        <p className={styles.requiredLabel}>Core practice</p>
        <h2 id={`${item.id}-heading`} tabIndex={-1}>{item.title}</h2>
        <p>{item.prompt}</p>
      </div>
      <div className={styles.sourceProgress} aria-label={`Need ${needIndex + 1} of ${item.needs.length}`}>{item.needs.map((entry, index) => <span key={entry.id} data-current={index === needIndex ? "true" : undefined} data-complete={reviewed[entry.id] ? "true" : undefined}>{reviewed[entry.id] ? "✓" : index + 1}</span>)}</div>
      <form className={styles.sourceQuestion} onSubmit={submit}>
        <p className={styles.itemProgress}>Need {needIndex + 1} of {item.needs.length}</p>
        <fieldset>
          <legend><span>Where does this answer come from?</span>{need.copy}</legend>
          <div className={styles.layerChoices}>
            {item.layers.map((layer, layerIndex) => <label key={layer} data-layer={layerIndex + 1}>
              <input ref={layerIndex === 0 ? firstRef : undefined} type="radio" name={need.id} value={layerIndex} checked={selected === layerIndex} onChange={(event) => {
                const value = Number(event.currentTarget.value);
                setAnswers((current) => ({ ...current, [need.id]: value }));
                setReviewed((current) => ({ ...current, [need.id]: false }));
                setSubmitted(false);
              }} />
              <span><small>Source {layerIndex + 1}</small><strong>{layer}</strong></span>
            </label>)}
          </div>
        </fieldset>
        <button className={styles.primaryAction} type="submit" disabled={selected === undefined}>Review this source</button>
      </form>
      {submitted ? <CaregiverFeedback key={count} focusWhen heading={reviewed[need.id] ? "Source confirmed" : "This source needs review"} tone={reviewed[need.id] ? "supportive" : "warning"}>
        <p>{item.feedback[need.kind]}</p>
        {assisted[need.id] ? <p>Answer filled in after three attempts.</p> : null}
      </CaregiverFeedback> : null}
      <div className={styles.itemNavigation}>
        <button type="button" disabled={needIndex === 0} onClick={() => moveTo(needIndex - 1)}>Previous need</button>
        <button type="button" disabled={!reviewed[need.id] || needIndex === item.needs.length - 1} onClick={() => moveTo(needIndex + 1)}>Next need</button>
      </div>
      {allReviewed ? <div className={styles.completedLayerMap}>
        <p>Three sources, different questions</p>
        <ol>{item.layers.map((layer, layerIndex) => <li key={layer}><strong>{layer}</strong><ul>{item.needs.filter((entry) => entry.preferred === layerIndex).map((entry) => <li key={entry.id}>{entry.copy}</li>)}</ul></li>)}</ol>
        <blockquote>{item.learningPoint}</blockquote>
      </div> : null}
    </section>
  );
}
