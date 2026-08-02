"use client";

import { useState } from "react";
import { caregiverModule5 } from "../../../content/caregiver-module-5";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-5.module.css";

export function Module5Reflection() {
  const item = caregiverModule5.reflection;
  const [values, setValues] = useState(["", "", ""]);
  const [saved, setSaved] = useState(false);
  const { setReflection, skipReflection, clearReflection } = useCaregiverSession();
  const hasValue = values.some((value) => value.trim());
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
      <p>{item.prompt}</p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (hasValue) {
            setReflection(values.join("\n"));
            setSaved(true);
          }
        }}
      >
        <div className={styles.reflectionFields}>
          {item.fields.map((label, index) => (
            <label key={label}>
              {label}
              <textarea
                rows={3}
                value={values[index]}
                onChange={(event) => {
                  const value = event.currentTarget.value;
                  const next = [...values];
                  next[index] = value;
                  setValues(next);
                  setSaved(false);
                }}
              />
            </label>
          ))}
        </div>
        <div className={styles.actions}>
          <button className={styles.primaryAction} type="submit" disabled={!hasValue}>
            Save reflection for this session
          </button>
          <button className={styles.textAction} type="button" onClick={skipReflection}>
            {item.skip}
          </button>
          <button
            className={styles.textAction}
            type="button"
            disabled={!hasValue}
            onClick={() => {
              if (window.confirm(item.clearConfirmation)) {
                setValues(["", "", ""]);
                clearReflection();
                setSaved(false);
              }
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
