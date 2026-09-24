import { NextResponse } from "next/server";

import { emailOtpTypeSchema } from "@/features/auth/schemas/auth.schemas";
import {
  PASSWORD_RECOVERY_SESSION_COOKIE,
  PASSWORD_RECOVERY_SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth/password-recovery";
import { getSafeRedirectPath, RESET_PASSWORD_PATH } from "@/lib/auth/redirects";
import { createServerLogger } from "@/lib/logging/server";
import { createClient } from "@/services/supabase/server";

const logger = createServerLogger();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const otpType = emailOtpTypeSchema.safeParse(url.searchParams.get("type"));
  const next = getSafeRedirectPath(url.searchParams.get("next"));
  const isRecovery =
    (otpType.success && otpType.data === "recovery") || next === RESET_PASSWORD_PATH;

  const supabase = await createClient();
  const result = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : tokenHash && otpType.success
      ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type: otpType.data })
      : { error: new Error("Invalid confirmation parameters.") };

  if (!result.error) {
    if (isRecovery) {
      const response = NextResponse.redirect(new URL(next, url.origin));
      response.cookies.set({
        name: PASSWORD_RECOVERY_SESSION_COOKIE,
        value: "active",
        httpOnly: true,
        maxAge: PASSWORD_RECOVERY_SESSION_MAX_AGE_SECONDS,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
      return response;
    }

    // Confirming an email creates a Supabase session. End that temporary session so account
    // verification cannot also bypass the explicit sign-in step that starts onboarding.
    const signOutResult = await supabase.auth.signOut({ scope: "local" });
    if (signOutResult.error) {
      logger.error("auth.verification_signout_failed", {
        error_code: signOutResult.error.code ?? "unknown",
        status: signOutResult.error.status,
      });
    }

    return NextResponse.redirect(new URL("/login?emailVerified=1", url.origin));
  }

  logger.error("auth.callback_failed", {
    flow: code ? "code" : tokenHash ? "token_hash" : "invalid_parameters",
  });

  // Supabase reports link failures in the URL fragment, which never reaches the server. Carry the
  // originating flow forward so the error page can offer the matching "request a new link" route.
  const errorUrl = new URL("/auth-error", url.origin);
  errorUrl.searchParams.set("flow", isRecovery ? "recovery" : "verification");

  return NextResponse.redirect(errorUrl);
}
