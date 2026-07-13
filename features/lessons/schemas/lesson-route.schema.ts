import { z } from "zod";

export const lessonDaySchema = z.coerce.number().int().min(1).max(90);
