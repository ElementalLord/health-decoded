import "server-only";

import { z } from "zod";

import { getPublicEnv } from "@/lib/env/public";

const geminiServerEnvSchema = z.object({
  GEMINI_API_KEY: z
    .string()
    .trim()
    // Gemini API keys are transitioning from legacy traffic keys (`AIza…`)
    // to Auth keys (`AQ.…`). Both are valid server-side credentials.
    .regex(/^(?:AIza[\w-]{20,}|AQ\.[\w-]{20,})$/, "Invalid Gemini API key format."),
});

export type GeminiServerEnv = z.infer<typeof geminiServerEnvSchema>;

export type GeminiServerEnvResult =
  { readonly ok: true; readonly data: GeminiServerEnv } | { readonly ok: false };

const aiGatewayServerEnvSchema = z.object({
  token: z.string().trim().min(1),
});

export type AiGatewayServerEnvResult =
  { readonly ok: true; readonly data: { readonly token: string } } | { readonly ok: false };

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

/**
 * Vercel supplies a short-lived OIDC token automatically in deployments. A
 * regular AI Gateway key is also supported for local development.
 */
export function getAiGatewayServerEnv(): AiGatewayServerEnvResult {
  // Vercel CLI writes a short-lived OIDC token to .env.local when it links a
  // project. That token is only refreshed inside a Vercel deployment; treating
  // a stale local copy as a gateway credential adds a doomed request before the
  // Gemini fallback. An explicit gateway key remains valid in every environment.
  const vercelOidcToken = process.env.VERCEL === "1" ? process.env.VERCEL_OIDC_TOKEN : undefined;
  const parsed = aiGatewayServerEnvSchema.safeParse({
    token: process.env.AI_GATEWAY_API_KEY ?? vercelOidcToken,
  });

  return parsed.success ? { ok: true, data: parsed.data } : { ok: false };
}
