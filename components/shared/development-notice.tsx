import { FlaskConical } from "lucide-react";

import { cn } from "@/lib/utils";

export function DevelopmentNotice({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "flex gap-3 rounded-[var(--radius-xl)] border border-info/40 bg-info/20 px-4 py-3.5 sm:px-5",
        className,
      )}
      role="note"
    >
      <span
        aria-hidden="true"
        className="inline-flex size-7 shrink-0 items-center justify-center rounded-[6px] bg-info/50 text-info-foreground"
      >
        <FlaskConical className="size-4" />
      </span>
      <div className="space-y-0.5">
        <p className="text-sm font-semibold text-foreground">Development content</p>
        <p className="text-sm leading-6 text-muted-foreground">
          This lesson is a temporary fixture used to test the experience.
        </p>
      </div>
    </aside>
  );
}
