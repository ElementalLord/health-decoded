import assert from "node:assert/strict";
import test from "node:test";

import {
  buildAppointmentPrepSummary,
  formatSummaryForClipboard,
  formatSummaryForClipboardHtml,
} from "../features/appointment-prep/lib/appointment-prep-summary.ts";

const state = {
  started: true,
  appointmentBasics: {
    appointmentType: "Primary care",
    date: "2026-09-24",
    time: "14:30",
    format: "In person",
    professionalLabel: "Community clinic",
    purpose: "Review my plan",
  },
  priorities: [
    {
      id: "priority-1",
      text: "Understand my next step <without guessing>",
      ifTimeAllows: false,
    },
  ],
  clarificationItems: [],
  changeItems: [],
  understandingItems: [],
  questions: [],
  documentItems: [],
  accessNeeds: [],
  supportPerson: { choice: "", roles: [] },
  currentSection: "review",
  summaryViewed: true,
};

test("export summary formats dates and times for people rather than form controls", () => {
  const summary = buildAppointmentPrepSummary(state);
  assert.deepEqual(summary.sections[0]?.lines.slice(0, 4), [
    "Type: Primary care",
    "Date: September 24, 2026",
    "Time: 2:30 PM",
    "Format: In person",
  ]);
});

test("plain-text copy has a readable hierarchy, notes, and privacy footer", () => {
  const text = formatSummaryForClipboard(buildAppointmentPrepSummary(state));
  assert.match(text, /^Appointment preparation\nPersonal preparation sheet\n─+/);
  assert.match(text, /APPOINTMENT BASICS/);
  assert.match(text, /MY TOP PRIORITIES/);
  assert.match(text, /NOTES DURING THE APPOINTMENT\n\n1\. \n2\. \n3\. /);
  assert.match(text, /Private preparation sheet — review before sharing\.$/);
  assert.doesNotMatch(text, /\n- /);
});

test("rich copy is styled, semantic, and escapes learner-entered content", () => {
  const html = formatSummaryForClipboardHtml(buildAppointmentPrepSummary(state));
  assert.match(html, /<article style=/);
  assert.match(html, /Health Decoded · Appointment planner/);
  assert.match(html, /<ol style=/);
  assert.match(html, /Understand my next step &lt;without guessing&gt;/);
  assert.doesNotMatch(html, /Understand my next step <without guessing>/);
  assert.match(html, /Notes during the appointment/);
});
