import "server-only";
import { unstable_noStore as noStore } from "next/cache";
import { cache } from "react";

import { getAuthenticatedUser } from "@/features/auth/services/auth.server";
import { getCurrentProfile } from "@/features/profile/services/profile.server";
import type { ProfileSettings } from "@/features/profile/types/profile-settings";
import { unexpectedError } from "@/lib/errors/application-error";
import { getServerDatabaseClient } from "@/lib/database/server";
import { createServerLogger } from "@/lib/logging/server";
import { err, ok, type Result } from "@/lib/result/result";
import { settleResult } from "@/lib/reliability/dependency-boundary";

const logger = createServerLogger();

type CompatibleSettingsRow = {
  learning_pace?: string;
  lesson_reminders?: boolean;
  locale: string;
  preferred_text_scale: string;
  reduced_motion: boolean;
  timezone: string | null;
};

function isPendingLearningPreferencesMigration(code: string | undefined) {
  return code === "42703" || code === "PGRST204";
}

export const getProfileSettings = cache(async function getProfileSettings(): Promise<
  Result<ProfileSettings>
> {
  return settleResult(
    async () => {
      noStore();
      const user = await getAuthenticatedUser();
      if (!user.ok) return err(user.error);
      if (!user.data.email) {
        logger.error("profile_settings.auth_email_missing");
        return err(unexpectedError());
      }

      const database = await getServerDatabaseClient();
      const [profileResult, currentSettingsResult] = await Promise.all([
        getCurrentProfile(),
        database
          .from("user_settings")
          .select(
            "reduced_motion, preferred_text_scale, locale, timezone, lesson_reminders, learning_pace",
          )
          .eq("user_id", user.data.id)
          .maybeSingle(),
      ]);

      if (!profileResult.ok) return err(profileResult.error);
      let settings: CompatibleSettingsRow | null = currentSettingsResult.data;

      if (isPendingLearningPreferencesMigration(currentSettingsResult.error?.code)) {
        const legacySettingsResult = await database
          .from("user_settings")
          .select("reduced_motion, preferred_text_scale, locale, timezone")
          .eq("user_id", user.data.id)
          .maybeSingle();

        if (legacySettingsResult.error) {
          logger.error("profile_settings.load_failed", {
            error_code: legacySettingsResult.error.code,
          });
          return err(unexpectedError());
        }
        settings = legacySettingsResult.data;
        logger.info("profile_settings.learning_preferences_migration_pending");
      } else if (currentSettingsResult.error) {
        logger.error("profile_settings.load_failed", {
          error_code: currentSettingsResult.error.code,
        });
        return err(unexpectedError());
      }

      if (!settings) {
        logger.error("profile_settings.missing_for_authenticated_user");
        return err(unexpectedError());
      }

      return ok({
        displayName: profileResult.data.display_name ?? "",
        email: user.data.email,
        learningPace: (settings.learning_pace ?? "normal") as ProfileSettings["learningPace"],
        lessonReminders: settings.lesson_reminders ?? true,
        onboardingComplete: Boolean(profileResult.data.onboarding_completed_at),
        reducedMotion: settings.reduced_motion,
        preferredTextScale: settings.preferred_text_scale as ProfileSettings["preferredTextScale"],
        locale: "en",
        timezone: settings.timezone ?? "UTC",
      });
    },
    unexpectedError(),
    () => logger.error("profile_settings.load_rejected"),
  );
});
