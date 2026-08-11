export type OnboardingFormState = { message: string | null; status: "error" | "idle" };

export const initialOnboardingFormState: OnboardingFormState = { message: null, status: "idle" };

export const onboardingIntents = [
  "recently-diagnosed",
  "learn-basics",
  "support-someone",
  "prepare-appointment",
] as const;

export type OnboardingIntent = (typeof onboardingIntents)[number];
export type OnboardingMode = "first-use" | "preview";
