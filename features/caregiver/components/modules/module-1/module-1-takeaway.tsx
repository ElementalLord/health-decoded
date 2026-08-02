"use client";

import { ModuleVisibilityMarker } from "../foundation/module-visibility-marker";
import { caregiverModule1 } from "../../../content/caregiver-module-1";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-1.module.css";

export function Module1Takeaway() {
  const { markTakeawayViewed } = useCaregiverSession();
  const takeaway = caregiverModule1.takeaway;
  return (
    <ModuleVisibilityMarker onViewed={markTakeawayViewed}>
      <section className={styles.takeaway} aria-labelledby="module-1-takeaway-heading">
        <p className={styles.sectionLabel}>Practical takeaway</p>
        <h2 id="module-1-takeaway-heading">{takeaway.heading}</h2>
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
