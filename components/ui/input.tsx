import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex min-h-11 w-full rounded-lg border border-input bg-card px-4 py-2 text-base shadow-sm transition duration-120 placeholder:text-muted-foreground hover:border-primary/60 focus:border-primary focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
