import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-[var(--radius-xl)] border border-border/70 bg-card p-5 sm:p-6",
  {
    variants: {
      tone: {
        default: "",
        info: "border-info/50 bg-info/30",
        muted: "bg-muted/30 border-border/50",
      },
    },
    defaultVariants: { tone: "default" },
  },
);

function Card({
  className,
  tone,
  ...props
}: HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>) {
  return <div className={cn(cardVariants({ tone, className }))} {...props} />;
}

function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 space-y-1.5", className)} {...props} />;
}

function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-serif-display text-[length:var(--text-card-title)] font-semibold", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-[length:var(--text-body)] leading-7", className)} {...props} />;
}

function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-6 flex flex-col gap-3 sm:flex-row sm:items-center", className)}
      {...props}
    />
  );
}

export { Card, CardContent, CardFooter, CardHeader, CardTitle, cardVariants };
