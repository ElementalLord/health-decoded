import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "min-h-11 w-full rounded-[10px] border border-input bg-card px-3 py-2 text-base transition duration-[var(--duration-fast)] hover:border-primary/50 focus:border-primary focus-visible:ring-2 focus-visible:ring-ring aria-invalid:border-destructive aria-invalid:ring-destructive/20 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}

export { Select };
