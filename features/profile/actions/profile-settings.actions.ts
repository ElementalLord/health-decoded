"use server";
import { revalidatePath } from "next/cache";

import { getAuthenticatedUser } from "@/features/auth/services/auth.server";
import {
  profileUpdateSchema,
  settingsUpdateSchema,
} from "@/features/profile/schemas/profile-settings.schema";
import { getServerDatabaseClient } from "@/lib/database/server";

export type ProfileActionState = { message: string; status: "error" | "idle" | "success" };
export async function updateDisplayNameAction(
  _: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const parsed = profileUpdateSchema.safeParse({ displayName: formData.get("displayName") });
  if (!parsed.success)
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Check your display name.",
    };
  const user = await getAuthenticatedUser();
  if (!user.ok) return { status: "error", message: "Please sign in again." };
  const database = await getServerDatabaseClient();
  const result = await database
    .from("profiles")
    .update({ display_name: parsed.data.displayName })
    .eq("id", user.data.id);
  if (result.error)
    return { status: "error", message: "We couldn’t save your name. Please try again." };
  revalidatePath("/profile");
  revalidatePath("/journey");
  return { status: "success", message: "Your display name was saved." };
}
export async function updateSettingsAction(
  _: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const parsed = settingsUpdateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Check your settings." };
  const user = await getAuthenticatedUser();
  if (!user.ok) return { status: "error", message: "Please sign in again." };
  const database = await getServerDatabaseClient();
  const result = await database.from("user_settings").upsert({
    user_id: user.data.id,
    reduced_motion: parsed.data.reducedMotion,
    preferred_text_scale: parsed.data.preferredTextScale,
    locale: parsed.data.locale,
    timezone: parsed.data.timezone,
  });
  if (result.error)
    return { status: "error", message: "We couldn’t save your settings. Please try again." };
  revalidatePath("/", "layout");
  return { status: "success", message: "Your settings were saved." };
}
