import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function HomePage() {
  return (
    <section className="mx-auto max-w-2xl py-16 sm:py-24">
      <h1 className="text-[length:var(--text-page-title)] font-medium tracking-tight">
        Health Decoded
      </h1>
      <p className="mt-3 max-w-xl text-[length:var(--text-body)] leading-7 text-muted-foreground">
        Calm, practical education for adults navigating the first days after a Type 2 diabetes
        diagnosis.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link className={buttonVariants({ fullWidth: false })} href="/signup">
          Create account
        </Link>
        <Link className={buttonVariants({ fullWidth: false, variant: "secondary" })} href="/login">
          Sign in
        </Link>
      </div>
    </section>
  );
}
