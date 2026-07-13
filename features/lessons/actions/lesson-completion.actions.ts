"use server";

import { revalidatePath } from "next/cache";

import { getAuthenticatedUser } from "@/features/auth/services/auth.server";
import { lessonCompletionSchema } from "@/features/lessons/schemas/lesson-completion.schema";
import { completeLesson } from "@/features/lessons/services/lesson-completion.server";
import type { LessonCompletionResult } from "@/features/lessons/types/lesson-completion";

export type CompleteLessonActionResult =
  { ok: true; data: LessonCompletionResult } | { ok: false; message: string };

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

  const completed = await completeLesson(parsed.data.lessonProgressId);
  if (!completed.ok) {
    return {
      ok: false,
      message:
        completed.error === "requirements_incomplete"
          ? "There is still one step to finish before completing this lesson."
          : "We could not save your lesson completion right now. Please try again.",
    };
  }

  revalidatePath("/journey");
  return { ok: true, data: completed.data };
}
