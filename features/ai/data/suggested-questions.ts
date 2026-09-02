export const AI_SUGGESTED_QUESTION_BANK = [
  "What is insulin resistance?",
  "How does insulin help the body use glucose?",
  "Can you explain Type 2 diabetes simply?",
  "Why does exercise help blood sugar?",
  "What does metformin do?",
  "What does A1C measure?",
  "What is the difference between glucose and blood sugar?",
  "Why can meals affect blood sugar?",
  "What are some everyday ways to support insulin sensitivity?",
  "Can you explain the role of the pancreas in simple terms?",
  "What is the difference between A1C and a blood glucose check?",
  "Why might blood sugar change throughout the day?",
  "What does a continuous glucose monitor do?",
  "What is a balanced plate in general terms?",
  "Why is fiber often discussed with Type 2 diabetes?",
  "How can sleep affect blood sugar?",
  "What does it mean when food has carbohydrates?",
  "What are some questions I could bring to a healthcare visit?",
  "How does stress affect the body and blood sugar?",
  "What is the difference between prediabetes and Type 2 diabetes?",
  "Why are regular checkups part of diabetes care?",
  "Can you explain medication labels in plain language?",
  "What is the purpose of diabetes education?",
  "What are some common diabetes terms I might hear?",
] as const;

/** Returns a fresh, non-repeating selection without changing the question bank. */
export function selectSuggestedQuestions(
  questions: readonly string[] = AI_SUGGESTED_QUESTION_BANK,
  count = 3,
) {
  const shuffled = [...questions];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const currentQuestion = shuffled[index];
    const randomQuestion = shuffled[randomIndex];
    if (currentQuestion !== undefined && randomQuestion !== undefined) {
      shuffled[index] = randomQuestion;
      shuffled[randomIndex] = currentQuestion;
    }
  }

  return shuffled.slice(0, Math.min(count, shuffled.length));
}
