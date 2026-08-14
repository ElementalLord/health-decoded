import { AlertCircle } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { AuthErrorDetail } from "@/features/auth/components/auth-error-detail";
import { cn } from "@/lib/utils";

export const metadata = { title: "Sign-in problem" };

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ flow?: string }>;
}) {
  const { flow } = await searchParams;
  const isRecovery = flow === "recovery";

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
        description={
          isRecovery
            ? "Your password has not been changed. Request a new reset link to try again."
            : "Please try again. If your link has expired, request a new one."
        }
        eyebrow={isRecovery ? "Reset link interrupted" : "Sign-in link interrupted"}
        title="We could not complete that request"
      />
      <AuthErrorDetail />
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link className={cn(buttonVariants({ fullWidth: false }), "min-h-12 px-6")} href="/login">
          Return to sign in
        </Link>
        <Link
          className={cn(
            buttonVariants({ fullWidth: false, variant: "secondary" }),
            "min-h-12 px-6",
          )}
          href={isRecovery ? "/forgot-password" : "/verify-email"}
        >
          {isRecovery ? "Request a new reset link" : "Request a new link"}
        </Link>
      </div>
    </div>
  );
}
