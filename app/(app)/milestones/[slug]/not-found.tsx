import { CircleHelp } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { buttonVariants } from "@/components/ui/button";

export default function MilestoneNotFound() {
  return (
    <EmptyState
      action={
        <Link className={buttonVariants({ fullWidth: false })} href="/milestones">
          View all milestones
        </Link>
      }
      description="This milestone may have moved or may no longer be available. Your progress has not changed."
      headingLevel="h1"
      icon={<CircleHelp className="size-6" />}
      title="Milestone not found"
    />
  );
}
