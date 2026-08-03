import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const [page, content, reducer, summary, route, urgentRoute, journey, styles] = await Promise.all([
  read("features/appointment-prep/components/appointment-prep-page.tsx"),
  read("features/appointment-prep/content/appointment-prep-content.ts"),
  read("features/appointment-prep/state/appointment-prep-reducer.ts"),
  read("features/appointment-prep/lib/appointment-prep-summary.ts"),
  read("app/(app)/appointment-prep/page.tsx"),
  read("app/(app)/urgent-help/page.tsx"),
  read("app/(app)/journey/page.tsx"),
  read("features/appointment-prep/styles/appointment-prep.module.css"),
]);

test("content uses deterministic, unique APPT-PREP IDs", () => {
  const ids = [...content.matchAll(/(?:id: |APPOINTMENT_PREP_ID = )["`]([^"`]+)["`]/g)]
    .map((match) => match[1])
    .filter((id) => id?.startsWith("APPT-PREP"));
  assert.ok(ids.length >= 15);
  assert.equal(new Set(ids).size, ids.length);
  assert.match(content, /APPT-PREP-S01/);
  assert.match(content, /APPT-PREP-S10/);
  assert.match(content, /APPT-PREP-F01/);
});

test("authenticated route inherits the protected app layout and keeps neutral metadata", () => {
  assert.match(route, /AppointmentPrepPage/);
  assert.match(route, /title: "Appointment preparation"/);
  assert.doesNotMatch(route, /patient name|clinician name|diagnosis|medication/i);
  assert.match(journey, /href="\/appointment-prep"/);
  assert.match(journey, /Prepare for an appointment/);
});

test("urgent help stays in the authenticated appointment context", () => {
  assert.match(page, /href="\/urgent-help"/);
  assert.doesNotMatch(page, /href="\/caregiver\/urgent-help"/);
  assert.match(urgentRoute, /returnHref="\/appointment-prep"/);
  assert.match(urgentRoute, /returnLabel="Return to Appointment Preparation"/);
});

test("entry discloses exact privacy, sharing, clearing, copying, and medical boundaries", () => {
  for (const phrase of [
    "Your preparation stays in this browser session",
    "It does not interpret symptoms, test results, medicines, or treatment decisions",
    "You decide what to share",
    "This action cannot be undone",
    "Check where you paste it before sharing",
  ])
    assert.match(content, new RegExp(phrase));
  assert.match(page, /Every field is optional/);
});

test("workspace state is mounted-session only with no persistence, network, AI, logging, or analytics", () => {
  const combined = `${page}\n${reducer}\n${summary}`;
  assert.doesNotMatch(
    combined,
    /localStorage|sessionStorage|indexedDB|supabase|services\/ai|fetch\(|analytics|logging|useSearchParams|URLSearchParams/iu,
  );
  assert.match(page, /useReducer\(appointmentPrepReducer, initialAppointmentPrepState\)/);
  assert.doesNotMatch(page, /<form|action=/);
});

test("workspace covers the required areas and optional visit preparation", () => {
  for (const phrase of [
    "Appointment basics",
    "What I want clarified",
    "What has changed",
    "What I currently understand",
    "Questions I want to ask",
    "What I may need to bring",
    "Communication and access",
    "Support person",
    "Preparation summary",
  ])
    assert.match(content, new RegExp(phrase));
  assert.match(content, /Primary care/);
  assert.match(content, /Telehealth/);
  assert.match(page, /type="date"/);
  assert.match(page, /type="time"/);
});

test("priority and question controls enforce ordering and time organization", () => {
  assert.match(page, /state\.priorities\.length >= 5/);
  assert.match(page, /You can keep up to five top priorities/);
  assert.match(page, /Optional\. This adds a copy to Top priorities/);
  assert.match(page, /the original stays here and in this section/);
  assert.match(page, /priority\.sourceId === item\.id/);
  assert.match(page, /Added to top priorities/);
  assert.match(page, /Move up/);
  assert.match(page, /Move down/);
  assert.match(page, /If time allows/);
  assert.match(page, /This order does not describe medical importance/);
  assert.match(reducer, /moveItem/);
});

test("documents are checklist-only and preserve the clinic-requested distinction", () => {
  assert.match(content, /Commonly useful/);
  assert.match(content, /Bring if the clinic requested it/);
  assert.match(content, /Plans to confirm/);
  assert.match(page, /No documents or images are uploaded/);
  assert.match(page, /item\.location === "Another location"/);
  assert.match(page, /label="Type the location"/);
  assert.match(summary, /clean\(item\.locationDetail\)/);
  assert.doesNotMatch(page, /type="file"|uploadDocument|uploadFile/i);
});

test("support-person choices preserve consent and prohibit account sharing", () => {
  assert.match(page, /Your choice here does not connect accounts or share this workspace/);
  assert.match(page, /You decide whether the person attends/);
  assert.match(page, /does not give someone\s+decision-making authority or automatic access/);
});

test("summary excludes empty sections and supports plain text copy, print, and reset", () => {
  assert.match(summary, /if \(basics\.length\)/);
  assert.match(summary, /priorities\.length/);
  assert.match(summary, /filter\(\(item\) => clean\(item\.text\)\)/);
  assert.match(summary, /filter\(\(item\) => item\.selected\)/);
  assert.match(summary, /formatSummaryForClipboard/);
  assert.match(summary, /PRINT_DOCUMENT_TITLE = "appointment-preparation"/);
  assert.match(page, /navigator\.clipboard\.writeText/);
  assert.match(page, /window\.print\(\)/);
  assert.match(page, /dispatch\(\{ type: "clear" \}\)/);
  assert.match(page, /Copy manually/);
});

test("accessibility, focus, live-region, print, responsive, and reduced-motion contracts are present", () => {
  assert.match(page, /headingRef\.current\?\.focus/);
  assert.match(page, /aria-live="polite"/);
  assert.match(page, /aria-current=/);
  assert.match(page, /aria-label="Move up"/);
  assert.match(styles, /@media print/);
  assert.match(styles, /@media \(max-width: 24rem\)/);
  assert.match(styles, /overflow-x: auto/);
  assert.match(styles, /break-inside: avoid/);
  assert.doesNotMatch(styles, /animation:/);
});
