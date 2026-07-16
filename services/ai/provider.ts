import "server-only";

import { ApiError, GoogleGenAI } from "@google/genai";

import { AI_PROVIDER_TIMEOUT_MS } from "@/features/ai/constants/ai-limits";
import { DEFAULT_AI_MODEL } from "@/features/ai/constants/ai-models";
import { getGeminiServerEnv } from "@/lib/env/server";
import {
  isPermittedAiTextPrefix,
  normalizeAiProviderFailure,
  parseAiProviderText,
  type AiProviderFailureCategory,
  type NormalizedAiProviderResult,
} from "@/services/ai/response-parser";

export type AiProviderConfiguration = {
  readonly apiKey: string;
  readonly provider: "gemini";
};

export type AiProviderConfigurationError = {
  readonly category: "configuration";
};

export type AiProviderRequest = {
  readonly prompt: string;
  readonly systemInstruction: string;
};

export type AiProviderStreamEvent =
  | { readonly kind: "text"; readonly text: string }
  | {
      readonly category: "configuration" | "rate_limited" | "timeout" | "unexpected";
      readonly kind: "error";
    };

export type AiProvider = {
  generateResponseStream(
    request: AiProviderRequest,
    signal?: AbortSignal,
  ): AsyncGenerator<AiProviderStreamEvent>;
};

export function getGeminiConfiguration():
  | { readonly ok: true; readonly data: AiProviderConfiguration }
  | { readonly ok: false; readonly error: AiProviderConfigurationError } {
  const env = getGeminiServerEnv();

  return env.ok
    ? { ok: true, data: { provider: "gemini", apiKey: env.data.GEMINI_API_KEY } }
    : { ok: false, error: { category: "configuration" } };
}

function providerFailure(error: unknown): NormalizedAiProviderResult {
  if (error instanceof Error && error.name === "AbortError") {
    return normalizeAiProviderFailure("timeout");
  }
  if (!(error instanceof ApiError)) return normalizeAiProviderFailure("unexpected");
  if (error.status === 401 || error.status === 403) {
    return normalizeAiProviderFailure("configuration");
  }
  // A missing, retired, or unavailable model is a deployment configuration
  // issue, not a temporary outage that callers can resolve by retrying.
  if (error.status === 404) return normalizeAiProviderFailure("configuration");
  if (error.status === 408 || error.status === 504) {
    return normalizeAiProviderFailure("timeout");
  }
  if (error.status === 429) return normalizeAiProviderFailure("rate_limited");
  return normalizeAiProviderFailure("unexpected");
}

function streamFailureCategory(category: AiProviderFailureCategory) {
  return category === "refused" ? "unexpected" : category;
}

export const aiProvider: AiProvider = {
  async *generateResponseStream({ prompt, systemInstruction }, signal) {
    const configuration = getGeminiConfiguration();
    if (!configuration.ok) {
      yield { category: "configuration", kind: "error" };
      return;
    }

    const client = new GoogleGenAI({
      apiKey: configuration.data.apiKey,
      // The Gemini Developer API currently exposes systemInstruction and
      // responseMimeType on v1beta. The model itself remains a stable GA model.
      apiVersion: "v1beta",
    });

    try {
      const response = await client.models.generateContentStream({
        model: DEFAULT_AI_MODEL,
        contents: prompt,
        config: {
          ...(signal ? { abortSignal: signal } : {}),
          candidateCount: 1,
          // The SDK retries 408, 429, and 5xx responses with backoff before
          // streaming starts. Keep this at two total attempts to avoid
          // duplicate requests and to respect Gemini quota limits.
          httpOptions: {
            retryOptions: { attempts: 2 },
            timeout: AI_PROVIDER_TIMEOUT_MS,
          },
          maxOutputTokens: 700,
          responseMimeType: "text/plain",
          systemInstruction,
          temperature: 0.2,
        },
      });

      let completeText = "";
      for await (const chunk of response) {
        if (signal?.aborted) return;

        const text = chunk.text ?? "";
        if (!text) continue;

        completeText += text;
        if (!isPermittedAiTextPrefix(completeText)) {
          yield { category: "unexpected", kind: "error" };
          return;
        }

        yield { kind: "text", text };
      }

      const parsed = parseAiProviderText(completeText);
      if (!parsed.ok) {
        yield { category: streamFailureCategory(parsed.category), kind: "error" };
      }
    } catch (error) {
      const result = providerFailure(error);
      yield {
        category: streamFailureCategory(result.ok ? "unexpected" : result.category),
        kind: "error",
      };
    }
  },
};
