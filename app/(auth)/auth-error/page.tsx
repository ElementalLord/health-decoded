import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthErrorPage() {
  return <Card className="mx-auto max-w-md"><CardHeader><CardTitle>We could not complete that request</CardTitle></CardHeader><CardContent className="space-y-4"><p>Please try again. If your link has expired, request a new one.</p><Link className="text-sm font-medium text-primary underline" href="/login">Return to sign in</Link></CardContent></Card>;
}
