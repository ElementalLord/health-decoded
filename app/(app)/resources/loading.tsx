import { PageLoadingState } from "@/components/shared/page-loading-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResourcesLoading() {
  return (
    <PageLoadingState
      className="mx-auto max-w-6xl space-y-8 py-6 sm:py-10"
      label="Curating trusted resources"
    >
      <div className="space-y-5 border-b border-border pb-10">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-48 w-full max-w-4xl" />
        <Skeleton className="h-16 w-full max-w-md" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.45fr_0.85fr]">
        <Skeleton className="h-[32rem] w-full rounded-[10px]" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <Skeleton className="h-[15.5rem] w-full rounded-[10px]" />
          <Skeleton className="h-[15.5rem] w-full rounded-[10px]" />
        </div>
      </div>
      <Skeleton className="h-40 w-full rounded-[8px]" />
    </PageLoadingState>
  );
}
