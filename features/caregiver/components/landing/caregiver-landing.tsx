import { CaregiverGuidedPath } from "./caregiver-guided-path";
import { CaregiverHero } from "./caregiver-hero";
import styles from "../../styles/caregiver-landing.module.css";

export function CaregiverLanding() {
  return (
    <div className={styles.landing} data-caregiver-page="CG-LANDING">
      <div className={styles.orbitExperience}>
        <CaregiverHero />
        <CaregiverGuidedPath />
      </div>
    </div>
  );
}
