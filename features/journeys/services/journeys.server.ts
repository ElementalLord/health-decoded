import { type Journey } from "@/lib/database/models";
import { normalizePagination, type PaginationInput } from "@/lib/database/pagination";
import { toResult } from "@/lib/database/query";
import { getServerDatabaseClient } from "@/lib/database/server";
import type { Result } from "@/lib/result/result";

export async function listPublishedJourneys(
  pagination?: PaginationInput,
): Promise<Result<Journey[]>> {
  const { from, to } = normalizePagination(pagination);
  const database = await getServerDatabaseClient();
  const response = await database
    .from("journeys")
    .select("id, slug, title, description, duration_days, version, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(from, to);

  return toResult(response as unknown as { data: Journey[] | null; error: null });
}
