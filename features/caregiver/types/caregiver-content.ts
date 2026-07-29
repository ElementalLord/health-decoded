import type { z } from "zod";

import type {
  caregiverContentBlockSchema,
  caregiverContentContractSchema,
  caregiverDeterministicTextSchema,
  caregiverModuleContractSchema,
  caregiverSourceTraceSchema,
} from "../schemas/caregiver-content-contract.schema.ts";

export type CaregiverDeterministicText = z.infer<typeof caregiverDeterministicTextSchema>;
export type CaregiverContentBlock = z.infer<typeof caregiverContentBlockSchema>;
export type CaregiverModuleContract = z.infer<typeof caregiverModuleContractSchema>;
export type CaregiverContentContract = z.infer<typeof caregiverContentContractSchema>;
export type CaregiverSourceTraceContract = z.infer<typeof caregiverSourceTraceSchema>;
