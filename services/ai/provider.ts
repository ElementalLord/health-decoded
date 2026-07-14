import "server-only";

import { ApiError, GoogleGenAI } from "@google/genai";

import { AI_PROVIDER_TIMEOUT_MS } from "@/features/ai/constants/ai-limits";
import { DEFAULT_AI_MODEL } from "@/features/ai/constants/ai-models";
import { getOptionalGeminiServerEnv } from "@/lib/env/server";
import {
  normalizeAiProviderFailure,
  parseAiProviderText,
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

export type AiProvider = {
  generateResponse(request: AiProviderRequest): Promise<NormalizedAiProviderResult>;
};

export function getGeminiConfiguration():
  | { readonly ok: true; readonly data: AiProviderConfiguration }
  | { readonly ok: false; readonly error: AiProviderConfigurationError } {
  const env = getOptionalGeminiServerEnv();

  return env.ok
    ? { ok: true, data: { provider: "gemini", apiKey: env.data.GEMINI_API_KEY } }
    : { ok: false, error: { category: "configuration" } };
}

function providerFailure(error: unknown): NormalizedAiProviderResult {
  if (!(error instanceof ApiError)) return normalizeAiProviderFailure("unexpected");
  if (error.status === 401 || error.status === 403) {
    return normalizeAiProviderFailure("configuration");
  }
  if (error.status === 408 || error.status === 504) {
    return normalizeAiProviderFailure("timeout");
  }
  if (error.status === 429) return normalizeAiProviderFailure("rate_limited");
  return normalizeAiProviderFailure("unexpected");
}

export const aiProvider: AiProvider = {
  async generateResponse({ prompt, systemInstruction }) {
    const configuration = getGeminiConfiguration();
    if (!configuration.ok) return normalizeAiProviderFailure("configuration");

    const client = new GoogleGenAI({ apiKey: configuration.data.apiKey });

    try {
      const response = await client.models.generateContent({
        model: DEFAULT_AI_MODEL,
        contents: prompt,
        config: {
          candidateCount: 1,
          httpOptions: { timeout: AI_PROVIDER_TIMEOUT_MS },
          maxOutputTokens: 700,
          responseMimeType: "text/plain",
          systemInstruction,
          temperature: 0.2,
        },
      });

      return parseAiProviderText(response.text);
    } catch (error) {
      return providerFailure(error);
    }
  },
};
