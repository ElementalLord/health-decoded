"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { caregiverModule3 } from "../../../content/caregiver-module-3";
import styles from "../../../styles/caregiver-module-3.module.css";

export function Module3Orientation() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { opening } = caregiverModule3.sections;
  useEffect(() => {
    headingRef.current?.focus();
  }, []);
  return (
    <header className={styles.orientation}>
      <nav className={styles.routeNavigation} aria-label="Module 3">
        <Link href="/caregiver">Return to Support Someone You Care About</Link>
        <Link href="/caregiver/urgent-help">Something feels wrong right now</Link>
      </nav>
      <div className={styles.orientationCopy}>
        <p className={styles.eyebrow}>{opening.eyebrow}</p>
        <h1 ref={headingRef} tabIndex={-1} id="caregiver-module-3-heading">
          {opening.title}
        </h1>
        <p className={styles.openingCopy}>{opening.opening}</p>
      </div>
      <div className={styles.tableScene} aria-hidden="true">
        <span className={styles.tableSun} />
        <span className={styles.groceryBag} />
        <span className={styles.rideKeys} />
        <span className={styles.sharedBowl} />
        <span className={styles.calendarPage} />
        <span className={styles.tableLine} />
      </div>
      <p className={styles.centralPromise}>{opening.centralIdea}</p>
    </header>
  );
}
