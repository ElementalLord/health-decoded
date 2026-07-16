"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function RouteMotion({ children, className }: { children: ReactNode; className?: string }) {
  const pathname = usePathname();

  return (
    <div className={cn("motion-page min-w-0", className)} key={pathname}>
      {children}
    </div>
  );
}
