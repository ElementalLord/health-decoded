"use client";

import { useRef, useState } from "react";

import { CaregiverFeedback } from "../../../components/foundation/caregiver-feedback";
import { caregiverModule1 } from "../../../content/caregiver-module-1";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-1.module.css";

type Group = (typeof caregiverModule1.interactions.observation.groups)[number] | "";

export function ObservationInterpretationWorkbench() {
  const interaction = caregiverModule1.interactions.observation;
  const firstSelectRef = useRef<HTMLSelectElement>(null);
  const [placements, setPlacements] = useState<Record<string, Group>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [assistedPlacements, setAssistedPlacements] = useState<Record<string, boolean>>({});
  const [otherPossibility, setOtherPossibility] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);
  const { markInteractionSubmitted } = useCaregiverSession();
  const complete = interaction.statements.every((statement) => placements[statement.id]);

  const interpretationAsObserved = interaction.statements.some(
    (statement) =>
      statement.preferredGroup === "Possible interpretation" &&
      placements[statement.id] === "Observed",
  );
  const eventAsInterpretation = interaction.statements.some(
    (statement) =>
      statement.preferredGroup === "Observed" &&
      placements[statement.id] === "Possible interpretation",
  );
  const allCorrect = interaction.statements.every(
    (statement) => placements[statement.id] === statement.preferredGroup,
  );

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!complete) return;
    const nextPlacements = { ...placements };
    const nextAttempts = { ...attempts };
    const nextAssistedPlacements: Record<string, boolean> = {};
    interaction.statements.forEach((statement) => {
      if (placements[statement.id] !== statement.preferredGroup) {
        const attempt = (nextAttempts[statement.id] ?? 0) + 1;
        nextAttempts[statement.id] = attempt;
        if (attempt >= 3) {
          nextPlacements[statement.id] = statement.preferredGroup;
          nextAssistedPlacements[statement.id] = true;
        }
      }
    });
    setPlacements(nextPlacements);
    setAttempts(nextAttempts);
    setAssistedPlacements(nextAssistedPlacements);
    setSubmitted(true);
    setSubmissionCount((count) => count + 1);
    markInteractionSubmitted(interaction.id);
  }

  function clear() {
    setPlacements({});
    setOtherPossibility("");
    setSubmitted(false);
    firstSelectRef.current?.focus();
  }

  return (
    <section
      className={styles.workbench}
      data-interaction-id={interaction.id}
      data-core-application="true"
      aria-labelledby={`${interaction.id}-heading`}
    >
      <div className={styles.interactionHeading}>
        <h2 id={`${interaction.id}-heading`}>{interaction.title}</h2>
        <p>{interaction.prompt}</p>
      </div>
      <form onSubmit={submit}>
        <div className={styles.workbenchColumns}>
          {interaction.groups.map((group) => (
            <section
              key={group}
              aria-labelledby={`${interaction.id}-${group.replaceAll(" ", "-")}`}
            >
              <h3 id={`${interaction.id}-${group.replaceAll(" ", "-")}`}>{group}</h3>
              <ul>
                {interaction.statements
                  .filter((statement) => placements[statement.id] === group)
                  .map((statement) => (
                    <li key={statement.id}>{statement.copy}</li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
        <div className={styles.statementList}>
          {interaction.statements.map((statement, index) => (
            <label key={statement.id}>
              <span>{statement.copy}</span>
              <select
                ref={index === 0 ? firstSelectRef : undefined}
                value={placements[statement.id] ?? ""}
                required
                onChange={(event) => {
                  const value = event.currentTarget.value as Group;
                  setPlacements((current) => ({ ...current, [statement.id]: value }));
                  setSubmitted(false);
                }}
              >
                <option value="">Choose a group</option>
                {interaction.groups.map((group) => (
                  <option key={group} value={group}>
                    Move to {group}
                  </option>
                ))}
              </select>
              {submitted && placements[statement.id] !== statement.preferredGroup ? (
                <span className={styles.answerNeedsReview}>
                  This placement needs review. Place it under {statement.preferredGroup}.
                </span>
              ) : null}
              {assistedPlacements[statement.id] ? (
                <span className={styles.answerAssist}>Answer filled in after three attempts.</span>
              ) : null}
            </label>
          ))}
        </div>
        <label className={styles.optionalText}>
          <span>{interaction.textLabel}</span>
          <textarea
            rows={3}
            value={otherPossibility}
            onChange={(event) => {
              const value = event.currentTarget.value;
              setOtherPossibility(value);
            }}
          />
          <small>
            Free text is session-only and excluded from analytics and AI Tutor transfer.
          </small>
        </label>
        <div className={styles.interactionActions}>
          <button className={styles.primaryAction} type="submit" disabled={!complete}>
            {interaction.submit}
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
              {interaction.revise}
            </button>
          ) : null}
          <button className={styles.textAction} type="button" onClick={clear}>
            {interaction.clear}
          </button>
        </div>
      </form>
      {submitted ? (
        <CaregiverFeedback key={submissionCount} focusWhen heading="Distinction reviewed">
          {interpretationAsObserved ? <p>{interaction.feedback.interpretationAsObserved}</p> : null}
          {eventAsInterpretation ? <p>{interaction.feedback.eventAsInterpretation}</p> : null}
          {allCorrect && otherPossibility.trim() ? <p>{interaction.feedback.preferred}</p> : null}
          {allCorrect && !otherPossibility.trim() ? <p>{interaction.feedback.blank}</p> : null}
          <p>{interaction.learningPoint}</p>
        </CaregiverFeedback>
      ) : null}
    </section>
  );
}
