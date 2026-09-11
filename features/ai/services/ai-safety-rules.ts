import { containsSensitiveAiData } from "./ai-data-minimization.mjs";
import {
  diabetesMedicationPattern,
  DIABETES_MEDICATION_TERM_PATTERN,
  // @ts-expect-error -- Node's built-in TypeScript test runner requires explicit extensions.
} from "../data/medication-lexicon.ts";
// @ts-expect-error -- Node's built-in TypeScript test runner requires explicit extensions.
import { diabetesEducationTopicPattern } from "../data/topic-lexicon.ts";
// @ts-expect-error -- Node's built-in TypeScript test runner requires explicit extensions.
import { normalizeAiQuery } from "../data/query-normalizer.ts";

export const aiRequestCategories = [
  "Lesson Question",
  "Medication Education",
  "Nutrition Education",
  "Exercise Education",
  "General Type 2 Diabetes Education",
  "Caregiver Guidance",
  "Lifestyle Support",
  "Emotional Support",
  "Medical Advice Request",
  "Emergency / Crisis",
  "Prompt Injection / Abuse",
  "Unknown",
] as const;

export type AiRequestCategory = (typeof aiRequestCategories)[number];

export type AiRefusalType =
  | "diagnosis"
  | "emergency"
  | "hidden_prompt"
  | "medication_adjustment"
  | "personal_interpretation"
  | "prompt_injection"
  | "sensitive_data"
  | "treatment_plan"
  | "unsupported_medical";

export type AiSafetyResult =
  | { readonly category: AiRequestCategory; readonly kind: "allow" }
  | {
      readonly category: AiRequestCategory;
      readonly kind: "refuse";
      readonly message: string;
      readonly refusalType: AiRefusalType;
    };

/**
 * Uses prior turns for safety only when the current question contains a
 * referential personal-decision request such as "Should I take it daily?".
 */
export function buildAiSafetyInput({
  message,
  priorUserMessages = [],
}: {
  readonly message: string;
  readonly priorUserMessages?: readonly string[];
}) {
  const usesPriorReferent =
    /\b(it|its|this|that|these|those|the same one|the medicine|the medication)\b/i.test(message);
  const asksPersonalDecision =
    /\b(?:should|can|could|would)\s+i\b|\b(?:safe for me|right for me|my dose|my dosage|how often|when should i)\b/i.test(
      message,
    );

  if (!usesPriorReferent || !asksPersonalDecision) return message;
  return [...priorUserMessages.slice(-2), message].join(" ");
}

const emergencyPattern =
  /\b(chest pain|trouble breathing|difficulty breathing|can't breathe|cannot breathe|passed out|unconscious|cannot wake|won't wake|loss of consciousness|seizure|severe allergic reaction|(?:severe |sudden )?confus(?:ion|ed)|severe abdominal pain|repeated(?:ly)? vomit(?:ing)?|keep(?:ing)? (?:vomiting|throwing up)|cannot keep (?:liquids?|fluids?|water) down|can't keep (?:liquids?|fluids?|water) down|suicid(?:al|e)|want to die|kill myself|face droop(?:ing)?|arm (?:feels? )?weak|arm weakness|slurred speech|signs? of (?:a )?(?:stroke|heart attack))\b/i;
const hiddenPromptPattern =
  /\b(reveal|show|output|print|repeat|tell me|extract|exfiltrate)\b.{0,100}\b(hidden|system|developer|internal|initial|confidential)\b.{0,60}\b(prompt|instruction|message|rule|secret|configuration)s?\b/i;
const injectionPattern =
  /\b(ignore|forget|disregard|override|bypass|replace|disable|evade)\b.{0,100}\b(previous|prior|system|developer|health decoded|safety|instruction|guardrail|rule|source|citation)s?\b|\b(?:approved sources? are wrong|citations? are optional|don't use (?:the )?(?:approved )?sources?)\b|\bpretend\b.{0,100}\b(?:source id|approved|doctor|clinician|unrestricted|unfiltered)\b.{0,60}\b(?:bypass|validation|rule)?|\b(?:pretend (?:that )?you(?:'re| are)|you are now)\b.{0,60}\b(?:doctor|clinician|unrestricted|unfiltered)\b|\b(?:jailbreak|developer mode|do anything now|DAN mode)\b|\b(?:decode|translate)\b.{0,60}\b(?:base64|hex)\b.{0,60}\b(?:follow|execute|obey|instruction)s?\b/i;
