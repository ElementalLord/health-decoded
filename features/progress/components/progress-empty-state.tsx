import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { buttonVariants } from "@/components/ui/button";

export function ProgressEmptyState() {
  return (
    <EmptyState
      action={
        <Link className={buttonVariants({ fullWidth: false })} href="/journey">
          Return to Today&apos;s Journey
        </Link>
      }
      description="We could not load your progress right now. Please try again."
      headingLevel="h1"
      title="Your progress is unavailable"
    />
  );
}
