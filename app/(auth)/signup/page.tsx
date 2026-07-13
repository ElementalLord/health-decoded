import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signupAction } from "@/features/auth/actions/auth.actions";
import { AuthForm } from "@/features/auth/components/auth-form";
import { getAuthenticatedUser } from "@/features/auth/services/auth.server";

export default async function SignupPage() {
  const user = await getAuthenticatedUser();
  if (user.ok) redirect("/account");
  return <Card className="mx-auto max-w-md"><CardHeader><CardTitle>Create your account</CardTitle></CardHeader><CardContent><AuthForm action={signupAction} mode="signup" /></CardContent></Card>;
}
