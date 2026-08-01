"use client";

import Link from "next/link";

import { caregiverModule2 } from "@/features/caregiver/content/caregiver-module-2";
import styles from "@/features/caregiver/styles/caregiver-module-2.module.css";

export default function CaregiverModuleError({ reset }: { readonly reset: () => void }) {
  return (
    <main className={styles.routeState}>
      <p className={styles.eyebrow}>{caregiverModule2.sections.opening.eyebrow}</p>
      <h1>{caregiverModule2.sections.opening.title}</h1>
      <button className={styles.primaryAction} type="button" onClick={reset}>
        Try again
      </button>
      <Link href="/caregiver">Return to Support Someone You Care About</Link>
      <Link href="/caregiver/urgent-help">Something feels wrong right now</Link>
    </main>
  );
}
