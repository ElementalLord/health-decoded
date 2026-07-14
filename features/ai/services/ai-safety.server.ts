import "server-only";

export type AiSafetyResult =
  { readonly kind: "allow" } | { readonly kind: "redirect"; readonly message: string };

const emergencyPattern =
  /\b(chest pain|trouble breathing|difficulty breathing|can't breathe|cannot breathe|passed out|loss of consciousness|severe allergic reaction|suicid(?:al|e)|want to die|kill myself)\b/i;
const medicationChangePattern =
  /\b(start|stop|skip|change|increase|decrease|adjust|double|halve|miss(?:ed)?)(?:\s+\w+){0,5}\s+(?:my\s+)?(?:medication|medicine|metformin|insulin|dose|dosage)\b/i;
const diagnosisPattern =
  /\b(do i have|is this diabetes|diagnose me|what does my (?:a1c|lab|test result))\b/i;

const emergencyMessage =
  "I can’t assess urgent symptoms. If you may be having a medical emergency, call emergency services now or seek urgent medical help. If it is not an emergency, contact your healthcare team.";
const medicationMessage =
  "I can’t tell you whether to start, stop, or change a prescribed medication or dose. Please contact the clinician or pharmacist who manages it. I can explain what a medication is generally used for or help you prepare questions.";
const diagnosisMessage =
  "I can’t diagnose you or interpret personal test results for your care. A clinician who knows your health history can help. I can explain what a term or test generally means.";

export function assessAiSafety(message: string): AiSafetyResult {
  if (emergencyPattern.test(message)) return { kind: "redirect", message: emergencyMessage };
  if (medicationChangePattern.test(message))
    return { kind: "redirect", message: medicationMessage };
  if (diagnosisPattern.test(message)) return { kind: "redirect", message: diagnosisMessage };

  return { kind: "allow" };
}
