import { redirect } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { AuthForm } from "@/features/auth/components/auth-form";
import { SessionWatcher } from "@/features/auth/components/session-watcher";
import { resendVerificationAction } from "@/features/auth/actions/auth.actions";
import { getAuthenticatedUser } from "@/features/auth/services/auth.server";
import { DEFAULT_AUTHENTICATED_DESTINATION } from "@/lib/auth/redirects";

export const metadata = { title: "Verify your email" };

export default async function VerifyEmailPage() {
  // Confirming in another tab signs this one in too, because the auth cookie is shared. Send people
  // on instead of leaving them waiting on a screen whose job is already done.
  const user = await getAuthenticatedUser();
  if (user.ok) redirect(DEFAULT_AUTHENTICATED_DESTINATION);

  return (
    <div className="space-y-8">
      <SessionWatcher />
      <PageHeader
        compact
        description="We may have sent a verification link. It can take a moment to arrive, so please check your spam or junk folder too. You can leave this tab open, it will continue on its own once you confirm."
        eyebrow="Confirm your email"
        title="Check your email"
      />
      <AuthForm action={resendVerificationAction} mode="resend-verification" />
    </div>
  );
}
