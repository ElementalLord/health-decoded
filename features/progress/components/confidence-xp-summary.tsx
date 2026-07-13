export function ConfidenceXpSummary({ total }: { total: number }) {
  return (
    <section className="space-y-2 border-y border-border py-6">
      <h2 className="text-[length:var(--text-section-title)] font-medium tracking-tight">
        Confidence XP
      </h2>
      <p className="text-2xl font-medium tracking-tight">{total} earned</p>
      <p className="text-sm leading-6 text-muted-foreground">
        Confidence XP reflects learning progress, not medical progress.
      </p>
    </section>
  );
}
