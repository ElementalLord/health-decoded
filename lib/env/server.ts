import "server-only";

import { z } from "zod";

import { getPublicEnv } from "@/lib/env/public";

const anthropicServerEnvSchema = z.object({
  ANTHROPIC_API_KEY: z.string().trim().min(1),
});

export type AnthropicServerEnv = z.infer<typeof anthropicServerEnvSchema>;

export type AnthropicServerEnvResult =
  { readonly ok: true; readonly data: AnthropicServerEnv } | { readonly ok: false };

export function getServerEnv() {
  if (typeof window !== "undefined") {
    throw new Error("Server environment variables cannot be accessed in the browser.");
  }

  return getPublicEnv();
}

/**
 * AI is intentionally optional until a provider request is enabled. Call this only
 * from server-side provider execution code, never during general app startup.
 */
export function getOptionalAnthropicServerEnv(): AnthropicServerEnvResult {
  const parsed = anthropicServerEnvSchema.safeParse({
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  });

  return parsed.success ? { ok: true, data: parsed.data } : { ok: false };
}
