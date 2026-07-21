import { ArrowRight, CheckCircle2, Circle, LockKeyhole, MapPin } from "lucide-react";
import Link from "next/link";

import type {
  CompletedLessonHistoryEntry,
  ConfidenceHistoryEntry,
  ProgressMilestone,
  ProgressMilestoneState,
} from "@/features/progress/types/progress";
import { cn } from "@/lib/utils";

const stateDetails: Record<ProgressMilestoneState, { icon: typeof Circle; label: string }> = {
  completed_with_check_in: { icon: CheckCircle2, label: "Complete" },
  completed: { icon: CheckCircle2, label: "Complete" },
  current: { icon: MapPin, label: "Current lesson" },
  locked: { icon: LockKeyhole, label: "Coming up" },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function LearningRecord({
  completedLessons,
  confidenceHistory,
  milestones,
}: {
  completedLessons: CompletedLessonHistoryEntry[];
  confidenceHistory: ConfidenceHistoryEntry[];
  milestones: ProgressMilestone[];
}) {
  const completionByDay = new Map(completedLessons.map((entry) => [entry.dayNumber, entry]));
  const confidenceByDay = new Map(confidenceHistory.map((entry) => [entry.dayNumber, entry]));

  return (
    <section aria-labelledby="learning-record-title" className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <h2
            className="font-serif-display text-[length:var(--text-section-title)] font-medium tracking-tight"
            id="learning-record-title"
          >
            Your learning record
          </h2>
          <p className="max-w-2xl text-pretty text-sm leading-6 text-muted-foreground">
            Lessons, confidence check-ins, and milestones together in one place.
          </p>
        </div>
        <p className="text-sm font-semibold text-muted-foreground">
          {completedLessons.length} of {milestones.length} complete
        </p>
      </div>

      <ol className="motion-reveal-list stagger-children grid gap-2 sm:grid-cols-2">
        {milestones.map((milestone) => {
          const details = stateDetails[milestone.state];
          const Icon = details.icon;
          const completion = completionByDay.get(milestone.dayNumber);
          const confidence = confidenceByDay.get(milestone.dayNumber);
          const isCompleted = milestone.state.startsWith("completed");
          const content = (
            <>
              <span
                className={cn(
                  "inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground",
                  isCompleted && "bg-success/12 text-success",
                  milestone.state === "current" && "bg-accent-warm/12 text-accent-warm",
                )}
              >
                <Icon aria-hidden="true" className="size-4.5" strokeWidth={2} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  Day {milestone.dayNumber} · {details.label}
                </span>
                <span
                  className={cn(
                    "mt-1 block font-serif-display text-lg font-semibold leading-snug text-foreground",
                    milestone.state === "locked" && "text-muted-foreground",
                  )}
                >
                  {milestone.lessonTitle ?? "Future lesson"}
                </span>
                {completion ? (
                  <span className="mt-1.5 block text-xs leading-5 text-muted-foreground">
                    {formatDate(completion.completedAt)} · {completion.xpAwarded} XP
                    {completion.confidenceLabel
                      ? ` · ${completion.confidenceLabel}`
                      : confidence
                        ? ` · ${confidence.confidenceLabel}`
                        : ""}
                  </span>
                ) : milestone.confidenceLabel ? (
                  <span className="mt-1.5 block text-xs leading-5 text-muted-foreground">
                    {milestone.confidenceLabel}
                  </span>
                ) : null}
              </span>
              {isCompleted ? (
                <ArrowRight
                  aria-hidden="true"
                  className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-[var(--duration-fast)] group-hover:translate-x-1 group-hover:text-foreground"
                />
              ) : null}
            </>
          );

          return (
            <li key={milestone.dayNumber}>
              {isCompleted ? (
                <Link
                  aria-label={`Review day ${milestone.dayNumber}: ${milestone.lessonTitle}`}
                  className="group flex h-full min-h-24 items-start gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4 transition-[border-color,box-shadow] duration-[var(--duration-fast)] hover:border-accent-warm/45 hover:shadow-[var(--shadow-card)]"
                  href={`/lessons/${milestone.dayNumber}`}
                >
                  {content}
                </Link>
              ) : (
                <div
                  className={cn(
                    "flex h-full min-h-24 items-start gap-3 rounded-[var(--radius-lg)] border border-border/75 p-4",
                    milestone.state === "current" && "border-accent-warm/40 bg-accent-warm/5",
                    milestone.state === "locked" && "bg-muted/25",
                  )}
                >
                  {content}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {completedLessons.length === 0 ? (
        <p className="text-sm leading-6 text-muted-foreground">
          Your check-ins and lesson history will build here as you learn.
        </p>
      ) : null}
    </section>
  );
}
