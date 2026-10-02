import { milestoneDefinitions } from "@/features/achievements/content/milestone-definitions";
import type { MilestoneCollectionItem } from "@/features/achievements/types/milestone";
import type { ProgressViewModel } from "@/features/progress/types/progress";

export const sceneLabels = [
  "Opening",
  "Problem",
  "Product",
  "Myth Check",
  "Market",
  "Mission + Ethics",
  "Fit + Closing",
] as const;

const lessonTitles = [
  "A gentle beginning",
  "What Type 2 means",
  "Reading numbers with context",
  "Food without judgment",
  "Movement that fits",
  "Patterns, not perfect days",
  "Medicines as tools",
  "Blood glucose basics",
  "Preparing for the unexpected",
  "Building a steady routine",
  "Protecting your eyes and feet",
  "Sick-day support",
  "Finding people who understand",
  "Looking back and moving forward",
] as const;

export const demoProgress: ProgressViewModel = {
  completedLessons: 8,
  completedLessonsHistory: lessonTitles.slice(0, 8).map((lessonTitle, index) => ({
    completedAt: `2026-09-${String(index + 10).padStart(2, "0")}T14:00:00.000Z`,
    dayNumber: index + 1,
    lessonTitle,
    xpAwarded: 100,
  })),
  journeyComplete: false,
  journeyTitle: "Foundation",
  milestones: lessonTitles.map((lessonTitle, index) => ({
    dayNumber: index + 1,
    estimatedMinutes: 8,
    lessonTitle,
    state: index < 8 ? "completed" : index === 8 ? "current" : "locked",
    subtitle: index === 8 ? "Build a plan for days when your usual routine changes." : null,
    xpAwarded: index < 8 ? 100 : 0,
  })),
  percentage: (8 / 14) * 100,
  totalLearningXp: 800,
  totalLessons: 14,
};

export const demoMilestones: readonly MilestoneCollectionItem[] = milestoneDefinitions
  .slice(0, 12)
  .map((definition, index) => ({
    definition,
    progress: index < 4 ? null : { current: Math.min(index - 2, 3), target: 5, unit: "steps" },
    unlockedAt: index < 4 ? `2026-09-${String(index + 12).padStart(2, "0")}T14:00:00Z` : null,
  }));

export const demoJourneyProgress = {
  completedLessons: 8,
  currentDay: 9,
  percentage: (8 / 14) * 100,
  totalDays: 14,
};
