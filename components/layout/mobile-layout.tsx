import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

function MobileLayout({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("lg:hidden", className)} {...props} />;
}

export { MobileLayout };
