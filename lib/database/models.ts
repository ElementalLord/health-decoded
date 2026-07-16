import type { Database } from "@/types/database";

export type Profile = Pick<
  Database["public"]["Tables"]["profiles"]["Row"],
  "id" | "display_name" | "onboarding_completed_at"
>;
