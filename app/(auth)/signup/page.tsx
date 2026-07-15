import { redirect } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { AuthForm } from "@/features/auth/components/auth-form";
import { signupAction } from "@/features/auth/actions/auth.actions";
import { getAuthenticatedUser } from "@/features/auth/services/auth.server";
import { DEFAULT_AUTHENTICATED_DESTINATION } from "@/lib/auth/redirects";

export default async function SignupPage() {
  const user = await getAuthenticatedUser();
  if (user.ok) redirect(DEFAULT_AUTHENTICATED_DESTINATION);

  return (
    <div className="space-y-8">
      <PageHeader
        compact
        description="It takes about a minute to set up."
        eyebrow="Get started"
        title="Create your account"
      />
      <AuthForm action={signupAction} mode="signup" />
    </div>
  );
}
