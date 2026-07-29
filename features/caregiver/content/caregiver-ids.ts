const numberedIds = <Prefix extends string>(
  prefix: Prefix,
  count: number,
): readonly `${Prefix}${string}`[] =>
  Object.freeze(
    Array.from(
      { length: count },
      (_, index) => `${prefix}${String(index + 1).padStart(2, "0")}` as `${Prefix}${string}`,
    ),
  );

export const caregiverModuleIds = ["CG-M1", "CG-M2", "CG-M3", "CG-M4", "CG-M5"] as const;

export const caregiverToolIds = ["CG-T1", "CG-T2", "CG-T3", "CG-T4"] as const;

export const caregiverCoreApplicationIds = [
  "CG-M1-I01",
  "CG-M2-I03",
  "CG-M3-I02",
  "CG-M4-I02",
  "CG-M5-I01",
] as const;

export const caregiverCoreApplicationByModule = Object.freeze({
  "CG-M1": "CG-M1-I01",
  "CG-M2": "CG-M2-I03",
  "CG-M3": "CG-M3-I02",
  "CG-M4": "CG-M4-I02",
  "CG-M5": "CG-M5-I01",
} satisfies Record<CaregiverModuleId, CaregiverCoreApplicationId>);

export const caregiverModuleSectionIds = Object.freeze([
  ...numberedIds("CG-M1-S", 7),
  ...numberedIds("CG-M2-S", 8),
  ...numberedIds("CG-M3-S", 7),
  ...numberedIds("CG-M4-S", 8),
  ...numberedIds("CG-M5-S", 7),
]);

export const caregiverModuleInteractionIds = [
  "CG-M1-I01",
  "CG-M1-I02",
  "CG-M1-I03",
  "CG-M2-I01",
  "CG-M2-I02",
  "CG-M2-I03",
  "CG-M2-I04",
  "CG-M2-I05",
  "CG-M3-I01",
  "CG-M3-I02",
  "CG-M3-I03",
  "CG-M3-I04",
  "CG-M4-I01",
  "CG-M4-I02",
  "CG-M4-I03",
  "CG-M4-I04",
  "CG-M4-I05",
  "CG-M5-I01",
  "CG-M5-I02",
  "CG-M5-I03",
  "CG-M5-I04",
  "CG-M5-I05",
] as const;

export const caregiverModuleQuestionIds = [
  ...numberedIds("CG-M1-Q", 3),
  ...numberedIds("CG-M2-Q", 3),
  ...numberedIds("CG-M3-Q", 3),
  ...numberedIds("CG-M4-Q", 3),
  ...numberedIds("CG-M5-Q", 3),
] as const;

export const caregiverModuleReflectionIds = [
  "CG-M1-R01",
  "CG-M2-R01",
  "CG-M3-R01",
  "CG-M4-R01",
  "CG-M5-R01",
] as const;

export const caregiverToolScenarioIds = numberedIds("CG-T1-SC", 12);
export const caregiverToolFieldIds = numberedIds("CG-T2-F", 34);
export const caregiverSelfCheckQuestionIds = numberedIds("CG-T3-Q", 15);
export const caregiverSelfCheckResultIds = numberedIds("CG-T3-R", 6);
export const caregiverAgreementAreaIds = numberedIds("CG-T4-A", 12);

export const caregiverToolInteractionIds = Object.freeze([
  ...numberedIds("CG-T1-I", 7),
  ...numberedIds("CG-T2-I", 6),
  ...numberedIds("CG-T3-I", 3),
  ...numberedIds("CG-T4-I", 6),
]);

export const caregiverToolNoticeIds = Object.freeze([
  ...numberedIds("CG-T1-N", 4),
  ...numberedIds("CG-T2-N", 8),
  ...numberedIds("CG-T3-N", 4),
  ...numberedIds("CG-T4-N", 9),
]);

export const caregiverClaimIds = Object.freeze([
  ...numberedIds("CG-CLAIM-", 14),
  ...numberedIds("CG-TOOL-CLAIM-", 12),
]);

export const caregiverReviewIds = Object.freeze([
  ...numberedIds("CG-REV-", 8),
  ...numberedIds("CG-TOOL-REV-", 18),
]);

export const caregiverIssueIds = [
  "CG-TOOL-ISSUE-001",
  "CG-TOOL-ISSUE-002",
  "CG-TOOL-ISSUE-003",
  "CG-TOOL-ISSUE-005",
] as const;

export const caregiverStableIds = Object.freeze([
  "CG-LANDING",
  "CG-LANDING-I01",
  "CG-LANDING-I02",
  ...caregiverModuleIds,
  ...caregiverModuleSectionIds,
  ...caregiverModuleInteractionIds,
  ...caregiverModuleQuestionIds,
  ...caregiverModuleReflectionIds,
  ...caregiverToolIds,
  ...caregiverToolScenarioIds,
  ...caregiverToolFieldIds,
  ...caregiverSelfCheckQuestionIds,
  ...caregiverSelfCheckResultIds,
  ...caregiverAgreementAreaIds,
  ...caregiverToolInteractionIds,
  ...caregiverToolNoticeIds,
  "CG-COMPLETE",
  "CG-COMPLETE-I01",
  ...caregiverClaimIds,
  ...caregiverReviewIds,
  ...caregiverIssueIds,
]);

const caregiverStableIdSet = new Set<string>(caregiverStableIds);

export type CaregiverModuleId = (typeof caregiverModuleIds)[number];
export type CaregiverToolId = (typeof caregiverToolIds)[number];
export type CaregiverCoreApplicationId = (typeof caregiverCoreApplicationIds)[number];
export type CaregiverModuleInteractionId = (typeof caregiverModuleInteractionIds)[number];
export type CaregiverModuleReflectionId = (typeof caregiverModuleReflectionIds)[number];
export type CaregiverStableId = string & { readonly __caregiverStableId: unique symbol };

export function isCaregiverStableId(value: string): value is CaregiverStableId {
  return caregiverStableIdSet.has(value);
}

export function toCaregiverStableId(value: string): CaregiverStableId {
  if (!isCaregiverStableId(value)) {
    throw new Error(`Unknown caregiver content ID: ${value}`);
  }

  return value;
}
