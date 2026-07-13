import "server-only";
import { unstable_noStore as noStore } from "next/cache";
import { getAuthenticatedUser } from "@/features/auth/services/auth.server";
import type { ProfileSettings } from "@/features/profile/types/profile-settings";
import { getServerDatabaseClient } from "@/lib/database/server";
import { err, ok, type Result } from "@/lib/result/result";
import { unexpectedError } from "@/lib/errors/application-error";

const defaults = { reduced_motion: false, preferred_text_scale: "default", locale: "en", timezone: "UTC" } as const;

export async function getProfileSettings(): Promise<Result<ProfileSettings>> {
  noStore(); const user = await getAuthenticatedUser(); if (!user.ok || !user.data.email) return err(user.ok ? unexpectedError() : user.error);
  const database = await getServerDatabaseClient();
  const [profileResult, settingsResult] = await Promise.all([database.from("profiles").select("display_name, onboarding_completed_at").eq("id", user.data.id).maybeSingle(), database.from("user_settings").select("reduced_motion, preferred_text_scale, locale, timezone").eq("user_id", user.data.id).maybeSingle()]);
  if (profileResult.error || !profileResult.data || settingsResult.error) return err(unexpectedError());
  let settings = settingsResult.data;
  if (!settings) { const created = await database.from("user_settings").upsert({ user_id: user.data.id, ...defaults }).select("reduced_motion, preferred_text_scale, locale, timezone").maybeSingle(); if (created.error || !created.data) return err(unexpectedError()); settings = created.data; }
  return ok({ displayName: profileResult.data.display_name ?? "", email: user.data.email, onboardingComplete: Boolean(profileResult.data.onboarding_completed_at), reducedMotion: settings.reduced_motion, preferredTextScale: settings.preferred_text_scale as ProfileSettings["preferredTextScale"], locale: "en", timezone: settings.timezone ?? "UTC" });
}
