"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { caregiverModule2 } from "../../../content/caregiver-module-2";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-2.module.css";

export function Module2Reflection() {
  const [saved, setSaved] = useState(false);
  const reflection = caregiverModule2.reflection;
  const {
    reflection: value,
    reflectionSkipped,
    setReflection,
    skipReflection,
    clearReflection,
  } = useCaregiverSession();

  function confirmClear() {
    if (!value || window.confirm("Clear reflection?")) {
      clearReflection();
      setSaved(false);
    }
  }

  function skipForNow() {
    setSaved(false);
    skipReflection();
    requestAnimationFrame(() => document.getElementById("module-2-completion-heading")?.focus());
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
          <Button fullWidth={false} type="submit" disabled={!value.trim()}>
            Save reflection for this session
          </Button>
          {!reflectionSkipped ? (
            <Button
              className={styles.skipAction}
              fullWidth={false}
              type="button"
              variant="text"
              onClick={skipForNow}
            >
              {reflection.skip}
            </Button>
          ) : null}
          <Button
            type="button"
            fullWidth={false}
            variant="text"
            disabled={!value}
            onClick={confirmClear}
          >
            {reflection.clear}
          </Button>
        </div>
      </form>
      {saved ? <p className={styles.reflectionSaved}>Reflection saved for this session.</p> : null}
      {reflectionSkipped ? (
        <p className={styles.reflectionStatus}>Skipped for now. You can return and write later.</p>
      ) : null}
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
