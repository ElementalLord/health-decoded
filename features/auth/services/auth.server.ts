import "server-only";

import { cache } from "react";

import { authorizationError, unexpectedError } from "@/lib/errors/application-error";
import { getServerDatabaseClient } from "@/lib/database/server";
import { err, ok, type Result } from "@/lib/result/result";

export const getAuthenticatedUser = cache(async function getAuthenticatedUser() {
  const database = await getServerDatabaseClient();
  const { data, error } = await database.auth.getUser();

  return error || !data.user ? err(authorizationError()) : ok(data.user);
});

export async function signOut(): Promise<Result<true>> {
  const database = await getServerDatabaseClient();
  const { error } = await database.auth.signOut();

  return error ? err(unexpectedError()) : ok(true);
}
