"use client";

import { Copy, RefreshCw, Send } from "lucide-react";
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
  "What is insulin resistance?",
  "Explain today’s lesson more simply.",
  "What does metformin do?",
] as const;

const flatPrimaryButton = "shadow-none hover:translate-y-0 hover:shadow-none";
const flatSecondaryButton = "bg-background shadow-none hover:translate-y-0 hover:shadow-none";
const calmTextButton = "decoration-border hover:decoration-foreground";

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
  const [newConversationOpen, setNewConversationOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const activeAssistantIdRef = useRef<string | null>(null);
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
    setNotice(null);
    setLastQuestion(question);

    const assistantMessage = createMessage("assistant");
    activeAssistantIdRef.current = assistantMessage.id;
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
      if (abortControllerRef.current === controller) {
        setIsStreaming(false);
        abortControllerRef.current = null;
        activeAssistantIdRef.current = null;
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
    setNotice(null);
    setLastQuestion(null);
    setCopiedMessageId(null);
    setNewConversationOpen(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function stopResponse() {
    const assistantId = activeAssistantIdRef.current;
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    activeAssistantIdRef.current = null;
    setIsStreaming(false);
    setMessages((current) =>
      current.filter((entry) => entry.id !== assistantId || Boolean(entry.content.trim())),
    );
    setNotice("Stopped. You can rephrase the question or continue whenever you’re ready.");
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <div className="mt-6 flex min-h-0 flex-1 flex-col sm:mt-7">
      <aside
        aria-label="Educational safety notice"
        className="order-4 mt-6 border-t border-border pt-4 text-sm leading-6"
        id="ai-safety-notice"
        role="note"
      >
        <p>
          General diabetes education only — not diagnosis, personal result interpretation, or
          treatment changes.
        </p>
        <details className="mt-2 text-muted-foreground">
          <summary className="w-fit cursor-pointer font-medium text-foreground underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            Safety details
          </summary>
          <p className="mt-2 max-w-2xl">
            This tutor can explain learning topics, but cannot diagnose, interpret personal results,
            or recommend treatment or medication changes. Urgent symptoms need local emergency care.
          </p>
        </details>
      </aside>
      <div className="order-1 mb-3 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">This conversation clears when you leave.</p>
        {messages.length ? (
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
          aria-labelledby="new-conversation-confirmation"
          className="motion-status mb-5 flex flex-col gap-3 rounded-[14px] border border-[#d9d2c8] bg-[#f5f0e9] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          role="group"
        >
          <p className="text-sm leading-6 text-muted-foreground" id="new-conversation-confirmation">
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
          "min-h-0 flex-1 space-y-7 overflow-y-auto py-6 sm:space-y-9",
          messages.length ? "order-2" : "order-3",
        )}
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
                    isAssistant ? "w-full max-w-[44rem]" : "max-w-[92%] sm:max-w-[78%]",
                    isAssistant
                      ? "border-y border-border/70 py-5"
                      : "rounded-[18px] rounded-tr-[6px] border border-[#ddd4c9] bg-[#f2ede6] px-4 py-3 text-foreground",
                  )}
                >
                  {isAssistant ? (
                    entry.content ? (
                      <>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-success">
                          Health Decoded guide
                        </p>
                        {entry.lessonContextUsed ? (
                          <p className="mb-4 rounded-md bg-info/60 px-3 py-2 text-xs leading-5 text-muted-foreground">
                            Connected to today&apos;s lesson so this explanation fits what you are
                            learning now.
                          </p>
                        ) : null}
                        <AiResponseContent content={entry.content} />
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
                        Taking a moment to make this clear…
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
          <div className="space-y-4 pt-2">
            <section
              aria-labelledby="suggested-questions-title"
              className="grid gap-4 sm:grid-cols-[11rem_minmax(0,1fr)] sm:items-start"
            >
              <h2 className="pt-3 font-serif-display text-xl" id="suggested-questions-title">
                Try asking:
              </h2>
              <ol className="divide-y divide-border border-y border-border">
                {suggestedPrompts.map((prompt, index) => (
                  <li key={prompt}>
                    <button
                      className="grid min-h-14 w-full grid-cols-[2rem_minmax(0,1fr)] items-center gap-3 px-1 py-3 text-left text-sm font-semibold leading-5 transition hover:bg-muted/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      onClick={() => void ask(prompt)}
                      type="button"
                    >
                      <span className="font-serif-display text-lg font-normal text-accent-warm">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{prompt}</span>
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
          "safe-area-bottom rounded-xl border border-border bg-card p-3 shadow-[0_10px_28px_rgb(61_47_41/0.045)] focus-within:border-foreground/25 focus-within:ring-2 focus-within:ring-ring/15 sm:p-4",
          messages.length ? "order-3" : "order-2",
        )}
        onSubmit={submit}
      >
        <label className="grid gap-2 text-sm font-semibold" htmlFor="ai-question">
          Your question
          <Textarea
            aria-describedby={`ai-safety-notice${error ? " ai-request-error" : ""}`}
            aria-invalid={Boolean(error) || undefined}
            className="max-h-40 min-h-28 resize-none rounded-lg border-0 bg-muted/25 px-4 py-3 shadow-none hover:border-transparent focus:border-transparent focus-visible:ring-0"
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
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs leading-5 text-muted-foreground">
            Enter sends · Shift + Enter adds a line
          </p>
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
            id="ai-request-error"
            role="alert"
          >
            <p className="text-sm text-[#8b6258]">{error}</p>
            {lastQuestion ? (
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
