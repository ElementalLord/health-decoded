import type { z } from "zod";

import type {
  caregiverRegionConfigurationSchema,
  caregiverRegionStatusSchema,
} from "../schemas/caregiver-region.schema.ts";

export type CaregiverRegionStatus = z.infer<typeof caregiverRegionStatusSchema>;
export type CaregiverRegionConfiguration = z.infer<typeof caregiverRegionConfigurationSchema>;

export interface CaregiverRegionalPresentation {
  readonly regionId: string;
  readonly displayName: string;
  readonly status: CaregiverRegionStatus;
  readonly mode: "verified" | "fallback";
  readonly heading: string;
  readonly copy: string;
  readonly emergencyServiceLabel: string | null;
  readonly emergencyContact: string | null;
  readonly crisisServiceLabel: string | null;
  readonly crisisContact: string | null;
  readonly verifiedAt: string | null;
  readonly contactsWithheld: boolean;
}
