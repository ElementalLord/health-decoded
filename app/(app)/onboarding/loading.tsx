import { PageLoadingState } from "@/components/shared/page-loading-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function OnboardingLoading() {
  return (
    <PageLoadingState
      className="mx-auto max-w-lg space-y-4 py-8"
      label="Preparing your private setup"
    >
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-72 w-full" />
    </PageLoadingState>
  );
}
