export const caregiverPersistentProgressAllowlist = Object.freeze([
  "schemaVersion",
  "section.state",
  "section.currentNextStepCategory",
  "section.lastVisitedRoute",
  "modules[].moduleId",
  "modules[].state",
  "modules[].centralIdeaReached",
  "modules[].coreApplicationCompleted",
  "modules[].takeawayViewed",
  "modules[].keyIdeaUnderstood",
  "modules[].lastSectionId",
] as const);

export const caregiverAccountPersistenceDenylist = Object.freeze([
  "reflectionText",
  "dialogueDraft",
  "selfCheckAnswers",
  "selfCheckPatterns",
  "knowThePlanContent",
  "sharedSupportPlanContent",
  "customNextStepDetail",
  "names",
  "contacts",
  "medicalInformationPointers",
  "participationGateChoices",
  "clipboardContent",
  "printContent",
  "exportContent",
  "glucoseReadings",
  "medicationLogs",
  "clinicianMessages",
  "patientRecords",
] as const);

export const caregiverSessionOnlyDataKinds = Object.freeze([
  "module-reflection",
  "what-should-i-say-draft",
  "caregiver-self-check",
  "custom-next-step-detail",
] as const);

export const caregiverFutureLocalDocumentAllowlist = Object.freeze(["CG-T2", "CG-T4"] as const);

const allowedPersistentProgressFields = new Set<string>(caregiverPersistentProgressAllowlist);

export function isCaregiverPersistentProgressField(fieldPath: string): boolean {
  return allowedPersistentProgressFields.has(fieldPath);
}

export function assertCaregiverPersistentProgressField(fieldPath: string): void {
  if (!isCaregiverPersistentProgressField(fieldPath)) {
    throw new Error(`Caregiver progress may not persist field: ${fieldPath}`);
  }
}

export const caregiverPhaseOnePersistenceCapabilities = Object.freeze({
  accountProgressContractOnly: true,
  localStorage: false,
  indexedDb: false,
  accountSensitiveContent: false,
  analyticsSensitiveContent: false,
  aiTutorSensitiveContent: false,
} as const);
