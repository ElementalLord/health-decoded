"use client";

import { ModuleVisibilityMarker } from "../foundation/module-visibility-marker";
import { caregiverModule5 } from "../../../content/caregiver-module-5";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-5.module.css";

export function Module5Takeaway() {
  const { markTakeawayViewed } = useCaregiverSession();
  const item = caregiverModule5.takeaway;
  return (
    <ModuleVisibilityMarker onViewed={markTakeawayViewed}>
      <section className={styles.takeaway} aria-labelledby="m5-takeaway-heading">
        <p className={styles.sectionLabel}>Practical takeaway</p>
        <h2 id="m5-takeaway-heading">{item.heading}</h2>
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
