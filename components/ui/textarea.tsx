import { forwardRef, type TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        className={cn(
          "flex min-h-28 w-full rounded-[8px] border border-input bg-card px-4 py-3 text-base leading-6 transition duration-[var(--duration-fast)] placeholder:text-muted-foreground hover:border-foreground/20 focus:border-primary focus-visible:ring-2 focus-visible:ring-ring/20 aria-invalid:border-destructive aria-invalid:ring-destructive/20 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60",
          className,
        )}
        {...props}
        ref={ref}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
