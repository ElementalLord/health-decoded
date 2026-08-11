export type LatestRequest = {
  readonly begin: () => number;
  readonly invalidate: () => void;
  readonly isCurrent: (requestId: number) => boolean;
};

/** Prevents an older async response from overwriting state owned by a newer request. */
export function createLatestRequest(): LatestRequest {
  let current = 0;
  return {
    begin() {
      current += 1;
      return current;
    },
    invalidate() {
      current += 1;
    },
    isCurrent(requestId) {
      return requestId === current;
    },
  };
}
