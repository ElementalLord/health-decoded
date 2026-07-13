import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const cardVariants = cva("rounded-lg border border-border bg-card p-6 sm:p-8", {
  variants: { tone: { default: "", info: "border-info bg-info/35", muted: "bg-muted/50" } },
  defaultVariants: { tone: "default" },
});

function Card({
  className,
  tone,
  ...props
}: HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>) {
  return <div className={cn(cardVariants({ tone, className }))} {...props} />;
}

function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 space-y-1", className)} {...props} />;
}

function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-[length:var(--text-card-title)] font-medium", className)} {...props} />
  );
}

function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-[length:var(--text-body)] leading-6", className)} {...props} />;
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
