"use server";

import { getAuthenticatedUser } from "@/features/auth/services/auth.server";
import { browserTimezoneSchema } from "@/features/profile/schemas/profile-settings.schema";
import { resolveLearningTimezone } from "@/features/streaks/lib/learning-timezone";
import { getServerDatabaseClient } from "@/lib/database/server";
import { settleOptional } from "@/lib/reliability/dependency-boundary";

export async function acknowledgeLearningStreakNoticeAction() {
  const user = await getAuthenticatedUser();
  if (!user.ok) return;
  await settleOptional(async () => {
    const database = await getServerDatabaseClient();
    await database.rpc("acknowledge_learning_streak_notice");
  }, undefined);
}

export async function captureBrowserTimezoneAction(input: unknown) {
  const parsed = browserTimezoneSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const };
  const user = await getAuthenticatedUser();
  if (!user.ok) return { ok: false as const };
  const database = await settleOptional(getServerDatabaseClient, null);
  if (!database) return { ok: false as const };
  const current = await settleOptional(
    () =>
      database.from("user_settings").select("timezone").eq("user_id", user.data.id).maybeSingle(),
    null,
  );
  if (!current) return { ok: false as const };
  if (current.error || !current.data) return { ok: false as const };
  const resolved = resolveLearningTimezone(current.data.timezone, parsed.data);
  if (resolved === current.data.timezone) return { ok: true as const };
  const updated = await settleOptional(
    () =>
      database
        .from("user_settings")
        .update({ timezone: resolved })
        .eq("user_id", user.data.id)
        .select("user_id")
        .maybeSingle(),
    null,
  );
  return { ok: Boolean(updated && !updated.error && updated.data) } as const;
}
