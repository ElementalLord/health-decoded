type JourneyGreetingProps = {
  displayName: string | null;
};

export function JourneyGreeting({ displayName }: JourneyGreetingProps) {
  const name = displayName?.trim() || "there";

  return (
    <header className="space-y-2">
      <h1 className="text-[length:var(--text-page-title)] font-medium tracking-tight">
        Welcome back, {name}
      </h1>
      <p className="max-w-2xl text-base leading-7 text-muted-foreground">
        One helpful step at a time. Here is what is ready for you today.
      </p>
    </header>
  );
}
