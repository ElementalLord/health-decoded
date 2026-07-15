import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] px-5 py-3 text-sm font-medium transition duration-[var(--duration-fast)] ease-[var(--ease-standard)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 sm:w-auto",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-[oklch(0.34_0.04_160)]",
        secondary:
          "border border-border bg-card text-foreground hover:border-foreground/20 hover:bg-muted/40",
        text: "px-0 text-primary underline-offset-4 hover:underline active:scale-100",
      },
      size: {
        default: "w-full",
        sm: "min-h-11 w-full px-4 py-2 text-sm",
        lg: "min-h-12 w-full px-6 text-base",
      },
      fullWidth: { true: "w-full", false: "w-auto" },
    },
    defaultVariants: { variant: "primary", size: "default", fullWidth: true },
  },
);

function Button({
  className,
  variant,
  size,
  fullWidth,
  ...props
}: ComponentProps<typeof ButtonPrimitive> & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      className={cn(buttonVariants({ variant, size, fullWidth, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
