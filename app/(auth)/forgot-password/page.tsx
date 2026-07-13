import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { forgotPasswordAction } from "@/features/auth/actions/auth.actions";
import { AuthForm } from "@/features/auth/components/auth-form";

export default function ForgotPasswordPage() {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <PageHeader compact title="Reset your password" />
      </CardHeader>
      <CardContent>
        <AuthForm action={forgotPasswordAction} mode="forgot-password" />
      </CardContent>
    </Card>
  );
}
