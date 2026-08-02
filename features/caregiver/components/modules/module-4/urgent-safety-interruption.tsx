"use client";

import Link from "next/link";
import { useState } from "react";
import { CaregiverSafetyInterruption } from "../../foundation/caregiver-safety-interruption";
import { caregiverModule4 } from "../../../content/caregiver-module-4";
import { unavailableCaregiverRegionFixture } from "../../../regional/caregiver-region-fixtures";
import { resolveCaregiverRegionalPresentation } from "../../../regional/caregiver-region-provider";
import styles from "../../../styles/caregiver-module-4.module.css";

const region = resolveCaregiverRegionalPresentation(unavailableCaregiverRegionFixture);

export function UrgentSafetyInterruption({ onActivate }: { readonly onActivate: () => void }) {
  const [active, setActive] = useState(false);
  const section = caregiverModule4.sections.immediate;
  const urgent = caregiverModule4.interactions.urgent;
  if (active) {
    return (
      <CaregiverSafetyInterruption
        active
        region={region}
        actions={
          <>
            <Link className={styles.urgentAction} href="/caregiver/urgent-help">
              Contact emergency help
            </Link>
            <Link href="/caregiver/urgent-help">View {region.displayName} emergency details</Link>
            <Link href="/caregiver">{urgent.leave}</Link>
          </>
        }
      />
    );
  }
  return (
    <section id={section.id} className={styles.urgentShortcut} aria-label="Urgent help">
      <button
        type="button"
        className={styles.urgentAction}
        onClick={() => {
          onActivate();
          setActive(true);
        }}
      >
        {caregiverModule4.safety.immediateLink}
      </button>
    </section>
  );
}
