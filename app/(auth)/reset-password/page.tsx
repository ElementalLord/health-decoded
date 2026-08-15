import { redirect } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { AuthForm } from "@/features/auth/components/auth-form";
import { resetPasswordAction } from "@/features/auth/actions/auth.actions";
import { getAuthenticatedUser } from "@/features/auth/services/auth.server";

export const metadata = { title: "Set a new password" };

export default async function ResetPasswordPage() {
  // Reaching this page without the session minted by the reset link means the link never completed.
  // Send people back to request another one instead of showing a form that cannot succeed.
  const user = await getAuthenticatedUser();
  if (!user.ok) redirect("/forgot-password?expired=1");

  return (
    <div className="space-y-8">
      <PageHeader
        compact
        description="Choose a password you’ll remember easily."
        eyebrow="New password"
        title="Choose a new password"
      />
      <AuthForm action={resetPasswordAction} mode="reset-password" />
    </div>
  );
}
