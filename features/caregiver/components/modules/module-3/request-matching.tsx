"use client";

import { useRef, useState } from "react";
import { CaregiverFeedback } from "../../foundation/caregiver-feedback";
import { caregiverModule3 } from "../../../content/caregiver-module-3";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-3.module.css";

export function RequestMatching() {
  const interaction = caregiverModule3.interactions.matching;
  const selectRef = useRef<HTMLSelectElement>(null);
  const [pairIndex, setPairIndex] = useState(0);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const [assisted, setAssisted] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState<"fit" | "review" | "assist" | null>(null);
  const { markInteractionSubmitted } = useCaregiverSession();
  const pair = interaction.pairs[pairIndex]!;
  const allReviewed = interaction.pairs.every((item) => reviewed[item.id]);

  function checkCurrent(event: React.FormEvent) {
    event.preventDefault();
    if (!matches[pair.id]) return;
    if (matches[pair.id] === pair.id) {
      const nextReviewed = { ...reviewed, [pair.id]: true };
      setReviewed(nextReviewed);
      setMessage("fit");
      if (interaction.pairs.every((item) => nextReviewed[item.id])) markInteractionSubmitted(interaction.id);
      return;
    }
    const attempt = (attempts[pair.id] ?? 0) + 1;
    setAttempts((current) => ({ ...current, [pair.id]: attempt }));
    if (attempt >= 3) {
      const nextReviewed = { ...reviewed, [pair.id]: true };
      setMatches((current) => ({ ...current, [pair.id]: pair.id }));
      setAssisted((current) => ({ ...current, [pair.id]: true }));
      setReviewed(nextReviewed);
      setMessage("assist");
      if (interaction.pairs.every((item) => nextReviewed[item.id])) markInteractionSubmitted(interaction.id);
    } else {
      setMessage("review");
    }
  }

  function moveTo(nextIndex: number) {
    setPairIndex(nextIndex);
    setMessage(reviewed[interaction.pairs[nextIndex]!.id] ? "fit" : null);
    requestAnimationFrame(() => selectRef.current?.focus());
  }

  return (
    <section className={styles.matching} data-interaction-id={interaction.id} data-core-application="true" aria-labelledby={`${interaction.id}-heading`}>
      <div className={styles.interactionHeading}>
        <p className={styles.requiredLabel}>Core practice</p>
        <h2 id={`${interaction.id}-heading`} tabIndex={-1}>{interaction.title}</h2>
        <p>{interaction.prompt}</p>
      </div>
      <div className={styles.matchProgress} aria-label={`Request ${pairIndex + 1} of ${interaction.pairs.length}`}>
        {interaction.pairs.map((item, index) => <span key={item.id} data-current={index === pairIndex ? "true" : undefined} data-complete={reviewed[item.id] ? "true" : undefined}>{reviewed[item.id] ? "✓" : index + 1}</span>)}
      </div>
      <form onSubmit={checkCurrent} className={styles.matchCard}>
        <p className={styles.itemProgress}>Request {pairIndex + 1} of {interaction.pairs.length}</p>
        <blockquote>“{pair.request}”</blockquote>
        <label>
          <span>Which bounded offer fits?</span>
          <select ref={selectRef} required value={matches[pair.id] ?? ""} onChange={(event) => {
            const value = event.currentTarget.value;
            setMatches((current) => ({ ...current, [pair.id]: value }));
            setReviewed((current) => ({ ...current, [pair.id]: false }));
            setMessage(null);
          }}>
            <option value="">Choose one offer</option>
            {interaction.pairs.map((offer) => <option key={offer.id} value={offer.id}>{offer.offer}</option>)}
          </select>
        </label>
        <button className={styles.primaryAction} type="submit" disabled={!matches[pair.id]}>Check this match</button>
      </form>
      {message ? <CaregiverFeedback focusWhen heading={message === "review" ? "Try this request again" : "This offer fits"}>
        <p>{message === "review" ? interaction.feedback.adjacent : interaction.feedback.preferred}</p>
        {assisted[pair.id] ? <p className={styles.answerAssist}>The fitting offer was filled in after three attempts so you can continue.</p> : null}
      </CaregiverFeedback> : null}
      <div className={styles.itemNavigation}>
        <button type="button" disabled={pairIndex === 0} onClick={() => moveTo(pairIndex - 1)}>Previous request</button>
        <button type="button" disabled={!reviewed[pair.id] || pairIndex === interaction.pairs.length - 1} onClick={() => moveTo(pairIndex + 1)}>Next request</button>
      </div>
      {allReviewed ? <p className={styles.coreComplete}><strong>All four requests matched.</strong> {interaction.learningPoint}</p> : null}
    </section>
  );
}
