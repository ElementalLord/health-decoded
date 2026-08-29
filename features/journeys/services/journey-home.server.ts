import "server-only";

import { mapJourneyHome } from "@/features/journeys/mappers/journey-home.mapper";
import type { JourneyHomeViewModel } from "@/features/journeys/types/journey-home";
import { unexpectedError } from "@/lib/errors/application-error";
import { getServerDatabaseClient } from "@/lib/database/server";
import { createServerLogger } from "@/lib/logging/server";
import { err, ok, type Result } from "@/lib/result/result";

const logger = createServerLogger();

export async function getJourneyHomeData(): Promise<Result<JourneyHomeViewModel>> {
  const database = await getServerDatabaseClient();
  const initialization = await database.rpc("initialize_current_user_journey");
  const initialized = initialization.data?.[0];

  if (initialization.error || !initialized) {
    logger.error("journey_home.initialization_failed");
    return err(unexpectedError());
  }

  const userJourneyResponse = await database
    .from("user_journeys")
    .select("id, journey_id, completed_at")
    .eq("id", initialized.initialized_user_journey_id)
    .maybeSingle();
  const userJourney = userJourneyResponse.data;

  if (userJourneyResponse.error || !userJourney) {
    logger.error("journey_home.user_journey_unavailable");
    return err(unexpectedError());
  }

  const [journeyResponse, assignmentsResponse, progressResponse] = await Promise.all([
    database
      .from("journeys")
      .select("id, title")
      .eq("id", userJourney.journey_id)
      .eq("status", "published")
      .maybeSingle(),
    database
      .from("journey_lessons")
      .select(
        "id, day_number, display_order, lessons!inner(id, title, subtitle, learning_objective, estimated_minutes)",
      )
      .eq("journey_id", userJourney.journey_id)
      .eq("status", "published")
      .eq("lessons.status", "published")
      .order("display_order", { ascending: true }),
    database
      .from("lesson_progress")
      .select("id, journey_lesson_id, status")
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
    logger.error("journey_home.data_unavailable");
    return err(unexpectedError());
  }

  const viewModel = mapJourneyHome({
    assignments,
    completedAt: userJourney.completed_at,
    journeyTitle: journey.title,
    progressRows,
  });

  if (!viewModel) {
    logger.error("journey_home.published_lesson_unavailable");
    return err(unexpectedError());
  }

  return ok(viewModel);
}
