"use client";

import { ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  acknowledgeMilestoneAnnouncementsAction,
  getPendingMilestoneAnnouncementsAction,
} from "@/features/achievements/actions/milestone.actions";
import { MilestoneArtwork } from "@/features/achievements/components/milestone-artwork";
import { milestoneDefinitionById } from "@/features/achievements/content/milestone-definitions";
import {
  configureMilestoneQueue,
  flushPendingMilestoneEvents,
  MILESTONE_SYNC_REQUESTED_EVENT,
  type MilestoneSyncDetail,
} from "@/features/achievements/lib/recognize-milestone.client";
import type { MilestoneDefinition } from "@/features/achievements/types/milestone";
import styles from "@/features/achievements/styles/milestones.module.css";

const AUTO_DISMISS_MS = 6500;
const EXIT_MS = 220;
const SYNC_INTERVAL_MS = 4000;
const PARTICLES = 7;

export function MilestoneNotificationHost({ userId }: { userId: string }) {
  configureMilestoneQueue(userId);
  const pathname = usePathname();
  const [queue, setQueue] = useState<readonly MilestoneDefinition[]>([]);
  const [closing, setClosing] = useState(false);
  const [paused, setPaused] = useState(false);
  const seenIdsRef = useRef(new Set<string>());
  const pendingAcknowledgementsRef = useRef(new Set<string>());
  const syncingRef = useRef<Promise<void> | null>(null);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const enqueueMilestones = useCallback((ids: readonly string[]) => {
    const recognized = ids.flatMap((id) => {
      if (seenIdsRef.current.has(id)) return [];
      const definition = milestoneDefinitionById.get(id);
      if (!definition) return [];
      seenIdsRef.current.add(id);
      return [definition];
    });
    if (recognized.length) setQueue((current) => [...current, ...recognized]);
  }, []);

  const acknowledgePending = useCallback(async () => {
    const ids = [...pendingAcknowledgementsRef.current];
    if (!ids.length) return;
    const result = await acknowledgeMilestoneAnnouncementsAction(ids);
    if (result.ok) ids.forEach((id) => pendingAcknowledgementsRef.current.delete(id));
  }, []);

  const sync = useCallback(() => {
    if (syncingRef.current) return syncingRef.current;
    syncingRef.current = (async () => {
      const pendingPromise = getPendingMilestoneAnnouncementsAction();
      void acknowledgePending();
      const result = await pendingPromise;
      if (result.ok) enqueueMilestones(result.milestoneIds);
    })().finally(() => {
      syncingRef.current = null;
    });
    return syncingRef.current;
  }, [acknowledgePending, enqueueMilestones]);

  const synchronize = useCallback(() => {
    void flushPendingMilestoneEvents().finally(sync);
  }, [sync]);

  useEffect(() => {
    function handleSyncRequest(event: Event) {
      const detail = (event as CustomEvent<MilestoneSyncDetail>).detail;
      if (detail?.milestoneIds?.length) enqueueMilestones(detail.milestoneIds);
      synchronize();
    }
    function handleVisibility() {
      if (document.visibilityState === "visible") synchronize();
    }
    synchronize();
    window.addEventListener(MILESTONE_SYNC_REQUESTED_EVENT, handleSyncRequest);
    window.addEventListener("online", synchronize);
    window.addEventListener("focus", synchronize);
    document.addEventListener("visibilitychange", handleVisibility);
    const interval = window.setInterval(synchronize, SYNC_INTERVAL_MS);
    return () => {
      window.removeEventListener(MILESTONE_SYNC_REQUESTED_EVENT, handleSyncRequest);
      window.removeEventListener("online", synchronize);
      window.removeEventListener("focus", synchronize);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.clearInterval(interval);
    };
  }, [enqueueMilestones, synchronize]);

  useEffect(() => {
    void sync();
  }, [pathname, sync]);

  const milestone = queue[0];
  const artworkItem = useMemo(
    () =>
      milestone
        ? { definition: milestone, unlockedAt: new Date().toISOString(), progress: null }
        : null,
    [milestone],
  );

  useEffect(() => {
    if (!milestone) return;
    pendingAcknowledgementsRef.current.add(milestone.id);
    void acknowledgePending();
  }, [acknowledgePending, milestone]);

  const finishDismiss = useCallback(() => {
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    exitTimerRef.current = setTimeout(() => {
      setQueue((current) => current.slice(1));
      setClosing(false);
      setPaused(false);
      exitTimerRef.current = null;
    }, EXIT_MS);
  }, []);

  const beginDismiss = useCallback(() => {
    setClosing(true);
    finishDismiss();
  }, [finishDismiss]);

  useEffect(() => {
    if (!milestone || paused || closing) return;
    const timer = setTimeout(beginDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [beginDismiss, closing, milestone, paused]);

  useEffect(() => {
    if (!milestone || closing) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") beginDismiss();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [beginDismiss, closing, milestone]);

  useEffect(
    () => () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    },
    [],
  );

  if (!milestone || !artworkItem) return null;

  function dismiss() {
    if (!closing) beginDismiss();
  }

  return (
    <div className={styles.notificationViewport}>
      <aside
        aria-atomic="true"
        aria-label={`Milestone unlocked: ${milestone.name}`}
        aria-live="polite"
        className={styles.notification}
        data-category={milestone.category}
        data-state={closing ? "closing" : "open"}
        key={milestone.id}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
        }}
        onFocusCapture={() => setPaused(true)}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        role="status"
      >
        <button
          aria-label="Dismiss milestone notification"
          className={styles.notificationClose}
          onClick={dismiss}
          type="button"
        >
          <X aria-hidden="true" />
        </button>

        <div aria-hidden="true" className={styles.notificationBadgeStage}>
          <span className={styles.notificationAura} />
          <span className={styles.notificationParticles}>
            {Array.from({ length: PARTICLES }, (_, index) => (
              <span key={index} />
            ))}
          </span>
          <span className={styles.notificationBadgeEntrance}>
            <MilestoneArtwork item={artworkItem} variant="celebration" />
          </span>
        </div>

        <div className={styles.notificationCopy}>
          <p>Milestone unlocked</p>
          <strong>{milestone.name}</strong>
          <span>{milestone.description}</span>
        </div>

        <div className={styles.notificationActions}>
          <Link href={`/milestones/${milestone.slug}`}>
            View Milestone
            <ArrowRight aria-hidden="true" />
          </Link>
          {queue.length > 1 ? <small>{queue.length - 1} more waiting</small> : null}
        </div>
      </aside>
    </div>
  );
}
