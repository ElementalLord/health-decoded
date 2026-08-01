"use client";

import { caregiverModule2 } from "../../../content/caregiver-module-2";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-2.module.css";

export function Module2Reflection() {
  const reflection = caregiverModule2.reflection;
  const {
    reflection: value,
    reflectionSkipped,
    setReflection,
    skipReflection,
    clearReflection,
  } = useCaregiverSession();

  function confirmClear() {
    if (!value || window.confirm("Clear reflection?")) clearReflection();
  }

  return (
    <section
      className={styles.reflection}
      aria-labelledby={`${reflection.id}-heading`}
      data-reflection-id={reflection.id}
      data-storage="session-only"
    >
      <p className={styles.sectionLabel}>Optional private reflection</p>
      <h2 id={`${reflection.id}-heading`}>Optional Private Reflection</h2>
      <p className={styles.privacyNotice}>{reflection.privacy}</p>
      <label htmlFor={`${reflection.id}-response`}>{reflection.prompt}</label>
      <textarea
        id={`${reflection.id}-response`}
        rows={5}
        value={value}
        onChange={(event) => setReflection(event.currentTarget.value)}
      />
      <div className={styles.interactionActions}>
        <button className={styles.textAction} type="button" onClick={skipReflection}>
          {reflection.skip}
        </button>
        <button
          className={styles.textAction}
          type="button"
          disabled={!value}
          onClick={confirmClear}
        >
          {reflection.clear}
        </button>
      </div>
      <p className={styles.srOnly} aria-live="polite">
        {reflectionSkipped ? "Reflection skipped for this session." : ""}
      </p>
    </section>
  );
}
