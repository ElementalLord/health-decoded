import { redirect } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { AuthForm } from "@/features/auth/components/auth-form";
import { loginAction } from "@/features/auth/actions/auth.actions";
import { getAuthenticatedUser } from "@/features/auth/services/auth.server";
import { getSafeRedirectPath } from "@/lib/auth/redirects";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; passwordReset?: string }>;
}) {
  const user = await getAuthenticatedUser();
  const { next: requestedPath, passwordReset } = await searchParams;
  const next = getSafeRedirectPath(requestedPath);

  if (user.ok) redirect(next);

  return (
    <div className="space-y-8">
      <PageHeader
        compact
        description="Pick up where you left off."
        eyebrow="Sign in"
        title="Welcome back"
      />
      {passwordReset === "1" ? (
        <p aria-live="polite" className="text-sm text-success" role="status">
          Your password was updated. Sign in with your new password.
        </p>
      ) : null}
      <AuthForm action={loginAction} mode="login" next={next} />
    </div>
  );
}
