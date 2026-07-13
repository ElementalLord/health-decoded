"use client";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function GlobalErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <EmptyState
      action={<Button onClick={reset}>Try again</Button>}
      description="Something interrupted this page. Try loading it again."
      headingLevel="h1"
      title="We couldn't load this page"
    />
  );
}
