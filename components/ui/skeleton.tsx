import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading content"
      className={cn(
        "animate-pulse rounded-lg bg-muted transition duration-200 hover:bg-muted/70",
        className,
      )}
      role="status"
      {...props}
    >
      <span className="sr-only">Loading</span>
    </div>
  );
}

export { Skeleton };
