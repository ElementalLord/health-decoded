export type NutritionLabel = {
  readonly name: string;
  readonly servingSize: string;
  readonly servingsPerContainer?: string;
  readonly calories: string;
  readonly totalFat?: string;
  readonly saturatedFat?: string;
  readonly sodium?: string;
  readonly totalCarbohydrate: string;
  readonly dietaryFiber: string;
  readonly totalSugars?: string;
  readonly addedSugars: string;
  readonly protein: string;
};

export type DecodeLabelChoice = {
  readonly id: string;
  readonly label: string;
};

export type DecodeLabelQuestion = {
  readonly id: string;
  readonly section: "warm-up" | "concept" | "comparison";
  readonly prompt: string;
  readonly choices: readonly DecodeLabelChoice[];
  readonly correctChoiceId: string;
  readonly correctFeedback: string;
  readonly incorrectFeedback: string;
};

export type DecodeLabelAnswer = {
  readonly questionId: string;
  readonly choiceId: string;
  readonly correct: boolean;
};
