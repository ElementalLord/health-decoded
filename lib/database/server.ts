import { cache } from "react";

import { createClient } from "@/services/supabase/server";

/**
 * The only shared database gateway for feature service modules.
 * Keep React components and routes from creating Supabase clients directly.
 */
export const getServerDatabaseClient = cache(async function getServerDatabaseClient() {
  return createClient();
});
