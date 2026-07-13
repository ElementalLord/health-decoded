import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { resetPasswordAction } from "@/features/auth/actions/auth.actions";
import { AuthForm } from "@/features/auth/components/auth-form";

export default function ResetPasswordPage() {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <PageHeader compact title="Choose a new password" />
      </CardHeader>
      <CardContent>
        <AuthForm action={resetPasswordAction} mode="reset-password" />
      </CardContent>
    </Card>
  );
}
