import "server-only";

import { cache } from "react";

import { getAuthenticatedUser } from "@/features/auth/services/auth.server";
import { authorizationError } from "@/lib/errors/application-error";
import { type Profile } from "@/lib/database/models";
import { toResult } from "@/lib/database/query";
import { getServerDatabaseClient } from "@/lib/database/server";
import { createServerLogger } from "@/lib/logging/server";
import { err, type Result } from "@/lib/result/result";

const logger = createServerLogger();

export const getCurrentProfile = cache(async function getCurrentProfile(): Promise<
  Result<Profile>
> {
  const user = await getAuthenticatedUser();
  if (!user.ok) return err(authorizationError());

  const database = await getServerDatabaseClient();
  const response = await database
    .from("profiles")
    .select("id, display_name, onboarding_completed_at")
    .eq("id", user.data.id)
    .maybeSingle();

  if (response.error) {
    logger.error("profile.load_failed", { error_code: response.error.code });
  } else if (!response.data) {
    logger.error("profile.missing_for_authenticated_user");
  }

  return toResult(response);
});
