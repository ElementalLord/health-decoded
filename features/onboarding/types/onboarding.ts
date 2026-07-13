export type OnboardingFormState = { message: string | null; status: "error" | "idle" };

export const initialOnboardingFormState: OnboardingFormState = { message: null, status: "idle" };
