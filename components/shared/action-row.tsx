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
        "group flex min-h-16 items-center justify-between gap-4 rounded-[12px] border border-border/60 bg-card px-5 py-4 shadow-[var(--shadow-card)] transition duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:border-primary/30 hover:shadow-[0_2px_8px_rgb(20_35_40/0.08)] focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      href={href}
    >
      <span className="min-w-0 space-y-1">
        <span className="block font-semibold text-foreground">{title}</span>
        <span className="block text-pretty text-sm leading-5 text-muted-foreground">
          {description}
        </span>
      </span>
      <span
        aria-hidden="true"
        className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition duration-[var(--duration-fast)] group-hover:bg-primary/10 group-hover:text-primary"
      >
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
