"use client";

import Link from "next/link";
import { caregiverLandingContent, caregiverLandingRoutes } from "../../content/caregiver-landing";
import styles from "../../styles/caregiver-landing.module.css";
import { getImplementedCaregiverModuleById } from "../../content/caregiver-module-registry";

export function CaregiverGuidedPath() {
  const { guidedPath } = caregiverLandingContent;

  return (
    <section
      id="caregiver-guided-path"
      className={styles.guidedPath}
      aria-labelledby="caregiver-guided-path-title"
    >
      <div className={styles.sectionHeading}>
        <p className={styles.sectionNumber}>Five-part path</p>
        <h2 id="caregiver-guided-path-title">{guidedPath.sectionTitle}</h2>
        <p>{guidedPath.introduction}</p>
      </div>

      <ol className={styles.moduleSequence}>
        {caregiverLandingRoutes.map((route) => (
          <li key={route.id} data-caregiver-destination={route.id}>
            <span className={styles.moduleOrder}>{String(route.order).padStart(2, "0")}</span>
            <div>
              <h3>{route.moduleTitle}</h3>
              <p>{route.purpose}</p>
            </div>
            <span className={styles.moduleTime}>{route.time}</span>
            {getImplementedCaregiverModuleById(route.id) ? (
              <Link
                className={styles.textButton}
                href={getImplementedCaregiverModuleById(route.id)!.route}
              >
                {route.action}
              </Link>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
