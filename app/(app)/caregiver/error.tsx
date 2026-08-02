"use client";

import { caregiverLandingContent } from "@/features/caregiver/content/caregiver-landing";
import styles from "@/features/caregiver/styles/caregiver-landing.module.css";

export default function CaregiverError({ reset }: { reset: () => void }) {
  const { hero } = caregiverLandingContent;

  return (
    <section className={styles.routeError} aria-labelledby="caregiver-error-title">
      <p className={styles.eyebrow}>{hero.eyebrow}</p>
      <h1 id="caregiver-error-title">{hero.title}</h1>
      <p>{hero.explanation}</p>
      <button className={styles.actionButton} type="button" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
