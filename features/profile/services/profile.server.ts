import { authorizationError } from "@/lib/errors/application-error";
import { type Profile } from "@/lib/database/models";
import { toResult } from "@/lib/database/query";
import { getServerDatabaseClient } from "@/lib/database/server";
import { err, type Result } from "@/lib/result/result";

export async function getCurrentProfile(): Promise<Result<Profile>> {
  const database = await getServerDatabaseClient();
  const { data: userData, error: userError } = await database.auth.getUser();

  if (userError || !userData.user) {
    return err(authorizationError());
  }

  const response = await database
    .from("profiles")
    .select("id, display_name, onboarding_completed_at")
    .eq("id", userData.user.id)
    .maybeSingle();

  return toResult(response as unknown as { data: Profile | null; error: null });
}
