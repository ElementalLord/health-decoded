import { NextResponse } from "next/server";

import { explainItBackRequestSchema } from "@/features/explain-it-back/schemas/explain-it-back.schema";
import { evaluateExplanation } from "@/features/explain-it-back/services/explain-it-back.server";
import {
  getAiNetworkBucketKey,
  hasJsonContentType,
  hasTrustedAiRequestOrigin,
  readBoundedAiRequestBody,
} from "@/features/ai/services/ai-request-security.server";
import { getAuthenticatedUser } from "@/features/auth/services/auth.server";
import {
  recordExplainItBackLearning,
  recordSpacedReviewResult,
} from "@/features/spaced-review/services/spaced-review.server";

const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } as const;
const error = (status: number, code: string, message: string) =>
  NextResponse.json({ error: { code, message } }, { headers, status });

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user.ok)
    return user.error.code === "authorization"
      ? error(401, "UNAUTHORIZED", "You need to sign in to continue.")
      : error(503, "AUTH_UNAVAILABLE", "Your session could not be checked right now.");
  if (!hasTrustedAiRequestOrigin(request))
    return error(403, "FORBIDDEN", "The request could not be accepted.");
  if (!hasJsonContentType(request))
    return error(415, "UNSUPPORTED_MEDIA_TYPE", "The request could not be accepted.");

  const body = await readBoundedAiRequestBody(request, 4_000);
  if (!body.ok)
    return error(
      body.reason === "too_large" ? 413 : 400,
      "INVALID_REQUEST",
      "Please check your explanation and try again.",
    );

  let value: unknown;
  try {
    value = JSON.parse(body.body);
  } catch {
    return error(400, "INVALID_REQUEST", "Please check your explanation and try again.");
  }
  const parsed = explainItBackRequestSchema.safeParse(value);
  if (!parsed.success)
    return error(400, "INVALID_REQUEST", "Please check your explanation and try again.");

  const result = await evaluateExplanation({
    challengeId: parsed.data.challengeId,
    explanation: parsed.data.explanation,
    networkKey: getAiNetworkBucketKey(request),
    userId: user.data.id,
    signal: request.signal,
  });
  if (!result.ok) {
    if (result.category === "rate_limited")
      return error(429, "RATE_LIMITED", "Please wait a moment before checking again.");
    if (result.category === "invalid")
      return error(400, "INVALID_REQUEST", "Please check your explanation and try again.");
    return error(
      result.category === "timeout" ? 504 : 503,
      "EVALUATOR_UNAVAILABLE",
      "I couldn't check that explanation right now. Your answer is still here, so you can try again.",
    );
  }
  let reviewRecorded: boolean | undefined;
  if (result.status === "evaluated") {
    if (parsed.data.mode === "spaced-review" && parsed.data.resultToken) {
      reviewRecorded = await recordSpacedReviewResult({
        challengeId: parsed.data.challengeId,
        verdict: result.feedback.verdict,
        hadRetry: parsed.data.hadRetry,
        exampleViewed: parsed.data.exampleViewed,
        resultToken: parsed.data.resultToken,
      });
    } else if (result.feedback.verdict === "got_it") {
      await recordExplainItBackLearning(parsed.data.challengeId);
    }
  }
  return NextResponse.json({ ...result, ...(reviewRecorded !== undefined ? { reviewRecorded } : {}) }, { headers });
}
