"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { caregiverModule1 } from "../../../content/caregiver-module-1";
import { ListenHelpSpaceBuilder } from "./listen-help-space-builder";
import { Module1Closing, Module1KnowledgeCheck } from "./module-1-knowledge-check";
import {
  Module1Meaning,
  Module1Possibilities,
  Module1Readiness,
  Module1Returning,
  Module1Scenario,
} from "./module-1-narrative";
import { Module1Orientation } from "./module-1-orientation";
import { ObservationInterpretationWorkbench } from "./observation-interpretation-workbench";
import { TimingSequence } from "./timing-sequence";
import styles from "../../../styles/caregiver-module-1.module.css";

const stages = [
  { id: "opening", label: "Opening", headingId: "caregiver-module-1-heading" },
  { id: "scenario", label: "Mira and Jules", headingId: "CG-M1-S02-heading" },
  { id: "meaning", label: "What is known", headingId: "CG-M1-S03-heading" },
  { id: "notice", label: "Practice noticing", headingId: "CG-M1-I01-heading" },
  {
    id: "possibilities",
    label: "Keep possibilities open",
    headingId: "module-1-possibilities-heading",
  },
  { id: "timing", label: "Timing across days", headingId: "CG-M1-I02-heading" },
  { id: "readiness", label: "Readiness and permission", headingId: "CG-M1-S04-heading" },
  { id: "support", label: "Build a response", headingId: "CG-M1-I03-heading" },
  { id: "returning", label: "Returning later", headingId: "CG-M1-S06-heading" },
  { id: "check", label: "Check your understanding", headingId: "module-1-check-heading" },
  { id: "takeaway", label: "Takeaway", headingId: "module-1-takeaway-heading" },
] as const;

export function Module1Experience() {
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
      data-caregiver-module={caregiverModule1.id}
      data-rendering-mode="deterministic"
    >
      <header className={styles.lessonHeader}>
        <Link className={styles.returnLink} href="/caregiver">
          <span aria-hidden="true">←</span> Support Someone You Care About
        </Link>
        <div className={styles.progressCopy}>
          <p>
            <span>Module 1 of 5</span>
            <span>
              Step {stageIndex + 1} of {stages.length}
            </span>
          </p>
          <ProgressBar
            className={styles.progressBar!}
            label={`Module 1 progress: step ${stageIndex + 1} of ${stages.length}`}
            value={((stageIndex + 1) / stages.length) * 100}
          />
          <p className={styles.stageName} aria-live="polite">
            {stage.label}
          </p>
        </div>
      </header>

      <div className={styles.stageViewport}>
        <div className={styles.stage} data-stage="opening" hidden={stageIndex !== 0}>
          <Module1Orientation onBegin={() => goToStage(1)} />
        </div>
        <div className={styles.stage} data-stage="scenario" hidden={stageIndex !== 1}>
          <Module1Scenario />
        </div>
        <div className={styles.stage} data-stage="meaning" hidden={stageIndex !== 2}>
          <Module1Meaning />
        </div>
        <div className={styles.stage} data-stage="notice" hidden={stageIndex !== 3}>
          <ObservationInterpretationWorkbench />
        </div>
        <div className={styles.stage} data-stage="possibilities" hidden={stageIndex !== 4}>
          <Module1Possibilities />
        </div>
        <div className={styles.stage} data-stage="timing" hidden={stageIndex !== 5}>
          <TimingSequence />
        </div>
        <div className={styles.stage} data-stage="readiness" hidden={stageIndex !== 6}>
          <Module1Readiness />
        </div>
        <div className={styles.stage} data-stage="support" hidden={stageIndex !== 7}>
          <ListenHelpSpaceBuilder />
        </div>
        <div className={styles.stage} data-stage="returning" hidden={stageIndex !== 8}>
          <Module1Returning />
        </div>
        <div className={styles.stage} data-stage="check" hidden={stageIndex !== 9}>
          <Module1KnowledgeCheck />
        </div>
        <div className={styles.stage} data-stage="takeaway" hidden={stageIndex !== 10}>
          <Module1Closing onReview={() => goToStage(3)} />
        </div>
      </div>

      {stageIndex > 0 ? (
        <nav className={styles.stageNavigation} aria-label="Lesson steps">
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
        {`Step ${stageIndex + 1} of ${stages.length}: ${stage.label}`}
        {furthestStage > stageIndex ? " Previous responses have been kept." : ""}
      </p>
    </main>
  );
}
