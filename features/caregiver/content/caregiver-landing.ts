import type { CaregiverModuleId, CaregiverToolId } from "./caregiver-ids.ts";

export const caregiverLandingSource = Object.freeze({
  document: "docs/caregiver/01-CAREGIVER-CONTENT.md",
  heading: "LANDING PAGE",
  ids: ["CG-LANDING", "CG-LANDING-I01", "CG-LANDING-I02"] as const,
  renderingMode: "deterministic",
  runtimeGeneration: false,
});

export interface CaregiverLandingRoute {
  readonly id: CaregiverModuleId;
  readonly order: 1 | 2 | 3 | 4 | 5;
  readonly title: string;
  readonly moduleTitle: string;
  readonly description: string;
  readonly action: string;
  readonly purpose: string;
  readonly time: string;
  readonly feedback: string;
}

export interface CaregiverLandingTool {
  readonly id: CaregiverToolId;
  readonly title: string;
  readonly description: string;
}

export type CaregiverBeginningChoiceId = "situation" | "recommended" | "tool";

export interface CaregiverBeginningChoice {
  readonly id: CaregiverBeginningChoiceId;
  readonly label: string;
  readonly feedback: string;
}

export interface CaregiverReturningStateData {
  readonly recentModuleTitle: string;
  readonly recentSectionTitle: string;
  readonly nextModuleTitle: string;
  readonly recentToolName?: string;
}

export const caregiverLandingRoutes = Object.freeze([
  {
    id: "CG-M1",
    order: 1,
    title: "I want to understand what they may be feeling",
    moduleTitle: "What They May Be Feeling",
    description:
      "Slow down the urge to explain a reaction and practice asking what support, if any, is wanted.",
    action: "Go to What They May Be Feeling",
    purpose: "Practice staying curious when a reaction could mean more than one thing.",
    time: "8 to 10 minutes",
    feedback:
      "Start with noticing what happened without deciding what it means. This route practices curiosity, timing, and listening.",
  },
  {
    id: "CG-M2",
    order: 2,
    title: "I am unsure how to help without overstepping",
    moduleTitle: "Support Without Taking Over",
    description: "Separate support from pressure, monitoring, and assumed access.",
    action: "Go to Support Without Taking Over",
    purpose:
      "Learn how permission, privacy, and revisable agreements keep help from becoming control.",
    time: "14 to 18 minutes",
    feedback:
      "Start with the line between offered help and assumed involvement. This route focuses on permission, privacy, and repair.",
  },
  {
    id: "CG-M3",
    order: 3,
    title: "I want to help with everyday life",
    moduleTitle: "Everyday Support That Actually Helps",
    description:
      "Turn broad offers into specific help with meals, errands, movement, appointments, and routines.",
    action: "Go to Everyday Support That Actually Helps",
    purpose: "Build specific, ordinary support around what the person actually wants.",
    time: "10 to 13 minutes",
    feedback:
      "Start with ordinary tasks. This route turns ‘Tell me if you need anything’ into support that is specific and easier to accept or decline.",
  },
  {
    id: "CG-M4",
    order: 4,
    title: "Something feels wrong",
    moduleTitle: "When Something Feels Wrong",
    description:
      "Clarify your role when a situation is concerning but you do not know what it means.",
    action: "Go to When Something Feels Wrong",
    purpose:
      "Use the person's plan and appropriate professional help without diagnosing or improvising treatment.",
    time: "10 to 12 minutes",
    feedback:
      "Start with role clarity. This route cannot assess a current situation. If someone may be in immediate danger, use the urgent route now.",
  },
  {
    id: "CG-M5",
    order: 5,
    title: "I am feeling stretched thin",
    moduleTitle: "The Caregiver Matters Too",
    description:
      "Notice what is becoming hard to sustain and make room for limits and backup support.",
    action: "Go to The Caregiver Matters Too",
    purpose:
      "Recognize strain, clarify responsibility, and build support that one person can sustain.",
    time: "10 to 13 minutes",
    feedback:
      "Start with what is becoming hard to sustain. This route separates caring from being responsible for another adult's decisions.",
  },
] as const satisfies readonly CaregiverLandingRoute[]);

export const caregiverBeginningChoices = Object.freeze([
  {
    id: "situation",
    label: "Start with what is happening today",
    feedback:
      "Use the need-based routes above. You can return to the guided path without losing progress.",
  },
  {
    id: "recommended",
    label: "Follow the recommended path from the beginning",
    feedback:
      "Begin with What They May Be Feeling. Later modules stay open if another need becomes more urgent.",
  },
  {
    id: "tool",
    label: "Open a practical tool",
    feedback:
      "Tools can be used without module completion. Their save and privacy behavior differs by tool and will be shown before use.",
  },
] as const satisfies readonly CaregiverBeginningChoice[]);

