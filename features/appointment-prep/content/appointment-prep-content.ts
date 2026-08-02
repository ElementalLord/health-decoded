import type { FieldDefinition, Option } from "@/features/appointment-prep/types/appointment-prep";

export const APPOINTMENT_PREP_ID = "APPT-PREP";

export const appointmentPrepNotices = {
  privacy:
    "Your preparation stays in this browser session. It is not saved to your account and may disappear if you refresh or close the page.",
  medical:
    "This workspace helps you organize what to discuss. It does not interpret symptoms, test results, medicines, or treatment decisions.",
  sharing: "You decide what to share. A printed or copied summary may contain private information.",
  clear:
    "This removes everything currently entered in this workspace. This action cannot be undone.",
  print: "Review your summary before printing. Printed copies may be seen by other people.",
  copied: "Your preparation summary was copied. Check where you paste it before sharing.",
} as const;

export const sectionNavigation = [
  { id: "APPT-PREP-S01", key: "basics", short: "Basics", label: "Appointment basics" },
  { id: "APPT-PREP-S02", key: "priorities", short: "Priorities", label: "Top priorities" },
  { id: "APPT-PREP-S03", key: "clarify", short: "Clarify", label: "What I want clarified" },
  { id: "APPT-PREP-S04", key: "changes", short: "Changes", label: "What has changed" },
  {
    id: "APPT-PREP-S05",
    key: "understand",
    short: "Understand",
    label: "What I currently understand",
  },
  { id: "APPT-PREP-S06", key: "ask", short: "Ask", label: "Questions I want to ask" },
  { id: "APPT-PREP-S07", key: "bring", short: "Bring", label: "What I may need to bring" },
  { id: "APPT-PREP-S08", key: "access", short: "Access", label: "Communication and access needs" },
  { id: "APPT-PREP-S09", key: "support", short: "Support", label: "Support person" },
  { id: "APPT-PREP-S10", key: "review", short: "Summary", label: "Preparation summary" },
] as const;

export const appointmentTypeOptions: Option[] = [
  "Primary care",
  "Diabetes specialist",
  "Diabetes education",
  "Dietitian or nutrition professional",
  "Pharmacy consultation",
  "Eye-care appointment",
  "Telehealth appointment",
  "Another professional visit",
  "I am not sure",
].map((label, index) => ({ id: `APPT-PREP-O${String(index + 1).padStart(2, "0")}`, label }));

export const visitFormats = ["In person", "Telehealth", "Phone", "I am not sure"];
export const accessNeedOptions = [
  "Interpreter",
  "Large-print information",
  "Hearing support",
  "Wheelchair or mobility access",
  "More time to understand instructions",
  "Written instructions",
  "Another request",
];
export const clarificationCategories = [
  "A word or abbreviation",
  "A test or result",
  "A medicine instruction",
  "A recommendation",
  "A screening",
  "A follow-up instruction",
  "Something said at a previous visit",
  "Something from Health Decoded",
  "Another topic",
];
export const clarificationFrameworks = [
  "What does this mean?",
  "Could you explain this in another way?",
  "What is the purpose of this?",
  "What should I understand before making a decision?",
  "What should I write down?",
  "Who should I contact if I have questions later?",
];
export const changeCategories = [
  "How I have been feeling",
  "Sleep",
  "Energy",
  "Appetite",
  "Daily routine",
  "Movement or activity",
  "Stress or emotional burden",
  "Medicines or supplements",
  "A concern about side effects",
  "Difficulty following the current plan",
  "Cost or access barriers",
  "Food access",
  "Transportation",
  "Work or schedule",
  "Another clinician visit",
  "Emergency-room or urgent-care visit",
  "A new diagnosis or health event",
  "A new device",
  "Another change",
];
export const noticedOptions = [
  "Today",
  "In the past few days",
  "In the past few weeks",
  "Since my previous appointment",
  "I am not sure",
];
export const understandingFrameworks = [
  "Is my understanding correct?",
  "What part am I missing?",
  "Could you explain this another way?",
  "What should I focus on?",
  "Could you write down the next step?",
  "What should I do if I have another question later?",
];

export const fieldDefinitions: readonly FieldDefinition[] = [
  {
    id: "APPT-PREP-F01",
    label: "Professional or clinic",
    controlType: "text",
    sensitivity: "potentially-sensitive",
    persistence: "session-only",
    characterLimit: 120,
    accessibilityDescription: "Optional neutral professional or clinic label",
    printBehavior: "include-when-entered",
    copyBehavior: "include-when-entered",
  },
  {
    id: "APPT-PREP-F02",
    label: "Main reason",
    controlType: "text",
    sensitivity: "potentially-sensitive",
    persistence: "session-only",
    characterLimit: 120,
    accessibilityDescription: "Optional reason for the appointment",
    printBehavior: "include-when-entered",
    copyBehavior: "include-when-entered",
  },
  {
    id: "APPT-PREP-F03",
    label: "Item details",
    controlType: "textarea",
    sensitivity: "potentially-sensitive",
    persistence: "session-only",
    characterLimit: 500,
    accessibilityDescription: "Optional details to discuss",
    printBehavior: "include-when-entered",
    copyBehavior: "include-when-entered",
  },
  {
    id: "APPT-PREP-F04",
    label: "Question",
    controlType: "textarea",
    sensitivity: "potentially-sensitive",
    persistence: "session-only",
    characterLimit: 300,
    accessibilityDescription: "Optional question to ask",
    printBehavior: "include-when-entered",
    copyBehavior: "include-when-entered",
  },
] as const;

export const documentGroups = [
  {
    id: "APPT-PREP-DG01",
    key: "common",
    title: "Commonly useful",
    items: [
      "Written questions",
      "Current medicine and supplement list",
      "Pharmacy information",
      "Previous instructions",
      "Appointment information",
      "Note-taking materials",
      "Glasses",
      "Hearing aids",
      "Communication support",
      "Accessibility equipment",
    ],
  },
  {
    id: "APPT-PREP-DG02",
    key: "requested",
    title: "Bring if the clinic requested it",
    items: [
      "Identification",
      "Insurance information",
      "Referral information",
      "Clinic forms",
      "Medicine containers",
      "Records from another professional",
      "Outside test results",
      "Device or app",
      "Glucose record",
      "Another requested item",
    ],
  },
  {
    id: "APPT-PREP-DG03",
    key: "confirm",
    title: "Plans to confirm",
    items: [
      "Interpreter request",
      "Transportation",
      "Payment or cost questions",
      "Telehealth connection",
      "A support person",
      "Another preparation item",
    ],
  },
] as const;
export const locationOptions = [
  "In my bag",
  "On my phone",
  "In the patient portal",
  "At home",
  "I still need to find it",
  "Another location",
];
export const supporterRoles = [
  "Help me remember my questions",
  "Take notes",
  "Help with communication",
  "Listen",
  "Speak only when I ask",
  "Help me review next steps afterward",
  "Another role",
];
