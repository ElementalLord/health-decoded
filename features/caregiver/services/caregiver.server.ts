import "server-only";

import { unstable_noStore as noStore } from "next/cache";

import {
  mapCaregiverArticle,
  mapCaregiverArticles,
} from "@/features/caregiver/mappers/caregiver.mapper";
import type { CaregiverArticleViewModel } from "@/features/caregiver/types/caregiver";
import { getServerDatabaseClient } from "@/lib/database/server";
import { notFoundError, unexpectedError } from "@/lib/errors/application-error";
import { createServerLogger } from "@/lib/logging/server";
import { err, ok, type Result } from "@/lib/result/result";

const logger = createServerLogger();
const publicCaregiverFields =
  "id, slug, title, content_blocks, support_tip, what_not_to_say, conversation_prompt";

export async function listPublishedCaregiverContent(): Promise<
  Result<CaregiverArticleViewModel[]>
> {
  noStore();

  const database = await getServerDatabaseClient();
  const response = await database
    .from("caregiver_content")
    .select(publicCaregiverFields)
    .eq("status", "published")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });

  if (response.error) {
    logger.error("caregiver.list_unavailable");
    return err(unexpectedError());
  }

  const articles = mapCaregiverArticles((response.data ?? []) as unknown[]);
  if (!articles) {
    logger.error("caregiver.invalid_content");
    return err(unexpectedError());
  }

  return ok(articles);
}

export async function getPublishedCaregiverArticle(
  slug: string,
): Promise<Result<CaregiverArticleViewModel>> {
  noStore();

  const database = await getServerDatabaseClient();
  const response = await database
    .from("caregiver_content")
    .select(publicCaregiverFields)
    .eq("slug", slug)
    .eq("status", "published")
    .not("published_at", "is", null)
    .maybeSingle();

  if (response.error) {
    logger.error("caregiver.article_unavailable");
    return err(unexpectedError());
  }

  if (!response.data) return err(notFoundError());

  const article = mapCaregiverArticle(response.data);
  if (!article) {
    logger.error("caregiver.invalid_content");
    return err(unexpectedError());
  }

  return ok(article);
}