export const caregiverLandingTools = Object.freeze([
  {
    id: "CG-T1",
    title: "What Should I Say?",
    description: "Prepare a respectful way to open, pause, repair, or revisit a conversation.",
  },
  {
    id: "CG-T2",
    title: "Know the Plan",
    description:
      "Organize where clinician-created instructions are kept and what role has been agreed.",
  },
  {
    id: "CG-T3",
    title: "Caregiver Self-Check",
    description: "Privately notice support patterns that may be difficult to sustain.",
  },
  {
    id: "CG-T4",
    title: "Shared Support Plan",
    description: "Record support preferences that both people can review and change.",
  },
] as const satisfies readonly CaregiverLandingTool[]);

export const caregiverLandingContent = Object.freeze({
  id: "CG-LANDING",
  interactionIds: ["CG-LANDING-I01", "CG-LANDING-I02"] as const,
  hero: {
    eyebrow: "SUPPORT SOMEONE YOU CARE ABOUT",
    title: "Help without taking over.",
    explanation:
      "Diabetes can affect routines, conversations, plans, and the space between two people. This section helps you offer support that is useful, respectful, and easier to revise when needs change.",
    audience:
      "For partners, relatives, friends, roommates, chosen family, and anyone trying to help, whether or not you call yourself a caregiver.",
    primaryAction: "Find where to begin",
    secondaryAction: "Follow the five-part path",
  },
  safety: {
    linkLabel: "Something feels wrong right now",
    boundary:
      "Health Decoded cannot determine what is happening or whether someone is safe. If someone may be in immediate danger, stop here and use the person's clinician-created plan if it is immediately available. Contact emergency help using the reviewed information for your region. Do not delay help to finish this page.",
    regionalActionTemplate: "View emergency help for [REGION_DISPLAY_NAME]",
    missingRegion:
      "Local emergency details are not available in Health Decoded right now. Contact your local emergency service if someone may be in immediate danger, or contact an appropriate healthcare professional for urgent guidance. Do not use a guessed number or wait for this page to update.",
  },
  needRouter: {
    sectionTitle: "What brought you here?",
    introduction:
      "Choose the situation that is closest to what you need today. You can change direction at any time.",
    interactionTitle: "Find the closest starting point",
    prompt: "Which situation is closest to what brought you here today?",
    submit: "Show my starting point",
    clear: "Clear choice",
    revise: "Open another module instead",
  },
  guidedPath: {
    sectionTitle: "A guided path, when you want one",
    introduction:
      "The order moves from understanding to permission, daily support, safety, and sustainability. It is a recommendation, not a set of prerequisites.",
    interactionTitle: "Choose how to begin",
    prompt: "What would be most useful right now?",
    submit: "Use this path",
    revise: "Change choice",
  },
  tools: {
    sectionTitle: "Use a tool when a conversation or plan cannot wait",
    copy: "The practical tools are available without completing a module. Use one, leave it, or return later.",
    actionLabel: "View practical tools",
  },
  autonomy: {
    heading: "Their health information remains theirs.",
    copy: "The person living with diabetes stays in control of medical decisions and what they share. This section does not give you automatic access to private health information. It does not monitor glucose, medication, location, appointments, or whether someone follows a plan.",
  },
  firstVisit: {
    greeting: "You do not need to know the right label for your role.",
    copy: "Start with the situation that brought you here, or follow the recommended path from the beginning. No health information about the person you support is needed.",
    primaryAction: "Choose what brought me here",
    secondaryAction: "Start with Module 1",
  },
  returning: {
    greeting: "Continue from where you left off, or choose what is useful now.",
    recentModuleLabel: "Most recent",
    primaryActionTemplate: "Continue [MODULE_TITLE]",
    nextRecommendationLabel: "Next on the guided path",
    toolShortcutLabel: "Return to a recent tool",
    privateProgress:
      "Module progress is private to your account. It is not shared with the person you support, another supporter, or the AI Tutor. A completed label records participation, not expertise.",
  },
  source: caregiverLandingSource,
  renderingMode: "deterministic",
  runtimeGeneration: false,
} as const);

export const caregiverUrgentHelpContent = Object.freeze({
  heading: "Stop here and get urgent help.",
  productLimitation:
    "Health Decoded provides general education. It cannot diagnose symptoms, interpret a personal glucose reading, decide whether a situation is safe, or create treatment instructions.",
  doNotDelay:
    "Do not delay urgent or emergency help to check another reading, search this application, complete an interaction, sign in, or gather every detail.",
  sectionName: "Support Someone You Care About",
  renderingMode: "deterministic",
  runtimeGeneration: false,
} as const);
