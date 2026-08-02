"use client";

import { ModuleVisibilityMarker } from "../foundation/module-visibility-marker";
import { caregiverModule3 } from "../../../content/caregiver-module-3";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import { Module3Completion } from "./module-3-completion";
import { Module3KnowledgeCheck } from "./module-3-knowledge-check";
import {
  Module3ChangesNarrative,
  Module3FurtherReading,
  Module3MealsNarrative,
  Module3MisunderstandingNarrative,
  Module3NormalLifeNarrative,
  Module3Scenario,
  Module3Scripts,
  Module3SpecificNarrative,
} from "./module-3-narrative";
import { Module3Orientation } from "./module-3-orientation";
import { Module3Reflection } from "./module-3-reflection";
import { Module3Takeaway } from "./module-3-takeaway";
import { RequestMatching } from "./request-matching";
import { RoutineComparison } from "./routine-comparison";
import { SharedPlanningWorkspace } from "./shared-planning-workspace";
import { SupportMenu } from "./support-menu";
import styles from "../../../styles/caregiver-module-3.module.css";

export function Module3Experience() {
  const { markCentralIdeaReached } = useCaregiverSession();
  return (
    <main
      className={styles.module}
      data-caregiver-module={caregiverModule3.id}
      data-rendering-mode="deterministic"
    >
      <Module3Orientation />
      <div className={styles.moduleBody}>
        <Module3Scenario />
        <Module3MealsNarrative />
        <SharedPlanningWorkspace />
        <ModuleVisibilityMarker onViewed={markCentralIdeaReached}>
          <Module3SpecificNarrative />
        </ModuleVisibilityMarker>
        <RequestMatching />
        <Module3ChangesNarrative />
        <SupportMenu />
        <RoutineComparison />
        <Module3NormalLifeNarrative />
        <Module3MisunderstandingNarrative />
        <Module3FurtherReading />
        <Module3KnowledgeCheck />
        <Module3Reflection />
        <Module3Scripts />
        <Module3Takeaway />
        <Module3Completion />
      </div>
    </main>
  );
}
