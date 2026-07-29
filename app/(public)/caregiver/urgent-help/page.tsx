import type { Metadata } from "next";

import { CaregiverUrgentHelpPage } from "@/features/caregiver/components/safety/caregiver-urgent-help-page";
import { unavailableCaregiverRegionFixture } from "@/features/caregiver/regional/caregiver-region-fixtures";
import { resolveCaregiverRegionalPresentation } from "@/features/caregiver/regional/caregiver-region-provider";

export const metadata: Metadata = {
  title: "Urgent help",
  description:
    "Health Decoded provides general education. It cannot diagnose symptoms, interpret a personal glucose reading, decide whether a situation is safe, or create treatment instructions.",
};

export default function UrgentHelpPage() {
  const region = resolveCaregiverRegionalPresentation(unavailableCaregiverRegionFixture);

  return <CaregiverUrgentHelpPage region={region} />;
}
