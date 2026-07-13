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
      description="Something interrupted this page. Your information is safe, and you can try loading it again."
      title="We couldn't load this page"
    />
  );
}
