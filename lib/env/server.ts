import "server-only";

import { z } from "zod";

import { getPublicEnv } from "@/lib/env/public";

const geminiServerEnvSchema = z.object({
  GEMINI_API_KEY: z
    .string()
    .trim()
    .regex(/^AIza[\w-]{20,}$/, "Invalid Gemini API key format."),
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

/** Call only from server-side Gemini provider code, never during general app startup. */
export function getGeminiServerEnv(): GeminiServerEnvResult {
  const parsed = geminiServerEnvSchema.safeParse({
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  });

  return parsed.success ? { ok: true, data: parsed.data } : { ok: false };
}
