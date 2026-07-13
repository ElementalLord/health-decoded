import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "flex min-h-28 w-full rounded-md border border-input bg-card px-4 py-3 text-base leading-6 shadow-sm transition duration-[var(--duration-fast)] placeholder:text-muted-foreground hover:border-primary/60 focus:border-primary focus-visible:ring-2 focus-visible:ring-ring aria-invalid:border-destructive aria-invalid:ring-destructive/20 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
