import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { CURRENT_PATH_HEADER } from "@/lib/auth/redirects";
import { getPublicEnv } from "@/lib/env/public";
import { getCachedSigningKeys } from "@/services/supabase/signing-keys";
import type { Database } from "@/types/database";

const protectedRoutePrefixes = [
  "/account",
  "/caregiver",
  "/journey",
  "/lessons",
  "/onboarding",
  "/profile",
  "/progress",
  "/resources",
  "/search",
  "/settings",
  "/stories",
] as const;

const publicRoutePaths = new Set(["/caregiver/urgent-help", "/caregiver/urgent-help/"]);
const sessionAwareAuthRoutePaths = new Set([
  "/login",
  "/reset-password",
  "/signup",
  "/verify-email",
]);

// Several protected page namespaces also contain public artwork (for example,
// `/resources/...jpg` and `/lessons/...jpg`). Those requests must reach Next's
// static-file handler directly. Redirecting one to `/login` also makes the
// `next/image` optimizer reject it, leaving the image's alt text on screen.
const publicImagePathPattern = /\.(?:apng|avif|gif|ico|jpe?g|png|svg|webp)$/i;

function isProtectedRoute(pathname: string) {
  if (publicImagePathPattern.test(pathname)) {
    return false;
  }

  if (publicRoutePaths.has(pathname)) {
    return false;
  }

  return protectedRoutePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function copyResponseCookies(source: NextResponse, destination: NextResponse) {
  source.cookies.getAll().forEach((cookie) => destination.cookies.set(cookie));
  return destination;
}

export async function refreshSession(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(CURRENT_PATH_HEADER, `${request.nextUrl.pathname}${request.nextUrl.search}`);
  const nextResponse = () => NextResponse.next({ request: { headers: requestHeaders } });
  let response = nextResponse();
  const protectedRoute = isProtectedRoute(request.nextUrl.pathname);

  if (!protectedRoute && !sessionAwareAuthRoutePaths.has(request.nextUrl.pathname)) {
    return response;
  }

  const env = getPublicEnv();
  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value }) => request.cookies.set(name, value));
          response = nextResponse();
          cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );
  // `getClaims()` reads the session (refreshing it when needed, which writes the
  // rotated cookies through `setAll` above) and then verifies the access token's
  // signature locally against the project's public JWKS. Passing the cached key
  // set keeps that verification network-free; if the keys are unavailable, or the
  // project ever falls back to symmetric signing, `getClaims()` verifies against
  // the Auth server exactly as `getUser()` did.
  const signingKeys = await getCachedSigningKeys(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
  const { data } = await supabase.auth.getClaims(
    undefined,
    signingKeys ? { jwks: signingKeys } : {},
  );

  if (!data?.claims.sub && protectedRoute) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    loginUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return copyResponseCookies(response, NextResponse.redirect(loginUrl));
  }

  return response;
}
