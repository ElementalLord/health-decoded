import "server-only";

import { z } from "zod";

import { getPublicEnv } from "@/lib/env/public";

const geminiServerEnvSchema = z.object({
  GEMINI_API_KEY: z.string().trim().min(1),
});

export type GeminiServerEnv = z.infer<typeof geminiServerEnvSchema>;

export type GeminiServerEnvResult =
  { readonly ok: true; readonly data: GeminiServerEnv } | { readonly ok: false };

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
export function getOptionalGeminiServerEnv(): GeminiServerEnvResult {
  const parsed = geminiServerEnvSchema.safeParse({
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  });

  return parsed.success ? { ok: true, data: parsed.data } : { ok: false };
}
