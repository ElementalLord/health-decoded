"use client";

import { recognizeMilestoneAction } from "@/features/achievements/actions/milestone.actions";
import type { MilestoneEvent } from "@/features/achievements/types/milestone";
import { safeGetLocalStorage, safeSetLocalStorage } from "@/lib/storage/safe-local-storage";

export const MILESTONE_SYNC_REQUESTED_EVENT = "health-decoded:milestone-sync-requested";
export type MilestoneSyncDetail = { readonly milestoneIds: readonly string[] };
const PENDING_EVENTS_KEY_PREFIX = "health-decoded:pending-milestone-events";
let pendingEventsKey = `${PENDING_EVENTS_KEY_PREFIX}:unscoped`;
let memoryQueue: MilestoneEvent[] = [];
let activeFlush: Promise<void> | null = null;
let ignoreStoredQueue = false;

function eventKey(event: MilestoneEvent) {
  return JSON.stringify(event);
}

function readQueue() {
  if (ignoreStoredQueue) return memoryQueue;
  const stored = safeGetLocalStorage(pendingEventsKey);
  if (!stored) return memoryQueue;
  try {
    const parsed = JSON.parse(stored) as unknown;
    if (!Array.isArray(parsed)) return memoryQueue;
    const storedQueue = parsed.filter(
      (event): event is MilestoneEvent =>
        Boolean(event) && typeof event === "object" && "event" in event,
    );
    return [...storedQueue, ...memoryQueue].filter(
      (event, index, queue) =>
        queue.findIndex((item) => eventKey(item) === eventKey(event)) === index,
    );
  } catch {
    return memoryQueue;
  }
}

function writeQueue(queue: readonly MilestoneEvent[]) {
  memoryQueue = [...queue];
  ignoreStoredQueue = !safeSetLocalStorage(pendingEventsKey, JSON.stringify(queue));
}

export function configureMilestoneQueue(userId: string) {
  const nextKey = `${PENDING_EVENTS_KEY_PREFIX}:${userId}`;
  if (nextKey === pendingEventsKey) return;
  pendingEventsKey = nextKey;
  memoryQueue = [];
  ignoreStoredQueue = false;
}

function enqueue(event: MilestoneEvent) {
  const queue = readQueue();
  const key = eventKey(event);
  if (!queue.some((queued) => eventKey(queued) === key)) writeQueue([...queue, event]);
}

export function requestMilestoneSync(milestoneIds: readonly string[] = []) {
  window.dispatchEvent(
    new CustomEvent<MilestoneSyncDetail>(MILESTONE_SYNC_REQUESTED_EVENT, {
      detail: { milestoneIds },
    }),
  );
}

export function flushPendingMilestoneEvents() {
  if (activeFlush) return activeFlush;
  activeFlush = (async () => {
    while (true) {
      const [event] = readQueue();
      if (!event) return;
      try {
        const result = await recognizeMilestoneAction(event);
        const key = eventKey(event);
        if (!result.ok) {
          if (!result.retryable) {
            writeQueue(readQueue().filter((queued) => eventKey(queued) !== key));
            continue;
          }
          return;
        }
        const remaining = readQueue().filter((queued) => eventKey(queued) !== key);
        writeQueue(remaining);
        requestMilestoneSync(result.milestoneIds);
      } catch {
        return;
      }
    }
  })().finally(() => {
    activeFlush = null;
  });
  return activeFlush;
}

export async function recognizeMilestone(event: MilestoneEvent) {
  enqueue(event);
  await flushPendingMilestoneEvents();
}
