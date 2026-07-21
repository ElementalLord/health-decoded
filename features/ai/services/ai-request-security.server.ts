import "server-only";

import { createHash, randomBytes } from "node:crypto";

import { AI_MAX_REQUEST_BYTES } from "@/features/ai/constants/ai-limits";

const globalSecurityState = globalThis as typeof globalThis & {
  healthDecodedAiNetworkSalt?: Buffer;
};

const networkSalt = globalSecurityState.healthDecodedAiNetworkSalt ?? randomBytes(32);
globalSecurityState.healthDecodedAiNetworkSalt = networkSalt;

function firstForwardedAddress(value: string | null) {
  return value?.split(",")[0]?.trim() || null;
}

/** Creates an ephemeral, non-logged network bucket key; the raw address is never retained. */
export function getAiNetworkBucketKey(request: Request) {
  const address =
    firstForwardedAddress(request.headers.get("x-forwarded-for")) ??
    request.headers.get("x-real-ip")?.trim() ??
    "unknown";

  return createHash("sha256").update(networkSalt).update(address).digest("hex");
}

export function hasTrustedAiRequestOrigin(request: Request) {
  const expectedOrigin = new URL(request.url).origin;
  const origin = request.headers.get("origin");
  if (origin && origin !== expectedOrigin) return false;

  const fetchSite = request.headers.get("sec-fetch-site");
  return !fetchSite || fetchSite === "same-origin" || fetchSite === "none";
}

export function hasJsonContentType(request: Request) {
  return request.headers.get("content-type")?.split(";", 1)[0]?.trim() === "application/json";
}

export type BoundedBodyResult =
  | { readonly ok: true; readonly body: string }
  | { readonly ok: false; readonly reason: "invalid" | "too_large" };

/** Reads a possibly chunked body without ever buffering more than the configured limit. */
export async function readBoundedAiRequestBody(
  request: Request,
  maximumBytes = AI_MAX_REQUEST_BYTES,
): Promise<BoundedBodyResult> {
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > maximumBytes) {
    return { ok: false, reason: "too_large" };
  }
  if (!request.body) return { ok: true, body: "" };

  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let bytesRead = 0;
  let body = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytesRead += value.byteLength;
      if (bytesRead > maximumBytes) {
        await reader.cancel();
        return { ok: false, reason: "too_large" };
      }
      body += decoder.decode(value, { stream: true });
    }
    body += decoder.decode();
    return { ok: true, body };
  } catch {
    return { ok: false, reason: "invalid" };
  }
}
