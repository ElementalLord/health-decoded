import { NextResponse } from "next/server";

import { aiChatRequestSchema } from "@/features/ai/schemas/ai-chat.schema";
import { createAiChatStream } from "@/features/ai/services/ai-chat.server";
import {
  getAiNetworkBucketKey,
  hasJsonContentType,
  hasTrustedAiRequestOrigin,
  readBoundedAiRequestBody,
} from "@/features/ai/services/ai-request-security.server";
import type { AiChatFailureCategory, AiChatStreamEvent } from "@/features/ai/types/ai";
import { getAuthenticatedUser } from "@/features/auth/services/auth.server";

const encoder = new TextEncoder();
const securityHeaders = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
} as const;

function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { headers: securityHeaders, status });
}

function streamEvent(event: AiChatStreamEvent) {
  return encoder.encode(`data: ${JSON.stringify(event)}\n\n`);
}

function serviceErrorResponse(category: AiChatFailureCategory) {
  if (category === "rate_limited") {
    return errorResponse(429, "AI_RATE_LIMITED", "Please wait before trying again.");
  }
  if (category === "timeout") {
    return errorResponse(504, "AI_TIMEOUT", "The AI assistant took too long to respond.");
  }
  if (category === "context") {
    return errorResponse(
      400,
      "INVALID_AI_CONTEXT",
      "The requested educational context is unavailable.",
    );
  }

  return errorResponse(503, "AI_UNAVAILABLE", "The AI assistant is temporarily unavailable.");
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user.ok) {
    return errorResponse(401, "UNAUTHORIZED", "You need to sign in to continue.");
  }

  if (!hasTrustedAiRequestOrigin(request)) {
    return errorResponse(403, "FORBIDDEN", "The request could not be accepted.");
  }

  if (!hasJsonContentType(request)) {
    return errorResponse(415, "UNSUPPORTED_MEDIA_TYPE", "The request could not be accepted.");
  }

  const boundedBody = await readBoundedAiRequestBody(request);
  if (!boundedBody.ok && boundedBody.reason === "too_large") {
    return errorResponse(413, "REQUEST_TOO_LARGE", "Please shorten your request and try again.");
  }
  if (!boundedBody.ok) {
    return errorResponse(400, "INVALID_AI_REQUEST", "Please check your request and try again.");
  }

  let input: unknown;
  try {
    input = JSON.parse(boundedBody.body);
  } catch {
    return errorResponse(400, "INVALID_AI_REQUEST", "Please check your request and try again.");
  }

  const parsed = aiChatRequestSchema.safeParse(input);
  if (!parsed.success) {
    return errorResponse(400, "INVALID_AI_REQUEST", "Please check your request and try again.");
  }

  const result = await createAiChatStream(
    {
      ...parsed.data,
      networkKey: getAiNetworkBucketKey(request),
      userId: user.data.id,
    },
    request.signal,
  );
  if (!result.ok) return serviceErrorResponse(result.category);

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of result.data) {
          if (request.signal.aborted) break;
          controller.enqueue(streamEvent(event));
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Cache-Control": "no-store",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream; charset=utf-8",
      "X-Accel-Buffering": "no",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
