"use server";

import { revalidatePath } from "next/cache";

import { getAuthenticatedUser } from "@/features/auth/services/auth.server";
import { confidenceCheckInSchema } from "@/features/journeys/schemas/confidence.schema";
import type { ConfidenceLevel } from "@/features/journeys/types/journey-home";
import { getServerDatabaseClient } from "@/lib/database/server";
import { createServerLogger } from "@/lib/logging/server";

const logger = createServerLogger();

export type ConfidenceActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
  savedValue: ConfidenceLevel | null;
};

export async function saveConfidenceCheckInAction(
  previousState: ConfidenceActionState,
  formData: FormData,
): Promise<ConfidenceActionState> {
  const parsed = confidenceCheckInSchema.safeParse({
    lessonProgressId: formData.get("lessonProgressId"),
    confidenceLevel: formData.get("confidenceLevel"),
  });

  if (!parsed.success) {
    return {
      ...previousState,
      status: "error",
      message: "Choose the option that feels closest today.",
    };
  }

  const user = await getAuthenticatedUser();
  if (!user.ok) {
    return {
      ...previousState,
      status: "error",
      message: "Please sign in again before saving your check-in.",
    };
  }

  const database = await getServerDatabaseClient();
  const response = await database.rpc("upsert_confidence_check_in", {
    p_lesson_progress_id: parsed.data.lessonProgressId,
    p_confidence_level: parsed.data.confidenceLevel,
  });
  const saved = response.data?.[0];

  if (response.error || !saved) {
    logger.error("journey_home.confidence_save_failed");
    return {
      ...previousState,
      status: "error",
      message: "We could not save your check-in right now. Please try again.",
    };
  }

  const savedConfidence = confidenceCheckInSchema.shape.confidenceLevel.safeParse(
    saved.saved_confidence_level,
  );
  if (!savedConfidence.success) {
    logger.error("journey_home.confidence_invalid_result");
    return {
      ...previousState,
      status: "error",
      message: "We could not save your check-in right now. Please try again.",
    };
  }

  revalidatePath("/journey");

  return {
    status: "success",
    message: "Thank you for checking in. There is no right answer, and this can change any day.",
    savedValue: savedConfidence.data,
  };
}
