import "server-only";

import { unstable_noStore as noStore } from "next/cache";

import { getAuthenticatedUser } from "@/features/auth/services/auth.server";
import type {
  ProfileReflection,
  ProfileReflectionArchive,
} from "@/features/profile/types/profile-reflection";
import { unexpectedError } from "@/lib/errors/application-error";
import { getServerDatabaseClient } from "@/lib/database/server";
import { createServerLogger } from "@/lib/logging/server";
import { err, ok, type Result } from "@/lib/result/result";

const logger = createServerLogger();

export async function getProfileReflections(): Promise<Result<ProfileReflectionArchive>> {
  noStore();

  const user = await getAuthenticatedUser();
  if (!user.ok) return err(user.error);

  const database = await getServerDatabaseClient();
  const journeys = await database.from("user_journeys").select("id").eq("user_id", user.data.id);

  if (journeys.error) {
    logger.error("profile_reflections.journeys_unavailable", {
      error_code: journeys.error.code,
    });
    return err(unexpectedError());
  }

  const journeyIds = journeys.data.map((journey) => journey.id);
  if (journeyIds.length === 0) return ok({ entries: [], total: 0 });

  const progress = await database
    .from("lesson_progress")
    .select("id, journey_lesson_id")
    .in("user_journey_id", journeyIds);

  if (progress.error) {
    logger.error("profile_reflections.progress_unavailable", {
      error_code: progress.error.code,
    });
    return err(unexpectedError());
  }

  const progressIds = progress.data.map((entry) => entry.id);
  if (progressIds.length === 0) return ok({ entries: [], total: 0 });

  const reflections = await database
    .from("reflection_entries")
    .select("id, lesson_progress_id, reflection, created_at", { count: "exact" })
    .in("lesson_progress_id", progressIds)
    .order("updated_at", { ascending: false })
    .limit(4);

  if (reflections.error) {
    logger.error("profile_reflections.entries_unavailable", {
      error_code: reflections.error.code,
    });
    return err(unexpectedError());
  }

  if (reflections.data.length === 0) {
    return ok({ entries: [], total: reflections.count ?? 0 });
  }

  const progressById = new Map(
    progress.data.map((entry) => [entry.id, entry.journey_lesson_id] as const),
  );
  const assignmentIds = [
    ...new Set(
      reflections.data.flatMap((reflection) => {
        const assignmentId = progressById.get(reflection.lesson_progress_id);
        return assignmentId ? [assignmentId] : [];
      }),
    ),
  ];

  const assignments = await database
    .from("journey_lessons")
    .select("id, day_number, lessons!inner(title)")
    .in("id", assignmentIds);

  if (assignments.error) {
    logger.error("profile_reflections.lessons_unavailable", {
      error_code: assignments.error.code,
    });
    return err(unexpectedError());
  }

  const assignmentById = new Map(
    assignments.data.map((assignment) => [
      assignment.id,
      {
        dayNumber: assignment.day_number,
        lessonTitle: assignment.lessons.title,
      },
    ]),
  );

  const entries = reflections.data.flatMap<ProfileReflection>((reflection) => {
    const assignmentId = progressById.get(reflection.lesson_progress_id);
    const assignment = assignmentId ? assignmentById.get(assignmentId) : undefined;
    if (!assignment) return [];

    return [
      {
        createdAt: reflection.created_at,
        dayNumber: assignment.dayNumber,
        id: reflection.id,
        lessonTitle: assignment.lessonTitle,
        reflection: reflection.reflection,
      },
    ];
  });

  return ok({ entries, total: reflections.count ?? entries.length });
}
