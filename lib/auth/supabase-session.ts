type SessionCookie = Readonly<{ name: string }>;

type SessionCheckError =
  | Readonly<{ status?: number | null | undefined }>
  | null
  | undefined;

const supabaseAuthSessionCookie = /^sb-[a-z0-9]+-auth-token(?:\.\d+)?$/i;

/**
 * Supabase SSR stores an access/refresh session in one or more cookies named
 * `sb-<project-ref>-auth-token[.chunk]`. A PKCE verifier is deliberately not a
 * session cookie and must not authorize a protected server request.
 */
export function hasSupabaseAuthSessionCookie(cookies: readonly SessionCookie[]) {
  return cookies.some((cookie) => supabaseAuthSessionCookie.test(cookie.name));
}

/**
 * A request without a session cookie is unauthenticated without needing a
 * network call. Once a session cookie is present, only explicit authorization
 * responses are treated as signed-out; transport and unexpected responses
 * remain availability failures.
 */
export function isUnauthenticatedSessionCheck(
  hasSessionCookie: boolean,
  error: SessionCheckError,
) {
  return !hasSessionCookie || !error || error.status === 401 || error.status === 403;
}
