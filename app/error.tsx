"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { buttonVariants } from "@/components/ui/button";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
      description="We couldn’t load this right now. Try again, or return to your Journey."
      headingLevel="h1"
      icon={<AlertCircle className="size-6" />}
      title="We couldn’t load this page"
    />
  );
}
