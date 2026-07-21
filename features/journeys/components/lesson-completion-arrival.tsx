import { CheckCircle2 } from "lucide-react";

export function LessonCompletionArrival({
  completedLessons,
  dayNumber,
  journeyComplete,
}: {
  completedLessons: number;
  dayNumber: number;
  journeyComplete: boolean;
}) {
  return (
    <section
      aria-labelledby="completion-arrival-title"
      className="motion-status flex gap-4 border-y border-success/35 bg-info px-5 py-5 sm:items-center sm:px-7"
      role="status"
    >
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-success/12 text-success">
        <CheckCircle2 aria-hidden="true" className="size-5" strokeWidth={2} />
      </span>
      <div>
        <p className="editorial-eyebrow text-success">A step worth noticing</p>
        <h2
          className="mt-1 font-serif-display text-2xl font-semibold leading-tight"
          id="completion-arrival-title"
        >
          Day {dayNumber} is now part of your learning record.
        </h2>
        <p className="mt-1.5 max-w-3xl text-sm leading-6 text-muted-foreground">
          {journeyComplete
            ? "You finished the full journey. Let that settle before deciding what comes next."
            : `You have completed ${completedLessons} ${completedLessons === 1 ? "lesson" : "lessons"}. The next step is ready below, with no rush to begin it.`}
        </p>
      </div>
    </section>
  );
}
