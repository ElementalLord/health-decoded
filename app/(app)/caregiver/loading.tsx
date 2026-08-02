import { caregiverLandingContent } from "@/features/caregiver/content/caregiver-landing";
import styles from "@/features/caregiver/styles/caregiver-landing.module.css";

export default function CaregiverLoading() {
  const { hero } = caregiverLandingContent;

  return (
    <div className={styles.routeLoading} aria-live="polite" aria-busy="true">
      <p className={styles.eyebrow}>{hero.eyebrow}</p>
      <p className={styles.loadingTitle}>{hero.title}</p>
      <p>{hero.explanation}</p>
    </div>
  );
}
