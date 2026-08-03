"use client";

import { ArrowDown, ArrowLeft, ArrowUp, Clipboard, Plus, Printer, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { recognizeMilestone } from "@/features/achievements/lib/recognize-milestone.client";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  accessNeedOptions,
  appointmentPrepNotices,
  appointmentTypeOptions,
  changeCategories,
  clarificationCategories,
  clarificationFrameworks,
  documentGroups,
  locationOptions,
  noticedOptions,
  sectionNavigation,
  supporterRoles,
  understandingFrameworks,
  visitFormats,
} from "@/features/appointment-prep/content/appointment-prep-content";
import { appointmentQuestionLibrary } from "@/features/appointment-prep/content/appointment-question-library";
import {
  buildAppointmentPrepSummary,
  formatSummaryForClipboard,
  PRINT_DOCUMENT_TITLE,
} from "@/features/appointment-prep/lib/appointment-prep-summary";
import {
  appointmentPrepReducer,
  createSessionId,
  initialAppointmentPrepState,
  moveItem,
} from "@/features/appointment-prep/state/appointment-prep-reducer";
import type {
  AppointmentPrepState,
  Priority,
  UnderstandingKind,
  WorkspaceSection,
} from "@/features/appointment-prep/types/appointment-prep";
import styles from "@/features/appointment-prep/styles/appointment-prep.module.css";

const sectionIntro: Record<WorkspaceSection, { eyebrow: string; title: string; copy: string }> = {
  overview: {
    eyebrow: "Prepare for your appointment",
    title: "Your preparation folder",
    copy: "Move through the sections in any order. Every field is optional, and you can return to revise anything.",
  },
  basics: {
    eyebrow: "Optional details",
    title: "Appointment basics",
    copy: "Add only the details that will help you recognize and prepare for this visit.",
  },
  priorities: {
    eyebrow: "Appointment-time organization",
    title: "My most important things for this appointment",
    copy: "Choose up to five things you want to make time for. This order does not describe medical importance.",
  },
  clarify: {
    eyebrow: "Clarify",
    title: "What I want clarified",
    copy: "Record words, instructions, results, recommendations, or decisions you want a professional to explain.",
  },
  changes: {
    eyebrow: "Changes",
    title: "What has changed",
    copy: "Remember changes you may want to mention since your previous appointment. Nothing entered here is interpreted.",
  },
  understand: {
    eyebrow: "Understand",
    title: "What I currently understand",
    copy: "Organize what you want a professional to confirm or explain. The workspace does not check medical correctness.",
  },
  ask: {
    eyebrow: "Ask",
    title: "Questions I want to ask",
    copy: "Start with a framework or write your own. These prompts organize questions; they do not provide answers.",
  },
  bring: {
    eyebrow: "Bring",
    title: "What I may need to bring",
    copy: "Track checklist status and an optional location reminder. No documents or images are uploaded.",
  },
  access: {
    eyebrow: "Communication and access",
    title: "What I may want to ask about",
    copy: "Select requests you may want to confirm with the clinic. The workspace cannot determine availability.",
  },
  support: {
    eyebrow: "Optional support",
    title: "Would you like someone to support you during the appointment?",
    copy: "Your choice here does not connect accounts or share this workspace.",
  },
  review: {
    eyebrow: "Review",
    title: "Preparation summary",
    copy: "Only details you deliberately entered or selected appear below.",
  },
};

function Field({
  children,
  help,
  label,
  htmlFor,
}: {
  children: ReactNode;
  help?: string;
  label: string;
  htmlFor: string;
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={htmlFor}>
        {label}
      </label>
      {help ? (
        <p className={styles.help} id={`${htmlFor}-help`}>
          {help}
        </p>
      ) : null}
      {children}
    </div>
  );
}

function Check({
  checked,
  label,
  onChange,
  name,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
  name?: string;
}) {
  return (
    <label className={styles.check}>
      <input
        checked={checked}
        name={name}
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
      <span>{label}</span>
    </label>
  );
}

function ItemActions({
  index,
  length,
  onDelete,
  onMove,
}: {
  index: number;
  length: number;
  onDelete: () => void;
  onMove?: (direction: -1 | 1) => void;
}) {
  return (
    <div className={styles.itemActions}>
      {onMove ? (
        <>
          <Button
            aria-label="Move up"
            disabled={index === 0}
            fullWidth={false}
            onClick={() => onMove(-1)}
            size="sm"
            type="button"
            variant="secondary"
          >
            <ArrowUp aria-hidden="true" className="size-4" /> Move up
          </Button>
          <Button
            aria-label="Move down"
            disabled={index === length - 1}
            fullWidth={false}
            onClick={() => onMove(1)}
            size="sm"
            type="button"
            variant="secondary"
          >
            <ArrowDown aria-hidden="true" className="size-4" /> Move down
          </Button>
        </>
      ) : null}
      <Button
        aria-label="Delete item"
        fullWidth={false}
        onClick={onDelete}
        size="sm"
        type="button"
        variant="text"
      >
        <Trash2 aria-hidden="true" className="size-4" /> Delete
      </Button>
    </div>
  );
}

