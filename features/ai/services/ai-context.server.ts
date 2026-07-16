import "server-only";

import { dayTwoGlossary } from "@/features/glossary/data/day-two-glossary";
import type { TrustedAiPromptContext } from "@/features/ai/prompts/prompt-builder";
import type { AiContextMetadata, AiRelatedContent } from "@/features/ai/types/ai";
import { getServerDatabaseClient } from "@/lib/database/server";
import { createServerLogger } from "@/lib/logging/server";

type ContextRequest = {
  readonly message: string;
  readonly userId: string;
};

type ContextResult =
  | {
      readonly ok: true;
      readonly data: {
        readonly metadata: AiContextMetadata;
        readonly promptContext: TrustedAiPromptContext;
      };
    }
  | { readonly ok: false };

type ContentCandidate = {
  readonly body: string;
  readonly category?: string;
  readonly href: string;
  readonly kind: AiRelatedContent["kind"];
  readonly title: string;
};

const logger = createServerLogger();

function contextFailure(operation: string, errorCode: string) {
  logger.error("ai_context.load_failed", { error_code: errorCode, operation });
  return { ok: false as const };
}

const contentTextKeys = new Set([
  "body",
  "common_benefits",
  "common_side_effects",
  "content",
  "explanation",
  "heading",
  "how_it_works",
  "important_considerations",
  "introduction",
  "key_takeaway",
  "questions_for_healthcare_team",
  "short_summary",
  "summary",
  "support_tip",
  "text",
  "what_not_to_say",
  "why_it_is_used",
]);

const ignoredSearchWords = new Set([
  "about",
  "after",
  "again",
  "and",
  "are",
  "can",
  "could",
  "does",
  "explain",
  "for",
  "from",
  "help",
  "how",
  "i'm",
  "into",
  "lesson",
  "more",
  "my",
  "please",
  "tell",
  "that",
  "the",
  "this",
  "today",
  "what",
  "why",
  "with",
  "would",
  "you",
]);

function normalizedText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function collectReviewedText(value: unknown, parentKey?: string): string[] {
  if (typeof value === "string") {
    return parentKey && contentTextKeys.has(parentKey) ? [normalizedText(value)] : [];
  }
  if (Array.isArray(value)) return value.flatMap((item) => collectReviewedText(item, parentKey));
  if (!value || typeof value !== "object") return [];

  return Object.entries(value).flatMap(([key, item]) =>
    contentTextKeys.has(key) ? collectReviewedText(item, key) : collectReviewedText(item),
  );
}

function reviewedExcerpt(value: unknown, maximumCharacters: number) {
  return normalizedText(collectReviewedText(value).filter(Boolean).join(" ")).slice(
    0,
    maximumCharacters,
  );
}

