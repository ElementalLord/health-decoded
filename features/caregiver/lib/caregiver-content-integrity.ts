import {
  caregiverCoreApplicationByModule,
  caregiverModuleInteractionIds,
  caregiverStableIds,
  isCaregiverStableId,
  type CaregiverModuleId,
  type CaregiverModuleInteractionId,
  // @ts-expect-error -- Node's built-in TypeScript test runner requires an explicit extension.
} from "../content/caregiver-ids.ts";
// @ts-expect-error -- Node's built-in TypeScript test runner requires an explicit extension.
import { caregiverSourceTraceById } from "../content/caregiver-source-map.ts";
import type {
  CaregiverInteractionCompletionRole,
  CaregiverModuleInteractionMetadata,
} from "../types/caregiver-interaction.ts";

const coreApplications = new Set<string>(Object.values(caregiverCoreApplicationByModule));

function interactionModuleId(id: CaregiverModuleInteractionId): CaregiverModuleId {
  return id.slice(0, 5) as CaregiverModuleId;
}

function completionRole(id: CaregiverModuleInteractionId): CaregiverInteractionCompletionRole {
  if (id === "CG-M4-I03") return "safety-interruption";
  return coreApplications.has(id) ? "core-application" : "optional-practice";
}

export const caregiverModuleInteractionMetadata = Object.freeze(
  caregiverModuleInteractionIds.map((id): CaregiverModuleInteractionMetadata => ({
    id,
    moduleId: interactionModuleId(id),
    completionRole: completionRole(id),
    maySkipForModuleCompletion: completionRole(id) !== "core-application",
    availableAfterCompletion: true,
  })),
);

export interface CaregiverIntegrityIssue {
  readonly code:
    | "duplicate-id"
    | "missing-source"
    | "unknown-core-application"
    | "incorrect-core-role"
    | "incorrect-safety-role";
  readonly id: string;
  readonly message: string;
}

export function validateCaregiverFoundationIntegrity(): readonly CaregiverIntegrityIssue[] {
  const issues: CaregiverIntegrityIssue[] = [];
  const seenIds = new Set<string>();

  for (const id of caregiverStableIds) {
    if (seenIds.has(id)) {
      issues.push({ code: "duplicate-id", id, message: "Stable caregiver IDs must be unique." });
    }
    seenIds.add(id);

    if (!isCaregiverStableId(id) || !caregiverSourceTraceById[id]) {
      issues.push({
        code: "missing-source",
        id,
        message: "Every stable caregiver ID must resolve to an authoritative source heading.",
      });
    }
  }

  for (const [moduleId, coreApplicationId] of Object.entries(caregiverCoreApplicationByModule)) {
    const metadata = caregiverModuleInteractionMetadata.find(({ id }) => id === coreApplicationId);

    if (!metadata) {
      issues.push({
        code: "unknown-core-application",
        id: coreApplicationId,
        message: `${moduleId} core application must be a registered module interaction.`,
      });
      continue;
    }

    if (metadata.completionRole !== "core-application") {
      issues.push({
        code: "incorrect-core-role",
        id: coreApplicationId,
        message: "A corrected core application must have the core-application role.",
      });
    }
  }

  const safetyMetadata = caregiverModuleInteractionMetadata.find(({ id }) => id === "CG-M4-I03");
  if (safetyMetadata?.completionRole !== "safety-interruption") {
    issues.push({
      code: "incorrect-safety-role",
      id: "CG-M4-I03",
      message: "CG-M4-I03 must remain a safety interruption and never a completion activity.",
    });
  }

  return issues;
}
