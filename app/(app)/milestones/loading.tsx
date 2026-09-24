export default function MilestonesLoading() {
  return (
    <section
      aria-label="Opening milestones"
      className="mx-auto w-full max-w-6xl px-5 py-8"
      data-route-loading
      role="status"
    >
      <div className="h-24 max-w-3xl animate-pulse rounded-xl bg-muted" />
      <div className="mt-12 grid grid-cols-3 gap-8 sm:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 18 }, (_, index) => (
          <div
            aria-hidden="true"
            className="mx-auto aspect-square w-full max-w-28 animate-pulse rounded-full bg-muted"
            key={index}
          />
        ))}
      </div>
    </section>
  );
}
