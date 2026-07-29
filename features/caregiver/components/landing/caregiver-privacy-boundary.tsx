import { caregiverLandingContent } from "../../content/caregiver-landing";
import styles from "../../styles/caregiver-landing.module.css";

export function CaregiverPrivacyBoundary() {
  const { autonomy } = caregiverLandingContent;

  return (
    <aside className={styles.privacyBoundary} aria-labelledby="caregiver-privacy-title">
      <p className={styles.sectionNumber}>Autonomy and privacy</p>
      <h2 id="caregiver-privacy-title">{autonomy.heading}</h2>
      <p>{autonomy.copy}</p>
    </aside>
  );
}
