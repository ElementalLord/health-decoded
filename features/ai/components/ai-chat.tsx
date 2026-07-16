"use client";

import { ArrowRight, Copy, RefreshCw, Send, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AiResponseContent } from "@/features/ai/components/ai-response-content";
import {
  AI_MAX_CONVERSATION_MESSAGES,
  AI_MAX_MESSAGE_CHARACTERS,
  AI_MAX_SESSION_HISTORY_BYTES,
} from "@/features/ai/constants/ai-limits";
import { aiChatStreamEventSchema } from "@/features/ai/schemas/ai-chat.schema";
import type { AiRelatedContent } from "@/features/ai/types/ai";
import { cn } from "@/lib/utils";

type MessageRole = "assistant" | "user";

type ChatMessage = {
  readonly content: string;
  readonly id: string;
  readonly lessonContextUsed: boolean;
  readonly relatedContent: readonly AiRelatedContent[];
  readonly role: MessageRole;
  readonly suggestedQuestions: readonly string[];
};

const suggestedPrompts = [
  {
    question: "What is insulin resistance?",
    topic: "Start with the basics",
  },
  {
    question: "Can you explain today's lesson more simply?",
    topic: "Review today’s lesson",
  },
  {
    question: "Why does exercise help blood sugar?",
    topic: "Connect it to daily life",
  },
  {
    question: "What does metformin do?",
    topic: "Understand a medication",
  },
] as const;

const streamErrorMessages = {
  AI_CONFIGURATION_ERROR:
    "The educational assistant is not configured right now. Please try again later.",
  AI_RATE_LIMITED: "Please wait a moment before trying again.",
  AI_TIMEOUT: "That explanation took too long. Please try again.",
  AI_UNAVAILABLE: "The AI assistant is temporarily unavailable. Please try again.",
} as const;

function errorMessageForResponse(status: number) {
  if (status === 401) return "Your session has ended. Please sign in again.";
  if (status === 429) return "Please wait a moment before trying again.";
  if (status === 504) return "That explanation took too long. Please try again.";
  return "The AI assistant is temporarily unavailable. Please try again.";
}

function createMessage(role: MessageRole, content = ""): ChatMessage {
  return {
    content,
    id: crypto.randomUUID(),
    lessonContextUsed: false,
    relatedContent: [],
    role,
    suggestedQuestions: [],
  };
}

function historyBeforeRegeneration(messages: readonly ChatMessage[], question: string) {
  let end = messages.length;
  if (messages[end - 1]?.role === "assistant") end -= 1;
  if (messages[end - 1]?.role === "user" && messages[end - 1]?.content.trim() === question.trim()) {
    end -= 1;
  }
  return messages.slice(0, end);
}

function boundedSessionHistory(messages: readonly ChatMessage[]) {
  const encoder = new TextEncoder();
  const selected: { content: string; role: MessageRole }[] = [];
  let bytes = 0;

  for (const entry of messages.slice(-AI_MAX_CONVERSATION_MESSAGES).reverse()) {
    if (!entry.content.trim()) continue;
    const candidate = { content: entry.content, role: entry.role };
    const candidateBytes = encoder.encode(JSON.stringify(candidate)).byteLength;
    if (bytes + candidateBytes > AI_MAX_SESSION_HISTORY_BYTES) continue;
    selected.unshift(candidate);
    bytes += candidateBytes;
  }

  return selected;
}

function readStreamEvents(chunk: string, onEvent: (event: unknown) => void) {
  for (const event of chunk.split("\n\n")) {
    const data = event
      .split("\n")
      .find((line) => line.startsWith("data: "))
      ?.slice(6);
    if (!data) continue;

    try {
      onEvent(JSON.parse(data));
    } catch {
      onEvent({ code: "AI_UNAVAILABLE", type: "error" });
    }
  }
}

