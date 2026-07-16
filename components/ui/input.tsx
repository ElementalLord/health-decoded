import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex min-h-12 w-full rounded-[9px] border border-input bg-card px-4 py-2.5 text-base shadow-[inset_0_1px_0_rgb(61_47_41/0.04)] transition duration-[var(--duration-fast)] ease-[var(--ease-standard)] placeholder:text-muted-foreground hover:border-foreground/25 focus:border-accent-warm focus-visible:ring-2 focus-visible:ring-ring/20 aria-invalid:border-destructive aria-invalid:ring-destructive/20 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
