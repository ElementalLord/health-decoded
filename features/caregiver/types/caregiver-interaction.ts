import type { CaregiverModuleId, CaregiverModuleInteractionId } from "../content/caregiver-ids.ts";

export type CaregiverInteractionCompletionRole =
  "core-application" | "optional-practice" | "safety-interruption";

export type CaregiverInteractionPurpose =
  | "interpret"
  | "distinguish"
  | "compare"
  | "organize"
  | "prioritize"
  | "choose"
  | "rewrite"
  | "practice"
  | "predict"
  | "apply"
  | "plan";

export interface CaregiverInteractionAccessibilityContract {
  readonly keyboardAlternative: string;
  readonly screenReaderBehavior: string;
  readonly mobileBehavior: string;
  readonly reducedMotionBehavior: string;
  readonly feedbackAnnouncement: "polite" | "assertive";
  readonly autoAdvance: false;
}

export interface CaregiverInteractionDataContract {
  readonly storage: "none" | "session-only" | "private-progress";
  readonly analytics: "none";
  readonly aiTutorHandoff: false;
  readonly sensitiveAnswerInProgress: false;
}

export interface CaregiverModuleInteractionMetadata {
  readonly id: CaregiverModuleInteractionId;
  readonly moduleId: CaregiverModuleId;
  readonly completionRole: CaregiverInteractionCompletionRole;
  readonly maySkipForModuleCompletion: boolean;
  readonly availableAfterCompletion: true;
}
