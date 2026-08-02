"use client";

import Link from "next/link";

import styles from "@/features/caregiver/styles/caregiver-module-2.module.css";

export default function CaregiverModuleError({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}) {
  return (
    <main className={styles.routeState}>
      <p className={styles.eyebrow}>Caregiver lesson</p>
      <h1>Something interrupted this lesson</h1>
      {process.env.NODE_ENV === "development" ? (
        <p role="alert">
          <strong>Development error:</strong> {error.message}
        </p>
      ) : null}
      <button className={styles.primaryAction} type="button" onClick={reset}>
        Try again
      </button>
      <Link href="/caregiver">Return to Support Someone You Care About</Link>
      <Link href="/caregiver/urgent-help">Something feels wrong right now</Link>
    </main>
  );
}
