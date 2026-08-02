"use client";

import { useState } from "react";
import { caregiverModule4 } from "../../../content/caregiver-module-4";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-4.module.css";

export function Module4Reflection() {
  const item = caregiverModule4.reflection;
  const [saved, setSaved] = useState(false);
  const { reflection, setReflection, skipReflection, clearReflection } = useCaregiverSession();
  return (
    <section
      className={styles.reflection}
      data-reflection-id={item.id}
      data-storage="session-only"
      aria-labelledby={`${item.id}-heading`}
    >
      <p className={styles.sectionLabel}>Optional private reflection</p>
      <h2 id={`${item.id}-heading`}>Optional Private Reflection</h2>
      <p className={styles.privacyNotice}>{item.privacy}</p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (reflection.trim()) setSaved(true);
        }}
      >
        <label htmlFor={`${item.id}-field`}>{item.prompt}</label>
        <textarea
          id={`${item.id}-field`}
          rows={5}
          value={reflection}
          onChange={(event) => {
            const value = event.currentTarget.value;
            setReflection(value);
            setSaved(false);
          }}
        />
        <div className={styles.actions}>
          <button className={styles.primaryAction} type="submit" disabled={!reflection.trim()}>
            Save reflection for this session
          </button>
          <button className={styles.textAction} type="button" onClick={skipReflection}>
            {item.skip}
          </button>
          <button
            className={styles.textAction}
            type="button"
            disabled={!reflection}
            onClick={() => {
              if (window.confirm(item.clearConfirmation)) clearReflection();
            }}
          >
            {item.clear}
          </button>
        </div>
      </form>
      <p aria-live="polite">{saved ? "Reflection saved for this session." : ""}</p>
    </section>
  );
}
