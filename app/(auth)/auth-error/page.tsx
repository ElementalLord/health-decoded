import { AlertCircle } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AuthErrorPage() {
  return (
    <div className="space-y-8">
      <span
        aria-hidden="true"
        className="inline-flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive"
      >
        <AlertCircle className="size-6" />
      </span>
      <PageHeader
        compact
        description="Please try again. If your link has expired, request a new one."
        eyebrow="Something went wrong"
        title="We could not complete that request"
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          className={cn(buttonVariants({ fullWidth: false }), "min-h-12 px-6")}
          href="/login"
        >
          Return to sign in
        </Link>
        <Link
          className={cn(
            buttonVariants({ fullWidth: false, variant: "secondary" }),
            "min-h-12 px-6",
          )}
          href="/verify-email"
        >
          Request a new link
        </Link>
      </div>
    </div>
  );
}
