import { PageLoadingState } from "@/components/shared/page-loading-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function StoriesLoading() {
  return (
    <PageLoadingState className="space-y-6 py-6" label="Gathering stories for you">
      <Skeleton className="h-16 w-full max-w-xl" />
      <Skeleton className="h-56 w-full" />
      <Skeleton className="h-56 w-full" />
    </PageLoadingState>
  );
}
