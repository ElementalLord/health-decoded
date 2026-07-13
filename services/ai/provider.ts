import "server-only";

import { getOptionalAnthropicServerEnv } from "@/lib/env/server";

export type AiProviderConfiguration = {
  readonly apiKey: string;
  readonly provider: "anthropic";
};

export type AiProviderConfigurationError = {
  readonly category: "configuration";
};

export type AiProviderRequest = {
  readonly prompt: string;
};

export type AiProvider = {
  generate(request: AiProviderRequest): Promise<unknown>;
};

/**
 * Lazy configuration validation for the future Anthropic adapter. This does not
 * create a client or make a provider request.
 */
export function getAnthropicConfiguration():
  | { readonly ok: true; readonly data: AiProviderConfiguration }
  | { readonly ok: false; readonly error: AiProviderConfigurationError } {
  const env = getOptionalAnthropicServerEnv();

  return env.ok
    ? { ok: true, data: { provider: "anthropic", apiKey: env.data.ANTHROPIC_API_KEY } }
    : { ok: false, error: { category: "configuration" } };
}
