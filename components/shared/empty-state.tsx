import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  action?: ReactNode;
  className?: string;
  description: string;
  icon?: ReactNode;
  title: string;
};

function EmptyState({ action, className, description, icon, title }: EmptyStateProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center shadow-card transition duration-200 hover:shadow-card-hover sm:px-10",
        className,
      )}
    >
      <div className="mx-auto flex max-w-md flex-col items-center gap-4">
        {icon ? (
          <div className="text-primary" aria-hidden="true">
            {icon}
          </div>
        ) : null}
        <div className="space-y-2">
          <h2 className="text-[length:var(--text-card-title)] font-semibold">{title}</h2>
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
