"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

import { caregiverUrgentHelpContent } from "../../content/caregiver-landing";
import type { CaregiverRegionalPresentation } from "../../types/caregiver-region";
import styles from "../../styles/caregiver-landing.module.css";

export interface CaregiverUrgentHelpPageProps {
  readonly region: CaregiverRegionalPresentation;
}

export function CaregiverUrgentHelpPage({ region }: CaregiverUrgentHelpPageProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className={styles.urgentPage} data-caregiver-urgent-help="">
      <section className={styles.urgentContent} aria-labelledby="caregiver-urgent-heading">
        <p className={styles.urgentEyebrow}>Immediate help</p>
        <h1
          ref={headingRef}
          id="caregiver-urgent-heading"
          className={styles.urgentTitle}
          tabIndex={-1}
        >
          {region.heading}
        </h1>
        <p className={styles.urgentRegion}>Region: {region.displayName}</p>
        <p className={styles.urgentDirection}>{region.copy}</p>

        {region.mode === "verified" && region.emergencyServiceLabel && region.emergencyContact ? (
          <div className={styles.verifiedEmergency} data-region-status="verified">
            <p>{region.emergencyServiceLabel}</p>
            <a href={`tel:${region.emergencyContact}`}>{region.emergencyContact}</a>
          </div>
        ) : null}

        <div className={styles.urgentBoundaries}>
          <p>{caregiverUrgentHelpContent.doNotDelay}</p>
          <p>{caregiverUrgentHelpContent.productLimitation}</p>
        </div>

        <Link className={styles.urgentBackLink} href="/caregiver">
          <span aria-hidden="true">←</span>
          {caregiverUrgentHelpContent.sectionName}
        </Link>
      </section>
    </div>
  );
}
