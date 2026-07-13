import type { ReactNode } from "react";
import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { buttonVariants } from "@/components/ui/button";

export function CaregiverUnavailableState({ action }: { action?: ReactNode }) {
  return (
    <EmptyState
      action={
        action ?? (
          <Link className={buttonVariants({ fullWidth: false })} href="/journey">
            Return to Today&apos;s Journey
          </Link>
        )
      }
      description="We couldn&apos;t load caregiver guidance right now. Please try again in a moment."
      title="Caregiver guidance is unavailable"
    />
  );
}
