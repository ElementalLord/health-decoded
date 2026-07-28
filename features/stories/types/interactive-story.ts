export type StoryReviewStatus = "not-reviewed" | "in-review" | "reviewed";

export type StoryInteractionType =
  | "term-focus"
  | "phone-drafts"
  | "fact-vs-story"
  | "phone-dialogue"
  | "meaningful-choice"
  | "question-cards";

export type StoryScene = {
  id: string;
  number: number;
  title: string;
  paragraphs: string[];
  interactionType: StoryInteractionType;
  continueLabel: string;
};

export type StoryQuizQuestion = {
  id: string;
  prompt: string;
  choices: {
    id: string;
    label: string;
  }[];
  correctChoiceId: string;
  explanation: string;
  relatedSceneId: string;
};

export type InteractiveStory = {
  id: string;
  slug: string;
  title: string;
  characterName: string;
  disclosure: string;
  topic: string;
  themes: string[];
  learningObjective: string;
  relatedLessonId: string;
  estimatedMinutes: number;
  medicalRiskLevel: "low" | "moderate" | "high";
  contentWarning?: string;
  reviewStatus: StoryReviewStatus;
  reviewerName?: string;
  reviewerCredentials?: string;
  reviewedAt?: string;
  version: string;
  sourceThemeNote: string;
  imagePath: string;
  imagePrompt: string;
  imageAlt: string;
  introduction: string;
  whyItMatters: string;
  scenes: StoryScene[];
  predictionPrompt: string;
  quiz: StoryQuizQuestion[];
  interpretation: string[];
  takeaway: string;
  privateReflectionPrompt: string;
};

export type StoryStage =
  "intro" | "story" | "prediction" | "quiz" | "results" | "lesson" | "reflection" | "complete";

export type StoryProgress = {
  currentScene: number;
  currentQuizQuestion: number;
  furthestSceneReached: number;
  interactionStates: Record<string, string | number | string[]>;
  meaningfulChoice: string | null;
  prediction: string | null;
  quizAnswers: Record<string, string>;
  submittedQuizQuestions: string[];
  quizScore: number;
  storyCompleted: boolean;
  keyIdeaUnderstood: boolean;
  completionDate: string | null;
  privateReflection: string | null;
  versionCompleted: string | null;
  stage: StoryStage;
};

export type StoryPreviewStatus = "not-started" | "in-progress" | "completed";
