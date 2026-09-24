import "server-only";

import type { CaregiverModuleId } from "@/features/caregiver/content/caregiver-ids";
import { getAuthenticatedUser } from "@/features/auth/services/auth.server";
import { getServerDatabaseClient } from "@/lib/database/server";
import { unexpectedError } from "@/lib/errors/application-error";
import { err, ok, type Result } from "@/lib/result/result";

export type CaregiverMilestoneGates = {
  readonly centralIdeaReached: boolean;
  readonly coreApplicationCompleted: boolean;
  readonly takeawayViewed: boolean;
};

export async function getCaregiverMilestoneGates(
  moduleId: CaregiverModuleId,
): Promise<Result<CaregiverMilestoneGates>> {
  const user = await getAuthenticatedUser();
  if (!user.ok) return err(user.error);

  const database = await getServerDatabaseClient();
  const response = await database
    .from("user_caregiver_module_progress")
    .select("central_idea_reached, core_application_completed, takeaway_viewed")
    .eq("user_id", user.data.id)
    .eq("module_id", moduleId)
    .maybeSingle();

  if (response.error) return err(unexpectedError());

  return ok({
    centralIdeaReached: response.data?.central_idea_reached ?? false,
    coreApplicationCompleted: response.data?.core_application_completed ?? false,
    takeawayViewed: response.data?.takeaway_viewed ?? false,
  });
}
