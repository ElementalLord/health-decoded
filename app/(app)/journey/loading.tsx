import { PageLoadingState } from "@/components/shared/page-loading-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function JourneyLoading() {
  return (
    <PageLoadingState className="space-y-8 py-6 sm:py-10" label="Preparing today’s journey">
      <div className="space-y-3">
        <Skeleton className="h-10 w-64 max-w-full" />
        <Skeleton className="h-6 w-96 max-w-full" />
      </div>

      <div className="space-y-6 rounded-lg border border-border p-6 sm:p-8">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-full max-w-2xl" />
        <Skeleton className="h-12 w-full lg:w-64" />
      </div>

      <div className="space-y-3">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-6 w-full max-w-2xl" />
      </div>

      <div className="space-y-5 border-y border-border py-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-5 w-40" />
      </div>

      <div className="space-y-5 border-b border-border pb-8">
        <Skeleton className="h-8 w-72 max-w-full" />
        <div className="grid gap-3 sm:grid-cols-3">
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
        </div>
      </div>
    </PageLoadingState>
  );
}
