import { PageLoadingState } from "@/components/shared/page-loading-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <PageLoadingState label="Loading page">
      <div className="space-y-3">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-5 w-full" />
      </div>
      <Skeleton className="h-44 w-full rounded-[16px]" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-28 rounded-[14px]" />
        <Skeleton className="h-28 rounded-[14px]" />
      </div>
    </PageLoadingState>
  );
}
