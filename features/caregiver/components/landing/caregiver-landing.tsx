import { CaregiverGuidedPath } from "./caregiver-guided-path";
import { CaregiverHero } from "./caregiver-hero";
import type { CaregiverRegionalPresentation } from "../../types/caregiver-region";
import styles from "../../styles/caregiver-landing.module.css";

export interface CaregiverLandingProps {
  readonly region: CaregiverRegionalPresentation;
}

export function CaregiverLanding({ region: _region }: CaregiverLandingProps) {
  return (
    <div className={styles.landing} data-caregiver-page="CG-LANDING">
      <CaregiverHero />
      <CaregiverGuidedPath />
    </div>
  );
}