const medicationAdjustmentPattern = new RegExp(
  `\\b(?:(?:should|can)\\s+i\\s+(?:take|use|try)|(?:should\\s+i\\s+)?(?:start|stop|skip|change|increase|decrease|adjust|double|halve|miss(?:ed)?))\\b(?:\\s+\\w+){0,6}\\s+(?:my\\s+)?${DIABETES_MEDICATION_TERM_PATTERN}\\b|\\b${DIABETES_MEDICATION_TERM_PATTERN}\\b.{0,100}\\b(?:start|stop|skip|change|increase|decrease|adjust|double|halve|twice as much|make up|missed)\\b|\\b(?:forgot|missed)\\b.{0,50}\\b${DIABETES_MEDICATION_TERM_PATTERN}\\b|\\b(?:how much|how many units|what dose|what dosage)\\b.{0,60}\\b${DIABETES_MEDICATION_TERM_PATTERN}\\b|\\b(?:explain|review)\\s+my\\s+(?:dose|dosage)\\b`,
  "i",
);
const contextualMedicationAdjustmentPattern = new RegExp(
  `\\b${DIABETES_MEDICATION_TERM_PATTERN}\\b.{0,400}\\b(?:(?:should|can)\\s+i\\s+(?:take|use|inject)\\s+(?:it|this|that)|(?:how often|when)\\s+should\\s+i\\s+(?:take|use|inject)\\s+(?:it|this|that))\\b`,
  "i",
);
const diagnosisPattern =
  /\b(do i have|is this diabetes\b(?!\s+(?:medication|medicine))|diagnose me|what does my (?:a1c|lab|test result)|are my (?:a1c(?: test results?)?|labs?|test results?) (?:good|bad|normal)|interpret my (?:a1c|labs?|test results?))\b/i;
const personalInterpretationPattern =
  /\b(?:my\s+)?(?:fasting\s+)?(?:blood\s+sugar|glucose|a1c|result)\s+(?:is|was|reads?|came back|changed|went|result(?:ed)?\s+(?:at|as))\b.{0,80}\d+(?:\.\d+)?\s*(?:%|percent)?\b|\b(?:is|does)\s+my\s+(?:blood\s+sugar|glucose|a1c)\b.{0,60}\b(?:bad|dangerous|normal|safe|high|low|mean|improving)\b|\b\d+(?:\.\d+)?\s*(?:mg\/?dl|mmol\/?l|percent|%)\b.{0,60}\b(?:blood\s+sugar|glucose|a1c|for me|normal|safe|high|low|what should i)\b/i;
const treatmentPlanPattern =
  /\b(?:what|which)\s+(?:treatment|treatment plan|therapy|diet|exercise plan)\s+(?:should|would)\s+i\b|\bwhat (?:dose|dosage)\b.{0,50}\b(?:prescribe|recommend|for me)\b|\b(?:make|create|give)(?:\s+me)?\s+(?:a\s+)?(?:treatment|medication|insulin|diet)\s+plan(?:\s+for\s+me)?\b/i;
const specializedMedicalPattern =
  /\b(?:pregnan(?:t|cy)|trying to conceive|breastfeed(?:ing)?|surgery|operation|anesthesia)\b.{0,100}\b(?:should|safe|medication|medicine|insulin|diabetes|take|stop|start|recommend)\b|\b(?:is|are)\b.{0,60}\b(?:right|safe|best)\b.{0,60}\bfor me\b/i;
const personalMedicalAdvicePattern =
  /\b(?:i (?:am|feel|have|had|keep|started|stopped)|i'm|my)\b.{0,100}\b(?:dizz(?:y|iness)|faint|nausea|vomit(?:ing)?|pain|rash|swelling|symptom|side effect|infection|wound)\b.{0,100}\b(?:what should i|should i|is (?:this|that) (?:normal|safe)|what does this mean|recommend)\b|\b(?:my dose|my dosage|prescribed me)\b.{0,100}\b(?:metformin|insulin|mounjaro|tirzepatide|semaglutide|ozempic|rybelsus|wegovy|empagliflozin|jardiance|sitagliptin|januvia|medication|medicine|prescription|\d+(?:\.\d+)?\s*(?:mg|mcg|units?))\b|\b(?:i take|i'm taking)\b.{0,100}\b\d+(?:\.\d+)?\s*(?:mg|mcg|units?)\b/i;
