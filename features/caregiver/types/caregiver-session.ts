import type { CaregiverModuleReflectionId } from "../content/caregiver-ids.ts";

export interface CaregiverSessionOnlyValue<Value> {
  readonly scope: "session-only";
  readonly value: Value;
  readonly cleared: boolean;
}

export interface CaregiverSessionState {
  readonly reflections: Partial<
    Record<CaregiverModuleReflectionId, CaregiverSessionOnlyValue<string>>
  >;
  readonly whatShouldISayDraft?: CaregiverSessionOnlyValue<string>;
  readonly selfCheckSelections?: CaregiverSessionOnlyValue<readonly string[]>;
  readonly customNextStepDetail?: CaregiverSessionOnlyValue<string>;
}

export const caregiverSessionBoundary = Object.freeze({
  accountPersistence: false,
  browserPersistence: false,
  analytics: false,
  serverSubmission: false,
  aiTutorHandoff: false,
  hiddenRecoveryCopy: false,
} as const);
