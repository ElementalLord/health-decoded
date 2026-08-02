"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { caregiverModule4 } from "../../../content/caregiver-module-4";
import styles from "../../../styles/caregiver-module-4.module.css";

export function Module4Orientation() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const opening = caregiverModule4.sections.opening;
  useEffect(() => headingRef.current?.focus(), []);
  return (
    <header className={styles.orientation}>
      <nav className={styles.routeNavigation} aria-label="Module 4">
        <Link href="/caregiver">Return to Support Someone You Care About</Link>
        <Link href="#CG-M4-S02">Someone may be in immediate danger</Link>
      </nav>
      <div className={styles.orientationCopy}>
        <p className={styles.eyebrow}>{opening.eyebrow}</p>
        <h1 ref={headingRef} tabIndex={-1}>
          {opening.title}
        </h1>
        <p className={styles.openingCopy}>{opening.opening}</p>
      </div>
      <ol className={styles.sourceFolders} aria-label="Three guidance layers">
        {opening.layers.map((layer, index) => (
          <li key={layer}>
            <span>{index + 1}</span>
            {layer}
          </li>
        ))}
      </ol>
    </header>
  );
}
