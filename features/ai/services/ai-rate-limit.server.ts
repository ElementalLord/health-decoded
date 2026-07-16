import "server-only";

import {
  AI_RAPID_REQUEST_INTERVAL_MS,
  AI_RATE_LIMIT_WINDOW_MS,
  AI_REQUESTS_PER_WINDOW,
} from "@/features/ai/constants/ai-limits";

type RequestWindow = {
  readonly requests: number[];
};

const globalRateLimit = globalThis as typeof globalThis & {
  healthDecodedAiRateLimit?: Map<string, RequestWindow>;
};

const requestWindows = globalRateLimit.healthDecodedAiRateLimit ?? new Map<string, RequestWindow>();
globalRateLimit.healthDecodedAiRateLimit = requestWindows;

export function consumeAiRequestSlot(userId: string, now = Date.now()) {
  const windowStart = now - AI_RATE_LIMIT_WINDOW_MS;
  const activeRequests = (requestWindows.get(userId)?.requests ?? []).filter(
    (requestAt) => requestAt > windowStart,
  );
  const lastRequest = activeRequests.at(-1);

  if (
    activeRequests.length >= AI_REQUESTS_PER_WINDOW ||
    (lastRequest !== undefined && now - lastRequest < AI_RAPID_REQUEST_INTERVAL_MS)
  ) {
    requestWindows.set(userId, { requests: activeRequests });
    return false;
  }

  requestWindows.set(userId, { requests: [...activeRequests, now] });

  if (requestWindows.size > 1_000) {
    for (const [key, entry] of requestWindows) {
      if (!entry.requests.some((requestAt) => requestAt > windowStart)) requestWindows.delete(key);
    }
  }

  return true;
}
