"use server";

import { revalidatePath } from "next/cache";

import { getAuthenticatedUser } from "@/features/auth/services/auth.server";
import { lessonCompletionSchema } from "@/features/lessons/schemas/lesson-completion.schema";
import { completeLesson } from "@/features/lessons/services/lesson-completion.server";
import type { LessonCompletionResult } from "@/features/lessons/types/lesson-completion";
import { getServerDatabaseClient } from "@/lib/database/server";
import { createServerLogger } from "@/lib/logging/server";

export type CompleteLessonActionResult =
  { ok: true; data: LessonCompletionResult } | { ok: false; message: string };

const logger = createServerLogger();

export async function completeLessonAction(input: unknown): Promise<CompleteLessonActionResult> {
  const parsed = lessonCompletionSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: "We could not save your lesson completion right now. Please try again.",
    };
  }

  const user = await getAuthenticatedUser();
  if (!user.ok) {
    return {
      ok: false,
      message: "We could not save your lesson completion right now. Please try again.",
    };
  }

  if (parsed.data.reflection) {
    const database = await getServerDatabaseClient();
    const existing = await database
      .from("reflection_entries")
      .select("id")
      .eq("lesson_progress_id", parsed.data.lessonProgressId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existing.error) {
      logger.error("lesson_reflection.lookup_failed", { error_code: existing.error.code });
      return {
        ok: false,
        message: "We could not save your reflection to your profile right now. Please try again.",
      };
    }

    const saved = existing.data
      ? await database
          .from("reflection_entries")
          .update({ reflection: parsed.data.reflection })
          .eq("id", existing.data.id)
          .select("id")
          .maybeSingle()
      : await database
          .from("reflection_entries")
          .insert({
            lesson_progress_id: parsed.data.lessonProgressId,
            reflection: parsed.data.reflection,
          })
          .select("id")
          .maybeSingle();

    if (saved.error || !saved.data) {
      logger.error("lesson_reflection.save_failed", {
        error_code: saved.error?.code ?? "missing_reflection",
      });
      return {
        ok: false,
        message: "We could not save your reflection to your profile right now. Please try again.",
      };
    }
  }

  const completed = await completeLesson(parsed.data.lessonProgressId);
  if (!completed.ok) {
    return {
      ok: false,
      message:
        completed.error === "requirements_incomplete"
          ? "A required lesson step is still unfinished. Return to the highlighted step and complete it before continuing."
          : "We could not save your lesson completion right now. Please try again.",
    };
  }

  revalidatePath("/journey");
  revalidatePath("/profile");
  return { ok: true, data: completed.data };
}
