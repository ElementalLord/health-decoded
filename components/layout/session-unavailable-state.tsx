import { ShieldAlert } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { buttonVariants } from "@/components/ui/button";

export function SessionUnavailableState({
  kind = "session",
  retryHref,
}: {
  kind?: "account" | "session";
  retryHref: string;
}) {
  const accountUnavailable = kind === "account";
  return (
    <EmptyState
      action={
        <Link className={buttonVariants({ fullWidth: false })} href={retryHref}>
          Try again
        </Link>
      }
      description={
        accountUnavailable
          ? "We couldn’t load your account details right now. You have not been signed out."
          : "We couldn’t confirm your session right now. You have not been signed out."
      }
      headingLevel="h1"
      icon={<ShieldAlert className="size-6" />}
      title={accountUnavailable ? "Account details unavailable" : "Session check unavailable"}
    />
  );
}
