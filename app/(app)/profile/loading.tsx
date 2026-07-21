import { PageLoadingState } from "@/components/shared/page-loading-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <PageLoadingState className="space-y-6 py-6" label="Gathering your profile">
      <Skeleton className="h-16 w-full max-w-xl" />
      <Skeleton className="h-64 w-full" />
    </PageLoadingState>
  );
}
