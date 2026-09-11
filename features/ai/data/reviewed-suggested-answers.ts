// @ts-expect-error -- Node's built-in TypeScript test runner requires explicit extensions.
import { normalizeAiQuery } from "./query-normalizer.ts";

export type ReviewedSuggestedAnswer = {
  readonly answer: string;
  readonly reviewedSourceKeys: readonly string[];
};

const answers: readonly (ReviewedSuggestedAnswer & { readonly question: string })[] = [
  {
    question: "What is insulin resistance?",
    answer:
      "Insulin resistance means the body's cells do not respond to insulin as well as they should. The pancreas may make more insulin to compensate, but over time blood glucose can rise.",
    reviewedSourceKeys: ["NIDDK-INSULIN-RESISTANCE"],
  },
  {
    question: "How does insulin help the body use glucose?",
    answer:
      "Insulin acts like a signal that lets glucose move from the bloodstream into many of the body's cells, where it can be used for energy. It also signals the liver to store glucose rather than release more of it.",
    reviewedSourceKeys: ["CDC-DIABETES-BASICS"],
  },
  {
    question: "Can you explain Type 2 diabetes simply?",
    answer:
      "Type 2 diabetes means the body does not use insulin well enough to keep blood glucose in a healthy range. Over time, the pancreas may also be unable to make enough insulin to keep up, so glucose builds up in the blood.",
    reviewedSourceKeys: ["CDC-DIABETES-BASICS", "NIDDK-DIABETES-OVERVIEW"],
  },
  {
    question: "Why does exercise help blood sugar?",
    answer:
      "Exercise helps working muscles take up glucose for energy and can make the body more sensitive to insulin. That can lower blood glucose during and after activity, although the size and timing of the effect vary.",
    reviewedSourceKeys: ["CDC-PHYSICAL-ACTIVITY"],
  },
  {
    question: "What does metformin do?",
    answer:
      "Metformin is a Type 2 diabetes medicine that mainly reduces the amount of glucose released by the liver. It also helps the body respond to insulin more effectively.",
    reviewedSourceKeys: ["DAILYMED-METFORMIN-LABEL"],
  },
  {
    question: "What does A1C measure?",
    answer:
      "A1C estimates a person's average blood glucose over roughly the past three months. It reflects glucose attached to hemoglobin in red blood cells, so it gives a longer-term view than a single glucose check.",
    reviewedSourceKeys: ["NIDDK-A1C"],
  },
  {
    question: "What is the difference between glucose and blood sugar?",
    answer:
      'Glucose is a type of sugar the body uses for energy. "Blood sugar" is the everyday name for the glucose circulating in the bloodstream, so the two terms usually refer to the same measurement in diabetes care.',
    reviewedSourceKeys: ["CDC-DIABETES-BASICS"],
  },
  {
    question: "Why can meals affect blood sugar?",
    answer:
      "During digestion, many carbohydrates are broken down into glucose and absorbed into the bloodstream. The amount and type of carbohydrate, the rest of the meal, medicines, and activity can all influence how quickly and how much blood glucose changes.",
    reviewedSourceKeys: ["CDC-DIABETES-MEAL-PLANNING"],
  },
  {
    question: "What are some everyday ways to support insulin sensitivity?",
    answer:
      "Regular physical activity, adequate sleep, and sustainable eating and weight-management habits can support insulin sensitivity. The goal is not perfection; repeated habits tend to matter more than a single meal or workout.",
    reviewedSourceKeys: ["CDC-PHYSICAL-ACTIVITY", "NIDDK-HEALTHY-LIVING"],
  },
  {
    question: "Can you explain the role of the pancreas in simple terms?",
    answer:
      "The pancreas is an organ that makes insulin. After food raises glucose in the blood, insulin helps move that glucose into cells for energy and tells the liver to store some for later.",
    reviewedSourceKeys: ["CDC-DIABETES-BASICS"],
  },
  {
    question: "What is the difference between A1C and a blood glucose check?",
    answer:
      "A blood glucose check measures glucose at one moment. A1C estimates the average over roughly three months, so it shows a longer-term pattern but does not show the daily highs and lows that individual checks or a continuous glucose monitor can reveal.",
    reviewedSourceKeys: ["NIDDK-A1C", "CDC-MONITORING-BLOOD-SUGAR"],
  },
  {
    question: "Why might blood sugar change throughout the day?",
    answer:
      "Blood glucose changes during the day because food, physical activity, medicines, stress, illness, sleep, and normal hormone rhythms can affect how glucose enters or leaves the bloodstream. The direction and size of the change depend on the situation.",
    reviewedSourceKeys: ["CDC-MONITORING-BLOOD-SUGAR", "NIDDK-MANAGING-DIABETES"],
  },
  {
    question: "What does a continuous glucose monitor do?",
    answer:
      "A continuous glucose monitor, or CGM, uses a small sensor under the skin to estimate glucose in the fluid between cells. It updates every few minutes and shows trends, including whether glucose is rising, falling, or staying fairly steady.",
    reviewedSourceKeys: ["CDC-CONTINUOUS-GLUCOSE-MONITORS"],
  },
  {
    question: "What is a balanced plate in general terms?",
    answer:
      "A common plate-method starting point is half nonstarchy vegetables, one quarter protein, and one quarter carbohydrate foods. It is a visual planning tool, not a rule that every meal must follow exactly.",
    reviewedSourceKeys: ["CDC-DIABETES-MEAL-PLANNING"],
  },
  {
    question: "Why is fiber often discussed with Type 2 diabetes?",
    answer:
      "Fiber is a carbohydrate the body does not fully break down and absorb, so it does not raise blood glucose the way many other carbohydrates do. Fiber-rich foods can also support fullness, digestion, and heart health.",
    reviewedSourceKeys: ["CDC-FIBER-AND-DIABETES"],
  },
  {
    question: "How can sleep affect blood sugar?",
    answer:
      "Too little, disrupted, or irregular sleep can make the body less sensitive to insulin and reduce glucose tolerance. When insulin works less effectively, blood glucose can be harder to manage.",
    reviewedSourceKeys: ["NIDDK-SLEEP-AND-GLUCOSE"],
  },
  {
    question: "What does it mean when food has carbohydrates?",
    answer:
      "Carbohydrates are one of the main nutrients in food. The body breaks many carbohydrates into glucose, so foods containing carbohydrates can raise blood glucose; examples include grains, fruit, milk, beans, and starchy vegetables.",
    reviewedSourceKeys: ["CDC-DIABETES-MEAL-PLANNING"],
  },
  {
    question: "What are some questions I could bring to a healthcare visit?",
    answer:
      "Useful questions include: What do my tests measure? What is the goal of each medicine? What side effects should I watch for? How should I monitor blood glucose? What should I do on sick days? Ask the questions that matter most to your daily life first.",
    reviewedSourceKeys: ["CDC-DIABETES-CARE-SCHEDULE"],
  },
  {
    question: "How does stress affect the body and blood sugar?",
    answer:
      "Stress releases hormones that prepare the body to respond to a challenge. Those hormones can make blood glucose rise or fall unpredictably, and stress can also change sleep, eating, activity, and diabetes-care routines.",
    reviewedSourceKeys: ["CDC-DIABETES-MENTAL-HEALTH"],
  },
  {
    question: "What is the difference between prediabetes and Type 2 diabetes?",
    answer:
      "Prediabetes means blood glucose is higher than the usual range but not high enough to meet the diagnostic range for diabetes. Type 2 diabetes means glucose has reached the diabetes range because the body is not using insulin effectively and may not be making enough to keep up.",
    reviewedSourceKeys: ["NIDDK-INSULIN-RESISTANCE", "NIDDK-DIABETES-TESTS-DIAGNOSIS"],
  },
  {
    question: "Why are regular checkups part of diabetes care?",
    answer:
      "Regular checkups help track patterns and find problems that may not cause symptoms early. Visits may include A1C, blood pressure, cholesterol, kidney, eye, and foot checks, along with a review of medicines and everyday concerns.",
    reviewedSourceKeys: ["CDC-DIABETES-CARE-SCHEDULE"],
  },
  {
    question: "Can you explain medication labels in plain language?",
    answer:
      "A medication label tells you what the medicine is, its strength, how it should be used, and important warnings. Check the medicine name, directions, warnings, expiration and storage information; prescription medicines may also include a separate Medication Guide with additional risks and instructions.",
    reviewedSourceKeys: ["FDA-MEDICINE-LABELS"],
  },
  {
    question: "What is the purpose of diabetes education?",
    answer:
      "Diabetes education helps people understand the condition and build practical skills for food, activity, medicines, monitoring, problem-solving, coping, and reducing health risks. Its purpose is to make day-to-day decisions clearer and more manageable.",
    reviewedSourceKeys: ["CDC-DIABETES-EDUCATION-SUPPORT"],
  },
  {
    question: "What are some common diabetes terms I might hear?",
    answer:
      "Common terms include glucose or blood sugar, the body's main circulating sugar; insulin, the hormone that helps cells use glucose; insulin resistance, a reduced response to insulin; A1C, an estimate of average glucose over about three months; hypoglycemia, low blood glucose; and hyperglycemia, high blood glucose.",
    reviewedSourceKeys: ["NIDDK-DIABETES-GUIDE", "CDC-DIABETES-BASICS"],
  },
];

const answerByQuestion = new Map(
  answers.map(({ question, ...entry }) => [normalizeAiQuery(question), entry]),
);

export function reviewedSuggestedAnswerFor(question: string): ReviewedSuggestedAnswer | null {
  return answerByQuestion.get(normalizeAiQuery(question)) ?? null;
}
