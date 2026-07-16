export function ConfidenceXpSummary({ total }: { total: number }) {
  return (
    <section className="grid gap-5 border-l-2 border-success bg-info px-6 py-8 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-8 sm:px-10">
      <p className="font-serif-display text-7xl font-light leading-none text-success sm:text-8xl">
        {total}
      </p>
      <div>
        <div className="space-y-1">
          <h2 className="font-serif-display text-[length:var(--text-section-title)] font-medium tracking-tight">
            Confidence XP
          </h2>
          <p className="text-sm text-muted-foreground">
            Confidence XP reflects learning progress, not medical progress.
          </p>
        </div>
      </div>
    </section>
  );
}
