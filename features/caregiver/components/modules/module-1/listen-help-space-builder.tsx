"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { caregiverModule1 } from "../../../content/caregiver-module-1";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-1.module.css";

export function ListenHelpSpaceBuilder() {
  const interaction = caregiverModule1.interactions.response;
  const listening = caregiverModule1.sections.listening;
  const firstRef = useRef<HTMLInputElement>(null);
  const followupRef = useRef<HTMLInputElement>(null);
  const [opening, setOpening] = useState("");
  const [followup, setFollowup] = useState("");
  const [builderStep, setBuilderStep] = useState<1 | 2 | 3>(1);
  const { markInteractionSubmitted } = useCaregiverSession();
  const openingCopy = interaction.openings.find((item) => item.id === opening)?.copy;
  const followupCopy = interaction.followups.find((item) => item.id === followup)?.copy;
  const assembledResponse =
    openingCopy && followupCopy
      ? `${openingCopy.replace(/[.!?]$/, "")}. ${followupCopy}`
      : openingCopy || followupCopy || "Choose an opening and follow-up";
  const preferred =
    opening === interaction.preferred.opening && followup === interaction.preferred.followup;

  function reviewResponse() {
    if (!opening || !followup) return;
    setBuilderStep(3);
    markInteractionSubmitted(interaction.id);
  }

  function revise() {
    setBuilderStep(1);
    requestAnimationFrame(() => firstRef.current?.focus());
  }

  return (
    <section
      className={styles.responseBuilder}
      data-interaction-id={interaction.id}
      data-optional-practice="true"
      aria-labelledby={`${interaction.id}-heading`}
      id={listening.id}
    >
      <div className={styles.supportPrompt}>
        <p className={styles.eyebrow}>Listening is an action</p>
        <h2 id={`${interaction.id}-heading`} tabIndex={-1}>
          Build the next response.
        </h2>
        <p>
          The first response should follow the kind of conversation the person agreed to have.
          Advice changes the speaker, subject, and goal unless it was requested.
        </p>
      </div>

      <div className={styles.responseContrast} aria-label="Listening and fixing compared">
        <div>
          <span>Listening stays with them</span>
          <blockquote>{listening.listeningResponse}</blockquote>
        </div>
        <div>
          <span>Fixing takes over</span>
          <blockquote>{listening.fixingResponse}</blockquote>
        </div>
      </div>

      <blockquote className={styles.builderScenario}>
        “I spent my whole lunch break on insurance calls, and I don’t want advice right now.”
      </blockquote>

      <form onSubmit={(event) => event.preventDefault()}>
        <p className={styles.builderProgress}>Part {builderStep} of 3</p>

        {builderStep === 1 ? (
          <fieldset className={styles.builderChoices}>
            <legend>Choose an opening</legend>
            {interaction.openings.map((item, index) => (
              <label key={item.id} data-selected={opening === item.id ? "true" : undefined}>
                <input
                  ref={index === 0 ? firstRef : undefined}
                  checked={opening === item.id}
                  name={`${interaction.id}-opening`}
                  onChange={(event) => {
                    const value = event.currentTarget.value;
                    setOpening(value);
                  }}
                  type="radio"
                  value={item.id}
                />
                <span>{item.copy}</span>
                <i aria-hidden="true">{opening === item.id ? "✓" : ""}</i>
              </label>
            ))}
            <Button
              disabled={!opening}
              fullWidth={false}
              onClick={() => {
                setBuilderStep(2);
                requestAnimationFrame(() => followupRef.current?.focus());
              }}
              type="button"
            >
              Choose a follow-up
            </Button>
          </fieldset>
        ) : null}

        {builderStep === 2 ? (
          <fieldset className={styles.builderChoices}>
            <legend>Choose what comes next</legend>
            {interaction.followups.map((item, index) => (
              <label key={item.id} data-selected={followup === item.id ? "true" : undefined}>
                <input
                  ref={index === 0 ? followupRef : undefined}
                  checked={followup === item.id}
                  name={`${interaction.id}-followup`}
                  onChange={(event) => {
                    const value = event.currentTarget.value;
                    setFollowup(value);
                  }}
                  type="radio"
                  value={item.id}
                />
                <span>{item.copy}</span>
                <i aria-hidden="true">{followup === item.id ? "✓" : ""}</i>
              </label>
            ))}
            <div className={styles.builderActions}>
              <Button
                fullWidth={false}
                onClick={() => setBuilderStep(1)}
                type="button"
                variant="secondary"
              >
                Back to opening
              </Button>
              <Button disabled={!followup} fullWidth={false} onClick={reviewResponse} type="button">
                Hear the response
              </Button>
            </div>
          </fieldset>
        ) : null}

        <div className={styles.assembledResponse} aria-live="polite" aria-atomic="true">
          <span>Your response</span>
          <blockquote>“{assembledResponse}”</blockquote>
        </div>

        {builderStep === 3 ? (
          <div className={styles.builderFeedback} role="status" aria-live="polite">
            <p>
              <strong>
                {preferred
                  ? "This response listens before it leads."
                  : "Notice what the response changes."}
              </strong>
            </p>
            {preferred ? <p>{interaction.feedback.preferred}</p> : null}
            {opening === "advice" ? <p>{interaction.feedback.advice}</p> : null}
            {opening === "minimize" ? <p>{interaction.feedback.minimize}</p> : null}
            {followup === "fix" ? <p>{interaction.feedback.fix}</p> : null}
            {followup === "why" ? <p>{interaction.feedback.why}</p> : null}
            <p>{interaction.learningPoint}</p>
            <Button fullWidth={false} onClick={revise} type="button" variant="secondary">
              Build another response
            </Button>
          </div>
        ) : null}
      </form>
    </section>
  );
}
