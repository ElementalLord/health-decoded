import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import type { CompletedLessonHistoryEntry } from "@/features/progress/types/progress";
import { cn } from "@/lib/utils";

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function CompletedLessonsList({ entries }: { entries: CompletedLessonHistoryEntry[] }) {
  return (
    <section aria-labelledby="completed-lessons-title" className="space-y-5">
      <div className="space-y-1.5">
        <h2
          className="font-serif-display text-[length:var(--text-section-title)] font-medium tracking-tight"
          id="completed-lessons-title"
        >
          Completed lessons
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Review any completed lesson whenever it feels helpful.
        </p>
      </div>

      {entries.length ? (
        <ul className="motion-reveal-list stagger-children divide-y divide-border border-y border-border">
          {entries.map((entry) => (
            <li
              className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
              key={entry.dayNumber}
            >
              <div>
                <p className="font-medium">
                  Day {entry.dayNumber}: {entry.lessonTitle}
                </p>
                <p className="text-sm text-muted-foreground">
                  Completed {formatDate(entry.completedAt)} · {entry.xpAwarded} Confidence XP
                  {entry.confidenceLabel ? ` · ${entry.confidenceLabel}` : ""}
                </p>
              </div>
              <Link
                className={cn(buttonVariants({ fullWidth: false, variant: "text" }), "min-h-11")}
                href={`/lessons/${entry.dayNumber}`}
              >
                Review lesson
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm leading-6 text-muted-foreground">
          Your progress will appear here after you complete your first lesson.
        </p>
      )}
    </section>
  );
}
