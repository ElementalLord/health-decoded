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
      description="Your learning progress has not changed. Try loading your Journey again."
      title="We couldn’t load your Journey right now"
    />
  );
}
