export type LessonStageGateMap = Readonly<Record<number, string>>;

export function isLessonStageLocked({
  gates,
  readyStages,
  stage,
}: {
  accessMode: "active" | "review";
  gates: LessonStageGateMap;
  readyStages: ReadonlySet<number>;
  stage: number;
}) {
  return gates[stage] !== undefined && !readyStages.has(stage);
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

  for (let stage = currentStage; stage < nextStage; stage += 1) {
    if (isLessonStageLocked({ accessMode, gates, readyStages, stage })) return false;
  }

  return true;
}

export function getLessonResumeStage({
  gates,
  readyStages,
  storedStage,
}: {
  gates: LessonStageGateMap;
  readyStages: ReadonlySet<number>;
  storedStage: number;
}) {
  const unresolvedStage = Object.keys(gates)
    .map(Number)
    .filter((stage) => stage <= storedStage && !readyStages.has(stage))
    .sort((left, right) => left - right)[0];

  return unresolvedStage ?? storedStage;
}