export function AppointmentPrepPage() {
  const [state, dispatch] = useReducer(appointmentPrepReducer, initialAppointmentPrepState);
  const [announcement, setAnnouncement] = useState("");
  const [clearOpen, setClearOpen] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const addFocusRef = useRef<HTMLElement | null>(null);
  const milestoneSignals = useRef(new Set<string>());
  const summary = useMemo(() => buildAppointmentPrepSummary(state), [state]);
  const summaryText = useMemo(() => formatSummaryForClipboard(summary), [summary]);

  useEffect(() => {
    headingRef.current?.focus();
  }, [state.currentSection, state.started]);
  useEffect(() => {
    if (addFocusRef.current) {
      addFocusRef.current.focus();
      addFocusRef.current = null;
    }
  });
  useEffect(() => {
    const priorityCount = state.priorities.filter((item) => item.text.trim()).length;
    if (priorityCount >= 3 && !milestoneSignals.current.has("priorities")) {
      milestoneSignals.current.add("priorities");
      void recognizeMilestone({ event: "appointment_priorities_completed", priorityCount });
    }
    const preparedQuestions = state.questions.filter((item) => item.text.trim());
    const categoryCount = new Set(preparedQuestions.map((item) => item.category)).size;
    if (
      preparedQuestions.length >= 3 &&
      categoryCount >= 2 &&
      !milestoneSignals.current.has("questions")
    ) {
      milestoneSignals.current.add("questions");
      void recognizeMilestone({
        event: "appointment_questions_completed",
        questionCount: preparedQuestions.length,
        categoryCount,
      });
    }
    const preparationAreas = new Set(["clarify", "changes", "understand", "ask", "bring"]);
    const completedSectionCount = summary.sections.filter((section) =>
      preparationAreas.has(section.id),
    ).length;
    if (
      state.currentSection === "review" &&
      completedSectionCount >= 4 &&
      !milestoneSignals.current.has("summary")
    ) {
      milestoneSignals.current.add("summary");
      void recognizeMilestone({ event: "appointment_summary_completed", completedSectionCount });
    }
  }, [state.currentSection, state.priorities, state.questions, summary.sections]);

  const replace = (next: AppointmentPrepState) => dispatch({ type: "replace", state: next });
  const navigate = (section: WorkspaceSection) => dispatch({ type: "navigate", section });
  const announce = (message: string) => {
    setAnnouncement("");
    window.setTimeout(() => setAnnouncement(message), 0);
  };
  const addPriority = (text = "", source?: string, sourceId?: string) => {
    if (state.priorities.length >= 5) {
      announce("You can keep up to five top priorities.");
      return false;
    }
    const item: Priority = {
      id: createSessionId("priority"),
      text,
      ifTimeAllows: false,
      ...(source ? { source } : {}),
      ...(sourceId ? { sourceId } : {}),
    };
    replace({ ...state, priorities: [...state.priorities, item] });
    announce("Priority added.");
    return true;
  };
  const promote = (text: string, source: string, sourceId: string) => {
    addPriority(text, source, sourceId);
  };

  async function copySummary() {
    setCopyFailed(false);
    try {
      await navigator.clipboard.writeText(summaryText);
      void recognizeMilestone({ event: "appointment_summary_exported", hasSummary: Boolean(summary.sections.length) });
      announce(appointmentPrepNotices.copied);
    } catch {
      setCopyFailed(true);
      announce("Copy did not work. The summary is available below for manual selection.");
    }
  }
  function printSummary() {
    const priorTitle = document.title;
    document.title = PRINT_DOCUMENT_TITLE;
    window.addEventListener(
      "afterprint",
      () => {
        document.title = priorTitle;
        void recognizeMilestone({ event: "appointment_summary_exported", hasSummary: Boolean(summary.sections.length) });
      },
      { once: true },
    );
    window.print();
  }
  function clearWorkspace() {
    dispatch({ type: "clear" });
    setClearOpen(false);
    setCopyFailed(false);
    announce("Your appointment preparation workspace was cleared.");
  }

  if (!state.started)
    return (
      <div className={styles.entry} aria-labelledby="appointment-prep-title">
        <div className={styles.entryRule}>
          <p className="editorial-eyebrow">A private, session-only workspace</p>
          <h1 id="appointment-prep-title" ref={headingRef} tabIndex={-1}>
            Prepare for Your Appointment
          </h1>
          <p className={styles.promise}>
            Organize what you want to clarify, what has changed, what you understand, what you want
            to ask, and what you need to bring.
          </p>
          <p className={styles.estimate}>About 5 to 15 minutes · Every field is optional</p>
        </div>
        <div className={styles.noticeStack}>
          <section className={styles.notice}>
            <h2>Before you begin</h2>
            <p>{appointmentPrepNotices.privacy}</p>
          </section>
          <section className={styles.notice}>
            <h2>What this workspace does</h2>
            <p>{appointmentPrepNotices.medical}</p>
            <p>You control what is included in your final summary.</p>
          </section>
        </div>
        <div className={styles.actions}>
          <Button fullWidth={false} onClick={() => dispatch({ type: "start" })} size="lg">
            Start preparing
          </Button>
          <Link className={styles.returnLink} href="/journey">
            <ArrowLeft aria-hidden="true" className="size-4" /> Return to your journey
          </Link>
          <Link className={styles.urgentLink} href="/urgent-help">
            View urgent help
          </Link>
        </div>
        <p aria-live="polite" className="sr-only">
          {announcement}
        </p>
      </div>
    );

  const intro = sectionIntro[state.currentSection];
  return (
    <div className={styles.workspace} aria-labelledby="workspace-heading">
      <header className={styles.workspaceHeader}>
        <p className="editorial-eyebrow">{intro.eyebrow}</p>
        <h1 id="workspace-heading" ref={headingRef} tabIndex={-1}>
          {intro.title}
        </h1>
        <p>{intro.copy}</p>
      </header>
      <div className={styles.privacyBar}>
        <p>{appointmentPrepNotices.privacy}</p>
        <p>{appointmentPrepNotices.medical}</p>
      </div>
      <nav aria-label="Appointment preparation sections" className={styles.sectionNav}>
        <ol>
          {sectionNavigation.map((section, index) => (
            <li key={section.id}>
              <button
                aria-current={state.currentSection === section.key ? "step" : undefined}
                onClick={() => navigate(section.key)}
                type="button"
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {section.short}
              </button>
            </li>
          ))}
        </ol>
      </nav>
      <div className={styles.paper}>
        {state.currentSection === "overview" ? <Overview onNavigate={navigate} /> : null}
        {state.currentSection === "basics" ? <Basics state={state} replace={replace} /> : null}
        {state.currentSection === "priorities" ? (
          <Priorities addPriority={addPriority} replace={replace} state={state} />
        ) : null}
        {state.currentSection === "clarify" ? (
          <Clarify addFocusRef={addFocusRef} promote={promote} replace={replace} state={state} />
        ) : null}
        {state.currentSection === "changes" ? (
          <Changes addFocusRef={addFocusRef} promote={promote} replace={replace} state={state} />
        ) : null}
        {state.currentSection === "understand" ? (
          <Understanding
            addFocusRef={addFocusRef}
            promote={promote}
            replace={replace}
            state={state}
          />
        ) : null}
        {state.currentSection === "ask" ? (
          <Questions addFocusRef={addFocusRef} promote={promote} replace={replace} state={state} />
        ) : null}
        {state.currentSection === "bring" ? <Documents replace={replace} state={state} /> : null}
        {state.currentSection === "access" ? <Access replace={replace} state={state} /> : null}
        {state.currentSection === "support" ? <Support replace={replace} state={state} /> : null}
        {state.currentSection === "review" ? (
          <Summary
            copyFailed={copyFailed}
            onCopy={copySummary}
            onEdit={navigate}
            onPrint={printSummary}
            summary={summary}
            summaryText={summaryText}
          />
        ) : null}
      </div>
      <footer className={styles.workspaceFooter}>
        <button onClick={() => navigate("overview")} type="button">
          Workspace overview
        </button>
        <button onClick={() => setClearOpen(true)} type="button">
          Clear this workspace
        </button>
        <Link href="/journey">Return to your journey</Link>
      </footer>
      <Modal
        description={appointmentPrepNotices.clear}
        onOpenChange={setClearOpen}
        open={clearOpen}
        title="Clear this workspace?"
      >
        <div className={styles.dialogActions}>
          <Button fullWidth={false} onClick={() => setClearOpen(false)} variant="secondary">
            Keep my preparation
          </Button>
          <Button fullWidth={false} onClick={clearWorkspace}>
            Clear this workspace
          </Button>
        </div>
      </Modal>
      {announcement ? (
        <p aria-live="polite" className={styles.status}>
          {announcement}
        </p>
      ) : null}
    </div>
  );
}

