import type { CaregiverArticle } from "@/features/caregiver/schemas/caregiver-content.schema";

export type CaregiverArticleViewModel = CaregiverArticle;

export type {
  CaregiverContentBlock,
  CaregiverContentContract,
  CaregiverDeterministicText,
  CaregiverModuleContract,
  CaregiverSourceTraceContract,
} from "./caregiver-content";
export type {
  CaregiverInteractionAccessibilityContract,
  CaregiverInteractionCompletionRole,
  CaregiverInteractionDataContract,
  CaregiverInteractionPurpose,
  CaregiverModuleInteractionMetadata,
} from "./caregiver-interaction";
export type {
  CaregiverModuleProgress,
  CaregiverProgress,
  CaregiverSectionProgress,
} from "./caregiver-progress";
export type {
  CaregiverRegionConfiguration,
  CaregiverRegionalPresentation,
  CaregiverRegionStatus,
} from "./caregiver-region";
export type { CaregiverSessionOnlyValue, CaregiverSessionState } from "./caregiver-session";
