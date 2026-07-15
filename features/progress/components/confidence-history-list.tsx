import type { ConfidenceHistoryEntry } from "@/features/progress/types/progress";

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function ConfidenceHistoryList({ entries }: { entries: ConfidenceHistoryEntry[] }) {
  return (
    <section aria-labelledby="confidence-history-title" className="space-y-5">
      <div className="space-y-1.5">
        <h2
          className="font-serif-display text-[length:var(--text-section-title)] font-medium tracking-tight"
          id="confidence-history-title"
        >
          Recent confidence check-ins
        </h2>
        <p className="max-w-2xl text-pretty text-sm leading-6 text-muted-foreground">
          Confidence can change as you learn. There is no right answer.
        </p>
      </div>

      {entries.length ? (
        <ul className="overflow-hidden rounded-[14px] border border-border/70 bg-card shadow-[var(--shadow-card)] divide-y divide-border">
          {entries.map((entry) => (
            <li
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 py-4 sm:px-6"
              key={`${entry.dayNumber}-${entry.recordedAt}`}
            >
              <p className="font-medium">
                Day {entry.dayNumber}: {entry.lessonTitle}
              </p>
              <p className="text-sm text-muted-foreground">
                {entry.confidenceLabel} · {formatDate(entry.recordedAt)}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-[14px] border border-border/70 bg-card px-5 py-6 text-sm leading-7 text-muted-foreground sm:px-6">
          You have not recorded a confidence check-in yet.
        </p>
      )}
    </section>
  );
}
