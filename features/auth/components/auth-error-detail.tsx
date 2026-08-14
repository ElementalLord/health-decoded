"use client";

import { useEffect, useState } from "react";

// Supabase reports link failures in the URL fragment, so only the browser can read them. Known
// codes are mapped to our own copy; the raw error_description is never rendered because anyone can
// craft a fragment and it would otherwise become attacker-controlled text on our page.
const REASON_BY_ERROR_CODE: Record<string, string> = {
  flow_state_expired:
    "This link was opened in a different browser or on a different device from the one that requested it. Open it in the same browser, or request a new link.",
  flow_state_not_found:
    "This link was opened in a different browser or on a different device from the one that requested it. Open it in the same browser, or request a new link.",
  otp_expired: "This link has expired. Links stay valid for one hour after they are sent.",
  validation_failed: "This link was missing information we needed. Please request a new one.",
};

const ACCESS_DENIED_REASON =
  "This link is no longer valid. It may already have been used, or a newer link may have replaced it.";

function readReason(hash: string): string | null {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const errorCode = params.get("error_code");
  const mappedReason = errorCode ? REASON_BY_ERROR_CODE[errorCode] : undefined;
  if (mappedReason) return mappedReason;

  return params.get("error") === "access_denied" ? ACCESS_DENIED_REASON : null;
}

export function AuthErrorDetail() {
  const [reason, setReason] = useState<string | null>(null);

  useEffect(() => {
    if (!window.location.hash) return;
    setReason(readReason(window.location.hash));
    // Drop the fragment so a refresh or a shared URL does not repeat a stale failure.
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }, []);

  if (!reason) return null;

  return (
    <p aria-live="polite" className="motion-status text-sm text-destructive" role="status">
      {reason}
    </p>
  );
}
