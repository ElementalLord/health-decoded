import "server-only";

import { z } from "zod";

const integerSetting = (fallback: number, minimum: number, maximum: number) =>
  z.coerce.number().int().min(minimum).max(maximum).default(fallback);

const aiSecurityConfigSchema = z
  .object({
    abuseBlockMs: integerSetting(30_000, 30_000, 24 * 60 * 60_000),
    circuitBreakerCooldownMs: integerSetting(2 * 60_000, 10_000, 30 * 60_000),
    circuitBreakerFailureThreshold: integerSetting(5, 2, 50),
    duplicateRequestLimit: integerSetting(3, 2, 20),
    duplicateWindowMs: integerSetting(2 * 60_000, 10_000, 30 * 60_000),
    globalProviderCallsPerDay: integerSetting(2_000, 10, 1_000_000),
    globalProviderCallsPerMinute: integerSetting(200, 5, 10_000),
    maxOutputTokens: integerSetting(700, 100, 2_000),
    networkRequestsPerMinute: integerSetting(30, 5, 1_000),
    providerTimeoutMs: integerSetting(30_000, 5_000, 60_000),
    rapidRequestIntervalMs: integerSetting(750, 100, 10_000),
    requestsPerDay: integerSetting(120, 10, 10_000),
    requestsPerHour: integerSetting(40, 5, 2_000),
    requestsPerMinute: integerSetting(10, 2, 200),
  })
  .strict();

export type AiSecurityConfig = z.infer<typeof aiSecurityConfigSchema>;

const safeDefaults = aiSecurityConfigSchema.parse({});

/**
 * Centralized, server-only AI security limits. Invalid overrides fail closed to
 * conservative defaults instead of disabling a guardrail during deployment.
 */
export function getAiSecurityConfig(): AiSecurityConfig {
  const parsed = aiSecurityConfigSchema.safeParse({
    abuseBlockMs: process.env.AI_ABUSE_BLOCK_MS,
    circuitBreakerCooldownMs: process.env.AI_CIRCUIT_BREAKER_COOLDOWN_MS,
    circuitBreakerFailureThreshold: process.env.AI_CIRCUIT_BREAKER_FAILURE_THRESHOLD,
    duplicateRequestLimit: process.env.AI_DUPLICATE_REQUEST_LIMIT,
    duplicateWindowMs: process.env.AI_DUPLICATE_WINDOW_MS,
    globalProviderCallsPerDay: process.env.AI_GLOBAL_PROVIDER_CALLS_PER_DAY,
    globalProviderCallsPerMinute: process.env.AI_GLOBAL_PROVIDER_CALLS_PER_MINUTE,
    maxOutputTokens: process.env.AI_MAX_OUTPUT_TOKENS,
    networkRequestsPerMinute: process.env.AI_NETWORK_REQUESTS_PER_MINUTE,
    providerTimeoutMs: process.env.AI_PROVIDER_TIMEOUT_MS,
    rapidRequestIntervalMs: process.env.AI_RAPID_REQUEST_INTERVAL_MS,
    requestsPerDay: process.env.AI_REQUESTS_PER_DAY,
    requestsPerHour: process.env.AI_REQUESTS_PER_HOUR,
    requestsPerMinute: process.env.AI_REQUESTS_PER_MINUTE,
  });

  return parsed.success ? parsed.data : safeDefaults;
}
