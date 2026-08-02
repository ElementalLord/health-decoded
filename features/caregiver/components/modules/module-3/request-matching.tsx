"use client";

import { useRef, useState } from "react";
import { CaregiverFeedback } from "../../foundation/caregiver-feedback";
import { caregiverModule3 } from "../../../content/caregiver-module-3";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-3.module.css";

export function RequestMatching() {
  const interaction = caregiverModule3.interactions.matching;
  const firstSelectRef = useRef<HTMLSelectElement>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [assistedMatches, setAssistedMatches] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);
  const { markInteractionSubmitted } = useCaregiverSession();
  const complete = interaction.pairs.every((pair) => matches[pair.id]);
  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!complete) return;
    const nextMatches = { ...matches };
    const nextAttempts = { ...attempts };
    const nextAssistedMatches: Record<string, boolean> = {};
    interaction.pairs.forEach((pair) => {
      if (matches[pair.id] !== pair.id) {
        const attempt = (nextAttempts[pair.id] ?? 0) + 1;
        nextAttempts[pair.id] = attempt;
        if (attempt >= 3) {
          nextMatches[pair.id] = pair.id;
          nextAssistedMatches[pair.id] = true;
        }
      }
    });
    setMatches(nextMatches);
    setAttempts(nextAttempts);
    setAssistedMatches(nextAssistedMatches);
    setSubmitted(true);
    setSubmissionCount((count) => count + 1);
    markInteractionSubmitted(interaction.id);
  }
  return (
    <section
      className={styles.matching}
      data-interaction-id={interaction.id}
      data-core-application="true"
      aria-labelledby={`${interaction.id}-heading`}
    >
      <h2 id={`${interaction.id}-heading`}>{interaction.title}</h2>
      <p>{interaction.prompt}</p>
      <form onSubmit={submit}>
        <div className={styles.matchRows}>
          {interaction.pairs.map((pair, index) => (
            <div key={pair.id} className={styles.matchRow}>
              <p>
                <span>Request</span>“{pair.request}”
              </p>
              <label>
                <span>Bounded offer</span>
                <select
                  ref={index === 0 ? firstSelectRef : undefined}
                  required
                  value={matches[pair.id] ?? ""}
                  onChange={(event) => {
                    const value = event.currentTarget.value;
                    setMatches((current) => ({ ...current, [pair.id]: value }));
                    setSubmitted(false);
                  }}
                >
                  <option value="">Choose one offer</option>
                  {interaction.pairs.map((offer) => (
                    <option key={offer.id} value={offer.id}>
                      {offer.offer}
                    </option>
                  ))}
                </select>
              </label>
              {submitted ? (
                <p className={styles.inlineFeedback}>
                  <strong>
                    {matches[pair.id] === pair.id
                      ? "This match fits the request. "
                      : "This match needs review. "}
                  </strong>
                  {matches[pair.id] === pair.id
                    ? interaction.feedback.preferred
                    : interaction.feedback.adjacent}
                </p>
              ) : null}
              {assistedMatches[pair.id] ? (
                <p className={styles.answerAssist}>Answer filled in after three attempts.</p>
              ) : null}
            </div>
          ))}
        </div>
        <div className={styles.interactionActions}>
          <button className={styles.primaryAction} type="submit" disabled={!complete}>
            {interaction.title}
          </button>
          {submitted ? (
            <button
              className={styles.textAction}
              type="button"
              onClick={() => {
                setSubmitted(false);
                firstSelectRef.current?.focus();
              }}
            >
              Revise
            </button>
          ) : null}
        </div>
      </form>
      {submitted ? (
        <CaregiverFeedback key={submissionCount} focusWhen heading="Matches reviewed">
          <p>{interaction.learningPoint}</p>
        </CaregiverFeedback>
      ) : null}
    </section>
  );
}
