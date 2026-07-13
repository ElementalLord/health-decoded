import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthForm } from "@/features/auth/components/auth-form";
import { loginAction } from "@/features/auth/actions/auth.actions";
import { getAuthenticatedUser } from "@/features/auth/services/auth.server";
import { getSafeRedirectPath } from "@/lib/auth/redirects";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const user = await getAuthenticatedUser();
  if (user.ok) redirect(getSafeRedirectPath((await searchParams).next));
  const next = getSafeRedirectPath((await searchParams).next);
  return <Card className="mx-auto max-w-md"><CardHeader><CardTitle>Welcome back</CardTitle></CardHeader><CardContent><AuthForm action={loginAction} mode="login" next={next} /></CardContent></Card>;
}
