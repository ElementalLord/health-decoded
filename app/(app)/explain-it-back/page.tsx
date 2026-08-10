import { ExplainItBackExperience } from "@/features/explain-it-back/components/explain-it-back-experience";
import { getExplainItBackChallenge } from "@/features/explain-it-back/content/explain-it-back-content";

export const metadata = {
  title: "Explain It Back",
  description:
    "Put a diabetes concept into your own words and check whether the main idea came through.",
};

export default async function ExplainItBackPage({
  searchParams,
}: {
  searchParams: Promise<{ concept?: string }>;
}) {
  const { concept } = await searchParams;
  const initialChallengeId = concept && getExplainItBackChallenge(concept) ? concept : undefined;
  return initialChallengeId ? (
    <ExplainItBackExperience initialChallengeId={initialChallengeId} />
  ) : (
    <ExplainItBackExperience />
  );
}
