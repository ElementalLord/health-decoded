export type MilestoneCategory =
  | "learning"
  | "understanding"
  | "appointment"
  | "support"
  | "resources"
  | "toolkit";

export type MilestoneDefinition = {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  readonly category: MilestoneCategory;
  readonly icon:
    | "first-step"
    | "foundation"
    | "learning-motion"
    | "myth-checker"
    | "second-look"
    | "evidence"
    | "priorities"
    | "questions"
    | "appointment"
    | "plan"
    | "permission"
    | "conversation"
    | "trusted-support"
    | "toolkit";
  readonly criteriaLabel: string;
  readonly order: number;
  readonly hidden: false;
};

export type EarnedMilestone = {
  readonly definition: MilestoneDefinition;
  readonly unlockedAt: string;
};

export type MilestoneEvent =
  | { event: "lesson_completed" }
  | { event: "myth_round_completed" }
  | { event: "myth_replay_completed" }
  | { event: "myth_sources_reviewed"; distinctClaimCount: number }
  | { event: "appointment_priorities_completed"; priorityCount: number }
  | { event: "appointment_questions_completed"; questionCount: number; categoryCount: number }
  | { event: "appointment_summary_completed"; completedSectionCount: number }
  | { event: "appointment_summary_exported"; hasSummary: boolean }
  | { event: "caregiver_module_completed"; moduleId: "CG-M1" | "CG-M2" }
  | { event: "verified_support_resource_opened"; resourceId: "diabetes-education-and-support" };
