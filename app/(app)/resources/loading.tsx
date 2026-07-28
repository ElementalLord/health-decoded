import { PageLoadingState } from "@/components/shared/page-loading-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResourcesLoading() {
  return (
    <PageLoadingState
      className="mx-auto max-w-[1280px] space-y-10 py-6 sm:py-10"
      label="Loading trusted resources"
    >
      <div className="space-y-5 border-b border-border pb-8">
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-24 w-full max-w-2xl" />
        <Skeleton className="h-16 w-full max-w-3xl" />
      </div>
      <div className="space-y-3 border-b border-border pb-8">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-1.5 w-full rounded-none" />
      </div>
      <div className="grid border border-border lg:grid-cols-[1.15fr_0.85fr]">
        <Skeleton className="h-80 w-full rounded-none" />
        <div className="grid border-t border-border lg:border-l lg:border-t-0">
          <Skeleton className="h-40 w-full rounded-none" />
          <Skeleton className="h-40 w-full rounded-none border-t border-border" />
        </div>
      </div>
      <div className="space-y-0 border-t border-border">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton className="h-32 w-full rounded-none border-b border-border" key={index} />
        ))}
      </div>
    </PageLoadingState>
  );
}
