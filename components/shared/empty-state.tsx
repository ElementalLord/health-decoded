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
    <section className={cn("px-4 py-10 text-center sm:px-8", className)}>
      <div className="mx-auto flex max-w-md flex-col items-center gap-4">
        {icon ? (
          <div className="text-primary" aria-hidden="true">
            {icon}
          </div>
        ) : null}
        <div className="space-y-2">
          <Heading className="text-[length:var(--text-card-title)] font-medium">{title}</Heading>
          <p className="text-[length:var(--text-supporting)] leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        {action ? <div className="w-full sm:w-auto">{action}</div> : null}
      </div>
    </section>
  );
}

export { EmptyState };
