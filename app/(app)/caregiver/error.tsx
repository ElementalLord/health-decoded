"use client";

import { Button } from "@/components/ui/button";
import { CaregiverUnavailableState } from "@/features/caregiver/components/caregiver-unavailable-state";

export default function CaregiverError({ reset }: { reset: () => void }) {
  return <CaregiverUnavailableState action={<Button onClick={reset}>Try again</Button>} />;
}
