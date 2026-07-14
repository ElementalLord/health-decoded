import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AuthErrorPage() {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <PageHeader compact title="We could not complete that request" />
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Please try again. If your link has expired, request a new one.</p>
        <Link className="text-sm font-medium text-primary underline" href="/login">
          Return to sign in
        </Link>
        <span aria-hidden="true" className="px-1 text-muted-foreground">
          ·
        </span>
        <Link className="text-sm font-medium text-primary underline" href="/verify-email">
          Request a new link
        </Link>
      </CardContent>
    </Card>
  );
}
