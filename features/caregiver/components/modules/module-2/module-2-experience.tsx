"use client";

import { ModuleVisibilityMarker } from "../foundation/module-visibility-marker";
import { caregiverModule2 } from "../../../content/caregiver-module-2";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import { IntentionImpactMap } from "./intention-impact-map";
import { Module2Completion } from "./module-2-completion";
import { Module2KnowledgeCheck } from "./module-2-knowledge-check";
import {
  Module2AppointmentsNarrative,
  Module2BoundariesNarrative,
  Module2DistinctionNarrative,
  Module2IntentionImpactNarrative,
  Module2PermissionNarrative,
  Module2RepairNarrative,
  Module2Scenario,
  Module2Scripts,
} from "./module-2-narrative";
import { Module2Orientation } from "./module-2-orientation";
import { Module2Reflection } from "./module-2-reflection";
import { Module2Takeaway } from "./module-2-takeaway";
import { PermissionLanguageBuilder } from "./permission-language-builder";
import { RefusalBranchingConversation } from "./refusal-branching-conversation";
import { RepairSequence } from "./repair-sequence";
import { SupportBoundaryContinuum } from "./support-boundary-continuum";
import styles from "../../../styles/caregiver-module-2.module.css";

export function Module2Experience() {
  const { markCentralIdeaReached } = useCaregiverSession();

  return (
    <main
      className={styles.module}
      data-caregiver-module={caregiverModule2.id}
      data-rendering-mode="deterministic"
    >
      <Module2Orientation />
      <div className={styles.moduleBody}>
        <Module2Scenario />
        <ModuleVisibilityMarker onViewed={markCentralIdeaReached}>
          <Module2IntentionImpactNarrative />
        </ModuleVisibilityMarker>
        <IntentionImpactMap />
        <Module2DistinctionNarrative />
        <SupportBoundaryContinuum />
        <Module2PermissionNarrative />
        <PermissionLanguageBuilder />
        <Module2AppointmentsNarrative />
        <RefusalBranchingConversation />
        <Module2RepairNarrative />
        <RepairSequence />
        <Module2BoundariesNarrative />
        <Module2Scripts />
        <Module2KnowledgeCheck />
        <Module2Reflection />
        <Module2Takeaway />
        <Module2Completion />
      </div>
    </main>
  );
}
