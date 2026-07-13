import { NextResponse } from "next/server";

import { getSafeRedirectPath } from "@/lib/auth/redirects";
import { createClient } from "@/services/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = getSafeRedirectPath(url.searchParams.get("next"));

  if (!code) return NextResponse.redirect(new URL("/auth-error", url.origin));

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  return NextResponse.redirect(new URL(error ? "/auth-error" : next, url.origin));
}
