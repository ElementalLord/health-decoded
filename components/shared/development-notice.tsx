import { FlaskConical } from "lucide-react";

import { cn } from "@/lib/utils";

export function DevelopmentNotice({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "flex gap-3 rounded-[14px] border border-border bg-card px-4 py-3 sm:px-5",
        className,
      )}
      role="note"
    >
      <FlaskConical aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
      <div className="space-y-0.5">
        <p className="text-sm font-semibold text-foreground">Development content</p>
        <p className="text-sm leading-6 text-muted-foreground">
          This lesson is a temporary fixture used to test the experience.
        </p>
      </div>
    </aside>
  );
}
