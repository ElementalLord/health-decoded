import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";

export default function NotFoundPage() {
  return (
    <EmptyState
      action={
        <Link
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
          href="/"
        >
          Return home
        </Link>
      }
      description="The page you were looking for may have moved or is no longer available."
      title="We couldn't find that page"
    />
  );
}
