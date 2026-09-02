"use client";

import { useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { CaregiverFeedback } from "../../foundation/caregiver-feedback";
import { caregiverModule2 } from "../../../content/caregiver-module-2";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-2.module.css";

export function SupportBoundaryContinuum() {
  const interaction = caregiverModule2.interactions.continuum;
  const { markInteractionSubmitted } = useCaregiverSession();
  const [behaviorIndex, setBehaviorIndex] = useState(0);
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [assistedPlacements, setAssistedPlacements] = useState<Record<string, boolean>>({});
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const [completed, setCompleted] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);
  const promptRef = useRef<HTMLLegendElement>(null);
  const behavior = interaction.behaviors[behaviorIndex]!;
  const placement = placements[behavior.id] ?? "";
  const behaviorReviewed = Boolean(reviewed[behavior.id]);

  function reviewBehavior(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!placement) return;
    const nextAttempts = { ...attempts };
    if (placement !== behavior.preferredCategory) {
      const attempt = (nextAttempts[behavior.id] ?? 0) + 1;
      nextAttempts[behavior.id] = attempt;
      if (attempt >= 3) {
        setPlacements((current) => ({
          ...current,
          [behavior.id]: behavior.preferredCategory,
        }));
        setAssistedPlacements((current) => ({ ...current, [behavior.id]: true }));
      }
    }
    setAttempts(nextAttempts);
    setReviewed((current) => ({ ...current, [behavior.id]: true }));
    setSubmissionCount((count) => count + 1);
    if (behaviorIndex === interaction.behaviors.length - 1) {
      setCompleted(true);
      markInteractionSubmitted(interaction.id);
    }
  }

  function moveToBehavior(nextIndex: number) {
    setBehaviorIndex(nextIndex);
    requestAnimationFrame(() => promptRef.current?.focus());
  }

  return (
    <section
      className={styles.continuum}
      aria-labelledby={`${interaction.id}-heading`}
      data-interaction-id={interaction.id}
      data-submitted={completed ? "true" : "false"}
    >
      <div className={styles.interactionHeading}>
        <p className={styles.eyebrow}>Practice · relational continuum</p>
        <h3 id={`${interaction.id}-heading`}>{interaction.title}</h3>
        <p>{interaction.prompt}</p>
      </div>

      <form onSubmit={reviewBehavior}>
        <fieldset className={styles.classificationPrompt}>
          <legend ref={promptRef} tabIndex={-1}>
            <span>
              Situation {behaviorIndex + 1} of {interaction.behaviors.length}
            </span>
            {behavior.copy}
          </legend>
          <div className={styles.categoryChoices}>
            {interaction.categories.map((category) => (
              <label key={category} data-selected={placement === category ? "true" : undefined}>
                <input
                  checked={placement === category}
                  name={`continuum-${behavior.id}`}
                  onChange={() => {
                    setPlacements((current) => ({ ...current, [behavior.id]: category }));
                    setReviewed((current) => ({ ...current, [behavior.id]: false }));
                    setCompleted(false);
                  }}
                  required
                  type="radio"
                  value={category}
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <Button fullWidth={false} type="submit">
          Review this situation
        </Button>
      </form>

      {behaviorReviewed ? (
        <CaregiverFeedback
          key={submissionCount}
          focusWhen
          heading={behavior.preferredCategory}
          tone="neutral"
        >
          <p>
            <strong>
              {(assistedPlacements[behavior.id] ? behavior.preferredCategory : placement) ===
              behavior.preferredCategory
                ? "This response is ready to continue. "
                : "This response needs review. "}
            </strong>
            {behavior.feedback}
          </p>
          {assistedPlacements[behavior.id] ? (
            <p className={styles.answerAssist}>Answer filled in after three attempts.</p>
          ) : null}
          <div className={styles.feedbackActions}>
            {behaviorIndex > 0 ? (
              <Button
                fullWidth={false}
                onClick={() => moveToBehavior(behaviorIndex - 1)}
                type="button"
                variant="secondary"
              >
                Previous situation
              </Button>
            ) : null}
            {behaviorIndex < interaction.behaviors.length - 1 ? (
              <Button
                fullWidth={false}
                onClick={() => moveToBehavior(behaviorIndex + 1)}
                type="button"
              >
                Next situation
              </Button>
            ) : completed ? (
              <>
                <p className={styles.activityComplete}>✓ All six situations reviewed</p>
                <Button
                  fullWidth={false}
                  onClick={() => moveToBehavior(0)}
                  type="button"
                  variant="secondary"
                >
                  {interaction.revise}
                </Button>
              </>
            ) : null}
          </div>
        </CaregiverFeedback>
      ) : null}
    </section>
  );
}
