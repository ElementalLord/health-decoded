"use client";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export function LegalBackButton() {
  function goBack() {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.assign("/");
  }

  return (
    <Button fullWidth={false} onClick={goBack} type="button" variant="secondary">
      <ArrowLeft aria-hidden="true" className="size-4" />
      Back to previous page
    </Button>
  );
}
