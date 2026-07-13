import { Button } from "@/components/ui/button";
import { logoutAction } from "@/features/auth/actions/auth.actions";

export default function AccountPage() {
  return <section className="py-12 sm:py-16"><h1 className="text-[length:var(--text-page-title)] font-semibold">Account</h1><p className="mt-2 text-muted-foreground">You are signed in.</p><form action={logoutAction} className="mt-6"><Button fullWidth={false} variant="secondary">Sign out</Button></form></section>;
}
