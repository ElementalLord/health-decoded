import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createServerClient } from "@supabase/ssr";

/**
 * Middleware verifies the session by checking the access token's signature
 * against the project's public JWKS instead of calling the Auth server. These
 * tests pin both halves of that contract: the latency win (a valid session
 * costs zero network calls) and, more importantly, that local verification
 * rejects everything the remote check used to reject.
 *
 * A throwaway ES256 key pair stands in for the project's signing key, so no
 * credentials or network access are needed.
 */

const PROJECT_REF = "testref";
const URL_BASE = `https://${PROJECT_REF}.supabase.co`;
const PUBLISHABLE_KEY = "sb_publishable_aaaaaaaaaaaaaaaaaaaaaaaa";
const COOKIE_NAME = `sb-${PROJECT_REF}-auth-token`;
const KID = "signing-key-1";
const ACCOUNT_A = "00000000-0000-4000-8000-00000000000a";
const ACCOUNT_B = "00000000-0000-4000-8000-00000000000b";

const b64url = (value) => Buffer.from(value).toString("base64url");
const nowSeconds = () => Math.floor(Date.now() / 1000);

const signingPair = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, [
  "sign",
  "verify",
]);
const publicJwk = await crypto.subtle.exportKey("jwk", signingPair.publicKey);
const jwks = {
  keys: [{ ...publicJwk, kid: KID, alg: "ES256", use: "sig", key_ops: ["verify"] }],
};

