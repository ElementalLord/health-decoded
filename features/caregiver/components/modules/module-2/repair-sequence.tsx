"use client";

import { useRef, useState } from "react";

import { CaregiverFeedback } from "../../foundation/caregiver-feedback";
import { caregiverModule2 } from "../../../content/caregiver-module-2";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-2.module.css";

type RepairLineId = (typeof caregiverModule2.interactions.repair.lines)[number]["id"];

export function RepairSequence() {
  const interaction = caregiverModule2.interactions.repair;
  const { markInteractionSubmitted } = useCaregiverSession();
  const [order, setOrder] = useState(interaction.lines.map(({ id }) => id));
  const [removed, setRemoved] = useState<readonly RepairLineId[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);

  const activeOrder = order.filter((id) => !removed.includes(id));
  const defenseIncluded = !removed.includes("defense");
  const preferred =
    interaction.preferredOrder.every((id, index) => activeOrder[index] === id) &&
    activeOrder.length === interaction.preferredOrder.length;
  const actionIndex = activeOrder.indexOf("action");
  const changeIndex = activeOrder.indexOf("change");
  const changeBeforeAction = changeIndex >= 0 && actionIndex >= 0 && changeIndex < actionIndex;
  const feedback = defenseIncluded
    ? interaction.feedback.defense
    : changeBeforeAction
      ? interaction.feedback.changeFirst
      : preferred
        ? interaction.feedback.preferred
        : interaction.feedback.changeFirst;

  function move(id: RepairLineId, direction: -1 | 1) {
    setOrder((current) => {
      const activeIds = current.filter((item) => !removed.includes(item));
      const activeIndex = activeIds.indexOf(id);
      const adjacentId = activeIds[activeIndex + direction];
      if (!adjacentId) return current;
      const currentIndex = current.indexOf(id);
      const nextIndex = current.indexOf(adjacentId);
      const next = [...current];
      [next[currentIndex], next[nextIndex]] = [next[nextIndex]!, next[currentIndex]!];
      return next;
    });
    setSubmitted(false);
    requestAnimationFrame(() =>
      listRef.current?.querySelector<HTMLButtonElement>(`[data-line-id="${id}"]`)?.focus(),
    );
  }

  function toggleRemoved(id: RepairLineId) {
    setRemoved((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
    setSubmitted(false);
  }

  function submit() {
    setSubmitted(true);
    setSubmissionCount((count) => count + 1);
    markInteractionSubmitted(interaction.id);
  }

  return (
    <section
      className={styles.repairSequence}
      aria-labelledby={`${interaction.id}-heading`}
      data-interaction-id={interaction.id}
      data-submitted={submitted ? "true" : "false"}
    >
      <div className={styles.interactionHeading}>
        <p className={styles.sectionLabel}>Optional practice · repair sequence</p>
        <h2 id={`${interaction.id}-heading`}>{interaction.title}</h2>
        <p>{interaction.prompt}</p>
      </div>
      <ol ref={listRef} className={styles.repairWorkspace}>
        {order.map((id) => {
          const line = interaction.lines.find((item) => item.id === id)!;
          const isRemoved = removed.includes(id);
          const activeIndex = activeOrder.indexOf(id);
          return (
            <li key={id} data-removed={isRemoved ? "true" : "false"}>
              <span className={styles.repairPosition}>
                {isRemoved ? "Removed" : `Position ${activeIndex + 1}`}
              </span>
              <p>{line.copy}</p>
              <div>
                <button
                  data-line-id={id}
                  type="button"
                  disabled={isRemoved || activeIndex === 0}
                  onClick={() => move(id, -1)}
                  aria-label={`Move “${line.copy}” up`}
                >
                  Move up
                </button>
                <button
                  type="button"
                  disabled={isRemoved || activeIndex === activeOrder.length - 1}
                  onClick={() => move(id, 1)}
                  aria-label={`Move “${line.copy}” down`}
                >
                  Move down
                </button>
                <button type="button" onClick={() => toggleRemoved(id)}>
                  {isRemoved ? "Return to repair" : interaction.remove}
                </button>
              </div>
            </li>
          );
        })}
      </ol>
      <button className={styles.primaryAction} type="button" onClick={submit}>
        {interaction.submit}
      </button>
      {submitted ? (
        <CaregiverFeedback
          key={submissionCount}
          focusWhen
          heading={interaction.learningPoint}
          tone="neutral"
        >
          <p>{feedback}</p>
          <ol className={styles.sequenceReview}>
            {activeOrder.map((id) => (
              <li key={id}>{interaction.lines.find((line) => line.id === id)?.copy}</li>
            ))}
          </ol>
        </CaregiverFeedback>
      ) : null}
    </section>
  );
}
