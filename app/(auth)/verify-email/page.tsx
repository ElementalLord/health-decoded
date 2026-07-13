import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function VerifyEmailPage() {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <PageHeader compact title="Check your email" />
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          We may have sent a verification link. It can take a moment to arrive, so please check your
          spam or junk folder too.
        </p>
        <Link className="text-sm font-medium text-primary underline" href="/login">
          Return to sign in
        </Link>
      </CardContent>
    </Card>
  );
}
