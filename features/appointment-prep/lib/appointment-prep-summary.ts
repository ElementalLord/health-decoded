import type {
  AppointmentPrepState,
  AppointmentPrepSummary,
  SummarySection,
} from "@/features/appointment-prep/types/appointment-prep";

function clean(value: string) {
  return value.trim();
}

function formatDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  if (!year || !month || !day || !monthNames[month - 1]) return value;
  return `${monthNames[month - 1]} ${day}, ${year}`;
}

function formatTime(value: string) {
  if (!/^\d{2}:\d{2}$/.test(value)) return value;
  const [hours = 0, minutes = 0] = value.split(":").map(Number);
  if (hours > 23 || minutes > 59) return value;
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
}

export function buildAppointmentPrepSummary(state: AppointmentPrepState): AppointmentPrepSummary {
  const sections: SummarySection[] = [];
  const basics = [
    state.appointmentBasics.appointmentType && `Type: ${state.appointmentBasics.appointmentType}`,
    state.appointmentBasics.date && `Date: ${formatDate(state.appointmentBasics.date)}`,
    state.appointmentBasics.time && `Time: ${formatTime(state.appointmentBasics.time)}`,
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
          `${item.category || "Clarification"}: ${detail}${detail && question ? ` (${question})` : question}`,
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
          `${item.kind === "understand" ? "I think I understand" : item.kind === "unsure" ? "I am unsure about" : "I want confirmed"}: ${clean(item.text)}${clean(item.question) ? ` (${clean(item.question)})` : ""}`,
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
      return `✓ ${item.label}${location ? ` (${location})` : ""}`;
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
  const divider = "────────────────────────────────────────";
  return [
    summary.title,
    "Personal preparation sheet",
    divider,
    ...summary.sections.flatMap((section) => [
      "",
      section.title.toUpperCase(),
      ...section.lines.map((line) =>
        section.id === "priorities" || section.id === "bring" ? `  ${line}` : `• ${line}`,
      ),
    ]),
    "",
    divider,
    "NOTES DURING THE APPOINTMENT",
    "",
    "1. ",
    "2. ",
    "3. ",
    "",
    "Private preparation sheet — review before sharing.",
  ].join("\n");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function formatSummaryForClipboardHtml(summary: AppointmentPrepSummary): string {
  const sections = summary.sections
    .map((section) => {
      const ordered = section.id === "priorities";
      const items = section.lines
        .map((line) => {
          const value = ordered ? line.replace(/^\d+\.\s*/, "") : line;
          return `<li style="margin:0 0 8px;break-inside:avoid;">${escapeHtml(value)}</li>`;
        })
        .join("");
      const listStyle = section.id === "bring" ? "none" : ordered ? "decimal" : "disc";
      const tag = ordered ? "ol" : "ul";
      return `<section style="margin:24px 0 0;break-inside:avoid;">
  <h2 style="margin:0 0 10px;font-family:Georgia,serif;font-size:20px;line-height:1.25;color:#3d2f29;">${escapeHtml(section.title)}</h2>
  <${tag} style="margin:0;padding-left:${listStyle === "none" ? "0" : "22px"};list-style:${listStyle};font-size:15px;line-height:1.55;color:#3d2f29;">${items}</${tag}>
</section>`;
    })
    .join("");

  return `<article style="max-width:720px;margin:0 auto;padding:32px;font-family:Arial,sans-serif;color:#3d2f29;background:#fffaf3;">
  <header style="padding-bottom:20px;border-bottom:2px solid #b96c55;">
    <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:#b96c55;">Health Decoded · Appointment planner</p>
    <h1 style="margin:0;font-family:Georgia,serif;font-size:32px;line-height:1.1;font-weight:500;">${escapeHtml(summary.title)}</h1>
    <p style="margin:8px 0 0;font-size:13px;color:#786b62;">Personal preparation sheet</p>
  </header>
  ${sections}
  <section style="margin:28px 0 0;padding-top:18px;border-top:1px solid #dcd2c5;">
    <h2 style="margin:0 0 12px;font-family:Georgia,serif;font-size:20px;font-weight:500;">Notes during the appointment</h2>
    <p style="height:24px;margin:0;border-bottom:1px solid #dcd2c5;"></p>
    <p style="height:24px;margin:0;border-bottom:1px solid #dcd2c5;"></p>
    <p style="height:24px;margin:0;border-bottom:1px solid #dcd2c5;"></p>
  </section>
  <footer style="margin-top:28px;padding-top:12px;border-top:1px solid #dcd2c5;font-size:11px;line-height:1.5;color:#786b62;">Private preparation sheet · Review before sharing.</footer>
</article>`;
}

export const PRINT_DOCUMENT_TITLE = "appointment-preparation";
