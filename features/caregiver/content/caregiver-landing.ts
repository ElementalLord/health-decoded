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
}

export const caregiverLandingRoutes = Object.freeze([
  {
    id: "CG-M1",
    order: 1,
    title: "I want to understand what they may be feeling",
    moduleTitle: "What They May Be Feeling",
    description:
      "Slow down the urge to explain a reaction and practice asking what support, if any, is wanted.",
    action: "Open lesson",
    purpose: "Meet reactions with curiosity, not assumptions.",
    time: "8–10 min",
    feedback:
      "Start with noticing what happened without deciding what it means. This route practices curiosity, timing, and listening.",
  },
  {
    id: "CG-M2",
    order: 2,
    title: "I am unsure how to help without overstepping",
    moduleTitle: "Support Without Taking Over",
    description: "Separate support from pressure, monitoring, and assumed access.",
    action: "Open lesson",
    purpose: "Offer help with permission, not pressure.",
    time: "14–18 min",
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
    action: "Open lesson",
    purpose: "Make everyday support specific and welcome.",
    time: "10–13 min",
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
    action: "Open lesson",
    purpose: "Follow the plan and know when to get professional help.",
    time: "10–12 min",
    feedback:
      "Start with role clarity. This lesson helps you separate observation from interpretation and choose an appropriate source of support.",
  },
  {
    id: "CG-M5",
    order: 5,
    title: "I am feeling stretched thin",
    moduleTitle: "The Caregiver Matters Too",
    description:
      "Notice what is becoming hard to sustain and make room for limits and backup support.",
    action: "Open lesson",
    purpose: "Set limits and build support you can sustain.",
    time: "10–13 min",
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
    explanation: "Offer support that feels useful, respectful, and easy to revise.",
    audience: "For anyone supporting someone with diabetes, regardless of what you call your role.",
    primaryAction: "Find where to begin",
    secondaryAction: "Follow the five-part path",
  },
  safety: {
    linkLabel: "Something feels wrong right now",
    boundary:
      "Health Decoded provides general education and cannot assess a current situation. Use an established plan and appropriate local help when urgent action is needed.",
    regionalActionTemplate: "View emergency help for [REGION_DISPLAY_NAME]",
    missingRegion:
      "Local emergency details are not available in Health Decoded right now. Use an appropriate local emergency service or healthcare professional for urgent guidance. Do not use a guessed number or wait for this page to update.",
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
    introduction: "Start anywhere and move at your own pace.",
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
