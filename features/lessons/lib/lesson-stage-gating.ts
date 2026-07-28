export type LessonStageGateMap = Readonly<Record<number, string>>;

export function isLessonStageLocked({
  accessMode,
  gates,
  readyStages,
  stage,
}: {
  accessMode: "active" | "review";
  gates: LessonStageGateMap;
  readyStages: ReadonlySet<number>;
  stage: number;
}) {
  return accessMode === "active" && gates[stage] !== undefined && !readyStages.has(stage);
}

export function canNavigateToLessonStage({
  accessMode,
  currentStage,
  gates,
  nextStage,
  readyStages,
}: {
  accessMode: "active" | "review";
  currentStage: number;
  gates: LessonStageGateMap;
  nextStage: number;
  readyStages: ReadonlySet<number>;
}) {
  if (nextStage <= currentStage) return true;

  return !isLessonStageLocked({
    accessMode,
    gates,
    readyStages,
    stage: currentStage,
  });
}
