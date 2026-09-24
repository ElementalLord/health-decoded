export default function MilestoneDetailLoading() {
  return (
    <section
      aria-label="Opening milestone"
      className="mx-auto grid min-h-[32rem] w-full max-w-5xl items-center gap-12 px-5 py-10 md:grid-cols-2"
      data-route-loading
      role="status"
    >
      <div
        aria-hidden="true"
        className="mx-auto aspect-square w-full max-w-80 animate-pulse rounded-full bg-muted"
      />
      <div className="space-y-5" aria-hidden="true">
        <div className="h-4 w-28 animate-pulse rounded bg-muted" />
        <div className="h-16 w-full animate-pulse rounded-lg bg-muted" />
        <div className="h-8 w-4/5 animate-pulse rounded bg-muted" />
        <div className="h-28 w-full animate-pulse rounded-lg bg-muted" />
      </div>
    </section>
  );
}
