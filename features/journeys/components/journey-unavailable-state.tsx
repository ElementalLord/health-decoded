import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { buttonVariants } from "@/components/ui/button";

export function JourneyUnavailableState() {
  return (
    <EmptyState
      action={
        <Link className={buttonVariants({ fullWidth: false })} href="/journey">
          Try again
        </Link>
      }
      description="Your learning journey is not available right now. Please try again later."
      title="We could not load today’s journey"
    />
  );
}
