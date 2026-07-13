import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex min-h-6 items-center rounded-full px-2.5 py-1 text-xs font-semibold transition duration-120 focus-visible:ring-2 focus-visible:ring-ring aria-disabled:pointer-events-none aria-disabled:opacity-50",
  {
    variants: {
      tone: {
        default: "bg-muted text-muted-foreground hover:bg-muted/70",
        success: "bg-success/15 text-success hover:bg-success/25",
        warning: "bg-warning/25 text-warning-foreground hover:bg-warning/35",
        info: "bg-info text-info-foreground hover:bg-info/75",
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
