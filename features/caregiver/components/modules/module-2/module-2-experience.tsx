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
  Module2FurtherReading,
  Module2IntentionImpactNarrative,
  Module2PermissionNarrative,
  Module2RepairNarrative,
  Module2Scenario,
  Module2Scripts,
} from "./module-2-narrative";
import { Module2Orientation } from "./module-2-orientation";
import { Module2PracticeDrawer } from "./module-2-practice-drawer";
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
        <Module2PracticeDrawer
          number="01"
          title="Map intention and possible impact"
          description="A short optional practice for separating what was meant from what may have landed."
        >
          <IntentionImpactMap />
        </Module2PracticeDrawer>
        <Module2DistinctionNarrative />
        <Module2PracticeDrawer
          number="02"
          title="Notice when support starts becoming control"
          description="Place everyday actions using permission, privacy, repetition, and freedom to decline."
        >
          <SupportBoundaryContinuum />
        </Module2PracticeDrawer>
        <Module2PermissionNarrative />
        <PermissionLanguageBuilder />
        <Module2AppointmentsNarrative />
        <Module2PracticeDrawer
          number="03"
          title="Practice hearing no without withdrawing care"
          description="Try a brief conversation where the relationship matters more than winning agreement."
        >
          <RefusalBranchingConversation />
        </Module2PracticeDrawer>
        <Module2RepairNarrative />
        <Module2PracticeDrawer
          number="04"
          title="Put a repair back in a usable order"
          description="Rearrange the words so ownership and changed behavior come before reassurance."
        >
          <RepairSequence />
        </Module2PracticeDrawer>
        <Module2BoundariesNarrative />
        <Module2FurtherReading />
        <Module2Scripts />
        <Module2KnowledgeCheck />
        <Module2Reflection />
        <Module2Takeaway />
        <Module2Completion />
      </div>
    </main>
  );
}
