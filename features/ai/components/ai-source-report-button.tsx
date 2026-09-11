"use client";

import { useId, useState } from "react";

import { Button } from "@/components/ui/button";

/**
 * Client-only preview control. It intentionally performs no network request,
 * persistence, analytics, or logging until a reviewed reporting service exists.
 */
export function AiSourceReportButton({ sourceTitle }: { readonly sourceTitle: string }) {
  const confirmationId = useId();
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="mt-2">
      <Button
        aria-describedby={submitted ? confirmationId : undefined}
        aria-label={`Report ${sourceTitle} as an untrustworthy source`}
        aria-pressed={submitted}
        className="min-h-9 rounded-full border-border bg-transparent px-3 py-1.5 text-xs shadow-none hover:translate-y-0 hover:bg-muted hover:shadow-none"
        disabled={submitted}
        fullWidth={false}
        onClick={() => setSubmitted(true)}
        size="sm"
        type="button"
        variant="secondary"
      >
        {submitted ? "Reported" : "Report source"}
      </Button>
      {submitted ? (
        <p
          aria-live="polite"
          className="mt-2 text-xs leading-5 text-success"
          id={confirmationId}
          role="status"
        >
          Thanks—your report was submitted.
        </p>
      ) : null}
    </div>
  );
}
