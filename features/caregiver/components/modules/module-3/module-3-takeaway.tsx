"use client";

import { ModuleVisibilityMarker } from "../foundation/module-visibility-marker";
import { caregiverModule3 } from "../../../content/caregiver-module-3";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-3.module.css";

export function Module3Takeaway() {
  const { markTakeawayViewed } = useCaregiverSession();
  const takeaway = caregiverModule3.takeaway;
  return (
    <ModuleVisibilityMarker onViewed={markTakeawayViewed}>
      <section className={styles.takeaway} aria-labelledby="module-3-takeaway-heading">
        <p className={styles.sectionLabel}>Practical takeaway</p>
        <h2 id="module-3-takeaway-heading">{takeaway.heading}</h2>
        <p className={styles.takeawayStatement}>{takeaway.centralIdea}</p>
        <dl>
          <div>
            <dt>Practical action</dt>
            <dd>{takeaway.practicalAction}</dd>
          </div>
          <div>
            <dt>Boundary</dt>
            <dd>{takeaway.boundary}</dd>
          </div>
        </dl>
      </section>
    </ModuleVisibilityMarker>
  );
}
