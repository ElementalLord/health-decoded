"use client";

import { useState } from "react";
import { ModuleVisibilityMarker } from "../foundation/module-visibility-marker";
import { caregiverModule4 } from "../../../content/caregiver-module-4";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-4.module.css";
import { ContextOrganizer } from "./context-organizer";
import { GuidanceSourceMatching } from "./guidance-source-matching";
import { Module4Completion } from "./module-4-completion";
import { Module4KnowledgeCheck } from "./module-4-knowledge-check";
import {
  Module4HandoffNarrative,
  Module4Misunderstanding,
  Module4Notice,
  Module4Plan,
  Module4Scenario,
  Module4Scripts,
  Module4UnsafeNarrative,
} from "./module-4-narrative";
import { Module4Orientation } from "./module-4-orientation";
import { Module4Reflection } from "./module-4-reflection";
import { Module4Takeaway } from "./module-4-takeaway";
import { ProfessionalHandoffSequence } from "./professional-handoff-sequence";
import { UnsafeImprovisationReview } from "./unsafe-improvisation-review";
import { UrgentSafetyInterruption } from "./urgent-safety-interruption";

export function Module4Experience() {
  const [urgent, setUrgent] = useState(false);
  const { markCentralIdeaReached } = useCaregiverSession();
  return (
    <main
      className={styles.module}
      data-caregiver-module={caregiverModule4.id}
      data-rendering-mode="deterministic"
    >
      <Module4Orientation />
      <div className={styles.moduleBody}>
        <UrgentSafetyInterruption onActivate={() => setUrgent(true)} />
        {urgent ? null : (
          <>
            <Module4Scenario />
            <ContextOrganizer />
            <ModuleVisibilityMarker onViewed={markCentralIdeaReached}>
              <Module4Notice />
            </ModuleVisibilityMarker>
            <Module4Plan />
            <GuidanceSourceMatching />
            <Module4HandoffNarrative />
            <ProfessionalHandoffSequence />
            <Module4UnsafeNarrative />
            <UnsafeImprovisationReview />
            <Module4Misunderstanding />
            <Module4KnowledgeCheck />
            <Module4Reflection />
            <Module4Scripts />
            <Module4Takeaway />
            <Module4Completion />
          </>
        )}
      </div>
    </main>
  );
}
