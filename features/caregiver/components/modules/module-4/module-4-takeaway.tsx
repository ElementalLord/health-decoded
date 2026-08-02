"use client";

import { ModuleVisibilityMarker } from "../foundation/module-visibility-marker";
import { caregiverModule4 } from "../../../content/caregiver-module-4";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-4.module.css";

export function Module4Takeaway() {
  const { markTakeawayViewed } = useCaregiverSession();
  const item = caregiverModule4.takeaway;
  return (
    <ModuleVisibilityMarker onViewed={markTakeawayViewed}>
      <section className={styles.takeaway} aria-labelledby="m4-takeaway-heading">
        <p className={styles.sectionLabel}>Practical takeaway</p>
        <h2 id="m4-takeaway-heading">{item.heading}</h2>
        <p className={styles.takeawayStatement}>{item.centralIdea}</p>
        <dl>
          <div>
            <dt>Practical action</dt>
            <dd>{item.practicalAction}</dd>
          </div>
          <div>
            <dt>Boundary</dt>
            <dd>{item.boundary}</dd>
          </div>
        </dl>
      </section>
    </ModuleVisibilityMarker>
  );
}
