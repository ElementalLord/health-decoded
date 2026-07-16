"use client";

import Link from "next/link";
import { useActionState } from "react";

import { PageHeader } from "@/components/shared/page-header";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  updateSettingsAction,
  type ProfileActionState,
} from "@/features/profile/actions/profile-settings.actions";
import type { ProfileSettings } from "@/features/profile/types/profile-settings";
import { cn } from "@/lib/utils";

const initialState: ProfileActionState = { status: "idle", message: "" };

export function SettingsContent({ data }: { data: ProfileSettings }) {
  const [state, action, pending] = useActionState(updateSettingsAction, initialState);
  const hasError = state.status === "error";
  const messageId = "settings-form-message";

  return (
    <section className="mx-auto max-w-4xl space-y-12 py-6 sm:py-10">
      <PageHeader
        description="Choose reading and motion preferences that feel comfortable."
        eyebrow="Make the experience yours"
        title="Settings"
      />

      <section aria-labelledby="accessibility-language" className="space-y-5">
        <h2
          className="font-serif-display text-[length:var(--text-section-title)] font-medium tracking-tight"
          id="accessibility-language"
        >
          Accessibility and language
        </h2>

        <form action={action} className="max-w-2xl">
          <input name="reducedMotion" type="hidden" value="false" />
          <input name="locale" type="hidden" value="en" />

          <div className="space-y-3">
            <label className="flex min-h-16 cursor-pointer items-center justify-between gap-4 rounded-[9px] border border-border bg-card px-5 py-4 shadow-[0_2px_0_rgb(61_47_41/0.08)]">
              <span className="font-medium">Reduce motion</span>
              <input
                className="size-5 shrink-0 accent-primary"
                defaultChecked={data.reducedMotion}
                name="reducedMotion"
                type="checkbox"
                value="true"
              />
            </label>

            <label
              className="grid gap-2 rounded-[9px] border border-border bg-card px-5 py-4 text-sm font-medium shadow-[0_2px_0_rgb(61_47_41/0.08)]"
              htmlFor="preferred-text-scale"
            >
              Text size
              <Select
                aria-describedby={state.message ? messageId : undefined}
                aria-invalid={hasError || undefined}
                defaultValue={data.preferredTextScale}
                id="preferred-text-scale"
                name="preferredTextScale"
              >
                <option value="default">Standard</option>
                <option value="large">Large</option>
                <option value="extra_large">Extra large</option>
              </Select>
            </label>

            <div className="grid gap-1 rounded-[9px] border border-border bg-card px-5 py-4 shadow-[0_2px_0_rgb(61_47_41/0.08)]">
              <p className="text-sm font-medium">Language</p>
              <p className="text-sm text-muted-foreground">English</p>
            </div>

            <label
              className="grid gap-2 rounded-[9px] border border-border bg-card px-5 py-4 text-sm font-medium shadow-[0_2px_0_rgb(61_47_41/0.08)]"
              htmlFor="preferred-timezone"
            >
              Timezone
              <Input
                aria-describedby={state.message ? messageId : undefined}
                aria-invalid={hasError || undefined}
                defaultValue={data.timezone}
                id="preferred-timezone"
                name="timezone"
                required
              />
            </label>
          </div>

          <div className="mt-5 space-y-3">
            <Button disabled={pending} fullWidth={false}>
              {pending ? "Saving…" : "Save settings"}
            </Button>
            {state.message ? (
              <p
                aria-live="polite"
                className={hasError ? "text-sm text-destructive" : "text-sm text-success"}
                id={messageId}
                role={hasError ? "alert" : "status"}
              >
                {state.message}
              </p>
            ) : null}
          </div>
        </form>
      </section>

      <Link
        className={cn(buttonVariants({ fullWidth: false, variant: "text" }), "min-h-11 px-0")}
        href="/profile"
      >
        Back to profile
      </Link>
    </section>
  );
}
