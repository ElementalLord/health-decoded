"use server";

import { redirect } from "next/navigation";

import { onboardingSchema } from "@/features/onboarding/schemas/onboarding.schema";
import { completeOnboarding } from "@/features/onboarding/services/onboarding.server";
import type { OnboardingFormState } from "@/features/onboarding/types/onboarding";

const recommendedDestination = {
  "recently-diagnosed": "/lessons/1",
  "learn-basics": "/journey",
  "support-someone": "/caregiver",
  "prepare-appointment": "/appointment-prep",
} as const;

export async function completeOnboardingAction(
  _: OnboardingFormState,
  formData: FormData,
): Promise<OnboardingFormState> {
  const parsed = onboardingSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success)
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Check your setup and try again.",
    };
  const result = await completeOnboarding(parsed.data);
  if (!result.ok && result.error.code === "authorization")
    return {
      status: "auth",
      message: "Your session ended. Sign in again to continue. Your starting choice is still here.",
    };
  if (!result.ok)
    return {
      status: "error",
      message: "We couldn't finish setting this up right now. Try again.",
    };
  const destination =
    parsed.data.completionTarget === "recommended" && parsed.data.onboardingIntent
      ? recommendedDestination[parsed.data.onboardingIntent]
      : "/journey?welcome=1";
  redirect(destination);
}
