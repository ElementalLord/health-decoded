"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <EmptyState
      action={
        <Button fullWidth={false} onClick={reset}>
          Try again
        </Button>
      }
      description="Please try again. If the problem continues, refresh the page."
      headingLevel="h1"
      icon={<AlertCircle className="size-6" />}
      title="We couldn't load this page"
    />
  );
}
