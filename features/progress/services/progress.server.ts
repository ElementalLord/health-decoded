import "server-only";

import { unstable_noStore as noStore } from "next/cache";

import { mapProgress } from "@/features/progress/mappers/progress.mapper";
import type { ProgressViewModel } from "@/features/progress/types/progress";
import { unexpectedError } from "@/lib/errors/application-error";
import { getServerDatabaseClient } from "@/lib/database/server";
import { createServerLogger } from "@/lib/logging/server";
import { err, ok, type Result } from "@/lib/result/result";

const logger = createServerLogger();

export async function getProgressData(): Promise<Result<ProgressViewModel>> {
  noStore();

  const database = await getServerDatabaseClient();
  const initialization = await database.rpc("initialize_current_user_journey");
  const initialized = initialization.data?.[0];

  if (initialization.error || !initialized) {
    logger.error("progress.initialization_failed");
    return err(unexpectedError());
  }

  const userJourneyResponse = await database
    .from("user_journeys")
    .select("id, journey_id, current_journey_lesson_id, completed_at")
    .eq("id", initialized.initialized_user_journey_id)
    .maybeSingle();
  const userJourney = userJourneyResponse.data;

  if (userJourneyResponse.error || !userJourney) {
    logger.error("progress.user_journey_unavailable");
    return err(unexpectedError());
  }

  const [journeyResponse, assignmentsResponse, progressResponse] = await Promise.all([
    database
      .from("journeys")
      .select("title")
      .eq("id", userJourney.journey_id)
      .eq("status", "published")
      .maybeSingle(),
    database
      .from("journey_lessons")
      .select("id, day_number, display_order, lessons!inner(title)")
      .eq("journey_id", userJourney.journey_id)
      .eq("status", "published")
      .eq("lessons.status", "published")
      .order("display_order", { ascending: true }),
    database
      .from("lesson_progress")
      .select("id, journey_lesson_id, status, completed_at, xp_awarded")
      .eq("user_journey_id", userJourney.id),
  ]);
  const journey = journeyResponse.data;
  const assignments = assignmentsResponse.data;
  const progressRows = progressResponse.data;

  if (
    journeyResponse.error ||
    assignmentsResponse.error ||
    progressResponse.error ||
    !journey ||
    !assignments ||
    !progressRows
  ) {
    logger.error("progress.data_unavailable");
    return err(unexpectedError());
  }

  const progressIds = progressRows.map((progress) => progress.id);
  const confidenceResponse = progressIds.length
    ? await database
        .from("confidence_check_ins")
        .select("lesson_progress_id, confidence_level, created_at")
        .in("lesson_progress_id", progressIds)
    : { data: [], error: null };
  const confidenceRows = confidenceResponse.data;

  if (confidenceResponse.error || !confidenceRows) {
    logger.error("progress.confidence_unavailable");
    return err(unexpectedError());
  }

  const viewModel = mapProgress({
    assignments,
    completedAt: userJourney.completed_at,
    confidenceRows,
    currentJourneyLessonId: userJourney.current_journey_lesson_id,
    journeyTitle: journey.title,
    progressRows,
  });

  if (!viewModel) {
    logger.error("progress.invalid_state");
    return err(unexpectedError());
  }

  return ok(viewModel);
}
