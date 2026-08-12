import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";

import {
  hasSupabaseAuthSessionCookie,
  isUnauthenticatedSessionCheck,
} from "@/lib/auth/supabase-session";
import { authorizationError, unexpectedError } from "@/lib/errors/application-error";
import { getServerDatabaseClient } from "@/lib/database/server";
import { err, ok } from "@/lib/result/result";
import { createServerLogger } from "@/lib/logging/server";

const logger = createServerLogger();

export const getAuthenticatedUser = cache(async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const hasSessionCookie = hasSupabaseAuthSessionCookie(cookieStore.getAll());
  if (!hasSessionCookie) return err(authorizationError());

  const response = await (async () => {
    try {
      const database = await getServerDatabaseClient();
      return await database.auth.getUser();
    } catch {
      logger.error("auth.session_check_rejected");
      return null;
    }
  })();
  if (!response) return err(unexpectedError());
  const { data, error } = response;

  if (data.user) return ok(data.user);
  if (!error || isUnauthenticatedSessionCheck(hasSessionCookie, error)) {
    return err(authorizationError());
  }

  logger.error("auth.session_check_unavailable", {
    error_code: error.code ?? "unknown",
    status: error.status,
  });
  return err(unexpectedError());
});
