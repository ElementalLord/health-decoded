import { redirect } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { signupAction } from "@/features/auth/actions/auth.actions";
import { AuthForm } from "@/features/auth/components/auth-form";
import { getAuthenticatedUser } from "@/features/auth/services/auth.server";
import { DEFAULT_AUTHENTICATED_DESTINATION } from "@/lib/auth/redirects";

export default async function SignupPage() {
  const user = await getAuthenticatedUser();
  if (user.ok) redirect(DEFAULT_AUTHENTICATED_DESTINATION);

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <PageHeader compact title="Create your account" />
      </CardHeader>
      <CardContent>
        <AuthForm action={signupAction} mode="signup" />
      </CardContent>
    </Card>
  );
}
