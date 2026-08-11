"use client";

import { WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

export function OfflineStatus() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const update = () => setOffline(!window.navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      aria-live="polite"
      className="border-b border-warning/35 bg-warning/10 px-5 py-2.5 text-warning-foreground"
      role="status"
    >
      <p className="mx-auto flex max-w-[1240px] items-start gap-2 text-sm leading-6">
        <WifiOff aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        <span>
          You’re offline. Some parts of Health Decoded may not update until you reconnect.
        </span>
      </p>
    </div>
  );
}
