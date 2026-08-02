import type { z } from "zod";

import type {
  caregiverModuleProgressSchema,
  caregiverProgressSchema,
  caregiverSectionProgressSchema,
} from "../schemas/caregiver-progress.schema.ts";

export type CaregiverModuleProgress = z.infer<typeof caregiverModuleProgressSchema>;
export type CaregiverSectionProgress = z.infer<typeof caregiverSectionProgressSchema>;
export type CaregiverProgress = z.infer<typeof caregiverProgressSchema>;
