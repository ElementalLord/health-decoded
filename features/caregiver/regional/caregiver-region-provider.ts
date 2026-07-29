// @ts-expect-error -- Node's built-in TypeScript test runner requires an explicit extension.
import { caregiverRegionConfigurationSchema } from "../schemas/caregiver-region.schema.ts";
import type {
  CaregiverRegionConfiguration,
  CaregiverRegionalPresentation,
} from "../types/caregiver-region.ts";

function hasExpired(expiresAt: string | null, asOf: Date): boolean {
  return expiresAt === null || new Date(expiresAt).getTime() <= asOf.getTime();
}

export function resolveCaregiverRegionalPresentation(
  input: CaregiverRegionConfiguration,
  asOf: Date = new Date(),
): CaregiverRegionalPresentation {
  const region = caregiverRegionConfigurationSchema.parse(input);
  const isCurrentVerifiedRegion =
    region.status === "verified" && !hasExpired(region.expiresAt, asOf);

  if (!isCurrentVerifiedRegion) {
    return {
      regionId: region.regionId,
      displayName: region.displayName,
      status: region.status,
      mode: "fallback",
      heading: region.fallbackHeading,
      copy: region.fallbackCopy,
      emergencyServiceLabel: null,
      emergencyContact: null,
      crisisServiceLabel: null,
      crisisContact: null,
      verifiedAt: null,
      contactsWithheld: true,
    };
  }

  return {
    regionId: region.regionId,
    displayName: region.displayName,
    status: region.status,
    mode: "verified",
    heading: "Stop here and get urgent help.",
    copy: `Health Decoded cannot determine what is happening. If someone may be in immediate danger, contact emergency help for ${region.displayName} now. Use the person's clinician-created emergency plan if it is immediately available, but do not delay emergency contact to search for it or finish this module.`,
    emergencyServiceLabel: region.emergencyServiceLabel,
    emergencyContact: region.emergencyContact,
    crisisServiceLabel: region.crisisServiceLabel,
    crisisContact: region.crisisContact,
    verifiedAt: region.verifiedAt,
    contactsWithheld: false,
  };
}
