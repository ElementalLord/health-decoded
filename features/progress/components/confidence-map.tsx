import { CheckCircle2, Circle, LockKeyhole, MapPin } from "lucide-react";

import type { ProgressMilestone, ProgressMilestoneState } from "@/features/progress/types/progress";
import { cn } from "@/lib/utils";

const stateDetails: Record<ProgressMilestoneState, { label: string; icon: typeof Circle }> = {
  completed_with_check_in: { icon: CheckCircle2, label: "Completed with check-in" },
  completed: { icon: CheckCircle2, label: "Completed" },
  current: { icon: MapPin, label: "Current lesson" },
  locked: { icon: LockKeyhole, label: "Locked" },
};

export function ConfidenceMap({ milestones }: { milestones: ProgressMilestone[] }) {
  return (
    <section aria-labelledby="confidence-map-title" className="space-y-5">
      <div className="space-y-1.5">
        <h2
          className="font-serif-display text-[length:var(--text-section-title)] font-medium tracking-tight"
          id="confidence-map-title"
        >
          Confidence Map
        </h2>
        <p className="max-w-2xl text-pretty text-sm leading-6 text-muted-foreground">
          A record of the ideas you have explored, one step at a time.
        </p>
      </div>

      <ol
        aria-label="Journey milestones"
        className="motion-reveal-list stagger-children border-y border-border"
      >
        {milestones.map((milestone) => {
          const details = stateDetails[milestone.state];
          const Icon = details.icon;
          const title = milestone.lessonTitle ?? "Future lesson";

          return (
            <li
              className={cn(
                "grid grid-cols-[3rem_1.5rem_1fr] items-start gap-3 border-b border-border px-1 py-5 transition duration-[var(--duration-fast)] last:border-b-0 sm:grid-cols-[4rem_1.5rem_1fr] sm:py-6",
                milestone.state === "current" &&
                  "border-l-2 border-l-accent-warm bg-accent-warm/5 pl-4",
                milestone.state === "locked" && "text-muted-foreground",
              )}
              key={milestone.dayNumber}
            >
              <span className="font-serif-display text-2xl text-[#c9bdb1]">
                {String(milestone.dayNumber).padStart(2, "0")}
              </span>
              <Icon
                aria-hidden="true"
                className={cn(
                  "mt-0.5 size-5 shrink-0",
                  milestone.state.startsWith("completed") && "text-success",
                  milestone.state === "current" && "text-primary",
                )}
              />
              <div className="min-w-0 flex-1 space-y-1">
                <p className="font-medium text-foreground">{title}</p>
                <p className="text-sm text-muted-foreground">
                  {details.label}
                  {milestone.confidenceLabel ? ` · ${milestone.confidenceLabel}` : ""}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
