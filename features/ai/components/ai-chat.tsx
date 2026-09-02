"use client";

import { Copy, RefreshCw, Send } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AiResponseContent } from "@/features/ai/components/ai-response-content";
import {
  AI_SUGGESTED_QUESTION_BANK,
  selectSuggestedQuestions,
} from "@/features/ai/data/suggested-questions";
import {
  AI_MAX_CONVERSATION_MESSAGES,
  AI_MAX_MESSAGE_CHARACTERS,
  AI_MAX_SESSION_HISTORY_BYTES,
} from "@/features/ai/constants/ai-limits";
import { aiChatStreamEventSchema } from "@/features/ai/schemas/ai-chat.schema";
import type { AiCredibleSource } from "@/features/ai/types/ai";
import { cn } from "@/lib/utils";

type MessageRole = "assistant" | "user";

type ChatMessage = {
  readonly content: string;
  readonly credibleSources: readonly AiCredibleSource[];
  readonly id: string;
  readonly role: MessageRole;
  readonly suggestedQuestions: readonly string[];
};

type RequestFailure = {
  readonly kind: "auth" | "copy" | "request" | "timeout";
  readonly message: string;
};

const flatPrimaryButton = "shadow-none hover:translate-y-0 hover:shadow-none";
const flatSecondaryButton = "bg-background shadow-none hover:translate-y-0 hover:shadow-none";
const calmTextButton = "decoration-border hover:decoration-foreground";

const streamErrorMessages = {
  AI_CONFIGURATION_ERROR:
    "The educational assistant is not configured right now. Please try again later.",
  AI_RATE_LIMITED: "Health Decoded AI is receiving too many requests right now. Try again shortly.",
  AI_TIMEOUT: "I couldn’t finish that answer. Your question is still here, so you can try again.",
  AI_UNAVAILABLE:
    "I couldn’t finish that answer. Your question is still here, so you can try again.",
} as const;

function errorMessageForResponse(status: number) {
  if (status === 401)
    return {
      kind: "auth",
      message: "Your session ended. Sign in again to continue. Your question is still here.",
    } as const;
  if (status === 429)
    return {
      kind: "request",
      message: "Health Decoded AI is receiving too many requests right now. Try again shortly.",
    } as const;
  if (status === 504)
    return {
      kind: "timeout",
      message: "I couldn’t finish that answer. Your question is still here, so you can try again.",
    } as const;
  return {
    kind: "request",
    message: "I couldn’t finish that answer. Your question is still here, so you can try again.",
  } as const;
}

