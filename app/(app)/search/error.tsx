"use client";

import { Button } from "@/components/ui/button";

export default function SearchError({ reset }: { reset: () => void }) {
  return (
    <section className="mx-auto max-w-2xl space-y-5 py-12">
      <p className="editorial-eyebrow">Search</p>
      <h1 className="font-serif-display text-4xl font-medium">Search is temporarily unavailable</h1>
      <p className="leading-7 text-muted-foreground">Try opening search again.</p>
      <div className="flex flex-wrap gap-3">
        <Button fullWidth={false} onClick={reset}>
          Try again
        </Button>
      </div>
    </section>
  );
}
