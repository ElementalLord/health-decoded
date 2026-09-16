import "server-only";

import { ApiError, GoogleGenAI } from "@google/genai";

import { AI_MAX_PROMPT_CHARACTERS } from "@/features/ai/constants/ai-limits";
import {
  AI_DEFAULT_TEMPERATURE,
  DEFAULT_AI_MODEL,
  FALLBACK_AI_MODEL,
} from "@/features/ai/constants/ai-models";
import {
  parseAndValidateAiGatewayGroundedOutput,
  parseAndValidateAiSearchGroundedOutput,
} from "@/features/ai/services/ai-search-grounding";
import { getAiSecurityConfig } from "@/features/ai/services/ai-security-config.server";
import type { AiCredibleSource } from "@/features/ai/types/ai";
import { getAiGatewayServerEnv, getGeminiServerEnv } from "@/lib/env/server";
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
  readonly relevanceContext?: {
    readonly previousQuestion?: string | undefined;
    readonly question: string;
  };
  readonly systemInstruction: string;
};

export type AiStructuredProviderRequest = AiProviderRequest & {
  readonly responseJsonSchema: Readonly<Record<string, unknown>>;
  readonly temperature?: number;
};

export type AiGroundedProviderResult =
  | {
      readonly ok: true;
      readonly sources: readonly AiCredibleSource[];
      readonly text: string;
    }
  | { readonly ok: false; readonly category: AiProviderFailureCategory };

export type AiProviderStreamEvent =
  | { readonly kind: "text"; readonly text: string }
  | {
      readonly category: "configuration" | "rate_limited" | "timeout" | "unexpected";
      readonly kind: "error";
    };

export type AiProvider = {
  generateGroundedResponse(
    request: AiProviderRequest & { readonly temperature?: number },
    signal?: AbortSignal,
  ): Promise<AiGroundedProviderResult>;
  generateResponseStream(
    request: AiProviderRequest,
    signal?: AbortSignal,
  ): AsyncGenerator<AiProviderStreamEvent>;
  generateStructuredResponse(
    request: AiStructuredProviderRequest,
    signal?: AbortSignal,
  ): Promise<NormalizedAiProviderResult>;
};

const globalSearchAvailability = globalThis as typeof globalThis & {
  healthDecodedAiSearchRetryAfter?: number;
  healthDecodedAiGenerationRetryAfter?: Map<string, number>;
};

const generationRetryAfter =
  globalSearchAvailability.healthDecodedAiGenerationRetryAfter ?? new Map<string, number>();
globalSearchAvailability.healthDecodedAiGenerationRetryAfter = generationRetryAfter;

function searchIsCoolingDown(now = Date.now()) {
  return (globalSearchAvailability.healthDecodedAiSearchRetryAfter ?? 0) > now;
}

function recordSearchResult(result: AiGroundedProviderResult, now = Date.now()) {
  if (result.ok) {
    globalSearchAvailability.healthDecodedAiSearchRetryAfter = 0;
  } else if (result.category === "rate_limited") {
    globalSearchAvailability.healthDecodedAiSearchRetryAfter =
      now + getAiSecurityConfig().searchRateLimitCooldownMs;
  }
  return result;
}

export function getGeminiConfiguration():
  | { readonly ok: true; readonly data: AiProviderConfiguration }
  | { readonly ok: false; readonly error: AiProviderConfigurationError } {
  const env = getGeminiServerEnv();

  return env.ok
    ? { ok: true, data: { provider: "gemini", apiKey: env.data.GEMINI_API_KEY } }
    : { ok: false, error: { category: "configuration" } };
}

