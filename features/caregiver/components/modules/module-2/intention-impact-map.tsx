"use client";

import { useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { CaregiverFeedback } from "../../foundation/caregiver-feedback";
import { caregiverModule2 } from "../../../content/caregiver-module-2";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-2.module.css";

type RowState = {
  intention: string;
  impact: string;
  unknown: boolean;
};

const initialRows = Object.fromEntries(
  caregiverModule2.interactions.intentionImpact.actions.map((action) => [
    action.id,
    { intention: "", impact: "", unknown: false },
  ]),
) as Record<string, RowState>;

export function IntentionImpactMap() {
  const interaction = caregiverModule2.interactions.intentionImpact;
  const { markInteractionSubmitted } = useCaregiverSession();
  const [rows, setRows] = useState(initialRows);
  const [actionIndex, setActionIndex] = useState(0);
  const [impactAttempts, setImpactAttempts] = useState<Record<string, number>>({});
  const [assistedImpacts, setAssistedImpacts] = useState<Record<string, boolean>>({});
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const [completed, setCompleted] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const promptRef = useRef<HTMLLegendElement>(null);
  const action = interaction.actions[actionIndex]!;
  const row = rows[action.id]!;
  const actionReviewed = Boolean(reviewed[action.id]);

  function updateRow(update: Partial<RowState>) {
    setRows((current) => ({
      ...current,
      [action.id]: { ...current[action.id]!, ...update },
    }));
    setReviewed((current) => ({ ...current, [action.id]: false }));
    setCompleted(false);
  }

  function reviewAction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formRef.current?.reportValidity()) return;
    const nextAttempts = { ...impactAttempts };
    if (row.impact !== action.preferredImpact) {
      const attempt = (nextAttempts[action.id] ?? 0) + 1;
      nextAttempts[action.id] = attempt;
      if (attempt >= 3) {
        setRows((current) => ({
          ...current,
          [action.id]: { ...current[action.id]!, impact: action.preferredImpact },
        }));
        setAssistedImpacts((current) => ({ ...current, [action.id]: true }));
      }
    }
    setImpactAttempts(nextAttempts);
    setReviewed((current) => ({ ...current, [action.id]: true }));
    setSubmissionCount((count) => count + 1);

    if (actionIndex === interaction.actions.length - 1) {
      setCompleted(true);
      markInteractionSubmitted(interaction.id);
    }
  }

  function moveToAction(nextIndex: number) {
    setActionIndex(nextIndex);
    requestAnimationFrame(() => promptRef.current?.focus());
  }

  const currentImpact = assistedImpacts[action.id] ? action.preferredImpact : row.impact;
  const feedback = !row.unknown
    ? interaction.feedback.unknown
    : currentImpact === "support"
      ? interaction.feedback.support
      : currentImpact === action.preferredImpact
        ? interaction.feedback.preferred
        : interaction.feedback.fallback;

  return (
    <section
      className={styles.consequenceMap}
      aria-labelledby={`${interaction.id}-heading`}
      data-interaction-id={interaction.id}
      data-submitted={completed ? "true" : "false"}
    >
      <div className={styles.interactionHeading}>
        <p className={styles.eyebrow}>Practice · consequence map</p>
        <h3 id={`${interaction.id}-heading`}>{interaction.title}</h3>
        <p>{interaction.prompt}</p>
      </div>

      <p className={styles.activityProgress}>
        Action {actionIndex + 1} of {interaction.actions.length}
      </p>

      <form ref={formRef} onSubmit={reviewAction}>
        <fieldset className={styles.mappingPrompt}>
          <legend ref={promptRef} tabIndex={-1}>
            <span>
              Action {actionIndex + 1} of {interaction.actions.length}
            </span>
            {action.label}
          </legend>

          <fieldset className={styles.choiceGroup}>
            <legend>What might Leah be trying to do?</legend>
            <div className={styles.choiceGrid}>
              {interaction.intentions.map((intention) => (
                <label
                  key={intention}
                  data-selected={row.intention === intention ? "true" : undefined}
                >
                  <input
                    checked={row.intention === intention}
                    name={`${action.id}-intention`}
                    onChange={() => updateRow({ intention })}
                    required
                    type="radio"
                    value={intention}
                  />
                  <span>{intention}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className={styles.choiceGroup}>
            <legend>What might this create for Andre?</legend>
            <div className={styles.choiceGrid}>
              {interaction.impacts.map((impact) => (
                <label key={impact} data-selected={row.impact === impact ? "true" : undefined}>
                  <input
                    checked={row.impact === impact}
                    name={`${action.id}-impact`}
                    onChange={() => updateRow({ impact })}
                    required
                    type="radio"
                    value={impact}
                  />
                  <span>{impact}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className={styles.unknownChoice} data-selected={row.unknown ? "true" : undefined}>
            <input
              checked={row.unknown}
              onChange={(event) => {
                const checked = event.currentTarget.checked;
                updateRow({ unknown: checked });
              }}
              required
              type="checkbox"
            />
            <span>
              <strong>Keep his perspective open.</strong>
              {interaction.unknown}
            </span>
          </label>
        </fieldset>

        <Button fullWidth={false} type="submit">
          Review this action
        </Button>
      </form>

      {actionReviewed ? (
        <CaregiverFeedback
          key={submissionCount}
          focusWhen
          heading={interaction.learningPoint}
          tone="neutral"
        >
          <p>{feedback}</p>
          {assistedImpacts[action.id] ? (
            <p className={styles.answerAssist}>Answer filled in after three attempts.</p>
          ) : null}
          <div className={styles.feedbackActions}>
            {actionIndex > 0 ? (
              <Button
                fullWidth={false}
                onClick={() => moveToAction(actionIndex - 1)}
                type="button"
                variant="secondary"
              >
                Previous action
              </Button>
            ) : null}
            {actionIndex < interaction.actions.length - 1 ? (
              <Button fullWidth={false} onClick={() => moveToAction(actionIndex + 1)} type="button">
                Next action
              </Button>
            ) : completed ? (
              <p className={styles.activityComplete}>✓ All three actions reviewed</p>
            ) : null}
          </div>
        </CaregiverFeedback>
      ) : null}
    </section>
  );
}
