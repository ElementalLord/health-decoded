import {
  caregiverModuleIds,
  caregiverStableIds,
  caregiverToolIds,
  toCaregiverStableId,
  type CaregiverStableId,
  // @ts-expect-error -- Node's built-in TypeScript test runner requires an explicit extension.
} from "./caregiver-ids.ts";

export const caregiverSourceDocuments = [
  "docs/caregiver/00-CAREGIVER-SYSTEM.md",
  "docs/caregiver/01-CAREGIVER-CONTENT.md",
  "docs/caregiver/02-CAREGIVER-TOOLS.md",
  "docs/caregiver/03-CAREGIVER-CODEX-BUILD.md",
] as const;

export type CaregiverSourceDocument = (typeof caregiverSourceDocuments)[number];

export interface CaregiverSourceTrace {
  readonly document: CaregiverSourceDocument;
  readonly heading: string;
  readonly correction?: "CG-TOOL-ISSUE-001";
}

function moduleHeading(id: string): string {
  const moduleNumber = id.match(/^CG-M([1-5])/)?.[1];
  return moduleNumber ? `MODULE ${moduleNumber}` : "Content ID Index";
}

function toolHeading(id: string): string {
  const toolNumber = id.match(/^CG-T([1-4])/)?.[1];
  return toolNumber ? `TOOL ${toolNumber}` : "Tool ID Index";
}

export function getCaregiverSourceTrace(id: CaregiverStableId): CaregiverSourceTrace {
  if (id.startsWith("CG-TOOL-ISSUE-")) {
    return {
      document: "docs/caregiver/03-CAREGIVER-CODEX-BUILD.md",
      heading: "Binding Correction Register",
    };
  }

  if (id.startsWith("CG-TOOL-CLAIM-") || id.startsWith("CG-TOOL-REV-")) {
    return {
      document: "docs/caregiver/02-CAREGIVER-TOOLS.md",
      heading: id.includes("CLAIM") ? "TOOL-WIDE SOURCE TABLE" : "TOOL-WIDE REVIEW REQUIREMENTS",
    };
  }

  if (id.startsWith("CG-CLAIM-") || id.startsWith("CG-REV-")) {
    return {
      document: "docs/caregiver/01-CAREGIVER-CONTENT.md",
      heading: id.includes("CLAIM")
        ? "CONTENT-WIDE SOURCE TABLE"
        : "CONTENT-WIDE REVIEW REQUIREMENTS",
    };
  }

  if (id.startsWith("CG-COMPLETE")) {
    return {
      document: "docs/caregiver/02-CAREGIVER-TOOLS.md",
      heading: "FINAL CAREGIVER COMPLETION EXPERIENCE",
    };
  }

  if (id.startsWith("CG-T")) {
    return {
      document: "docs/caregiver/02-CAREGIVER-TOOLS.md",
      heading: toolHeading(id),
    };
  }

  if (id.startsWith("CG-M")) {
    const trace: CaregiverSourceTrace = {
      document: "docs/caregiver/01-CAREGIVER-CONTENT.md",
      heading: moduleHeading(id),
    };

    if (/-I\d{2}$/.test(id)) {
      return { ...trace, correction: "CG-TOOL-ISSUE-001" };
    }

    return trace;
  }

  return {
    document: "docs/caregiver/01-CAREGIVER-CONTENT.md",
    heading: "LANDING PAGE",
  };
}

export const caregiverSourceTraceById = Object.freeze(
  Object.fromEntries(
    caregiverStableIds.map((id) => {
      const stableId = toCaregiverStableId(id);
      return [stableId, getCaregiverSourceTrace(stableId)];
    }),
  ) as Readonly<Record<CaregiverStableId, CaregiverSourceTrace>>,
);

export const caregiverFoundationManifest = Object.freeze({
  publicSectionName: "Support Someone You Care About",
  centralPromise: "Help without taking over.",
  landingId: toCaregiverStableId("CG-LANDING"),
  moduleIds: caregiverModuleIds,
  toolIds: caregiverToolIds,
  completionId: toCaregiverStableId("CG-COMPLETE"),
  renderingMode: "deterministic",
  runtimeGeneration: false,
  authoritativeDocuments: caregiverSourceDocuments,
} as const);