function providerFailure(
  error: unknown,
): Extract<NormalizedAiProviderResult, { readonly ok: false }> {
  if (error instanceof Error && error.name === "AbortError") {
    return normalizeAiProviderFailure("timeout");
  }
  const status =
    error instanceof ApiError
      ? error.status
      : typeof error === "object" && error && "status" in error && typeof error.status === "number"
        ? error.status
        : undefined;
  if (status === undefined) return normalizeAiProviderFailure("unexpected");
  if (status === 401 || status === 403) {
    return normalizeAiProviderFailure("configuration");
  }
  // A missing, retired, or unavailable model is a deployment configuration
  // issue, not a temporary outage that callers can resolve by retrying.
  if (status === 404) return normalizeAiProviderFailure("configuration");
  if (status === 408 || status === 504) {
    return normalizeAiProviderFailure("timeout");
  }
  if (status === 429) return normalizeAiProviderFailure("rate_limited");
  return normalizeAiProviderFailure("unexpected");
}

function providerStatus(error: unknown) {
  if (!error || typeof error !== "object") return undefined;
  if ("status" in error && typeof error.status === "number") return error.status;
  if ("statusCode" in error && typeof error.statusCode === "number") return error.statusCode;
  return undefined;
}

function isTemporaryModelCapacityFailure(error: unknown) {
  return [500, 502, 503].includes(providerStatus(error) ?? 0);
}

function streamFailureCategory(category: AiProviderFailureCategory) {
  return category === "refused" ? "unexpected" : category;
}

