"use client";

import { useRef, useState } from "react";
import { CaregiverFeedback } from "../../foundation/caregiver-feedback";
import { caregiverModule3 } from "../../../content/caregiver-module-3";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-3.module.css";

type Zone = (typeof caregiverModule3.interactions.planning.zones)[number] | "";

export function SharedPlanningWorkspace() {
  const interaction = caregiverModule3.interactions.planning;
  const firstSelectRef = useRef<HTMLSelectElement>(null);
  const [placements, setPlacements] = useState<Record<string, Zone>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [assistedPlacements, setAssistedPlacements] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);
  const { markInteractionSubmitted } = useCaregiverSession();
  const requiredPlaced = ["ride", "cook", "ingredients", "shelf"].every((id) => placements[id]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!requiredPlaced) return;
    const nextPlacements = { ...placements };
    const nextAttempts = { ...attempts };
    const nextAssistedPlacements: Record<string, boolean> = {};
    interaction.items.forEach((item) => {
      const isPreferred =
        item.preferredZones.length === 0
          ? !placements[item.id]
          : item.preferredZones.includes(placements[item.id] as never);
      if (!isPreferred) {
        const attempt = (nextAttempts[item.id] ?? 0) + 1;
        nextAttempts[item.id] = attempt;
        if (attempt >= 3) {
          nextPlacements[item.id] = (item.preferredZones[0] ?? "") as Zone;
          nextAssistedPlacements[item.id] = true;
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
  function reset() {
    setPlacements({});
    setSubmitted(false);
    firstSelectRef.current?.focus();
  }
  const preferred = interaction.items.every((item) =>
    item.preferredZones.length === 0
      ? !placements[item.id]
      : item.preferredZones.includes(placements[item.id] as never),
  );
  const feedbackBlocked = interaction.items.some(
    (item) =>
      item.preferredZones.length > 0 &&
      placements[item.id] &&
      !item.preferredZones.includes(placements[item.id] as never),
  );

  return (
    <section
      className={styles.workspace}
      data-interaction-id={interaction.id}
      data-optional-practice="true"
      data-feedback-status={feedbackBlocked ? "source-blocked" : "available"}
      aria-labelledby={`${interaction.id}-heading`}
    >
      <div className={styles.workspaceHeading}>
        <h2 id={`${interaction.id}-heading`}>{interaction.title}</h2>
        <p>{interaction.prompt}</p>
      </div>
      <form onSubmit={submit}>
        <div className={styles.planBands}>
          {interaction.zones.map((zone) => (
            <section key={zone} aria-labelledby={`${interaction.id}-${zone.replaceAll(" ", "-")}`}>
              <h3 id={`${interaction.id}-${zone.replaceAll(" ", "-")}`}>{zone}</h3>
              <ul>
                {interaction.items
                  .filter((item) => placements[item.id] === zone)
                  .map((item) => (
                    <li key={item.id}>{item.copy}</li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
        <div className={styles.taskTray}>
          {interaction.items.map((item, index) => (
            <label key={item.id}>
              <span>{item.copy}</span>
              <select
                ref={index === 0 ? firstSelectRef : undefined}
                value={placements[item.id] ?? ""}
                onChange={(event) => {
                  const value = event.currentTarget.value as Zone;
                  setPlacements((current) => ({ ...current, [item.id]: value }));
                  setSubmitted(false);
                }}
              >
                <option value="">Leave off the plan</option>
                {interaction.zones.map((zone) => (
                  <option key={zone} value={zone}>
                    Move to {zone}
                  </option>
                ))}
              </select>
              {assistedPlacements[item.id] ? (
                <span className={styles.answerAssist}>Answer filled in after three attempts.</span>
              ) : null}
            </label>
          ))}
        </div>
        <div className={styles.interactionActions}>
          <button className={styles.primaryAction} type="submit" disabled={!requiredPlaced}>
            {interaction.submit}
          </button>
          <button className={styles.textAction} type="button" onClick={reset}>
            {interaction.reset}
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
        <CaregiverFeedback key={submissionCount} focusWhen heading="Plan reviewed">
          {preferred ? <p>{interaction.feedback.preferred}</p> : null}
          {placements.portion ? <p>{interaction.feedback.portion}</p> : null}
          {placements.separate ? <p>{interaction.feedback.separate}</p> : null}
          {placements.shelf === "Leave undecided" || placements.shelf === "Question for Cam" ? (
            <p>{interaction.feedback.shelf}</p>
          ) : null}
          {feedbackBlocked ? (
            <div className={styles.sourceBlocked}>
              <strong>Feedback source incomplete</strong>
              <p>{interaction.feedbackGap}</p>
            </div>
          ) : null}
          <p>{interaction.learningPoint}</p>
        </CaregiverFeedback>
      ) : null}
    </section>
  );
}
