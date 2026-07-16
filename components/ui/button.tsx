import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[9px] px-5 py-3 text-sm font-semibold transition duration-[var(--duration-fast)] ease-[var(--ease-standard)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-px active:scale-[0.98] active:shadow-none disabled:pointer-events-none disabled:opacity-50 sm:w-auto",
  {
    variants: {
      variant: {
        primary:
          "border border-primary bg-primary text-primary-foreground shadow-[0_3px_0_#211814] hover:-translate-y-px hover:bg-[#4b3931] hover:shadow-[0_4px_0_#211814]",
        secondary:
          "border border-border bg-card text-foreground shadow-[0_2px_0_rgb(61_47_41/0.12)] hover:-translate-y-px hover:border-foreground/25 hover:bg-[#fffdf8] hover:shadow-[0_3px_0_rgb(61_47_41/0.1)]",
        text: "rounded-none px-0 text-primary underline decoration-accent-warm/40 decoration-2 underline-offset-[6px] hover:decoration-accent-warm active:translate-y-0",
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
