import { documentGroups } from "@/features/appointment-prep/content/appointment-prep-content";
import type {
  AppointmentPrepState,
  WorkspaceSection,
} from "@/features/appointment-prep/types/appointment-prep";

export const initialAppointmentPrepState: AppointmentPrepState = {
  started: false,
  appointmentBasics: {
    appointmentType: "",
    date: "",
    time: "",
    format: "",
    professionalLabel: "",
    purpose: "",
  },
  priorities: [],
  clarificationItems: [],
  changeItems: [],
  understandingItems: [],
  questions: [],
  documentItems: documentGroups.flatMap((group, groupIndex) =>
    group.items.map((label, itemIndex) => ({
      id: `APPT-PREP-D${groupIndex + 1}${String(itemIndex + 1).padStart(2, "0")}`,
      group: group.key,
      label,
      selected: false,
      location: "",
      locationDetail: "",
    })),
  ),
  accessNeeds: [],
  supportPerson: { choice: "", roles: [] },
  currentSection: "overview",
  summaryViewed: false,
};

type Action =
  | { type: "replace"; state: AppointmentPrepState }
  | { type: "start" }
  | { type: "navigate"; section: WorkspaceSection }
  | { type: "clear" };

export function appointmentPrepReducer(
  state: AppointmentPrepState,
  action: Action,
): AppointmentPrepState {
  switch (action.type) {
    case "replace":
      return action.state;
    case "start":
      return { ...state, started: true, currentSection: "basics" };
    case "navigate":
      return {
        ...state,
        currentSection: action.section,
        summaryViewed: state.summaryViewed || action.section === "review",
      };
    case "clear":
      return initialAppointmentPrepState;
  }
}

export function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (target < 0 || target >= items.length) return items;
  const next = [...items];
  const currentItem = next[index];
  const targetItem = next[target];
  if (currentItem === undefined || targetItem === undefined) return items;
  next[index] = targetItem;
  next[target] = currentItem;
  return next;
}

export function createSessionId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}
