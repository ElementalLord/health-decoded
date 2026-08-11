import { getAuthenticatedUser } from "@/features/auth/services/auth.server";
import { getServerDatabaseClient } from "@/lib/database/server";
import { unexpectedError } from "@/lib/errors/application-error";
import { createServerLogger } from "@/lib/logging/server";
import { err, ok, type Result } from "@/lib/result/result";
import type { OnboardingIntent } from "@/features/onboarding/types/onboarding";

type OnboardingValues = {
  onboardingIntent: OnboardingIntent | null;
};

const logger = createServerLogger();

export async function completeOnboarding(values: OnboardingValues): Promise<Result<true>> {
  const user = await getAuthenticatedUser();
  if (!user.ok) return err(user.error);

  const database = await getServerDatabaseClient();
  const result = await database.rpc("complete_onboarding", {
    p_onboarding_intent: values.onboardingIntent,
  });
  if (result.error || result.data !== true) {
    logger.error("onboarding.completion_failed", {
      error_code: result.error?.code ?? "invalid_result",
    });
    return err(unexpectedError());
  }

  return ok(true);
}
