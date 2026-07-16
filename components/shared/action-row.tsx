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
        "group flex min-h-24 items-center justify-between gap-6 px-0 py-7 transition duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:bg-muted/35 focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      href={href}
    >
      <span className="min-w-0 space-y-1.5">
        <span className="block font-serif-display text-2xl font-normal leading-tight text-foreground">
          {title}
        </span>
        <span className="block text-pretty text-base leading-6 text-muted-foreground">
          {description}
        </span>
      </span>
      <span
        aria-hidden="true"
        className="inline-flex size-11 shrink-0 items-center justify-center text-muted-foreground transition duration-[var(--duration-fast)] group-hover:text-primary"
      >
        <ArrowRight className="size-6 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
