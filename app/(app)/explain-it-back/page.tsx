import { ExplainItBackExperience } from "@/features/explain-it-back/components/explain-it-back-experience";
import { getExplainItBackChallenge } from "@/features/explain-it-back/content/explain-it-back-content";
import { getSpacedReviewOpportunity } from "@/features/spaced-review/services/spaced-review.server";
import { unexpectedError } from "@/lib/errors/application-error";
import { settleResult } from "@/lib/reliability/dependency-boundary";
import { sectionIcons } from "@/lib/section-icons";

export const metadata = {
  title: "Explain It Back",
  description:
    "Put a diabetes concept into your own words and check whether the main idea came through.",
  icons: sectionIcons("tools"),
};

export default async function ExplainItBackPage({
  searchParams,
}: {
  searchParams: Promise<{ concept?: string; mode?: string }>;
}) {
  const { concept, mode } = await searchParams;
  if (mode === "spaced-review") {
    const opportunity = await settleResult(
      () => getSpacedReviewOpportunity({ manual: true }),
      unexpectedError(),
    );
    return (
      <ExplainItBackExperience
        {...(opportunity.ok && opportunity.data.candidate
          ? { initialChallengeId: opportunity.data.candidate.challengeId }
          : {})}
        mode="spaced-review"
        reviewUnavailable={!opportunity.ok}
      />
    );
  }
  const initialChallengeId = concept && getExplainItBackChallenge(concept) ? concept : undefined;
  return initialChallengeId ? (
    <ExplainItBackExperience initialChallengeId={initialChallengeId} />
  ) : (
    <ExplainItBackExperience />
  );
}
