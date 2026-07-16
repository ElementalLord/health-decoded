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

const logger = createServerLogger();

export const getProfileSettings = cache(async function getProfileSettings(): Promise<
  Result<ProfileSettings>
> {
  noStore();
  const user = await getAuthenticatedUser();
  if (!user.ok) return err(user.error);
  if (!user.data.email) {
    logger.error("profile_settings.auth_email_missing");
    return err(unexpectedError());
  }

  const database = await getServerDatabaseClient();
  const [profileResult, settingsResult] = await Promise.all([
    getCurrentProfile(),
    database
      .from("user_settings")
      .select("reduced_motion, preferred_text_scale, locale, timezone")
      .eq("user_id", user.data.id)
      .maybeSingle(),
  ]);

  if (!profileResult.ok) return err(profileResult.error);
  if (settingsResult.error) {
    logger.error("profile_settings.load_failed", { error_code: settingsResult.error.code });
    return err(unexpectedError());
  }
  if (!settingsResult.data) {
    logger.error("profile_settings.missing_for_authenticated_user");
    return err(unexpectedError());
  }

  const settings = settingsResult.data;
  return ok({
    displayName: profileResult.data.display_name ?? "",
    email: user.data.email,
    onboardingComplete: Boolean(profileResult.data.onboarding_completed_at),
    reducedMotion: settings.reduced_motion,
    preferredTextScale: settings.preferred_text_scale as ProfileSettings["preferredTextScale"],
    locale: "en",
    timezone: settings.timezone ?? "UTC",
  });
});
