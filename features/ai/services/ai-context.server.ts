import "server-only";

import type { TrustedAiPromptContext } from "@/features/ai/prompts/prompt-builder";
import { getServerDatabaseClient } from "@/lib/database/server";

type ContextRequest = {
  readonly lessonId?: string | undefined;
  readonly medicationId?: string | undefined;
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

export async function loadTrustedAiContext({
  lessonId,
  medicationId,
}: ContextRequest): Promise<ContextResult> {
  if (!lessonId && !medicationId) return { ok: true, data: {} };

  const database = await getServerDatabaseClient();
  const [lessonResponse, medicationResponse] = await Promise.all([
    lessonId
      ? database
          .from("lessons")
          .select("id, title, subtitle, learning_objective, key_takeaway")
          .eq("id", lessonId)
          .eq("status", "published")
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    medicationId
      ? database
          .from("medications")
          .select("id, generic_name, category, content_blocks")
          .eq("id", medicationId)
          .eq("status", "published")
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  if (
    lessonResponse.error ||
    medicationResponse.error ||
    (lessonId && !lessonResponse.data) ||
    (medicationId && !medicationResponse.data)
  ) {
    return { ok: false };
  }

  const lesson = lessonResponse.data as {
    title: string;
    subtitle: string | null;
    learning_objective: string;
    key_takeaway: string | null;
  } | null;
  const medication = medicationResponse.data as {
    generic_name: string;
    category: string;
    content_blocks: unknown;
  } | null;
  const medicationText = medication
    ? collectMedicationText(medication.content_blocks).filter(Boolean).join(" ").slice(0, 6_000)
    : "";

  return {
    ok: true,
    data: {
      ...(lesson
        ? {
            lesson: {
              title: lesson.title,
              objective: lesson.learning_objective,
              summary: lesson.key_takeaway ?? lesson.subtitle ?? lesson.learning_objective,
            },
          }
        : {}),
      ...(medication
        ? {
            medication: {
              name: medication.generic_name,
              category: medication.category,
              educationalContent: medicationText,
            },
          }
        : {}),
    },
  };
}
