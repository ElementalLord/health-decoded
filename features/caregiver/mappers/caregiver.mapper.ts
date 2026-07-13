import {
  caregiverArticleSchema,
  type CaregiverArticle,
} from "@/features/caregiver/schemas/caregiver-content.schema";
import type { CaregiverArticleViewModel } from "@/features/caregiver/types/caregiver";

export function mapCaregiverArticle(value: unknown): CaregiverArticleViewModel | null {
  const parsed = caregiverArticleSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export function mapCaregiverArticles(value: unknown[]): CaregiverArticle[] | null {
  const articles = value.map(mapCaregiverArticle);
  return articles.every((article) => article !== null) ? articles : null;
}
