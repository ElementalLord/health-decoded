"use client";

import { useState, type FormEvent } from "react";
import { caregiverModule3 } from "../../../content/caregiver-module-3";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-3.module.css";

export function Module3Reflection() {
  const [saved, setSaved] = useState(false);
  const reflection = caregiverModule3.reflection;
  const {
    reflection: value,
    reflectionSkipped,
    setReflection,
    skipReflection,
    clearReflection,
  } = useCaregiverSession();
  function confirmClear() {
    if (!value || window.confirm(reflection.clearConfirmation)) {
      clearReflection();
      setSaved(false);
    }
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
      <form
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          if (value.trim()) setSaved(true);
        }}
      >
        <label htmlFor={`${reflection.id}-response`}>{reflection.prompt}</label>
        <textarea
          id={`${reflection.id}-response`}
          rows={5}
          value={value}
          onChange={(event) => {
            const nextValue = event.currentTarget.value;
            setReflection(nextValue);
            setSaved(false);
          }}
        />
        <div className={styles.interactionActions}>
          <button className={styles.primaryAction} type="submit" disabled={!value.trim()}>
            Save reflection for this session
          </button>
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
      </form>
      {saved ? <p className={styles.reflectionSaved}>Reflection saved for this session.</p> : null}
      <p className={styles.srOnly} aria-live="polite">
        {saved
          ? "Reflection saved for this session."
          : reflectionSkipped
            ? "Reflection skipped for this session."
            : ""}
      </p>
    </section>
  );
}
