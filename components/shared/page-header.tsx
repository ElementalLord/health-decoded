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
    <header className={cn("max-w-3xl space-y-4", className)} {...props}>
      {eyebrow ? <p className="editorial-eyebrow">{eyebrow}</p> : null}
      <h1
        className={cn(
          "font-serif-display font-medium leading-[0.98] text-balance",
          compact ? "text-3xl sm:text-4xl" : "text-[length:var(--text-page-title)]",
        )}
      >
        {title}
      </h1>
      {description ? (
        <p className="max-w-2xl text-pretty text-[length:var(--text-body)] leading-8 text-muted-foreground">
          {description}
        </p>
      ) : null}
    </header>
  );
}

export { PageHeader };
