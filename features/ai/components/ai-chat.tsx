"use client";

import { Copy, RefreshCw, Send } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AiResponseContent } from "@/features/ai/components/ai-response-content";
import { AI_MAX_MESSAGE_CHARACTERS } from "@/features/ai/constants/ai-limits";
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

type ConversationSummary = {
  readonly id: string;
  readonly title: string;
  readonly updatedAt: string;
};

const suggestedPrompts = [
  "What is insulin resistance?",
  "Can you explain today's lesson more simply?",
  "Why does exercise help blood sugar?",
  "What does metformin do?",
] as const;

const streamErrorMessages = {
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
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [message, setMessage] = useState("");
  const [lastQuestion, setLastQuestion] = useState<string | null>(null);
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
    let active = true;
    async function restoreConversation() {
      const response = await fetch("/api/ai/conversations", { cache: "no-store" });
      if (!response.ok || !active) return;
      const data = (await response.json()) as { conversations?: ConversationSummary[] };
      const recent = data.conversations ?? [];
      setConversations(recent);
      const latest = recent[0];
      if (!latest) return;
      const history = await fetch(`/api/ai/conversations/${latest.id}`, { cache: "no-store" });
      if (!history.ok || !active) return;
      const restored = (await history.json()) as {
        messages?: { content: string; id: string; role: MessageRole }[];
      };
      setConversationId(latest.id);
      setMessages(
        (restored.messages ?? []).map((entry) => ({
          content: entry.content,
          id: entry.id,
          lessonContextUsed: false,
          relatedContent: [],
          role: entry.role,
          suggestedQuestions: [],
        })),
      );
    }
    void restoreConversation();
    return () => {
      active = false;
    };
  }, []);

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
      readonly conversationId?: string | undefined;
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
    if (context.conversationId) setConversationId(context.conversationId);
  }

  async function ask(question: string, regenerate = false) {
    if (isStreaming || !question.trim()) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setError(null);
    setLastQuestion(question);

    const assistantMessage = createMessage("assistant");

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
          ...(conversationId ? { conversationId } : {}),
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
          }
        });

        if (streamFailed) {
          await reader.cancel();
          break;
        }
      }
    } catch (caught) {
      if (!(caught instanceof DOMException && caught.name === "AbortError")) {
        setError("The AI assistant is temporarily unavailable. Please try again.");
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

  async function copyResponse(content: string) {
    try {
      await navigator.clipboard.writeText(content);
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
    setConversationId(null);
    setMessages([]);
    setError(null);
    setLastQuestion(null);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function exportConversation() {
    if (!messages.length) return;
    const text = messages
      .filter((entry) => entry.content.trim())
      .map(
        (entry) =>
          `## ${entry.role === "assistant" ? "Health Decoded AI" : "You"}\n\n${entry.content}`,
      )
      .join("\n\n");
    const download = document.createElement("a");
    download.href = URL.createObjectURL(new Blob([text], { type: "text/markdown;charset=utf-8" }));
    download.download = "health-decoded-conversation.md";
    document.body.append(download);
    download.click();
    download.remove();
    URL.revokeObjectURL(download.href);
  }

  return (
    <div className="mt-7 flex min-h-0 flex-1 flex-col sm:mt-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <details className="min-w-0 text-sm">
          <summary className="cursor-pointer font-semibold text-foreground">
            Recent conversations
          </summary>
          <div className="mt-2 max-h-40 w-64 overflow-y-auto rounded-md border border-border bg-card p-2">
            {conversations.length ? (
              conversations.map((conversation) => (
                <button
                  className="w-full rounded-sm px-2 py-2 text-left text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  key={conversation.id}
                  onClick={() => {
                    if (conversation.id === conversationId) return;
                    void fetch(`/api/ai/conversations/${conversation.id}`, { cache: "no-store" })
                      .then(async (response) => (response.ok ? response.json() : null))
                      .then((data: { messages?: ChatMessage[] } | null) => {
                        if (!data) return;
                        setConversationId(conversation.id);
                        setMessages(
                          (data.messages ?? []).map((entry) => ({
                            ...entry,
                            lessonContextUsed: false,
                            relatedContent: [],
                            suggestedQuestions: [],
                          })),
                        );
                      });
                  }}
                  type="button"
                >
                  {conversation.title}
                </button>
              ))
            ) : (
              <p className="px-2 py-2 text-muted-foreground">No saved conversations yet.</p>
            )}
          </div>
        </details>
        <div className="flex items-center gap-2">
          {messages.length ? (
            <Button
              fullWidth={false}
              onClick={exportConversation}
              size="sm"
              type="button"
              variant="text"
            >
              Export
            </Button>
          ) : null}
          <Button
            fullWidth={false}
            onClick={startNewConversation}
            size="sm"
            type="button"
            variant="secondary"
          >
            New conversation
          </Button>
        </div>
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
                    "max-w-[88%] sm:max-w-[82%]",
                    isAssistant
                      ? "rounded-[14px] border border-border bg-card px-5 py-4 sm:px-6 sm:py-5"
                      : "rounded-[12px] bg-muted px-4 py-3 text-foreground",
                  )}
                >
                  {isAssistant ? (
                    entry.content ? (
                      <>
                        <p className="mb-3 text-sm font-semibold text-primary">Health Decoded AI</p>
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
                              onClick={() => void copyResponse(entry.content)}
                              size="sm"
                              type="button"
                              variant="text"
                            >
                              <Copy aria-hidden="true" className="size-4" />
                              Copy
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
                          <div className="mt-4 border-t border-border pt-3">
                            <p className="text-sm font-semibold text-foreground">You might ask</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {entry.suggestedQuestions.map((suggestion) => (
                                <Button
                                  className="h-auto min-h-9 whitespace-normal px-3 py-2 text-left"
                                  fullWidth={false}
                                  key={suggestion}
                                  onClick={() => void ask(suggestion)}
                                  size="sm"
                                  type="button"
                                  variant="secondary"
                                >
                                  {suggestion}
                                </Button>
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
          <div className="space-y-7 py-4 sm:py-8">
            <div className="max-w-xl space-y-3">
              <h2 className="font-serif-display text-[length:var(--text-section-title)] font-semibold tracking-tight">
                How can I help today?
              </h2>
              <p className="text-pretty leading-7 text-muted-foreground">
                You can ask about today&apos;s lesson, medications, Type 2 diabetes concepts, healthy
                habits, or any terms you don&apos;t understand.
              </p>
            </div>

            <div aria-label="Suggested questions" className="grid gap-2.5 sm:grid-cols-2">
              {suggestedPrompts.map((prompt) => (
                <Button
                  className="min-h-14 justify-start whitespace-normal rounded-[12px] px-5 py-3.5 text-left font-medium"
                  fullWidth
                  key={prompt}
                  onClick={() => void ask(prompt)}
                  type="button"
                  variant="secondary"
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        )}
        <div ref={conversationEndRef} />
      </section>

      <form
        className="safe-area-bottom border-t border-border bg-background pt-4"
        onSubmit={submit}
      >
        <label className="grid gap-2 text-sm font-semibold" htmlFor="ai-question">
          Your question
          <Textarea
            aria-describedby={error ? "ai-request-error" : "ai-question-help"}
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
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-muted-foreground" id="ai-question-help">
            This is educational support, not medical advice.
          </p>
          <Button disabled={isStreaming || !message.trim()} fullWidth={false} type="submit">
            <Send aria-hidden="true" className="size-4" />
            Send
          </Button>
        </div>

        {error ? (
          <div
            className="mt-3 flex flex-wrap items-center gap-3"
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
