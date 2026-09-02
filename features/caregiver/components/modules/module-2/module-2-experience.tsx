"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
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
import { Module2Reflection } from "./module-2-reflection";
import { Module2Takeaway } from "./module-2-takeaway";
import { PermissionLanguageBuilder } from "./permission-language-builder";
import { RefusalBranchingConversation } from "./refusal-branching-conversation";
import { RepairSequence } from "./repair-sequence";
import { SupportBoundaryContinuum } from "./support-boundary-continuum";
import styles from "../../../styles/caregiver-module-2.module.css";

const stages = [
  { id: "opening", group: "Understand", label: "Opening", headingId: "caregiver-module-2-heading" },
  { id: "scenario", group: "Understand", label: "Leah and Andre", headingId: "CG-M2-S02-heading" },
  {
    id: "impact",
    group: "Understand",
    label: "Intention and impact",
    headingId: "CG-M2-S03-heading",
  },
  {
    id: "continuum",
    group: "Notice",
    label: "Support and control",
    headingId: "CG-M2-S04-heading",
  },
  { id: "permission", group: "Ask", label: "Specific permission", headingId: "CG-M2-S05-heading" },
  {
    id: "appointments",
    group: "Ask",
    label: "Appointments and privacy",
    headingId: "CG-M2-S06-heading",
  },
  { id: "refusal", group: "Respond", label: "Hearing no", headingId: "CG-M2-I04-heading" },
  { id: "repair", group: "Respond", label: "Repair", headingId: "CG-M2-S07-heading" },
  { id: "boundaries", group: "Balance", label: "Your limits", headingId: "CG-M2-S08-heading" },
  {
    id: "depth",
    group: "Balance",
    label: "Reliable support",
    headingId: "module-2-further-reading-heading",
  },
  { id: "check", group: "Review", label: "Knowledge check", headingId: "module-2-check-heading" },
  { id: "takeaway", group: "Review", label: "Takeaway", headingId: "module-2-takeaway-heading" },
] as const;

const sectionStageIndex: Readonly<Record<string, number>> = {
  "CG-M2-S03": 2,
  "CG-M2-S04": 3,
  "CG-M2-S05": 4,
};

export function Module2Experience() {
  const { markCentralIdeaReached } = useCaregiverSession();
  const [stageIndex, setStageIndex] = useState(0);
  const [furthestStage, setFurthestStage] = useState(0);
  const stage = stages[stageIndex]!;

  useEffect(() => {
    if (stageIndex === 0) return;
    window.scrollTo({ top: 0, behavior: "auto" });
    document.getElementById(stage.headingId)?.focus({ preventScroll: true });
  }, [stage.headingId, stageIndex]);

  function goToStage(nextIndex: number) {
    const boundedIndex = Math.min(stages.length - 1, Math.max(0, nextIndex));
    setStageIndex(boundedIndex);
    setFurthestStage((current) => Math.max(current, boundedIndex));
  }

  return (
    <main
      className={styles.module}
      data-caregiver-module={caregiverModule2.id}
      data-rendering-mode="deterministic"
    >
      <header className={styles.lessonHeader}>
        <Link className={styles.returnLink} href="/caregiver">
          <span aria-hidden="true">←</span> Support Someone You Care About
        </Link>
        <div className={styles.progressCopy}>
          <p>
            <span>Module 2 of 5</span>
            <span>
              Part {stageIndex + 1} of {stages.length}
            </span>
          </p>
          <ProgressBar
            className={styles.progressBar!}
            label={`Module 2 progress: part ${stageIndex + 1} of ${stages.length}`}
            value={((stageIndex + 1) / stages.length) * 100}
          />
          <p className={styles.stageName} aria-live="polite">
            <span>{stage.group}</span> · {stage.label}
          </p>
        </div>
      </header>

      <div className={styles.stageViewport}>
        <div className={styles.stage} data-stage="opening" hidden={stageIndex !== 0}>
          <Module2Orientation onBegin={() => goToStage(1)} />
        </div>
        <div className={styles.stage} data-stage="scenario" hidden={stageIndex !== 1}>
          <Module2Scenario />
        </div>
        <div className={styles.stage} data-stage="impact" hidden={stageIndex !== 2}>
          <ModuleVisibilityMarker onViewed={markCentralIdeaReached}>
            <Module2IntentionImpactNarrative />
          </ModuleVisibilityMarker>
          <IntentionImpactMap />
        </div>
        <div className={styles.stage} data-stage="continuum" hidden={stageIndex !== 3}>
          <Module2DistinctionNarrative />
          <SupportBoundaryContinuum />
        </div>
        <div className={styles.stage} data-stage="permission" hidden={stageIndex !== 4}>
          <Module2PermissionNarrative />
          <PermissionLanguageBuilder />
        </div>
        <div className={styles.stage} data-stage="appointments" hidden={stageIndex !== 5}>
          <Module2AppointmentsNarrative />
        </div>
        <div className={styles.stage} data-stage="refusal" hidden={stageIndex !== 6}>
          <RefusalBranchingConversation />
        </div>
        <div className={styles.stage} data-stage="repair" hidden={stageIndex !== 7}>
          <Module2RepairNarrative />
          <RepairSequence />
        </div>
        <div className={styles.stage} data-stage="boundaries" hidden={stageIndex !== 8}>
          <Module2BoundariesNarrative />
        </div>
        <div className={styles.stage} data-stage="depth" hidden={stageIndex !== 9}>
          <Module2FurtherReading />
          <Module2Scripts />
        </div>
        <div className={styles.stage} data-stage="check" hidden={stageIndex !== 10}>
          <Module2KnowledgeCheck
            onReviewSection={(sectionId) => goToStage(sectionStageIndex[sectionId] ?? 2)}
          />
        </div>
        <div className={styles.stage} data-stage="takeaway" hidden={stageIndex !== 11}>
          <Module2Takeaway />
          <Module2Reflection />
          <Module2Completion onReview={() => goToStage(4)} />
        </div>
      </div>

      {stageIndex > 0 ? (
        <nav className={styles.stageNavigation} aria-label="Lesson parts">
          <Button
            className={styles.backButton}
            fullWidth={false}
            onClick={() => goToStage(stageIndex - 1)}
            type="button"
            variant="secondary"
          >
            Back
          </Button>
          {stageIndex < stages.length - 1 ? (
            <Button
              className={styles.continueButton}
              fullWidth={false}
              onClick={() => goToStage(stageIndex + 1)}
              type="button"
            >
              Continue <span aria-hidden="true">→</span>
            </Button>
          ) : null}
        </nav>
      ) : null}

      <p className={styles.srOnly} aria-live="polite">
        {`Part ${stageIndex + 1} of ${stages.length}: ${stage.group}, ${stage.label}.`}
        {furthestStage > stageIndex ? " Previous responses have been kept." : ""}
      </p>
    </main>
  );
}
