"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { caregiverModule1 } from "../../../content/caregiver-module-1";
import styles from "../../../styles/caregiver-module-1.module.css";

export function Module1Orientation() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { opening } = caregiverModule1.sections;

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <header className={styles.orientation}>
      <nav className={styles.routeNavigation} aria-label="Module 1">
        <Link href="/caregiver">Return to Support Someone You Care About</Link>
      </nav>
      <div className={styles.orientationCopy}>
        <p className={styles.eyebrow}>{opening.eyebrow}</p>
        <h1 ref={headingRef} tabIndex={-1} id="caregiver-module-1-heading">
          {opening.title}
        </h1>
        <p className={styles.openingCopy}>{opening.opening}</p>
      </div>
      <div className={styles.signalScene} aria-hidden="true">
        <span className={styles.windowGlow} />
        <span className={styles.windowFrame} />
        <span className={styles.curtain} />
        <span className={styles.quietPhone} />
        <span className={styles.signalLine} />
        <span className={styles.timingDot} />
      </div>
      <p className={styles.centralPromise}>{opening.centralIdea}</p>
    </header>
  );
}
