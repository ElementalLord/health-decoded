export type Option = { readonly id: string; readonly label: string };

export type AppointmentBasics = {
  appointmentType: string;
  date: string;
  time: string;
  format: string;
  professionalLabel: string;
  purpose: string;
};

export type Priority = {
  id: string;
  text: string;
  ifTimeAllows: boolean;
  source?: string;
  sourceId?: string;
};

export type ClarificationItem = {
  id: string;
  category: string;
  detail: string;
  question: string;
};

export type ChangeItem = {
  id: string;
  category: string;
  detail: string;
  noticed: string;
  question: string;
};

export type UnderstandingKind = "understand" | "unsure" | "confirm";
export type UnderstandingItem = {
  id: string;
  kind: UnderstandingKind;
  text: string;
  question: string;
};

export type AppointmentQuestion = {
  id: string;
  category: string;
  text: string;
  ifTimeAllows: boolean;
};

export type DocumentItem = {
  id: string;
  group: "common" | "requested" | "confirm";
  label: string;
  selected: boolean;
  location: string;
  locationDetail: string;
};

export type SupportPerson = {
  choice: "no" | "deciding" | "yes" | "";
  roles: string[];
};

export type WorkspaceSection =
  | "overview"
  | "basics"
  | "priorities"
  | "clarify"
  | "changes"
  | "understand"
  | "ask"
  | "bring"
  | "access"
  | "support"
  | "review";

export type AppointmentPrepState = {
  started: boolean;
  appointmentBasics: AppointmentBasics;
  priorities: Priority[];
  clarificationItems: ClarificationItem[];
  changeItems: ChangeItem[];
  understandingItems: UnderstandingItem[];
  questions: AppointmentQuestion[];
  documentItems: DocumentItem[];
  accessNeeds: string[];
  supportPerson: SupportPerson;
  currentSection: WorkspaceSection;
  summaryViewed: boolean;
};

export type SummarySection = { id: string; title: string; lines: string[] };
export type AppointmentPrepSummary = { title: string; sections: SummarySection[] };

export type FieldDefinition = {
  readonly id: string;
  readonly label: string;
  readonly controlType: "text" | "textarea" | "select" | "date" | "time" | "checkbox" | "radio";
  readonly sensitivity: "potentially-sensitive";
  readonly persistence: "session-only";
  readonly characterLimit?: number;
  readonly accessibilityDescription: string;
  readonly printBehavior: "include-when-entered" | "include-when-selected";
  readonly copyBehavior: "include-when-entered" | "include-when-selected";
};
