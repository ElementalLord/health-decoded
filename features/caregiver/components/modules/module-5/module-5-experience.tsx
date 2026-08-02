"use client";

import { ModuleVisibilityMarker } from "../foundation/module-visibility-marker";
import { caregiverModule5 } from "../../../content/caregiver-module-5";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-5.module.css";
import { BoundaryRehearsal } from "./boundary-rehearsal";
import { Module5Completion } from "./module-5-completion";
import { Module5KnowledgeCheck } from "./module-5-knowledge-check";
import {
  Module5Backup,
  Module5BoundaryNarrative,
  Module5Relationship,
  Module5ResponsibilityNarrative,
  Module5Scenario,
  Module5Scripts,
  Module5Strain,
} from "./module-5-narrative";
import { Module5Orientation } from "./module-5-orientation";
import { Module5Reflection } from "./module-5-reflection";
import { Module5Takeaway } from "./module-5-takeaway";
import { NonclinicalLoadReview } from "./nonclinical-load-review";
import { ResponsibilityMap } from "./responsibility-map";
import { SupportNetworkMap } from "./support-network-map";
import { SustainabilityComparison } from "./sustainability-comparison";

export function Module5Experience() {
  const { markCentralIdeaReached } = useCaregiverSession();
  return (
    <main
      className={styles.module}
      data-caregiver-module={caregiverModule5.id}
      data-rendering-mode="deterministic"
    >
      <Module5Orientation />
      <div className={styles.moduleBody}>
        <Module5Scenario />
        <ModuleVisibilityMarker onViewed={markCentralIdeaReached}>
          <Module5ResponsibilityNarrative />
        </ModuleVisibilityMarker>
        <ResponsibilityMap />
        <Module5Strain />
        <SustainabilityComparison />
        <Module5BoundaryNarrative />
        <BoundaryRehearsal />
        <Module5Backup />
        <SupportNetworkMap />
        <NonclinicalLoadReview />
        <Module5Relationship />
        <Module5KnowledgeCheck />
        <Module5Reflection />
        <Module5Scripts />
        <Module5Takeaway />
        <Module5Completion />
      </div>
    </main>
  );
}
