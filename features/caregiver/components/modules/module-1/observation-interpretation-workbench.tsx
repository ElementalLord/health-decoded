"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { caregiverModule1 } from "../../../content/caregiver-module-1";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-1.module.css";

type Group = (typeof caregiverModule1.interactions.observation.groups)[number];

export function ObservationInterpretationWorkbench() {
  const interaction = caregiverModule1.interactions.observation;
  const promptRef = useRef<HTMLLegendElement>(null);
  const [statementIndex, setStatementIndex] = useState(0);
  const [placements, setPlacements] = useState<Record<string, Group>>({});
  const [otherPossibility, setOtherPossibility] = useState("");
  const { markInteractionSubmitted } = useCaregiverSession();
  const statement = interaction.statements[statementIndex]!;
  const selected = placements[statement.id];
  const isAccurate = selected === statement.preferredGroup;
  const isLast = statementIndex === interaction.statements.length - 1;
  const answeredCount = Object.keys(placements).length;

  function choose(group: Group) {
    const nextPlacements = { ...placements, [statement.id]: group };
    setPlacements(nextPlacements);
    if (Object.keys(nextPlacements).length === interaction.statements.length) {
      markInteractionSubmitted(interaction.id);
    }
  }

  function move(direction: -1 | 1) {
    setStatementIndex((current) =>
      Math.min(interaction.statements.length - 1, Math.max(0, current + direction)),
    );
    requestAnimationFrame(() => promptRef.current?.focus());
  }

  return (
    <section
      className={styles.workbench}
      data-interaction-id={interaction.id}
      data-core-application="true"
      aria-labelledby={`${interaction.id}-heading`}
    >
      <div className={styles.interactionHeading}>
        <p className={styles.eyebrow}>Notice before you name</p>
        <h2 id={`${interaction.id}-heading`} tabIndex={-1}>
          Observed or interpreted?
        </h2>
        <p>
          Take one statement at a time. Choose what can be verified, or what may be a meaning we’re
          adding.
        </p>
      </div>

      <div className={styles.statementProgress} aria-label={`${answeredCount} of 6 answered`}>
        <span aria-hidden="true" style={{ width: `${(answeredCount / 6) * 100}%` }} />
      </div>

      <form onSubmit={(event) => event.preventDefault()}>
        <fieldset className={styles.focusedQuestion}>
          <legend ref={promptRef} tabIndex={-1}>
            <span>
              Statement {statementIndex + 1} of {interaction.statements.length}
            </span>
            {statement.copy}
          </legend>
          <div className={styles.binaryChoices}>
            {interaction.groups.map((group) => (
              <label key={group} data-selected={selected === group ? "true" : undefined}>
                <input
                  checked={selected === group}
                  name={`${interaction.id}-${statement.id}`}
                  onChange={() => choose(group)}
                  type="radio"
                  value={group}
                />
                <span className={styles.choiceText}>
                  <strong>{group}</strong>
                  <small>
                    {group === "Observed"
                      ? "Something we can verify."
                      : "A meaning we may be adding."}
                  </small>
                </span>
                <span className={styles.choiceMark} aria-hidden="true">
                  {selected === group ? "✓" : ""}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className={styles.learningFeedback} aria-live="polite" aria-atomic="true">
          {selected ? (
            <>
              <p className={isAccurate ? styles.feedbackAccurate : styles.feedbackReframe}>
                <strong>
                  {isAccurate ? "Yes, keep that distinction." : "A useful place to pause."}
                </strong>
              </p>
              <p>
                {statement.preferredGroup === "Observed"
                  ? "This describes something visible in the exchange, without deciding why it happened."
                  : "This could be true, but the exchange does not verify it. Keep it as a possibility."}
              </p>
            </>
          ) : (
            <p>Choose either response. This is practice, not a test.</p>
          )}
        </div>

        <div className={styles.questionNavigation}>
          <Button
            disabled={statementIndex === 0}
            fullWidth={false}
            onClick={() => move(-1)}
            type="button"
            variant="secondary"
          >
            Previous
          </Button>
          {!isLast ? (
            <Button disabled={!selected} fullWidth={false} onClick={() => move(1)} type="button">
              Next statement
            </Button>
          ) : answeredCount === interaction.statements.length ? (
            <p className={styles.activityComplete}>✓ All six statements reviewed</p>
          ) : null}
        </div>
      </form>

      {answeredCount === interaction.statements.length ? (
        <div className={styles.noticeSummary} role="status">
          <p>Notice first. Interpret carefully.</p>
          <span>{interaction.learningPoint}</span>
        </div>
      ) : null}

      <details className={styles.quietDetails}>
        <summary>Try another possible explanation</summary>
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
          <small>Session-only and excluded from analytics and AI Tutor transfer.</small>
        </label>
      </details>
    </section>
  );
}
