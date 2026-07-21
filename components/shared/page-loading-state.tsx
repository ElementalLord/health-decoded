import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageLoadingStateProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  label: string;
};

function PageLoadingState({ children, className, label, ...props }: PageLoadingStateProps) {
  return (
    <section
      aria-busy="true"
      className={cn("animate-page-in motion-cascade space-y-6", className)}
      role="status"
      {...props}
    >
      <p className="editorial-eyebrow motion-status text-muted-foreground">{label}</p>
      <div aria-hidden="true" className="contents">
        {children}
      </div>
    </section>
  );
}

export { PageLoadingState };