const lessonPattern = /\b(today(?:'s)?|lesson|activity|learned|yesterday|next lesson)\b/i;
const nutritionPattern = /\b(food|eat|meal|carb|carbohydrate|nutrition|fruit|bread|plate)\b/i;
const exercisePattern = /\b(exercise|walk(?:ing)?|movement|workout|active)\b/i;
const caregiverPattern = /\b(caregiver|spouse|partner|family|support(?:ing|er)?)\b/i;
const lifestylePattern = /\b(sleep|stress|habit|routine|lifestyle)\b/i;
const emotionalPattern =
  /\b(scared|afraid|overwhelmed|embarrassed|ashamed|worried|anxious|sad|upset)\b/i;
const refusalMessages: Record<AiRefusalType, string> = {
  diagnosis:
    "A1C and glucose tests provide information about blood sugar, but a result needs context such as timing, symptoms, health history, and the reason for testing. I can explain what the test measures and how it is generally used, but I can’t diagnose you or decide what your personal result means. A clinician who knows that context can interpret it with you.",
  emergency:
    "Some symptoms can need urgent, hands-on assessment, and I can’t safely determine their cause or severity here. If you may be having a medical emergency, contact local emergency services now or seek urgent medical help immediately. If it is not an emergency, contact your healthcare team.",
  hidden_prompt:
    "I can’t share internal instructions. I can still help explain Type 2 diabetes topics in clear, everyday language.",
  medication_adjustment:
    "Medication doses and timing can change both effectiveness and side-effect risk, so I can’t tell you to start, stop, skip, double, or adjust a prescription. Keep to the instructions you were given and check the prescription label; a pharmacist or prescribing clinician can resolve a missed-dose or change question. I can still explain what the medicine generally does, how its drug class works, and common safety topics.",
  personal_interpretation:
    "A glucose reading is a snapshot, while A1C reflects average glucose over roughly three months. The meaning of a personal value depends on timing, symptoms, health history, and the goal set for you, so I can’t label your result safe, dangerous, good, or bad. I can explain the measurement and the factors that commonly affect it; your healthcare team can interpret the value for your care.",
  prompt_injection:
    "I can’t change my safety instructions or act as a clinician. I can help with clear, educational questions about Type 2 diabetes.",
  sensitive_data:
    "For your privacy, please remove passwords, access tokens, contact details, medical record numbers, or other identifying information before asking your educational question.",
  treatment_plan:
    "Type 2 diabetes care often combines food, movement, monitoring, medication, sleep, and risk-reduction habits, but the right combination differs from person to person. I can explain those options and their tradeoffs, but I can’t choose an individualized treatment plan. A qualified healthcare professional can recommend one using your health history and goals.",
  unsupported_medical:
    "There is a general educational part I can help with, but the personal decision depends on details such as symptoms, health history, other medicines, pregnancy, or an upcoming procedure. I can explain the relevant concept and common considerations, but I can’t decide what is safe for you personally. A qualified healthcare professional can apply those details to your situation.",
};

function refusal(refusalType: AiRefusalType, category: AiRequestCategory): AiSafetyResult {
  return { category, kind: "refuse", message: refusalMessages[refusalType], refusalType };
}

export function classifyAiRequest(message: string): AiRequestCategory {
  const normalized = normalizeAiQuery(message);
  if (emergencyPattern.test(normalized)) return "Emergency / Crisis";
  if (
    hiddenPromptPattern.test(normalized) ||
    injectionPattern.test(normalized) ||
    containsSensitiveAiData(message)
  ) {
    return "Prompt Injection / Abuse";
  }
  if (
    medicationAdjustmentPattern.test(normalized) ||
    contextualMedicationAdjustmentPattern.test(normalized) ||
    diagnosisPattern.test(normalized) ||
    personalInterpretationPattern.test(normalized) ||
    treatmentPlanPattern.test(normalized) ||
    specializedMedicalPattern.test(normalized) ||
    personalMedicalAdvicePattern.test(normalized)
  ) {
    return "Medical Advice Request";
  }
  if (lessonPattern.test(normalized)) return "Lesson Question";
  if (diabetesMedicationPattern.test(normalized)) return "Medication Education";
  if (nutritionPattern.test(normalized)) return "Nutrition Education";
  if (exercisePattern.test(normalized)) return "Exercise Education";
  if (caregiverPattern.test(normalized)) return "Caregiver Guidance";
  if (lifestylePattern.test(normalized)) return "Lifestyle Support";
  if (emotionalPattern.test(normalized)) return "Emotional Support";
  if (diabetesEducationTopicPattern.test(normalized)) return "General Type 2 Diabetes Education";
  return "Unknown";
}

export function assessAiSafety(message: string): AiSafetyResult {
  const category = classifyAiRequest(message);
  const normalized = normalizeAiQuery(message);
  if (category === "Emergency / Crisis") return refusal("emergency", category);
  if (containsSensitiveAiData(message)) return refusal("sensitive_data", category);
  if (hiddenPromptPattern.test(normalized)) return refusal("hidden_prompt", category);
  if (injectionPattern.test(normalized)) return refusal("prompt_injection", category);
  // Personal results, medicines, pregnancy, and treatment questions still need
  // careful boundaries, but they are not rejected before the model reads them.
  // The grounded answer can address the useful general portion directly, state
  // the exact individualized decision it cannot make, and cite its evidence.
  return { category, kind: "allow" };
}
