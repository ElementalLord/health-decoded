"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
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

const stages = [
  { id: "opening", group: "Notice", label: "Everyday support", headingId: "caregiver-module-3-heading" },
  { id: "scenario", group: "Notice", label: "Dinner at seven", headingId: "CG-M3-S02-heading" },
  { id: "meals", group: "Ask", label: "Keep meals shared", headingId: "CG-M3-S03-heading" },
  { id: "plan", group: "Plan", label: "Plan the evening", headingId: "CG-M3-I01-heading" },
  { id: "specific", group: "Offer", label: "Make help specific", headingId: "CG-M3-S04-heading" },
  { id: "match", group: "Practice", label: "Match the request", headingId: "CG-M3-I02-heading" },
  { id: "menu", group: "Adjust", label: "Support can change", headingId: "CG-M3-S05-heading" },
  { id: "routines", group: "Notice", label: "Routine or checking", headingId: "CG-M3-I04-heading" },
  { id: "normal", group: "Balance", label: "Preserve normal life", headingId: "CG-M3-S06-heading" },
  { id: "depth", group: "Keep", label: "Language to keep", headingId: "module-3-further-reading-heading" },
  { id: "check", group: "Review", label: "Check your understanding", headingId: "module-3-check-heading" },
  { id: "takeaway", group: "Review", label: "Takeaway", headingId: "module-3-takeaway-heading" },
] as const;

const sectionStageIndex: Readonly<Record<string, number>> = {
  "CG-M3-S03": 2,
  "CG-M3-S04": 4,
  "CG-M3-S05": 6,
};

export function Module3Experience() {
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
    <main className={styles.module} data-caregiver-module={caregiverModule3.id} data-rendering-mode="deterministic">
      <header className={styles.lessonHeader}>
        <Link className={styles.returnLink} href="/caregiver"><span aria-hidden="true">←</span> Support Someone You Care About</Link>
        <div className={styles.progressCopy}>
          <p><span>Module 3 of 5</span><span>Part {stageIndex + 1} of {stages.length}</span></p>
          <ProgressBar className={styles.progressBar!} label={`Module 3 progress: part ${stageIndex + 1} of ${stages.length}`} value={((stageIndex + 1) / stages.length) * 100} />
          <p className={styles.stageName} aria-live="polite"><span>{stage.group}</span> · {stage.label}</p>
        </div>
      </header>

      <div className={styles.stageViewport}>
        <div className={styles.stage} data-stage="opening" hidden={stageIndex !== 0}><Module3Orientation onBegin={() => goToStage(1)} /></div>
        <div className={styles.stage} data-stage="scenario" hidden={stageIndex !== 1}><Module3Scenario /></div>
        <div className={styles.stage} data-stage="meals" hidden={stageIndex !== 2}><Module3MealsNarrative /></div>
        <div className={styles.stage} data-stage="plan" hidden={stageIndex !== 3}><SharedPlanningWorkspace /></div>
        <div className={styles.stage} data-stage="specific" hidden={stageIndex !== 4}><ModuleVisibilityMarker onViewed={markCentralIdeaReached}><Module3SpecificNarrative /></ModuleVisibilityMarker></div>
        <div className={styles.stage} data-stage="match" hidden={stageIndex !== 5}><RequestMatching /></div>
        <div className={styles.stage} data-stage="menu" hidden={stageIndex !== 6}><Module3ChangesNarrative /><SupportMenu /></div>
        <div className={styles.stage} data-stage="routines" hidden={stageIndex !== 7}><RoutineComparison /></div>
        <div className={styles.stage} data-stage="normal" hidden={stageIndex !== 8}><Module3NormalLifeNarrative /><Module3MisunderstandingNarrative /></div>
        <div className={styles.stage} data-stage="depth" hidden={stageIndex !== 9}><Module3FurtherReading /><Module3Scripts /></div>
        <div className={styles.stage} data-stage="check" hidden={stageIndex !== 10}><Module3KnowledgeCheck onReviewSection={(sectionId) => goToStage(sectionStageIndex[sectionId] ?? 4)} /></div>
        <div className={styles.stage} data-stage="takeaway" hidden={stageIndex !== 11}><Module3Takeaway /><Module3Reflection /><Module3Completion onReview={() => goToStage(4)} /></div>
      </div>

      {stageIndex > 0 ? <nav className={styles.stageNavigation} aria-label="Lesson parts">
        <Button className={styles.backButton} fullWidth={false} onClick={() => goToStage(stageIndex - 1)} type="button" variant="secondary">Back</Button>
        {stageIndex < stages.length - 1 ? <Button className={styles.continueButton} fullWidth={false} onClick={() => goToStage(stageIndex + 1)} type="button">Continue <span aria-hidden="true">→</span></Button> : null}
      </nav> : null}
      <p className={styles.srOnly} aria-live="polite">{`Part ${stageIndex + 1} of ${stages.length}: ${stage.group}, ${stage.label}.`}{furthestStage > stageIndex ? " Previous responses have been kept." : ""}</p>
    </main>
  );
}
