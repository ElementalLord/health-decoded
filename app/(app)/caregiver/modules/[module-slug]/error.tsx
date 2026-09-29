"use client";

import Link from "next/link";

import styles from "@/features/caregiver/styles/caregiver-module-1-story.module.css";

export default function CaregiverModuleError({
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}) {
  return (
    <main className={styles.page} data-route-error>
      <section className={`${styles.completion} ${styles.errorState}`}>
        <p>Caregiver module</p>
        <h1>We could not open this module.</h1>
        <p role="alert">Nothing from this screen was submitted. Try opening it again.</p>
        <div className={styles.completionActions}>
          <button className={styles.primaryAction} type="button" onClick={reset}>
            Open module again
          </button>
          <Link className={styles.secondaryAction} href="/caregiver">
            Back to caregiver modules
          </Link>
        </div>
      </section>
    </main>
  );
}
