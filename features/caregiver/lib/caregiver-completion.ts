import {
  caregiverCoreApplicationByModule,
  type CaregiverModuleId,
  // @ts-expect-error -- Node's built-in TypeScript test runner requires an explicit extension.
} from "../content/caregiver-ids.ts";
import type {
  CaregiverModuleProgress,
  CaregiverSectionProgress,
} from "../types/caregiver-progress.ts";

export interface CaregiverModuleCompletionInputs {
  readonly centralIdeaReached: boolean;
  readonly coreApplicationCompleted: boolean;
  readonly takeawayViewed: boolean;
}

export interface CaregiverSectionCompletionInputs {
  readonly completedModuleIds: readonly CaregiverModuleId[];
  readonly currentNextStepCategory: string | null;
}

export function isCaregiverModuleComplete({
  centralIdeaReached,
  coreApplicationCompleted,
  takeawayViewed,
}: CaregiverModuleCompletionInputs): boolean {
  return centralIdeaReached && coreApplicationCompleted && takeawayViewed;
}

export function isCaregiverSectionComplete({
  completedModuleIds,
  currentNextStepCategory,
}: CaregiverSectionCompletionInputs): boolean {
  const uniqueCompletedModuleIds = new Set(completedModuleIds);
  const allModulesCompleted = Object.keys(caregiverCoreApplicationByModule).every((moduleId) =>
    uniqueCompletedModuleIds.has(moduleId as CaregiverModuleId),
  );

  return allModulesCompleted && Boolean(currentNextStepCategory?.trim());
}

export function deriveCaregiverModuleState(
  progress: Pick<
    CaregiverModuleProgress,
    "state" | "centralIdeaReached" | "coreApplicationCompleted" | "takeawayViewed"
  >,
): CaregiverModuleProgress["state"] {
  if (progress.state === "revisit") return "revisit";

  if (isCaregiverModuleComplete(progress)) return "completed";

  if (
    progress.state === "inProgress" ||
    progress.centralIdeaReached ||
    progress.coreApplicationCompleted ||
    progress.takeawayViewed
  ) {
    return "inProgress";
  }

  return "notStarted";
}

export function deriveCaregiverSectionState(
  input: CaregiverSectionCompletionInputs,
): CaregiverSectionProgress["state"] {
  if (isCaregiverSectionComplete(input)) return "completed";

  return input.completedModuleIds.length > 0 || input.currentNextStepCategory
    ? "inProgress"
    : "notStarted";
}

export function applyUrgentInterruption<Progress extends CaregiverModuleProgress>(
  progress: Progress,
): Progress {
  return progress;
}
