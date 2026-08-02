"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { caregiverModule5 } from "../../../content/caregiver-module-5";
import styles from "../../../styles/caregiver-module-5.module.css";

export function Module5Orientation() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const opening = caregiverModule5.sections.opening;
  useEffect(() => headingRef.current?.focus(), []);
  return (
    <header className={styles.orientation}>
      <nav className={styles.routeNavigation} aria-label="Module 5">
        <Link href="/caregiver">Return to Support Someone You Care About</Link>
        <Link href="/caregiver/urgent-help">Something feels wrong right now</Link>
      </nav>
      <div className={styles.orientationCopy}>
        <p className={styles.eyebrow}>{opening.eyebrow}</p>
        <h1 ref={headingRef} tabIndex={-1}>
          {opening.title}
        </h1>
        <p className={styles.openingCopy}>{opening.opening}</p>
      </div>
      <div className={styles.networkVisual} aria-hidden="true">
        <p>Your capacity</p>
        <div>
          <span>Shared agreement</span>
          <span>Backup support</span>
          <span>Professional role</span>
        </div>
      </div>
      <p className={styles.centralPromise}>{opening.centralIdea}</p>
    </header>
  );
}
