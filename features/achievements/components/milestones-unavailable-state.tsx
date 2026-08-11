import { Award } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { buttonVariants } from "@/components/ui/button";

export function MilestonesUnavailableState() {
  return (
    <EmptyState
      action={
        <Link className={buttonVariants({ fullWidth: false })} href="/milestones">
          Try again
        </Link>
      }
      description="We couldn’t load your milestones right now. Your progress has not been changed."
      headingLevel="h1"
      icon={<Award className="size-6" />}
      title="Milestones are temporarily unavailable"
    />
  );
}
