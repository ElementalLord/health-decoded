import { ArrowRight, CheckCircle2, ChevronDown, Circle, LockKeyhole, MapPin } from "lucide-react";
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

const learningSections = [
  { dayRange: "Days 1–5", maximumDay: 5, minimumDay: 1, number: 1, title: "Foundations" },
  { dayRange: "Days 6–10", maximumDay: 10, minimumDay: 6, number: 2, title: "Daily tools" },
  { dayRange: "Days 11–14", maximumDay: 14, minimumDay: 11, number: 3, title: "Looking ahead" },
] as const;

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function MilestoneEntry({
  completion,
  confidence,
  milestone,
}: {
  completion: CompletedLessonHistoryEntry | undefined;
  confidence: ConfidenceHistoryEntry | undefined;
  milestone: ProgressMilestone;
}) {
  const details = stateDetails[milestone.state];
  const Icon = details.icon;
  const isCompleted = milestone.state.startsWith("completed");
  const content = (
    <>
      <span
        className={cn(
          "inline-flex size-9 shrink-0 items-center justify-center rounded-[3px] border border-border bg-muted text-muted-foreground",
          isCompleted && "border-success/25 bg-success/12 text-success",
          milestone.state === "current" &&
            "border-accent-warm/30 bg-accent-warm/12 text-accent-warm",
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
            "mt-1 block font-serif-display text-lg font-semibold leading-snug text-info-foreground",
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
    <li>
      {isCompleted ? (
        <Link
          aria-label={`Review day ${milestone.dayNumber}: ${milestone.lessonTitle}`}
          className="group flex h-full min-h-24 items-start gap-3 rounded-[4px] border border-border bg-card p-4 transition-[border-color,box-shadow] duration-[var(--duration-fast)] hover:border-accent-warm/45 hover:shadow-[4px_4px_0_rgb(68_47_37/0.06)]"
          href={`/lessons/${milestone.dayNumber}`}
        >
          {content}
        </Link>
      ) : (
        <div
          className={cn(
            "flex h-full min-h-24 items-start gap-3 rounded-[4px] border border-border/75 p-4",
            milestone.state === "current" && "border-accent-warm/40 bg-accent-warm/5",
            milestone.state === "locked" && "bg-muted/25",
          )}
        >
          {content}
        </div>
      )}
    </li>
  );
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
            className="font-serif-display text-[length:var(--text-section-title)] font-medium tracking-tight text-success"
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

      <div className="motion-reveal-list stagger-children space-y-3">
        {learningSections.map((section) => {
          const sectionMilestones = milestones.filter(
            (milestone) =>
              milestone.dayNumber >= section.minimumDay &&
              milestone.dayNumber <= section.maximumDay,
          );
          const completedInSection = sectionMilestones.filter((milestone) =>
            milestone.state.startsWith("completed"),
          ).length;

          return (
            <details
              className="group/learning-section overflow-hidden rounded-[6px] border border-border bg-card"
              key={section.number}
            >
              <summary className="grid min-h-20 cursor-pointer list-none grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-4 transition-colors duration-[var(--duration-fast)] hover:bg-muted/30 sm:px-6 [&::-webkit-details-marker]:hidden">
                <span className="font-serif-display text-4xl font-light leading-none text-success/85">
                  0{section.number}
                </span>
                <span>
                  <span className="block font-serif-display text-xl font-semibold text-success sm:text-2xl">
                    {section.title}
                  </span>
                  <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                    {section.dayRange} · {completedInSection} of {sectionMilestones.length} complete
                  </span>
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className="size-5 text-muted-foreground transition-transform duration-[var(--duration-normal)] group-open/learning-section:rotate-180"
                />
              </summary>
              <div className="border-t border-border bg-background/35 p-3 sm:p-5">
                {sectionMilestones.length ? (
                  <ol className="grid gap-2 sm:grid-cols-2">
                    {sectionMilestones.map((milestone) => (
                      <MilestoneEntry
                        completion={completionByDay.get(milestone.dayNumber)}
                        confidence={confidenceByDay.get(milestone.dayNumber)}
                        key={milestone.dayNumber}
                        milestone={milestone}
                      />
                    ))}
                  </ol>
                ) : (
                  <p className="py-3 text-sm leading-6 text-muted-foreground">
                    Lessons for this section will appear here as the journey grows.
                  </p>
                )}
              </div>
            </details>
          );
        })}
      </div>

      {completedLessons.length === 0 ? (
        <p className="text-sm leading-6 text-muted-foreground">
          Your check-ins and lesson history will build here as you learn.
        </p>
      ) : null}
    </section>
  );
}
