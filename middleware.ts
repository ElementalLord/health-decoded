import type { NextRequest } from "next/server";

import { refreshSession } from "@/services/supabase/middleware";

// Refresh Supabase cookies only where session state can change the response. Keeping marketing,
// legal, and other public routes out of middleware lets Vercel serve their static output directly
// from the CDN without running an unnecessary auth check first.
export async function middleware(request: NextRequest) {
  return refreshSession(request);
}

export const config = {
  matcher: [
    "/account/:path*",
    "/appointment-prep/:path*",
    "/caregiver/:path*",
    "/decode-the-label/:path*",
    "/explain-it-back/:path*",
    "/glossary/:path*",
    "/journey/:path*",
    "/lessons/:path*",
    "/milestones/:path*",
    "/myth-check/:path*",
    "/onboarding/:path*",
    "/profile/:path*",
    "/progress/:path*",
    "/resources/:path*",
    "/search/:path*",
    "/settings/:path*",
    "/stories/:path*",
    "/forgot-password",
    "/login",
    "/reset-password",
    "/signup",
    "/verify-email",
  ],
};