function createMessage(role: MessageRole, content = ""): ChatMessage {
  return {
    content,
    credibleSources: [],
    id: crypto.randomUUID(),
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

function lastAssistantMessage(messages: readonly ChatMessage[]) {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const entry = messages[index];
    if (entry?.role === "assistant" && entry.content.trim()) return entry;
  }
  return null;
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

export function AiChat({
  suggestionShuffleKey = 0,
  variant = "page",
}: {
  suggestionShuffleKey?: number;
  variant?: "drawer" | "page";
}) {
  const isDrawer = variant === "drawer";
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const componentId = useId();
  const inputId = `${componentId}-question`;
  const safetyNoticeId = `${componentId}-safety-notice`;
  const requestErrorId = `${componentId}-request-error`;
  const newConversationConfirmationId = `${componentId}-new-conversation-confirmation`;
  const suggestedQuestionsTitleId = `${componentId}-suggested-questions-title`;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestedPrompts, setSuggestedPrompts] = useState<readonly string[]>(
    AI_SUGGESTED_QUESTION_BANK.slice(0, 3),
  );
  const [message, setMessage] = useState("");
  const [lastQuestion, setLastQuestion] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [error, setError] = useState<RequestFailure | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isTakingLonger, setIsTakingLonger] = useState(false);
  const [newConversationOpen, setNewConversationOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [signInHref, setSignInHref] = useState("/login");
  const abortControllerRef = useRef<AbortController | null>(null);
  const requestInFlightRef = useRef(false);
  const activeAssistantIdRef = useRef<string | null>(null);
  const replacedAnswerRef = useRef<ChatMessage | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const conversationRef = useRef<HTMLElement>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const scrollFrameRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      abortControllerRef.current?.abort();
      requestInFlightRef.current = false;
      if (scrollFrameRef.current !== null) cancelAnimationFrame(scrollFrameRef.current);
    },
    [],
  );

  useEffect(() => {
    setSuggestedPrompts(selectSuggestedQuestions());
  }, [suggestionShuffleKey]);

  useEffect(() => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.set("ask", "1");
    const returnPath = `${pathname}?${nextSearchParams.toString()}${window.location.hash}`;
    setSignInHref(`/login?next=${encodeURIComponent(returnPath)}`);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!messages.length) return;

    if (scrollFrameRef.current !== null) cancelAnimationFrame(scrollFrameRef.current);
    scrollFrameRef.current = requestAnimationFrame(() => {
      const reducedMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        Boolean(document.querySelector("[data-reduced-motion='true']"));
      const behavior = reducedMotion || isStreaming ? "auto" : "smooth";
      if (isDrawer && conversationRef.current) {
        conversationRef.current.scrollTo({
          behavior,
          top: conversationRef.current.scrollHeight,
        });
      } else {
        conversationEndRef.current?.scrollIntoView({ behavior, block: "end" });
      }
    });
  }, [isDrawer, isStreaming, messages]);

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
      readonly credibleSources: readonly AiCredibleSource[];
      readonly suggestedQuestions: readonly string[];
    },
  ) {
    setMessages((current) =>
      current.map((entry) =>
        entry.id === assistantId
          ? {
              ...entry,
              credibleSources: context.credibleSources,
              suggestedQuestions: context.suggestedQuestions,
            }
          : entry,
      ),
    );
  }

  /**
   * Drops the in-flight assistant message. A regeneration that never produced an
   * answer must leave the conversation as it was, so the answer it replaced comes
   * back whenever the pending message is removed with nothing in it.
   */
  function dropPendingAssistant(
    assistantId: string | null,
    replacedAnswer: ChatMessage | null,
    force = false,
  ) {
    setMessages((current) => {
      const remaining = current.filter(
        (entry) => entry.id !== assistantId || (!force && Boolean(entry.content.trim())),
      );
      const removedPending = remaining.length !== current.length;
      return removedPending && replacedAnswer ? [...remaining, replacedAnswer] : remaining;
    });
  }

  async function ask(question: string, regenerate = false) {
    if (isStreaming || requestInFlightRef.current || !question.trim()) return;

    const controller = new AbortController();
    requestInFlightRef.current = true;
    abortControllerRef.current = controller;
    setError(null);
    setIsTakingLonger(false);
    setNotice(null);
    setLastQuestion(question);

    const assistantMessage = createMessage("assistant");
    activeAssistantIdRef.current = assistantMessage.id;
    const priorMessages = regenerate ? historyBeforeRegeneration(messages, question) : messages;
    const sessionHistory = boundedSessionHistory(priorMessages);
    const replacedAnswer = regenerate ? lastAssistantMessage(messages) : null;
    replacedAnswerRef.current = replacedAnswer;
    const removeEmptyAssistant = (force = false) =>
      dropPendingAssistant(assistantMessage.id, replacedAnswer, force);

    if (regenerate) {
      setMessages((current) => [
        ...current.filter((entry) => entry.id !== replacedAnswer?.id),
        assistantMessage,
      ]);
    } else {
      setMessages((current) => [...current, createMessage("user", question), assistantMessage]);
    }
    setMessage("");
    setIsStreaming(true);
    let timedOut = false;
    const slowTimer = window.setTimeout(() => setIsTakingLonger(true), 5_000);
    const timeoutTimer = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 30_000);

    try {
      const response = await fetch("/api/ai/chat", {
        body: JSON.stringify({
          message: question,
          ...(sessionHistory.length ? { messages: sessionHistory } : {}),
          ...(regenerate ? { regenerate: true } : {}),
        }),
        headers: { accept: "text/event-stream", "content-type": "application/json" },
        method: "POST",
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        setError(errorMessageForResponse(response.status));
        removeEmptyAssistant(true);
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
            setError({ kind: "request", message: streamErrorMessages.AI_UNAVAILABLE });
            return;
          }

          if (event.data.type === "delta") {
            appendAssistantText(assistantMessage.id, event.data.text);
          } else if (event.data.type === "context") {
            setAssistantContext(assistantMessage.id, event.data);
          } else if (event.data.type === "error") {
            streamFailed = true;
            setError({
              kind: event.data.code === "AI_TIMEOUT" ? "timeout" : "request",
              message: streamErrorMessages[event.data.code],
            });
          } else if (event.data.type === "done") {
            receivedDone = true;
          }
        });

        if (streamFailed) {
          await reader.cancel();
          break;
        }
      }

      if (timedOut) {
        setError({
          kind: "timeout",
          message:
            "I couldn’t finish that answer. Your question is still here, so you can try again.",
        });
        removeEmptyAssistant();
      } else if (!controller.signal.aborted && (streamFailed || !receivedDone)) {
        if (!streamFailed) {
          setError({
            kind: "request",
            message:
              "I couldn’t finish that answer. Your question is still here, so you can try again.",
          });
        }
        removeEmptyAssistant();
      }
    } catch (caught) {
      if (timedOut) {
        setError({
          kind: "timeout",
          message:
            "I couldn’t finish that answer. Your question is still here, so you can try again.",
        });
        removeEmptyAssistant();
      } else if (!(caught instanceof DOMException && caught.name === "AbortError")) {
        setError({
          kind: "request",
          message:
            "I couldn’t finish that answer. Your question is still here, so you can try again.",
        });
        removeEmptyAssistant();
      }
    } finally {
      window.clearTimeout(slowTimer);
      window.clearTimeout(timeoutTimer);
      setIsTakingLonger(false);
      if (abortControllerRef.current === controller) {
        requestInFlightRef.current = false;
        setIsStreaming(false);
        abortControllerRef.current = null;
        activeAssistantIdRef.current = null;
        replacedAnswerRef.current = null;
      }
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
      setError({
        kind: "copy",
        message:
          "Couldn’t copy automatically. The response is still here and can be selected manually.",
      });
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
    setNotice(null);
    setLastQuestion(null);
    setCopiedMessageId(null);
    setSuggestedPrompts(selectSuggestedQuestions());
    setNewConversationOpen(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function stopResponse() {
    const assistantId = activeAssistantIdRef.current;
    const replacedAnswer = replacedAnswerRef.current;
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    requestInFlightRef.current = false;
    activeAssistantIdRef.current = null;
    replacedAnswerRef.current = null;
    setIsStreaming(false);
    dropPendingAssistant(assistantId, replacedAnswer);
    setNotice("Stopped. You can rephrase the question or continue whenever you’re ready.");
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <div
      className={cn("flex min-h-0 flex-1 flex-col", isDrawer ? "overflow-hidden" : "mt-6 sm:mt-7")}
    >
      <aside
        aria-label="Educational safety notice"
        className={cn(
          "border-t border-border text-sm leading-6",
          isDrawer
            ? "order-3 shrink-0 py-4 text-[length:var(--text-caption)] leading-6"
            : "order-4 mt-6 pt-4",
        )}
        id={safetyNoticeId}
        role="note"
      >
        <p className={cn(isDrawer && "sr-only")}>
          General diabetes education only, not diagnosis, personal result interpretation, or
          treatment changes.
        </p>
        <details className={cn("text-muted-foreground", !isDrawer && "mt-2")}>
          <summary className="w-fit cursor-pointer font-medium text-foreground underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            {isDrawer ? "Educational guidance only · Safety & limits" : "Safety details"}
          </summary>
          <p className="mt-2 max-w-2xl">
            This tutor can explain learning topics, but cannot diagnose, interpret personal results,
            or recommend treatment or medication changes. Urgent symptoms need local emergency care.
          </p>
        </details>
      </aside>
      <div
        className={cn(
          "order-1 flex gap-4",
          isDrawer
            ? "ml-auto w-fit max-w-full shrink-0 flex-col items-end py-5 text-right"
            : "mb-3 flex-wrap items-center justify-between",
        )}
      >
        <p className="text-sm leading-6 text-muted-foreground">
          {isDrawer ? (
            <span className="font-medium text-foreground">Private to this session. Not saved.</span>
          ) : (
            <>
              <span className="font-medium text-foreground">Private to this visit.</span> Clears
              when you leave.
            </>
          )}
        </p>
        {messages.length && !isDrawer ? (
          <Button
            className={flatSecondaryButton}
            disabled={isStreaming}
            fullWidth={false}
            onClick={() => setNewConversationOpen(true)}
            size="sm"
            type="button"
            variant="secondary"
          >
            New conversation
          </Button>
        ) : null}
      </div>
      {newConversationOpen ? (
        <div
          aria-labelledby={newConversationConfirmationId}
          className={cn(
            "motion-status order-1 mb-5 flex flex-col gap-3 rounded-[14px] border border-border bg-muted px-4 py-3",
            !isDrawer && "sm:flex-row sm:items-center sm:justify-between",
          )}
          role="group"
        >
          <p className="text-sm leading-6 text-muted-foreground" id={newConversationConfirmationId}>
            Start fresh? The messages in this private session will be cleared from the page.
          </p>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button
              className={calmTextButton}
              fullWidth={false}
              onClick={() => setNewConversationOpen(false)}
              size="sm"
              type="button"
              variant="text"
            >
              Keep these messages
            </Button>
            <Button
              className={flatPrimaryButton}
              fullWidth={false}
              onClick={startNewConversation}
              size="sm"
              type="button"
            >
              Start fresh
            </Button>
          </div>
        </div>
      ) : null}
      <section
        aria-label="AI tutor conversation"
        aria-busy={isStreaming}
        className={cn(
          "order-2 min-h-0 flex-1 overflow-y-auto",
          isDrawer ? "space-y-8 py-6 pr-1" : "space-y-7 py-6 sm:space-y-9",
        )}
        ref={conversationRef}
      >
        {messages.length ? (
          messages.map((entry, index) => {
            const isAssistant = entry.role === "assistant";
            const isLatestAssistant = isAssistant && index === messages.length - 1;

            return (
              <article
                className={cn("flex", isAssistant ? "justify-start" : "justify-end")}
                data-motion-item
                key={entry.id}
              >
                <div
                  className={cn(
                    isAssistant
                      ? "w-full max-w-[44rem]"
                      : isDrawer
                        ? "max-w-[92%]"
                        : "max-w-[92%] sm:max-w-[78%]",
                    isAssistant
                      ? cn("border-y border-border/70", isDrawer ? "py-4" : "py-5")
                      : "rounded-[18px] rounded-tr-[6px] border border-[#ddd4c9] bg-[#f2ede6] px-4 py-3 text-foreground",
                  )}
                >
                  {isAssistant ? (
                    entry.content ? (
                      <>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-success">
                          Health Decoded guide
                        </p>
                        <AiResponseContent content={entry.content} />
                        {entry.credibleSources.length ? (
                          <aside className="mt-5 border-t border-border pt-3">
                            <p className="editorial-eyebrow mb-2">Sources</p>
                            <ul className="space-y-1.5">
                              {entry.credibleSources.map((source) => (
                                <li className="text-sm leading-5" key={source.href}>
                                  <a
                                    className="font-semibold text-primary underline decoration-accent-warm/40 decoration-2 underline-offset-4 hover:decoration-accent-warm"
                                    href={source.href}
                                    rel="noreferrer"
                                    target="_blank"
                                  >
                                    {source.title}
                                  </a>{" "}
                                  <span className="text-muted-foreground">
                                    · {source.organization}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </aside>
                        ) : null}
                        {!isStreaming && isLatestAssistant ? (
                          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-3">
                            <Button
                              className={calmTextButton}
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
                              className={calmTextButton}
                              fullWidth={false}
                              onClick={askFollowUp}
                              size="sm"
                              type="button"
                              variant="text"
                            >
                              Ask follow-up
                            </Button>
                            <Button
                              className={calmTextButton}
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
                      </>
                    ) : (
                      <div
                        aria-live="polite"
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                        role="status"
                      >
                        <span aria-hidden="true" className="flex gap-1">
                          <span className="size-1.5 animate-pulse rounded-full bg-[#789987]" />
                          <span className="size-1.5 animate-pulse rounded-full bg-[#789987] [animation-delay:120ms]" />
                          <span className="size-1.5 animate-pulse rounded-full bg-[#789987] [animation-delay:240ms]" />
                        </span>
                        {isTakingLonger
                          ? "Still working on this…"
                          : "Taking a moment to make this clear…"}
                      </div>
                    )
                  ) : (
                    <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere] leading-7">
                      {entry.content}
                    </p>
                  )}
                </div>
              </article>
            );
          })
        ) : (
          <div className="pt-1">
            <section
              aria-labelledby={suggestedQuestionsTitleId}
              className={cn("border-y border-border", isDrawer ? "py-6" : "py-6 sm:py-7")}
            >
              <div
                className={cn(
                  "flex max-w-xl items-center justify-between gap-4",
                  !isDrawer && "flex-wrap",
                )}
              >
                <div className={cn(!isDrawer && "space-y-2")}>
                  <h2 className="editorial-eyebrow" id={suggestedQuestionsTitleId}>
                    {isDrawer ? "Try asking" : "A place to begin"}
                  </h2>
                  {!isDrawer ? (
                    <p className="font-serif-display text-xl leading-7 text-foreground sm:text-2xl">
                      Choose a question that feels useful now.
                    </p>
                  ) : null}
                </div>
                <Button
                  aria-label="Shuffle suggested questions"
                  className={cn(calmTextButton, "shrink-0")}
                  fullWidth={false}
                  onClick={() => setSuggestedPrompts(selectSuggestedQuestions())}
                  size="sm"
                  type="button"
                  variant="text"
                >
                  <RefreshCw aria-hidden="true" className="size-4" />
                  Shuffle
                </Button>
              </div>
              <ol
                aria-live="polite"
                className={cn(
                  "grid border-t border-border",
                  isDrawer ? "mt-6" : "mt-5",
                  !isDrawer &&
                    "sm:grid-cols-3 sm:divide-x sm:divide-border sm:[&>li:first-child>button]:pl-0 sm:[&>li:last-child>button]:pr-0",
                )}
              >
                {suggestedPrompts.map((prompt) => (
                  <li
                    className={cn(
                      "border-b border-border last:border-b-0",
                      !isDrawer && "sm:border-b-0",
                    )}
                    key={prompt}
                  >
                    <button
                      className={cn(
                        "group flex h-full w-full items-center justify-between gap-4 py-4 text-left font-serif-display font-medium text-foreground transition-[color,transform] duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:text-primary active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isDrawer
                          ? "min-h-16 py-5 text-base leading-7"
                          : "min-h-20 text-lg leading-6 sm:px-5",
                      )}
                      onClick={() => void ask(prompt)}
                      type="button"
                    >
                      <span>{prompt}</span>
                      <span
                        aria-hidden="true"
                        className="shrink-0 font-sans text-base text-accent-warm transition-transform duration-[var(--duration-fast)] ease-[var(--ease-standard)] group-hover:translate-x-0.5"
                      >
                        →
                      </span>
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
        className={cn(
          "safe-area-bottom rounded-xl border border-border bg-background shadow-[0_10px_28px_rgb(61_47_41/0.045)] focus-within:border-foreground/25 focus-within:ring-2 focus-within:ring-ring/15",
          isDrawer ? "order-4 shrink-0 p-5" : "order-3 p-3 sm:p-4",
        )}
        onSubmit={submit}
      >
        <label className="grid gap-2 text-sm font-semibold" htmlFor={inputId}>
          {messages.length ? "Ask a follow-up" : "Ask a question"}
          <Textarea
            aria-describedby={`${safetyNoticeId}${error ? ` ${requestErrorId}` : ""}`}
            aria-invalid={Boolean(error) || undefined}
            className={cn(
              "max-h-40 resize-none rounded-lg border-0 bg-muted/45 px-4 py-3 shadow-none hover:border-transparent focus:border-transparent focus-visible:ring-0",
              isDrawer ? "min-h-16" : "min-h-24",
            )}
            disabled={isStreaming}
            id={inputId}
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
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <p className="text-xs leading-5 text-muted-foreground">
            {message.length}/{AI_MAX_MESSAGE_CHARACTERS} · Enter sends · Shift + Enter adds a line
          </p>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {isDrawer && messages.length ? (
              <Button
                className={cn(flatSecondaryButton, "shrink-0 whitespace-nowrap px-3")}
                disabled={isStreaming}
                fullWidth={false}
                onClick={() => setNewConversationOpen(true)}
                size="sm"
                type="button"
                variant="secondary"
              >
                New conversation
              </Button>
            ) : null}
            {isStreaming ? (
              <Button
                className={flatSecondaryButton}
                fullWidth={false}
                onClick={stopResponse}
                type="button"
                variant="secondary"
              >
                Stop response
              </Button>
            ) : (
              <Button
                className={flatPrimaryButton}
                disabled={!message.trim()}
                fullWidth={false}
                type="submit"
              >
                <Send aria-hidden="true" className="size-4" />
                Send
              </Button>
            )}
          </div>
        </div>

        {notice ? (
          <p
            aria-live="polite"
            className="motion-status mt-3 text-sm text-muted-foreground"
            role="status"
          >
            {notice}
          </p>
        ) : null}

        {error ? (
          <div
            className="motion-status mt-3 flex flex-wrap items-center gap-3"
            id={requestErrorId}
            role="alert"
          >
            <p className="text-sm text-[#8b6258]">{error.message}</p>
            {error.kind === "auth" ? (
              <Link
                className="text-sm font-semibold underline underline-offset-4"
                href={signInHref}
              >
                Sign in
              </Link>
            ) : null}
            {lastQuestion && error.kind !== "auth" && error.kind !== "copy" ? (
              <Button
                className={calmTextButton}
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
