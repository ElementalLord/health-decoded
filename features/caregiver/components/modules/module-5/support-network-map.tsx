"use client";

import { useState } from "react";
import { CaregiverFeedback } from "../../foundation/caregiver-feedback";
import { caregiverModule5 } from "../../../content/caregiver-module-5";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-5.module.css";

export function SupportNetworkMap() {
  const item = caregiverModule5.interactions.network;
  const [backup, setBackup] = useState<Record<string, number>>({});
  const [info, setInfo] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [assisted, setAssisted] = useState(false);
  const { markInteractionSubmitted } = useCaregiverSession();
  const complete = item.tasks.every(
    (task) => backup[task.id] !== undefined && info[task.id] !== undefined,
  );
  const privateSelected = Object.values(info).some((value) => value === 2 || value === 3);
  const onePerson = new Set(Object.values(backup)).size === 1;
  const correct = item.tasks.every(
    (task) =>
      (task.preferredBackups as readonly number[]).includes(backup[task.id] ?? -1) &&
      info[task.id] === task.preferredInfo,
  );
  return (
    <section
      className={styles.networkMap}
      data-interaction-id={item.id}
      data-core-application="false"
      aria-labelledby={`${item.id}-heading`}
    >
      <h2 id={`${item.id}-heading`}>{item.title}</h2>
      <p>{item.prompt}</p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!complete) return;
          const nextAttempt = attempts + (correct ? 0 : 1);
          setAttempts(nextAttempt);
          if (!correct && nextAttempt >= 3) {
            setBackup(
              Object.fromEntries(item.tasks.map((task) => [task.id, task.preferredBackups[0]])),
            );
            setInfo(Object.fromEntries(item.tasks.map((task) => [task.id, task.preferredInfo])));
            setAssisted(true);
          }
          setSubmitted(true);
          markInteractionSubmitted(item.id);
        }}
      >
        <div className={styles.networkRows}>
          {item.tasks.map((task) => (
            <fieldset key={task.id}>
              <legend>{task.copy}</legend>
              <label>
                <span>Backup</span>
                <select
                  required
                  value={backup[task.id] ?? ""}
                  onChange={(event) => {
                    const value = Number(event.currentTarget.value);
                    setBackup((current) => ({
                      ...current,
                      [task.id]: value,
                    }));
                    setSubmitted(false);
                  }}
                >
                  <option value="" disabled>
                    Choose backup
                  </option>
                  {item.backups.map((choice, index) => (
                    <option key={choice} value={index}>
                      {choice}
                    </option>
                  ))}
                </select>
              </label>
              {submitted ? (
                <small
                  className={
                    (task.preferredBackups as readonly number[]).includes(backup[task.id] ?? -1) &&
                    info[task.id] === task.preferredInfo
                      ? styles.correct
                      : styles.needsReview
                  }
                >
                  {(task.preferredBackups as readonly number[]).includes(backup[task.id] ?? -1) &&
                  info[task.id] === task.preferredInfo
                    ? "This task-level match fits."
                    : "This task-level match needs review."}
                </small>
              ) : null}
              <label>
                <span>Minimum information</span>
                <select
                  required
                  value={info[task.id] ?? ""}
                  onChange={(event) => {
                    const value = Number(event.currentTarget.value);
                    setInfo((current) => ({
                      ...current,
                      [task.id]: value,
                    }));
                    setSubmitted(false);
                  }}
                >
                  <option value="" disabled>
                    Choose information
                  </option>
                  {item.information.map((choice, index) => (
                    <option key={choice} value={index}>
                      {choice}
                    </option>
                  ))}
                </select>
              </label>
            </fieldset>
          ))}
        </div>
        <div className={styles.actions}>
          <button className={styles.primaryAction} type="submit" disabled={!complete}>
            {item.submit}
          </button>
        </div>
      </form>
      {submitted ? (
        <CaregiverFeedback
          focusWhen
          heading={privateSelected || onePerson ? "Network needs review" : "Network reviewed"}
          tone={privateSelected || onePerson ? "warning" : "supportive"}
        >
          <p>
            {privateSelected
              ? item.feedback.private
              : onePerson
                ? item.feedback.onePerson
                : item.feedback.preferred}
          </p>
          <p>{item.learningPoint}</p>
          {assisted ? <p>Answers filled in after three attempts.</p> : null}
        </CaregiverFeedback>
      ) : null}
    </section>
  );
}
