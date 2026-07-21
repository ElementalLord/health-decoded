import { PageLoadingState } from "@/components/shared/page-loading-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResourcesLoading() {
  return (
    <PageLoadingState className="space-y-6 py-6 sm:py-10" label="Gathering trusted resources">
      <Skeleton className="h-16 w-full max-w-xl" />
      <Skeleton className="h-16 w-full" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton className="h-52 w-full" key={index} />
        ))}
      </div>
    </PageLoadingState>
  );
}
