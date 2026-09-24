"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { recognizeMilestone } from "@/features/achievements/lib/recognize-milestone.client";

import {
  applyCaregiverInteractionSubmission,
  deriveCaregiverModuleState,
} from "../lib/caregiver-completion";
import type { CaregiverModuleProgress } from "../types/caregiver-progress";
import type { CaregiverSessionState } from "../types/caregiver-session";
import type { CaregiverModuleId, CaregiverModuleReflectionId } from "../content/caregiver-ids";

type PersistedMilestoneGates = Pick<
  CaregiverModuleProgress,
  "centralIdeaReached" | "coreApplicationCompleted" | "takeawayViewed"
>;

function createInitialProgress(
  moduleId: CaregiverModuleId,
  gates?: PersistedMilestoneGates,
): CaregiverModuleProgress {
  const gateCount = gates
    ? Number(gates.centralIdeaReached) +
      Number(gates.coreApplicationCompleted) +
      Number(gates.takeawayViewed)
    : 0;
  return {
    moduleId,
    state: gateCount === 3 ? "completed" : gateCount > 0 ? "inProgress" : "notStarted",
    centralIdeaReached: gates?.centralIdeaReached ?? false,
    coreApplicationCompleted: gates?.coreApplicationCompleted ?? false,
    takeawayViewed: gates?.takeawayViewed ?? false,
    keyIdeaUnderstood: null,
    lastSectionId: null,
  };
}

interface CaregiverSessionContextValue {
  readonly progress: CaregiverModuleProgress;
  readonly reflection: string;
  readonly reflectionSkipped: boolean;
  readonly markCentralIdeaReached: () => void;
  readonly markTakeawayViewed: () => void;
  readonly markInteractionSubmitted: (interactionId: string) => void;
  readonly setKeyIdeaUnderstood: (understood: boolean) => void;
  readonly setLastSection: (sectionId: string) => void;
  readonly setReflection: (value: string) => void;
  readonly skipReflection: () => void;
  readonly clearReflection: () => void;
}

const CaregiverSessionContext = createContext<CaregiverSessionContextValue | null>(null);

function updateProgress(
  session: CaregiverSessionState,
  moduleId: CaregiverModuleId,
  initialProgress: CaregiverModuleProgress,
  update: (progress: CaregiverModuleProgress) => CaregiverModuleProgress,
): CaregiverSessionState {
  const current = session.moduleProgress[moduleId] ?? initialProgress;
  const next = update(current);
  return {
    ...session,
    moduleProgress: {
      ...session.moduleProgress,
      [moduleId]: {
        ...next,
        state: deriveCaregiverModuleState(next),
      },
    },
  };
}

export interface CaregiverSessionProviderProps {
  readonly children: ReactNode;
  readonly moduleId?: CaregiverModuleId;
  readonly centralSectionId?: string;
  readonly takeawaySectionId?: string;
  readonly reflectionId?: CaregiverModuleReflectionId;
  readonly initialMilestoneProgress?: PersistedMilestoneGates;
}

