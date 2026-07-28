export type ProfileReflection = {
  createdAt: string;
  dayNumber: number;
  id: string;
  lessonTitle: string;
  reflection: string;
};

export type ProfileReflectionArchive = {
  entries: ProfileReflection[];
  total: number;
};
