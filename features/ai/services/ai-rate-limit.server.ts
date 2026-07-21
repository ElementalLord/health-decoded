import "server-only";

import { createHash } from "node:crypto";

import { getAiSecurityConfig } from "@/features/ai/services/ai-security-config.server";

export type AiRateLimitReason =
  "blocked" | "daily" | "duplicate" | "hourly" | "minute" | "network" | "rapid";

export type AiRateLimitDecision =
  { readonly allowed: true } | { readonly allowed: false; readonly reason: AiRateLimitReason };

type RequestRecord = {
  readonly at: number;
  readonly fingerprint: string;
};

type RequestWindow = {
  blockedUntil: number;
  requests: RequestRecord[];
  violations: number;
};

const globalRateLimit = globalThis as typeof globalThis & {
  healthDecodedAiNetworkRateLimit?: Map<string, number[]>;
  healthDecodedAiUserRateLimit?: Map<string, RequestWindow>;
};

const userWindows =
  globalRateLimit.healthDecodedAiUserRateLimit ?? new Map<string, RequestWindow>();
const networkWindows =
  globalRateLimit.healthDecodedAiNetworkRateLimit ?? new Map<string, number[]>();
globalRateLimit.healthDecodedAiUserRateLimit = userWindows;
globalRateLimit.healthDecodedAiNetworkRateLimit = networkWindows;

export function fingerprintAiRequest(message: string) {
  return createHash("sha256").update(message.trim().toLocaleLowerCase()).digest("hex");
}

function activeSince(records: readonly RequestRecord[], start: number) {
  return records.filter((record) => record.at > start);
}

function progressiveBlock(window: RequestWindow, now: number, baseBlockMs: number) {
  const violations = Math.min(window.violations + 1, 8);
  window.violations = violations;
  window.blockedUntil = now + Math.min(baseBlockMs * 2 ** (violations - 1), 24 * 60 * 60_000);
}

function cleanup(now: number) {
  const dayStart = now - 24 * 60 * 60_000;
  if (userWindows.size > 1_000) {
    for (const [key, window] of userWindows) {
      if (window.blockedUntil <= now && !window.requests.some((request) => request.at > dayStart)) {
        userWindows.delete(key);
      }
    }
  }
  if (networkWindows.size > 1_000) {
    const minuteStart = now - 60_000;
    for (const [key, requests] of networkWindows) {
      if (!requests.some((requestAt) => requestAt > minuteStart)) networkWindows.delete(key);
    }
  }
}

export function consumeAiRequestSlot(
  input: {
    readonly fingerprint: string;
    readonly networkKey: string;
    readonly sensitive?: boolean;
    readonly userId: string;
  },
  now = Date.now(),
): AiRateLimitDecision {
  const config = getAiSecurityConfig();
  const minuteStart = now - 60_000;
  const hourStart = now - 60 * 60_000;
  const dayStart = now - 24 * 60 * 60_000;
  const duplicateStart = now - config.duplicateWindowMs;
  const existing = userWindows.get(input.userId) ?? {
    blockedUntil: 0,
    requests: [],
    violations: 0,
  };
  existing.requests = activeSince(existing.requests, dayStart);

  if (existing.blockedUntil > now) {
    userWindows.set(input.userId, existing);
    return { allowed: false, reason: "blocked" };
  }

  const activeNetworkRequests = (networkWindows.get(input.networkKey) ?? []).filter(
    (requestAt) => requestAt > minuteStart,
  );
  const minuteRequests = activeSince(existing.requests, minuteStart);
  const hourRequests = activeSince(existing.requests, hourStart);
  const lastRequest = existing.requests.at(-1);
  const duplicateCount = existing.requests.filter(
    (request) => request.at > duplicateStart && request.fingerprint === input.fingerprint,
  ).length;

  let reason: AiRateLimitReason | null = null;
  if (lastRequest && now - lastRequest.at < config.rapidRequestIntervalMs) {
    reason = "rapid";
  } else if (duplicateCount >= config.duplicateRequestLimit) {
    reason = "duplicate";
  } else if (minuteRequests.length >= config.requestsPerMinute) {
    reason = "minute";
  } else if (hourRequests.length >= config.requestsPerHour) {
    reason = "hourly";
  } else if (existing.requests.length >= config.requestsPerDay) {
    reason = "daily";
  } else if (activeNetworkRequests.length >= config.networkRequestsPerMinute) {
    reason = "network";
  }

  if (reason) {
    progressiveBlock(existing, now, config.abuseBlockMs);
    userWindows.set(input.userId, existing);
    networkWindows.set(input.networkKey, activeNetworkRequests);
    cleanup(now);
    return { allowed: false, reason };
  }

  if (existing.violations > 0 && now - (lastRequest?.at ?? 0) > 60 * 60_000) {
    existing.violations -= 1;
  }
  existing.requests.push({ at: now, fingerprint: input.fingerprint });
  if (input.sensitive) progressiveBlock(existing, now, config.abuseBlockMs);
  userWindows.set(input.userId, existing);
  networkWindows.set(input.networkKey, [...activeNetworkRequests, now]);
  cleanup(now);
  return { allowed: true };
}
