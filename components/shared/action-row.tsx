import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type ActionRowProps = {
  description: string;
  href: string;
  title: string;
  className?: string;
};

export function ActionRow({ className, description, href, title }: ActionRowProps) {
  return (
    <Link
      className={cn(
        "group flex min-h-16 items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:px-5",
        className,
      )}
      href={href}
    >
      <span className="min-w-0 space-y-0.5">
        <span className="block font-semibold text-foreground">{title}</span>
        <span className="block text-sm leading-5 text-muted-foreground">{description}</span>
      </span>
      <ArrowRight
        aria-hidden="true"
        className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
      />
    </Link>
  );
}
