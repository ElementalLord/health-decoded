"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Mail clients decide for themselves which tab a confirmation link opens, so the tab someone
// started in is usually left behind on a waiting screen while the new one signs them in. The auth
// cookie is shared across tabs on this origin, so re-rendering the server component is enough for
// the stranded tab to notice and move on.
//
// Returning focus to the tab is the signal that matters, and it costs nothing to listen for. The
// poll only exists for side-by-side windows where the tab never regains focus, so it runs slowly
// and gives up rather than pinging the server forever on a tab left open all day.
const POLL_INTERVAL_MS = 5_000;
const POLL_LIMIT_MS = 10 * 60_000;

export function SessionWatcher() {
  const router = useRouter();

  useEffect(() => {
    const refreshIfVisible = () => {
      if (document.visibilityState === "visible") router.refresh();
    };

    const interval = window.setInterval(refreshIfVisible, POLL_INTERVAL_MS);
    const stopPolling = window.setTimeout(() => window.clearInterval(interval), POLL_LIMIT_MS);
    window.addEventListener("focus", refreshIfVisible);
    document.addEventListener("visibilitychange", refreshIfVisible);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(stopPolling);
      window.removeEventListener("focus", refreshIfVisible);
      document.removeEventListener("visibilitychange", refreshIfVisible);
    };
  }, [router]);

  return null;
}
