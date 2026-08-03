"use server";

import { revalidatePath } from "next/cache";

import { getAuthenticatedUser } from "@/features/auth/services/auth.server";
import { getServerDatabaseClient } from "@/lib/database/server";

const allowedRuleId =
  /^(continue|start)-lesson-([1-9]|1[0-4])$|^(myth-check|appointment-prep|trusted-resource|medical-glossary)$/;

export async function dismissNextStepAction(ruleId: string) {
  if (!allowedRuleId.test(ruleId)) return { ok: false as const };
  const user = await getAuthenticatedUser();
  if (!user.ok) return { ok: false as const };
  const database = await getServerDatabaseClient();
  const response = await database.rpc("dismiss_next_step", { p_rule_id: ruleId });
  if (response.error) return { ok: false as const };
  revalidatePath("/journey");
  return { ok: true as const };
}
