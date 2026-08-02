import { z } from "zod";

export const caregiverProgressStateSchema = z.enum([
  "notStarted",
  "inProgress",
  "completed",
  "revisit",
]);

export const caregiverInteractionProgressStateSchema = z.enum([
  "untouched",
  "started",
  "submitted",
  "revisited",
  "optionalSkipped",
]);

export const caregiverKnowledgeCheckStateSchema = z.enum(["notStarted", "answered", "reviewed"]);

export const caregiverReflectionStateSchema = z.enum([
  "unavailable",
  "untouched",
  "entered",
  "skipped",
  "cleared",
]);

export const caregiverModuleProgressSchema = z
  .object({
    moduleId: z.enum(["CG-M1", "CG-M2", "CG-M3", "CG-M4", "CG-M5"]),
    state: caregiverProgressStateSchema,
    centralIdeaReached: z.boolean(),
    coreApplicationCompleted: z.boolean(),
    takeawayViewed: z.boolean(),
    keyIdeaUnderstood: z.boolean().nullable(),
    lastSectionId: z
      .string()
      .regex(/^CG-M[1-5]-S\d{2}$/)
      .nullable(),
  })
  .strict();

export const caregiverSectionProgressSchema = z
  .object({
    state: z.enum(["notStarted", "inProgress", "completed"]),
    currentNextStepCategory: z.string().trim().min(1).max(80).nullable(),
    lastVisitedRoute: z
      .string()
      .regex(/^\/caregiver(?:\/[a-z0-9-]+)*$/)
      .nullable(),
  })
  .strict();

export const caregiverProgressSchema = z
  .object({
    schemaVersion: z.literal(1),
    section: caregiverSectionProgressSchema,
    modules: z
      .tuple([
        caregiverModuleProgressSchema,
        caregiverModuleProgressSchema,
        caregiverModuleProgressSchema,
        caregiverModuleProgressSchema,
        caregiverModuleProgressSchema,
      ])
      .superRefine((modules, context) => {
        const moduleIds = modules.map(({ moduleId }) => moduleId);
        if (new Set(moduleIds).size !== moduleIds.length) {
          context.addIssue({ code: "custom", message: "Module progress IDs must be unique." });
        }
      }),
  })
  .strict();
