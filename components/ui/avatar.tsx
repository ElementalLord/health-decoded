"use client";

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "inline-flex shrink-0 overflow-hidden rounded-full bg-secondary text-secondary-foreground ring-1 ring-border transition duration-120 hover:ring-primary focus-within:ring-2 focus-within:ring-ring aria-disabled:opacity-50",
  {
    variants: {
      size: { sm: "size-8 text-xs", default: "size-10 text-sm", lg: "size-12 text-base" },
    },
    defaultVariants: { size: "default" },
  },
);

type AvatarProps = VariantProps<typeof avatarVariants> & {
  alt: string;
  className?: string;
  disabled?: boolean;
  fallback: string;
  src?: string;
};

function Avatar({ alt, className, disabled, fallback, size, src }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      aria-disabled={disabled || undefined}
      className={cn(avatarVariants({ size, className }))}
    >
      {src ? (
        <AvatarPrimitive.Image alt={alt} className="size-full object-cover" src={src} />
      ) : null}
      <AvatarPrimitive.Fallback
        aria-label={alt}
        className="flex size-full items-center justify-center font-semibold"
      >
        {fallback}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}

export { Avatar, avatarVariants };
