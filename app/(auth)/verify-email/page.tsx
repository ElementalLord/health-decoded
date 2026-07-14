import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { resendVerificationAction } from "@/features/auth/actions/auth.actions";
import { AuthForm } from "@/features/auth/components/auth-form";

export default function VerifyEmailPage() {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <PageHeader compact title="Check your email" />
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          We may have sent a verification link. It can take a moment to arrive, so please check your
          spam or junk folder too.
        </p>
        <AuthForm action={resendVerificationAction} mode="resend-verification" />
      </CardContent>
    </Card>
  );
}
