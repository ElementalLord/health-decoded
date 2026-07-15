import { Compass } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <EmptyState
      action={
        <Link className={buttonVariants({ fullWidth: false })} href="/">
          Return home
        </Link>
      }
      description="The page you are looking for may have moved or no longer exists."
      headingLevel="h1"
      icon={<Compass className="size-7" />}
      title="We couldn't find that page"
    />
  );
}
