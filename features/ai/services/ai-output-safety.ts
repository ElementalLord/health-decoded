import { containsSensitiveAiData } from "./ai-data-minimization.mjs";

const hiddenInstructionPattern =
  /\b(system prompt|system instruction|developer message|hidden prompt|internal configuration|chain of thought|private instruction)\b/i;
const executableContentPattern =
  /\b(?:select|insert|update|delete|drop|alter|grant|revoke)\b.{0,80}\b(?:from|into|table|role|policy)\b|\b(?:eval|exec|document\.cookie|localStorage|process\.env)\b/i;
const individualizedDiagnosisPattern =
  /\b(?:you have|you are diagnosed with|this means you have|your symptoms mean)\b.{0,80}\b(?:diabetes|hypoglycemia|hyperglycemia|condition|disease)\b/i;
const medicationDirectionPattern =
  /\b(?:you should|you must|you need to|i recommend (?:that )?you|it is safe for you to)\b.{0,100}\b(?:take|start|stop|skip|increase|decrease|change|adjust|double|halve)\b|(?:^|[.!?]\s+)(?:please\s+)?(?:take|start|stop|skip|increase|decrease|change|adjust|double|halve)\b.{0,80}\b(?:medication|medicine|metformin|insulin|dose|dosage|prescription|units?)\b|\b\d+(?:\.\d+)?\s*(?:units?|mg|mcg|milligrams?)\b/i;
const personalResultPattern =
  /\b(?:your|this)\s+(?:a1c|blood sugar|glucose|lab|test result)\b.{0,100}\b(?:means|shows|proves|indicates|is (?:safe|dangerous|normal|high|low))\b/i;

export type AiOutputSafetyResult =
  | { readonly safe: true }
  | {
      readonly safe: false;
      readonly reason:
        | "diagnosis"
        | "executable_content"
        | "instruction_leak"
        | "medication_direction"
        | "personal_result"
        | "sensitive_data";
    };

/** Final deterministic gate applied before any provider-generated text reaches the browser. */
export function assessAiOutputSafety(value: string): AiOutputSafetyResult {
  if (containsSensitiveAiData(value)) return { safe: false, reason: "sensitive_data" };
  if (hiddenInstructionPattern.test(value)) return { safe: false, reason: "instruction_leak" };
  if (executableContentPattern.test(value)) {
    return { safe: false, reason: "executable_content" };
  }
  if (individualizedDiagnosisPattern.test(value)) return { safe: false, reason: "diagnosis" };
  if (medicationDirectionPattern.test(value)) {
    return { safe: false, reason: "medication_direction" };
  }
  if (personalResultPattern.test(value)) return { safe: false, reason: "personal_result" };
  return { safe: true };
}
