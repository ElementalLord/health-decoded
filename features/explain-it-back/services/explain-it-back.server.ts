import "server-only";

import { getExplainItBackChallenge } from "@/features/explain-it-back/content/explain-it-back-content";
import {
  buildExplainEvaluatorPrompt,
  buildExplainFeedback,
  buildExplainResponseJsonSchema,
  explainEvaluatorSystemInstruction,
  parseAndEnforceClassification,
} from "@/features/explain-it-back/services/explain-it-back-evaluator";
import {
  consumeAiProviderBudget,
  recordAiProviderFailure,
  recordAiProviderSuccess,
} from "@/features/ai/services/ai-provider-guard.server";
import {
  consumeAiRequestSlot,
  fingerprintAiRequest,
} from "@/features/ai/services/ai-rate-limit.server";
import { assessAiSafety } from "@/features/ai/services/ai-safety.server";
import { aiProvider } from "@/services/ai/provider";

export type ExplainEvaluationResult =
  | {
      readonly ok: true;
      readonly status: "evaluated";
      readonly feedback: ReturnType<typeof buildExplainFeedback>;
    }
  | {
      readonly ok: true;
      readonly status: "safety";
      readonly message: string;
      readonly personalMedicalContent: boolean;
    }
  | {
      readonly ok: false;
      readonly category: "invalid" | "rate_limited" | "timeout" | "unavailable";
    };

const personalMedicalMessage =
  "Explain It Back checks general concepts, not personal medical results. Try explaining the concept itself without using your own numbers.";

export async function evaluateExplanation(input: {
  readonly challengeId: string;
  readonly explanation: string;
  readonly networkKey: string;
  readonly userId: string;
  readonly signal?: AbortSignal;
}): Promise<ExplainEvaluationResult> {
  const challenge = getExplainItBackChallenge(input.challengeId);
  if (!challenge) return { ok: false, category: "invalid" };

  const safety = assessAiSafety(input.explanation);
  if (safety.kind === "refuse") {
    if (safety.refusalType === "personal_interpretation") {
      return {
        ok: true,
        status: "safety",
        message: personalMedicalMessage,
        personalMedicalContent: true,
      };
    }
    if (safety.refusalType === "prompt_injection" || safety.refusalType === "hidden_prompt") {
      const classification = parseAndEnforceClassification(
        {
          verdict: "try_again",
          coveredConceptIds: [],
          missingEssentialConceptIds: challenge.essentialConcepts.map(({ id }) => id),
          contradictionIds: [],
          offTopic: true,
          personalMedicalContent: false,
        },
        challenge,
      );
      if (!classification) return { ok: false, category: "unavailable" };
      return {
        ok: true,
        status: "evaluated",
        feedback: buildExplainFeedback(classification, challenge),
      };
    }
    return { ok: true, status: "safety", message: safety.message, personalMedicalContent: false };
  }

  const rateLimit = consumeAiRequestSlot({
    fingerprint: fingerprintAiRequest(`${input.challengeId}:${input.explanation}`),
    networkKey: input.networkKey,
    userId: input.userId,
  });
  if (!rateLimit.allowed) return { ok: false, category: "rate_limited" };

  const budget = consumeAiProviderBudget();
  if (!budget.allowed) {
    return { ok: false, category: budget.reason === "budget" ? "rate_limited" : "unavailable" };
  }

  const providerResult = await aiProvider.generateStructuredResponse(
    {
      prompt: buildExplainEvaluatorPrompt(challenge, input.explanation),
      responseJsonSchema: buildExplainResponseJsonSchema(challenge),
      systemInstruction: explainEvaluatorSystemInstruction,
    },
    input.signal,
  );
  if (!providerResult.ok) {
    recordAiProviderFailure();
    return {
      ok: false,
      category:
        providerResult.category === "timeout"
          ? "timeout"
          : providerResult.category === "rate_limited"
            ? "rate_limited"
            : "unavailable",
    };
  }

  let rawClassification: unknown;
  try {
    rawClassification = JSON.parse(providerResult.text);
  } catch {
    recordAiProviderFailure();
    return { ok: false, category: "unavailable" };
  }
  const classification = parseAndEnforceClassification(rawClassification, challenge);
  if (!classification) {
    recordAiProviderFailure();
    return { ok: false, category: "unavailable" };
  }

  recordAiProviderSuccess();
  return {
    ok: true,
    status: "evaluated",
    feedback: buildExplainFeedback(classification, challenge),
  };
}