export function CaregiverSessionProvider({
  children,
  moduleId = "CG-M2",
  centralSectionId = "CG-M2-S03",
  takeawaySectionId = "CG-M2-S08",
  reflectionId = "CG-M2-R01",
  initialMilestoneProgress,
}: CaregiverSessionProviderProps) {
  const initialProgress = useMemo(
    () => createInitialProgress(moduleId, initialMilestoneProgress),
    [initialMilestoneProgress, moduleId],
  );
  const [session, setSession] = useState<CaregiverSessionState>(() => ({
    moduleProgress: { [moduleId]: createInitialProgress(moduleId, initialMilestoneProgress) },
    reflections: {},
  }));
  const [reflectionSkipped, setReflectionSkipped] = useState(false);
  const progress = session.moduleProgress[moduleId] ?? initialProgress;
  const reflection = session.reflections[reflectionId]?.value ?? "";

  useEffect(() => {
    if (
      !progress.centralIdeaReached &&
      !progress.coreApplicationCompleted &&
      !progress.takeawayViewed
    ) {
      return;
    }
    void recognizeMilestone({
      event: "caregiver_module_progressed",
      moduleId,
      centralIdeaReached: progress.centralIdeaReached,
      coreApplicationCompleted: progress.coreApplicationCompleted,
      takeawayViewed: progress.takeawayViewed,
    });
  }, [
    moduleId,
    progress.centralIdeaReached,
    progress.coreApplicationCompleted,
    progress.takeawayViewed,
  ]);

  const markCentralIdeaReached = useCallback(() => {
    setSession((current) =>
      updateProgress(current, moduleId, initialProgress, (item) => ({
        ...item,
        centralIdeaReached: true,
        lastSectionId: centralSectionId,
      })),
    );
  }, [centralSectionId, initialProgress, moduleId]);

  const markTakeawayViewed = useCallback(() => {
    setSession((current) =>
      updateProgress(current, moduleId, initialProgress, (item) => ({
        ...item,
        takeawayViewed: true,
        lastSectionId: takeawaySectionId,
      })),
    );
  }, [initialProgress, moduleId, takeawaySectionId]);

  const markInteractionSubmitted = useCallback(
    (interactionId: string) => {
      setSession((current) =>
        updateProgress(current, moduleId, initialProgress, (item) =>
          applyCaregiverInteractionSubmission(item, interactionId),
        ),
      );
    },
    [initialProgress, moduleId],
  );

  const setKeyIdeaUnderstood = useCallback(
    (understood: boolean) => {
      setSession((current) =>
        updateProgress(current, moduleId, initialProgress, (item) => ({
          ...item,
          keyIdeaUnderstood: understood,
        })),
      );
    },
    [initialProgress, moduleId],
  );

  const setLastSection = useCallback(
    (sectionId: string) => {
      if (!new RegExp(`^${moduleId}-S\\d{2}$`).test(sectionId)) return;
      setSession((current) =>
        updateProgress(current, moduleId, initialProgress, (item) => ({
          ...item,
          lastSectionId: sectionId,
        })),
      );
    },
    [initialProgress, moduleId],
  );

  const setReflection = useCallback(
    (value: string) => {
      setReflectionSkipped(false);
      setSession((current) => ({
        ...current,
        reflections: {
          ...current.reflections,
          [reflectionId]: {
            scope: "session-only",
            value,
            cleared: false,
          },
        },
      }));
    },
    [reflectionId],
  );

  const skipReflection = useCallback(() => {
    setReflectionSkipped(true);
  }, []);

  const clearReflection = useCallback(() => {
    setReflectionSkipped(false);
    setSession((current) => ({
      ...current,
      reflections: {
        ...current.reflections,
        [reflectionId]: {
          scope: "session-only",
          value: "",
          cleared: true,
        },
      },
    }));
  }, [reflectionId]);

  const value = useMemo<CaregiverSessionContextValue>(
    () => ({
      progress,
      reflection,
      reflectionSkipped,
      markCentralIdeaReached,
      markTakeawayViewed,
      markInteractionSubmitted,
      setKeyIdeaUnderstood,
      setLastSection,
      setReflection,
      skipReflection,
      clearReflection,
    }),
    [
      progress,
      reflection,
      reflectionSkipped,
      markCentralIdeaReached,
      markTakeawayViewed,
      markInteractionSubmitted,
      setKeyIdeaUnderstood,
      setLastSection,
      setReflection,
      skipReflection,
      clearReflection,
    ],
  );

  return (
    <CaregiverSessionContext.Provider value={value}>{children}</CaregiverSessionContext.Provider>
  );
}

export function useCaregiverSession() {
  const value = useContext(CaregiverSessionContext);
  if (!value) {
    throw new Error("useCaregiverSession must be used within CaregiverSessionProvider.");
  }
  return value;
}

export const caregiverPrototypeSessionBoundary = Object.freeze({
  accountPersistence: "milestone-gates-only",
  browserPersistence: false,
  localStorage: false,
  indexedDb: false,
  serverSubmission: "milestone-gates-only",
  analytics: false,
  logs: false,
  aiTutorHandoff: false,
  urlState: false,
} as const);

export const caregiverMilestoneProgressBoundary = Object.freeze({
  accountPersistence: true,
  persistedFields: ["centralIdeaReached", "coreApplicationCompleted", "takeawayViewed"],
  reflections: false,
  answers: false,
  drafts: false,
  healthContent: false,
} as const);
