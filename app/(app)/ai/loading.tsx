import { PageLoadingState } from "@/components/shared/page-loading-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function AiLoading() {
  return (
    <PageLoadingState className="space-y-6 py-6" label="Opening your learning guide">
      <Skeleton className="h-20 w-full max-w-2xl" />
      <Skeleton className="h-52 w-full" />
      <Skeleton className="h-36 w-full max-w-3xl" />
    </PageLoadingState>
  );
}
