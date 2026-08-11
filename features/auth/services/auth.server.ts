import "server-only";

import { cache } from "react";

import { authorizationError, unexpectedError } from "@/lib/errors/application-error";
import { getServerDatabaseClient } from "@/lib/database/server";
import { err, ok } from "@/lib/result/result";
import { createServerLogger } from "@/lib/logging/server";

const logger = createServerLogger();

export const getAuthenticatedUser = cache(async function getAuthenticatedUser() {
  const database = await getServerDatabaseClient();
  const { data, error } = await database.auth.getUser();

  if (data.user) return ok(data.user);
  if (!error || error.status === 401 || error.status === 403) return err(authorizationError());

  logger.error("auth.session_check_unavailable", {
    error_code: error.code ?? "unknown",
    status: error.status,
  });
  return err(unexpectedError());
});
