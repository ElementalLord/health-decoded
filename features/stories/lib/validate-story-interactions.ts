import type { InteractiveStory } from "@/features/stories/types/interactive-story";

export type StoryInteractionValidationIssue = {
  storyId: string;
  sceneId: string;
  code:
    | "missing-purpose"
    | "missing-learning-point"
    | "passive-reveal-control"
    | "narrative-overlap"
    | "quiz-overlap";
  message: string;
};

const passiveRevealPattern = /^(continue|next|open|read|reveal|show|tap|view)\b/i;
const ignoredWords = new Set([
  "about",
  "after",
  "again",
  "because",
  "before",
  "could",
  "every",
  "from",
  "have",
  "into",
  "might",
  "more",
  "should",
  "that",
  "their",
  "there",
  "these",
  "they",
  "this",
  "what",
  "when",
  "which",
  "with",
  "would",
  "your",
]);

function normalizedWords(value: string) {
  return value
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 3 && !ignoredWords.has(word));
}

function hasSubstantialOverlap(left: string, right: string) {
  const leftWords = normalizedWords(left);
  const rightWords = normalizedWords(right);
  if (leftWords.length < 5 || rightWords.length < 5) return false;

  const leftSet = new Set(leftWords);
  const rightSet = new Set(rightWords);
  const shared = [...leftSet].filter((word) => rightSet.has(word)).length;
  const smaller = Math.min(leftSet.size, rightSet.size);
  return smaller >= 5 && shared / smaller >= 0.78;
}

export function validateStoryInteractions(story: InteractiveStory) {
  const issues: StoryInteractionValidationIssue[] = [];

  for (const scene of story.scenes) {
    const interaction = scene.interaction;
    if (!interaction?.purpose) {
      issues.push({
        storyId: story.id,
        sceneId: scene.id,
        code: "missing-purpose",
        message: "Every interaction needs a declared learning purpose.",
      });
    }
    if (!interaction?.learningPoint?.trim()) {
      issues.push({
        storyId: story.id,
        sceneId: scene.id,
        code: "missing-learning-point",
        message: "Every interaction needs a distinct learning point.",
      });
    }

    const narrative = [...scene.paragraphs, ...(scene.paragraphsAfterInteraction ?? [])];
    const interactionText = [
      interaction.prompt,
      interaction.instructions ?? "",
      interaction.learningPoint,
      ...(interaction.options ?? []).flatMap((option) => [option.label, option.feedback ?? ""]),
    ];
    if (
      interactionText.some((text) =>
        narrative.some((paragraph) => hasSubstantialOverlap(text, paragraph)),
      )
    ) {
      issues.push({
        storyId: story.id,
        sceneId: scene.id,
        code: "narrative-overlap",
        message: "Interaction text substantially repeats adjacent narrative text.",
      });
    }

    const labels = interaction.options?.map((option) => option.label) ?? [];
    if (labels.length > 0 && labels.every((label) => passiveRevealPattern.test(label.trim()))) {
      issues.push({
        storyId: story.id,
        sceneId: scene.id,
        code: "passive-reveal-control",
        message: "Passive reveal controls do not count as a learning interaction.",
      });
    }

    if (
      story.quiz.some(
        (question) =>
          hasSubstantialOverlap(interaction.prompt, question.prompt) ||
          (interaction.options ?? []).some((option) =>
            question.choices.some((choice) => hasSubstantialOverlap(option.label, choice.label)),
          ),
      )
    ) {
      issues.push({
        storyId: story.id,
        sceneId: scene.id,
        code: "quiz-overlap",
        message: "The interaction substantially repeats a final quiz item.",
      });
    }
  }

  return issues;
}
