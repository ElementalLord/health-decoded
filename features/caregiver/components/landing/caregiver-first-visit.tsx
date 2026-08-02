import Link from "next/link";

import { caregiverLandingContent } from "../../content/caregiver-landing";
import styles from "../../styles/caregiver-landing.module.css";

export function CaregiverFirstVisit() {
  const { firstVisit } = caregiverLandingContent;

  return (
    <section className={styles.firstVisit} aria-labelledby="caregiver-first-visit-title">
      <p className={styles.sectionNumber}>A place to begin</p>
      <h2 id="caregiver-first-visit-title">{firstVisit.greeting}</h2>
      <p>{firstVisit.copy}</p>
      <div className={styles.firstVisitActions}>
        <Link className={styles.primaryLink} href="#caregiver-need-router">
          {firstVisit.primaryAction}
          <span aria-hidden="true">↓</span>
        </Link>
        <Link className={styles.secondaryLink} href="/caregiver/modules/what-they-may-be-feeling">
          {firstVisit.secondaryAction}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
