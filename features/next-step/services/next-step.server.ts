import "server-only";

import { getAuthenticatedUser } from "@/features/auth/services/auth.server";
import type { JourneyHomeViewModel } from "@/features/journeys/types/journey-home";
import { recommendNextStep } from "@/features/next-step/lib/recommend-next-step";
import type { NextStepSelection } from "@/features/next-step/types/next-step";
import { getServerDatabaseClient } from "@/lib/database/server";
import { unexpectedError } from "@/lib/errors/application-error";
import { err, ok, type Result } from "@/lib/result/result";

export async function getNextStep(
  journey: JourneyHomeViewModel,
): Promise<Result<NextStepSelection>> {
  const user = await getAuthenticatedUser();
  if (!user.ok) return err(user.error);
  const database = await getServerDatabaseClient();
  const [milestones, preference, settings] = await Promise.all([
    database.from("user_milestones").select("milestone_id").eq("user_id", user.data.id),
    database
      .from("user_next_step_preferences")
      .select("last_rule_id, last_action_date")
      .eq("user_id", user.data.id)
      .maybeSingle(),
    database.from("user_settings").select("timezone").eq("user_id", user.data.id).maybeSingle(),
  ]);
  if (milestones.error || preference.error || settings.error) return err(unexpectedError());
  const timezone = settings.data?.timezone ?? "UTC";
  let today: string;
  try {
    today = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  } catch {
    today = new Date().toISOString().slice(0, 10);
  }
  return ok(
    recommendNextStep({
      completedLessonCount: journey.progress.completedLessons,
      currentLesson:
        journey.kind === "ready"
          ? {
              dayNumber: journey.currentLesson.dayNumber,
              estimatedMinutes: journey.currentLesson.estimatedMinutes,
              status:
                journey.currentLesson.status === "in_progress" ? "in_progress" : "not_started",
              title: journey.currentLesson.title,
            }
          : null,
      earnedMilestoneIds: new Set(milestones.data?.map((row) => row.milestone_id) ?? []),
      lastDismissed:
        preference.data?.last_rule_id && preference.data.last_action_date
          ? { id: preference.data.last_rule_id, date: preference.data.last_action_date }
          : null,
      today,
    }),
  );
}
