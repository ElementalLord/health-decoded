"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AI_MAX_MESSAGE_CHARACTERS } from "@/features/ai/constants/ai-limits";
import { aiChatResponseSchema } from "@/features/ai/schemas/ai-chat.schema";

type Exchange = {
  readonly question: string;
  readonly answer: string;
};

export function AiChat({ lessonId }: { lessonId?: string }) {
  const [message, setMessage] = useState("");
  const [exchange, setExchange] = useState<Exchange | null>(null);
  const [lastQuestion, setLastQuestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function ask(question: string) {
    setPending(true);
    setError(null);
    setLastQuestion(question);

    try {
      const response = await fetch("/api/ai/chat", {
        body: JSON.stringify({ message: question, ...(lessonId ? { lessonId } : {}) }),
        headers: { "content-type": "application/json" },
        method: "POST",
      });
      const payload: unknown = await response.json().catch(() => null);
      const parsed = aiChatResponseSchema.safeParse(payload);

      if (!response.ok || !parsed.success) {
        setError("The AI assistant is temporarily unavailable. Please try again.");
        return;
      }

      setExchange({ question, answer: parsed.data.assistantMessage });
      setMessage("");
    } catch {
      setError("The AI assistant is temporarily unavailable. Please try again.");
    } finally {
      setPending(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = message.trim();
    if (!question || pending) return;
    void ask(question);
  }

  return (
    <div className="space-y-7">
      <section aria-label="Conversation" className="min-h-48 border-y border-border py-6">
        {exchange ? (
          <div className="space-y-6">
            <section aria-labelledby="your-question" className="space-y-2">
              <h2 className="text-sm font-medium text-muted-foreground" id="your-question">
                Your question
              </h2>
              <p className="whitespace-pre-wrap leading-7">{exchange.question}</p>
            </section>
            <section aria-labelledby="ai-answer" className="space-y-2">
              <h2 className="text-sm font-medium text-primary" id="ai-answer">
                Health Decoded AI
              </h2>
              <p className="whitespace-pre-wrap leading-7">{exchange.answer}</p>
            </section>
          </div>
        ) : (
          <div className="max-w-xl space-y-2 py-4">
            <h2 className="text-[length:var(--text-section-title)] font-medium">
              Ask a diabetes education question
            </h2>
            <p className="leading-7 text-muted-foreground">
              Ask for a simple explanation or help understanding today&apos;s lesson. Health Decoded
              AI cannot diagnose or recommend treatment changes.
            </p>
          </div>
        )}
      </section>

      <form className="max-w-3xl space-y-4" onSubmit={submit}>
        <label className="grid gap-2 text-sm font-medium" htmlFor="ai-question">
          Your question
          <Textarea
            aria-describedby={error ? "ai-request-error" : "ai-question-help"}
            aria-invalid={Boolean(error) || undefined}
            disabled={pending}
            id="ai-question"
            maxLength={AI_MAX_MESSAGE_CHARACTERS}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="What would you like explained?"
            value={message}
          />
        </label>
        <p className="text-sm text-muted-foreground" id="ai-question-help">
          Do not include private medical records or emergency information.
        </p>

        {pending ? (
          <p aria-live="polite" className="text-sm text-muted-foreground" role="status">
            Preparing an explanation…
          </p>
        ) : null}
        {error ? (
          <div className="space-y-2" id="ai-request-error" role="alert">
            <p className="text-sm text-destructive">{error}</p>
            {lastQuestion ? (
              <Button
                fullWidth={false}
                onClick={() => void ask(lastQuestion)}
                type="button"
                variant="text"
              >
                Try again
              </Button>
            ) : null}
          </div>
        ) : null}

        <Button disabled={pending || !message.trim()} fullWidth={false} type="submit">
          {pending ? "Sending…" : "Ask Health Decoded AI"}
        </Button>
      </form>
    </div>
  );
}
