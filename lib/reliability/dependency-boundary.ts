import type { Result } from "@/lib/result/result";

/** Marks a known external dependency failure at an adapter boundary. */
export class ExpectedDependencyFailure extends Error {
  readonly kind = "expected_dependency_failure";

  constructor(message = "Expected external dependency failure") {
    super(message);
    this.name = "ExpectedDependencyFailure";
  }
}

function hasExpectedHttpStatus(error: unknown) {
  if (!error || typeof error !== "object" || !("status" in error)) return false;
  const status = error.status;
  return typeof status === "number" && [408, 429, 500, 502, 503, 504].includes(status);
}

/**
 * Only known transport, timeout, and adapter-branded dependency failures are
 * normalized. Programming errors and broken invariants deliberately rethrow so
 * the route's normal error boundary and monitoring can surface them.
 */
export function isExpectedDependencyFailure(error: unknown) {
  if (error instanceof ExpectedDependencyFailure || hasExpectedHttpStatus(error)) return true;
  if (error instanceof DOMException && error.name === "AbortError") return true;
  if (!(error instanceof Error)) return false;
  if (error.name === "AbortError") return true;
  return (
    error instanceof TypeError && /fetch|network|networkerror|load failed/i.test(error.message)
  );
}

/**
 * Converts a rejected dependency promise into the same Result failure shape used
 * for ordinary provider/database errors, but only when the rejection is an
 * expected external dependency failure. The callback must only record safe,
 * non-user-authored metadata.
 */
export async function settleResult<T, E>(
  operation: () => Promise<Result<T, E>>,
  failure: E,
  onRejected?: () => void,
): Promise<Result<T, E>> {
  try {
    return await operation();
  } catch (error) {
    if (!isExpectedDependencyFailure(error)) throw error;
    onRejected?.();
    return { ok: false, error: failure };
  }
}

/** Contains only expected optional dependency failures; programmer errors rethrow. */
export async function settleOptional<T>(
  operation: () => PromiseLike<T> | T,
  fallback: T,
  onRejected?: () => void,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (!isExpectedDependencyFailure(error)) throw error;
    onRejected?.();
    return fallback;
  }
}
