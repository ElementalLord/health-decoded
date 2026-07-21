"use server";

import { redirect } from "next/navigation";

import { onboardingSchema } from "@/features/onboarding/schemas/onboarding.schema";
import { completeOnboarding } from "@/features/onboarding/services/onboarding.server";
import type { OnboardingFormState } from "@/features/onboarding/types/onboarding";

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
  if (!result.ok)
    return {
      status: "error",
      message: "We could not save your setup right now. Please try again.",
    };
  redirect("/journey?welcome=1");
}
