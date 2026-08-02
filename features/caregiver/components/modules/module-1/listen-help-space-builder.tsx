"use client";

import { useRef, useState } from "react";
import { CaregiverFeedback } from "../../foundation/caregiver-feedback";
import { caregiverModule1 } from "../../../content/caregiver-module-1";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-1.module.css";

export function ListenHelpSpaceBuilder() {
  const interaction = caregiverModule1.interactions.response;
  const firstRef = useRef<HTMLInputElement>(null);
  const [opening, setOpening] = useState("");
  const [followup, setFollowup] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);
  const { markInteractionSubmitted } = useCaregiverSession();
  const openingCopy = interaction.openings.find((item) => item.id === opening)?.copy;
  const followupCopy = interaction.followups.find((item) => item.id === followup)?.copy;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!opening || !followup) return;
    setSubmitted(true);
    setSubmissionCount((count) => count + 1);
    markInteractionSubmitted(interaction.id);
  }

  return (
    <section
      className={styles.responseBuilder}
      data-interaction-id={interaction.id}
      data-optional-practice="true"
      aria-labelledby={`${interaction.id}-heading`}
    >
      <h2 id={`${interaction.id}-heading`}>{interaction.title}</h2>
      <p>{interaction.prompt}</p>
      <form onSubmit={submit}>
        <div className={styles.builderGroups}>
          <fieldset>
            <legend>Opening</legend>
            {interaction.openings.map((item, index) => (
              <label key={item.id}>
                <input
                  ref={index === 0 ? firstRef : undefined}
                  type="radio"
                  name={`${interaction.id}-opening`}
                  value={item.id}
                  checked={opening === item.id}
                  onChange={(event) => {
                    const value = event.currentTarget.value;
                    setOpening(value);
                    setSubmitted(false);
                  }}
                />
                <span>{item.copy}</span>
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>Follow-up</legend>
            {interaction.followups.map((item) => (
              <label key={item.id}>
                <input
                  type="radio"
                  name={`${interaction.id}-followup`}
                  value={item.id}
                  checked={followup === item.id}
                  onChange={(event) => {
                    const value = event.currentTarget.value;
                    setFollowup(value);
                    setSubmitted(false);
                  }}
                />
                <span>{item.copy}</span>
              </label>
            ))}
          </fieldset>
        </div>
        <p className={styles.assembledResponse} aria-live="polite">
          <span>Assembled response</span>
          {openingCopy || "…"}
          {openingCopy && followupCopy ? ". " : " "}
          {followupCopy || "…"}
        </p>
        <div className={styles.interactionActions}>
          <button className={styles.primaryAction} type="submit" disabled={!opening || !followup}>
            {interaction.submit}
          </button>
          {submitted ? (
            <button
              className={styles.textAction}
              type="button"
              onClick={() => {
                setSubmitted(false);
                firstRef.current?.focus();
              }}
            >
              Revise
            </button>
          ) : null}
        </div>
      </form>
      {submitted ? (
        <CaregiverFeedback key={submissionCount} focusWhen heading="Response heard">
          {opening === interaction.preferred.opening &&
          followup === interaction.preferred.followup ? (
            <p>{interaction.feedback.preferred}</p>
          ) : null}
          {opening === "advice" ? <p>{interaction.feedback.advice}</p> : null}
          {opening === "minimize" ? <p>{interaction.feedback.minimize}</p> : null}
          {followup === "fix" ? <p>{interaction.feedback.fix}</p> : null}
          {followup === "why" ? <p>{interaction.feedback.why}</p> : null}
          <p>{interaction.learningPoint}</p>
        </CaregiverFeedback>
      ) : null}
    </section>
  );
}
