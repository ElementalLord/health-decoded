import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { forgotPasswordAction } from "@/features/auth/actions/auth.actions";
import { AuthForm } from "@/features/auth/components/auth-form";

export default function ForgotPasswordPage() {
  return <Card className="mx-auto max-w-md"><CardHeader><CardTitle>Reset your password</CardTitle></CardHeader><CardContent><AuthForm action={forgotPasswordAction} mode="forgot-password" /></CardContent></Card>;
}
