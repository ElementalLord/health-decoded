import { CheckCircle2 } from "lucide-react";
import { redirect } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { AuthForm } from "@/features/auth/components/auth-form";
import { loginAction } from "@/features/auth/actions/auth.actions";
import { getAuthenticatedUser } from "@/features/auth/services/auth.server";
import { getSafeRedirectPath } from "@/lib/auth/redirects";

export const metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ emailVerified?: string; next?: string; passwordReset?: string }>;
}) {
  const user = await getAuthenticatedUser();
  const { emailVerified, next: requestedPath, passwordReset } = await searchParams;
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
      {emailVerified === "1" ? (
        <section
          aria-labelledby="email-verified-title"
          className="motion-status flex gap-4 border-y border-success/35 bg-info px-5 py-5 sm:items-center"
          role="status"
        >
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-success/12 text-success">
            <CheckCircle2 aria-hidden="true" className="size-5" strokeWidth={2} />
          </span>
          <div>
            <h2 className="font-semibold text-success" id="email-verified-title">
              Your email is verified
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Sign in below to start your learning journey.
            </p>
          </div>
        </section>
      ) : null}
      {passwordReset === "1" ? (
        <p aria-live="polite" className="motion-status text-sm text-success" role="status">
          Your password was updated. Sign in with your new password.
        </p>
      ) : null}
      <AuthForm action={loginAction} mode="login" next={next} />
    </div>
  );
}
