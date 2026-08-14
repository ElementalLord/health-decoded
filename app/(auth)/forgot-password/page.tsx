import { PageHeader } from "@/components/shared/page-header";
import { AuthForm } from "@/features/auth/components/auth-form";
import { forgotPasswordAction } from "@/features/auth/actions/auth.actions";

export const metadata = { title: "Reset your password" };

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ expired?: string }>;
}) {
  const { expired } = await searchParams;

  return (
    <div className="space-y-8">
      <PageHeader
        compact
        description="We'll send a link to reset your password."
        eyebrow="Password help"
        title="Reset your password"
      />
      {expired === "1" ? (
        <p aria-live="polite" className="motion-status text-sm text-destructive" role="status">
          That reset link is no longer valid, so your password has not been changed. Enter your email
          to get a new one.
        </p>
      ) : null}
      <AuthForm action={forgotPasswordAction} mode="forgot-password" />
    </div>
  );
}
