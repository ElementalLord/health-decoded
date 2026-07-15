import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex min-h-6 items-center gap-1.5 rounded-full px-3 py-1 text-[length:var(--text-caption)] font-medium tracking-wide transition duration-[var(--duration-fast)] aria-disabled:opacity-50",
  {
    variants: {
      tone: {
        default: "bg-muted text-muted-foreground",
        success: "bg-success/12 text-success",
        warning: "bg-warning/20 text-warning-foreground",
        info: "bg-info/70 text-info-foreground",
      },
    },
    defaultVariants: { tone: "default" },
  },
);

function Badge({
  className,
  tone,
  disabled,
  ...props
}: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants> & { disabled?: boolean }) {
  return (
    <span
      aria-disabled={disabled || undefined}
      className={cn(badgeVariants({ tone, className }))}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
