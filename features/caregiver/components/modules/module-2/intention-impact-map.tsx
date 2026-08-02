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
  const [impactAttempts, setImpactAttempts] = useState<Record<string, number>>({});
  const [assistedImpacts, setAssistedImpacts] = useState<Record<string, boolean>>({});
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
    const nextRows = { ...rows };
    const nextImpactAttempts = { ...impactAttempts };
    const nextAssistedImpacts: Record<string, boolean> = {};
    interaction.actions.forEach((action) => {
      if (rows[action.id]?.impact !== action.preferredImpact) {
        const attempt = (nextImpactAttempts[action.id] ?? 0) + 1;
        nextImpactAttempts[action.id] = attempt;
        if (attempt >= 3) {
          nextRows[action.id] = { ...nextRows[action.id]!, impact: action.preferredImpact };
          nextAssistedImpacts[action.id] = true;
        }
      }
    });
    setRows(nextRows);
    setImpactAttempts(nextImpactAttempts);
    setAssistedImpacts(nextAssistedImpacts);
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

  const feedback: string | null = !allUnknown
    ? interaction.feedback.unknown
    : includesSupport
      ? interaction.feedback.support
      : preferredImpacts
        ? interaction.feedback.preferred
        : interaction.feedback.fallback;

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
                    onChange={(event) => {
                      const value = event.currentTarget.value;
                      updateRow(action.id, { intention: value });
                    }}
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
                    onChange={(event) => {
                      const value = event.currentTarget.value;
                      updateRow(action.id, { impact: value });
                    }}
                  >
                    <option value="">Choose an impact</option>
                    {interaction.impacts.map((impact) => (
                      <option key={impact} value={impact}>
                        {impact}
                      </option>
                    ))}
                  </select>
                  {assistedImpacts[action.id] ? (
                    <span className={styles.answerAssist}>
                      Answer filled in after three attempts.
                    </span>
                  ) : null}
                </label>
                <label className={styles.unknownChoice}>
                  <input
                    type="checkbox"
                    required
                    checked={row.unknown}
                    onChange={(event) => {
                      const checked = event.currentTarget.checked;
                      updateRow(action.id, { unknown: checked });
                    }}
                  />
                  <span>{interaction.unknown}</span>
                </label>
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
          {feedback ? <p>{feedback}</p> : null}
          <ul className={styles.srOnly}>
            {interaction.actions.map((action) => {
              const row = rows[action.id]!;
              return (
                <li key={action.id}>
                  {action.label}: intention {row.intention}; possible impact {row.impact};{" "}
                  {interaction.unknown}
                </li>
              );
            })}
          </ul>
        </CaregiverFeedback>
      ) : null}
    </section>
  );
}
