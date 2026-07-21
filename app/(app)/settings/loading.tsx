import { PageLoadingState } from "@/components/shared/page-loading-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <PageLoadingState className="space-y-6 py-6" label="Loading your preferences">
      <Skeleton className="h-16 w-full max-w-xl" />
      <Skeleton className="h-72 w-full" />
    </PageLoadingState>
  );
}
