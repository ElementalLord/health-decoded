import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type PageHeaderProps = HTMLAttributes<HTMLElement> & {
  compact?: boolean;
  description?: string;
  eyebrow?: string;
  title: string;
};

function PageHeader({
  className,
  compact = false,
  description,
  eyebrow,
  title,
  ...props
}: PageHeaderProps) {
  return (
    <header className={cn("max-w-2xl space-y-3", className)} {...props}>
      {eyebrow ? (
        <p className="text-[length:var(--text-supporting)] font-semibold uppercase tracking-[0.08em] text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h1
        className={cn(
          "font-serif-display font-semibold text-balance",
          compact ? "text-[length:var(--text-card-title)]" : "text-[length:var(--text-page-title)]",
        )}
      >
        {title}
      </h1>
      {description ? (
        <p className="text-pretty text-[length:var(--text-supporting)] leading-7 text-muted-foreground">
          {description}
        </p>
      ) : null}
    </header>
  );
}

export { PageHeader };
