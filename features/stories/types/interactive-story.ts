export type StoryReviewStatus = "not-reviewed" | "in-review" | "reviewed";

export type StoryInteractionType =
  | "attention-overload"
  | "emotional-interpretation"
  | "thought-sort"
  | "response-prediction"
  | "information-filter"
  | "question-prioritization"
  | "grocery-fear"
  | "separate-plate"
  | "family-dialogue"
  | "meal-builder"
  | "meaningful-food-choice"
  | "shared-table"
  | "belief-mapping"
  | "source-pathway"
  | "perspective-switch"
  | "question-builder"
  | "routine-anchor"
  | "care-toolbox";

export type FoodComponent =
  "rice" | "dal" | "vegetables" | "protein" | "flatbread" | "yogurt" | "dessert" | "water";

export type StoryInteractionPurpose =
  | "interpret"
  | "predict"
  | "compare"
  | "sort"
  | "prioritize"
  | "choose-response"
  | "explore-consequences"
  | "apply"
  | "belief-mapping"
  | "source-evaluation"
  | "perspective-switch"
  | "rewrite-response"
  | "question-building"
  | "routine-planning"
  | "concept-integration";

export type StoryInteractionEngagement =
  "optional-exploration" | "meaningful-decision" | "knowledge-application";

export type StorySceneLayout =
  | "narrative-left"
  | "narrative-right"
  | "stacked"
  | "decision-focus"
  | "perspective-split"
  | "quiet-pause"
  | "closing-wide";

export type StoryVisualTheme = "quiet-dusk" | "family-warmth" | "hesitation";

export type StoryInteractionOption = {
  id: string;
  label: string;
  feedback?: string;
};

export type StoryInteractionDefinition = {
  id: string;
  purpose: StoryInteractionPurpose;
  secondaryPurpose?: StoryInteractionPurpose;
  engagement: StoryInteractionEngagement;
  prompt: string;
  instructions?: string;
  options: StoryInteractionOption[];
  feedbackMode: "single-explanation" | "choice-consequence" | "open-interpretation";
  requiredForProgress: boolean;
  learningPoint: string;
};

export type StoryScene = {
  id: string;
  number: number;
  title: string;
  layout: StorySceneLayout;
  tone: "tension" | "pause" | "clarity";
  paragraphs: string[];
  interactionType: StoryInteractionType;
  interaction: StoryInteractionDefinition;
  paragraphsAfterInteraction?: string[];
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
  visualTheme: StoryVisualTheme;
  emotionalArc: string;
  dominantInteractionType: StoryInteractionPurpose;
  primaryAccent: string;
  closingTone: string;
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
  estimatedTimeLabel?: string;
  relatedLessonLabel?: string;
  relatedLessonTitle?: string;
  relatedLessonHref?: string;
  introEyebrow?: string;
  introHeading?: string;
  introDescription?: string;
  predictionChoices?: {
    id: string;
    label: string;
  }[];
  keyIdeaUnderstoodMessage?: string;
  lessonEyebrow?: string;
  lessonHeading?: string;
  privateReflectionSupportPrompt?: string;
  completionHeading?: string;
  completionMessage?: string;
  resultIdeas?: string[];
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
  interactionVersion: number;
  stage: StoryStage;
};

export type StoryPreviewStatus = "not-started" | "in-progress" | "completed";
