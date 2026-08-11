export type FaultScenario =
  | "auth-expired"
  | "browser-storage-failure"
  | "clipboard-denied"
  | "dependency-rejected"
  | "malformed-response"
  | "missing-content"
  | "network-offline"
  | "network-slow"
  | "provider-timeout"
  | "write-rejected";

export const injectedFault = {
  kind: "expected_dependency_failure",
  name: "ExpectedDependencyFailure",
};

export function rejectDependency<T>(): () => Promise<T> {
  return async () => {
    throw new Error("injected dependency failure");
  };
}

export function delayedDependency<T>(
  value: T,
  delayMs: number,
  schedule: (resolve: () => void, milliseconds: number) => unknown = setTimeout,
): () => Promise<T> {
  return () => new Promise((resolve) => schedule(() => resolve(value), delayMs));
}

export function deferredDependency<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, reject, resolve };
}

export function denyClipboard() {
  return { writeText: rejectDependency<void>() };
}

export function failStorage() {
  return {
    getItem: rejectDependency<string | null>(),
    removeItem: rejectDependency<void>(),
    setItem: rejectDependency<void>(),
  };
}

export function malformedResponse(value: unknown = { unexpected: true }) {
  return value;
}

export function partialResponse<T extends object>(value: T, missing: keyof T) {
  const copy = { ...value };
  delete copy[missing];
  return copy as Partial<T>;
}
