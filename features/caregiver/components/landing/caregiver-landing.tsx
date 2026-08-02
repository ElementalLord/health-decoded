import { CaregiverFirstVisit } from "./caregiver-first-visit";
import { CaregiverGuidedPath } from "./caregiver-guided-path";
import { CaregiverHero } from "./caregiver-hero";
import { CaregiverNeedRouter } from "./caregiver-need-router";
import { CaregiverPrivacyBoundary } from "./caregiver-privacy-boundary";
import type { CaregiverRegionalPresentation } from "../../types/caregiver-region";
import styles from "../../styles/caregiver-landing.module.css";

export interface CaregiverLandingProps {
  readonly region: CaregiverRegionalPresentation;
}

export function CaregiverLanding({ region: _region }: CaregiverLandingProps) {
  return (
    <div className={styles.landing} data-caregiver-page="CG-LANDING">
      <CaregiverHero />
      <CaregiverFirstVisit />
      <CaregiverNeedRouter />
      <CaregiverGuidedPath />
      <CaregiverPrivacyBoundary />
    </div>
  );
}
