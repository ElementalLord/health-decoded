"use client";

import { useRef, useState, type FormEvent } from "react";

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
  const [submitted, setSubmitted] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  function updateRow(actionId: string, update: Partial<RowState>) {
    setRows((current) => ({
      ...current,
      [actionId]: { ...current[actionId]!, ...update },
    }));
    setSubmitted(false);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formRef.current?.reportValidity()) return;
    setSubmitted(true);
    setSubmissionCount((count) => count + 1);
    markInteractionSubmitted(interaction.id);
  }

  const allUnknown = interaction.actions.every((action) => rows[action.id]?.unknown);
  const includesSupport = interaction.actions.some(
    (action) => rows[action.id]?.impact === "support",
  );
  const preferredImpacts = interaction.actions.every(
    (action) => rows[action.id]?.impact === action.preferredImpact,
  );

  const feedback = !allUnknown
    ? interaction.feedback.unknown
    : includesSupport
      ? interaction.feedback.support
      : preferredImpacts
        ? interaction.feedback.preferred
        : interaction.feedback.preferred;

  return (
    <section
      className={styles.consequenceMap}
      aria-labelledby={`${interaction.id}-heading`}
      data-interaction-id={interaction.id}
      data-submitted={submitted ? "true" : "false"}
    >
      <div className={styles.interactionHeading}>
        <p className={styles.sectionLabel}>Optional practice · consequence map</p>
        <h2 id={`${interaction.id}-heading`}>{interaction.title}</h2>
        <p>{interaction.prompt}</p>
      </div>

      <form ref={formRef} onSubmit={submit}>
        <div className={styles.mapRows}>
          {interaction.actions.map((action) => {
            const row = rows[action.id]!;
            return (
              <fieldset key={action.id} className={styles.mapRow}>
                <legend>{action.label}</legend>
                <label>
                  <span>Leah&apos;s likely intention</span>
                  <select
                    required
                    value={row.intention}
                    onChange={(event) =>
                      updateRow(action.id, { intention: event.currentTarget.value })
                    }
                  >
                    <option value="">Choose an intention</option>
                    {interaction.intentions.map((intention) => (
                      <option key={intention} value={intention}>
                        {intention}
                      </option>
                    ))}
                  </select>
                </label>
                <span className={styles.mapConnector} aria-hidden="true" />
                <label>
                  <span>One possible impact</span>
                  <select
                    required
                    value={row.impact}
                    onChange={(event) =>
                      updateRow(action.id, { impact: event.currentTarget.value })
                    }
                  >
                    <option value="">Choose an impact</option>
                    {interaction.impacts.map((impact) => (
                      <option key={impact} value={impact}>
                        {impact}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={styles.unknownChoice}>
                  <input
                    type="checkbox"
                    checked={row.unknown}
                    onChange={(event) =>
                      updateRow(action.id, { unknown: event.currentTarget.checked })
                    }
                  />
                  <span>{interaction.unknown}</span>
                </label>
                {submitted ? (
                  <p className={styles.srResult}>
                    {action.label}: intention {row.intention}; possible impact {row.impact};{" "}
                    {row.unknown
                      ? interaction.unknown
                      : "Andre's exact experience was not kept open."}
                  </p>
                ) : null}
              </fieldset>
            );
          })}
        </div>
        <button className={styles.primaryAction} type="submit">
          {interaction.submit}
        </button>
      </form>

      {submitted ? (
        <CaregiverFeedback
          key={submissionCount}
          focusWhen
          heading={interaction.learningPoint}
          tone="neutral"
        >
          <p>{feedback}</p>
        </CaregiverFeedback>
      ) : null}
    </section>
  );
}