function questionTerms(message: string) {
  return [
    ...new Set(
      message
        .toLocaleLowerCase()
        .match(/[a-z0-9][a-z0-9'-]*/g)
        ?.filter((term) => term.length > 2 && !ignoredSearchWords.has(term)) ?? [],
    ),
  ];
}

function reviewedGlossary(message: string, currentDay?: number) {
  if (currentDay === 2) return dayTwoGlossary;

  const normalizedMessage = message.toLocaleLowerCase();
  return dayTwoGlossary.filter((entry) =>
    normalizedMessage.includes(entry.term.toLocaleLowerCase()),
  );
}

function relevanceScore(candidate: ContentCandidate, terms: readonly string[]) {
  const title = candidate.title.toLocaleLowerCase();
  const body = candidate.body.toLocaleLowerCase();

  return terms.reduce((score, term) => {
    if (title.includes(term)) return score + 3;
    if (body.includes(term)) return score + 1;
    return score;
  }, 0);
}

function selectRelevantCandidate(
  candidates: readonly ContentCandidate[],
  terms: readonly string[],
  minimumScore = 1,
) {
  const scored = candidates
    .map((candidate) => ({ candidate, score: relevanceScore(candidate, terms) }))
    .sort((left, right) => right.score - left.score);
  const best = scored[0];
  return best && best.score >= minimumScore ? best.candidate : null;
}

function relatedContent(candidate: ContentCandidate): AiRelatedContent {
  return { href: candidate.href, kind: candidate.kind, title: candidate.title };
}

function contextualSuggestions(context: TrustedAiPromptContext): readonly string[] {
  if (context.medication) {
    return [
      `What does ${context.medication.name} do?`,
      "What questions could I ask my healthcare team?",
      "Can you explain this in everyday language?",
    ];
  }
  if (context.caregiver) {
    return [
      "How can my spouse support me without taking over?",
      "What is a helpful thing to say?",
      "What should a caregiver avoid saying?",
    ];
  }
  if (context.glossary?.length) {
    return context.glossary.slice(0, 3).map((entry) => `What exactly is ${entry.term}?`);
  }
  if (context.lesson) {
    return [
      `Can you explain ${context.lesson.title.toLocaleLowerCase()} more simply?`,
      "Why does this matter in everyday life?",
      "Why is today's activity important?",
    ];
  }
  return [
    "What is insulin resistance?",
    "What does metformin do?",
    "Can you explain Type 2 diabetes simply?",
  ];
}

export async function loadTrustedAiContext({
  message,
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

  if (userJourneyResponse.error) {
    return contextFailure("user_journey", userJourneyResponse.error.code);
  }

  const userJourney = userJourneyResponse.data;
  const [medicationsResponse, caregiverResponse, storiesResponse] = await Promise.all([
    database
      .from("medications")
      .select("slug, generic_name, brand_names, category, content_blocks")
      .eq("status", "published")
      .not("published_at", "is", null)
      .limit(12),
    database
      .from("caregiver_content")
      .select("slug, journey_lesson_id, title, content_blocks, support_tip, conversation_prompt")
      .eq("status", "published")
      .not("published_at", "is", null)
      .limit(12),
    database
      .from("patient_stories")
      .select("slug, title, introduction, content_blocks, key_takeaway")
      .eq("status", "published")
      .not("published_at", "is", null)
      .limit(12),
  ]);

  if (medicationsResponse.error || caregiverResponse.error || storiesResponse.error) {
    return contextFailure(
      "reviewed_content",
      medicationsResponse.error?.code ??
        caregiverResponse.error?.code ??
        storiesResponse.error?.code ??
        "unknown",
    );
  }

  const medicationCandidates: ContentCandidate[] = (medicationsResponse.data ?? []).map(
    (medication) => ({
      body: `${medication.brand_names.join(" ")} ${medication.category} ${reviewedExcerpt(medication.content_blocks, 6_000)}`,
      category: medication.category,
      href: "/resources",
      kind: "medication",
      title: medication.generic_name,
    }),
  );
  const caregiverCandidates: ContentCandidate[] = (caregiverResponse.data ?? []).map((article) => ({
    body: `${article.support_tip ?? ""} ${article.conversation_prompt ?? ""} ${reviewedExcerpt(article.content_blocks, 2_500)}`,
    href: `/caregiver/${article.slug}`,
    kind: "caregiver",
    title: article.title,
  }));
  const storyCandidates: ContentCandidate[] = (storiesResponse.data ?? []).map((story) => ({
    body: `${story.introduction ?? ""} ${story.key_takeaway ?? ""} ${reviewedExcerpt(story.content_blocks, 2_500)}`,
    href: `/stories/${story.slug}`,
    kind: "story",
    title: story.title,
  }));

  if (!userJourney) {
    const terms = questionTerms(message);
    const glossary = reviewedGlossary(message);
    const medication = selectRelevantCandidate(medicationCandidates, terms);
    const caregiver = selectRelevantCandidate(caregiverCandidates, terms);
    const story = selectRelevantCandidate(storyCandidates, terms, 2);
    const promptContext: TrustedAiPromptContext = {
      ...(glossary.length ? { glossary } : {}),
      ...(medication
        ? {
            medication: {
              category: medication.category ?? "Medication",
              educationalContent: medication.body,
              name: medication.title,
            },
          }
        : {}),
      ...(caregiver
        ? {
            caregiver: {
              content: caregiver.body,
              conversationPrompt: null,
              supportTip: null,
              title: caregiver.title,
            },
          }
        : {}),
      ...(story
        ? {
            stories: [{ introduction: story.body, keyTakeaway: "", title: story.title }],
          }
        : {}),
    };
    return {
      ok: true,
      data: {
        metadata: {
          relatedContent: [medication, caregiver, story]
            .filter((candidate): candidate is ContentCandidate => Boolean(candidate))
            .map(relatedContent),
          suggestedQuestions: contextualSuggestions(promptContext),
        },
        promptContext,
      },
    };
  }

  const [journeyResponse, assignmentsResponse, progressResponse] = await Promise.all([
    database
      .from("journeys")
      .select("title, duration_days")
      .eq("id", userJourney.journey_id)
      .eq("status", "published")
      .not("published_at", "is", null)
      .maybeSingle(),
    database
      .from("journey_lessons")
      .select("id, day_number, display_order, lesson_id")
      .eq("journey_id", userJourney.journey_id)
      .eq("status", "published")
      .not("published_at", "is", null)
      .order("display_order"),
    database
      .from("lesson_progress")
      .select("journey_lesson_id, status")
      .eq("user_journey_id", userJourney.id),
  ]);

  if (journeyResponse.error || assignmentsResponse.error || progressResponse.error) {
    return contextFailure(
      "journey_progress",
      journeyResponse.error?.code ??
        assignmentsResponse.error?.code ??
        progressResponse.error?.code ??
        "unknown",
    );
  }

  const assignments = assignmentsResponse.data ?? [];
  const progressRows = progressResponse.data ?? [];
  const progressByAssignment = new Map(
    progressRows.map((progress) => [progress.journey_lesson_id, progress.status]),
  );
  const currentAssignment =
    assignments.find((assignment) => assignment.id === userJourney.current_journey_lesson_id) ??
    assignments.find((assignment) => progressByAssignment.get(assignment.id) !== "completed") ??
    assignments.at(-1);
  const completedAssignments = assignments
    .filter((assignment) => progressByAssignment.get(assignment.id) === "completed")
    .slice(-3);
  const lessonIds = [currentAssignment, ...completedAssignments]
    .filter((assignment): assignment is NonNullable<typeof assignment> => Boolean(assignment))
    .map((assignment) => assignment.lesson_id);

  const [lessonsResponse, activityResponse] = await Promise.all([
    lessonIds.length
      ? database
          .from("lessons")
          .select("id, title, learning_objective, key_takeaway, subtitle, content_blocks")
          .in("id", lessonIds)
          .eq("status", "published")
          .not("published_at", "is", null)
      : Promise.resolve({ data: [], error: null }),
    currentAssignment
      ? database
          .from("activities")
          .select("title, instructions")
          .eq("lesson_id", currentAssignment.lesson_id)
          .eq("status", "published")
          .not("published_at", "is", null)
          .order("display_order")
          .limit(1)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  if (lessonsResponse.error || activityResponse.error) {
    return contextFailure(
      "lesson_content",
      lessonsResponse.error?.code ?? activityResponse.error?.code ?? "unknown",
    );
  }

  const lessonsById = new Map((lessonsResponse.data ?? []).map((lesson) => [lesson.id, lesson]));
  const currentLesson = currentAssignment
    ? lessonsById.get(currentAssignment.lesson_id)
    : undefined;
  const terms = questionTerms(message);
  const currentCaregiver = currentAssignment
    ? caregiverResponse.data?.find((article) => article.journey_lesson_id === currentAssignment.id)
    : undefined;
  const caregiver =
    currentCaregiver && /caregiv|spouse|partner|family|support|help.*(?:them|me)/i.test(message)
      ? (caregiverCandidates.find((candidate) => candidate.title === currentCaregiver.title) ??
        null)
      : selectRelevantCandidate(caregiverCandidates, terms);
  const medication = selectRelevantCandidate(medicationCandidates, terms);
  const story = selectRelevantCandidate(storyCandidates, terms, 2);
  const completedLessons = completedAssignments.flatMap((assignment) => {
    const lesson = lessonsById.get(assignment.lesson_id);
    return lesson
      ? [
          {
            dayNumber: assignment.day_number,
            objective: lesson.learning_objective,
            summary:
              reviewedExcerpt(lesson.content_blocks, 1_000) ||
              lesson.key_takeaway ||
              lesson.subtitle ||
              lesson.learning_objective,
            title: lesson.title,
          },
        ]
      : [];
  });
  const lessonSummary = currentLesson
    ? reviewedExcerpt(currentLesson.content_blocks, 2_500) ||
      currentLesson.key_takeaway ||
      currentLesson.subtitle ||
      currentLesson.learning_objective
    : null;
  const promptContext: TrustedAiPromptContext = {
    ...(currentAssignment
      ? {
          glossary: reviewedGlossary(message, currentAssignment.day_number),
        }
      : {}),
    ...(journeyResponse.data && currentAssignment
      ? {
          journey: {
            currentDay: currentAssignment.day_number,
            title: journeyResponse.data.title,
            totalDays: journeyResponse.data.duration_days,
          },
        }
      : {}),
    ...(currentAssignment && currentLesson && lessonSummary
      ? {
          lesson: {
            dayNumber: currentAssignment.day_number,
            objective: currentLesson.learning_objective,
            summary: lessonSummary,
            title: currentLesson.title,
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
            category: medication.category ?? "Medication",
            educationalContent: medication.body,
            name: medication.title,
          },
        }
      : {}),
    ...(caregiver
      ? {
          caregiver: {
            content: caregiver.body,
            conversationPrompt: null,
            supportTip: null,
            title: caregiver.title,
          },
        }
      : {}),
    ...(story
      ? { stories: [{ introduction: story.body, keyTakeaway: "", title: story.title }] }
      : {}),
    ...(completedLessons.length ? { completedLessons } : {}),
  };
  const related: AiRelatedContent[] = [];
  if (currentAssignment && currentLesson) {
    related.push({
      href: `/lessons/${currentAssignment.day_number}`,
      kind: "lesson",
      title: currentLesson.title,
    });
  }
  for (const candidate of [medication, caregiver, story]) {
    if (candidate) related.push(relatedContent(candidate));
  }

  return {
    ok: true,
    data: {
      metadata: {
        relatedContent: related.slice(0, 4),
        suggestedQuestions: contextualSuggestions(promptContext),
      },
      promptContext,
    },
  };
}
