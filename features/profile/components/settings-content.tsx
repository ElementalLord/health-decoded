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

const initialState: ProfileActionState = { status: "idle", message: "" };

export function SettingsContent({ data }: { data: ProfileSettings }) {
  const [state, action, pending] = useActionState(updateSettingsAction, initialState);
  const hasError = state.status === "error";
  const messageId = "settings-form-message";

  return (
    <section className="mx-auto max-w-3xl space-y-10 py-6 sm:py-10">
      <PageHeader
        description="Choose reading and motion preferences that feel comfortable."
        title="Settings"
      />

      <section aria-labelledby="accessibility-language" className="space-y-5">
        <h2
          className="text-[length:var(--text-section-title)] font-medium"
          id="accessibility-language"
        >
          Accessibility and language
        </h2>

        <form action={action} className="max-w-xl space-y-5">
          <input name="reducedMotion" type="hidden" value="false" />
          <input name="locale" type="hidden" value="en" />

          <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-border px-3 py-2">
            <input
              className="size-5 shrink-0 accent-primary"
              defaultChecked={data.reducedMotion}
              name="reducedMotion"
              type="checkbox"
              value="true"
            />
            <span>Reduce motion</span>
          </label>

          <label className="grid gap-2 text-sm font-medium" htmlFor="preferred-text-scale">
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

          <label className="grid gap-2 text-sm font-medium" htmlFor="preferred-language">
            Language
            <Select defaultValue={data.locale} disabled id="preferred-language">
              <option value="en">English</option>
            </Select>
          </label>

          <label className="grid gap-2 text-sm font-medium" htmlFor="preferred-timezone">
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
        </form>
      </section>

      <Link className={buttonVariants({ fullWidth: false, variant: "text" })} href="/profile">
        Back to profile
      </Link>
    </section>
  );
}
