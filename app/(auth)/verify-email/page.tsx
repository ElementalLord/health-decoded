import { redirect } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { AuthForm } from "@/features/auth/components/auth-form";
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
      <PageHeader
        compact
        description="Open the verification link in your email, then sign in from the page it opens. The message can take a moment to arrive, so check your spam or junk folder too."
        eyebrow="Confirm your email"
        title="Check your email"
      />
      <AuthForm action={resendVerificationAction} mode="resend-verification" />
    </div>
  );
}
