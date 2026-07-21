import { PageHeader } from "@/components/shared/page-header";
import { AuthForm } from "@/features/auth/components/auth-form";
import { resendVerificationAction } from "@/features/auth/actions/auth.actions";

export const metadata = { title: "Verify your email" };

export default function VerifyEmailPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        compact
        description="We may have sent a verification link. It can take a moment to arrive, so please check your spam or junk folder too."
        eyebrow="Confirm your email"
        title="Check your email"
      />
      <AuthForm action={resendVerificationAction} mode="resend-verification" />
    </div>
  );
}
