import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  action?: ReactNode;
  className?: string;
  description: string;
  headingLevel?: "h1" | "h2";
  icon?: ReactNode;
  title: string;
};

function EmptyState({
  action,
  className,
  description,
  headingLevel = "h2",
  icon,
  title,
}: EmptyStateProps) {
  const Heading = headingLevel;

  return (
    <section className={cn("px-4 py-16 text-center sm:px-8", className)}>
      <div className="animate-empty-state mx-auto flex max-w-md flex-col items-center gap-5">
        {icon ? (
          <div
            aria-hidden="true"
            className="inline-flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary"
          >
            {icon}
          </div>
        ) : null}
        <div className="space-y-2.5">
          <Heading className="font-serif-display text-[length:var(--text-section-title)] font-semibold text-balance">
            {title}
          </Heading>
          <p className="text-pretty text-[length:var(--text-supporting)] leading-7 text-muted-foreground">
            {description}
          </p>
        </div>
        {action ? <div className="w-full sm:w-auto">{action}</div> : null}
      </div>
    </section>
  );
}

export { EmptyState };
