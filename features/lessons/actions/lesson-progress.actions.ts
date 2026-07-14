"use server";

import { getAuthenticatedUser } from "@/features/auth/services/auth.server";
import { lessonPositionSchema } from "@/features/lessons/schemas/lesson-progress.schema";
import { getServerDatabaseClient } from "@/lib/database/server";
import { createServerLogger } from "@/lib/logging/server";

const logger = createServerLogger();

export type SaveLessonPositionResult = { ok: true } | { ok: false; message: string };

export async function saveLessonPositionAction(input: unknown): Promise<SaveLessonPositionResult> {
  const parsed = lessonPositionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Your place could not be saved right now." };
  }

  const user = await getAuthenticatedUser();
  if (!user.ok) {
    return { ok: false, message: "Your place could not be saved right now." };
  }

  const database = await getServerDatabaseClient();
  const response = await database.rpc("save_lesson_block_position", {
    p_block_index: parsed.data.blockIndex,
    p_lesson_progress_id: parsed.data.lessonProgressId,
  });
  const saved = response.data?.[0];

  if (response.error || !saved || saved.saved_last_viewed_block !== parsed.data.blockIndex) {
    logger.error("lesson_reader.position_save_failed");
    return { ok: false, message: "Your place could not be saved right now." };
  }

  return { ok: true };
}
