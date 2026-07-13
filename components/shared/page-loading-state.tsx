import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageLoadingStateProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  label: string;
};

function PageLoadingState({ children, className, label, ...props }: PageLoadingStateProps) {
  return (
    <section aria-busy="true" className={cn("space-y-6", className)} role="status" {...props}>
      <span className="sr-only">{label}</span>
      <div aria-hidden="true" className="contents">
        {children}
      </div>
    </section>
  );
}

export { PageLoadingState };
