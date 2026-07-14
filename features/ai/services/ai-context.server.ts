import "server-only";

import type { TrustedAiPromptContext } from "@/features/ai/prompts/prompt-builder";
import { getServerDatabaseClient } from "@/lib/database/server";

type ContextRequest = {
  readonly lessonId?: string | undefined;
  readonly medicationId?: string | undefined;
  readonly userId: string;
};

type ContextResult =
  { readonly ok: true; readonly data: TrustedAiPromptContext } | { readonly ok: false };

const medicationContentKeys = new Set([
  "body",
  "common_benefits",
  "common_side_effects",
  "heading",
  "how_it_works",
  "important_considerations",
  "key_takeaway",
  "questions_for_healthcare_team",
  "short_summary",
  "why_it_is_used",
]);

function collectMedicationText(value: unknown, parentKey?: string): string[] {
  if (typeof value === "string") {
    return parentKey && medicationContentKeys.has(parentKey) ? [value.trim()] : [];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item) => collectMedicationText(item, parentKey));
  }
  if (!value || typeof value !== "object") return [];

  return Object.entries(value).flatMap(([key, item]) =>
    medicationContentKeys.has(key) ? collectMedicationText(item, key) : [],
  );
}

function collectCaregiverText(value: unknown): string[] {
  if (typeof value === "string") return [value.trim()];
  if (Array.isArray(value)) return value.flatMap(collectCaregiverText);
  if (!value || typeof value !== "object") return [];

  return Object.values(value).flatMap(collectCaregiverText);
}

export async function loadTrustedAiContext({
  lessonId,
  medicationId,
  userId,
}: ContextRequest): Promise<ContextResult> {
  const database = await getServerDatabaseClient();
  const userJourneyResponse = await database
    .from("user_journeys")
    .select("id, journey_id, current_journey_lesson_id")
    .eq("user_id", userId)
    .is("completed_at", null)
    .order("last_active_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (userJourneyResponse.error) return { ok: false };

  const userJourney = userJourneyResponse.data;
  const [medicationResponse, journeyResponse, assignmentsResponse, progressResponse] =
    await Promise.all([
      medicationId
        ? database
            .from("medications")
            .select("generic_name, category, content_blocks")
            .eq("id", medicationId)
            .eq("status", "published")
            .maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      userJourney
        ? database
            .from("journeys")
            .select("title, duration_days")
            .eq("id", userJourney.journey_id)
            .eq("status", "published")
            .maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      userJourney
        ? database
            .from("journey_lessons")
            .select("id, day_number, display_order, lesson_id")
            .eq("journey_id", userJourney.journey_id)
            .eq("status", "published")
            .order("display_order")
        : Promise.resolve({ data: [], error: null }),
      userJourney
        ? database
            .from("lesson_progress")
            .select("journey_lesson_id, status")
            .eq("user_journey_id", userJourney.id)
        : Promise.resolve({ data: [], error: null }),
    ]);

  if (
    medicationResponse.error ||
    (medicationId && !medicationResponse.data) ||
    journeyResponse.error ||
    assignmentsResponse.error ||
    progressResponse.error ||
    (userJourney && !journeyResponse.data)
  ) {
    return { ok: false };
  }

  const assignments = assignmentsResponse.data;
  const progressByLesson = new Map(
    progressResponse.data.map((progress) => [progress.journey_lesson_id, progress.status]),
  );
  const currentAssignment = lessonId
    ? assignments.find((assignment) => assignment.lesson_id === lessonId)
    : (assignments.find((assignment) => assignment.id === userJourney?.current_journey_lesson_id) ??
      assignments.find((assignment) => progressByLesson.get(assignment.id) !== "completed"));

  if (lessonId && !currentAssignment) return { ok: false };

  const [lessonResponse, activityResponse, caregiverResponse] = await Promise.all([
    currentAssignment
      ? database
          .from("lessons")
          .select("title, learning_objective, key_takeaway, subtitle")
          .eq("id", currentAssignment.lesson_id)
          .eq("status", "published")
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    currentAssignment
      ? database
          .from("activities")
          .select("title, instructions")
          .eq("lesson_id", currentAssignment.lesson_id)
          .eq("status", "published")
          .order("display_order")
          .limit(1)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    currentAssignment
      ? database
          .from("caregiver_content")
          .select("title, support_tip, conversation_prompt, content_blocks")
          .eq("journey_lesson_id", currentAssignment.id)
          .eq("status", "published")
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  if (lessonResponse.error || activityResponse.error || caregiverResponse.error) {
    return { ok: false };
  }

  const medication = medicationResponse.data;
  const caregiver = caregiverResponse.data;
  const completedLessons = progressResponse.data.filter(
    (progress) => progress.status === "completed",
  ).length;

  return {
    ok: true,
    data: {
      ...(journeyResponse.data && currentAssignment
        ? {
            journey: {
              currentDay: currentAssignment.day_number,
              title: journeyResponse.data.title,
              totalDays: journeyResponse.data.duration_days,
            },
            progress: {
              completedLessons,
              totalLessons: assignments.length,
            },
          }
        : {}),
      ...(lessonResponse.data
        ? {
            lesson: {
              objective: lessonResponse.data.learning_objective,
              summary:
                lessonResponse.data.key_takeaway ??
                lessonResponse.data.subtitle ??
                lessonResponse.data.learning_objective,
              title: lessonResponse.data.title,
            },
          }
        : {}),
      ...(activityResponse.data
        ? {
            activity: {
              instructions: activityResponse.data.instructions,
              title: activityResponse.data.title,
            },
          }
        : {}),
      ...(medication
        ? {
            medication: {
              category: medication.category,
              educationalContent: collectMedicationText(medication.content_blocks)
                .filter(Boolean)
                .join(" ")
                .slice(0, 6_000),
              name: medication.generic_name,
            },
          }
        : {}),
      ...(caregiver
        ? {
            caregiver: {
              content: collectCaregiverText(caregiver.content_blocks)
                .filter(Boolean)
                .join(" ")
                .slice(0, 2_000),
              conversationPrompt: caregiver.conversation_prompt,
              supportTip: caregiver.support_tip,
              title: caregiver.title,
            },
          }
        : {}),
    },
  };
}