export function AiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [lastQuestion, setLastQuestion] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const scrollFrameRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      abortControllerRef.current?.abort();
      if (scrollFrameRef.current !== null) cancelAnimationFrame(scrollFrameRef.current);
    },
    [],
  );

  useEffect(() => {
    if (!messages.length) return;

    if (scrollFrameRef.current !== null) cancelAnimationFrame(scrollFrameRef.current);
    scrollFrameRef.current = requestAnimationFrame(() => {
      const reducedMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        Boolean(document.querySelector("[data-reduced-motion='true']"));
      conversationEndRef.current?.scrollIntoView({
        behavior: reducedMotion || isStreaming ? "auto" : "smooth",
        block: "end",
      });
    });
  }, [isStreaming, messages]);

  function resizeInput(element: HTMLTextAreaElement) {
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, 160)}px`;
    element.style.overflowY = element.scrollHeight > 160 ? "auto" : "hidden";
  }

  function appendAssistantText(assistantId: string, text: string) {
    setMessages((current) =>
      current.map((entry) =>
        entry.id === assistantId ? { ...entry, content: `${entry.content}${text}` } : entry,
      ),
    );
  }

  function setAssistantContext(
    assistantId: string,
    context: {
      readonly lessonUsed: boolean;
      readonly relatedContent: readonly AiRelatedContent[];
      readonly suggestedQuestions: readonly string[];
    },
  ) {
    setMessages((current) =>
      current.map((entry) =>
        entry.id === assistantId
          ? {
              ...entry,
              lessonContextUsed: context.lessonUsed,
              relatedContent: context.relatedContent,
              suggestedQuestions: context.suggestedQuestions,
            }
          : entry,
      ),
    );
  }

  async function ask(question: string, regenerate = false) {
    if (isStreaming || !question.trim()) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setError(null);
    setLastQuestion(question);

    const assistantMessage = createMessage("assistant");
    const priorMessages = regenerate ? historyBeforeRegeneration(messages, question) : messages;
    const sessionHistory = boundedSessionHistory(priorMessages);
    const removeEmptyAssistant = () =>
      setMessages((current) =>
        current.filter(
          (entry) => entry.id !== assistantMessage.id || Boolean(entry.content.trim()),
        ),
      );

    if (regenerate) {
      setMessages((current) => [...current, assistantMessage]);
    } else {
      setMessages((current) => [...current, createMessage("user", question), assistantMessage]);
    }
    setMessage("");
    setIsStreaming(true);

    try {
      const response = await fetch("/api/ai/chat", {
        body: JSON.stringify({
          message: question,
          ...(sessionHistory.length ? { messages: sessionHistory } : {}),
        }),
        headers: { accept: "text/event-stream", "content-type": "application/json" },
        method: "POST",
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        setError(errorMessageForResponse(response.status));
        setMessages((current) => current.filter((entry) => entry.id !== assistantMessage.id));
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let receivedDone = false;
      let streamFailed = false;

      while (!controller.signal.aborted) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lastBoundary = buffer.lastIndexOf("\n\n");
        if (lastBoundary === -1) continue;

        const completeEvents = buffer.slice(0, lastBoundary);
        buffer = buffer.slice(lastBoundary + 2);
        readStreamEvents(completeEvents, (unknownEvent) => {
          const event = aiChatStreamEventSchema.safeParse(unknownEvent);
          if (!event.success) {
            streamFailed = true;
            setError(streamErrorMessages.AI_UNAVAILABLE);
            return;
          }

          if (event.data.type === "delta") {
            appendAssistantText(assistantMessage.id, event.data.text);
          } else if (event.data.type === "context") {
            setAssistantContext(assistantMessage.id, event.data);
          } else if (event.data.type === "error") {
            streamFailed = true;
            setError(streamErrorMessages[event.data.code]);
          } else if (event.data.type === "done") {
            receivedDone = true;
          }
        });

        if (streamFailed) {
          await reader.cancel();
          break;
        }
      }

      if (!controller.signal.aborted && (streamFailed || !receivedDone)) {
        if (!streamFailed) {
          setError("The AI assistant stopped before finishing. Please try again.");
        }
        removeEmptyAssistant();
      }
    } catch (caught) {
      if (!(caught instanceof DOMException && caught.name === "AbortError")) {
        setError("The AI assistant is temporarily unavailable. Please try again.");
        removeEmptyAssistant();
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(message.trim());
  }

  async function copyResponse(messageId: string, content: string) {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
    } catch {
      setError("We could not copy that response. Please select the text and try again.");
    }
  }

  function askFollowUp() {
    setMessage("Can you explain that another way?");
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function startNewConversation() {
    if (isStreaming) return;
    setMessages([]);
    setError(null);
    setLastQuestion(null);
    setCopiedMessageId(null);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <div className="mt-7 flex min-h-0 flex-1 flex-col sm:mt-8">
      <aside
        aria-label="Educational safety notice"
        className="mb-6 flex gap-3 border-y border-accent-warm/35 bg-[#f2e7df] px-4 py-4 text-sm leading-6"
        id="ai-safety-notice"
        role="note"
      >
        <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent-warm" />
        <div>
          <p className="font-semibold text-foreground">Educational support only</p>
          <p className="text-muted-foreground">
            Health Decoded explains learning topics. It does not diagnose, interpret personal
            results, or recommend treatments or medication changes. For urgent symptoms, contact
            local emergency services.
          </p>
        </div>
      </aside>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">This conversation clears when you leave.</p>
        {messages.length ? (
          <Button
            fullWidth={false}
            onClick={startNewConversation}
            size="sm"
            type="button"
            variant="secondary"
          >
            New conversation
          </Button>
        ) : null}
      </div>
      <section
        aria-label="AI tutor conversation"
        className="min-h-0 flex-1 space-y-5 overflow-y-auto pb-6 sm:space-y-6"
      >
        {messages.length ? (
          messages.map((entry, index) => {
            const isAssistant = entry.role === "assistant";
            const isLatestAssistant = isAssistant && index === messages.length - 1;

            return (
              <article
                className={cn("flex", isAssistant ? "justify-start" : "justify-end")}
                key={entry.id}
              >
                <div
                  className={cn(
                    "max-w-[92%] sm:max-w-[86%]",
                    isAssistant
                      ? "border-l-2 border-success bg-info/55 px-5 py-4 sm:px-7 sm:py-5"
                      : "rounded-[9px] border border-accent-warm/25 bg-[#f3e4dc] px-4 py-3 text-foreground shadow-[0_2px_0_rgb(61_47_41/0.06)]",
                  )}
                >
                  {isAssistant ? (
                    entry.content ? (
                      <>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-success">
                          Health Decoded guide
                        </p>
                        <AiResponseContent content={entry.content} />
                        {entry.relatedContent.length ? (
                          <div className="mt-4 border-t border-border pt-3">
                            <p className="text-sm font-semibold text-foreground">Related content</p>
                            <ul className="mt-2 space-y-1.5 text-sm">
                              {entry.relatedContent.map((item) => (
                                <li key={`${item.kind}-${item.href}`}>
                                  <Link
                                    className="text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    href={item.href}
                                  >
                                    {item.kind === "lesson"
                                      ? "Lesson"
                                      : item.kind === "medication"
                                        ? "Medication"
                                        : item.kind === "caregiver"
                                          ? "Caregiver guide"
                                          : "Learning story"}
                                    : {item.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                        {!isStreaming && isLatestAssistant ? (
                          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-3">
                            <Button
                              fullWidth={false}
                              onClick={() => void copyResponse(entry.id, entry.content)}
                              size="sm"
                              type="button"
                              variant="text"
                            >
                              <Copy aria-hidden="true" className="size-4" />
                              {copiedMessageId === entry.id ? "Copied" : "Copy"}
                            </Button>
                            <Button
                              fullWidth={false}
                              onClick={askFollowUp}
                              size="sm"
                              type="button"
                              variant="text"
                            >
                              Ask follow-up
                            </Button>
                            <Button
                              fullWidth={false}
                              onClick={() => void ask(lastQuestion ?? "", true)}
                              size="sm"
                              type="button"
                              variant="text"
                            >
                              <RefreshCw aria-hidden="true" className="size-4" />
                              Regenerate
                            </Button>
                          </div>
                        ) : null}
                        {!isStreaming && isLatestAssistant && entry.suggestedQuestions.length ? (
                          <div className="mt-6 border-t border-border pt-5">
                            <p className="editorial-eyebrow">Continue exploring</p>
                            <div className="mt-3 divide-y divide-border border-y border-border">
                              {entry.suggestedQuestions.map((suggestion) => (
                                <button
                                  className="group flex min-h-16 w-full items-center justify-between gap-5 py-4 text-left leading-6 transition hover:bg-muted/30 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                                  key={suggestion}
                                  onClick={() => void ask(suggestion)}
                                  type="button"
                                >
                                  <span>{suggestion}</span>
                                  <ArrowRight
                                    aria-hidden="true"
                                    className="size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary"
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </>
                    ) : (
                      <div
                        aria-live="polite"
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                        role="status"
                      >
                        <span aria-hidden="true" className="flex gap-1">
                          <span className="size-1.5 animate-pulse rounded-full bg-primary" />
                          <span className="size-1.5 animate-pulse rounded-full bg-primary [animation-delay:120ms]" />
                          <span className="size-1.5 animate-pulse rounded-full bg-primary [animation-delay:240ms]" />
                        </span>
                        Health Decoded is thinking…
                      </div>
                    )
                  ) : (
                    <p className="whitespace-pre-wrap leading-7">{entry.content}</p>
                  )}
                </div>
              </article>
            );
          })
        ) : (
          <div className="space-y-8 py-5 sm:py-9">
            <div className="max-w-xl space-y-3">
              <h2 className="font-serif-display text-3xl font-normal tracking-tight sm:text-4xl">
                How can I help today?
              </h2>
              <p className="text-pretty leading-7 text-muted-foreground">
                You can ask about today&apos;s lesson, medications, Type 2 diabetes concepts,
                healthy habits, or any terms you don&apos;t understand.
              </p>
            </div>

            <section aria-labelledby="suggested-questions-title" className="space-y-5">
              <div className="space-y-2">
                <h3 className="editorial-eyebrow" id="suggested-questions-title">
                  A few places to begin
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  Choose one path, or write a question of your own below.
                </p>
              </div>
              <ol className="divide-y divide-border border-y border-border">
                {suggestedPrompts.map((prompt, index) => (
                  <li key={prompt.question}>
                    <button
                      className="group grid min-h-24 w-full items-center gap-3 py-6 text-left transition hover:bg-muted/30 focus-visible:ring-2 focus-visible:ring-ring sm:grid-cols-[11rem_minmax(0,1fr)_auto] sm:gap-7"
                      onClick={() => void ask(prompt.question)}
                      type="button"
                    >
                      <span className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                        {String(index + 1).padStart(2, "0")} · {prompt.topic}
                      </span>
                      <span className="font-serif-display text-xl font-normal leading-7 text-foreground sm:text-2xl">
                        {prompt.question}
                      </span>
                      <ArrowRight
                        aria-hidden="true"
                        className="hidden size-5 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary sm:block"
                      />
                    </button>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        )}
        <div ref={conversationEndRef} />
      </section>

      <form
        className="safe-area-bottom border-t border-border bg-background pt-5"
        onSubmit={submit}
      >
        <label className="grid gap-2 text-sm font-semibold" htmlFor="ai-question">
          Your question
          <Textarea
            aria-describedby={`ai-safety-notice${error ? " ai-request-error" : ""}`}
            aria-invalid={Boolean(error) || undefined}
            className="max-h-40 min-h-12 resize-none"
            disabled={isStreaming}
            id="ai-question"
            maxLength={AI_MAX_MESSAGE_CHARACTERS}
            onChange={(event) => {
              setMessage(event.target.value);
              resizeInput(event.currentTarget);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void ask(message.trim());
              }
            }}
            placeholder="What would you like explained?"
            ref={inputRef}
            rows={1}
            value={message}
          />
        </label>
        <div className="mt-3 flex justify-end">
          <Button disabled={isStreaming || !message.trim()} fullWidth={false} type="submit">
            <Send aria-hidden="true" className="size-4" />
            Send
          </Button>
        </div>

        {error ? (
          <div
            className="motion-status mt-3 flex flex-wrap items-center gap-3"
            id="ai-request-error"
            role="alert"
          >
            <p className="text-sm text-destructive">{error}</p>
            {lastQuestion ? (
              <Button
                disabled={isStreaming}
                fullWidth={false}
                onClick={() => void ask(lastQuestion, true)}
                size="sm"
                type="button"
                variant="text"
              >
                Retry
              </Button>
            ) : null}
          </div>
        ) : null}
      </form>
    </div>
  );
}
