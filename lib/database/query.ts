import type { PostgrestError } from "@supabase/supabase-js";

import {
  conflictError,
  notFoundError,
  unexpectedError,
} from "@/lib/errors/application-error";
import { err, ok, type Result } from "@/lib/result/result";

type QueryResponse<T> = {
  data: T | null;
  error: PostgrestError | null;
};

function mapPostgrestError(error: PostgrestError) {
  if (error.code === "PGRST116") {
    return notFoundError();
  }

  if (error.code === "23505") {
    return conflictError();
  }

  return unexpectedError();
}

export function toResult<T>(response: QueryResponse<T>): Result<T> {
  if (response.error) {
    return err(mapPostgrestError(response.error));
  }

  if (response.data === null) {
    return err(notFoundError());
  }

  return ok(response.data);
}