function Overview({ onNavigate }: { onNavigate: (section: WorkspaceSection) => void }) {
  return (
    <section aria-labelledby="overview-title">
      <h2 className={styles.sectionTitle} id="overview-title">
        A place for the details you choose
      </h2>
      <p className={styles.sectionLead}>
        Begin with the basics or go directly to any area. Nothing is scored, saved to your account,
        or sent to the AI guide.
      </p>
      <div className={styles.fiveAreas}>
        {sectionNavigation.slice(2, 7).map((section, index) => (
          <button key={section.id} onClick={() => onNavigate(section.key)} type="button">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{section.short}</strong>
            <small>{section.label}</small>
          </button>
        ))}
      </div>
      <div className={styles.overviewLinks}>
        {sectionNavigation
          .filter(
            (section) =>
              !["clarify", "changes", "understand", "ask", "bring"].includes(section.key),
          )
          .map((section) => (
            <button key={section.id} onClick={() => onNavigate(section.key)} type="button">
              {section.label}
            </button>
          ))}
      </div>
    </section>
  );
}

function Basics({
  state,
  replace,
}: {
  state: AppointmentPrepState;
  replace: (state: AppointmentPrepState) => void;
}) {
  const basics = state.appointmentBasics;
  const set = (key: keyof typeof basics, value: string) =>
    replace({ ...state, appointmentBasics: { ...basics, [key]: value } });
  return (
    <section aria-labelledby="basics-title">
      <h2 className={styles.sectionTitle} id="basics-title">
        Visit details
      </h2>
      <div className={styles.formGrid}>
        <Field htmlFor="appointment-type" label="Appointment type">
          <Select
            id="appointment-type"
            onChange={(e) => set("appointmentType", e.target.value)}
            value={basics.appointmentType}
          >
            <option value="">Select an option</option>
            {appointmentTypeOptions.map((option) => (
              <option key={option.id}>{option.label}</option>
            ))}
          </Select>
        </Field>
        <Field htmlFor="visit-format" label="Visit format">
          <Select
            id="visit-format"
            onChange={(e) => set("format", e.target.value)}
            value={basics.format}
          >
            <option value="">Select an option</option>
            {visitFormats.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </Select>
        </Field>
        <Field htmlFor="appointment-date" label="Appointment date">
          <Input
            id="appointment-date"
            onChange={(e) => set("date", e.target.value)}
            type="date"
            value={basics.date}
          />
        </Field>
        <Field htmlFor="appointment-time" label="Appointment time">
          <Input
            id="appointment-time"
            onChange={(e) => set("time", e.target.value)}
            type="time"
            value={basics.time}
          />
        </Field>
        <Field
          htmlFor="professional-label"
          help="A first name, role, or clinic label is enough."
          label="Professional or clinic"
        >
          <Input
            id="professional-label"
            maxLength={120}
            onChange={(e) => set("professionalLabel", e.target.value)}
            value={basics.professionalLabel}
          />
        </Field>
        <Field htmlFor="appointment-purpose" label="What is the main reason for this appointment?">
          <Input
            id="appointment-purpose"
            maxLength={120}
            onChange={(e) => set("purpose", e.target.value)}
            value={basics.purpose}
          />
        </Field>
      </div>
    </section>
  );
}

function Priorities({
  state,
  replace,
  addPriority,
}: {
  state: AppointmentPrepState;
  replace: (state: AppointmentPrepState) => void;
  addPriority: () => void;
}) {
  return (
    <section aria-labelledby="priorities-title">
      <div className={styles.sectionHeading}>
        <div>
          <h2 className={styles.sectionTitle} id="priorities-title">
            Up to five priorities
          </h2>
          <p>{state.priorities.length} of 5 spaces used</p>
        </div>
        <Button
          disabled={state.priorities.length >= 5}
          fullWidth={false}
          onClick={() => addPriority()}
          variant="secondary"
        >
          <Plus aria-hidden="true" className="size-4" /> Add a priority
        </Button>
      </div>
      {state.priorities.length ? (
        <ol className={styles.itemList}>
          {state.priorities.map((item, index) => (
            <li className={styles.item} key={item.id}>
              <p className={styles.itemNumber}>
                Priority {index + 1}
                {item.source ? ` · from ${item.source}` : ""}
              </p>
              <Field htmlFor={`priority-${item.id}`} label="What do you want to make time for?">
                <Input
                  id={`priority-${item.id}`}
                  maxLength={120}
                  onChange={(e) =>
                    replace({
                      ...state,
                      priorities: state.priorities.map((candidate) =>
                        candidate.id === item.id
                          ? { ...candidate, text: e.target.value }
                          : candidate,
                      ),
                    })
                  }
                  value={item.text}
                />
              </Field>
              <Check
                checked={item.ifTimeAllows}
                label="If time allows"
                onChange={(checked) =>
                  replace({
                    ...state,
                    priorities: state.priorities.map((candidate) =>
                      candidate.id === item.id
                        ? { ...candidate, ifTimeAllows: checked }
                        : candidate,
                    ),
                  })
                }
              />
              <ItemActions
                index={index}
                length={state.priorities.length}
                onDelete={() =>
                  replace({
                    ...state,
                    priorities: state.priorities.filter((candidate) => candidate.id !== item.id),
                  })
                }
                onMove={(direction) =>
                  replace({ ...state, priorities: moveItem(state.priorities, index, direction) })
                }
              />
            </li>
          ))}
        </ol>
      ) : (
        <Empty copy="Add a custom priority here, or add one while working in Clarify, Changes, Understand, or Ask." />
      )}
    </section>
  );
}

function Clarify({ state, replace, promote, addFocusRef }: RepeaterProps) {
  const add = () => {
    const id = createSessionId("clarification");
    replace({
      ...state,
      clarificationItems: [
        ...state.clarificationItems,
        { id, category: "", detail: "", question: "" },
      ],
    });
    requestAnimationFrame(() => {
      addFocusRef.current = document.getElementById(`clarify-category-${id}`);
      addFocusRef.current?.focus();
      addFocusRef.current = null;
    });
  };
  return (
    <section aria-labelledby="clarify-title">
      <SectionAdd
        id="clarify-title"
        label="Add a clarification"
        onAdd={add}
        title="Clarification notes"
      />
      {state.clarificationItems.length ? (
        <ol className={styles.itemList}>
          {state.clarificationItems.map((item, index) => {
            const update = (values: Partial<typeof item>) =>
              replace({
                ...state,
                clarificationItems: state.clarificationItems.map((candidate) =>
                  candidate.id === item.id ? { ...candidate, ...values } : candidate,
                ),
              });
            return (
              <li className={styles.item} key={item.id}>
                <p className={styles.itemNumber}>Clarification {index + 1}</p>
                <Field htmlFor={`clarify-category-${item.id}`} label="Category">
                  <Select
                    id={`clarify-category-${item.id}`}
                    onChange={(e) => update({ category: e.target.value })}
                    value={item.category}
                  >
                    <option value="">Choose a category</option>
                    {clarificationCategories.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </Select>
                </Field>
                <Field htmlFor={`clarify-detail-${item.id}`} label="What needs clarification?">
                  <Textarea
                    id={`clarify-detail-${item.id}`}
                    maxLength={500}
                    onChange={(e) => update({ detail: e.target.value })}
                    value={item.detail}
                  />
                </Field>
                <Field htmlFor={`clarify-question-${item.id}`} label="Question to ask">
                  <Select
                    id={`clarify-question-${item.id}`}
                    onChange={(e) => update({ question: e.target.value })}
                    value={item.question}
                  >
                    <option value="">Choose a framework</option>
                    {clarificationFrameworks.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </Select>
                  <Input
                    aria-label="Edit question to ask"
                    className="mt-2"
                    maxLength={300}
                    onChange={(e) => update({ question: e.target.value })}
                    value={item.question}
                  />
                </Field>
                <Promote
                  added={state.priorities.some((priority) => priority.sourceId === item.id)}
                  disabled={!item.detail.trim() && !item.question.trim()}
                  onClick={() => promote(item.question || item.detail, "Clarify", item.id)}
                />
                <ItemActions
                  index={index}
                  length={state.clarificationItems.length}
                  onDelete={() =>
                    replace({
                      ...state,
                      clarificationItems: state.clarificationItems.filter(
                        (candidate) => candidate.id !== item.id,
                      ),
                    })
                  }
                />
              </li>
            );
          })}
        </ol>
      ) : (
        <Empty copy="Add a word, result, instruction, or topic you want explained." />
      )}
    </section>
  );
}

function Changes({ state, replace, promote, addFocusRef }: RepeaterProps) {
  const add = () => {
    const id = createSessionId("change");
    replace({
      ...state,
      changeItems: [
        ...state.changeItems,
        { id, category: "", detail: "", noticed: "", question: "" },
      ],
    });
    requestAnimationFrame(() => {
      addFocusRef.current = document.getElementById(`change-category-${id}`);
      addFocusRef.current?.focus();
      addFocusRef.current = null;
    });
  };
  return (
    <section aria-labelledby="changes-title">
      <SectionAdd id="changes-title" label="Add a change" onAdd={add} title="Changes to mention" />
      <p className={styles.neutralReminder}>
        Do not delay urgent or emergency help merely to finish this workspace.{" "}
        <Link href="/urgent-help">View urgent help</Link>.
      </p>
      {state.changeItems.length ? (
        <ol className={styles.itemList}>
          {state.changeItems.map((item, index) => {
            const update = (values: Partial<typeof item>) =>
              replace({
                ...state,
                changeItems: state.changeItems.map((candidate) =>
                  candidate.id === item.id ? { ...candidate, ...values } : candidate,
                ),
              });
            return (
              <li className={styles.item} key={item.id}>
                <p className={styles.itemNumber}>Change {index + 1}</p>
                <Field htmlFor={`change-category-${item.id}`} label="Category">
                  <Select
                    id={`change-category-${item.id}`}
                    onChange={(e) => update({ category: e.target.value })}
                    value={item.category}
                  >
                    <option value="">Choose a category</option>
                    {changeCategories.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </Select>
                </Field>
                <Field htmlFor={`change-detail-${item.id}`} label="What changed?">
                  <Textarea
                    id={`change-detail-${item.id}`}
                    maxLength={500}
                    onChange={(e) => update({ detail: e.target.value })}
                    value={item.detail}
                  />
                </Field>
                <Field
                  htmlFor={`change-noticed-${item.id}`}
                  label="About when did you notice this?"
                >
                  <Select
                    id={`change-noticed-${item.id}`}
                    onChange={(e) => update({ noticed: e.target.value })}
                    value={item.noticed}
                  >
                    <option value="">Choose an option</option>
                    {noticedOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </Select>
                </Field>
                <Field
                  htmlFor={`change-question-${item.id}`}
                  label="What do you want to ask about this?"
                >
                  <Textarea
                    id={`change-question-${item.id}`}
                    maxLength={300}
                    onChange={(e) => update({ question: e.target.value })}
                    value={item.question}
                  />
                </Field>
                <Promote
                  added={state.priorities.some((priority) => priority.sourceId === item.id)}
                  disabled={!item.detail.trim() && !item.question.trim()}
                  onClick={() => promote(item.question || item.detail, "Changes", item.id)}
                />
                <ItemActions
                  index={index}
                  length={state.changeItems.length}
                  onDelete={() =>
                    replace({
                      ...state,
                      changeItems: state.changeItems.filter(
                        (candidate) => candidate.id !== item.id,
                      ),
                    })
                  }
                />
              </li>
            );
          })}
        </ol>
      ) : (
        <Empty copy="Add only the changes you want to remember to mention." />
      )}
    </section>
  );
}

type RepeaterProps = {
  state: AppointmentPrepState;
  replace: (state: AppointmentPrepState) => void;
  promote: (text: string, source: string, sourceId: string) => void;
  addFocusRef: { current: HTMLElement | null };
};

function Understanding({ state, replace, promote, addFocusRef }: RepeaterProps) {
  const groups: { kind: UnderstandingKind; title: string }[] = [
    { kind: "understand", title: "What I think I understand" },
    { kind: "unsure", title: "What I am unsure about" },
    { kind: "confirm", title: "What I want confirmed" },
  ];
  const add = (kind: UnderstandingKind) => {
    const id = createSessionId("understanding");
    replace({
      ...state,
      understandingItems: [...state.understandingItems, { id, kind, text: "", question: "" }],
    });
    requestAnimationFrame(() => {
      addFocusRef.current = document.getElementById(`understand-${id}`);
      addFocusRef.current?.focus();
      addFocusRef.current = null;
    });
  };
  return (
    <section aria-labelledby="understand-title">
      <h2 className={styles.sectionTitle} id="understand-title">
        Notes to confirm with a professional
      </h2>
      {groups.map((group) => (
        <section className={styles.subsection} key={group.kind}>
          <div className={styles.sectionHeading}>
            <h3>{group.title}</h3>
            <Button fullWidth={false} onClick={() => add(group.kind)} size="sm" variant="secondary">
              <Plus aria-hidden="true" className="size-4" /> Add
            </Button>
          </div>
          {state.understandingItems
            .filter((item) => item.kind === group.kind)
            .map((item, index, items) => {
              const update = (values: Partial<typeof item>) =>
                replace({
                  ...state,
                  understandingItems: state.understandingItems.map((candidate) =>
                    candidate.id === item.id ? { ...candidate, ...values } : candidate,
                  ),
                });
              return (
                <div className={styles.item} key={item.id}>
                  <Field htmlFor={`understand-${item.id}`} label="What do you want to record?">
                    <Textarea
                      id={`understand-${item.id}`}
                      maxLength={500}
                      onChange={(e) => update({ text: e.target.value })}
                      value={item.text}
                    />
                  </Field>
                  <Field
                    htmlFor={`understand-question-${item.id}`}
                    label="Optional prepared question"
                  >
                    <Select
                      id={`understand-question-${item.id}`}
                      onChange={(e) => update({ question: e.target.value })}
                      value={item.question}
                    >
                      <option value="">Choose a framework</option>
                      {understandingFrameworks.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </Select>
                  </Field>
                  <Promote
                    added={state.priorities.some((priority) => priority.sourceId === item.id)}
                    disabled={!item.text.trim() && !item.question.trim()}
                    onClick={() => promote(item.question || item.text, "Understand", item.id)}
                  />
                  <ItemActions
                    index={index}
                    length={items.length}
                    onDelete={() =>
                      replace({
                        ...state,
                        understandingItems: state.understandingItems.filter(
                          (candidate) => candidate.id !== item.id,
                        ),
                      })
                    }
                  />
                </div>
              );
            })}
        </section>
      ))}
    </section>
  );
}

function Questions({ state, replace, promote, addFocusRef }: RepeaterProps) {
  const add = (category = "Another question", text = "") => {
    const id = createSessionId("question");
    replace({
      ...state,
      questions: [...state.questions, { id, category, text, ifTimeAllows: false }],
    });
    requestAnimationFrame(() => {
      addFocusRef.current = document.getElementById(`question-${id}`);
      addFocusRef.current?.focus();
      addFocusRef.current = null;
    });
  };
  const categories = [
    ...new Set(appointmentQuestionLibrary.map((item) => item.category)),
    "Another question",
  ];
  return (
    <section aria-labelledby="questions-title">
      <SectionAdd
        id="questions-title"
        label="Write my own question"
        onAdd={() => add()}
        title="Question list"
      />
      <details className={styles.library}>
        <summary>Browse question frameworks</summary>
        <div>
          {appointmentQuestionLibrary.map((question) => (
            <button
              key={question.id}
              onClick={() => add(question.category, question.text)}
              type="button"
            >
              <span>{question.category}</span>
              {question.text}
            </button>
          ))}
        </div>
      </details>
      {state.questions.length ? (
        <ol className={styles.itemList}>
          {state.questions.map((item, index) => {
            const update = (values: Partial<typeof item>) =>
              replace({
                ...state,
                questions: state.questions.map((candidate) =>
                  candidate.id === item.id ? { ...candidate, ...values } : candidate,
                ),
              });
            return (
              <li className={styles.item} key={item.id}>
                <p className={styles.itemNumber}>Question {index + 1}</p>
                <Field htmlFor={`question-category-${item.id}`} label="Category">
                  <Select
                    id={`question-category-${item.id}`}
                    onChange={(e) => update({ category: e.target.value })}
                    value={item.category}
                  >
                    {categories.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </Select>
                </Field>
                <Field htmlFor={`question-${item.id}`} label="Question">
                  <Textarea
                    id={`question-${item.id}`}
                    maxLength={300}
                    onChange={(e) => update({ text: e.target.value })}
                    value={item.text}
                  />
                </Field>
                <Check
                  checked={item.ifTimeAllows}
                  label="If time allows"
                  onChange={(checked) => update({ ifTimeAllows: checked })}
                />
                <Promote
                  added={state.priorities.some((priority) => priority.sourceId === item.id)}
                  disabled={!item.text.trim()}
                  onClick={() => promote(item.text, "Ask", item.id)}
                />
                <ItemActions
                  index={index}
                  length={state.questions.length}
                  onDelete={() =>
                    replace({
                      ...state,
                      questions: state.questions.filter((candidate) => candidate.id !== item.id),
                    })
                  }
                  onMove={(direction) =>
                    replace({ ...state, questions: moveItem(state.questions, index, direction) })
                  }
                />
              </li>
            );
          })}
        </ol>
      ) : (
        <Empty copy="Choose a framework above or write your own question." />
      )}
    </section>
  );
}

function Documents({
  state,
  replace,
}: {
  state: AppointmentPrepState;
  replace: (state: AppointmentPrepState) => void;
}) {
  return (
    <section aria-labelledby="documents-title">
      <h2 className={styles.sectionTitle} id="documents-title">
        Preparation checklist
      </h2>
      <p className={styles.sectionLead}>
        The app records only checklist status and optional session-only location reminders.
      </p>
      {documentGroups.map((group) => (
        <fieldset className={styles.checkGroup} key={group.id}>
          <legend>{group.title}</legend>
          {state.documentItems
            .filter((item) => item.group === group.key)
            .map((item) => (
              <div className={styles.documentRow} key={item.id}>
                <Check
                  checked={item.selected}
                  label={item.label}
                  onChange={(checked) =>
                    replace({
                      ...state,
                      documentItems: state.documentItems.map((candidate) =>
                        candidate.id === item.id ? { ...candidate, selected: checked } : candidate,
                      ),
                    })
                  }
                />
                {item.selected ? (
                  <div className={styles.locationControls}>
                    <Select
                      aria-label={`Where is ${item.label}?`}
                      onChange={(e) =>
                        replace({
                          ...state,
                          documentItems: state.documentItems.map((candidate) =>
                            candidate.id === item.id
                              ? {
                                  ...candidate,
                                  location: e.target.value,
                                  locationDetail:
                                    e.target.value === "Another location"
                                      ? candidate.locationDetail
                                      : "",
                                }
                              : candidate,
                          ),
                        })
                      }
                      value={item.location}
                    >
                      <option value="">Where is this item?</option>
                      {locationOptions.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </Select>
                    {item.location === "Another location" ? (
                      <Field htmlFor={`document-location-${item.id}`} label="Type the location">
                        <Input
                          id={`document-location-${item.id}`}
                          maxLength={120}
                          onChange={(e) =>
                            replace({
                              ...state,
                              documentItems: state.documentItems.map((candidate) =>
                                candidate.id === item.id
                                  ? { ...candidate, locationDetail: e.target.value }
                                  : candidate,
                              ),
                            })
                          }
                          placeholder="For example, in the kitchen drawer"
                          value={item.locationDetail}
                        />
                      </Field>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ))}
        </fieldset>
      ))}
    </section>
  );
}

function Access({
  state,
  replace,
}: {
  state: AppointmentPrepState;
  replace: (state: AppointmentPrepState) => void;
}) {
  return (
    <fieldset className={styles.checkGroup}>
      <legend>Requests I may want to ask about</legend>
      {accessNeedOptions.map((option) => (
        <Check
          checked={state.accessNeeds.includes(option)}
          key={option}
          label={option}
          onChange={(checked) =>
            replace({
              ...state,
              accessNeeds: checked
                ? [...state.accessNeeds, option]
                : state.accessNeeds.filter((item) => item !== option),
            })
          }
        />
      ))}
    </fieldset>
  );
}

function Support({
  state,
  replace,
}: {
  state: AppointmentPrepState;
  replace: (state: AppointmentPrepState) => void;
}) {
  return (
    <section aria-labelledby="support-choice">
      <fieldset className={styles.radioGroup}>
        <legend id="support-choice">Would you like someone to support you?</legend>
        {[
          ["no", "No"],
          ["deciding", "I am deciding"],
          ["yes", "Yes"],
        ].map(([value, label]) => (
          <label key={value}>
            <input
              checked={state.supportPerson.choice === value}
              name="support-choice"
              onChange={() =>
                replace({
                  ...state,
                  supportPerson: {
                    choice: value as "no" | "deciding" | "yes",
                    roles: value === "yes" ? state.supportPerson.roles : [],
                  },
                })
              }
              type="radio"
            />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>
      {state.supportPerson.choice === "yes" ? (
        <fieldset className={styles.checkGroup}>
          <legend>What role would you like them to have?</legend>
          {supporterRoles.map((role) => (
            <Check
              checked={state.supportPerson.roles.includes(role)}
              key={role}
              label={role}
              onChange={(checked) =>
                replace({
                  ...state,
                  supportPerson: {
                    ...state.supportPerson,
                    roles: checked
                      ? [...state.supportPerson.roles, role]
                      : state.supportPerson.roles.filter((item) => item !== role),
                  },
                })
              }
            />
          ))}
        </fieldset>
      ) : null}
      <aside className={styles.autonomy}>
        <h3>You stay in control</h3>
        <p>
          You decide whether the person attends, what they may hear, whether they may speak or take
          notes, and whether that permission changes. Attendance does not give someone
          decision-making authority or automatic access.
        </p>
      </aside>
    </section>
  );
}

function Summary({
  summary,
  summaryText,
  onEdit,
  onCopy,
  onPrint,
  copyFailed,
}: {
  summary: ReturnType<typeof buildAppointmentPrepSummary>;
  summaryText: string;
  onEdit: (section: WorkspaceSection) => void;
  onCopy: () => void;
  onPrint: () => void;
  copyFailed: boolean;
}) {
  return (
    <section className={styles.summary} aria-labelledby="summary-title">
      <div className={styles.summaryActions}>
        <Button disabled={!summary.sections.length} fullWidth={false} onClick={onPrint}>
          <Printer aria-hidden="true" className="size-4" /> Print
        </Button>
        <Button
          disabled={!summary.sections.length}
          fullWidth={false}
          onClick={onCopy}
          variant="secondary"
        >
          <Clipboard aria-hidden="true" className="size-4" /> Copy preparation summary
        </Button>
      </div>
      <div className={styles.printWarning}>
        <p>{appointmentPrepNotices.print}</p>
        <p>{appointmentPrepNotices.sharing}</p>
      </div>
      <h2 id="summary-title">Appointment preparation</h2>
      {summary.sections.length ? (
        summary.sections.map((section) => (
          <section className={styles.summarySection} key={section.id}>
            <div>
              <h3>{section.title}</h3>
              <button onClick={() => onEdit(section.id as WorkspaceSection)} type="button">
                Edit section
              </button>
            </div>
            <ul>
              {section.lines.map((line, index) => (
                <li key={`${section.id}-${index}`}>{line}</li>
              ))}
            </ul>
          </section>
        ))
      ) : (
        <Empty copy="Your summary is empty. Return to any workspace section to add only what you choose." />
      )}
      <section className={styles.notes}>
        <h3>Notes during the appointment</h3>
        <div aria-label="Blank writing area for notes" />
      </section>
      <div className={styles.printBoundaries}>
        <p>{appointmentPrepNotices.privacy}</p>
        <p>{appointmentPrepNotices.medical}</p>
      </div>
      {copyFailed ? (
        <div className={styles.manualCopy}>
          <label htmlFor="manual-summary">Copy manually</label>
          <p>Select the text below and use your device&apos;s copy command.</p>
          <Textarea id="manual-summary" readOnly rows={12} value={summaryText} />
        </div>
      ) : null}
    </section>
  );
}

function SectionAdd({
  id,
  label,
  onAdd,
  title,
}: {
  id: string;
  label: string;
  onAdd: () => void;
  title: string;
}) {
  return (
    <div className={styles.sectionHeading}>
      <h2 className={styles.sectionTitle} id={id}>
        {title}
      </h2>
      <Button fullWidth={false} onClick={onAdd} variant="secondary">
        <Plus aria-hidden="true" className="size-4" /> {label}
      </Button>
    </div>
  );
}
function Empty({ copy }: { copy: string }) {
  return <p className={styles.empty}>{copy}</p>;
}
function Promote({
  added,
  disabled,
  onClick,
}: {
  added: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <div className={styles.promoteRow}>
      <Button
        disabled={disabled || added}
        fullWidth={false}
        onClick={onClick}
        size="sm"
        type="button"
        variant="secondary"
      >
        {added ? "Added to top priorities" : "Add to top priorities"}
      </Button>
      <p>
        (Optional. This adds a copy to Top priorities; the original stays here and in this section
        of your summary.)
      </p>
    </div>
  );
}
