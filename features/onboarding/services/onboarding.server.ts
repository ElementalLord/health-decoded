import { getAuthenticatedUser } from "@/features/auth/services/auth.server";
import { getServerDatabaseClient } from "@/lib/database/server";
import { unexpectedError } from "@/lib/errors/application-error";
import { createServerLogger } from "@/lib/logging/server";
import { err, ok, type Result } from "@/lib/result/result";

type OnboardingValues = {
  displayName: string;
  locale: "en";
  preferredTextScale: "default" | "large";
  reducedMotion: boolean;
  timezone: string;
};

const logger = createServerLogger();

export async function completeOnboarding(values: OnboardingValues): Promise<Result<true>> {
  const user = await getAuthenticatedUser();
  if (!user.ok) return err(user.error);

  const database = await getServerDatabaseClient();
  const result = await database.rpc("complete_onboarding", {
    p_display_name: values.displayName,
    p_locale: values.locale,
    p_preferred_text_scale: values.preferredTextScale,
    p_reduced_motion: values.reducedMotion,
    p_timezone: values.timezone,
  });
  if (result.error || result.data !== true) {
    logger.error("onboarding.completion_failed", {
      error_code: result.error?.code ?? "invalid_result",
    });
    return err(unexpectedError());
  }

  return ok(true);
}
