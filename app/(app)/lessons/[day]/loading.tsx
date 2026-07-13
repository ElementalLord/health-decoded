import { PageLoadingState } from "@/components/shared/page-loading-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function LessonLoading() {
  return (
    <PageLoadingState className="mx-auto max-w-[760px] space-y-8 py-8" label="Loading lesson">
      <div className="space-y-3 border-b border-border pb-5">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-5 w-24" />
      </div>
      <Skeleton className="h-3 w-full" />
      <div className="space-y-5 py-12">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-28 w-full" />
      </div>
      <div className="flex justify-between border-t border-border pt-5">
        <Skeleton className="h-12 w-28" />
        <Skeleton className="h-12 w-28" />
      </div>
    </PageLoadingState>
  );
}
