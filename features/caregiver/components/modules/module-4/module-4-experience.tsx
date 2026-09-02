"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
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

const stages = [
  { id: "opening", group: "Orient", label: "Know the layers", headingId: "caregiver-module-4-heading" },
  { id: "scenario", group: "Notice", label: "The unfinished errand", headingId: "CG-M4-S03-heading" },
  { id: "context", group: "Notice", label: "Report what changed", headingId: "CG-M4-S04-heading" },
  { id: "plan", group: "Plan", label: "Use their plan", headingId: "CG-M4-S05-heading" },
  { id: "sources", group: "Choose", label: "Find the right source", headingId: "CG-M4-I02-heading" },
  { id: "handoff", group: "Hand off", label: "Start the call", headingId: "CG-M4-S06-heading" },
  { id: "improvise", group: "Pause", label: "Do not invent treatment", headingId: "CG-M4-S07-heading" },
  { id: "delay", group: "Notice", label: "One more reading", headingId: "CG-M4-S08-heading" },
  { id: "scripts", group: "Prepare", label: "Language to keep", headingId: "module-4-scripts-heading" },
  { id: "check", group: "Review", label: "Check your understanding", headingId: "m4-knowledge-heading" },
  { id: "takeaway", group: "Review", label: "Takeaway", headingId: "m4-takeaway-heading" },
] as const;

const sectionStageIndex: Readonly<Record<string, number>> = {
  "CG-M4-S02": 0,
  "CG-M4-S04": 2,
  "CG-M4-S05": 3,
};

export function Module4Experience() {
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
    <main className={styles.module} data-caregiver-module={caregiverModule4.id} data-rendering-mode="deterministic">
      <header className={styles.lessonHeader}>
        <Link className={styles.returnLink} href="/caregiver"><span aria-hidden="true">←</span> Support Someone You Care About</Link>
        <div className={styles.progressCopy}>
          <p><span>Module 4 of 5</span><span>Part {stageIndex + 1} of {stages.length}</span></p>
          <ProgressBar className={styles.progressBar!} label={`Module 4 progress: part ${stageIndex + 1} of ${stages.length}`} value={((stageIndex + 1) / stages.length) * 100} />
          <p className={styles.stageName} aria-live="polite"><span>{stage.group}</span> · {stage.label}</p>
        </div>
      </header>

      <div className={styles.stageViewport}>
        <div className={styles.stage} data-stage="opening" hidden={stageIndex !== 0}><Module4Orientation onBegin={() => goToStage(1)} /></div>
        <div className={styles.stage} data-stage="scenario" hidden={stageIndex !== 1}><Module4Scenario /></div>
        <div className={styles.stage} data-stage="context" hidden={stageIndex !== 2}>
          <ModuleVisibilityMarker onViewed={markCentralIdeaReached}><Module4Notice /></ModuleVisibilityMarker>
          <ContextOrganizer />
        </div>
        <div className={styles.stage} data-stage="plan" hidden={stageIndex !== 3}><Module4Plan /></div>
        <div className={styles.stage} data-stage="sources" hidden={stageIndex !== 4}><GuidanceSourceMatching /></div>
        <div className={styles.stage} data-stage="handoff" hidden={stageIndex !== 5}><Module4HandoffNarrative /><ProfessionalHandoffSequence /></div>
        <div className={styles.stage} data-stage="improvise" hidden={stageIndex !== 6}><Module4UnsafeNarrative /><UnsafeImprovisationReview /></div>
        <div className={styles.stage} data-stage="delay" hidden={stageIndex !== 7}><Module4Misunderstanding /></div>
        <div className={styles.stage} data-stage="scripts" hidden={stageIndex !== 8}><Module4Scripts /></div>
        <div className={styles.stage} data-stage="check" hidden={stageIndex !== 9}><Module4KnowledgeCheck onReviewSection={(sectionId) => goToStage(sectionStageIndex[sectionId] ?? 2)} /></div>
        <div className={styles.stage} data-stage="takeaway" hidden={stageIndex !== 10}><Module4Takeaway /><Module4Reflection /><Module4Completion onReview={() => goToStage(4)} /></div>
      </div>

      {stageIndex > 0 ? <nav className={styles.stageNavigation} aria-label="Lesson parts">
        <Button className={styles.backButton} fullWidth={false} onClick={() => goToStage(stageIndex - 1)} type="button" variant="secondary">Back</Button>
        {stageIndex < stages.length - 1 ? <Button className={styles.continueButton} fullWidth={false} onClick={() => goToStage(stageIndex + 1)} type="button">Continue <span aria-hidden="true">→</span></Button> : null}
      </nav> : null}

      <p className={styles.srOnly} aria-live="polite">{`Part ${stageIndex + 1} of ${stages.length}: ${stage.group}, ${stage.label}.`}{furthestStage > stageIndex ? " Previous responses have been kept." : ""}</p>
    </main>
  );
}
