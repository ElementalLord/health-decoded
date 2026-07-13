import { getAuthenticatedUser } from "@/features/auth/services/auth.server";
import { err, ok, type Result } from "@/lib/result/result";
import { unexpectedError } from "@/lib/errors/application-error";
import { getServerDatabaseClient } from "@/lib/database/server";

type OnboardingValues = { displayName: string; locale: "en"; preferredTextScale: "default" | "large"; reducedMotion: boolean; timezone: string };

export async function completeOnboarding(values: OnboardingValues): Promise<Result<true>> {
  const user = await getAuthenticatedUser();
  if (!user.ok) return err(user.error);

  const database = await getServerDatabaseClient();
  const settings = await database.from("user_settings").upsert({
    user_id: user.data.id,
    reduced_motion: values.reducedMotion,
    preferred_text_scale: values.preferredTextScale,
    locale: values.locale,
    timezone: values.timezone,
  });
  if (settings.error) return err(unexpectedError());

  const profile = await database
    .from("profiles")
    .update({ display_name: values.displayName, onboarding_completed_at: new Date().toISOString() })
    .eq("id", user.data.id)
    .select("id")
    .maybeSingle();

  return profile.error || !profile.data ? err(unexpectedError()) : ok(true);
}
