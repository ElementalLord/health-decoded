const DEVELOPMENT_LESSON_IDS = new Set(["20000000-0000-0000-0000-000000000001"]);

export function isDevelopmentLesson(lessonId: string) {
  return DEVELOPMENT_LESSON_IDS.has(lessonId);
}
