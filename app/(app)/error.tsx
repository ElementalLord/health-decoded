"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { Button, buttonVariants } from "@/components/ui/button";

export default function ApplicationError({ reset }: { error: Error; reset: () => void }) {
  return (
    <EmptyState
      action={
        <div className="flex flex-wrap justify-center gap-3">
          <Button fullWidth={false} onClick={reset}>
            Try again
          </Button>
          <Link
            className={buttonVariants({ fullWidth: false, variant: "secondary" })}
            href="/journey"
          >
            Go to Journey
          </Link>
        </div>
      }
      description="The rest of Health Decoded is still available. Try this page again when you’re ready."
      headingLevel="h1"
      icon={<AlertCircle className="size-6" />}
      title="This page was interrupted"
    />
  );
}
