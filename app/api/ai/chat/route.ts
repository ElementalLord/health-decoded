import { NextResponse } from "next/server";

import { AI_MAX_REQUEST_BYTES } from "@/features/ai/constants/ai-limits";
import { aiChatRequestSchema } from "@/features/ai/schemas/ai-chat.schema";
import { requestAiChat } from "@/features/ai/services/ai-chat.server";
import { getAuthenticatedUser } from "@/features/auth/services/auth.server";

function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json(
    { error: { code, message } },
    { headers: { "Cache-Control": "no-store" }, status },
  );
}

function exceedsRequestSize(request: Request) {
  const contentLength = request.headers.get("content-length");
  if (!contentLength) return false;

  const parsedLength = Number(contentLength);
  return Number.isFinite(parsedLength) && parsedLength > AI_MAX_REQUEST_BYTES;
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user.ok) {
    return errorResponse(401, "UNAUTHORIZED", "You need to sign in to continue.");
  }

  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return errorResponse(403, "FORBIDDEN", "The request could not be accepted.");
  }

  if (exceedsRequestSize(request)) {
    return errorResponse(413, "REQUEST_TOO_LARGE", "Please shorten your request and try again.");
  }

  const body = await request.text();
  if (new TextEncoder().encode(body).byteLength > AI_MAX_REQUEST_BYTES) {
    return errorResponse(413, "REQUEST_TOO_LARGE", "Please shorten your request and try again.");
  }

  let input: unknown;
  try {
    input = JSON.parse(body);
  } catch {
    return errorResponse(400, "INVALID_AI_REQUEST", "Please check your request and try again.");
  }

  const parsed = aiChatRequestSchema.safeParse(input);
  if (!parsed.success) {
    return errorResponse(400, "INVALID_AI_REQUEST", "Please check your request and try again.");
  }

  const response = await requestAiChat({ ...parsed.data, userId: user.data.id });
  if (response.ok) {
    return NextResponse.json(response.data, { headers: { "Cache-Control": "no-store" } });
  }

  if (response.category === "rate_limited") {
    return errorResponse(429, "AI_RATE_LIMITED", "Please wait before trying again.");
  }
  if (response.category === "timeout") {
    return errorResponse(504, "AI_TIMEOUT", "The AI assistant took too long to respond.");
  }
  if (response.category === "context") {
    return errorResponse(
      400,
      "INVALID_AI_CONTEXT",
      "The requested educational context is unavailable.",
    );
  }

  return errorResponse(503, "AI_UNAVAILABLE", "The AI assistant is temporarily unavailable.");
}
