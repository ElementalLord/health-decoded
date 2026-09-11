import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

function DesktopLayout({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("hidden xl:flex", className)} {...props} />;
}

export { DesktopLayout };
