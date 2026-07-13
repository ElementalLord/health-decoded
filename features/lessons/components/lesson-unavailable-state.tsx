import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { buttonVariants } from "@/components/ui/button";

export function LessonUnavailableState() {
  return (
    <EmptyState
      action={
        <Link className={buttonVariants({ fullWidth: false })} href="/journey">
          Return to Journey
        </Link>
      }
      description="We could not load today’s lesson. Please try again in a moment."
      headingLevel="h1"
      title="Your lesson is unavailable"
    />
  );
}
