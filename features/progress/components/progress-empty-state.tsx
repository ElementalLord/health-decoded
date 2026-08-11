import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { buttonVariants } from "@/components/ui/button";

export function ProgressEmptyState() {
  return (
    <EmptyState
      action={
        <div className="flex flex-wrap justify-center gap-3">
          <Link className={buttonVariants({ fullWidth: false })} href="/progress">
            Try again
          </Link>
          <Link
            className={buttonVariants({ fullWidth: false, variant: "secondary" })}
            href="/journey"
          >
            Return to Today&apos;s Journey
          </Link>
        </div>
      }
      description="We couldn’t load your progress right now. Your learning record has not changed."
      headingLevel="h1"
      title="Your progress is unavailable"
    />
  );
}
