"use client";

import { Button } from "@/components/ui/button";

export default function SearchError({ reset }: { reset: () => void }) {
  return (
    <section className="mx-auto max-w-3xl py-8">
      <h1 className="font-serif-display text-4xl">Search is temporarily unavailable.</h1>
      <p className="mt-3 text-muted-foreground">Try opening search again.</p>
      <Button className="mt-5" fullWidth={false} onClick={reset}>Try again</Button>
    </section>
  );
}
