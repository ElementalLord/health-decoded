import { PageLoadingState } from "@/components/shared/page-loading-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProgressLoading() {
  return (
    <PageLoadingState
      className="mx-auto max-w-4xl space-y-8 py-6 sm:py-10"
      label="Loading your progress"
    >
      <Skeleton className="h-20 w-full max-w-2xl" />
      <Skeleton className="h-96 w-full" />
      <Skeleton className="h-44 w-full" />
    </PageLoadingState>
  );
}
