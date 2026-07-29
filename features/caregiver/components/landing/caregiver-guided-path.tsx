"use client";

import { useRef, useState } from "react";

import { CaregiverFeedback } from "../foundation/caregiver-feedback";
import {
  caregiverBeginningChoices,
  caregiverLandingContent,
  caregiverLandingRoutes,
  type CaregiverBeginningChoiceId,
} from "../../content/caregiver-landing";
import styles from "../../styles/caregiver-landing.module.css";

export function CaregiverGuidedPath() {
  const firstChoiceRef = useRef<HTMLInputElement>(null);
  const [selectedId, setSelectedId] = useState<CaregiverBeginningChoiceId | null>(null);
  const [submittedId, setSubmittedId] = useState<CaregiverBeginningChoiceId | null>(null);
  const [submissionCount, setSubmissionCount] = useState(0);
  const { guidedPath } = caregiverLandingContent;
  const submittedChoice = caregiverBeginningChoices.find((choice) => choice.id === submittedId);

  function reviseSelection(nextId: CaregiverBeginningChoiceId) {
    setSelectedId(nextId);
    setSubmittedId(null);
  }

  function submitSelection() {
    if (!selectedId) return;
    setSubmittedId(selectedId);
    setSubmissionCount((count) => count + 1);
  }

  function changeChoice() {
    setSelectedId(null);
    setSubmittedId(null);
    firstChoiceRef.current?.focus();
  }

  return (
    <section
      id="caregiver-guided-path"
      className={styles.guidedPath}
      aria-labelledby="caregiver-guided-path-title"
      data-interaction-id="CG-LANDING-I02"
    >
      <div className={styles.sectionHeading}>
        <p className={styles.sectionNumber}>Five-part path</p>
        <h2 id="caregiver-guided-path-title">{guidedPath.sectionTitle}</h2>
        <p>{guidedPath.introduction}</p>
      </div>

      <ol className={styles.moduleSequence}>
        {caregiverLandingRoutes.map((route) => (
          <li key={route.id} data-caregiver-destination={route.id}>
            <span className={styles.moduleOrder}>{String(route.order).padStart(2, "0")}</span>
            <div>
              <h3>{route.moduleTitle}</h3>
              <p>{route.purpose}</p>
            </div>
            <span className={styles.moduleTime}>{route.time}</span>
          </li>
        ))}
      </ol>

      <div className={styles.beginChooser}>
        <div className={styles.beginChooserHeading}>
          <p className={styles.sectionNumber}>{guidedPath.interactionTitle}</p>
          <h3>{guidedPath.prompt}</h3>
        </div>
        <fieldset className={styles.beginFieldset}>
          <legend className={styles.visuallyHidden}>{guidedPath.prompt}</legend>
          {caregiverBeginningChoices.map((choice, index) => (
            <label
              key={choice.id}
              className={styles.beginChoice}
              data-selected={selectedId === choice.id ? "true" : "false"}
            >
              <input
                ref={index === 0 ? firstChoiceRef : undefined}
                type="radio"
                name="caregiver-beginning-strategy"
                value={choice.id}
                checked={selectedId === choice.id}
                onChange={() => reviseSelection(choice.id)}
              />
              <span>{choice.label}</span>
            </label>
          ))}
        </fieldset>
        <button
          className={styles.actionButton}
          type="button"
          disabled={!selectedId}
          onClick={submitSelection}
        >
          {guidedPath.submit}
        </button>

        {submittedChoice ? (
          <div className={styles.beginResult}>
            <CaregiverFeedback
              key={submissionCount}
              focusWhen
              heading={submittedChoice.label}
              tone="supportive"
            >
              <p>{submittedChoice.feedback}</p>
            </CaregiverFeedback>
            <button className={styles.textButton} type="button" onClick={changeChoice}>
              {guidedPath.revise}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
