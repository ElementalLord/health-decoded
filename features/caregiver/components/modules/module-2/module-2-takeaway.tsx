"use client";

import { ModuleVisibilityMarker } from "../foundation/module-visibility-marker";
import { caregiverModule2 } from "../../../content/caregiver-module-2";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-2.module.css";

export function Module2Takeaway() {
  const { markTakeawayViewed } = useCaregiverSession();
  const takeaway = caregiverModule2.takeaway;

  return (
    <ModuleVisibilityMarker onViewed={markTakeawayViewed}>
      <section className={styles.takeaway} aria-labelledby="module-2-takeaway-heading">
        <p className={styles.eyebrow}>Keep this close</p>
        <h2 id="module-2-takeaway-heading" tabIndex={-1}>
          {takeaway.heading}
        </h2>
        <p className={styles.takeawayStatement}>{takeaway.centralIdea}</p>
        <ol className={styles.takeawayIdeas}>
          <li>
            <span>1</span>
            <strong>Ask what role is wanted.</strong>
          </li>
          <li>
            <span>2</span>
            <strong>Make support specific and easy to decline.</strong>
          </li>
          <li>
            <span>3</span>
            <strong>Treat privacy as permission-specific.</strong>
          </li>
          <li>
            <span>4</span>
            <strong>Repair an overstep through changed behavior.</strong>
          </li>
          <li>
            <span>5</span>
            <strong>State your limits without using help as leverage.</strong>
          </li>
        </ol>
        <div className={styles.takeawaySourceCopy}>
          <p>
            <strong>Practical action:</strong> {takeaway.practicalAction}
          </p>
          <p>
            <strong>Boundary:</strong> {takeaway.boundary}
          </p>
        </div>
      </section>
    </ModuleVisibilityMarker>
  );
}
