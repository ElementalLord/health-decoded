import Link from "next/link";

import { caregiverLandingContent } from "../../content/caregiver-landing";
import type { CaregiverRegionalPresentation } from "../../types/caregiver-region";
import styles from "../../styles/caregiver-landing.module.css";

export interface CaregiverSafetyRouteProps {
  readonly region: CaregiverRegionalPresentation;
}

export function CaregiverSafetyRoute({ region }: CaregiverSafetyRouteProps) {
  const { safety } = caregiverLandingContent;
  const regionalAction = safety.regionalActionTemplate.replace(
    "[REGION_DISPLAY_NAME]",
    region.displayName,
  );

  return (
    <section className={styles.safetyRoute} aria-labelledby="caregiver-safety-title">
      <div className={styles.safetyOrientation}>
        <p className={styles.sectionNumber}>Immediate help</p>
        <h2 id="caregiver-safety-title" className={styles.safetyTitle}>
          <Link href="/caregiver/urgent-help">{safety.linkLabel}</Link>
        </h2>
      </div>
      <div className={styles.safetyCopy}>
        <p>{safety.boundary}</p>
        {region.mode === "fallback" ? (
          <p className={styles.regionalFallback}>{safety.missingRegion}</p>
        ) : null}
        <Link className={styles.safetyLink} href="/caregiver/urgent-help">
          {regionalAction}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
