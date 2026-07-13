import { PageLoadingState } from "@/components/shared/page-loading-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingPage() {
  return (
    <PageLoadingState className="space-y-8" label="Loading page">
      <div className="space-y-3">
        <Skeleton className="h-8 w-2/3 max-w-80" />
        <Skeleton className="h-5 w-full max-w-lg" />
      </div>
      <Skeleton className="h-44 w-full" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    </PageLoadingState>
  );
}
