import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "min-h-12 w-full rounded-[8px] border border-input bg-card px-3 py-2 text-base transition duration-[var(--duration-fast)] hover:border-foreground/20 focus:border-primary focus-visible:ring-2 focus-visible:ring-ring/20 aria-invalid:border-destructive aria-invalid:ring-destructive/20 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}

export { Select };
