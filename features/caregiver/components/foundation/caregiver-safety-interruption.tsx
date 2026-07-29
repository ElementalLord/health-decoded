"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

import type { CaregiverRegionalPresentation } from "../../types/caregiver-region";
import styles from "../../styles/caregiver-foundation.module.css";

export interface CaregiverSafetyInterruptionProps {
  readonly active: boolean;
  readonly region: CaregiverRegionalPresentation;
  readonly actions?: ReactNode;
}

export function CaregiverSafetyInterruption({
  actions,
  active,
  region,
}: CaregiverSafetyInterruptionProps) {
  const headingId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (active) headingRef.current?.focus();
  }, [active]);

  if (!active) return null;

  return (
    <section
      className={styles.safetyInterruption}
      role="alert"
      aria-live="assertive"
      aria-labelledby={headingId}
      data-region-status={region.status}
    >
      <h2 ref={headingRef} id={headingId} tabIndex={-1}>
        {region.heading}
      </h2>
      <p className={styles.regionLabel}>Region: {region.displayName}</p>
      <p>{region.copy}</p>
      {region.mode === "verified" && region.emergencyServiceLabel ? (
        <p className={styles.emergencyContact}>
          {region.emergencyServiceLabel}
          {region.emergencyContact ? `: ${region.emergencyContact}` : null}
        </p>
      ) : null}
      {actions ? <div className={styles.safetyActions}>{actions}</div> : null}
    </section>
  );
}
