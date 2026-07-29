import { CaregiverUrgentHelpPage } from "@/features/caregiver/components/safety/caregiver-urgent-help-page";
import { unavailableCaregiverRegionFixture } from "@/features/caregiver/regional/caregiver-region-fixtures";
import { resolveCaregiverRegionalPresentation } from "@/features/caregiver/regional/caregiver-region-provider";

export default function UrgentHelpLoading() {
  const region = resolveCaregiverRegionalPresentation(unavailableCaregiverRegionFixture);

  return <CaregiverUrgentHelpPage region={region} />;
}
