type JourneyGreetingProps = {
  displayName: string | null;
};

export function JourneyGreeting({ displayName }: JourneyGreetingProps) {
  const name = displayName?.trim() || "there";

  return (
    <header className="space-y-3">
      <p className="text-[length:var(--text-supporting)] font-semibold uppercase tracking-[0.1em] text-primary">
        Today&apos;s Journey
      </p>
      <h1 className="break-words font-serif-display text-[length:var(--text-page-title)] font-semibold tracking-[-0.02em] text-balance">
        Welcome back, {name}
      </h1>
      <p className="max-w-2xl text-pretty text-[length:var(--text-supporting)] leading-7 text-muted-foreground">
        Your next lesson and recent progress are ready below.
      </p>
    </header>
  );
}
