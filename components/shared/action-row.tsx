import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type ActionRowProps = {
  compact?: boolean;
  description: string;
  href: string;
  title: string;
  className?: string;
};

export function ActionRow({
  compact = false,
  className,
  description,
  href,
  title,
}: ActionRowProps) {
  return (
    <Link
      className={cn(
        "group flex items-center justify-between gap-5 px-0 transition duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:bg-muted/35 focus-visible:ring-2 focus-visible:ring-ring",
        compact ? "min-h-0 py-4" : "min-h-24 py-7",
        className,
      )}
      href={href}
    >
      <span className={cn("min-w-0", compact ? "space-y-1" : "space-y-1.5")}>
        <span
          className={cn(
            "block font-serif-display font-normal leading-tight text-foreground",
            compact ? "text-xl" : "text-2xl",
          )}
        >
          {title}
        </span>
        <span
          className={cn(
            "block text-pretty text-muted-foreground",
            compact ? "text-sm leading-5" : "text-base leading-6",
          )}
        >
          {description}
        </span>
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex shrink-0 items-center justify-center text-muted-foreground transition duration-[var(--duration-fast)] group-hover:text-primary",
          compact ? "size-9" : "size-11",
        )}
      >
        <ArrowRight
          className={cn(
            "transition-transform group-hover:translate-x-1",
            compact ? "size-5" : "size-6",
          )}
        />
      </span>
    </Link>
  );
}
