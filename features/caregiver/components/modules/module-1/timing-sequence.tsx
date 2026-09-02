"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { caregiverModule1 } from "../../../content/caregiver-module-1";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-1.module.css";

const contextNotes = [
  "Mira has already said not tonight.",
  "Mira is in the middle of her workday.",
  "This is their usual call, not a diabetes appointment.",
] as const;

export function TimingSequence() {
  const interaction = caregiverModule1.interactions.timing;
  const legendRef = useRef<HTMLLegendElement>(null);
  const [momentIndex, setMomentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { markInteractionSubmitted } = useCaregiverSession();
  const moment = interaction.moments[momentIndex]!;
  const answer = answers[moment.id];
  const selectedChoice = moment.choices.find((choice) => choice.id === answer);
  const respectful = answer === moment.preferred;
  const answeredCount = Object.keys(answers).length;
  const isLast = momentIndex === interaction.moments.length - 1;

  function choose(value: string) {
    const nextAnswers = { ...answers, [moment.id]: value };
    setAnswers(nextAnswers);
    if (Object.keys(nextAnswers).length === interaction.moments.length) {
      markInteractionSubmitted(interaction.id);
    }
  }

  function move(direction: -1 | 1) {
    setMomentIndex((index) =>
      Math.min(interaction.moments.length - 1, Math.max(0, index + direction)),
    );
    requestAnimationFrame(() => legendRef.current?.focus());
  }

  return (
    <section
      className={styles.timeline}
      data-interaction-id={interaction.id}
      data-optional-practice="true"
      aria-labelledby={`${interaction.id}-heading`}
    >
      <div className={styles.timingCopy}>
        <p className={styles.eyebrow}>Timing changes the decision</p>
        <h2 id={`${interaction.id}-heading`} tabIndex={-1}>
          Care across three moments.
        </h2>
        <p className={styles.timingIntroduction}>
          Respecting “not now” includes stopping, protecting privacy, and asking carefully before
          returning.
        </p>

        <fieldset className={styles.decisionChoices}>
          <legend ref={legendRef} tabIndex={-1}>
            <span>
              Moment {momentIndex + 1} of {interaction.moments.length}
            </span>
            {moment.label}
          </legend>
          <p className={styles.contextNote}>{contextNotes[momentIndex]}</p>
          {moment.choices.map((choice) => (
            <label key={choice.id} data-selected={answer === choice.id ? "true" : undefined}>
              <input
                checked={answer === choice.id}
                name={`${interaction.id}-${moment.id}`}
                onChange={(event) => choose(event.currentTarget.value)}
                type="radio"
                value={choice.id}
              />
              <span>{choice.copy}</span>
              <i aria-hidden="true">{answer === choice.id ? "✓" : ""}</i>
            </label>
          ))}
        </fieldset>

        <div className={styles.questionNavigation}>
          <Button
            disabled={momentIndex === 0}
            fullWidth={false}
            onClick={() => move(-1)}
            type="button"
            variant="secondary"
          >
            Previous moment
          </Button>
          {!isLast ? (
            <Button disabled={!answer} fullWidth={false} onClick={() => move(1)} type="button">
              Next moment
            </Button>
          ) : answeredCount === interaction.moments.length ? (
            <p className={styles.activityComplete}>✓ All three moments reviewed</p>
          ) : null}
        </div>
      </div>

      <div
        className={styles.timingScene}
        data-outcome={answer ? (respectful ? "space" : "pressure") : "waiting"}
      >
        <p className={styles.sceneTime}>{moment.label}</p>
        <div className={styles.outcomeMessage} aria-live="polite" aria-atomic="true">
          {selectedChoice ? (
            <p>
              <strong>
                {respectful ? "This protects Mira’s choice." : "This creates new pressure."}
              </strong>
              {selectedChoice.feedback}
            </p>
          ) : (
            <p>Choose what Jules does next to see how timing changes the meaning of support.</p>
          )}
        </div>
        {momentIndex === 2 ? (
          <p className={styles.timingPrinciple}>
            Respecting space is not the same as disappearing.
          </p>
        ) : null}
      </div>
    </section>
  );
}
