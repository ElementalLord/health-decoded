import { type Medication } from "@/lib/database/models";
import { normalizePagination, type PaginationInput } from "@/lib/database/pagination";
import { toResult } from "@/lib/database/query";
import { getServerDatabaseClient } from "@/lib/database/server";
import type { Result } from "@/lib/result/result";

export async function listPublishedMedications(
  pagination?: PaginationInput,
): Promise<Result<Medication[]>> {
  const { from, to } = normalizePagination(pagination);
  const database = await getServerDatabaseClient();
  const response = await database
    .from("medications")
    .select("id, slug, generic_name, brand_names, category, content_blocks")
    .eq("status", "published")
    .order("generic_name", { ascending: true })
    .range(from, to);

  return toResult(response as unknown as { data: Medication[] | null; error: null });
}
