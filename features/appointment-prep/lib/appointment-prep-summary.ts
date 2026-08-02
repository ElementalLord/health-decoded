import type {
  AppointmentPrepState,
  AppointmentPrepSummary,
  SummarySection,
} from "@/features/appointment-prep/types/appointment-prep";

function clean(value: string) {
  return value.trim();
}

export function buildAppointmentPrepSummary(state: AppointmentPrepState): AppointmentPrepSummary {
  const sections: SummarySection[] = [];
  const basics = [
    state.appointmentBasics.appointmentType && `Type: ${state.appointmentBasics.appointmentType}`,
    state.appointmentBasics.date && `Date: ${state.appointmentBasics.date}`,
    state.appointmentBasics.time && `Time: ${state.appointmentBasics.time}`,
    state.appointmentBasics.format && `Format: ${state.appointmentBasics.format}`,
    clean(state.appointmentBasics.professionalLabel) &&
      `Professional or clinic: ${clean(state.appointmentBasics.professionalLabel)}`,
    clean(state.appointmentBasics.purpose) &&
      `Main reason: ${clean(state.appointmentBasics.purpose)}`,
  ].filter(Boolean) as string[];
  if (basics.length) sections.push({ id: "basics", title: "Appointment basics", lines: basics });

  const priorities = state.priorities.filter((item) => clean(item.text));
  if (priorities.length)
    sections.push({
      id: "priorities",
      title: "My top priorities",
      lines: priorities.map(
        (item, index) =>
          `${index + 1}. ${clean(item.text)}${item.ifTimeAllows ? " (If time allows)" : ""}`,
      ),
    });
  const clarification = state.clarificationItems.flatMap((item) => {
    const detail = clean(item.detail);
    const question = clean(item.question);
    return detail || question
      ? [
          `${item.category || "Clarification"}: ${detail}${detail && question ? ` — ${question}` : question}`,
        ]
      : [];
  });
  if (clarification.length)
    sections.push({ id: "clarify", title: "What I want clarified", lines: clarification });
  const changes = state.changeItems.flatMap((item) => {
    const details = [
      clean(item.detail),
      item.noticed && `Noticed: ${item.noticed}`,
      clean(item.question) && `Question: ${clean(item.question)}`,
    ].filter(Boolean);
    return details.length ? [`${item.category || "Change"}: ${details.join(" · ")}`] : [];
  });
  if (changes.length)
    sections.push({ id: "changes", title: "Changes I want to mention", lines: changes });
  const understanding = state.understandingItems.flatMap((item) =>
    clean(item.text)
      ? [
          `${item.kind === "understand" ? "I think I understand" : item.kind === "unsure" ? "I am unsure about" : "I want confirmed"}: ${clean(item.text)}${clean(item.question) ? ` — ${clean(item.question)}` : ""}`,
        ]
      : [],
  );
  if (understanding.length)
    sections.push({
      id: "understand",
      title: "What I understand or want confirmed",
      lines: understanding,
    });
  const questions = state.questions.flatMap((item) =>
    clean(item.text) ? [`${clean(item.text)}${item.ifTimeAllows ? " (If time allows)" : ""}`] : [],
  );
  if (questions.length)
    sections.push({ id: "ask", title: "Questions I want to ask", lines: questions });
  const documents = state.documentItems
    .filter((item) => item.selected)
    .map((item) => {
      const location =
        item.location === "Another location" && clean(item.locationDetail)
          ? clean(item.locationDetail)
          : item.location;
      return `✓ ${item.label}${location ? ` — ${location}` : ""}`;
    });
  if (documents.length)
    sections.push({ id: "bring", title: "Documents and items", lines: documents });
  if (state.accessNeeds.length)
    sections.push({
      id: "access",
      title: "Communication and access needs",
      lines: state.accessNeeds,
    });
  if (state.supportPerson.choice) {
    const choice =
      state.supportPerson.choice === "yes"
        ? "Yes"
        : state.supportPerson.choice === "deciding"
          ? "I am deciding"
          : "No";
    sections.push({
      id: "support",
      title: "Optional support-person role",
      lines: [choice, ...state.supportPerson.roles],
    });
  }
  return { title: "Appointment preparation", sections };
}

export function formatSummaryForClipboard(summary: AppointmentPrepSummary): string {
  return [
    summary.title.toUpperCase(),
    ...summary.sections.flatMap((section) => [
      "",
      section.title,
      ...section.lines.map((line) => `- ${line}`),
    ]),
    "",
    "Notes during the appointment:",
    "",
    "",
  ].join("\n");
}

export const PRINT_DOCUMENT_TITLE = "appointment-preparation";
