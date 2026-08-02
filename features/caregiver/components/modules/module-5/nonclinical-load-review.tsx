"use client";

import { useState } from "react";
import { CaregiverFeedback } from "../../foundation/caregiver-feedback";
import { caregiverModule5 } from "../../../content/caregiver-module-5";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-5.module.css";

export function NonclinicalLoadReview() {
  const item = caregiverModule5.interactions.load;
  const [patterns, setPatterns] = useState<string[]>([]);
  const [discussion, setDiscussion] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [assisted, setAssisted] = useState(false);
  const { markInteractionSubmitted } = useCaregiverSession();
  const patternCorrect = item.patterns.every(
    (pattern) => patterns.includes(pattern.id) === pattern.preferred,
  );
  const discussionCorrect = item.discussions.some(
    (choice) => choice.id === discussion && choice.preferred,
  );
  return (
    <section
      className={styles.loadReview}
      data-interaction-id={item.id}
      data-core-application="false"
      aria-labelledby={`${item.id}-heading`}
    >
      <h2 id={`${item.id}-heading`}>{item.title}</h2>
      <p>{item.prompt}</p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!discussion) return;
          const correct = patternCorrect && discussionCorrect;
          const nextAttempt = attempts + (correct ? 0 : 1);
          setAttempts(nextAttempt);
          if (!correct && nextAttempt >= 3) {
            setPatterns(
              item.patterns.filter((pattern) => pattern.preferred).map((pattern) => pattern.id),
            );
            setDiscussion(item.discussions.find((choice) => choice.preferred)?.id ?? "");
            setAssisted(true);
          }
          setSubmitted(true);
          markInteractionSubmitted(item.id);
        }}
      >
        <fieldset>
          <legend>Patterns in Elena&apos;s fictional week</legend>
          <div className={styles.inlineChoices}>
            {item.patterns.map((pattern) => (
              <label key={pattern.id}>
                <input
                  type="checkbox"
                  checked={patterns.includes(pattern.id)}
                  onChange={() => {
                    setPatterns((current) =>
                      current.includes(pattern.id)
                        ? current.filter((id) => id !== pattern.id)
                        : [...current, pattern.id],
                    );
                    setSubmitted(false);
                  }}
                />
                <span>{pattern.copy}</span>
                {submitted ? (
                  <small
                    className={
                      patterns.includes(pattern.id) === pattern.preferred
                        ? styles.correct
                        : styles.needsReview
                    }
                  >
                    {patterns.includes(pattern.id) === pattern.preferred
                      ? "This pattern fits the scenario."
                      : "This pattern needs review."}
                  </small>
                ) : null}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>One arrangement to discuss</legend>
          <div className={styles.inlineChoices}>
            {item.discussions.map((choice) => (
              <label key={choice.id}>
                <input
                  type="radio"
                  name="m5-discussion"
                  value={choice.id}
                  checked={discussion === choice.id}
                  onChange={() => {
                    setDiscussion(choice.id);
                    setSubmitted(false);
                  }}
                />
                <span>{choice.copy}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className={styles.actions}>
          <button className={styles.primaryAction} type="submit" disabled={!discussion}>
            {item.submit}
          </button>
        </div>
      </form>
      {submitted ? (
        <CaregiverFeedback
          focusWhen
          heading={
            discussion === "burnout" || discussion === "medical"
              ? "Review the arrangement"
              : "Load reviewed"
          }
          tone={discussion === "burnout" || discussion === "medical" ? "warning" : "supportive"}
        >
          <p>
            {discussion === "burnout"
              ? item.feedback.burnout
              : discussion === "medical"
                ? item.feedback.medical
                : item.feedback.preferred}
          </p>
          <p>{item.learningPoint}</p>
          {assisted ? <p>Answers filled in after three attempts.</p> : null}
        </CaregiverFeedback>
      ) : null}
    </section>
  );
}
