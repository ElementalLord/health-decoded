import type { UniversalSearchDocument } from "@/features/universal-search/types/universal-search";

export type SearchableLessonRow = {
  day_number: number;
  status: string;
  lessons: {
    id: string;
    title: string;
    subtitle: string | null;
    primary_topic: string;
    learning_objective: string;
    status: string;
  };
};

export function adaptLessonSearchDocuments(
  rows: readonly SearchableLessonRow[],
): UniversalSearchDocument[] {
  return rows
    .filter(
      (row) =>
        row.status === "published" &&
        row.lessons.status === "published" &&
        Number.isInteger(row.day_number) &&
        row.day_number > 0,
    )
    .map((row) => ({
      id: `LESSON-${row.lessons.id}`,
      type: "lesson",
      title: row.lessons.title,
      description: row.lessons.subtitle ?? row.lessons.learning_objective,
      route: `/lessons/${row.day_number}`,
      keywords: [row.lessons.primary_topic],
      searchableText: row.lessons.learning_objective,
      sectionLabel: `Lesson ${row.day_number}`,
      priority: 2,
      status: "available",
    }));
}
