import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { buttonVariants } from "@/components/ui/button";

export function CaregiverEmptyState() {
  return (
    <EmptyState
      action={
        <Link className={buttonVariants({ fullWidth: false })} href="/journey">
          Return to Today&apos;s Journey
        </Link>
      }
      description="Caregiver guidance will appear here when reviewed content is available."
      title="Caregiver guidance is not available yet"
    />
  );
}
