import { PageLoadingState } from "@/components/shared/page-loading-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <PageLoadingState label="Preparing Health Decoded">
      <div className="space-y-3">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-5 w-full" />
      </div>
      <Skeleton className="h-44 w-full rounded-[var(--radius-xl)]" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-28 rounded-[var(--radius-xl)]" />
        <Skeleton className="h-28 rounded-[var(--radius-xl)]" />
      </div>
    </PageLoadingState>
  );
}
