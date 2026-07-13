import { redirect } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AuthForm } from "@/features/auth/components/auth-form";
import { loginAction } from "@/features/auth/actions/auth.actions";
import { getAuthenticatedUser } from "@/features/auth/services/auth.server";
import { getSafeRedirectPath } from "@/lib/auth/redirects";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const user = await getAuthenticatedUser();
  const { next: requestedPath } = await searchParams;
  const next = getSafeRedirectPath(requestedPath);

  if (user.ok) redirect(next);

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <PageHeader compact title="Welcome back" />
      </CardHeader>
      <CardContent>
        <AuthForm action={loginAction} mode="login" next={next} />
      </CardContent>
    </Card>
  );
}
