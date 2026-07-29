import type {
  StoryPreviewStatus,
  StoryProgress,
  StoryQuizQuestion,
} from "@/features/stories/types/interactive-story";

export const getStoryStorageKey = (slug: string) => `health-decoded:story:${slug}:progress`;

export const MARCUS_STORY_STORAGE_KEY = getStoryStorageKey("marcus-parking-lot");
export const ASHA_STORY_STORAGE_KEY = getStoryStorageKey("asha-rice-on-the-table");
export const CURRENT_STORY_INTERACTION_VERSION = 2;

export const createInitialStoryProgress = (): StoryProgress => ({
  currentScene: 0,
  currentQuizQuestion: 0,
  furthestSceneReached: 0,
  interactionStates: {},
  meaningfulChoice: null,
  prediction: null,
  quizAnswers: {},
  submittedQuizQuestions: [],
  quizScore: 0,
  storyCompleted: false,
  keyIdeaUnderstood: false,
  completionDate: null,
  privateReflection: null,
  versionCompleted: null,
  interactionVersion: CURRENT_STORY_INTERACTION_VERSION,
  stage: "intro",
});

export function createStoryReviewProgress(progress: StoryProgress): StoryProgress {
  return {
    ...progress,
    currentScene: 0,
    currentQuizQuestion: 0,
    furthestSceneReached: 0,
    interactionStates: {},
    meaningfulChoice: null,
    prediction: null,
    quizAnswers: {},
    submittedQuizQuestions: [],
    quizScore: 0,
    storyCompleted: false,
    keyIdeaUnderstood: false,
    completionDate: null,
    versionCompleted: null,
    stage: "story",
  };
}

export function calculateStoryQuizScore(
  questions: StoryQuizQuestion[],
  answers: Record<string, string>,
) {
  return questions.reduce(
    (score, question) => score + (answers[question.id] === question.correctChoiceId ? 1 : 0),
    0,
  );
}

export function parseStoryProgress(value: string | null): StoryProgress {
  if (!value) return createInitialStoryProgress();

  try {
    const parsed = JSON.parse(value) as Partial<StoryProgress>;
    const initial = createInitialStoryProgress();
    const interactionStateIsCurrent =
      parsed.interactionVersion === CURRENT_STORY_INTERACTION_VERSION;
    return {
      ...initial,
      ...parsed,
      currentScene:
        typeof parsed.currentScene === "number"
          ? Math.max(0, Math.min(5, parsed.currentScene))
          : initial.currentScene,
      currentQuizQuestion:
        typeof parsed.currentQuizQuestion === "number"
          ? Math.max(0, Math.min(2, parsed.currentQuizQuestion))
          : initial.currentQuizQuestion,
      furthestSceneReached:
        typeof parsed.furthestSceneReached === "number"
          ? Math.max(0, Math.min(5, parsed.furthestSceneReached))
          : initial.furthestSceneReached,
      interactionStates:
        interactionStateIsCurrent &&
        parsed.interactionStates &&
        typeof parsed.interactionStates === "object"
          ? parsed.interactionStates
          : initial.interactionStates,
      meaningfulChoice: interactionStateIsCurrent ? (parsed.meaningfulChoice ?? null) : null,
      interactionVersion: CURRENT_STORY_INTERACTION_VERSION,
      quizAnswers:
        parsed.quizAnswers && typeof parsed.quizAnswers === "object"
          ? parsed.quizAnswers
          : initial.quizAnswers,
      submittedQuizQuestions: Array.isArray(parsed.submittedQuizQuestions)
        ? parsed.submittedQuizQuestions.filter((id): id is string => typeof id === "string")
        : initial.submittedQuizQuestions,
    };
  } catch {
    return createInitialStoryProgress();
  }
}

export function getStoryPreviewStatus(progress: StoryProgress): StoryPreviewStatus {
  if (progress.storyCompleted) return "completed";
  if (progress.stage !== "intro" || progress.furthestSceneReached > 0) return "in-progress";
  return "not-started";
}
