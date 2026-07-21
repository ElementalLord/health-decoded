import { containsSensitiveAiData } from "./ai-data-minimization.mjs";

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

const emergencyPattern =
  /\b(chest pain|trouble breathing|difficulty breathing|can't breathe|cannot breathe|passed out|unconscious|cannot wake|won't wake|loss of consciousness|seizure|severe allergic reaction|severe confusion|suicid(?:al|e)|want to die|kill myself|face droop(?:ing)?|arm weakness|slurred speech|signs? of (?:a )?(?:stroke|heart attack))\b/i;
const hiddenPromptPattern =
  /\b(reveal|show|output|print|repeat|tell me|extract|exfiltrate)\b.{0,100}\b(hidden|system|developer|internal|initial|confidential)\b.{0,60}\b(prompt|instruction|message|rule|secret|configuration)s?\b/i;
const injectionPattern =
  /\b(ignore|forget|disregard|override|bypass|replace|disable|evade)\b.{0,100}\b(previous|prior|system|developer|health decoded|safety|instruction|guardrail|rule)s?\b|\bpretend (?:that )?you(?:'re| are)\b.{0,60}\b(?:doctor|clinician|unrestricted|unfiltered)\b|\b(?:jailbreak|developer mode|do anything now|DAN mode)\b|\b(?:decode|translate)\b.{0,60}\b(?:base64|hex)\b.{0,60}\b(?:follow|execute|obey|instruction)s?\b/i;
const medicationAdjustmentPattern =
  /\b(?:should\s+i\s+)?(?:start|stop|skip|change|increase|decrease|adjust|double|halve|miss(?:ed)?|take)\b(?:\s+\w+){0,6}\s+(?:my\s+)?(?:medication|medicine|metformin|insulin|dose|dosage|prescription)\b|\b(?:how much|how many units|what dose|what dosage)\b.{0,60}\b(?:insulin|medication|medicine|metformin|prescription)\b/i;
const diagnosisPattern =
  /\b(do i have|is this diabetes\b(?!\s+(?:medication|medicine))|diagnose me|what does my (?:a1c|lab|test result)|are my (?:a1c|labs?|test results?) (?:good|bad|normal)|interpret my (?:a1c|labs?|test results?))\b/i;
const personalInterpretationPattern =
  /\b(?:my\s+)?(?:blood\s+sugar|glucose|a1c)\s+(?:is|was|reads?|came back|result(?:ed)?\s+(?:at|as))\s*(?:at\s*)?\d+(?:\.\d+)?\b|\b\d+(?:\.\d+)?\s*(?:mg\/?dl|mmol\/?l|percent|%)\b.{0,60}\b(?:blood\s+sugar|glucose|a1c|for me|normal|safe|high|low)\b/i;
const treatmentPlanPattern =
  /\b(?:what|which)\s+(?:treatment|treatment plan|therapy|diet|exercise plan)\s+(?:should|would)\s+i\b|\b(?:make|create|give)(?:\s+me)?\s+(?:a\s+)?(?:treatment|medication|insulin|diet)\s+plan(?:\s+for\s+me)?\b/i;
const specializedMedicalPattern =
  /\b(?:pregnan(?:t|cy)|trying to conceive|breastfeed(?:ing)?|surgery|operation|anesthesia)\b.{0,100}\b(?:should|safe|medication|medicine|insulin|diabetes|take|stop|start|recommend)\b|\b(?:is|are)\b.{0,60}\b(?:right|safe|best)\b.{0,60}\bfor me\b/i;
const personalMedicalAdvicePattern =
  /\b(?:i (?:am|feel|have|had|keep|started|stopped)|i'm|my)\b.{0,100}\b(?:dizz(?:y|iness)|faint|nausea|vomit(?:ing)?|pain|rash|swelling|symptom|side effect|infection|wound)\b.{0,100}\b(?:what should i|should i|is (?:this|that) (?:normal|safe)|what does this mean|recommend)\b|\b(?:i take|i'm taking|my dose|my dosage|prescribed me)\b.{0,100}\b(?:metformin|insulin|medication|medicine|prescription|\d+(?:\.\d+)?\s*(?:mg|mcg|units?))\b/i;
const lessonPattern = /\b(today(?:'s)?|lesson|activity|learned|yesterday|next lesson)\b/i;
const medicationPattern =
  /\b(medication|medicine|metformin|insulin|semaglutide|empagliflozin|sitagliptin)\b/i;
const nutritionPattern = /\b(food|eat|meal|carb|carbohydrate|nutrition|fruit|bread|plate)\b/i;
const exercisePattern = /\b(exercise|walk(?:ing)?|movement|workout|active)\b/i;
const caregiverPattern = /\b(caregiver|spouse|partner|family|support(?:ing|er)?)\b/i;
const lifestylePattern = /\b(sleep|stress|habit|routine|lifestyle)\b/i;
const emotionalPattern =
  /\b(scared|afraid|overwhelmed|embarrassed|ashamed|worried|anxious|sad|upset)\b/i;
const typeTwoPattern = /\b(type 2|diabetes|a1c|blood sugar|insulin resistance|glucose)\b/i;
const refusalMessages: Record<AiRefusalType, string> = {
  diagnosis:
    "I can’t diagnose you or interpret personal test results for your care. A clinician who knows your health history can help. I can explain what a term or test generally means.",
  emergency:
    "I can’t assess urgent symptoms. If you may be having a medical emergency, contact local emergency services now or seek urgent medical help immediately. If it is not an emergency, contact your healthcare team.",
  hidden_prompt:
    "I can’t share internal instructions. I can still help explain Type 2 diabetes topics in clear, everyday language.",
  medication_adjustment:
    "I can’t tell you whether to start, stop, or change a prescribed medication or dose. Please contact the clinician or pharmacist who manages it. I can explain what a medication generally does or help you prepare questions.",
  personal_interpretation:
    "I can’t interpret a personal glucose or A1C result or tell you what it means for your care. Please contact your healthcare team for guidance based on your health history. I can explain what glucose or A1C measures in general.",
  prompt_injection:
    "I can’t change my safety instructions or act as a clinician. I can help with clear, educational questions about Type 2 diabetes.",
  sensitive_data:
    "For your privacy, please remove passwords, access tokens, contact details, medical record numbers, or other identifying information before asking your educational question.",
  treatment_plan:
    "I can’t create an individualized treatment plan. A qualified healthcare professional can recommend care based on your health history. I can explain general Type 2 diabetes education or help you prepare questions for an appointment.",
  unsupported_medical:
    "I can’t give individualized medical advice about that. A qualified healthcare professional can guide decisions based on your health history. I can explain the general educational concept if that would help.",
};

function refusal(refusalType: AiRefusalType, category: AiRequestCategory): AiSafetyResult {
  return { category, kind: "refuse", message: refusalMessages[refusalType], refusalType };
}

export function classifyAiRequest(message: string): AiRequestCategory {
  if (emergencyPattern.test(message)) return "Emergency / Crisis";
  if (
    hiddenPromptPattern.test(message) ||
    injectionPattern.test(message) ||
    containsSensitiveAiData(message)
  ) {
    return "Prompt Injection / Abuse";
  }
  if (
    medicationAdjustmentPattern.test(message) ||
    diagnosisPattern.test(message) ||
    personalInterpretationPattern.test(message) ||
    treatmentPlanPattern.test(message) ||
    specializedMedicalPattern.test(message) ||
    personalMedicalAdvicePattern.test(message)
  ) {
    return "Medical Advice Request";
  }
  if (lessonPattern.test(message)) return "Lesson Question";
  if (medicationPattern.test(message)) return "Medication Education";
  if (nutritionPattern.test(message)) return "Nutrition Education";
  if (exercisePattern.test(message)) return "Exercise Education";
  if (caregiverPattern.test(message)) return "Caregiver Guidance";
  if (lifestylePattern.test(message)) return "Lifestyle Support";
  if (emotionalPattern.test(message)) return "Emotional Support";
  if (typeTwoPattern.test(message)) return "General Type 2 Diabetes Education";
  return "Unknown";
}

export function assessAiSafety(message: string): AiSafetyResult {
  const category = classifyAiRequest(message);
  if (category === "Emergency / Crisis") return refusal("emergency", category);
  if (containsSensitiveAiData(message)) return refusal("sensitive_data", category);
  if (hiddenPromptPattern.test(message)) return refusal("hidden_prompt", category);
  if (injectionPattern.test(message)) return refusal("prompt_injection", category);
  if (medicationAdjustmentPattern.test(message)) return refusal("medication_adjustment", category);
  if (diagnosisPattern.test(message)) return refusal("diagnosis", category);
  if (personalInterpretationPattern.test(message)) {
    return refusal("personal_interpretation", category);
  }
  if (treatmentPlanPattern.test(message)) return refusal("treatment_plan", category);
  if (specializedMedicalPattern.test(message)) return refusal("unsupported_medical", category);
  if (personalMedicalAdvicePattern.test(message)) return refusal("unsupported_medical", category);
  return { category, kind: "allow" };
}
