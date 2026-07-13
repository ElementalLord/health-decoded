import { createClient } from "@/services/supabase/server";

/**
 * The only shared database gateway for feature service modules.
 * Keep React components and routes from creating Supabase clients directly.
 */
export async function getServerDatabaseClient() {
  return createClient();
}
