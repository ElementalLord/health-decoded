import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "min-h-12 w-full rounded-[9px] border border-input bg-card px-3 py-2 text-base transition duration-[var(--duration-fast)] hover:border-foreground/25 focus:border-accent-warm focus-visible:ring-2 focus-visible:ring-ring/20 aria-invalid:border-destructive aria-invalid:ring-destructive/20 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}

export { Select };
