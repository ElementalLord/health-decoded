import { NextResponse } from "next/server";

import { emailOtpTypeSchema } from "@/features/auth/schemas/auth.schemas";
import { getSafeRedirectPath } from "@/lib/auth/redirects";
import { createServerLogger } from "@/lib/logging/server";
import { createClient } from "@/services/supabase/server";

const logger = createServerLogger();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const otpType = emailOtpTypeSchema.safeParse(url.searchParams.get("type"));
  const next = getSafeRedirectPath(url.searchParams.get("next"));

  const supabase = await createClient();
  const result = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : tokenHash && otpType.success
      ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type: otpType.data })
      : { error: new Error("Invalid confirmation parameters.") };

  if (result.error) {
    logger.error("auth.callback_failed", {
      flow: code ? "code" : tokenHash ? "token_hash" : "invalid_parameters",
    });
  }

  return NextResponse.redirect(new URL(result.error ? "/auth-error" : next, url.origin));
}
