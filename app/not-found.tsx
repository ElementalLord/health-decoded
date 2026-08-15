import { Compass } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <EmptyState
      action={
        <div className="flex flex-wrap justify-center gap-3">
          <Link className={buttonVariants({ fullWidth: false })} href="/journey">
            Go to Journey
          </Link>
          <Link
            className={buttonVariants({ fullWidth: false, variant: "secondary" })}
            href="/search"
          >
            Search Health Decoded
          </Link>
        </div>
      }
      description="The page may have moved or no longer exists. Your learning progress has not changed."
      headingLevel="h1"
      icon={<Compass className="size-6" />}
      title="We couldn’t find that page"
    />
  );
}
