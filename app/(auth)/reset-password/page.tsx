import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { resetPasswordAction } from "@/features/auth/actions/auth.actions";
import { AuthForm } from "@/features/auth/components/auth-form";

export default function ResetPasswordPage() {
  return <Card className="mx-auto max-w-md"><CardHeader><CardTitle>Choose a new password</CardTitle></CardHeader><CardContent><AuthForm action={resetPasswordAction} mode="reset-password" /></CardContent></Card>;
}
