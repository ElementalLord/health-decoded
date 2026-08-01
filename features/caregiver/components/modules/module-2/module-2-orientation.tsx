"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

import { caregiverModule2 } from "../../../content/caregiver-module-2";
import styles from "../../../styles/caregiver-module-2.module.css";

export function Module2Orientation() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { opening } = caregiverModule2.sections;

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <header className={styles.orientation}>
      <nav className={styles.routeNavigation} aria-label="Module 2">
        <Link href="/caregiver">Return to Support Someone You Care About</Link>
        <Link href="/caregiver/urgent-help">Something feels wrong right now</Link>
      </nav>
      <div className={styles.orientationCopy}>
        <p className={styles.eyebrow}>{opening.eyebrow}</p>
        <h1 ref={headingRef} id="caregiver-module-2-heading" tabIndex={-1}>
          {opening.title}
        </h1>
        <p className={styles.openingCopy}>{opening.opening}</p>
      </div>
      <div className={styles.sharedTableScene} aria-hidden="true">
        <span className={styles.tableAreaOne}>Leah</span>
        <span className={styles.consentPoint}>permission</span>
        <span className={styles.tableAreaTwo}>Andre</span>
      </div>
      <p className={styles.centralPromise}>{opening.centralIdea}</p>
    </header>
  );
}
