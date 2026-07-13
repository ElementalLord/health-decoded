import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { buttonVariants } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <EmptyState
      action={
        <Link className={buttonVariants({ fullWidth: false })} href="/">
          Return home
        </Link>
      }
      description="The page you were looking for may have moved or is no longer available."
      headingLevel="h1"
      title="We couldn't find that page"
    />
  );
}