async function generateGatewayGroundedResponse(
  request: AiProviderRequest & { readonly temperature?: number },
  token: string,
  signal?: AbortSignal,
): Promise<AiGroundedProviderResult> {
  const securityConfig = getAiSecurityConfig();
  const timeoutController = new AbortController();
  const timeout = setTimeout(() => timeoutController.abort(), securityConfig.providerTimeoutMs);
  const combinedSignal = signal
    ? AbortSignal.any([signal, timeoutController.signal])
    : timeoutController.signal;

  try {
    const response = await fetch("https://ai-gateway.vercel.sh/v1/responses", {
      body: JSON.stringify({
        input: [
          { content: request.systemInstruction, role: "system", type: "message" },
          { content: request.prompt, role: "user", type: "message" },
        ],
        max_output_tokens: securityConfig.maxOutputTokens,
        model: "openai/gpt-5.4-mini",
        store: false,
        temperature: request.temperature ?? AI_DEFAULT_TEMPERATURE,
        tools: [{ search_context_size: "high", type: "web_search" }],
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      signal: combinedSignal,
    });

    if (!response.ok)
      throw Object.assign(new Error("AI Gateway request failed."), { status: response.status });
    const parsed = parseAndValidateAiGatewayGroundedOutput(
      await response.json(),
      request.relevanceContext,
    );
    return parsed
      ? { ok: true, sources: parsed.sources, text: parsed.answer }
      : normalizeAiProviderFailure("unexpected");
  } catch (error) {
    return providerFailure(error);
  } finally {
    clearTimeout(timeout);
  }
}

async function generateGeminiGroundedResponse(
  request: AiProviderRequest & { readonly temperature?: number },
  signal?: AbortSignal,
): Promise<AiGroundedProviderResult> {
  const configuration = getGeminiConfiguration();
  if (!configuration.ok) return normalizeAiProviderFailure("configuration");

  const client = new GoogleGenAI({
    apiKey: configuration.data.apiKey,
    apiVersion: "v1beta",
  });
  const securityConfig = getAiSecurityConfig();

  for (const model of [DEFAULT_AI_MODEL, FALLBACK_AI_MODEL]) {
    try {
      const interaction = await client.interactions.create(
        {
          generation_config: {
            max_output_tokens: securityConfig.maxOutputTokens,
            temperature: request.temperature ?? AI_DEFAULT_TEMPERATURE,
            tool_choice: "any",
          },
          input: request.prompt,
          model,
          store: false,
          system_instruction: request.systemInstruction,
          tools: [{ type: "google_search" }],
        },
        {
          ...(signal ? { fetchOptions: { signal } } : {}),
          maxRetries: 0,
          timeout: securityConfig.providerTimeoutMs,
        },
      );

      const parsed = parseAndValidateAiSearchGroundedOutput(interaction, request.relevanceContext);
      return parsed
        ? { ok: true, sources: parsed.sources, text: parsed.answer }
        : normalizeAiProviderFailure("unexpected");
    } catch (error) {
      if (
        model === DEFAULT_AI_MODEL &&
        isTemporaryModelCapacityFailure(error) &&
        !signal?.aborted
      ) {
        continue;
      }
      return providerFailure(error);
    }
  }

  return normalizeAiProviderFailure("unexpected");
}

export const aiProvider: AiProvider = {
  async generateGroundedResponse(request, signal) {
    if (request.prompt.length > AI_MAX_PROMPT_CHARACTERS) {
      return normalizeAiProviderFailure("unexpected");
    }
    // Search quota is independent from ordinary model generation. Once the
    // provider confirms it is exhausted, skip repeated doomed search calls for
    // a short period so the reviewed-corpus fallback can answer promptly.
    if (searchIsCoolingDown()) return normalizeAiProviderFailure("rate_limited");

    const gateway = getAiGatewayServerEnv();
    if (gateway.ok) {
      const result = await generateGatewayGroundedResponse(request, gateway.data.token, signal);
      if (result.ok || signal?.aborted) return recordSearchResult(result);
    }

    return recordSearchResult(await generateGeminiGroundedResponse(request, signal));
  },
  async generateStructuredResponse(
    { prompt, responseJsonSchema, systemInstruction, temperature },
    signal,
  ) {
    if (prompt.length > AI_MAX_PROMPT_CHARACTERS) {
      return normalizeAiProviderFailure("unexpected");
    }

    const configuration = getGeminiConfiguration();
    if (!configuration.ok) return normalizeAiProviderFailure("configuration");

    const client = new GoogleGenAI({
      apiKey: configuration.data.apiKey,
      apiVersion: "v1beta",
    });
    const securityConfig = getAiSecurityConfig();

    const models = [DEFAULT_AI_MODEL, FALLBACK_AI_MODEL].filter(
      (model) => (generationRetryAfter.get(model) ?? 0) <= Date.now(),
    );
    if (!models.length) return normalizeAiProviderFailure("rate_limited");

    for (const model of models) {
      try {
        const response = await client.models.generateContent({
          model,
          contents: prompt,
          config: {
            ...(signal ? { abortSignal: signal } : {}),
            candidateCount: 1,
            httpOptions: {
              // Switch models promptly instead of retrying an exhausted quota.
              retryOptions: { attempts: 1 },
              timeout: securityConfig.providerTimeoutMs,
            },
            maxOutputTokens: securityConfig.maxOutputTokens,
            responseJsonSchema,
            responseMimeType: "application/json",
            systemInstruction,
            temperature: temperature ?? AI_DEFAULT_TEMPERATURE,
          },
        });

        generationRetryAfter.delete(model);
        return parseAiProviderText(response.text ?? "");
      } catch (error) {
        if (providerStatus(error) === 429) {
          generationRetryAfter.set(model, Date.now() + 60_000);
        }
        if (
          model === DEFAULT_AI_MODEL &&
          // Generation quotas can differ by model. Try the backup once when
          // the primary is exhausted; this also keeps the companion's
          // reviewed-source fallback and Explain It Back available.
          (isTemporaryModelCapacityFailure(error) || providerStatus(error) === 429) &&
          !signal?.aborted
        ) {
          continue;
        }
        return providerFailure(error);
      }
    }

    return normalizeAiProviderFailure("unexpected");
  },
  async *generateResponseStream({ prompt, systemInstruction }, signal) {
    if (prompt.length > AI_MAX_PROMPT_CHARACTERS) {
      yield { category: "unexpected", kind: "error" };
      return;
    }

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

    const securityConfig = getAiSecurityConfig();

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
            timeout: securityConfig.providerTimeoutMs,
          },
          maxOutputTokens: securityConfig.maxOutputTokens,
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
