"use client";

import { CaregiverUrgentHelpPage } from "@/features/caregiver/components/safety/caregiver-urgent-help-page";
import { unavailableCaregiverRegionFixture } from "@/features/caregiver/regional/caregiver-region-fixtures";
import { resolveCaregiverRegionalPresentation } from "@/features/caregiver/regional/caregiver-region-provider";
import styles from "@/features/caregiver/styles/caregiver-landing.module.css";

export default function UrgentHelpError({ reset }: { reset: () => void }) {
  const region = resolveCaregiverRegionalPresentation(unavailableCaregiverRegionFixture);

  return (
    <div>
      <CaregiverUrgentHelpPage region={region} />
      <div className={styles.urgentRecovery}>
        <button className={styles.actionButton} type="button" onClick={reset}>
          Try again
        </button>
      </div>
    </div>
  );
}
