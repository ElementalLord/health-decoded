import type {
  MilestoneCategory,
  MilestoneDefinition,
} from "@/features/achievements/types/milestone";

const define = (
  id: string,
  slug: string,
  name: string,
  description: string,
  category: MilestoneCategory,
  icon: MilestoneDefinition["icon"],
  criteriaLabel: string,
  order: number,
): MilestoneDefinition => ({ id, slug, name, description, category, icon, criteriaLabel, order, hidden: false });

export const milestoneDefinitions = [
  define("MILESTONE-FIRST-STEP", "first-step", "First Step", "You completed your first Health Decoded lesson.", "learning", "first-step", "Complete one Health Decoded lesson.", 1),
  define("MILESTONE-FOUNDATION-COMPLETE", "foundation-complete", "Foundation Complete", "You completed the foundational section of your Health Decoded journey.", "learning", "foundation", "Complete all 14 lessons in the Foundation phase.", 2),
  define("MILESTONE-LEARNING-IN-MOTION", "learning-in-motion", "Learning in Motion", "You completed 10 different Health Decoded lessons.", "learning", "learning-motion", "Complete 10 distinct lessons.", 3),
  define("MILESTONE-MYTH-CHECKER", "myth-checker", "Myth Checker", "You completed a full Diabetes Myth Check round.", "understanding", "myth-checker", "Complete one full Myth Check round.", 4),
  define("MILESTONE-SECOND-LOOK", "second-look", "Second Look", "You revisited claims that deserved another look.", "understanding", "second-look", "Complete a replay round of claims you wanted to revisit.", 5),
  define("MILESTONE-EVIDENCE-SEEKER", "evidence-seeker", "Evidence Seeker", "You checked the evidence behind three different diabetes claims.", "understanding", "evidence", "Open sources for three distinct claims in one session.", 6),
  define("MILESTONE-PRIORITIES-SET", "priorities-set", "Priorities Set", "You identified the most important things you want to discuss.", "appointment", "priorities", "Create three top priorities in Appointment Preparation.", 7),
  define("MILESTONE-QUESTIONS-READY", "questions-ready", "Questions Ready", "You prepared questions for your health professional.", "appointment", "questions", "Create three questions across at least two categories.", 8),
  define("MILESTONE-APPOINTMENT-READY", "appointment-ready", "Appointment Ready", "You created a complete preparation summary for an upcoming conversation with a health professional.", "appointment", "appointment", "Add meaningful content to four of the five preparation areas.", 9),
  define("MILESTONE-PLAN-IN-HAND", "plan-in-hand", "Plan in Hand", "You created a copy of your appointment preparation to use when you need it.", "appointment", "plan", "Print or copy a nonempty preparation summary.", 10),
  define("MILESTONE-SUPPORT-WITH-PERMISSION", "support-with-permission", "Support With Permission", "You learned how to support someone while respecting their choices and boundaries.", "support", "permission", "Complete Caregiver Module 2: Support Without Taking Over.", 11),
  define("MILESTONE-CONVERSATION-BUILDER", "conversation-builder", "Conversation Builder", "You practiced ways to make diabetes conversations more supportive.", "support", "conversation", "Complete Caregiver Module 1: What They May Be Feeling.", 12),
  define("MILESTONE-FOUND-TRUSTED-SUPPORT", "found-trusted-support", "Found Trusted Support", "You explored a trusted diabetes education or support option.", "resources", "trusted-support", "Open the verified diabetes education and support guide.", 13),
  define("MILESTONE-PERSONAL-TOOLKIT", "personal-toolkit", "Personal Toolkit", "You used several Health Decoded tools to learn, prepare, and find support.", "toolkit", "toolkit", "Earn milestones in four different learning and support categories.", 14),
] as const satisfies readonly MilestoneDefinition[];

export const milestoneDefinitionById = new Map(
  milestoneDefinitions.map((definition) => [definition.id, definition]),
);

export const milestoneCategoryLabels: Record<MilestoneCategory, string> = {
  learning: "Learning",
  understanding: "Understanding",
  appointment: "Appointment Preparation",
  support: "Support",
  resources: "Trusted Resources",
  toolkit: "Toolkit",
};

export const foundationJourneyLessonIds = Array.from(
  { length: 14 },
  (_, index) => `30000000-0000-0000-0000-${String(index + 1).padStart(12, "0")}`,
);
