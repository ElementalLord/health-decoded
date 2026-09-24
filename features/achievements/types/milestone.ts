import type {
  ExplainItBackMilestoneId,
  ResourceMilestoneId,
  StoryMilestoneId,
} from "@/features/achievements/content/milestone-activity-ids";

export type MilestoneCategory =
  "learning" | "understanding" | "appointment" | "support" | "resources" | "toolkit";

export type MilestoneDefinition = {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly shortDescription: string;
  readonly description: string;
  readonly category: MilestoneCategory;
  readonly icon:
    | "first-step"
    | "building-rhythm"
    | "week-of-learning"
    | "foundation"
    | "learning-motion"
    | "reflection"
    | "myth-checker"
    | "second-look"
    | "evidence"
    | "priorities"
    | "questions"
    | "appointment"
    | "plan"
    | "permission"
    | "conversation"
    | "everyday-support"
    | "steady-support"
    | "sustainable-support"
    | "trusted-support"
    | "in-your-own-words"
    | "memory-in-motion"
    | "label-wise"
    | "story-explorer"
    | "concepts-made-clear"
    | "many-perspectives"
    | "circle-of-support"
    | "resource-navigator"
    | "toolkit";
  readonly criteriaLabel: string;
  readonly order: number;
  readonly hidden: boolean;
};

export type EarnedMilestone = {
  readonly definition: MilestoneDefinition;
  readonly unlockedAt: string;
};

export type MilestoneProgress = {
  readonly current: number;
  readonly target: number;
  readonly unit: string;
};

export type MilestonePathway = {
  readonly href: string;
  readonly actionLabel: string;
  readonly target: number;
  readonly unit: string;
};

export type MilestoneCollectionItem = {
  readonly definition: MilestoneDefinition;
  readonly unlockedAt: string | null;
  readonly progress: MilestoneProgress | null;
};

export type MilestoneEvent =
  | { event: "lesson_completed" }
  | { event: "myth_round_completed" }
  | { event: "myth_replay_completed" }
  | { event: "myth_sources_reviewed"; distinctClaimCount: number }
  | { event: "explain_it_back_completed"; challengeId: ExplainItBackMilestoneId }
  | { event: "spaced_review_completed" }
  | { event: "decode_label_completed" }
  | { event: "interactive_story_completed"; storyId: StoryMilestoneId }
  | { event: "appointment_priorities_completed"; priorityCount: number }
  | { event: "appointment_questions_completed"; questionCount: number; categoryCount: number }
  | { event: "appointment_summary_completed"; completedSectionCount: number }
  | { event: "appointment_summary_exported"; hasSummary: boolean }
  | {
      event: "caregiver_module_completed";
      moduleId: "CG-M1" | "CG-M2" | "CG-M3" | "CG-M4" | "CG-M5";
    }
  | {
      event: "caregiver_module_progressed";
      moduleId: "CG-M1" | "CG-M2" | "CG-M3" | "CG-M4" | "CG-M5";
      centralIdeaReached: boolean;
      coreApplicationCompleted: boolean;
      takeawayViewed: boolean;
    }
  | { event: "verified_support_resource_opened"; resourceId: ResourceMilestoneId };