async function signToken(payload, privateKey = signingPair.privateKey, header) {
  const encodedHeader = b64url(JSON.stringify(header ?? { alg: "ES256", typ: "JWT", kid: KID }));
  const encodedPayload = b64url(JSON.stringify(payload));
  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    privateKey,
    new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`),
  );
  return `${encodedHeader}.${encodedPayload}.${b64url(new Uint8Array(signature))}`;
}

function claimsFor(sub, { expiresIn = 3600 } = {}) {
  const issued = nowSeconds();
  return {
    sub,
    aud: "authenticated",
    role: "authenticated",
    iss: `${URL_BASE}/auth/v1`,
    iat: issued,
    exp: issued + expiresIn,
  };
}

function sessionCookie(accessToken, expiresAt = nowSeconds() + 3600) {
  return `base64-${b64url(
    JSON.stringify({
      access_token: accessToken,
      refresh_token: "refresh-token",
      expires_at: expiresAt,
      expires_in: expiresAt - nowSeconds(),
      token_type: "bearer",
      user: { id: ACCOUNT_A, aud: "authenticated", role: "authenticated" },
    }),
  )}`;
}

/** Builds a client whose outbound calls are recorded rather than sent. */
function createRecordingClient(cookies, { refreshSucceeds = false } = {}) {
  const calls = [];
  const client = createServerClient(URL_BASE, PUBLISHABLE_KEY, {
    cookies: { getAll: () => cookies, setAll: () => {} },
    global: {
      fetch: async (input) => {
        const url = typeof input === "string" ? input : input.url;
        calls.push(url.replace(URL_BASE, ""));
        if (url.includes("grant_type=refresh_token") && !refreshSucceeds) {
          return new Response(JSON.stringify({ error: "invalid_grant" }), { status: 400 });
        }
        if (url.includes("jwks.json")) {
          return new Response(JSON.stringify(jwks), { status: 200 });
        }
        return new Response(JSON.stringify({ id: ACCOUNT_A }), { status: 200 });
      },
    },
  });
  return { client, calls };
}

/** Mirrors the predicate in services/supabase/middleware.ts. */
const isAuthenticated = (data) => Boolean(data?.claims.sub);

async function verify(cookies, options) {
  const { client, calls } = createRecordingClient(cookies, options);
  const { data } = await client.auth.getClaims(undefined, { jwks });
  return { authenticated: isAuthenticated(data), calls };
}

const cookieFor = async (sub, options) => [
  { name: COOKIE_NAME, value: sessionCookie(await signToken(claimsFor(sub, options))) },
];

test("middleware keeps using the verified-claims predicate", async () => {
  // The helper above replicates the middleware predicate, so fail loudly if the
  // middleware stops deriving identity from verified claims.
  const middleware = await readFile(
    new URL("../services/supabase/middleware.ts", import.meta.url),
    "utf8",
  );
  assert.match(middleware, /getClaims\(/);
  assert.match(middleware, /!data\?\.claims\.sub/);
  assert.doesNotMatch(middleware, /auth\.getUser\(\)/);
});

test("public pages bypass session middleware so static output stays CDN-cacheable", async () => {
  const [entrypoint, middleware] = await Promise.all([
    readFile(new URL("../middleware.ts", import.meta.url), "utf8"),
    readFile(new URL("../services/supabase/middleware.ts", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(entrypoint, /\/\(\(\?!_next\/static/);
  assert.doesNotMatch(entrypoint, /["']\/:path\*["']/);
  assert.match(entrypoint, /"\/signup"/);
  assert.match(entrypoint, /"\/journey\/:path\*"/);
  assert.match(middleware, /if \(!protectedRoute && !sessionAwareAuthRoutePaths\.has/);
});

test("a valid ES256 session verifies locally with no network call", async () => {
  const { authenticated, calls } = await verify(await cookieFor(ACCOUNT_A));
  assert.equal(authenticated, true);
  assert.deepEqual(calls, []);
});

test("an expired access token is rejected when refresh fails", async () => {
  const cookies = await cookieFor(ACCOUNT_A, { expiresIn: -3600 });
  const { authenticated } = await verify(cookies);
  assert.equal(authenticated, false);
});

test("a token carrying another account's subject is rejected", async () => {
  // Account B's `sub` spliced onto Account A's genuine signature.
  const authentic = await signToken(claimsFor(ACCOUNT_A));
  const [header, , signature] = authentic.split(".");
  const forged = [header, b64url(JSON.stringify(claimsFor(ACCOUNT_B))), signature].join(".");
  const { authenticated, calls } = await verify([
    { name: COOKIE_NAME, value: sessionCookie(forged) },
  ]);
  assert.equal(authenticated, false, "a swapped subject must not authenticate");
  assert.deepEqual(calls, [], "rejection must not depend on a network round trip");
});

test("a token signed by a key outside the JWKS is rejected", async () => {
  const foreignPair = await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"],
  );
  const foreign = await signToken(claimsFor(ACCOUNT_A), foreignPair.privateKey);
  const { authenticated } = await verify([{ name: COOKIE_NAME, value: sessionCookie(foreign) }]);
  assert.equal(authenticated, false);
});

test("malformed and garbage session cookies are unauthenticated", async () => {
  const malformed = await verify([{ name: COOKIE_NAME, value: sessionCookie("not.a.jwt") }]);
  assert.equal(malformed.authenticated, false);

  const garbage = await verify([{ name: COOKIE_NAME, value: "base64-bm90LWpzb24=" }]);
  assert.equal(garbage.authenticated, false);
});

test("an absent session cookie is unauthenticated without a network call", async () => {
  const { authenticated, calls } = await verify([]);
  assert.equal(authenticated, false);
  assert.deepEqual(calls, []);
});

test("a symmetric HS256 token is still verified against the Auth server", async () => {
  // If the project ever reverts to symmetric signing, getClaims must fall back
  // to the remote check rather than trusting an unverifiable token.
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = b64url(JSON.stringify(claimsFor(ACCOUNT_A)));
  const token = `${header}.${payload}.${b64url("fake-symmetric-signature")}`;
  const { client, calls } = createRecordingClient([
    { name: COOKIE_NAME, value: sessionCookie(token) },
  ]);
  await client.auth.getClaims(undefined, { jwks });
  assert.ok(
    calls.some((call) => call.includes("/auth/v1/user")),
    "symmetric tokens must be verified remotely",
  );
});

test("without cached keys verification stays remote rather than trusting the token", async () => {
  const { client, calls } = createRecordingClient(await cookieFor(ACCOUNT_A));
  const { data } = await client.auth.getClaims();
  assert.equal(isAuthenticated(data), true);
  assert.ok(
    calls.some((call) => call.includes("jwks.json")),
    "a cold key set must be fetched, not skipped",
  );
});

test("cached signing keys are reused across requests and cold-start stampedes", async () => {
  const realFetch = globalThis.fetch;
  let jwksFetches = 0;
  globalThis.fetch = async () => {
    jwksFetches += 1;
    return new Response(JSON.stringify(jwks), { status: 200 });
  };

  try {
    const sequential = await import(`../services/supabase/signing-keys.ts?case=sequential`);
    for (let i = 0; i < 5; i += 1) {
      const keys = await sequential.getCachedSigningKeys(URL_BASE, PUBLISHABLE_KEY);
      assert.equal(keys?.keys.length, 1);
    }
    assert.equal(jwksFetches, 1, "repeat requests must reuse the cached key set");

    jwksFetches = 0;
    const concurrent = await import(`../services/supabase/signing-keys.ts?case=concurrent`);
    const results = await Promise.all(
      Array.from({ length: 8 }, () => concurrent.getCachedSigningKeys(URL_BASE, PUBLISHABLE_KEY)),
    );
    assert.equal(jwksFetches, 1, "concurrent cold starts must not stampede the endpoint");
    assert.ok(results.every((entry) => entry?.keys.length === 1));
  } finally {
    globalThis.fetch = realFetch;
  }
});

test("signing key discovery failure degrades to remote verification", async () => {
  const realFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new TypeError("fetch failed");
  };

  try {
    const failing = await import(`../services/supabase/signing-keys.ts?case=discovery-failure`);
    const keys = await failing.getCachedSigningKeys(URL_BASE, PUBLISHABLE_KEY);
    // `undefined` makes getClaims fall back to its own JWKS fetch, then to the
    // Auth server. Slower, never less strict, and never a thrown request.
    assert.equal(keys, undefined);
  } finally {
    globalThis.fetch = realFetch;
  }
});

test("a non-ok discovery response is treated as unavailable", async () => {
  const realFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response("nope", { status: 503 });

  try {
    const failing = await import(`../services/supabase/signing-keys.ts?case=discovery-503`);
    assert.equal(await failing.getCachedSigningKeys(URL_BASE, PUBLISHABLE_KEY), undefined);
  } finally {
    globalThis.fetch = realFetch;
  }
});
