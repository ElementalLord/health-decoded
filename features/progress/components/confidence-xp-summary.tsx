import { Sparkles } from "lucide-react";

export function ConfidenceXpSummary({ total }: { total: number }) {
  return (
    <section className="space-y-3 rounded-[var(--radius-xl)] border border-border/50 bg-card p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="inline-flex size-10 items-center justify-center rounded-[8px] bg-primary/10 text-primary"
        >
          <Sparkles className="size-5" />
        </span>
        <div className="space-y-1">
          <h2 className="font-serif-display text-[length:var(--text-section-title)] font-medium tracking-tight">
            Confidence XP
          </h2>
          <p className="text-sm text-muted-foreground">
            Confidence XP reflects learning progress, not medical progress.
          </p>
        </div>
      </div>
      <p className="font-serif-display text-3xl font-semibold tracking-tight text-primary">
        {total} earned
      </p>
    </section>
  );
}
