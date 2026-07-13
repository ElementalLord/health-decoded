import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyEmailPage() {
  return <Card className="mx-auto max-w-md"><CardHeader><CardTitle>Check your email</CardTitle></CardHeader><CardContent className="space-y-4"><p>We may have sent a verification link. It can take a moment to arrive, so please check your spam or junk folder too.</p><Link className="text-sm font-medium text-primary underline" href="/login">Return to sign in</Link></CardContent></Card>;
}
