import { PageLoadingState } from "@/components/shared/page-loading-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProgressLoading() {
  return (
    <PageLoadingState
      className="mx-auto max-w-4xl space-y-8 py-6 sm:py-10"
      label="Gathering your learning record"
    >
      <Skeleton className="h-20 w-full max-w-2xl" />
      <Skeleton className="h-44 w-full" />
      <div className="grid gap-2 sm:grid-cols-2">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton className="h-24 w-full" key={index} />
        ))}
      </div>
    </PageLoadingState>
  );
}
