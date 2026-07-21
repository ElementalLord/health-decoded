import { PageHeader } from "@/components/shared/page-header";
import { AuthForm } from "@/features/auth/components/auth-form";
import { resetPasswordAction } from "@/features/auth/actions/auth.actions";

export const metadata = { title: "Set a new password" };

export default function ResetPasswordPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        compact
        description="Choose a password you'll remember easily."
        eyebrow="New password"
        title="Choose a new password"
      />
      <AuthForm action={resetPasswordAction} mode="reset-password" />
    </div>
  );
}
