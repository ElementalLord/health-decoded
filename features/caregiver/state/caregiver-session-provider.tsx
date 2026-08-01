"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import {
  applyCaregiverInteractionSubmission,
  deriveCaregiverModuleState,
} from "../lib/caregiver-completion";
import type { CaregiverModuleProgress } from "../types/caregiver-progress";
import type { CaregiverSessionState } from "../types/caregiver-session";

const initialModule2Progress: CaregiverModuleProgress = Object.freeze({
  moduleId: "CG-M2",
  state: "notStarted",
  centralIdeaReached: false,
  coreApplicationCompleted: false,
  takeawayViewed: false,
  keyIdeaUnderstood: null,
  lastSectionId: null,
});

const initialSessionState: CaregiverSessionState = Object.freeze({
  moduleProgress: { "CG-M2": initialModule2Progress },
  reflections: {},
});

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
  update: (progress: CaregiverModuleProgress) => CaregiverModuleProgress,
): CaregiverSessionState {
  const current = session.moduleProgress["CG-M2"] ?? initialModule2Progress;
  const next = update(current);
  return {
    ...session,
    moduleProgress: {
      ...session.moduleProgress,
      "CG-M2": {
        ...next,
        state: deriveCaregiverModuleState(next),
      },
    },
  };
}

export function CaregiverSessionProvider({ children }: { readonly children: ReactNode }) {
  const [session, setSession] = useState<CaregiverSessionState>(initialSessionState);
  const [reflectionSkipped, setReflectionSkipped] = useState(false);
  const progress = session.moduleProgress["CG-M2"] ?? initialModule2Progress;
  const reflection = session.reflections["CG-M2-R01"]?.value ?? "";

  const markCentralIdeaReached = useCallback(() => {
    setSession((current) =>
      updateProgress(current, (item) => ({
        ...item,
        centralIdeaReached: true,
        lastSectionId: "CG-M2-S03",
      })),
    );
  }, []);

  const markTakeawayViewed = useCallback(() => {
    setSession((current) =>
      updateProgress(current, (item) => ({
        ...item,
        takeawayViewed: true,
        lastSectionId: "CG-M2-S08",
      })),
    );
  }, []);

  const markInteractionSubmitted = useCallback((interactionId: string) => {
    setSession((current) =>
      updateProgress(current, (item) => applyCaregiverInteractionSubmission(item, interactionId)),
    );
  }, []);

  const setKeyIdeaUnderstood = useCallback((understood: boolean) => {
    setSession((current) =>
      updateProgress(current, (item) => ({
        ...item,
        keyIdeaUnderstood: understood,
      })),
    );
  }, []);

  const setLastSection = useCallback((sectionId: string) => {
    if (!/^CG-M2-S0[1-8]$/.test(sectionId)) return;
    setSession((current) =>
      updateProgress(current, (item) => ({
        ...item,
        lastSectionId: sectionId,
      })),
    );
  }, []);

  const setReflection = useCallback((value: string) => {
    setReflectionSkipped(false);
    setSession((current) => ({
      ...current,
      reflections: {
        ...current.reflections,
        "CG-M2-R01": {
          scope: "session-only",
          value,
          cleared: false,
        },
      },
    }));
  }, []);

  const skipReflection = useCallback(() => {
    setReflectionSkipped(true);
  }, []);

  const clearReflection = useCallback(() => {
    setReflectionSkipped(false);
    setSession((current) => ({
      ...current,
      reflections: {
        ...current.reflections,
        "CG-M2-R01": {
          scope: "session-only",
          value: "",
          cleared: true,
        },
      },
    }));
  }, []);

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
  accountPersistence: false,
  browserPersistence: false,
  localStorage: false,
  indexedDb: false,
  serverSubmission: false,
  analytics: false,
  logs: false,
  aiTutorHandoff: false,
  urlState: false,
} as const);
