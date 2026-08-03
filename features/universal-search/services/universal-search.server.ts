import "server-only";

import { unstable_noStore as noStore } from "next/cache";

import {
  adaptLessonSearchDocuments,
  type SearchableLessonRow,
} from "@/features/universal-search/adapters/lesson-search-adapter";
import { staticSearchDocuments } from "@/features/universal-search/content/search-sources";
import { searchHealthDecoded } from "@/features/universal-search/lib/search-health-decoded";
import { validateSearchDocuments } from "@/features/universal-search/lib/validate-search-documents";
import type {
  RankedSearchResult,
  UniversalSearchDocument,
} from "@/features/universal-search/types/universal-search";
import { getServerDatabaseClient } from "@/lib/database/server";

export async function buildUniversalSearchIndex(): Promise<UniversalSearchDocument[] | null> {
  noStore();
  const database = await getServerDatabaseClient();
  const response = await database
    .from("journey_lessons")
    .select(
      "day_number, status, lessons!inner(id, title, subtitle, primary_topic, learning_objective, status)",
    )
    .eq("status", "published")
    .eq("lessons.status", "published")
    .order("display_order", { ascending: true });
  if (response.error || !response.data) return null;
  const lessons = adaptLessonSearchDocuments(response.data as SearchableLessonRow[]);
  const documents = [...staticSearchDocuments, ...lessons];
  return validateSearchDocuments(documents) ? documents : null;
}

export async function searchUniversalIndex(query: string): Promise<RankedSearchResult[] | null> {
  const documents = await buildUniversalSearchIndex();
  return documents ? searchHealthDecoded(documents, query) : null;
}
