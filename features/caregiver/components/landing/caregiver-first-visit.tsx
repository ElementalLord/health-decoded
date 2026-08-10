import { caregiverLandingContent } from "../../content/caregiver-landing";
import styles from "../../styles/caregiver-landing.module.css";

export function CaregiverFirstVisit() {
  const { firstVisit } = caregiverLandingContent;

  return (
    <section className={styles.firstVisit} aria-labelledby="caregiver-first-visit-title">
      <p className={styles.sectionNumber}>A place to begin</p>
      <h2 id="caregiver-first-visit-title">{firstVisit.greeting}</h2>
      <p>{firstVisit.copy}</p>
    </section>
  );
}
