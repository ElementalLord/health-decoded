import { PageHeader } from "@/components/shared/page-header";
import { AuthForm } from "@/features/auth/components/auth-form";
import { forgotPasswordAction } from "@/features/auth/actions/auth.actions";

export const metadata = { title: "Reset your password" };

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        compact
        description="We'll send a link to reset your password."
        eyebrow="Password help"
        title="Reset your password"
      />
      <AuthForm action={forgotPasswordAction} mode="forgot-password" />
    </div>
  );
}
