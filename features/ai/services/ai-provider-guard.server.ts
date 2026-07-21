import "server-only";

import { getAiSecurityConfig } from "@/features/ai/services/ai-security-config.server";

type ProviderGuardState = {
  consecutiveFailures: number;
  dailyCalls: number[];
  minuteCalls: number[];
  openUntil: number;
};

const globalProviderGuard = globalThis as typeof globalThis & {
  healthDecodedAiProviderGuard?: ProviderGuardState;
};

const state = globalProviderGuard.healthDecodedAiProviderGuard ?? {
  consecutiveFailures: 0,
  dailyCalls: [],
  minuteCalls: [],
  openUntil: 0,
};
globalProviderGuard.healthDecodedAiProviderGuard = state;

export type AiProviderGuardReason = "budget" | "circuit";

export function consumeAiProviderBudget(
  now = Date.now(),
):
  { readonly allowed: true } | { readonly allowed: false; readonly reason: AiProviderGuardReason } {
  const config = getAiSecurityConfig();
  if (state.openUntil > now) return { allowed: false, reason: "circuit" };

  state.minuteCalls = state.minuteCalls.filter((requestAt) => requestAt > now - 60_000);
  state.dailyCalls = state.dailyCalls.filter((requestAt) => requestAt > now - 24 * 60 * 60_000);
  if (
    state.minuteCalls.length >= config.globalProviderCallsPerMinute ||
    state.dailyCalls.length >= config.globalProviderCallsPerDay
  ) {
    return { allowed: false, reason: "budget" };
  }

  state.minuteCalls.push(now);
  state.dailyCalls.push(now);
  return { allowed: true };
}

export function recordAiProviderFailure(now = Date.now()) {
  const config = getAiSecurityConfig();
  state.consecutiveFailures += 1;
  if (state.consecutiveFailures >= config.circuitBreakerFailureThreshold) {
    state.openUntil = now + config.circuitBreakerCooldownMs;
    state.consecutiveFailures = 0;
  }
}

export function recordAiProviderSuccess() {
  state.consecutiveFailures = 0;
  state.openUntil = 0;
}
