"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { milestoneDefinitionById } from "@/features/achievements/content/milestone-definitions";
import { MILESTONE_RECOGNIZED_EVENT } from "@/features/achievements/lib/recognize-milestone.client";
import type { MilestoneDefinition } from "@/features/achievements/types/milestone";
import styles from "@/features/achievements/styles/milestones.module.css";

export function MilestoneNotificationHost() {
  const [queue, setQueue] = useState<readonly MilestoneDefinition[]>([]);
  const priorFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    function handle(event: Event) {
      const ids = (event as CustomEvent<unknown>).detail;
      if (!Array.isArray(ids)) return;
      const recognized: MilestoneDefinition[] = ids.flatMap((id) => {
        const definition = typeof id === "string" ? milestoneDefinitionById.get(id) : undefined;
        return definition ? [definition] : [];
      });
      if (recognized.length) {
        priorFocusRef.current = document.activeElement as HTMLElement | null;
        setQueue((current) => [
          ...current,
          ...recognized.filter(
            (definition) => !current.some((item) => item.id === definition.id),
          ),
        ]);
      }
    }
    window.addEventListener(MILESTONE_RECOGNIZED_EVENT, handle);
    return () => window.removeEventListener(MILESTONE_RECOGNIZED_EVENT, handle);
  }, []);

  const milestone = queue[0];
  if (!milestone) return null;
  function dismiss() {
    setQueue((current) => current.slice(1));
    if (queue.length === 1) priorFocusRef.current?.focus();
  }
  return (
    <aside aria-live="polite" className={styles.notification} role="status">
      <div>
        <p>Milestone recognized: {milestone.name}</p>
        <span>{milestone.description}</span>
      </div>
      <Link href={`/milestones#${milestone.slug}`}>View milestone</Link>
      <button
        aria-label="Dismiss milestone notification"
        onClick={dismiss}
        type="button"
      >
        <X aria-hidden="true" />
      </button>
    </aside>
  );
}
