"use client";

import { ModuleVisibilityMarker } from "../foundation/module-visibility-marker";
import { caregiverModule1 } from "../../../content/caregiver-module-1";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import { ListenHelpSpaceBuilder } from "./listen-help-space-builder";
import { Module1Completion } from "./module-1-completion";
import { Module1KnowledgeCheck } from "./module-1-knowledge-check";
import {
  Module1ExplanationsNarrative,
  Module1FurtherReading,
  Module1ListeningNarrative,
  Module1MisunderstandingNarrative,
  Module1ReadinessNarrative,
  Module1ReturningNarrative,
  Module1Scenario,
  Module1Scripts,
} from "./module-1-narrative";
import { Module1Orientation } from "./module-1-orientation";
import { Module1Reflection } from "./module-1-reflection";
import { Module1Takeaway } from "./module-1-takeaway";
import { ObservationInterpretationWorkbench } from "./observation-interpretation-workbench";
import { TimingSequence } from "./timing-sequence";
import styles from "../../../styles/caregiver-module-1.module.css";

export function Module1Experience() {
  const { markCentralIdeaReached } = useCaregiverSession();
  return (
    <main
      className={styles.module}
      data-caregiver-module={caregiverModule1.id}
      data-rendering-mode="deterministic"
    >
      <Module1Orientation />
      <div className={styles.moduleBody}>
        <Module1Scenario />
        <ModuleVisibilityMarker onViewed={markCentralIdeaReached}>
          <Module1ExplanationsNarrative />
        </ModuleVisibilityMarker>
        <ObservationInterpretationWorkbench />
        <Module1ReadinessNarrative />
        <TimingSequence />
        <Module1ListeningNarrative />
        <ListenHelpSpaceBuilder />
        <Module1ReturningNarrative />
        <Module1MisunderstandingNarrative />
        <Module1FurtherReading />
        <Module1KnowledgeCheck />
        <Module1Reflection />
        <Module1Scripts />
        <Module1Takeaway />
        <Module1Completion />
      </div>
    </main>
  );
}
