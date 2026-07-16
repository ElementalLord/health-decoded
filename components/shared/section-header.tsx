import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionHeaderProps = HTMLAttributes<HTMLDivElement> & {
  action?: ReactNode;
  description?: string;
  title: string;
};

function SectionHeader({ action, className, description, title, ...props }: SectionHeaderProps) {
  return (
    <div
      className={cn("flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", className)}
      {...props}
    >
      <div className="space-y-1.5">
        <h2 className="font-serif-display text-[length:var(--text-section-title)] font-medium leading-tight tracking-[-0.025em]">
          {title}
        </h2>
        {description ? (
          <p className="max-w-2xl text-pretty text-[length:var(--text-supporting)] leading-6 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="w-full sm:w-auto">{action}</div> : null}
    </div>
  );
}

export { SectionHeader };
