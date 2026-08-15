import type { JWK } from "@supabase/supabase-js";

/**
 * Process-level cache of the project's public JWT signing keys (JWKS).
 *
 * `auth.getClaims()` verifies asymmetric (ES256/RS256) tokens locally with
 * WebCrypto, but its own JWKS cache lives on the client instance. Middleware
 * builds a fresh client per request, so without a shared cache every request
 * would refetch `/.well-known/jwks.json` and simply trade the `auth/v1/user`
 * round trip for a JWKS round trip. Supplying these keys to `getClaims()`
 * removes the network call entirely on warm instances.
 *
 * Only public verification material is cached here; nothing user-specific.
 */

const JWKS_TTL_MS = 10 * 60 * 1000;

let cachedKeys: JWK[] | null = null;
let cachedAt = 0;
let inFlight: Promise<JWK[] | null> | null = null;

async function fetchSigningKeys(projectUrl: string, publishableKey: string) {
  const response = await fetch(`${projectUrl}/auth/v1/.well-known/jwks.json`, {
    headers: { apikey: publishableKey },
  });
  if (!response.ok) return null;

  const body: unknown = await response.json();
  const keys =
    typeof body === "object" && body !== null && "keys" in body
      ? (body as { keys?: unknown }).keys
      : undefined;
  return Array.isArray(keys) && keys.length > 0 ? (keys as JWK[]) : null;
}

/**
 * Returns the cached JWKS for `getClaims()`, refreshing it past the TTL.
 *
 * Returns `undefined` when the key set is unavailable so the caller can pass it
 * straight through to `getClaims()`, which then falls back to its own JWKS
 * fetch (and to `getUser()` for symmetric keys). The fallback is slower but
 * never less strict, so a discovery failure degrades latency, not verification.
 */
export async function getCachedSigningKeys(
  projectUrl: string,
  publishableKey: string,
): Promise<{ keys: JWK[] } | undefined> {
  if (cachedKeys && Date.now() - cachedAt < JWKS_TTL_MS) return { keys: cachedKeys };

  inFlight ??= fetchSigningKeys(projectUrl, publishableKey)
    .catch(() => null)
    .finally(() => {
      inFlight = null;
    });

  const keys = await inFlight;
  if (!keys) return cachedKeys ? { keys: cachedKeys } : undefined;

  cachedKeys = keys;
  cachedAt = Date.now();
  return { keys };
}
